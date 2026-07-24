#!/usr/bin/env python3
"""Force re-MT Valmiki locales that still lack target script (te/kn/pa)."""
from __future__ import annotations

import json
import re
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

from deep_translator import GoogleTranslator

ROOT = Path(__file__).resolve().parents[1]
TR = ROOT / "content/texts/valmiki-sundarakanda/translations"
CACHE = ROOT / "content/cache/mt-hi-equivalent.json"
JOBS = {
    "te": re.compile(r"[\u0C00-\u0C7F]"),
    "kn": re.compile(r"[\u0C80-\u0CFF]"),
    "pa": re.compile(r"[\u0A00-\u0A7F]"),
}
WORKERS = 16


def main() -> None:
    hi = json.loads((TR / "hi.json").read_text(encoding="utf-8"))
    cache = json.loads(CACHE.read_text(encoding="utf-8")) if CACHE.exists() else {}
    unique = sorted(set(hi.values()))
    print(f"unique={len(unique)}", flush=True)

    for loc, script_re in JOBS.items():
        # drop bad cache entries for these HI strings
        need = []
        for t in unique:
            key = f"{loc}::{t}"
            val = cache.get(key, "")
            if val and script_re.search(val):
                continue
            if key in cache:
                del cache[key]
            need.append(t)
        print(f"\n=== {loc}: need {len(need)} ===", flush=True)

        def one(text: str, loc=loc, script_re=script_re) -> tuple[str, str]:
            for attempt in range(4):
                try:
                    out = GoogleTranslator(source="hi", target=loc).translate(text[:4500]) or ""
                    if out and script_re.search(out):
                        return text, out
                    # sometimes API returns source; retry
                    time.sleep(0.3 * (attempt + 1))
                except Exception:
                    time.sleep(0.5 * (attempt + 1))
            return text, text  # last resort

        done = 0
        ok = 0
        with ThreadPoolExecutor(max_workers=WORKERS) as ex:
            futs = [ex.submit(one, t) for t in need]
            for fut in as_completed(futs):
                text, out = fut.result()
                cache[f"{loc}::{text}"] = out
                done += 1
                if script_re.search(out or ""):
                    ok += 1
                if done % 50 == 0 or done == len(need):
                    print(f"  {loc} {done}/{len(need)} script_ok={ok}", flush=True)
                    CACHE.write_text(
                        json.dumps(cache, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
                    )

        data = {vid: cache.get(f"{loc}::{m}", m) for vid, m in hi.items()}
        (TR / f"{loc}.json").write_text(
            json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )
        sample = data["vl-s01-v001"]
        print(f"  wrote {loc} ok_script={bool(script_re.search(sample))} {sample[:70]!r}", flush=True)

    CACHE.write_text(json.dumps(cache, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("DONE", flush=True)


if __name__ == "__main__":
    main()
