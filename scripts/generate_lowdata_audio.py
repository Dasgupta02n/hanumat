#!/usr/bin/env python3
"""Generate low-data AAC (48k) siblings for path audio under apps/web/public/audio."""
from __future__ import annotations

import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "apps" / "web" / "public" / "audio"
FFMPEG = "ffmpeg"


def encode_low(src: Path) -> Path | None:
    if not src.exists() or src.name.endswith("_low.m4a"):
        return None
    out = src.with_name(src.stem + "_low.m4a")
    if out.exists() and out.stat().st_mtime >= src.stat().st_mtime:
        return out
    subprocess.run(
        [
            FFMPEG,
            "-y",
            "-i",
            str(src),
            "-c:a",
            "aac",
            "-b:a",
            "48k",
            "-ac",
            "1",
            str(out),
        ],
        check=True,
        capture_output=True,
    )
    print("lowdata", out.relative_to(ROOT))
    return out


def patch_meta(text_id: str, src_public: str, low_public: str) -> None:
    meta_path = ROOT / "content" / "texts" / text_id / "meta.json"
    if not meta_path.exists():
        return
    meta = json.loads(meta_path.read_text(encoding="utf-8"))
    audio = meta.setdefault("audio", {})
    if audio.get("src") == src_public:
        audio["lowDataSrc"] = low_public
    segs = audio.get("segments") or []
    for s in segs:
        if s.get("src") == src_public:
            s["lowDataSrc"] = low_public
    meta_path.write_text(json.dumps(meta, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def main() -> None:
    # walk public audio for m4a
    for m4a in PUBLIC.rglob("*.m4a"):
        if m4a.name.endswith("_low.m4a") or "ambience" in m4a.parts:
            continue
        low = encode_low(m4a)
        if not low:
            continue
        # public path
        rel = "/" + str(m4a.relative_to(PUBLIC.parent)).replace("\\", "/")
        low_rel = "/" + str(low.relative_to(PUBLIC.parent)).replace("\\", "/")
        # map folder → text id
        folder = m4a.parent.name
        mapping = {
            "chalisa": "hanuman-chalisa",
            "bajrang-baan": "bajrang-baan",
            "ashtak": "sankatmochan-ashtak",
            "aarti": "hanuman-aarti",
            "names": "hanuman-108-names",
            "bahuk": "hanuman-bahuk",
            "kavach": "panchmukhi-kavach",
            "maruti": "maruti-stotra",
            "valmiki": "valmiki-sundarakanda",
            "mantra": None,
        }
        if folder in mapping and mapping[folder]:
            patch_meta(mapping[folder], rel, low_rel)
        if folder.startswith("sk-") or "sundar-kand" in m4a.parts:
            # SK segments
            meta_path = ROOT / "content" / "texts" / "sundar-kand-manas" / "meta.json"
            meta = json.loads(meta_path.read_text(encoding="utf-8"))
            for s in meta.get("audio", {}).get("segments") or []:
                if s.get("src") == rel:
                    s["lowDataSrc"] = low_rel
            meta_path.write_text(json.dumps(meta, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("lowdata audio complete")


if __name__ == "__main__":
    main()
