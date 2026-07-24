# Hanumat content vetting report — text & audio

**Date:** 2026-07-23  
**Scope:** All 11 path texts under `content/texts/` + path audio under `apps/web/public/audio/` (and `media/audio/`)  
**Protocol:** Internal structural audit + independent cross-check of mūla against **≥3 authentic external sources** per path (where tradition allows)  
**Tools:** `scripts/validate-content.mjs`, `scripts/vet-content-audit.mjs`, `scripts/vet-audio-cues.mjs`, `scripts/vet-meanings.mjs` + live source fetch

---

## Executive summary

| Layer | Result |
|-------|--------|
| **Structural integrity** | **PASS** — 11 texts, **1,094** verse units, **1,094** audio cues; 1:1 parity; no empty mūla; no Chalisa contamination bleed |
| **CI validate** | **PASS** — `pnpm validate` / `validate-content.mjs` green |
| **Mūla correctness (popular paths)** | **PASS** — Chalisa, Bajrang Baan, Ashtak, Aarti, 108 names, Bahuk, Dwadasha, Trikāla match traditional recensions (with known orthographic / regional variants) |
| **Mūla completeness (deep canon)** | **PARTIAL** — Sundar Kand Manas is full-kand scale (575 units, OCR GP-81 pin) but still needs dual-review; Valmiki is a **sample** narrative pack (216 units), not full critical SK |
| **Meanings (HI/EN/locales)** | **MIXED** — short paths mostly real meanings; **SK EN/HI ~574/575 dual-review stubs**; Valmiki EN provisional templates; Bahuk/Kavach meanings thin; 108 EN is name-echo not gloss |
| **Audio correctness** | **PASS as TTS path-assist** — all files present, cue maps monotonic & complete; **not classical pāṭh** (Edge `hi-IN-MadhurNeural` / project TTS policy) |

**Overall product verdict:**  
**Ship-ready for mūla + timed TTS on short/medium paths.**  
**Not yet scholar-grade** for Sundar Kand meanings, Valmiki completeness, or classical audio. Disclaimers in product lock remain accurate and necessary.

---

## Benchmarking sources used (independent)

### Tier A — Primary authentic anchors

| # | Source | Role |
|---|--------|------|
| 1 | **Sanskrit Documents** (sanskritdocuments.org) — Hanuman Chalisa | Volunteer scholarly Devanagari corpus |
| 2 | **Drik Panchang** — Chalisa, Bajrang Baan, Aarti, Bahuk, 108 names, Dwadasha | Widely used traditional liturgy portal |
| 3 | **Vaidika Vignanam** (vignanam.org) — Ashtottara, related stotra indexes | Multi-script traditional namavali / stotra library |

### Tier B — Confirmatory / specialist

| # | Source | Role |
|---|--------|------|
| 4 | **IOU Stotra / Bhakti Bharatki** — Hanumat Trikāla Smaraṇam | Classical 3-verse morning/midday/evening form |
| 5 | **Traditional blog / path collections** (e.g. Hanuman Chalisa Bhajan blog) — Sankatmochan Ashtak | 8-stanza + doha path text |
| 6 | **Project GP-81 OCR + edition pin** (`GP-MANAS-81-2025`) | Ramcharitmanas Sundar Kand mūla target (not a public licensed digital GP dump claim) |
| 7 | **Valmiki tradition** (standard SK opening `ततो रावणनीतायाः…`) | Critical/popular Valmiki SK opening formula |

> Note: There is **no single universal printed edition** for every popular Hanuman path. “Correct” means **matches mainstream traditional recension**, not byte-identical to one printer.

---

## Internal integrity (all paths)

| Check | Result |
|-------|--------|
| Texts in catalog | 11 |
| Verse units | 1,094 |
| IAST coverage | 1,094 / 1,094 |
| Structure ↔ verses | 0 orphans, 0 missing, 0 dups |
| Translation locales | 11 each (hi en mr gu bn ta te kn pa or ml) |
| Missing meaning keys | 0 |
| Empty mūla | 0 |
| Chalisa bleed into other packs | **0** |
| Public audio files | Present for all meta segments |
| Cue count = verse count | **MATCH** all 11 |
| Cue timing (sampled) | 0 monotonicity / end≤start issues |
| Total public path audio | ~**136 MB** (SK 24 segs ~63 MB; Valmiki ~30 MB; Bahuk ~20 MB) |

---

## Path-by-path verdicts

### 1. Hanuman Chalisa — **PASS**

| | |
|--|--|
| **Local** | 43 units: doha×2 + 40 chaupai + closing doha (`hc-doha-1`…`hc-40`…`hc-doha-3`) |
| **Sources** | Sanskrit Documents; Drik Panchang; Wikipedia / common GP tradition |
| **Correctness** | Opening, body, and closing match standard Tulsidas Chalisa. Orthography varies slightly across editions (`बरनउँ`/`बरनऊँ`, `जस`/`यश`, `बिद्यावान`/`विद्यावान`) — expected Avadhi spelling drift, not error. |
| **Completeness** | Full traditional path (not truncated). |
| **Audio** | 43 cues, ~5.2 min, file OK. TTS path-assist. |
| **Meanings** | HI/EN substantive. |

---

### 2. Bajrang Baan — **PASS** (minor closing-doha variant)

| | |
|--|--|
| **Local** | 34 units: opening doha + 32 chaupai/mantra lines + closing doha |
| **Sources** | Drik Panchang; traditional path blogs; project TRAD-BAJRANG-BAAN pin |
| **Correctness** | Opening doha (`निश्चय प्रेम प्रतीति ते…`) and core chaupais (`जय हनुमंत संत हितकारी…`, Surasa/Lankini/Vibhishana sequence, bīja lines) match Drik. **Closing doha differs:** local uses a shorter alternate phala-doha; Drik prints `प्रेम प्रतीतिहिं कपि भजै…`. Both are traditional recension variants. |
| **Completeness** | Full popular path length; not the old corrupt 5-line stub. |
| **Audio** | 34 cues, ~4.5 min, OK. |
| **Meanings** | HI/EN real. |

---

### 3. Sankatmochan Ashtak — **PASS**

| | |
|--|--|
| **Local** | 9 units: 8 ashtak stanzas + closing doha |
| **Sources** | Traditional Ashtak path text (blog corpus); common Tulsidas ascription tradition; project prior 3-source fix log |
| **Correctness** | Stanza 1 childhood-sun episode through stanza 8 sankat-removal plea + doha `लाल देह लाली लसे…` match standard Sankatmochan Hanuman Ashtak. |
| **Completeness** | Full 8 + doha. |
| **Audio** | 9 cues, ~3.3 min, OK. |
| **Meanings** | HI/EN real. |

---

### 4. Hanuman Aarti — **PASS** (expanded recension)

| | |
|--|--|
| **Local** | 14 couplets |
| **Sources** | Drik Aarti; common North-Indian temple aarti; project TRAD-AARTI pin |
| **Correctness** | Core `आरती कीजै हनुमान लला की…` through Anjana aarti / phala couplets match Drik’s 12-line body. |
| **Variant** | Local adds **ha-13** (Tulsidas kīrti line) and **ha-14** (opening refrain reprise). Common in sung aartis; not a corruption. |
| **Audio** | 14 cues, ~1.8 min, OK. |
| **Meanings** | HI/EN real. |

---

### 5. Hanuman 108 Names (Ashtottara) — **PASS**

| | |
|--|--|
| **Local** | 108 namavali units `n001`…`n108` |
| **Sources** | Drik 108 Hanuman Names; Vignanam Ashtottara Sata Namavali; standard Anjaneya ashtottara |
| **Correctness** | Opens `ॐ आञ्जनेयाय नमः` → `महावीराय` → `हनुमते`… closes `सीतासमेतश्रीरामपादसेवाधुरन्धराय` — **matches** Drik/Vignanam order and forms. |
| **Completeness** | Full 108. |
| **Audio** | 108 cues, ~7.3 min, OK. |
| **Meanings** | EN mostly “Traditional ashtottara name: …” echo, **not literary gloss**. Structure complete; gloss depth weak. |

---

### 6. Hanuman Dwadasha Nama (`hanuman-bhajan-set`) — **PASS** (title/slug note)

| | |
|--|--|
| **Local** | 12 names (slug still `hanuman-bhajan-set`; title “Hanuman Dwadasha Nama”) |
| **Sources** | Drik 12 Hanuman Names; classical Anjaneya Dvadasha Nama |
| **Correctness** | Sequence Hanumate → Anjaneya → Vayuputra → Mahabala → Rameshta → Phalguna-sakha → Pingaksha → Amitavikrama → Udadhikramana → Sitashoka-vinashana → Lakshmana-pranadatre → Dashagriva-darpahan matches mainstream dwadasha. Orthography differs slightly from Drik wording on #1/#2/#12. |
| **Completeness** | Full 12. |
| **Audio** | 12 cues, ~43 s, OK. |
| **Meanings** | Very short name glosses (e.g. “Hanuman”). |
| **Product note** | Slug still says “bhajan-set” — content is **not** a multi-bhajan pack. |

---

### 7. Maruti Stotra → Hanumat Trikāla Smaraṇam — **PASS** (identity caveat)

| | |
|--|--|
| **Local** | 3 Sanskrit verses: prātaḥ / madhya / sāyam |
| **Sources** | IOU Stotra Trikāla page; Bhakti Bharatki; traditional GP Kalyan-style reprints |
| **Correctness** | `प्रातः स्मरामि हनुमन्तमनन्तवीर्यं…` / `माध्यं नमामि…` / `सायं भजामि…` authentic. |
| **Completeness** | Full trikāla set. |
| **Not the same as** | Samarth Ramdas **Marathi Maruti Stotra** (different work). Slug `maruti-stotra` is legacy; title correctly says Trikala Smaranam. |
| **Audio** | 3 cues, ~42 s, OK. |

---

### 8. Hanuman Bahuk — **PASS**

| | |
|--|--|
| **Local** | 44 multi-metre padya (chhappay, jhulna, ghanakshari, savaiya…) |
| **Sources** | Drik Hanuman Bahuk (full 44); traditional Tulsidas Bahuk; project TRAD-BAHUK-44 pin |
| **Correctness** | Opening chhappay `सिंधु तरन, सिय-सोच हरन…` through closing ghanakshari `कहों हनुमान सों सुजान राम राय सों…` match Drik’s 44-padya recension. |
| **Completeness** | Full traditional 44 (not abbreviated). |
| **Audio** | 44 cues, ~22.3 min, OK. |
| **Meanings** | Thin templates (“Bahuk padya N — Tulsidas arm-pain petition…”) — **not literary padya-by-padya gloss**. |

---

### 9. Panchmukhi Hanumat Kavach — **PASS** (recension-bound)

| | |
|--|--|
| **Local** | 36 units: viniyoga, dhyāna (pañcavaktra), mantras, nyāsa, phala, colophon `सुदर्शनसंहिता` |
| **Sources** | Traditional Sudarśana-saṃhitā Panchamukha Hanumat Kavacha tradition; Vignanam related kavacha index; project TRAD-KAVACH pin |
| **Correctness** | Structure is authentic kavacha architecture (not Chalisa/bīja garbage). Colophon claims Sudarśana-saṃhitā — appropriate for this recension family. Multiple printed kavachas exist; this is a coherent traditional recension, not a random collage. |
| **Completeness** | Full pack for this recension (36 units). |
| **Audio** | 36 cues, ~6.6 min, OK. |
| **Meanings** | Mostly section labels (“viniyoga”, “dhyana”) — thin. |

---

### 10. Sundar Kand (Ramcharitmanas) — **PARTIAL**

| | |
|--|--|
| **Local** | **575** units · **24** sections · edition pin `GP-MANAS-81-2025-V2` · OCR source flag · `needsDualReview: true` |
| **Sources** | Project GP-81 OCR collation; Gita Press Manas tradition; standard SK opening after mangalacharan |
| **Correctness (spot)** | Opening mangalacharan + `जामवंत के बचन सुहाए…` is authentic Manas SK start. Closing Tulsidas phala chaupai matches standard kand end. Middle sample lines look Manas, not Chalisa contamination. |
| **Caveats** | (1) OCR heuristic segmentation — some `kind` labels mis-tagged (e.g. chaupai labeled doha). (2) Not dual-reviewed against physical GP print. (3) Not a claim of official Gita Press digital license. |
| **Completeness** | Full-kand scale for app path (not a 1-section sample). Exact traditional unit count varies by how dohas/chaupais are split; 575 is coherent for this segmenter. |
| **Audio** | **24** section tracks, **575** cues total, ~63 MB, cue parity MATCH; sampled s01/s12/s24 timing clean. TTS path-assist. |
| **Meanings** | **FAIL for literary completeness:** **574/575** EN and HI are dual-review stubs (“meaning under dual-review…” / “मूल पाठ; विस्तृत अर्थ समीक्षा में”). Regional locales filled from HI-equivalent pipeline but inherit thin base. |

---

### 11. Valmiki Sundarakanda — **PARTIAL** (intentional sample)

| | |
|--|--|
| **Local** | **216** shlokas · **18** sarga-arcs × 12 · edition `VALMIKI-SK-PD-V2` |
| **Sources** | Standard Valmiki SK opening `ततो रावणनीतायाः सीतायाः शत्रुकर्शनः…`; PD tradition; narrative arc design in repo |
| **Correctness** | Opening authentic; arc titles (Mahendra → ocean → Mainaka → Surasa → Simhika → Lanka → Ashoka → ring → fire → return) map real SK narrative. Closing colophon marks traditional sample pack. |
| **Completeness** | **Not full Valmiki SK.** Full critical/popular Valmiki Sundarakanda is multi-sarga and **thousands** of shlokas. This is a curated **PD sample path** for twin-text / pedagogy — honest if labeled as sample in UI. |
| **Audio** | 216 cues, ~36 min, OK. |
| **Meanings** | EN is provisional template per unit; not scholarly translation. |

---

## Audio summary

| Path | Cues | ~Duration | Public size | Engine class | Verdict |
|------|------|-----------|-------------|--------------|---------|
| Chalisa | 43 | 5.2 min | 4.1 MB | TTS path-assist | Complete |
| Bajrang Baan | 34 | 4.5 min | 3.4 MB | TTS | Complete |
| Ashtak | 9 | 3.3 min | 3.0 MB | TTS | Complete |
| Aarti | 14 | 1.8 min | 1.3 MB | TTS | Complete |
| 108 names | 108 | 7.3 min | 4.9 MB | TTS | Complete |
| Dwadasha | 12 | 0.7 min | 0.5 MB | TTS | Complete |
| Trikāla | 3 | 0.7 min | 0.6 MB | TTS | Complete |
| Bahuk | 44 | 22.3 min | 19.8 MB | TTS | Complete |
| Kavach | 36 | 6.6 min | 5.6 MB | TTS | Complete |
| SK Manas | 575 | multi-hour across 24 segs | 63.3 MB | TTS | Complete vs text |
| Valmiki sample | 216 | 36.3 min | 29.9 MB | TTS | Complete vs sample pack |

**Audio correctness caveats (product-level, not file-missing):**

1. Voice is neural TTS — **not** classical temple pāṭh / commissioned recitation.  
2. Pronunciation / sandhi / metre delivery will not match a trained pathaka.  
3. Low-data dual bitrate exists on several paths (design CI); not re-transcribed here.  
4. Listening tests (human ear) for wrong verse in slot were **not** fully performed for all 1,094 cues — structural cue↔id parity is green; random human listen sample recommended for SK.

---

## Meanings & locales

| Path | HI/EN quality | Regional (mr…ml) |
|------|---------------|------------------|
| Chalisa, Bajrang, Ashtak, Aarti, Trikāla | Real prose meanings | Present (HI-equivalent pipeline) |
| Dwadasha | Minimal name gloss | Present |
| 108 names | Name-echo EN | Present |
| Bahuk, Kavach | Thin section/template meanings | Present |
| SK Manas | **Stub dual-review banners on nearly all units** | Keys filled; quality inherits stubs |
| Valmiki | Provisional EN templates | Present |

**Locale completeness (keys):** 100% for all 11 locales × all verse ids.  
**Locale literary quality:** not equal to scholar ṭīkā; matches product lock (machine-assisted + owner banner).

---

## Scorecard

| # | Path | Mūla | Completeness | Meanings | Audio | Overall |
|---|------|------|--------------|----------|-------|---------|
| 1 | hanuman-chalisa | PASS | PASS | PASS | PASS (TTS) | **PASS** |
| 2 | bajrang-baan | PASS* | PASS | PASS | PASS (TTS) | **PASS** |
| 3 | sankatmochan-ashtak | PASS | PASS | PASS | PASS (TTS) | **PASS** |
| 4 | hanuman-aarti | PASS* | PASS | PASS | PASS (TTS) | **PASS** |
| 5 | hanuman-108-names | PASS | PASS | PARTIAL | PASS (TTS) | **PASS** |
| 6 | hanuman-bhajan-set (dwadasha) | PASS | PASS | PARTIAL | PASS (TTS) | **PASS** |
| 7 | maruti-stotra (trikāla) | PASS | PASS | PASS | PASS (TTS) | **PASS** |
| 8 | hanuman-bahuk | PASS | PASS | PARTIAL | PASS (TTS) | **PASS** |
| 9 | panchmukhi-kavach | PASS | PASS | PARTIAL | PASS (TTS) | **PASS** |
| 10 | sundar-kand-manas | PARTIAL† | PASS‡ | **FAIL** (stubs) | PASS (TTS) | **PARTIAL** |
| 11 | valmiki-sundarakanda | PASS (opening/arcs) | **PARTIAL** (sample) | PARTIAL | PASS (TTS) | **PARTIAL** |

\* Regional/recension orthography or extra couplets — not corruption.  
† OCR + needs dual-review against physical GP.  
‡ Full-kand app pack; unitization heuristic.

---

## Residual risks & recommended fixes (priority)

### P0 — Correctness / honesty

1. **SK meanings:** Replace dual-review stubs with real HI/EN line meanings (even provisional literary drafts).  
2. **UI labels:** Ensure Valmiki path is clearly **“sample / selected sargas”**, not “full Valmiki SK”.  
3. **Keep disclaimers** visible: TTS ≠ classical pāṭh; OCR mūla ≠ GP digital license; meanings owner-responsible.

### P1 — Editorial quality

4. Physical dual-review of GP-81 SK mūla (spot 50+ lines per section).  
5. Fix SK `kind` mislabels (doha vs chaupai).  
6. Enrich Bahuk / Kavach / 108 meanings beyond templates.  
7. Align Bajrang closing doha with chosen house recension (Drik vs current) and document choice.

### P2 — Product polish

8. Rename slugs: `maruti-stotra` → `hanumat-trikala-smaranam`; `hanuman-bhajan-set` → `hanuman-dwadasha-nama` (or permanent redirects).  
9. Commission classical audio for Wave-0 hero paths (Chalisa + SK s01) when budget allows.  
10. Expand Valmiki only if product goal becomes full SK — currently correctly scoped as sample.

---

## What this report does *not* claim

- Byte-for-byte identity with any one Gita Press print year without physical page comparison.  
- Phonetic / śikṣā correctness of TTS.  
- That machine-translated regional meanings equal scholar ṭīkā.  
- That Valmiki pack is the complete Sundarakanda.

---

## Reproduction

```bash
node scripts/validate-content.mjs
node scripts/vet-content-audit.mjs
node scripts/vet-audio-cues.mjs
node scripts/vet-meanings.mjs
```

Artifacts: `scripts/vet-audit-report.json`

---

## Final one-line verdict

**Mūla + audio inventory for the 11-path Hanumat catalog is structurally complete and traditionally authentic on popular stotra paths; Sundar Kand meanings and Valmiki full-canon completeness remain the main honesty gaps — treat TTS as path-assist and SK meanings as provisional until dual-review lands.**
