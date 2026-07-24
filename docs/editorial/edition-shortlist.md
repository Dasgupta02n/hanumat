# Hanumat — Ramcharitmanas Edition Shortlist (Sundar Kand)

| Field | Value |
|-------|-------|
| **Product** | Hanumat |
| **Document** | Edition shortlist & PIN recommendation (P1) |
| **Date** | 2026-07-21 |
| **Status** | **PIN locked: Gita Press Ramcharitmanas code 81, year 2025** (`GP-MANAS-81-2025`) |
| **Design ref** | `docs/design/hanuman-mandir-design.md` § Wave 0 Preconditions (P1) |
| **Version** | 1.0.0 |

---

## Purpose

Public Wave 0 requires a **named, stable edition PIN** for Sundar Kand so that:

1. Every chaupai/doha has a stable `verseId`
2. Dual editorial review has one source of truth
3. Audio commission can match a fixed path order and orthography
4. Users and scholars can answer: “Which text is this?”

This document **locks the shortlist** (what we will choose *from*), recommends a **primary PIN**, and defines **out-of-scope** sources.

**Not in this doc:** Valmiki *Sundarakāṇḍa* (Sanskrit) — Wave 2 twin-text.  
**Not in this doc:** Modern *meanings* — those are **commissioned originals** (see audio + meaning brief), not copied from any publisher’s *ṭīkā*.

---

## Legal / integrity baseline (all candidates)

| Layer | Status for Hanumat |
|-------|---------------------|
| **Tulsidas mūla (16th c.)** | Classical work; treated as **public-domain base text** for reproduction of the poem itself, subject to jurisdiction and how a *specific published edition* is typeset |
| **Publisher typesetting, commentary, notes, layout, modern Hindi “arth”** | Often **copyrighted** — **do not scrape or OCR-publish** Gita Press / others’ explanations |
| **Our HI/EN meanings** | **Original commissioned work** (plain modern language), dual-reviewed against mūla |
| **Our IAST** | Produced by us from the PIN’d Devanagari (or licensed), not lifted wholesale from a copyrighted transliteration product without rights |

**Rule:** PIN the **mūla path sequence + orthography** we will follow. Never claim a publisher’s trademarked *edition brand* as “official Hanumat” without permission; we **cite** the print we collated against (scholarly honesty), we do not rebrand their book.

---

## Evaluation criteria

| # | Criterion | Weight |
|---|-----------|--------|
| 1 | **Devotee familiarity** (what path circles actually recite) | Critical |
| 2 | **Internal consistency** of chaupai/doha order within Sundar Kand | Critical |
| 3 | **Availability** of a physical/print reference the team can hold | High |
| 4 | **Orthography stability** (not a fluid web scrape) | High |
| 5 | **Clear numbering / structure** for digital verse IDs | High |
| 6 | **Ease of dual-review** (second human can buy same book) | High |
| 7 | **Fit for audio path** (standard recitation order) | High |
| 8 | **Scholarly critical apparatus** | Nice-to-have (not Wave 0) |

---

## Shortlist (locked candidates)

Only these three are in scope for the Wave 0 PIN. Everything else is rejected for primary text (see “Not shortlisted”).

### A. Gita Press, Gorakhpur — *Śrī Rāmcaritmānas* mūla (Sundar Kāṇḍ)

| | |
|--|--|
| **Code family** | Multiple SKUs (e.g. full Manas codes such as popular pocket/large prints; separate *Sundar Kand* booklets also exist). **At PIN time we record exact code + year + ISBN if present.** |
| **Language of mūla** | Awadhi in Devanagari |
| **Why it belongs** | De facto standard for household and mandir *pāṭh* across North India; Gita Press has printed Manas at massive scale; orthography and order are what most devotees’ ears expect |
| **Strengths** | Trust with devotees; easy to buy two copies for dual review; natural match for “single source” product credibility |
| **Risks** | Multiple codes (81 / 1095 / 1402-class variants discussed in devotee circles) differ mainly in **layout, type size, commentary packaging**, not usually wholesale reorder — still must **PIN one physical book** and not mix codes mid-project |
| **Meanings** | Use **our** HI/EN; do **not** copy Gita Press *ṭīkā* |
| **Score** | **Primary recommendation** |

**PIN string template (when locked):**

```text
GP-MANAS-SK-{CODE}-{YEAR}
# example: GP-MANAS-SK-81-2019
# fields: publisher=Gita Press Gorakhpur; work=Ramcharitmanas; kand=Sundar; product_code=…; print_year=…
```

---

### B. Gita Press — standalone *Sundar Kand* booklet (same house, SK-only volume)

| | |
|--|--|
| **Why it belongs** | Same house lineage; cheaper/lighter for SK-only editorial work; often what path groups carry |
| **Strengths** | Focused; still Gita Press orthography family |
| **Risks** | Must verify **byte-for-byte order** against a full-Manas GP print for the same generation; booklet front/back matter may differ; numbering conventions may be booklet-local |
| **Score** | **Acceptable alternate** if and only if collated against Candidate A and diff is zero (or documented) |

**Use:** Secondary physical copy for collators; **do not PIN B alone** if A is available — PIN A, use B as portable check.

---

### C. Scholarly / critical print (e.g. university or critical edition line)

Examples of *class* (not an endorsement of one ISBN until purchased): carefully edited academic editions of *Rāmcaritmānas* with notes on variants.

| | |
|--|--|
| **Why it belongs on shortlist** | Variant awareness; useful **QA oracle** when two GP printings disagree or a web source is corrupted |
| **Strengths** | Transparent about manuscript/print variants |
| **Risks** | Orthography or preferred readings may **diverge from path-culture expectation**; numbering may not match GP; less “what devotees recite Sunday morning” |
| **Score** | **Reference only for Wave 0** — not primary PIN unless product deliberately chooses scholarly over path-standard (not recommended for Hanumat’s mission) |

**Use:** `edition.crossCheck` note in `TextMeta`, not `edition.pin`.

---

## Not shortlisted (explicit rejects for primary mūla)

| Source | Why reject as PIN |
|--------|-------------------|
| Random internet PDFs / blogs / “Sundar Kand lyrics” sites | High corruption, missing dohas, mixed spellings, no accountability |
| App scrapes / YouTube auto-captions | Not a text authority |
| AI-reconstructed Manas | Design non-goal: no AI primary sacred text |
| Unattributed WhatsApp forwards | Same as web scrapes |
| Valmiki Sanskrit *Sundarakāṇḍa* | Different work; Wave 2 |
| Regional script full re-compositions without source chain | Later locales translate *meanings* / UI; mūla stays Devanagari Awadhi for Manas Wave 0 |

---

## Recommendation (product should confirm)

### Primary PIN (recommended)

**Gita Press, Gorakhpur — full *Rāmcaritmānas*, Sundar Kāṇḍ mūla text, one specific product code + print year**  
(Candidate **A**).

### Operational procedure to *complete* the lock

1. **Purchase two identical copies** of the chosen GP full Manas (same code, same year if possible).  
2. Photograph colophon / copyright / code page → store in `docs/editorial/sources/gp-manas-colophon/` (private or repo as preferred).  
3. Fill PIN:

```yaml
# content/texts/sundar-kand-manas/meta.yaml (excerpt)
edition:
  pin: "GP-MANAS-SK-<CODE>-<YEAR>"
  publisher: "Gita Press, Gorakhpur"
  work: "Śrī Rāmcaritmānas"
  kand: "Sundara"
  productCode: "<CODE>"
  printYear: <YEAR>
  language: "awa"
  script: "Deva"
  scope: "mula-path-only"   # no teeka reproduced
  notes: "Collated against physical copies held by editorial; meanings are original Hanumat work."
```

4. Until step 3 is done, engineering uses `WORKING-UNPINNED` (**internal beta only**).  
5. **Episode map** (`structure.json`) is owned by editorial *after* PIN: break SK into path-friendly episodes without reordering verses relative to PIN.

### Secondary

- Booklet **B** for travel collators.  
- Scholarly **C** only if A vs A (two prints) or A vs B conflict.

### Hanuman Chalisa (same decision family)

| Item | Recommendation |
|------|----------------|
| **Text** | Standard 40 chaupai + opening/closing doha structure as printed in **Gita Press Hanuman Chalisa** (or the Chalisa section consistent with GP Manas tradition) |
| **PIN template** | `GP-CHALISA-<CODE>-<YEAR>` |
| **Meanings** | Original Hanumat HI/EN + IAST; not copied *ṭīkā* |

Chalisa is short enough to freeze in one content PR once physical booklet is bought.

---

## Comparison matrix

| Criterion | A GP full Manas | B GP SK booklet | C Scholarly |
|-----------|-----------------|-----------------|-------------|
| Devotee familiarity | ★★★★★ | ★★★★☆ | ★★☆☆☆ |
| Path-order trust | ★★★★★ | ★★★★☆ | ★★★☆☆ |
| Dual-review ease | ★★★★★ | ★★★★☆ | ★★★☆☆ |
| Variant transparency | ★★☆☆☆ | ★★☆☆☆ | ★★★★★ |
| Wave 0 fit for Hanumat | **Best** | Support | QA only |

---

## Decision record

| Date | Decision | Owner |
|------|----------|--------|
| 2026-07-21 | **Shortlist locked: A / B / C as above; rejects locked** | Product + Editorial |
| 2026-07-21 | **Primary edition family confirmed: Candidate A — Gita Press full *Rāmcaritmānas*** | Product |
| 2026-07-22 | **Exact product code locked: 81** → pin `GP-MANAS-81` | Product |
| 2026-07-22 | **Year locked: 2025** → pin **`GP-MANAS-81-2025`** | Product |
| *TBD* | Full verse-by-verse collate of SK to Code 81 (2025) pages | Editorial |

**Product confirmation checklist (P1):**

- [x] Primary family: **Gita Press full Manas**  
- [x] Product code: **81**  
- [x] Year: **2025**  
- [x] `edition.pin` = **`GP-MANAS-81-2025`** in `content/texts/sundar-kand-manas/meta.json`  
- [ ] Buy second identical Code 81 (2025) copy (dual review)  
- [ ] Colophon photos under `docs/editorial/sources/`  
- [ ] Episode breaks verified against Code 81 (2025)  
- [ ] Expand curated SK verses to full Code 81 Sundar Kand order  


---

## Next document

→ [`audio-commission-brief.md`](./audio-commission-brief.md) — commission recitations against this edition order.
