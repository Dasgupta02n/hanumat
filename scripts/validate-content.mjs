#!/usr/bin/env node
/**
 * CI / local content validator for Hanumat.
 * Usage: node scripts/validate-content.mjs
 *
 * Design-CI checks (T12):
 *  - lowDataSegments parity with segments (length + sectionId)
 *  - cueMapSrc JSON under apps/web/public has cues[]; warn if missing
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
  audio: z.any().optional(),
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
  "audio",
  "cues",
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

/** Resolve a public-root path like /audio/... → apps/web/public/... */
function publicPath(urlPath) {
  if (!urlPath || typeof urlPath !== "string") return null;
  const rel = urlPath.replace(/^\//, "");
  return path.join(PUBLIC, rel);
}

/**
 * Validate cueMapSrc: if file exists under public, parse JSON with cues[];
 * missing file is a warning (does not block build).
 */
function checkCueMapSrc(label, cueMapSrc) {
  if (!cueMapSrc || typeof cueMapSrc !== "string") return;
  const abs = publicPath(cueMapSrc);
  if (!abs || !fs.existsSync(abs)) {
    warn(`${label}: cueMapSrc missing on disk ${cueMapSrc}`);
    return;
  }
  try {
    const data = readJson(abs);
    if (!data || !Array.isArray(data.cues)) {
      fail(`${label}: cueMapSrc ${cueMapSrc} must be JSON with a cues array`);
    }
  } catch (e) {
    fail(`${label}: cueMapSrc ${cueMapSrc} invalid JSON — ${e.message}`);
  }
}

/**
 * If lowDataSegments is present: same length as segments + matching sectionId per index.
 */
function checkLowDataSegments(metaId, audio) {
  if (!audio || audio.lowDataSegments == null) return;
  const segs = Array.isArray(audio.segments) ? audio.segments : null;
  const low = audio.lowDataSegments;
  if (!Array.isArray(low)) {
    fail(`${metaId}: audio.lowDataSegments must be an array when present`);
    return;
  }
  if (!segs) {
    fail(`${metaId}: audio.lowDataSegments present but audio.segments missing`);
    return;
  }
  if (low.length !== segs.length) {
    fail(
      `${metaId}: lowDataSegments length ${low.length} !== segments length ${segs.length}`,
    );
  }
  const n = Math.min(low.length, segs.length);
  for (let i = 0; i < n; i++) {
    const a = segs[i]?.sectionId;
    const b = low[i]?.sectionId;
    if (a !== b) {
      fail(
        `${metaId}: lowDataSegments[${i}].sectionId (${b}) !== segments[${i}].sectionId (${a})`,
      );
    }
  }
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

  // Audio: lowDataSegments parity + cue maps
  const audio = meta.audio;
  if (audio) {
    checkLowDataSegments(meta.id, audio);

    if (audio.cueMapSrc) {
      checkCueMapSrc(`${meta.id} (track)`, audio.cueMapSrc);
    }

    const segs = audio.segments;
    if (Array.isArray(segs)) {
      for (const seg of segs) {
        const label = `${meta.id} segment ${seg.id ?? seg.sectionId ?? "?"}`;
        if (seg.cueMapSrc) {
          checkCueMapSrc(label, seg.cueMapSrc);
        }
      }
    }
  }

  if (WAVE0.has(meta.id)) {
    if (meta.flags?.placeholderAudio === true) {
      fail(`${meta.id}: Wave 0 text has placeholderAudio=true`);
    }
    const segs = meta.audio?.segments;
    const src = meta.audio?.src;
    if (!src && !(segs && segs.length)) {
      fail(`${meta.id}: Wave 0 requires audio`);
    }
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
