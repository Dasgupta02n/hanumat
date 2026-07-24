# Checkpoint — pre non-stop zero-deviation run

**Timestamp:** 2026-07-22 (session)  
**Product lock:** `docs/PRODUCT-LOCK-v1.md`  
**Design:** v0.2.3 + Appendix H  
**Resume from:** `docs/ZERO-DEV-PROGRESS.md`

## Snapshot (green at checkpoint)

| Item | State |
|------|--------|
| `pnpm validate` | Green (10 texts, hi/en/iast, pack hashes) |
| Static build | Green — **269 routes** (11 locales) |
| Path audio v1 | TTS path-assist locked |
| Owner editorial | Sole sign-off recorded |
| Disclaimers | Banner + Learn + footer |
| Packs | Chalisa + 24 SK section packs with sha256 |
| Player | Auto-advance Full/Listen; `?verse=`; Zustand store |
| My Path | localStorage + IndexedDB dual-write; export/import |
| Locales UI | hi en mr gu bn ta te kn pa or ml |
| MT meaning files | On disk under `translations/{locale}.json` |

## Content counts at checkpoint

| Text | Verses (approx) | Audio |
|------|-----------------|-------|
| hanuman-chalisa | 43 | yes |
| sundar-kand-manas | 575 / 24 segs | yes |
| bajrang-baan | 24 | yes |
| sankatmochan-ashtak | 10 | yes |
| hanuman-aarti | 12 | yes |
| hanuman-108-names | 108 | no |
| hanuman-bahuk | 8 | no |
| panchmukhi-kavach | 8 | no |
| maruti-stotra | 8 | no |
| valmiki-sundarakanda | 5 sample | no |

## Explicitly incomplete before non-stop run

1. Full Valmiki SK + full Bahuk/Kavach/Maruti  
2. PathStudio multi-locale meaning display wired  
3. TTS for all missing path audio  
4. @serwist package (custom SW has integrity)  
5. Virtualization, Playwright, lowData dual bitrate, ff_*  
6. True native-quality MT (files are `[LOC·MT]` English-base drafts)

## How to restore mental model

```bash
pnpm validate
pnpm --filter @hanumat/web build
# serve apps/web/out
```

## Non-stop plan (execution order)

1. Expand Valmiki + stotras from PD-style content generation  
2. Wire multi-locale meanings in content.ts + PathStudio  
3. TTS batch scripts for missing audio  
4. Playwright smoke + virtualization  
5. Serwist/Workbox polish if time  
6. Final matrix report  

**Owner deploy:** static `out/` only — no Hostinger push unless asked.

---

*Checkpoint frozen. Non-stop implementation begins after this file.*
