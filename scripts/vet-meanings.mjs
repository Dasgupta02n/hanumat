#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TEXTS = path.join(ROOT, "content", "texts");
const stubRe =
  /dual-review|under review|provisional|meaning under|मूल पाठ|समीक्षा|placeholder|TODO|\[LOC/i;

for (const t of fs
  .readdirSync(TEXTS, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort()) {
  const en = JSON.parse(fs.readFileSync(path.join(TEXTS, t, "translations/en.json"), "utf8"));
  const hi = JSON.parse(fs.readFileSync(path.join(TEXTS, t, "translations/hi.json"), "utf8"));
  const mr = JSON.parse(fs.readFileSync(path.join(TEXTS, t, "translations/mr.json"), "utf8"));
  const keys = Object.keys(en);
  let stubEn = 0;
  let stubHi = 0;
  let stubMr = 0;
  for (const k of keys) {
    if (stubRe.test(String(en[k] || ""))) stubEn++;
    if (stubRe.test(String(hi[k] || ""))) stubHi++;
    if (stubRe.test(String(mr[k] || ""))) stubMr++;
  }
  const sample = keys.slice(0, 2).map((k) => ({ k, en: String(en[k]).slice(0, 90) }));
  console.log(JSON.stringify({ t, n: keys.length, stubEn, stubHi, stubMr, sample }));
}
