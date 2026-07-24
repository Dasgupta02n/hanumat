#!/usr/bin/env python3
"""Generate per-section TTS for Sundar Kand Manas content package."""

from __future__ import annotations

import asyncio
import json
import sys
from pathlib import Path

# reuse helpers from generate_path_tts
ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from generate_path_tts import (  # noqa: E402
    DEFAULT_PITCH,
    DEFAULT_RATE,
    DEFAULT_VOICE,
    generate_from_verses,
)

SK = ROOT / "content" / "texts" / "sundar-kand-manas"
MEDIA = ROOT / "media" / "audio" / "sundar-kand"
BED = ROOT / "media" / "audio" / "ambience" / "path_bed_light_10m.wav"
PUB = ROOT / "apps" / "web" / "public" / "audio" / "sundar-kand"


async def main() -> int:
    structure = json.loads((SK / "structure.json").read_text(encoding="utf-8"))
    verses = json.loads((SK / "verses.json").read_text(encoding="utf-8"))
    segments = []
    MEDIA.mkdir(parents=True, exist_ok=True)
    PUB.mkdir(parents=True, exist_ok=True)

    for sec in structure["sections"]:
        sid = sec["id"]
        verse_list = []
        for vid in sec["verseIds"]:
            v = verses[vid]
            verse_list.append({"id": vid, "text": v["text"]})
        stem = f"sk_{sid}"
        print(f"=== {sid} ({len(verse_list)} verses) ===")
        cue_map = await generate_from_verses(
            verse_list,
            MEDIA / sid,
            stem,
            DEFAULT_VOICE,
            DEFAULT_RATE,
            DEFAULT_PITCH,
            BED if BED.exists() else None,
        )
        # copy to public
        src_m4a = MEDIA / sid / f"{stem}.m4a"
        src_cues = MEDIA / sid / f"{stem}_cues.json"
        dest_dir = PUB / sid
        dest_dir.mkdir(parents=True, exist_ok=True)
        if src_m4a.exists():
            (dest_dir / f"{stem}.m4a").write_bytes(src_m4a.read_bytes())
        if src_cues.exists():
            (dest_dir / f"{stem}_cues.json").write_bytes(src_cues.read_bytes())
        segments.append(
            {
                "id": sid,
                "sectionId": sid,
                "src": f"/audio/sundar-kand/{sid}/{stem}.m4a",
                "cueMapSrc": f"/audio/sundar-kand/{sid}/{stem}_cues.json",
                "durationMs": cue_map.get("durationMs", 0),
            }
        )

    meta_path = SK / "meta.json"
    meta = json.loads(meta_path.read_text(encoding="utf-8"))
    meta["audio"]["segments"] = segments
    meta_path.write_text(json.dumps(meta, ensure_ascii=False, indent=2), encoding="utf-8")
    print("Updated meta segments:", len(segments))
    return 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
