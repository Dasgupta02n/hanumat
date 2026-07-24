#!/usr/bin/env python3
"""Regenerate IAST for all texts from Devanagari mūla via indic-transliteration."""
from __future__ import annotations

import json
from pathlib import Path

from indic_transliteration import sanscript
from indic_transliteration.sanscript import transliterate

ROOT = Path(__file__).resolve().parents[1]
TEXTS = ROOT / "content" / "texts"


def main() -> None:
    for d in sorted(TEXTS.iterdir()):
        if not d.is_dir():
            continue
        verses_path = d / "verses.json"
        if not verses_path.exists():
            continue
        verses = json.loads(verses_path.read_text(encoding="utf-8"))
        iast = {}
        for vid, v in verses.items():
            text = v.get("text") or ""
            try:
                iast[vid] = transliterate(text, sanscript.DEVANAGARI, sanscript.IAST)
            except Exception:
                iast[vid] = text
        out = d / "transliteration" / "iast.json"
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(json.dumps(iast, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(d.name, len(iast))
    print("IAST fixed for all texts")


if __name__ == "__main__":
    main()
