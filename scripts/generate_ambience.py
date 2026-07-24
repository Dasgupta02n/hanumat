#!/usr/bin/env python3
"""Synthesize soft tanpura-like drones and path ambience beds with FFmpeg."""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "media" / "audio" / "ambience"
FFMPEG = "ffmpeg"


def run(cmd: list[str]) -> None:
    print(">", " ".join(cmd[:8]), "...")
    subprocess.run(cmd, check=True, capture_output=True)


def tanpura_bed(path: Path, duration: int = 600) -> None:
    """
    Soft Sa–Pa–Sa style drone (approx C3 / G3 / C4), gentle volume.
    Not a studio tanpura — a respectful synthetic bed for TTS mix.
    """
    # frequencies: C3=130.81, G3=196.00, C4=261.63, slight detune upper
    af = (
        f"sine=frequency=130.81:duration={duration},"
        f"volume=0.12[a];"
        f"sine=frequency=196.00:duration={duration},"
        f"volume=0.09[b];"
        f"sine=frequency=261.63:duration={duration},"
        f"volume=0.06[c];"
        f"sine=frequency=262.4:duration={duration},"
        f"volume=0.03[d];"
        f"[a][b][c][d]amix=inputs=4:duration=first:dropout_transition=0,"
        f"afade=t=in:st=0:d=3,afade=t=out:st={duration - 4}:d=4,"
        f"lowpass=f=1200,volume=0.7"
    )
    run(
        [
            FFMPEG,
            "-y",
            "-f",
            "lavfi",
            "-i",
            f"anullsrc=r=48000:cl=stereo",
            "-t",
            str(duration),
            "-filter_complex",
            af.replace("sine=", "sine=sample_rate=48000:"),
            "-c:a",
            "pcm_s24le",
            str(path),
        ]
    )


def tanpura_bed_v2(path: Path, duration: int = 600) -> None:
    """More reliable multi-sine via amovie-less lavfi chain."""
    # Generate mono mix then duplicate to stereo
    filter_complex = (
        f"sine=frequency=130.81:sample_rate=48000:duration={duration}[s1];"
        f"sine=frequency=196.00:sample_rate=48000:duration={duration}[s2];"
        f"sine=frequency=261.63:sample_rate=48000:duration={duration}[s3];"
        f"sine=frequency=98.00:sample_rate=48000:duration={duration}[s0];"
        f"[s0]volume=0.08[v0];[s1]volume=0.12[v1];[s2]volume=0.09[v2];[s3]volume=0.05[v3];"
        f"[v0][v1][v2][v3]amix=inputs=4:normalize=0,"
        f"lowpass=f=900,highpass=f=60,"
        f"afade=t=in:st=0:d=2.5,afade=t=out:st={duration - 3}:d=3,"
        f"volume=0.55,aformat=channel_layouts=stereo"
    )
    run(
        [
            FFMPEG,
            "-y",
            "-filter_complex",
            filter_complex,
            "-t",
            str(duration),
            "-c:a",
            "pcm_s24le",
            str(path),
        ]
    )


def soft_pulse(path: Path, duration: int = 600) -> None:
    """Very soft rhythmic breath (not tabla) — 4/4 low pulse for path pace."""
    # 72 BPM-ish: period ~0.833s
    filter_complex = (
        f"aevalsrc=exprs='0.04*sin(2*PI*55*t)*exp(-8*mod(t\\,0.833))':"
        f"s=48000:d={duration},"
        f"afade=t=in:st=0:d=2,afade=t=out:st={duration - 3}:d=3,"
        f"aformat=channel_layouts=stereo,volume=0.35"
    )
    run(
        [
            FFMPEG,
            "-y",
            "-filter_complex",
            filter_complex,
            "-t",
            str(duration),
            "-c:a",
            "pcm_s24le",
            str(path),
        ]
    )


def main() -> int:
    OUT.mkdir(parents=True, exist_ok=True)
    tanpura = OUT / "tanpura_sa_pa_10m.wav"
    pulse = OUT / "soft_pulse_10m.wav"
    print("Generating tanpura bed...")
    tanpura_bed_v2(tanpura, 600)
    print("generating soft pulse...")
    soft_pulse(pulse, 600)
    # Combined light bed
    combo = OUT / "path_bed_light_10m.wav"
    run(
        [
            FFMPEG,
            "-y",
            "-i",
            str(tanpura),
            "-i",
            str(pulse),
            "-filter_complex",
            "[0:a][1:a]amix=inputs=2:weights=1 0.35:normalize=0,volume=0.9",
            "-c:a",
            "pcm_s24le",
            str(combo),
        ]
    )
    # AAC loop-friendly encodes
    for wav in (tanpura, pulse, combo):
        aac = wav.with_suffix(".m4a")
        run(
            [
                FFMPEG,
                "-y",
                "-i",
                str(wav),
                "-c:a",
                "aac",
                "-b:a",
                "128k",
                str(aac),
            ]
        )
        print("wrote", aac)
    print("done ambience ->", OUT)
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except subprocess.CalledProcessError as e:
        sys.stderr.write(e.stderr.decode("utf-8", errors="replace") if e.stderr else str(e))
        raise SystemExit(1)
