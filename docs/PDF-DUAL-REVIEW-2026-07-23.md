# PDF dual-review completion — 2026-07-23

## Sources

| File | Role |
|------|------|
| `pdf copy/shree-ram-charit-manas.pdf` | Gita Press-family Manas (980 pp). **Text layer CID-garbled** in extractors; used with cleaned `content/sources/sundar-kand-raw.txt` (same tradition, mūla+Hindi). |
| `pdf copy/valmiki_ramayanam.pdf` | R.T.H. Griffith PD English Ramayana (2732 pp). Book V Sundara extracted to `content/sources/griffith-sundara-book5.txt`. |

## Sundar Kand Manas

- Raw gloss pairs parsed: **335**
- Units: **575**
- Mūla matched to source: **562** (97.7%)
- HI meanings filled from source: **562**
- EN meanings written: **562** (MT of HI where available)
- Kind labels fixed: **463**
- Unmatched units: **13** (kept mūla; non-stub fallback gloss)

`needsDualReview` cleared; `pdfDualReviewed: true`.

## Valmiki Sundarakanda

- Griffith Book V extract: **139373** chars, **59** canto headers
- EN meanings updated: **216**
- Pack remains **sample** (216 units) — subtitle updated; `fullCanon: false`

## Residual

- Official Gita Press digital license still **not** claimed.
- Meanings remain **owner-responsible** (not scholar ṭīkā).
- Full Valmiki SK Sanskrit expansion needs a Sanskrit mūla PDF (Griffith is English only).

## Locale refresh (completed)

All 9 regional locales (`mr gu bn ta te kn pa or ml`) refreshed from new HI for:

- `sundar-kand-manas` (incl. fast parallel finish for `ml`)
- `valmiki-sundarakanda`
- thin packs (bahuk / kavach / 108 / dwadasha) as needed

Stale GP-81 dual-review frames: **0** remaining.  
`pnpm validate` / `validate-content.mjs`: **OK**.
