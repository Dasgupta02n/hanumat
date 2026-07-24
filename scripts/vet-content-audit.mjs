#!/usr/bin/env node
/**
 * Internal structural + audio parity audit for Hanumat path texts.
 * Writes scripts/vet-audit-report.json and prints a summary table.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const TEXTS = path.join(ROOT, "content", "texts");
const PUBLIC = path.join(ROOT, "apps", "web", "public");

function load(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function keys(obj) {
  return Object.keys(obj);
}

const texts = fs
  .readdirSync(TEXTS, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

const report = [];

for (const t of texts) {
  const dir = path.join(TEXTS, t);
  const meta = load(path.join(dir, "meta.json"));
  const verses = load(path.join(dir, "verses.json"));
  const structure = load(path.join(dir, "structure.json"));
  const iast = load(path.join(dir, "transliteration", "iast.json"));
  const vIds = keys(verses);
  const iIds = keys(iast);
  const structIds = structure.sections.flatMap((s) => s.verseIds);
  const missingInStruct = structIds.filter((id) => !verses[id]);
  const orphanVerses = vIds.filter((id) => !structIds.includes(id));
  const dupStruct = structIds.filter((id, i) => structIds.indexOf(id) !== i);
  const missingIast = vIds.filter((id) => iast[id] == null || String(iast[id]).trim() === "");
  const emptyText = vIds.filter((id) => !verses[id].text || !String(verses[id].text).trim());

  // Contaminations: Chalisa bleed into non-chalisa packs
  const contaminationHits = [];
  if (t !== "hanuman-chalisa") {
    const chalisaMarkers = [
      "जय हनुमान ज्ञान गुन सागर",
      "श्रीगुरु चरन सरोज रज",
      "राम दूत अतुलित बल धामा",
      "बुद्धिहीन तनु जानिके",
    ];
    for (const id of vIds) {
      const text = String(verses[id].text || "");
      for (const m of chalisaMarkers) {
        if (text.includes(m)) contaminationHits.push({ id, marker: m });
      }
    }
  }

  const trs = {};
  for (const f of fs.readdirSync(path.join(dir, "translations")).filter((x) => x.endsWith(".json"))) {
    const tr = load(path.join(dir, "translations", f));
    const tkeys = keys(tr);
    let empty = 0;
    let provisional = 0;
    let mt = 0;
    let short = 0;
    const missing = [];
    for (const id of vIds) {
      const s = tr[id];
      if (s == null || String(s).trim() === "") {
        empty++;
        missing.push(id);
      } else {
        const str = String(s);
        if (/provisional|TODO|FIXME|\[LOC/i.test(str)) provisional++;
        if (/\[LOC.?MT\]|HI.?equiv|machine.?trans/i.test(str)) mt++;
        if (str.trim().length < 8) short++;
      }
    }
    trs[f.replace(".json", "")] = {
      count: tkeys.length,
      missingVerses: missing.length,
      empty,
      provisional,
      mt,
      short,
    };
  }

  const ordered = structIds.length ? structIds : vIds;
  const pick = [
    0,
    1,
    2,
    Math.floor(ordered.length / 2),
    ordered.length - 3,
    ordered.length - 2,
    ordered.length - 1,
  ].filter((v, i, a) => v >= 0 && v < ordered.length && a.indexOf(v) === i);

  const samples = pick.map((i) => {
    const id = ordered[i];
    const v = verses[id];
    return {
      index: i + 1,
      id,
      kind: v?.kind,
      text: v ? String(v.text).slice(0, 200) : "MISSING",
    };
  });

  // Full mula export for external bench (first 8 + last 4)
  const fullSampleIds = [
    ...ordered.slice(0, 8),
    ...ordered.slice(Math.max(8, ordered.length - 4)),
  ];
  const fullSamples = fullSampleIds.map((id) => ({
    id,
    kind: verses[id]?.kind,
    text: verses[id]?.text,
  }));

  const audioIssues = [];
  const cueChecks = [];
  let totalCues = 0;
  const allCueVerseIds = [];

  if (meta.audio) {
    const segs =
      meta.audio.segments ||
      [
        {
          id: "full",
          src: meta.audio.src,
          cueMapSrc: meta.audio.cueMapSrc,
          sectionId: structure.sections[0]?.id,
          lowDataSrc: meta.audio.lowDataSrc,
        },
      ];

    for (const seg of segs) {
      const cueRel = (seg.cueMapSrc || meta.audio.cueMapSrc || "").replace(/^\//, "");
      const srcRel = (seg.src || meta.audio.src || "").replace(/^\//, "");
      const publicCue = path.join(PUBLIC, cueRel);
      const publicAudio = path.join(PUBLIC, srcRel);

      let cueCount = 0;
      let cueIds = [];
      if (fs.existsSync(publicCue)) {
        const cj = load(publicCue);
        const cues = cj.cues || [];
        cueCount = cues.length;
        cueIds = cues.map((c) => c.verseId || c.id).filter(Boolean);
        allCueVerseIds.push(...cueIds);
      } else {
        audioIssues.push(`missing cue ${cueRel}`);
      }

      let audioBytes = 0;
      if (fs.existsSync(publicAudio)) {
        audioBytes = fs.statSync(publicAudio).size;
        if (audioBytes < 1000) audioIssues.push(`tiny audio ${srcRel} (${audioBytes}b)`);
      } else {
        audioIssues.push(`missing audio ${srcRel}`);
      }

      let lowBytes = 0;
      const low = seg.lowDataSrc || meta.audio.lowDataSrc;
      if (low) {
        const lp = path.join(PUBLIC, low.replace(/^\//, ""));
        if (fs.existsSync(lp)) lowBytes = fs.statSync(lp).size;
        else audioIssues.push(`missing lowdata ${low}`);
      }

      totalCues += cueCount;
      cueChecks.push({
        seg: seg.id || seg.sectionId,
        cueCount,
        audioBytes,
        lowBytes,
        cueRel,
        srcRel,
      });
    }
  } else {
    audioIssues.push("no audio meta");
  }

  const cueMissingVerses = vIds.filter((id) => !allCueVerseIds.includes(id));
  const cueExtra = allCueVerseIds.filter((id) => id && !verses[id]);

  report.push({
    id: t,
    titleEn: meta.title?.en,
    titleHi: meta.title?.hi,
    edition: meta.edition?.pin,
    category: meta.category,
    wave: meta.wave,
    verseCount: vIds.length,
    iastCount: iIds.length,
    structCount: structIds.length,
    sections: structure.sections.length,
    missingInStruct: missingInStruct.length,
    orphanVerses: orphanVerses.length,
    dupStruct: dupStruct.length,
    missingIast: missingIast.length,
    emptyText: emptyText.length,
    contaminationHits,
    hi: trs.hi,
    en: trs.en,
    trLocales: Object.keys(trs).length,
    localeGaps: Object.entries(trs)
      .filter(([, v]) => v.missingVerses > 0)
      .map(([k, v]) => `${k}:${v.missingVerses}`),
    provisionalAny: Object.entries(trs)
      .filter(([, v]) => v.provisional > 0)
      .map(([k, v]) => `${k}:${v.provisional}`),
    mtTagged: Object.entries(trs)
      .filter(([, v]) => v.mt > 0)
      .map(([k, v]) => `${k}:${v.mt}`),
    shortMeanings: Object.entries(trs)
      .filter(([, v]) => v.short > 0)
      .map(([k, v]) => `${k}:${v.short}`),
    totalCues,
    cueParity: totalCues === vIds.length ? "MATCH" : `${totalCues}!=${vIds.length}`,
    cueMissingVerses: cueMissingVerses.length,
    cueExtra: cueExtra.length,
    cueChecks,
    audioIssues,
    samples,
    fullSamples,
    needsDualReview: !!meta.flags?.needsDualReview,
    tts: !!meta.flags?.ttsGenerated,
    hasOffline: !!meta.flags?.hasOfflinePack,
    audioEngine: meta.audio?.engine || null,
    audioVoice: meta.audio?.voice || null,
  });
}

const outPath = path.join(ROOT, "scripts", "vet-audit-report.json");
fs.writeFileSync(outPath, JSON.stringify(report, null, 2), "utf8");

// Human table
console.log("ID | verses | cues | parity | empty | iastMiss | localeGaps | audioIssues | contam");
for (const x of report) {
  console.log(
    [
      x.id,
      x.verseCount,
      x.totalCues,
      x.cueParity,
      x.emptyText,
      x.missingIast,
      (x.localeGaps || []).join(";") || "ok",
      x.audioIssues.length,
      x.contaminationHits.length,
    ].join(" | "),
  );
}
console.log("\nWrote", outPath);
console.log("Total texts:", report.length);
console.log(
  "Total verses:",
  report.reduce((a, x) => a + x.verseCount, 0),
);
console.log(
  "Total cues:",
  report.reduce((a, x) => a + x.totalCues, 0),
);
console.log(
  "Audio issue texts:",
  report.filter((x) => x.audioIssues.length).map((x) => x.id),
);
console.log(
  "Cue mismatch:",
  report.filter((x) => x.cueParity !== "MATCH").map((x) => `${x.id}:${x.cueParity}`),
);
console.log(
  "Contamination:",
  report.filter((x) => x.contaminationHits.length).map((x) => x.id),
);
