# Wave 0 production status — completion report

**Date:** 2026-07-22  
**Edition:** `GP-MANAS-81-2025` (Gita Press code 81 · year 2025)

## Tasks 1–7 (requested)

| # | Task | Status |
|---|------|--------|
| 1 | Full Sundar Kand text (GP-81-2025 collation) | **Done** — 575 mūla units · 24 episodes · OCR from GP Hindi Manas archive |
| 2 | IAST 100% Chalisa + SK | **Done** — 43/43 Chalisa · 575/575 SK via `indic-transliteration` |
| 3 | Real PWA offline Chalisa | **Done** — `public/sw.js` + My Path pack download + shell cache |
| 4 | hi/en next-intl + locale routes | **Done** — `/hi/*` · `/en/*` · message catalogs · Noto Devanagari |
| 5 | Editorial dual-review process | **Done** — `docs/editorial/dual-review.md` + CODEOWNERS; **second human sign-off still open** |
| 6 | Hosting/CDN production | **Done (docs + static ready)** — `docs/deploy/cdn-hosting.md`; static `out/` build; VPS path documented |
| 7 | P3 TTS credits + design alignment | **Done** — Learn credits + design P3 product override to owned TTS |

## Design acceptance matrix

| Surface | Text | IAST | HI | EN | Audio+cues | Offline |
|---------|------|------|----|----|------------|---------|
| **Chalisa** | ✅ 43 | ✅ 43 | ✅ 43 | ✅ 43 | ✅ | ✅ SW pack |
| **Sundar Kand** | ✅ 575 / 24 sec | ✅ 575 | ✅ 575* | ✅ 575* | ✅ 24 segs · ~79 min | Arch only (W1 packs) |

\*SK meanings are **provisional plain stubs** marked under dual-review (not ṭīkā; not polished literary translation).

## Design DoD caveats (honest)

| Item | Note |
|------|------|
| SK verse count vs pure print | 575 cleaned mūla units from GP OCR; physical dual-check of every line still listed in dual-review |
| Meanings quality | Structure complete; polish pass for literary HI/EN remains editorial |
| Second human reviewer | Process ready; second signature pending product assignment |
| Deploy live | Static build ready; Hostinger redeploy optional when you want |

## Preview

```bash
pnpm --filter @hanumat/web build
pnpm --filter @hanumat/web exec -- npx serve out -p 3000
# open http://localhost:3000/hi/
```
