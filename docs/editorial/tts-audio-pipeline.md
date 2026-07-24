# TTS audio pipeline (Wave 0 interim)

| Field | Value |
|-------|--------|
| **Status** | Active — user requested TTS + synthetic beds |
| **Engine** | Microsoft Edge neural TTS via `edge-tts` |
| **Voice (default)** | `hi-IN-MadhurNeural` (male Hindi) |
| **Beds** | FFmpeg-synthesized Sa–Pa tanpura-like drone + soft pulse |

## Honest quality note

This is **clear, calm neural Hindi speech** with a soft drone bed — good for:

- Learning / listen-along MVP  
- Verse cue development  
- Offline pack dogfood  

It is **not** classical *pāṭh* singing (no raga path ornament). For “studio path master” quality later, re-commission a human reciter and keep the same `verseId` / cue schema.

## Commands

```bash
# Ambience beds (10 min loops)
python scripts/generate_ambience.py

# Full Chalisa + SK sample, with bed mix
python scripts/generate_path_tts.py --target all --mix-bed

# Chalisa only / SK sample only
python scripts/generate_path_tts.py --target chalisa --mix-bed
python scripts/generate_path_tts.py --target sk-sample --mix-bed
```

Optional: `--voice hi-IN-SwaraNeural` (female), `--rate "-15%"` slower path pace.

## Outputs

| Asset | Path |
|-------|------|
| Chalisa M4A | `media/audio/chalisa/hanuman_chalisa.m4a` |
| Chalisa cues | `media/audio/chalisa/hanuman_chalisa_cues.json` |
| SK sample | `media/audio/sundar-kand/sundar_kand_sample_s01.m4a` |
| Tanpura bed | `media/audio/ambience/tanpura_sa_pa_10m.m4a` |
| Light path bed | `media/audio/ambience/path_bed_light_10m.m4a` |

## Full Sundar Kand

1. Collate full mūla from Gita Press PIN into JSON (same shape as Chalisa verses file).  
2. Point generator at that file (extend script `--target sk-full`).  
3. Expect multi-hour runtime and multi-segment files per editorial episode.

## Legal / product

- Label tracks as **TTS assist** in credits until replaced.  
- `meta.flags.placeholderAudio` / `ttsGenerated: true` for honesty in-app.  
- Edge TTS terms: personal/dev use of generated speech — review Microsoft terms if commercializing distribution of the raw TTS audio at scale.
