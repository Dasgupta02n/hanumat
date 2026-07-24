#!/usr/bin/env python3
"""Resume remaining regional locales for SK + Valmiki + thin packs."""
from __future__ import annotations

import json
import sys
import time
from pathlib import Path

from deep_translator import GoogleTranslator

ROOT = Path(__file__).resolve().parents[1]
TEXTS = ROOT / "content" / "texts"
CACHE = ROOT / "content" / "cache" / "mt-hi-equivalent.json"

# text_id -> locales still needed
JOBS = {
    "sundar-kand-manas": ["kn", "pa", "or", "ml"],
    "valmiki-sundarakanda": ["or", "ml"],
    "hanuman-bahuk": ["or", "ml", "pa", "kn", "ta", "te", "bn", "gu", "mr"],
    "panchmukhi-kavach": ["or", "ml", "pa", "kn", "ta", "te", "bn", "gu", "mr"],
    "hanuman-108-names": ["or", "ml", "pa", "kn", "ta", "te", "bn", "gu", "mr"],
    "hanuman-bhajan-set": ["or", "ml", "pa", "kn", "ta", "te", "bn", "gu", "mr"],
}


def load_cache() -> dict:
    if CACHE.exists():
        return json.loads(CACHE.read_text(encoding="utf-8"))
    return {}


def save_cache(c: dict) -> None:
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
        out = tr.translate(text[:4500]) or text
        cache[key] = out
        time.sleep(0.03)
        return out
    except Exception as e:
        print(f"  MT fail {dest}: {e}", flush=True)
        # retry once
        time.sleep(1.0)
        try:
            tr = GoogleTranslator(source="hi", target=dest)
            out = tr.translate(text[:4500]) or text
            cache[key] = out
            return out
        except Exception as e2:
            print(f"  MT fail2 {dest}: {e2}", flush=True)
            cache[key] = text
            return text


def needs_refresh(text_id: str, loc: str, hi: dict) -> bool:
    p = TEXTS / text_id / "translations" / f"{loc}.json"
    if not p.exists():
        return True
    cur = json.loads(p.read_text(encoding="utf-8"))
    if len(cur) != len(hi):
        return True
    # stale dual-review frame for SK
    sample = next(iter(cur.values()), "")
    if "मूल पाठ" in sample or "मूळ पाठ" in sample or "समीक्षा" in sample or "dual-review" in sample.lower():
        return True
    if "GP-81-2025" in sample and "समीक्षा" in sample:
        return True
    # if first key meaning clearly not derived from current hi length ratio
    vid = next(iter(hi))
    if vid in cur:
        # old stub short frame vs new long hi
        if len(hi[vid]) > 80 and len(cur[vid]) < 60 and "GP-81" in cur[vid]:
            return True
    return False


def process(text_id: str, locales: list[str], cache: dict) -> None:
    d = TEXTS / text_id
    hi_path = d / "translations" / "hi.json"
    if not hi_path.exists():
        print(f"skip missing {text_id}")
        return
    hi = json.loads(hi_path.read_text(encoding="utf-8"))
    unique = sorted(set(hi.values()))
    todo = [loc for loc in locales if needs_refresh(text_id, loc, hi)]
    # always force listed if --force via env not needed; force remaining SK/VL
    if text_id in ("sundar-kand-manas", "valmiki-sundarakanda"):
        todo = locales
    print(f"=== {text_id}: {todo} ({len(unique)} unique) ===", flush=True)
    for loc in todo:
        print(f"  start {loc}", flush=True)
        uniq_map = {}
        for i, meaning in enumerate(unique, 1):
            uniq_map[meaning] = gtranslate(meaning, loc, cache)
            if i % 25 == 0:
                print(f"  {loc} {i}/{len(unique)}", flush=True)
                save_cache(cache)
        out = {vid: uniq_map.get(m, m) for vid, m in hi.items()}
        dest = d / "translations" / f"{loc}.json"
        dest.write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        save_cache(cache)
        print(f"  wrote {loc} {len(out)}", flush=True)


def main():
    cache = load_cache()
    only = sys.argv[1:]
    for text_id, locales in JOBS.items():
        if only and text_id not in only:
            continue
        process(text_id, locales, cache)
    save_cache(cache)
    print("ALL DONE", flush=True)


if __name__ == "__main__":
    main()
