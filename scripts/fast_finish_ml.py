#!/usr/bin/env python3
"""Fast parallel finish for remaining SK Malayalam locales."""
from __future__ import annotations

import json
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

from deep_translator import GoogleTranslator

ROOT = Path(__file__).resolve().parents[1]
HI = ROOT / "content/texts/sundar-kand-manas/translations/hi.json"
OUT = ROOT / "content/texts/sundar-kand-manas/translations/ml.json"
CACHE = ROOT / "content/cache/mt-hi-equivalent.json"
LOC = "ml"
WORKERS = 12


def main() -> None:
    hi = json.loads(HI.read_text(encoding="utf-8"))
    cache = json.loads(CACHE.read_text(encoding="utf-8")) if CACHE.exists() else {}
    unique = sorted(set(hi.values()))
    missing = [t for t in unique if not cache.get(f"{LOC}::{t}")]
    print(f"unique={len(unique)} missing={len(missing)} workers={WORKERS}", flush=True)

    def one(text: str) -> tuple[str, str]:
        key = f"{LOC}::{text}"
        if key in cache and cache[key]:
            return text, cache[key]
        for attempt in range(3):
            try:
                out = GoogleTranslator(source="hi", target=LOC).translate(text[:4500]) or text
                return text, out
            except Exception as e:
                time.sleep(0.4 * (attempt + 1))
                last = e
        print(f"fail: {last}", flush=True)
        return text, text

    done = 0
    with ThreadPoolExecutor(max_workers=WORKERS) as ex:
        futs = [ex.submit(one, t) for t in missing]
        for fut in as_completed(futs):
            text, out = fut.result()
            cache[f"{LOC}::{text}"] = out
            done += 1
            if done % 25 == 0 or done == len(missing):
                print(f"  {done}/{len(missing)}", flush=True)
                CACHE.write_text(json.dumps(cache, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    # map all unique (including previously cached)
    uniq_map = {t: cache.get(f"{LOC}::{t}", t) for t in unique}
    # fill any still empty via sequential (should be none)
    for t in unique:
        if not uniq_map.get(t):
            uniq_map[t] = t

    out = {vid: uniq_map[m] for vid, m in hi.items()}
    OUT.write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    CACHE.write_text(json.dumps(cache, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"wrote ml {len(out)}", flush=True)
    sample = next(iter(out.values()))
    print("sample:", sample[:100], flush=True)


if __name__ == "__main__":
    main()
