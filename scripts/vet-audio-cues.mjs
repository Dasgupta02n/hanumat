#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = path.join(ROOT, "apps", "web", "public");

const samples = [
  ["chalisa", "audio/chalisa/hanuman_chalisa_cues.json"],
  ["bajrang", "audio/bajrang-baan/bajrang_baan_cues.json"],
  ["aarti", "audio/aarti/hanuman_aarti_cues.json"],
  ["ashtak", "audio/ashtak/sankatmochan_ashtak_cues.json"],
  ["bahuk", "audio/bahuk/hanuman_bahuk_cues.json"],
  ["kavach", "audio/kavach/panchmukhi_kavach_cues.json"],
  ["names", "audio/names/hanuman_108_names_cues.json"],
  ["valmiki", "audio/valmiki/valmiki_sundarakanda_cues.json"],
  ["maruti", "audio/maruti/maruti_stotra_cues.json"],
  ["bhajan", "audio/bhajan/hanuman_dwadasha_nama_cues.json"],
  ["sk-s01", "audio/sundar-kand/sk-s01/sk_sk-s01_cues.json"],
  ["sk-s12", "audio/sundar-kand/sk-s12/sk_sk-s12_cues.json"],
  ["sk-s24", "audio/sundar-kand/sk-s24/sk_sk-s24_cues.json"],
];

function checkCues(id, cueRel) {
  const p = path.join(PUBLIC, cueRel);
  if (!fs.existsSync(p)) return { id, err: "missing" };
  const j = JSON.parse(fs.readFileSync(p, "utf8"));
  const cues = j.cues || [];
  const issues = [];
  for (let i = 0; i < cues.length; i++) {
    const c = cues[i];
    const start = c.startMs ?? c.start ?? c.t0;
    const end = c.endMs ?? c.end ?? c.t1;
    if (start == null || end == null) issues.push(`no timing ${i}`);
    else if (end <= start) issues.push(`end<=start ${i}`);
    if (i > 0) {
      const prev = cues[i - 1];
      const ps = prev.startMs ?? prev.start ?? prev.t0;
      if (start < ps) issues.push(`nonmono ${i}`);
    }
  }
  const first = cues[0];
  const last = cues[cues.length - 1];
  return {
    id,
    n: cues.length,
    firstStart: first?.startMs ?? first?.start,
    lastEnd: last?.endMs ?? last?.end,
    issueCount: issues.length,
    issues: issues.slice(0, 5),
  };
}

// SK meaning quality
const sk = JSON.parse(fs.readFileSync(path.join(ROOT, "content/texts/sundar-kand-manas/verses.json"), "utf8"));
const en = JSON.parse(fs.readFileSync(path.join(ROOT, "content/texts/sundar-kand-manas/translations/en.json"), "utf8"));
const hi = JSON.parse(fs.readFileSync(path.join(ROOT, "content/texts/sundar-kand-manas/translations/hi.json"), "utf8"));
const ids = Object.keys(sk);
let shortEn = 0;
let shortHi = 0;
for (const id of ids) {
  if ((en[id] || "").length < 20) shortEn++;
  if ((hi[id] || "").length < 15) shortHi++;
}

// audio sizes from meta
const TEXTS = path.join(ROOT, "content", "texts");
const sizes = [];
for (const t of fs.readdirSync(TEXTS, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name)) {
  const meta = JSON.parse(fs.readFileSync(path.join(TEXTS, t, "meta.json"), "utf8"));
  const segs = meta.audio?.segments || [{ src: meta.audio?.src }];
  let bytes = 0;
  for (const seg of segs) {
    const rel = (seg.src || meta.audio?.src || "").replace(/^\//, "");
    const abs = path.join(PUBLIC, rel);
    if (fs.existsSync(abs)) bytes += fs.statSync(abs).size;
  }
  sizes.push({ id: t, segs: segs.length, mb: +(bytes / 1e6).toFixed(2) });
}

console.log("=== CUE TIMING ===");
for (const [id, p] of samples) console.log(JSON.stringify(checkCues(id, p)));
console.log("\n=== AUDIO MB ===");
for (const s of sizes) console.log(s.id, s.segs, s.mb + "MB");
console.log("\n=== SK meanings ===");
console.log({ total: ids.length, shortEn, shortHi, sampleEn: en["sk-s01-v002"], sampleHi: hi["sk-s01-v002"] });
