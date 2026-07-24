# Wave 0 / v1 QA checklist

## Device / browser

- [ ] Chrome Android mid-range
- [ ] Chrome Desktop
- [ ] Safari iOS (PWA install + offline re-download note)
- [ ] `prefers-reduced-motion` — no decorative motion issues

## Path Studio

- [ ] Chalisa: play, verse highlight, karaoke toggle, bookmark, resume
- [ ] Sundar Kand: section map, full auto-advance across segments, low-data toggle
- [ ] `?verse=` deep link opens correct verse
- [ ] Section route `/path/{slug}/{sectionId}/` loads

## Offline

- [ ] My Path → Chalisa pack download (sha256 verify)
- [ ] Airplane mode: Chalisa audio + shell still works after pack
- [ ] SK section pack download works for one section

## i18n

- [ ] Locale switch hi/en + regional UI
- [ ] Meaning locale selector shows HI-equivalent text (not English stubs)

## Disclaimers

- [ ] Provisional banner on SK / paths
- [ ] Footer TTS / meanings / OCR notes
- [ ] Learn disclaimers

## A11y smoke

- [ ] Keyboard focus on mode buttons and verse cards
- [ ] Audio native controls usable
- [ ] Mailto report-error present

## Build gates

```bash
pnpm validate
pnpm --filter @hanumat/web build
pnpm --filter @hanumat/web test:e2e
```
