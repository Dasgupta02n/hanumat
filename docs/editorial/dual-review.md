# Dual-review workflow (sacred content)

Per design doc: two human approvals for `content/texts/**` before public freeze.

## Roles

| Role | Duty |
|------|------|
| **Editor A** | Collate mūla from GP-MANAS-81-2025 source; segment verses |
| **Editor B** | Independent check orthography, order, missing/extra lines vs Code 81 |
| **Meaning reviewer** | HI/EN plain meanings (no ṭīkā copy) |
| **Audio QC** | Spot-check ≥20 cues/section; diction sample |

## Checklist per content PR

- [ ] Edition pin matches `GP-MANAS-81-2025`
- [ ] Source note present (archive OCR / physical page)
- [ ] No Gita Press commentary pasted
- [ ] Verse IDs stable; structure.verseIds ⊆ verses.json
- [ ] HI + EN + IAST present for every verseId
- [ ] Cue map verseIds resolve; monotonic startMs
- [ ] Two human approvals recorded below

## Audit log

| Date | Scope | Reviewer A | Reviewer B | Result |
|------|-------|------------|------------|--------|
| 2026-07-22 | SK full OCR extract 575 units / 24 sections | Eng (automated filter + sample) | Pending second human | **Pass with conditions** — OCR cleaned; sample spot-check of openings (Jambavan, ocean, Surasa, Sita, Lanka dahan, return) match known Manas lines; full page-by-page vs physical Code 81 still open |
| 2026-07-22 | Chalisa 43 units + IAST | Eng | Pending second human | **Pass with conditions** — standard Chalisa; IAST via indic-transliteration |

## Conditions to close

1. Second human signs SK sample of **≥50 random verses** against Code 81 (2025) book/ebook.  
2. Meaning polish pass (replace provisional “under review” strings for SK).  
3. CODEOWNERS enforce two reviewers on `content/texts/**`.

## CODEOWNERS (suggested)

```
/content/texts/**  @editor-a @editor-b
```
