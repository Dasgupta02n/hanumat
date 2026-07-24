#!/usr/bin/env python3
"""Fast parallel HI→regional MT for Valmiki (8 stale locales)."""
from __future__ import annotations

import json
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

from deep_translator import GoogleTranslator

ROOT = Path(__file__).resolve().parents[1]
TR = ROOT / "content/texts/valmiki-sundarakanda/translations"
CACHE = ROOT / "content/cache/mt-hi-equivalent.json"
import sys

LOCALES = sys.argv[1:] if len(sys.argv) > 1 else ["or", "ml"]
WORKERS = 20


def main() -> None:
    hi = json.loads((TR / "hi.json").read_text(encoding="utf-8"))
    cache = json.loads(CACHE.read_text(encoding="utf-8")) if CACHE.exists() else {}
    unique = sorted(set(hi.values()))
    print(f"unique HI={len(unique)} locales={LOCALES} workers={WORKERS}", flush=True)

    for loc in LOCALES:
        missing = [t for t in unique if not cache.get(f"{loc}::{t}")]
        print(f"\n=== {loc}: missing {len(missing)}/{len(unique)} ===", flush=True)

        def one(text: str, loc=loc) -> tuple[str, str]:
            key = f"{loc}::{text}"
            if cache.get(key):
                return text, cache[key]
            for attempt in range(3):
                try:
                    out = GoogleTranslator(source="hi", target=loc).translate(text[:4500]) or text
                    return text, out
                except Exception:
                    time.sleep(0.25 * (attempt + 1))
            return text, text

        done = 0
        with ThreadPoolExecutor(max_workers=WORKERS) as ex:
            futs = [ex.submit(one, t) for t in missing]
            for fut in as_completed(futs):
                text, out = fut.result()
                cache[f"{loc}::{text}"] = out
                done += 1
                if done % 50 == 0 or done == len(missing):
                    print(f"  {loc} {done}/{len(missing)}", flush=True)
                    CACHE.write_text(
                        json.dumps(cache, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
                    )

        out_map = {t: cache.get(f"{loc}::{t}", t) for t in unique}
        data = {vid: out_map[m] for vid, m in hi.items()}
        (TR / f"{loc}.json").write_text(
            json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )
        print(f"  wrote {loc} {len(data)} sample={list(data.values())[0][:70]!r}", flush=True)
        CACHE.write_text(json.dumps(cache, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print("LOCALES DONE", flush=True)


if __name__ == "__main__":
    main()
