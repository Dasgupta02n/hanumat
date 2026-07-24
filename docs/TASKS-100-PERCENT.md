# Tasks to 100% design match (v0.2.3 + Appendix H)

**Rules:** India-legal only (public-domain / original / owner-locked TTS). No Gita Press ṭīkā scrape. No claim of GP digital license. Product lock wins where body conflicts. PR-26 stays out.

## Agents & ownership

| ID | Task | Agent scope (files) | Legal note |
|----|------|---------------------|------------|
| T01 | Formalize `lowDataSegments` in meta + content loader + PathStudio | `content/texts/**/meta.json`, `apps/web/src/lib/content.ts`, PathStudio | Technical |
| T02 | Pure IndexedDB My Path + remove dual-write primary path; delete legacy `paths.ts` | `apps/web/src/lib/my-path.ts`, `db.ts`, pages, delete `paths.ts` | Technical |
| T03 | Workbox/Serwist-class SW: pack version purge, getOfflinePack loader, install prompt | `apps/web/public/sw.js`, OfflinePack*, `lib/offline.ts` | Technical |
| T04 | Vitest + AudioController unit tests + expand Playwright | `apps/web/src/lib/audio/**`, `*.test.ts`, e2e | Technical |
| T05 | PathStudio code-split / reduce critical path bundle | PathStudio split, dynamic imports | Technical |
| T06 | Festival takeover shell (Mangalwar / Jayanti) | `apps/web` components + calendar | Technical |
| T07 | Aarti & **Bhajan** core set (PD/traditional lyrics only) + listen index | `content/texts/*bhajan*`, listen page | PD traditional only |
| T08 | **Radio** mode (local playlist continuum over owned TTS tracks) | `/radio` page, no third-party streams | Owned audio only |
| T09 | Family calendar depth (kids + family observances UI) | calendar, kids pages | Technical |
| T10 | Expand Valmiki SK from **public-domain** Sanskrit sources (max legal full) | `content/texts/valmiki-sundarakanda/**` | PD only |
| T11 | Expand Bahuk / Kavach / Maruti to fuller traditional PD sets | those text dirs | PD traditional only |
| T12 | Zod CI deepen: cue refs, lowDataSegments parity, pack roles | `scripts/validate-content.mjs`, schema | Technical |
| T13 | Design doc body sync to Appendix H (remove false pre-lock requirements) | `docs/design/**` | Doc integrity |
| T14 | CSP meta + static health.json + remove dead code | next config/meta, public/health.json | Technical |
| T15 | Twin-text denser dual-pane + section deep-links polish | TwinText*, PathStudio | Technical |

## Completion definition

All T01–T15 green + `pnpm validate` + `pnpm build` + e2e pass + matrix 100% against **Appendix H–aligned** design body.

## Status 2026-07-22

**All T01–T15 completed by specialized subagents.**  
Gates: validate ✅ · build 852 routes ✅ · vitest 8/8 ✅ · e2e 6/6 ✅  
See `docs/ZERO-DEV-MATRIX.md`.

## Human-only (already locked — not blocking code 100%)

- Physical GP print dual-check: owner sole-sign-off already in PRODUCT-LOCK  
- Scholar ṭīkā: not required (provisional + HI-equivalent MT locked)  
- Commissioned pāṭh: not required (TTS locked)  
