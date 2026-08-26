# Hanumat

**Three dhams. One courtyard.**

Digital mandirs of Hanuman ji, Lord Shiva, and Maa Kali — Sundar Kand, Chalisa, Lingashtakam, Adya Stotram, stotra, japa — with original script, transliteration, and meaning.

Digital mandir for devotees of Hanuman ji — Sundar Kand, Chalisa, stotra, katha, with timed audio and Indian languages first.

## Status

| Track | State |
|-------|--------|
| Design | `docs/design/hanuman-mandir-design.md` v0.2.2 |
| Edition (P1) | **Gita Press full Manas** family confirmed; exact code+year pending purchase |
| Audio (P3) | **TTS active** — full Chalisa + beds generated; see `docs/editorial/tts-audio-pipeline.md` |
| Buy edition | `docs/editorial/buy-gita-press-manas.md` (free ebook + official print) |
| Eng | Wave 0 scaffold + `/listen` page |

## Develop

```bash
pnpm install
pnpm dev
```

App: [http://localhost:3000](http://localhost:3000)

- Courtyard landing: `/`
- Hanumat (Hanuman): `/hi/` · `/en/`
- Shivayatan: `/shiva/hi/`
- Kalika Dham: `/kali/hi/`

## Workspace

```
apps/web              Next.js 15 app (@hanumat/web)
packages/ui           Design tokens (@hanumat/ui)
docs/design           Systems design
docs/editorial        Edition PIN + audio commission
content/              Path texts (schema in PR-02)
```

## Docs

- [Design document](docs/design/hanuman-mandir-design.md)
- [Edition shortlist](docs/editorial/edition-shortlist.md)
- [Audio commission brief](docs/editorial/audio-commission-brief.md)
- [Casting checklist](docs/editorial/casting-checklist.md)
