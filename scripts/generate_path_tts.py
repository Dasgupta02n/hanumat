#!/usr/bin/env python3
"""
Hanumat path TTS generator (Edge neural voices).

Honest scope:
- Clear Hindi neural speech (path-paced), not classical raga path singing.
- Verse-level cue maps from cumulative timings.
- Optional soft bed mix (tanpura-like) via FFmpeg.

Usage:
  python scripts/generate_path_tts.py --target chalisa
  python scripts/generate_path_tts.py --target chalisa --mix-bed
  python scripts/generate_path_tts.py --target sk-sample
"""

from __future__ import annotations

import argparse
import asyncio
import json
import re
import subprocess
import sys
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parents[1]
MEDIA = ROOT / "media" / "audio"
FFMPEG = "ffmpeg"

# Warm male Hindi neural — best available free neural for path-like clarity
DEFAULT_VOICE = "hi-IN-MadhurNeural"
# Slower path pace for clearer Hindi pronunciation
DEFAULT_RATE = "-18%"
DEFAULT_PITCH = "-3Hz"


def pause_ssml_break(ms: int = 450) -> str:
    # edge-tts plain text: use punctuation / newlines for pauses
    return "\n\n"


async def synth_verse(
    text: str,
    out_mp3: Path,
    voice: str,
    rate: str,
    pitch: str,
) -> float:
    """Synthesize one verse; return duration seconds via ffprobe."""
    out_mp3.parent.mkdir(parents=True, exist_ok=True)
    communicate = edge_tts.Communicate(text, voice, rate=rate, pitch=pitch)
    await communicate.save(str(out_mp3))
    return probe_duration(out_mp3)


def probe_duration(path: Path) -> float:
    r = subprocess.run(
        [
            FFMPEG.replace("ffmpeg", "ffprobe") if False else "ffprobe",
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "default=noprint_wrappers=1:nokey=1",
            str(path),
        ],
        capture_output=True,
        text=True,
        check=True,
    )
    return float(r.stdout.strip())


def concat_mp3s(parts: list[Path], out_wav: Path, gap_ms: int = 380) -> None:
    """Concat verse mp3s with short silence gaps into one WAV."""
    out_wav.parent.mkdir(parents=True, exist_ok=True)
    list_file = out_wav.with_suffix(".txt")
    silence = out_wav.parent / f"_silence_{gap_ms}.wav"
    subprocess.run(
        [
            FFMPEG,
            "-y",
            "-f",
            "lavfi",
            "-i",
            f"anullsrc=r=48000:cl=mono",
            "-t",
            str(gap_ms / 1000.0),
            "-c:a",
            "pcm_s16le",
            str(silence),
        ],
        check=True,
        capture_output=True,
    )

    # Convert each mp3 to wav then concat demuxer
    wav_parts: list[Path] = []
    for i, p in enumerate(parts):
        w = out_wav.parent / f"_part_{i:03d}.wav"
        subprocess.run(
            [
                FFMPEG,
                "-y",
                "-i",
                str(p),
                "-ar",
                "48000",
                "-ac",
                "1",
                "-c:a",
                "pcm_s16le",
                str(w),
            ],
            check=True,
            capture_output=True,
        )
        wav_parts.append(w)

    # Relative names only — absolute Windows paths with spaces break concat demuxer
    lines = []
    for i, w in enumerate(wav_parts):
        lines.append(f"file '{w.name}'")
        if i < len(wav_parts) - 1:
            lines.append(f"file '{silence.name}'")
    list_file.write_text("\n".join(lines), encoding="utf-8")
    subprocess.run(
        [
            FFMPEG,
            "-y",
            "-f",
            "concat",
            "-safe",
            "0",
            "-i",
            list_file.name,
            "-c:a",
            "pcm_s24le",
            out_wav.name,
        ],
        check=True,
        capture_output=True,
        cwd=str(out_wav.parent.resolve()),
    )

    # cleanup temps
    for w in wav_parts:
        w.unlink(missing_ok=True)
    silence.unlink(missing_ok=True)
    list_file.unlink(missing_ok=True)


def mix_bed(voice_wav: Path, bed_wav: Path, out_wav: Path, bed_vol: float = 0.16) -> None:
    """Loop bed under voice for full duration."""
    dur = probe_duration(voice_wav)
    subprocess.run(
        [
            FFMPEG,
            "-y",
            "-i",
            str(voice_wav),
            "-stream_loop",
            "-1",
            "-i",
            str(bed_wav),
            "-filter_complex",
            f"[0:a]aformat=sample_fmts=fltp:channel_layouts=stereo[v];"
            f"[1:a]volume={bed_vol},aformat=sample_fmts=fltp:channel_layouts=stereo[b];"
            f"[v][b]amix=inputs=2:duration=first:dropout_transition=2,volume=1.0",
            "-t",
            f"{dur:.3f}",
            "-c:a",
            "pcm_s24le",
            str(out_wav),
        ],
        check=True,
        capture_output=True,
    )


def encode_aac(wav: Path, m4a: Path, bitrate: str = "128k") -> None:
    subprocess.run(
        [
            FFMPEG,
            "-y",
            "-i",
            str(wav),
            "-c:a",
            "aac",
            "-b:a",
            bitrate,
            str(m4a),
        ],
        check=True,
        capture_output=True,
    )


async def generate_from_verses(
    verses: list[dict],
    out_dir: Path,
    stem: str,
    voice: str,
    rate: str,
    pitch: str,
    mix_bed_path: Path | None,
) -> dict:
    parts_dir = out_dir / "_parts"
    parts_dir.mkdir(parents=True, exist_ok=True)
    cues = []
    cursor_ms = 0
    gap_ms = 380
    mp3_parts: list[Path] = []

    for v in verses:
        vid = v["id"]
        text = v["text"].strip()
        # Light SSML-ish pacing: ensure danda acts as pause
        spoken = re.sub(r"[॥।]", "। ", text)
        spoken = re.sub(r"\s+", " ", spoken).strip()
        part = parts_dir / f"{vid}.mp3"
        print(f"  TTS {vid}...")
        dur_s = await synth_verse(spoken, part, voice, rate, pitch)
        dur_ms = int(round(dur_s * 1000))
        cues.append(
            {
                "verseId": vid,
                "startMs": cursor_ms,
                "endMs": cursor_ms + dur_ms,
            }
        )
        cursor_ms += dur_ms + gap_ms
        mp3_parts.append(part)

    # last cue shouldn't include trailing gap in total duration
    if cues:
        total_ms = cues[-1]["endMs"]
    else:
        total_ms = 0

    voice_wav = out_dir / f"{stem}_voice.wav"
    print("  concatenating...")
    concat_mp3s(mp3_parts, voice_wav, gap_ms=gap_ms)

    final_wav = voice_wav
    if mix_bed_path and mix_bed_path.exists():
        mixed = out_dir / f"{stem}_mixed.wav"
        print("  mixing bed...")
        mix_bed(voice_wav, mix_bed_path, mixed)
        final_wav = mixed

    m4a = out_dir / f"{stem}.m4a"
    encode_aac(final_wav, m4a)
    print("  wrote", m4a)

    cue_map = {
        "id": f"{stem}-cues-v1",
        "version": 1,
        "source": "edge-tts",
        "voice": voice,
        "rate": rate,
        "pitch": pitch,
        "gapMs": gap_ms,
        "durationMs": total_ms,
        "cues": cues,
        "disclaimer": (
            "Neural TTS path assist — clear Hindi speech, not classical path singing. "
            "Replace with commissioned recitation when available."
        ),
    }
    cue_path = out_dir / f"{stem}_cues.json"
    cue_path.write_text(json.dumps(cue_map, ensure_ascii=False, indent=2), encoding="utf-8")

    def rel(p: Path) -> str:
        try:
            return str(p.resolve().relative_to(ROOT.resolve())).replace("\\", "/")
        except ValueError:
            return str(p).replace("\\", "/")

    manifest = {
        "id": f"track-{stem}",
        "textId": None,
        "src": rel(m4a),
        "durationMs": int(probe_duration(final_wav) * 1000),
        "cueMapId": cue_map["id"],
        "engine": "edge-tts",
        "voice": voice,
        "segments": [
            {
                "id": f"{stem}-seg-0",
                "src": rel(m4a),
                "durationMs": int(probe_duration(final_wav) * 1000),
                "cueMapId": cue_map["id"],
            }
        ],
    }
    (out_dir / f"{stem}_manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    return cue_map


async def run_chalisa(voice: str, rate: str, pitch: str, do_mix: bool) -> None:
    data = json.loads(
        (ROOT / "scripts" / "texts" / "hanuman_chalisa_verses.json").read_text(encoding="utf-8")
    )
    out_dir = MEDIA / "chalisa"
    bed = ROOT / "media" / "audio" / "ambience" / "path_bed_light_10m.wav"
    await generate_from_verses(
        data["verses"],
        out_dir,
        "hanuman_chalisa",
        voice,
        rate,
        pitch,
        bed if do_mix else None,
    )


async def run_sk_sample(voice: str, rate: str, pitch: str, do_mix: bool) -> None:
    """
    Sample Sundar Kand-style path lines for pipeline dogfood.
    Full SK mūla must be collated from Gita Press PIN before public release.
    """
    sk_open = [
        {
            "id": "sk-s01-v01",
            "text": "जामवंत के बचन सुहाए। सुनि हनुमंत हृदय अति भाए॥",
        },
        {
            "id": "sk-s01-v02",
            "text": "तब लगि मोहि आनि सुधि कहि। कौतुक कहि समुझाए उर लहि॥",
        },
        {
            "id": "sk-s01-v03",
            "text": "सुनु हनुमंत बल बुद्धि निधाना। राम काज करिबे को आना॥",
        },
        {
            "id": "sk-s01-v04",
            "text": "राम काज लगि तव अवतारा। सुनत भए मगन छमा अपारा॥",
        },
        {
            "id": "sk-s01-v05",
            "text": "जयति पवन कुमार बलवाना। राम भगत अति सुंदर ज्ञाना॥",
        },
    ]
    out_dir = MEDIA / "sundar-kand"
    bed = ROOT / "media" / "audio" / "ambience" / "path_bed_light_10m.wav"
    await generate_from_verses(
        sk_open,
        out_dir,
        "sundar_kand_sample_s01",
        voice,
        rate,
        pitch,
        bed if do_mix else None,
    )


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--target",
        choices=["chalisa", "sk-sample", "baan", "ashtak", "aarti", "mantra", "all", "extras"],
        default="all",
    )
    parser.add_argument("--voice", default=DEFAULT_VOICE)
    parser.add_argument("--rate", default=DEFAULT_RATE)
    parser.add_argument("--pitch", default=DEFAULT_PITCH)
    parser.add_argument("--mix-bed", action="store_true", help="Mix tanpura-like bed under voice")
    args = parser.parse_args()

    async def run_json(
        json_name: str,
        out_subdir: str,
        stem: str,
        voice: str,
        rate: str,
        pitch: str,
        do_mix: bool,
    ) -> None:
        data = json.loads(
            (ROOT / "scripts" / "texts" / json_name).read_text(encoding="utf-8")
        )
        out_dir = MEDIA / out_subdir
        bed = ROOT / "media" / "audio" / "ambience" / "path_bed_light_10m.wav"
        await generate_from_verses(
            data["verses"],
            out_dir,
            stem,
            voice,
            rate,
            pitch,
            bed if do_mix else None,
        )

    async def _run() -> None:
        if args.target in ("chalisa", "all"):
            print("=== Hanuman Chalisa TTS ===")
            await run_chalisa(args.voice, args.rate, args.pitch, args.mix_bed)
        if args.target in ("sk-sample", "all"):
            print("=== Sundar Kand sample TTS ===")
            await run_sk_sample(args.voice, args.rate, args.pitch, args.mix_bed)
        if args.target in ("baan", "extras", "all"):
            print("=== Bajrang Baan TTS ===")
            await run_json(
                "bajrang_baan_verses.json",
                "bajrang-baan",
                "bajrang_baan",
                args.voice,
                args.rate,
                args.pitch,
                args.mix_bed,
            )
        if args.target in ("ashtak", "extras", "all"):
            print("=== Sankatmochan Ashtak TTS ===")
            await run_json(
                "sankatmochan_ashtak_verses.json",
                "ashtak",
                "sankatmochan_ashtak",
                args.voice,
                args.rate,
                args.pitch,
                args.mix_bed,
            )
        if args.target in ("aarti", "extras", "all"):
            print("=== Hanuman Aarti TTS ===")
            await run_json(
                "hanuman_aarti_verses.json",
                "aarti",
                "hanuman_aarti",
                args.voice,
                args.rate,
                args.pitch,
                args.mix_bed,
            )
        if args.target in ("mantra", "extras", "all"):
            print("=== Om Hanumate Namah TTS ===")
            await run_json(
                "om_hanumate_verses.json",
                "mantra",
                "om_hanumate_namah",
                args.voice,
                "-22%",
                args.pitch,
                args.mix_bed,
            )

    asyncio.run(_run())
    print("Done.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
