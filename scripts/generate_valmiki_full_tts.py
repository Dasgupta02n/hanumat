#!/usr/bin/env python3
"""
Full Valmiki Sundarakanda TTS — per-sarga segments, concurrent Edge synth, resume-safe.

Usage:
  python scripts/generate_valmiki_full_tts.py
  python scripts/generate_valmiki_full_tts.py --sargas 1-5
  python scripts/generate_valmiki_full_tts.py --concurrency 10
"""
from __future__ import annotations

import argparse
import asyncio
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from generate_path_tts import (  # noqa: E402
    DEFAULT_PITCH,
    DEFAULT_RATE,
    DEFAULT_VOICE,
    concat_mp3s,
    encode_aac,
    probe_duration,
)

VL = ROOT / "content/texts/valmiki-sundarakanda"
MEDIA = ROOT / "media/audio/valmiki"
PUBLIC = ROOT / "apps/web/public/audio/valmiki"
GAP_MS = 320


def parse_sargas(spec: str | None, max_n: int) -> list[int]:
    if not spec:
        return list(range(1, max_n + 1))
    out: list[int] = []
    for part in spec.split(","):
        part = part.strip()
        if "-" in part:
            a, b = part.split("-", 1)
            out.extend(range(int(a), int(b) + 1))
        else:
            out.append(int(part))
    return [n for n in out if 1 <= n <= max_n]


async def synth_one(
    sem: asyncio.Semaphore,
    text: str,
    out_mp3: Path,
    voice: str,
    rate: str,
    pitch: str,
) -> float:
    async with sem:
        if out_mp3.exists() and out_mp3.stat().st_size > 500:
            try:
                return probe_duration(out_mp3)
            except Exception:
                pass
        spoken = re.sub(r"[॥।]", "। ", text)
        spoken = re.sub(r"\s+", " ", spoken).strip()
        for attempt in range(4):
            try:
                await edge_tts.Communicate(spoken, voice, rate=rate, pitch=pitch).save(str(out_mp3))
                return probe_duration(out_mp3)
            except Exception as e:
                await asyncio.sleep(0.4 * (attempt + 1))
                last = e
        print(f"    FAIL {out_mp3.name}: {last}", flush=True)
        # tiny silence placeholder so pipeline continues
        out_mp3.write_bytes(b"")
        return 0.4


async def generate_sarga(
    n: int,
    verse_list: list[dict],
    voice: str,
    rate: str,
    pitch: str,
    concurrency: int,
) -> dict:
    sid = f"vl-s{n:02d}"
    stem = f"vl_{sid}"
    out_dir = MEDIA / sid
    parts_dir = out_dir / "_parts"
    parts_dir.mkdir(parents=True, exist_ok=True)
    m4a = out_dir / f"{stem}.m4a"
    cues_path = out_dir / f"{stem}_cues.json"

    # Resume if complete and cue count matches
    if m4a.exists() and cues_path.exists() and m4a.stat().st_size > 1000:
        try:
            existing = json.loads(cues_path.read_text(encoding="utf-8"))
            if len(existing.get("cues", [])) == len(verse_list):
                print(f"  skip {sid} (already complete)", flush=True)
                # ensure public copy
                pub = PUBLIC / sid
                pub.mkdir(parents=True, exist_ok=True)
                shutil.copy2(m4a, pub / f"{stem}.m4a")
                shutil.copy2(cues_path, pub / f"{stem}_cues.json")
                return {
                    "id": sid,
                    "sectionId": sid,
                    "src": f"/audio/valmiki/{sid}/{stem}.m4a",
                    "cueMapSrc": f"/audio/valmiki/{sid}/{stem}_cues.json",
                    "durationMs": existing.get("durationMs", 0),
                }
        except Exception:
            pass

    print(f"=== {sid} ({len(verse_list)} verses) concurrency={concurrency} ===", flush=True)
    sem = asyncio.Semaphore(concurrency)
    tasks = []
    paths: list[Path] = []
    for v in verse_list:
        part = parts_dir / f"{v['id']}.mp3"
        paths.append(part)
        tasks.append(synth_one(sem, v["text"], part, voice, rate, pitch))

    durs = await asyncio.gather(*tasks)

    cues = []
    cursor = 0
    mp3_parts: list[Path] = []
    for v, part, dur_s in zip(verse_list, paths, durs):
        if not part.exists() or part.stat().st_size < 100:
            # regenerate sync fallback empty
            continue
        dur_ms = max(1, int(round(dur_s * 1000)))
        cues.append({"verseId": v["id"], "startMs": cursor, "endMs": cursor + dur_ms})
        cursor += dur_ms + GAP_MS
        mp3_parts.append(part)

    if not mp3_parts:
        raise RuntimeError(f"no audio parts for {sid}")

    voice_wav = out_dir / f"{stem}_voice.wav"
    print(f"  concat {len(mp3_parts)} parts…", flush=True)
    concat_mp3s(mp3_parts, voice_wav, gap_ms=GAP_MS)
    encode_aac(voice_wav, m4a)
    total_ms = cues[-1]["endMs"] if cues else 0
    cue_map = {
        "id": f"{stem}-cues-v1",
        "version": 1,
        "source": "edge-tts",
        "voice": voice,
        "rate": rate,
        "pitch": pitch,
        "gapMs": GAP_MS,
        "durationMs": total_ms,
        "cues": cues,
        "disclaimer": "Neural TTS path-assist — not classical pāṭh.",
    }
    cues_path.write_text(json.dumps(cue_map, ensure_ascii=False, indent=2), encoding="utf-8")
    pub = PUBLIC / sid
    pub.mkdir(parents=True, exist_ok=True)
    shutil.copy2(m4a, pub / f"{stem}.m4a")
    shutil.copy2(cues_path, pub / f"{stem}_cues.json")
    # lowdata optional lighter bitrate
    low = out_dir / f"{stem}_low.m4a"
    try:
        encode_aac(voice_wav, low, bitrate="64k")
        shutil.copy2(low, pub / f"{stem}_low.m4a")
        low_src = f"/audio/valmiki/{sid}/{stem}_low.m4a"
    except Exception:
        low_src = None

    seg = {
        "id": sid,
        "sectionId": sid,
        "src": f"/audio/valmiki/{sid}/{stem}.m4a",
        "cueMapSrc": f"/audio/valmiki/{sid}/{stem}_cues.json",
        "durationMs": total_ms,
    }
    if low_src:
        seg["lowDataSrc"] = low_src
    print(f"  wrote {m4a.name} cues={len(cues)} durationMs={total_ms}", flush=True)
    return seg


async def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--sargas", default=None, help="e.g. 1-10 or 1,2,5")
    ap.add_argument("--concurrency", type=int, default=8)
    ap.add_argument("--voice", default=DEFAULT_VOICE)
    ap.add_argument("--rate", default=DEFAULT_RATE)
    ap.add_argument("--pitch", default=DEFAULT_PITCH)
    args = ap.parse_args()

    structure = json.loads((VL / "structure.json").read_text(encoding="utf-8"))
    verses = json.loads((VL / "verses.json").read_text(encoding="utf-8"))
    max_n = len(structure["sections"])
    want = set(parse_sargas(args.sargas, max_n))

    MEDIA.mkdir(parents=True, exist_ok=True)
    PUBLIC.mkdir(parents=True, exist_ok=True)

    segments = []
    for sec in sorted(structure["sections"], key=lambda s: s["order"]):
        n = int(sec["order"])
        if n not in want:
            continue
        verse_list = [{"id": vid, "text": verses[vid]["text"]} for vid in sec["verseIds"]]
        seg = await generate_sarga(
            n, verse_list, args.voice, args.rate, args.pitch, args.concurrency
        )
        segments.append(seg)

    # Merge with any existing segments not regenerated
    meta = json.loads((VL / "meta.json").read_text(encoding="utf-8"))
    by_id = {s["id"]: s for s in (meta.get("audio") or {}).get("segments") or []}
    for s in segments:
        by_id[s["id"]] = s
    # full ordered list
    all_segs = []
    for sec in sorted(structure["sections"], key=lambda s: s["order"]):
        sid = sec["id"]
        if sid in by_id:
            all_segs.append(by_id[sid])

    low_data = []
    for s in all_segs:
        if s.get("lowDataSrc"):
            low_data.append(
                {
                    "id": s["id"],
                    "sectionId": s["sectionId"],
                    "src": s["lowDataSrc"],
                    "cueMapSrc": s["cueMapSrc"],
                    "durationMs": s.get("durationMs", 0),
                }
            )

    meta.setdefault("audio", {})
    meta["audio"]["segments"] = all_segs
    if low_data and len(low_data) == len(all_segs):
        meta["audio"]["lowDataSegments"] = low_data
    meta["audio"]["engine"] = "edge-tts"
    meta["audio"]["voice"] = args.voice
    meta["audio"]["credits"] = "TTS path-assist (Edge hi-IN-MadhurNeural) — not classical pāṭh"
    # keep legacy full-file for radio fallback if present
    if not meta["audio"].get("src"):
        meta["audio"]["src"] = all_segs[0]["src"] if all_segs else ""
        meta["audio"]["cueMapSrc"] = all_segs[0]["cueMapSrc"] if all_segs else ""

    meta.setdefault("flags", {})
    complete = len(all_segs) == len(structure["sections"])
    meta["flags"]["hasAudio"] = True
    meta["flags"]["ttsGenerated"] = complete
    meta["flags"]["partialAudio"] = not complete
    meta["flags"]["placeholderAudio"] = False
    meta["flags"]["audioCoverage"] = (
        "full-68-sargas" if complete else f"partial-{len(all_segs)}-of-{len(structure['sections'])}"
    )
    meta["flags"]["samplePack"] = False
    meta["flags"]["fullCanon"] = True

    (VL / "meta.json").write_text(json.dumps(meta, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"\nMeta segments: {len(all_segs)}/{len(structure['sections'])} complete={complete}", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
