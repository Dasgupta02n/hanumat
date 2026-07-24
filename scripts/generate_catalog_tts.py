#!/usr/bin/env python3
"""Generate TTS for any content/texts/* package missing public audio."""
from __future__ import annotations

import asyncio
import json
import shutil
import subprocess
import sys
from pathlib import Path

# reuse helpers from generate_path_tts
sys.path.insert(0, str(Path(__file__).resolve().parent))
from generate_path_tts import (  # type: ignore
    DEFAULT_PITCH,
    DEFAULT_RATE,
    DEFAULT_VOICE,
    encode_aac,
    generate_from_verses,
    ROOT,
)

MEDIA = ROOT / "media" / "audio"
PUBLIC = ROOT / "apps" / "web" / "public" / "audio"
TEXTS = ROOT / "content" / "texts"

# textId -> public audio folder + stem
TARGETS = [
    ("hanuman-108-names", "names", "hanuman_108_names"),
    ("hanuman-bahuk", "bahuk", "hanuman_bahuk"),
    ("panchmukhi-kavach", "kavach", "panchmukhi_kavach"),
    ("maruti-stotra", "maruti", "maruti_stotra"),
    ("hanuman-bhajan-set", "bhajan", "hanuman_dwadasha_nama"),
    ("valmiki-sundarakanda", "valmiki", "valmiki_sundarakanda"),
]


async def run_one(text_id: str, subdir: str, stem: str) -> None:
    base = TEXTS / text_id
    verses_map = json.loads((base / "verses.json").read_text(encoding="utf-8"))
    structure = json.loads((base / "structure.json").read_text(encoding="utf-8"))
    ordered = []
    for sec in sorted(structure["sections"], key=lambda s: s["order"]):
        for vid in sec["verseIds"]:
            v = verses_map[vid]
            ordered.append({"id": v["id"], "text": v["text"]})
    if not ordered:
        print("skip empty", text_id)
        return
    out_dir = MEDIA / subdir
    print(f"=== TTS {text_id} ({len(ordered)} verses) ===")
    await generate_from_verses(
        ordered,
        out_dir,
        stem,
        DEFAULT_VOICE,
        DEFAULT_RATE if text_id != "hanuman-108-names" else "-22%",
        DEFAULT_PITCH,
        None,
    )
    # copy to public
    pub = PUBLIC / subdir
    pub.mkdir(parents=True, exist_ok=True)
    m4a = out_dir / f"{stem}.m4a"
    cues = out_dir / f"{stem}_cues.json"
    shutil.copy2(m4a, pub / f"{stem}.m4a")
    shutil.copy2(cues, pub / f"{stem}_cues.json")
    # update meta
    meta_path = base / "meta.json"
    meta = json.loads(meta_path.read_text(encoding="utf-8"))
    meta["flags"]["hasAudio"] = True
    meta["flags"]["ttsGenerated"] = True
    meta["flags"]["placeholderAudio"] = False
    meta["audio"] = {
        "src": f"/audio/{subdir}/{stem}.m4a",
        "cueMapSrc": f"/audio/{subdir}/{stem}_cues.json",
        "credits": "TTS path-assist (Edge hi-IN-MadhurNeural) — not classical pāṭh",
        "trackId": f"track-{stem}",
    }
    meta_path.write_text(json.dumps(meta, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("public + meta updated for", text_id)


async def main() -> None:
    only = sys.argv[1] if len(sys.argv) > 1 else None
    for text_id, subdir, stem in TARGETS:
        if only and only not in (text_id, subdir, stem):
            continue
        await run_one(text_id, subdir, stem)
    print("All catalog TTS done.")


if __name__ == "__main__":
    asyncio.run(main())
