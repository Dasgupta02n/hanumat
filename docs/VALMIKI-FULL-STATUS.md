# Valmiki Sundarakanda full expansion — status

**Date:** 2026-07-23 (session)

## Pack

| Item | Value |
|------|-------|
| Units | **2,780** |
| Sargas | **68** |
| Edition pin | `VALMIKI-SK-FULL-PD-V3` |
| `fullCanon` | true |
| Opening | `ततो रावणनीतायाः…` authentic |

## Text / meanings

| Layer | Status |
|-------|--------|
| Mūla Devanagari | Complete |
| IAST | Complete |
| EN | Complete (source pack prose) |
| HI | Complete (EN→HI MT) |
| mr gu bn ta or ml | Complete (HI-equivalent / correct scripts) |
| te kn pa | Finishing via MyMemory EN→locale after Google rate-limit |

## Audio (FULL TTS)

| Item | Value |
|------|-------|
| Engine | Edge `hi-IN-MadhurNeural` path-assist |
| Segments | **68 / 68** |
| Cue parity | **0 mismatches** |
| Public files missing | **0** |
| Duration | **~612 minutes** (~10.2 hours) |
| Flags | `ttsGenerated: true`, `partialAudio: false`, `audioCoverage: full-68-sargas` |
| Layout | `/audio/valmiki/vl-sNN/vl_vl-sNN.m4a` + cues (+ lowdata where generated) |

## Scripts

- `scripts/expand_valmiki_full_sk.py` — download + pack
- `scripts/mt_valmiki_en_to_hi.py` — HI meanings
- `scripts/generate_valmiki_full_tts.py` — concurrent per-sarga TTS
- `scripts/check_valmiki_tts.py` — integrity check
- `scripts/fix_valmiki_locales_mymemory.py` — te/kn/pa fallback MT

## Validate

`node scripts/validate-content.mjs` → **OK — 11 texts**
