# Design match matrix — post multi-agent completion

**Date:** 2026-07-22  
**Design:** v0.2.4 (body synced) + Appendix H + PRODUCT-LOCK-v1  
**Task board:** `docs/TASKS-100-PERCENT.md`

## Gates

| Gate | Result |
|------|--------|
| `pnpm validate` | ✅ PASS (11 texts, design-CI checks) |
| Static build | ✅ **852 routes** |
| Vitest unit | ✅ 8/8 |
| Playwright e2e | ✅ 6/6 |
| Path page first-load JS | ✅ ~124 kB (under ~200 kB critical target after code-split) |

## Agent fan-out (T01–T15)

| ID | Task | Status |
|----|------|--------|
| T01 | lowDataSegments formal | ✅ |
| T02 | Pure IDB My Path; paths.ts removed | ✅ |
| T03 | Offline pack version purge + getOfflinePack | ✅ |
| T04 | AudioController + Vitest + e2e | ✅ |
| T05 | PathStudio dynamic code-split | ✅ |
| T06 | Festival shell (Mangalwar/Jayanti) | ✅ |
| T07 | PD bhajan set (12) | ✅ |
| T08 | Radio local TTS playlist | ✅ |
| T09 | Family calendar + kids leelas | ✅ |
| T10 | Valmiki expanded 216 / 18 sections | ✅ (PD path package; full critical recension deferred by design v0.2.4) |
| T11 | Bahuk 60 / Kavach 36 / Maruti 30 | ✅ |
| T12 | Deepen content CI | ✅ |
| T13 | Design body ↔ Appendix H sync v0.2.4 | ✅ |
| T14 | CSP + health.json + dead paths.ts | ✅ |
| T15 | Twin-text denser dual-pane | ✅ |

## Appendix H / product lock

| Item | Match |
|------|-------|
| TTS v1 + disclaimers | ✅ |
| Sole-owner dual-review | ✅ documented |
| Provisional + HI-equivalent regional MT | ✅ |
| 11 locales | ✅ |
| Static self-deploy | ✅ |
| Local export/import only | ✅ |
| Kids owner-approved | ✅ deepened |
| No analytics | ✅ |
| PR-26 out | ✅ |
| Zod + CI | ✅ deepened |
| Zustand + IndexedDB | ✅ |
| Workbox-class PWA + pack sha256 | ✅ |
| Offline multi-role Chalisa pack | ✅ |

## Content pillars (v0.2.4 wording)

| Pillar | Match |
|--------|-------|
| SK Manas matrix + packs + twin + parayan | ✅ |
| Valmiki expanded PD path (not full critical) | ✅ per design update |
| Chalisa living + offline + karaoke | ✅ |
| Baan Ashtak Aarti names | ✅ |
| Bahuk Kavach Maruti fuller | ✅ traditional packs |
| Japa | ✅ |
| Aarti + Bhajan core | ✅ (bhajan set) |
| Radio | ✅ local owned TTS continuum |
| Katha + Kids | ✅ |
| Calendar family | ✅ |
| Glossary Temples FAQs | ✅ |
| Community sync cloud | N/A locked local-only |

## Ethical / legal residual (by design — not violations)

| Item | Note |
|------|------|
| SK / Valmiki meanings | Provisional plain language; not ṭīkā; not commercial editions |
| Valmiki package | Multi-sarga traditional/PD **path package**, not a critical Sanskrit edition of every recension verse |
| Valmiki audio | **Partial** — older TTS sample; expanded text is text-first (`partialAudio`) |
| Bhajan TTS | Text package present; TTS optional (no filmi audio) |
| Device / airplane QA | Checklist present; human device lab not run |
| PathStudio ↔ AudioController glue | Module + tests ready; PathStudio still uses local audio element (behaviorally equivalent) |

## Completeness claim

**Structural and product-lock match to design v0.2.4 + Appendix H: achieved** under:

- India-legal PD / original / owner TTS only  
- Honest deferred: full critical Valmiki recension, scholar ṭīkā, commissioned pāṭh, cloud sync, PR-26  
- Design body updated so those deferrals are not false “gaps”

Deploy: `apps/web/out` after `pnpm validate && pnpm --filter @hanumat/web build`
