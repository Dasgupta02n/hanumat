#!/usr/bin/env python3
"""
Machine-translate Valmiki Sundarakanda English meanings → Hindi.

Source: content/texts/valmiki-sundarakanda/translations/en.json
Output: content/texts/valmiki-sundarakanda/translations/hi.json (overwrite)
Cache:  content/cache/mt-valmiki-en-hi.json

- Unique EN strings only; map back to verse ids
- GoogleTranslator(source='en', target='hi') via deep_translator
- ThreadPoolExecutor with 12 workers
- Skip/keep short strings; on failure keep previous HI or EN fallback
- Does NOT touch verses.json
"""
from __future__ import annotations

import json
import re
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from threading import Lock

from deep_translator import GoogleTranslator

ROOT = Path(__file__).resolve().parents[1]
EN_PATH = ROOT / "content" / "texts" / "valmiki-sundarakanda" / "translations" / "en.json"
HI_PATH = ROOT / "content" / "texts" / "valmiki-sundarakanda" / "translations" / "hi.json"
CACHE_PATH = ROOT / "content" / "cache" / "mt-valmiki-en-hi.json"

WORKERS = 12
PROGRESS_EVERY = 50
MAX_RETRIES = 4
# Google Translate practical per-request limit; leave headroom
MAX_CHARS = 4500
# Skip machine translation for very short strings (keep as-is / previous)
MIN_TRANSLATE_LEN = 3

cache_lock = Lock()


def load_json(path: Path) -> dict:
    if not path.exists():
        return {}
    return json.loads(path.read_text(encoding="utf-8"))


def save_json(path: Path, data: dict | list) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        json.dumps(data, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def is_mostly_devanagari(text: str) -> bool:
    """True if string has meaningful Devanagari and little leftover English prose."""
    if not text or not text.strip():
        return False
    dev = len(re.findall(r"[\u0900-\u097F]", text))
    lat = len(re.findall(r"[A-Za-z]", text))
    if dev < 8:
        return False
    # Prefer previous HI only if it is predominantly Hindi (not the old EN stub wrappers)
    return dev >= lat * 1.5


def strip_legacy_hi_prefix(text: str) -> str:
    """If previous HI is '…भावार्थ (अंग्रेज़ी स्रोत से): EN', extract EN for fallback only."""
    m = re.search(r"भावार्थ\s*\([^)]*\)\s*:\s*(.+)$", text, re.DOTALL)
    if m:
        return m.group(1).strip()
    return text


def translate_one(en: str) -> str | None:
    """Translate EN → HI. Returns None on total failure."""
    text = en.strip()
    if len(text) < MIN_TRANSLATE_LEN:
        return text
    # Chunk very long strings
    chunks: list[str] = []
    remaining = text
    while remaining:
        if len(remaining) <= MAX_CHARS:
            chunks.append(remaining)
            break
        # break at sentence/space near limit
        cut = remaining.rfind(". ", 0, MAX_CHARS)
        if cut < MAX_CHARS // 2:
            cut = remaining.rfind(" ", 0, MAX_CHARS)
        if cut < MAX_CHARS // 2:
            cut = MAX_CHARS
        else:
            cut = cut + 1  # include space/period
        chunks.append(remaining[:cut].strip())
        remaining = remaining[cut:].strip()

    out_parts: list[str] = []
    for chunk in chunks:
        last_err: Exception | None = None
        translated = None
        for attempt in range(MAX_RETRIES):
            try:
                translated = GoogleTranslator(source="en", target="hi").translate(chunk)
                if translated and translated.strip():
                    break
            except Exception as e:  # noqa: BLE001
                last_err = e
                time.sleep(0.5 * (attempt + 1))
        if not translated or not str(translated).strip():
            if last_err:
                print(f"  WARN fail: {last_err!s:.120}", flush=True)
            return None
        out_parts.append(str(translated).strip())
    return " ".join(out_parts).strip()


def main() -> int:
    en = load_json(EN_PATH)
    prev_hi = load_json(HI_PATH)
    cache = load_json(CACHE_PATH)

    if not en:
        print("ERROR: en.json empty or missing", flush=True)
        return 1

    total_units = len(en)
    # Preserve insertion order of first-seen unique EN strings
    seen: dict[str, None] = {}
    for meaning in en.values():
        if meaning not in seen:
            seen[meaning] = None
    unique_list = list(seen.keys())
    n_unique = len(unique_list)

    # Best previous HI per unique EN (for failure fallback)
    prev_by_en: dict[str, str] = {}
    for vid, meaning in en.items():
        if meaning in prev_by_en:
            continue
        ph = prev_hi.get(vid, "")
        if is_mostly_devanagari(ph):
            prev_by_en[meaning] = ph

    # Resolve from cache first
    uniq_map: dict[str, str] = {}
    missing: list[str] = []
    for text in unique_list:
        cached = cache.get(text)
        if cached and str(cached).strip():
            uniq_map[text] = str(cached).strip()
        elif len(text.strip()) < MIN_TRANSLATE_LEN:
            uniq_map[text] = text
            cache[text] = text
        else:
            missing.append(text)

    print(
        f"Valmiki Sundarakanda EN→HI\n"
        f"  total units={total_units}\n"
        f"  unique EN={n_unique}\n"
        f"  cached={len(uniq_map)}\n"
        f"  to translate={len(missing)}\n"
        f"  workers={WORKERS}",
        flush=True,
    )

    translated_new = 0
    failed = 0
    done = 0

    def worker(text: str) -> tuple[str, str | None]:
        return text, translate_one(text)

    if missing:
        with ThreadPoolExecutor(max_workers=WORKERS) as ex:
            futs = {ex.submit(worker, t): t for t in missing}
            for fut in as_completed(futs):
                text, out = fut.result()
                done += 1
                if out:
                    uniq_map[text] = out
                    with cache_lock:
                        cache[text] = out
                    translated_new += 1
                else:
                    # Failure: previous HI if mostly Devanagari, else EN text
                    fallback = prev_by_en.get(text)
                    uniq_map[text] = fallback if fallback else text
                    failed += 1

                if done % PROGRESS_EVERY == 0 or done == len(missing):
                    with cache_lock:
                        save_json(CACHE_PATH, cache)
                    print(
                        f"  progress {done}/{len(missing)} "
                        f"(new ok={translated_new} fail={failed})",
                        flush=True,
                    )

    # Ensure every unique has a mapping
    for text in unique_list:
        if text not in uniq_map or not uniq_map[text]:
            uniq_map[text] = text

    # Map back to verse ids (preserve en.json key order)
    out_hi: dict[str, str] = {}
    for vid, meaning in en.items():
        out_hi[vid] = uniq_map.get(meaning, meaning)

    save_json(HI_PATH, out_hi)
    save_json(CACHE_PATH, cache)

    n_translated = sum(
        1
        for t in unique_list
        if t in cache and cache[t] and cache[t] != t and is_mostly_devanagari(str(cache[t]))
    )
    # Broader: any non-empty HI that differs from EN or is Devanagari
    n_hi_filled = sum(1 for v in out_hi.values() if v and is_mostly_devanagari(v))

    print("\n=== DONE ===", flush=True)
    print(f"total units:     {total_units}", flush=True)
    print(f"unique EN:       {n_unique}", flush=True)
    print(f"translated new:  {translated_new}", flush=True)
    print(f"failed (fallback): {failed}", flush=True)
    print(f"cache entries:   {len(cache)}", flush=True)
    print(f"hi.json keys:    {len(out_hi)}", flush=True)
    print(f"hi Devanagari-ish units: {n_hi_filled}", flush=True)
    print(f"unique with Devanagari cache: {n_translated}", flush=True)

    s1 = out_hi.get("vl-s01-v001", "<missing>")
    s68 = out_hi.get("vl-s68-v001", "<missing>")
    print(f"\nsample hi vl-s01-v001:\n  {s1}", flush=True)
    print(f"\nsample hi vl-s68-v001:\n  {s68}", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
