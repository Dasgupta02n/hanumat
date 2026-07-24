#!/usr/bin/env python3
import json
from pathlib import Path

meta = json.loads(Path("content/texts/valmiki-sundarakanda/meta.json").read_text(encoding="utf-8"))
struct = json.loads(Path("content/texts/valmiki-sundarakanda/structure.json").read_text(encoding="utf-8"))
segs = meta.get("audio", {}).get("segments") or []
print("segments", len(segs), "flags", meta.get("flags"))
print("total duration min", round(sum(s.get("durationMs", 0) for s in segs) / 60000, 1))
missing = []
for s in segs:
    p = Path("apps/web/public" + s["src"])
    c = Path("apps/web/public" + s["cueMapSrc"])
    if not p.exists() or p.stat().st_size < 1000:
        missing.append(s["id"] + ":audio")
    if not c.exists():
        missing.append(s["id"] + ":cues")
print("missing files", len(missing), missing[:10])
bad = []
for sec in struct["sections"]:
    sid = sec["id"]
    cuep = Path(f"apps/web/public/audio/valmiki/{sid}/vl_{sid}_cues.json")
    if not cuep.exists():
        bad.append(sid + ":nocue")
        continue
    cj = json.loads(cuep.read_text(encoding="utf-8"))
    n = len(cj.get("cues", []))
    e = len(sec["verseIds"])
    if n != e:
        bad.append(f"{sid}:{n}!={e}")
print("cue mismatches", len(bad), bad[:15])
print("sarga dirs", len(list(Path("media/audio/valmiki").glob("vl-s*"))))
