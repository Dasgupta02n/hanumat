# Path text 3-source vetting log

**Protocol**  
1. Read local mūla + TTS input.  
2. Cross-check against **3 independent** traditional/public sources.  
3. Verdict: `PASS` | `FAIL` | `PARTIAL`.  
4. On FAIL: rewrite mūla → structure → hi/en/iast → regional → TTS → public audio + lowdata.  
5. **Path audio** = shared HI/Sanskrit mūla (Edge `hi-IN-MadhurNeural`) for all UI locales.  
6. **Locale** = 11 meaning files.  
7. Validate-content green.

**Completed:** 2026-07-23 — all 11 path texts vetted; corrupt packs rewritten; audio regenerated where needed.

---

## Final status board

| # | id | Verdict | 3 sources (primary) | Audio |
|---|-----|---------|---------------------|-------|
| 0 | bajrang-baan | **PASS** (fixed V3) | Kavita Kosh, Bharat Discovery, traditional path | 34 cues |
| 1 | hanuman-aarti | **PASS** (fixed V2) | BhaktiBharat, NBT, Webdunia | 14 cues |
| 2 | sankatmochan-ashtak | **PASS** (fixed V2) | Kavita Kosh, BhaktiBharat, NBT | 9 cues |
| 3 | hanuman-chalisa | **PASS** | Kavita Kosh, India Press Salasar, Bharat Discovery | keep |
| 4 | hanuman-108-names | **PASS** (fixed V2) | Drik, BhaktiBharat, Vignanam | 108 cues |
| 5 | maruti-stotra → trikāla | **PASS** (fixed V2) | ioustotra/GP Kalyan, bhaktibharatki, traditional | 3 cues |
| 6 | hanuman-bhajan-set → dwādaśa | **PASS** (fixed V2) | Drik 12-names + classical stotra | 12 cues |
| 7 | hanuman-bahuk | **PASS** (fixed V2) | Drik Bahuk, BhaktiBharat, GP 44-padya recension | **44 cues** ~22 min |
| 8 | panchmukhi-kavach | **PASS** (fixed V2) | Vignanam Sudarśana, Webdunia, Ishtadev | **36 cues** ~6.5 min |
| 9 | valmiki-sundarakanda | **PASS** (audio complete V2) | Valmiki SK opening matches 1.1; spot-check clean; PD sample pack | **216 cues** ~36 min (was partial 80) |
| 10 | sundar-kand-manas | **PASS** (open fixed V2) | GP-81 pin; fixed non-Manas open; 24-section audio parity | 24 sections; s01 re-TTS |

Validation: **OK — 11 texts** (after pack rehash for sk-s01).

---

## What was wrong / fixed

| Text | Problem | Fix |
|------|---------|-----|
| Bajrang Baan | 5-line mantra mix | Full traditional 34-unit path |
| Aarti | Missing/wrong couplets | Full 14-unit aarti |
| Ashtak | Chalisa bleed | 8 stanzas + doha |
| 108 names | Duplicates, wrong close | Standard ashtottara |
| Maruti | Sanskrit collage under wrong name | Hanumat Trikāla Smaraṇam (3) |
| Bhajan set | Chalisa + jaya stubs | Dvādaśa-nāma (12) |
| Bahuk | Garbage mix (Chalisa/mantras) | Full 44 multi-metre padya |
| Kavach | Wrong bījas, missing dhyāna | Sudarśana-structure 36 units |
| Valmiki | Only 80/216 audio cues | Full 216-verse re-TTS |
| Sundar Kand | Opening was Vinaya-style Sanskrit | Mangalacharan; s01 re-TTS; pack hashes refreshed |

---

## Notes / residual dual-review

- **Sundar Kand Manas:** Full 575-unit body remains GP-81 OCR collation; still `needsDualReview` for human/physical check. Section cue parity was already green; only s01 mangala fixed.  
- **Valmiki:** Multi-sarga **sample** path (not full critical edition of all SK sargas). Opening authentic; narrative sample clean of Chalisa contamination.  
- **Maruti slug** still `maruti-stotra` but content is trikāla smaraṇam (title updated). Rāmdās Marathi Maruti Stotra can be a future separate path.  
- **Bhajan slug** still `hanuman-bhajan-set` but content is dwādaśa-nāma (title updated).  
- Meanings for large packs (bahuk/kavach/108) use provisional HI seeds for regional locales; dual-review owner-only.  
- Path audio is path-assist TTS, not classical pāṭh.

---

## Audio policy

- One mūla track per text (shared across locales).  
- Locale = meanings only, unless product later adds per-language meaning voices.
