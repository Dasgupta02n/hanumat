#!/usr/bin/env python3
"""Fill te/kn/pa Valmiki meanings via MyMemory (EN→locale) when Google is rate-limited."""
from __future__ import annotations

import json
import re
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

from deep_translator import MyMemoryTranslator

ROOT = Path(__file__).resolve().parents[1]
TR = ROOT / "content/texts/valmiki-sundarakanda/translations"
CACHE = ROOT / "content/cache/mt-en-regional-mymemory.json"
# MyMemory language pairs
JOBS = {
    "te": ("te-IN", re.compile(r"[\u0C00-\u0C7F]")),
    "kn": ("kn-IN", re.compile(r"[\u0C80-\u0CFF]")),
    "pa": ("pa-IN", re.compile(r"[\u0A00-\u0A7F]")),
}
WORKERS = 6


def main() -> None:
    en = json.loads((TR / "en.json").read_text(encoding="utf-8"))
    hi = json.loads((TR / "hi.json").read_text(encoding="utf-8"))
    cache = json.loads(CACHE.read_text(encoding="utf-8")) if CACHE.exists() else {}
    unique_en = sorted(set(en.values()))
    print(f"unique EN={len(unique_en)}", flush=True)

    for loc, (mm_target, script_re) in JOBS.items():
        need = []
        for t in unique_en:
            key = f"{loc}::{t}"
            val = cache.get(key, "")
            if val and script_re.search(val):
                continue
            need.append(t)
        print(f"\n=== {loc} via MyMemory need={len(need)} ===", flush=True)

        def one(text: str, loc=loc, mm_target=mm_target, script_re=script_re) -> tuple[str, str]:
            for attempt in range(3):
                try:
                    out = MyMemoryTranslator(source="en-GB", target=mm_target).translate(text[:500])
                    if out and script_re.search(out):
                        return text, out
                    time.sleep(0.4 * (attempt + 1))
                except Exception:
                    time.sleep(0.6 * (attempt + 1))
            return text, ""

        done = ok = 0
        with ThreadPoolExecutor(max_workers=WORKERS) as ex:
            futs = [ex.submit(one, t) for t in need]
            for fut in as_completed(futs):
                text, out = fut.result()
                if out:
                    cache[f"{loc}::{text}"] = out
                    ok += 1
                done += 1
                if done % 40 == 0 or done == len(need):
                    print(f"  {loc} {done}/{len(need)} ok={ok}", flush=True)
                    CACHE.write_text(
                        json.dumps(cache, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
                    )
                time.sleep(0.05)  # gentle global pace

        # map verse -> translation; fallback HI if missing
        data = {}
        miss = 0
        for vid, eng in en.items():
            val = cache.get(f"{loc}::{eng}", "")
            if val and script_re.search(val):
                data[vid] = val
            else:
                data[vid] = hi.get(vid, eng)
                miss += 1
        (TR / f"{loc}.json").write_text(
            json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )
        sample = data["vl-s01-v001"]
        print(
            f"  wrote {loc} miss_fallback={miss} script={bool(script_re.search(sample))} {sample[:70]!r}",
            flush=True,
        )

    CACHE.write_text(json.dumps(cache, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("DONE", flush=True)


if __name__ == "__main__":
    main()
