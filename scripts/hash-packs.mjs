#!/usr/bin/env node
/** Compute bytes + sha256 for offline pack assets under apps/web/public */
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = path.join(ROOT, "apps/web/public");
const PACKS = path.join(ROOT, "content/packs");

function sha256File(abs) {
  return createHash("sha256").update(fs.readFileSync(abs)).digest("hex");
}

function enrichAssets(assets) {
  return assets.map((a) => {
    const file = path.join(PUBLIC, a.path.replace(/^\//, ""));
    if (!fs.existsSync(file)) {
      console.warn("missing", a.path);
      return a;
    }
    const st = fs.statSync(file);
    return {
      ...a,
      bytes: st.size,
      sha256: sha256File(file),
    };
  });
}

for (const f of fs.readdirSync(PACKS).filter((x) => x.endsWith(".json"))) {
  const p = path.join(PACKS, f);
  const raw = JSON.parse(fs.readFileSync(p, "utf8"));
  if (Array.isArray(raw.packs)) {
    raw.packs = raw.packs.map((pack) => ({
      ...pack,
      assets: enrichAssets(pack.assets || []),
      createdAt: pack.createdAt || new Date().toISOString(),
    }));
  } else if (raw.assets) {
    raw.assets = enrichAssets(raw.assets);
    raw.createdAt = raw.createdAt || new Date().toISOString();
    raw.locales = raw.locales || ["hi", "en"];
    raw.transliterationSchemes = raw.transliterationSchemes || ["iast"];
  }
  fs.writeFileSync(p, JSON.stringify(raw, null, 2) + "\n");
  console.log("updated", f);
}
