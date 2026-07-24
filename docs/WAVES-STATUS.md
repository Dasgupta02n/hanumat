# Waves 0–3 implementation status

**Date:** 2026-07-22  
**Brand:** Hanumat · **Edition:** `GP-MANAS-81-2025`

## Wave 0 — Trust core

| Item | Status |
|------|--------|
| Hanuman Chalisa text + IAST + HI/EN + audio + cues | ✅ |
| Chalisa offline pack (SW + My Path download) | ✅ |
| Sundar Kand Manas 575 units · 24 sections · full TTS | ✅ |
| Path Studio (section / full / listen, resume, bookmarks) | ✅ |
| hi/en i18n · Noto Devanagari | ✅ |
| Learn credits (P3 TTS path-assist) | ✅ |
| Editorial dual-review process | ✅ process; second human sign-off open |
| SK meaning polish (literary) | ⏳ provisional stubs |

## Wave 1 — Daily devotee

| Item | Status |
|------|--------|
| Bajrang Baan, Sankatmochan Ashtak, Aarti, 108 names | ✅ in catalog + Path Studio |
| Audio for Baan / Ashtak / Aarti / mantra | ✅ |
| Japa mala (targets, loop, local persist) | ✅ `/japa` |
| Calendar Tue/Sat + Jayanti traditions | ✅ `/calendar` |
| Sankat shelf (refuge links) | ✅ `/sankat` |
| SK section offline packs (24) | ✅ My Path + SW `CACHE_SK_PACK` |
| Shravan listen index | ✅ `/listen` (all audio paths) |

## Wave 2 — Depth

| Item | Status |
|------|--------|
| Valmiki Sundarakanda sample | ✅ |
| Twin-text alignment hooks | ✅ Path page panel + `twin-text-sk-align.json` |
| Bahuk, Panchmukhi Kavach, Maruti stotra | ✅ (selected stanzas; expand editorially) |
| Katha arcs (6 stories) | ✅ `/katha` |

## Wave 3 — Living mandir

| Item | Status |
|------|--------|
| Parayan planner 1/7/40 day | ✅ `/parayan` over SK sections |
| Temples / kshetras | ✅ `/temples` |
| Kids path | ✅ `/kids` |
| My Path export/import (local sync) | ✅ |
| Listen-together / global counters | Spike only — not implemented (design non-goal) |

## Routes (static export)

`/hi` · `/en` plus path, listen, japa, calendar, katha, sankat, my-path, learn, parayan, temples, kids, and all path slugs (10 texts × 2 locales).

```bash
pnpm --filter @hanumat/web build
pnpm --filter @hanumat/web exec -- npx serve out -p 3000
```

## Honest remaining editorial

1. Second human dual-review sign-off on GP-81 SK lines  
2. Literary polish of SK HI/EN meanings  
3. Full Valmiki SK + denser twin-text map  
4. Full Bahuk/Kavach expansions  
5. Optional Hostinger live redeploy when you request it  
