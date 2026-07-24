#!/usr/bin/env python3
"""
Produce HI-equivalent meaning bundles for regional locales.

Source of truth: content/texts/*/translations/hi.json
Target locales: mr, gu, bn, ta, te, kn, pa, or, ml

Uses Google Translate via deep-translator (machine translation of Hindi meanings).
Owner-responsibility / provisional banner still applies; quality is HI-semantic, not ṭīkā.
"""
from __future__ import annotations

import json
import sys
import time
from pathlib import Path

from deep_translator import GoogleTranslator

ROOT = Path(__file__).resolve().parents[1]
TEXTS = ROOT / "content" / "texts"
CACHE = ROOT / "content" / "cache" / "mt-hi-equivalent.json"
TARGETS = {
    "mr": "mr",
    "gu": "gu",
    "bn": "bn",
    "ta": "ta",
    "te": "te",
    "kn": "kn",
    "pa": "pa",
    "or": "or",  # Odia
    "ml": "ml",
}

# retries
MAX_RETRIES = 5
SLEEP = 0.08


def load_cache() -> dict:
    if CACHE.exists():
        return json.loads(CACHE.read_text(encoding="utf-8"))
    return {}


def save_cache(cache: dict) -> None:
    CACHE.parent.mkdir(parents=True, exist_ok=True)
    CACHE.write_text(json.dumps(cache, ensure_ascii=False, indent=0), encoding="utf-8")


def translate_one(text: str, target: str, cache: dict) -> str:
    key = f"{target}::{text}"
    if key in cache and cache[key]:
        return cache[key]
    if not text or not text.strip():
        return text
    last_err = None
    for attempt in range(MAX_RETRIES):
        try:
            out = GoogleTranslator(source="hi", target=target).translate(text)
            if out:
                cache[key] = out
                return out
        except Exception as e:  # noqa: BLE001
            last_err = e
            time.sleep(0.5 * (attempt + 1))
    # fallback: keep Hindi so structure never empty (still HI-equivalent content)
    print(f"  WARN translate fail →{target}: {last_err}")
    cache[key] = text
    return text


def process_text(text_dir: Path, cache: dict, only_locale: str | None) -> None:
    hi_path = text_dir / "translations" / "hi.json"
    if not hi_path.exists():
        return
    hi = json.loads(hi_path.read_text(encoding="utf-8"))
    items = list(hi.items())
    print(f"\n=== {text_dir.name} ({len(items)} meanings) ===")
    for loc, gcode in TARGETS.items():
        if only_locale and loc != only_locale:
            continue
        out: dict[str, str] = {}
        # resolve from cache first
        pending_ids: list[str] = []
        pending_texts: list[str] = []
        for vid, meaning in items:
            key = f"{gcode}::{meaning}"
            if key in cache and cache[key]:
                out[vid] = cache[key]
            else:
                pending_ids.append(vid)
                pending_texts.append(meaning)

        # batch remaining
        batch_size = 15
        for i in range(0, len(pending_ids), batch_size):
            ids = pending_ids[i : i + batch_size]
            texts = pending_texts[i : i + batch_size]
            for attempt in range(MAX_RETRIES):
                try:
                    if len(texts) == 1:
                        results = [
                            GoogleTranslator(source="hi", target=gcode).translate(texts[0])
                        ]
                    else:
                        results = GoogleTranslator(source="hi", target=gcode).translate_batch(
                            texts
                        )
                    for vid, src, res in zip(ids, texts, results):
                        val = res if res else src
                        out[vid] = val
                        cache[f"{gcode}::{src}"] = val
                    break
                except Exception as e:  # noqa: BLE001
                    if attempt == MAX_RETRIES - 1:
                        print(f"  WARN batch {loc}: {e} — per-item fallback")
                        for vid, src in zip(ids, texts):
                            out[vid] = translate_one(src, gcode, cache)
                    else:
                        time.sleep(0.8 * (attempt + 1))
            save_cache(cache)
            done = len(out)
            print(f"  {loc}: {done}/{len(items)}")
            time.sleep(SLEEP)

        # ensure all keys present
        for vid, meaning in items:
            if vid not in out:
                out[vid] = translate_one(meaning, gcode, cache)

        dest = text_dir / "translations" / f"{loc}.json"
        dest.write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        save_cache(cache)
        print(f"  wrote {dest.relative_to(ROOT)} ({len(out)})")


def main() -> int:
    only_text = sys.argv[1] if len(sys.argv) > 1 else None
    only_locale = sys.argv[2] if len(sys.argv) > 2 else None
    cache = load_cache()
    dirs = sorted([d for d in TEXTS.iterdir() if d.is_dir()])
    for d in dirs:
        if only_text and d.name != only_text:
            continue
        process_text(d, cache, only_locale)
    save_cache(cache)
    print("\nDone. HI-equivalent MT written for regional locales.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
