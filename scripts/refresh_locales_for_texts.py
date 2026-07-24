#!/usr/bin/env python3
"""Force-refresh HI-equivalent regional locales for selected texts."""
from __future__ import annotations

import json
import sys
import time
from pathlib import Path

from deep_translator import GoogleTranslator

ROOT = Path(__file__).resolve().parents[1]
TEXTS = ROOT / "content" / "texts"
CACHE = ROOT / "content" / "cache" / "mt-hi-equivalent.json"
LOCALES = {
    "mr": "mr",
    "gu": "gu",
    "bn": "bn",
    "ta": "ta",
    "te": "te",
    "kn": "kn",
    "pa": "pa",
    "or": "or",
    "ml": "ml",
}


def load_cache():
    if CACHE.exists():
        return json.loads(CACHE.read_text(encoding="utf-8"))
    return {}


def save_cache(c):
    CACHE.parent.mkdir(parents=True, exist_ok=True)
    CACHE.write_text(json.dumps(c, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def gtranslate(text: str, dest: str, cache: dict) -> str:
    text = (text or "").strip()
    if not text:
        return text
    key = f"{dest}::{text}"
    if key in cache and cache[key]:
        return cache[key]
    try:
        tr = GoogleTranslator(source="hi", target=dest)
        # deep-translator limit
        piece = text[:4500]
        out = tr.translate(piece) or text
        cache[key] = out
        time.sleep(0.05)
        return out
    except Exception as e:
        print("  MT fail:", e)
        cache[key] = text
        return text


def process(text_id: str):
    d = TEXTS / text_id
    hi = json.loads((d / "translations" / "hi.json").read_text(encoding="utf-8"))
    cache = load_cache()
    unique = sorted(set(hi.values()))
    print(f"=== {text_id} ({len(hi)} units, {len(unique)} unique HI) ===")
    for loc, code in LOCALES.items():
        uniq_map = {}
        for i, meaning in enumerate(unique, 1):
            uniq_map[meaning] = gtranslate(meaning, code, cache)
            if i % 50 == 0:
                print(f"  {loc} unique {i}/{len(unique)}")
                save_cache(cache)
        out = {vid: uniq_map.get(m, m) for vid, m in hi.items()}
        dest = d / "translations" / f"{loc}.json"
        dest.write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        save_cache(cache)
        print(f"  wrote {loc} {len(out)}")
    save_cache(cache)


if __name__ == "__main__":
    targets = sys.argv[1:] or [
        "sundar-kand-manas",
        "valmiki-sundarakanda",
        "hanuman-bahuk",
        "panchmukhi-kavach",
        "hanuman-108-names",
        "hanuman-bhajan-set",
    ]
    for t in targets:
        process(t)
    print("done")
