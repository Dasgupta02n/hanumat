#!/usr/bin/env node
/**
 * CI / local content validator for Hanumat.
 * Usage: node scripts/validate-content.mjs
 *
 * Design-CI checks (T12):
 *  - Chalisa offline pack: sha256 + bytes required; role set complete
 *  - No duplicate verse ids within a text
 */
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { z } from "zod";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const TEXTS = path.join(ROOT, "content", "texts");
const PACKS = path.join(ROOT, "content", "packs");
const PUBLIC = path.join(ROOT, "apps", "web", "public");

const LocaleTitle = z.object({ hi: z.string().min(1), en: z.string().min(1) });
const MetaSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  title: LocaleTitle,
  category: z.string(),
  edition: z.object({ pin: z.string().min(1) }).passthrough(),
  flags: z.record(z.any()).optional(),
  wave: z.number().optional(),
}).passthrough();

const StructureSchema = z.object({
  sections: z
    .array(
      z.object({
        id: z.string(),
        kind: z.string(),
        title: LocaleTitle,
        verseIds: z.array(z.string()),
        order: z.number(),
      }),
    )
    .min(1),
});

/** Roles required on the Chalisa offline pack (design CI / T12). */
const CHALISA_PACK_REQUIRED_ROLES = new Set([
  "meta",
  "verses",
  "translation",
  "transliteration",
  "structure",
]);

const WAVE0 = new Set(["hanuman-chalisa", "sundar-kand-manas"]);
let errors = 0;
const ids = new Set();
const slugs = new Set();

function fail(msg) {
  console.error("ERROR:", msg);
  errors++;
}

function warn(msg) {
  console.warn("WARN:", msg);
}

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function sha256File(abs) {
  const buf = fs.readFileSync(abs);
  return createHash("sha256").update(buf).digest("hex");
}

/**
 * Ban duplicate verse ids: object keys vs body.id, and structure.verseIds.
 */
function checkDuplicateVerseIds(metaId, verses, structure) {
  const seenBodyIds = new Map();
  for (const [key, verse] of Object.entries(verses)) {
    if (!verse || typeof verse !== "object") continue;
    const bodyId = verse.id;
    if (bodyId != null && bodyId !== key) {
      fail(`${metaId}: verse key "${key}" does not match body id "${bodyId}"`);
    }
    const id = bodyId ?? key;
    if (seenBodyIds.has(id)) {
      fail(
        `${metaId}: duplicate verse id "${id}" (keys ${seenBodyIds.get(id)} and ${key})`,
      );
    } else {
      seenBodyIds.set(id, key);
    }
  }

  const seenStruct = new Set();
  for (const s of structure.sections) {
    for (const vid of s.verseIds) {
      if (seenStruct.has(vid)) {
        fail(`${metaId}: duplicate verse id "${vid}" in structure.verseIds`);
      }
      seenStruct.add(vid);
    }
  }
}

const dirs = fs
  .readdirSync(TEXTS, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

for (const dir of dirs) {
  const base = path.join(TEXTS, dir);
  const metaPath = path.join(base, "meta.json");
  if (!fs.existsSync(metaPath)) {
    fail(`${dir}: missing meta.json`);
    continue;
  }
  let meta;
  try {
    meta = MetaSchema.parse(readJson(metaPath));
  } catch (e) {
    fail(`${dir}: meta invalid — ${e.message}`);
    continue;
  }
  if (ids.has(meta.id)) fail(`duplicate text id: ${meta.id}`);
  ids.add(meta.id);
  if (slugs.has(meta.slug)) fail(`duplicate slug: ${meta.slug}`);
  slugs.add(meta.slug);

  const structure = StructureSchema.parse(readJson(path.join(base, "structure.json")));
  const verses = readJson(path.join(base, "verses.json"));
  const hi = readJson(path.join(base, "translations", "hi.json"));
  const en = readJson(path.join(base, "translations", "en.json"));
  const iast = readJson(path.join(base, "transliteration", "iast.json"));

  checkDuplicateVerseIds(meta.id, verses, structure);

  const verseIds = new Set();
  for (const s of structure.sections) {
    for (const vid of s.verseIds) {
      if (!verses[vid]) fail(`${meta.id}: structure refs missing verse ${vid}`);
      verseIds.add(vid);
    }
  }
  for (const vid of Object.keys(verses)) {
    if (!verseIds.has(vid)) warn(`${meta.id}: verse ${vid} not in structure`);
    if (!hi[vid]) fail(`${meta.id}: missing hi meaning for ${vid}`);
    if (!en[vid]) fail(`${meta.id}: missing en meaning for ${vid}`);
    if (!iast[vid]) fail(`${meta.id}: missing iast for ${vid}`);
  }

  if (WAVE0.has(meta.id) && !structure.sections.length) {
    fail(`${meta.id}: Wave 0 requires at least one section`);
  }
}

// Packs (single manifest or { packs: [...] })
function checkPack(pack, label) {
  if (!pack.id || !pack.assets?.length) {
    fail(`pack ${label}: missing id or assets`);
    return;
  }

  const isChalisa =
    pack.id === "pack-chalisa-v1" || pack.textId === "hanuman-chalisa";

  if (isChalisa) {
    const roles = new Set(pack.assets.map((a) => a.role).filter(Boolean));
    for (const req of CHALISA_PACK_REQUIRED_ROLES) {
      if (!roles.has(req)) {
        fail(`pack ${pack.id}: missing required role "${req}"`);
      }
    }
  }

  let sum = 0;
  for (const a of pack.assets) {
    if (isChalisa) {
      if (a.sha256 == null || a.sha256 === "") {
        fail(`pack ${pack.id}: asset missing sha256 ${a.path}`);
      }
      if (a.bytes == null || typeof a.bytes !== "number" || a.bytes < 0) {
        fail(`pack ${pack.id}: asset missing bytes ${a.path}`);
      }
    }

    const rel = a.path.startsWith("/")
      ? path.join(ROOT, "apps/web/public", a.path.slice(1))
      : path.join(ROOT, a.path);
    const media = path.join(ROOT, "media", a.path.replace(/^\//, ""));
    const file = fs.existsSync(rel) ? rel : fs.existsSync(media) ? media : null;
    if (!file) {
      warn(`pack ${pack.id}: asset missing on disk ${a.path}`);
      continue;
    }
    const st = fs.statSync(file);
    sum += st.size;
    if (a.sha256) {
      const h = sha256File(file);
      if (h !== a.sha256) fail(`pack ${pack.id}: sha256 mismatch ${a.path}`);
    } else if (!isChalisa) {
      warn(`pack ${pack.id}: asset missing sha256 ${a.path}`);
    }
    if (a.bytes != null && a.bytes !== st.size) {
      // Stale bytes field — warn so pack refresh is obvious without blocking
      warn(
        `pack ${pack.id}: bytes field ${a.bytes} != on-disk ${st.size} for ${a.path}`,
      );
    }
  }
  if (pack.maxBytes && sum > pack.maxBytes) {
    fail(`pack ${pack.id}: bytes ${sum} > maxBytes ${pack.maxBytes}`);
  }
}

if (fs.existsSync(PACKS)) {
  for (const f of fs.readdirSync(PACKS).filter((x) => x.endsWith(".json"))) {
    const packPath = path.join(PACKS, f);
    const raw = readJson(packPath);
    if (Array.isArray(raw.packs)) {
      for (const p of raw.packs) checkPack(p, f);
    } else {
      checkPack(raw, f);
    }
  }
}

if (errors) {
  console.error(`\nValidation FAILED with ${errors} error(s).`);
  process.exit(1);
}
console.log(
  `Validation OK — ${dirs.length} texts, ids unique, hi/en/iast present, design-CI checks passed.`,
);
