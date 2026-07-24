#!/usr/bin/env python3
"""
Generate regional locale meaning files for valmiki-sundarakanda from Hindi (HI-equivalent MT).

Locales: mr, gu, bn, ta, te, kn, pa, or, ml
Source: content/texts/valmiki-sundarakanda/translations/hi.json
Outputs: content/texts/valmiki-sundarakanda/translations/{loc}.json
Cache: content/cache/mt-hi-equivalent.json  key = "{loc}::{hi_text}"

Uses Google Translate free gtx endpoint (source=hi, target=locale).
Unique HI strings only; ThreadPoolExecutor 10 workers per locale sequentially;
resume from cache; write full json when each locale completes.
"""
from __future__ import annotations

import json
import time
import urllib.error
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from threading import Lock

ROOT = Path(__file__).resolve().parents[1]
HI_PATH = ROOT / "content" / "texts" / "valmiki-sundarakanda" / "translations" / "hi.json"
OUT_DIR = ROOT / "content" / "texts" / "valmiki-sundarakanda" / "translations"
CACHE_PATH = ROOT / "content" / "cache" / "mt-hi-equivalent.json"

LOCALES = ["mr", "gu", "bn", "ta", "te", "kn", "pa", "or", "ml"]
# gtx free endpoint codes: or → or (Odia)
LOCALE_GTX = {
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
WORKERS = 10
MAX_RETRIES = 8
MIN_INTERVAL = 0.12  # gtx is more tolerant; still pace a bit
HYBRID_MARKER = "भावार्थ (अंग्रेज़ी"
WAIT_SECONDS = 600
POLL_INTERVAL = 30
GTX_URL = "https://translate.googleapis.com/translate_a/single"
UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
)

_rate_lock = Lock()
_last_request = 0.0
_pause_until = 0.0


def load_cache() -> dict:
    if CACHE_PATH.exists():
        return json.loads(CACHE_PATH.read_text(encoding="utf-8"))
    return {}


def save_cache(cache: dict) -> None:
    CACHE_PATH.parent.mkdir(parents=True, exist_ok=True)
    tmp = CACHE_PATH.with_suffix(".json.tmp")
    payload = json.dumps(cache, ensure_ascii=False, separators=(",", ":"))
    tmp.write_text(payload, encoding="utf-8")
    tmp.replace(CACHE_PATH)


def assess_hi(path: Path) -> tuple[int, int, float, float]:
    data = json.loads(path.read_text(encoding="utf-8"))
    vals = list(data.values())
    n = len(vals)
    hybrid = sum(1 for v in vals if HYBRID_MARKER in v)
    avg_len = sum(len(v) for v in vals) / n if n else 0.0
    mtime = path.stat().st_mtime
    return n, hybrid, avg_len, mtime


def wait_for_hi_if_needed() -> None:
    if not HI_PATH.exists():
        raise SystemExit(f"Missing HI source: {HI_PATH}")

    n, hybrid, avg_len, mtime = assess_hi(HI_PATH)
    print(
        f"HI initial: keys={n} hybrid={hybrid}/{n} avg_len={avg_len:.1f} mtime={mtime}",
        flush=True,
    )
    if hybrid < n * 0.5:
        print("HI looks sufficiently natural; proceeding.", flush=True)
        return

    print(
        f"HI still hybrid for MOST entries ({hybrid}/{n}). "
        f"Waiting up to {WAIT_SECONDS}s, polling every {POLL_INTERVAL}s...",
        flush=True,
    )
    start = time.time()
    prev_mtime = mtime
    prev_avg = avg_len
    while time.time() - start < WAIT_SECONDS:
        time.sleep(POLL_INTERVAL)
        n, hybrid, avg_len, mtime = assess_hi(HI_PATH)
        elapsed = int(time.time() - start)
        print(
            f"  poll +{elapsed}s: hybrid={hybrid}/{n} avg_len={avg_len:.1f} "
            f"mtime_changed={mtime != prev_mtime} avg_changed={abs(avg_len - prev_avg) > 1.0}",
            flush=True,
        )
        if hybrid < n * 0.5:
            print("HI improved (majority no longer hybrid); proceeding.", flush=True)
            return
        prev_mtime, prev_avg = mtime, avg_len

    n, hybrid, avg_len, _ = assess_hi(HI_PATH)
    print(
        f"Wait budget exhausted; proceeding with current HI "
        f"(hybrid={hybrid}/{n} avg_len={avg_len:.1f}).",
        flush=True,
    )


def rate_limit() -> None:
    global _last_request
    while True:
        with _rate_lock:
            now = time.time()
            if now < _pause_until:
                sleep_for = _pause_until - now
            else:
                sleep_for = MIN_INTERVAL - (now - _last_request)
                if sleep_for <= 0:
                    _last_request = time.time()
                    return
        time.sleep(min(max(sleep_for, 0.01), 1.0))


def trip_circuit(seconds: float) -> None:
    global _pause_until
    with _rate_lock:
        target = time.time() + seconds
        if target > _pause_until:
            _pause_until = target
            print(f"  circuit-breaker: pause {seconds:.0f}s", flush=True)


def gtx_translate(text: str, target: str, source: str = "hi") -> str:
    """Google free gtx client — same semantics as deep_translator GoogleTranslator."""
    # Chunk long texts (~4500 chars practical)
    if len(text) <= 4500:
        return _gtx_once(text, target, source)
    # Split on sentence boundaries when possible
    parts: list[str] = []
    buf = ""
    for ch in text:
        buf += ch
        if len(buf) >= 4000 and ch in "।.!?\n":
            parts.append(buf)
            buf = ""
    if buf:
        parts.append(buf)
    return "".join(_gtx_once(p, target, source) for p in parts)


def _gtx_once(text: str, target: str, source: str) -> str:
    params = urllib.parse.urlencode(
        {
            "client": "gtx",
            "sl": source,
            "tl": target,
            "dt": "t",
            "q": text,
        }
    )
    req = urllib.request.Request(
        f"{GTX_URL}?{params}",
        headers={"User-Agent": UA},
        method="GET",
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        raw = resp.read().decode("utf-8")
    data = json.loads(raw)
    # data[0] is list of [translated, original, ...]
    chunks = data[0] if data and data[0] else []
    return "".join(seg[0] for seg in chunks if seg and seg[0])


def translate_via_deep(text: str, target: str) -> str | None:
    """Preferred: deep_translator GoogleTranslator(source=hi, target=...)."""
    try:
        from deep_translator import GoogleTranslator
    except ImportError:
        return None
    try:
        out = GoogleTranslator(source="hi", target=target).translate(text[:4500])
        return out if out and out.strip() else None
    except Exception as e:  # noqa: BLE001
        msg = str(e).lower()
        if "too many" in msg or "429" in msg:
            raise
        return None


def translate_one(text: str, loc: str) -> str | None:
    """HI → locale via deep_translator GoogleTranslator, gtx fallback."""
    if not text or not str(text).strip():
        return text
    target = LOCALE_GTX[loc]
    last_err: Exception | None = None
    for attempt in range(MAX_RETRIES):
        try:
            rate_limit()
            # 1) deep_translator GoogleTranslator source=hi target=locale
            try:
                out = translate_via_deep(text, target)
                if out:
                    return out
            except Exception as e:  # rate-limit from deep_translator
                last_err = e
                msg = str(e).lower()
                if "too many" in msg or "429" in msg:
                    # Fall through to gtx (often still available)
                    pass
                else:
                    raise
            # 2) gtx free endpoint (same Google MT, more resilient)
            out = gtx_translate(text, target, "hi")
            if out and out.strip():
                return out
        except urllib.error.HTTPError as e:
            last_err = e
            if e.code in (429, 503, 502):
                pause = min(90.0, 3.0 * (2 ** min(attempt, 4)))
                trip_circuit(pause)
                time.sleep(pause)
            else:
                time.sleep(0.5 * (attempt + 1))
        except Exception as e:  # noqa: BLE001
            last_err = e
            msg = str(e).lower()
            if "too many" in msg or "429" in msg:
                pause = min(90.0, 3.0 * (2 ** min(attempt, 4)))
                trip_circuit(pause)
                time.sleep(pause)
            else:
                time.sleep(0.5 * (attempt + 1))
    print(f"  WARN translate fail →{loc}: {last_err}", flush=True)
    return None


def is_good_cache(src: str, val: str | None) -> bool:
    if not val or not str(val).strip():
        return False
    if val == src and len(src) > 40:
        return False
    return True


def scrub_identity_cache(cache: dict, unique_hi: set[str]) -> int:
    removed = 0
    for loc in LOCALES:
        for t in unique_hi:
            key = f"{loc}::{t}"
            if key in cache and not is_good_cache(t, cache.get(key)):
                del cache[key]
                removed += 1
    return removed


def process_locale(loc: str, hi: dict[str, str], cache: dict, cache_lock: Lock) -> None:
    unique = sorted(set(hi.values()))
    missing: list[str] = []
    for t in unique:
        key = f"{loc}::{t}"
        with cache_lock:
            cached = cache.get(key)
        if is_good_cache(t, cached):
            continue
        missing.append(t)

    print(
        f"\n=== {loc}: unique={len(unique)} cached={len(unique) - len(missing)} "
        f"to_translate={len(missing)} workers={WORKERS} ===",
        flush=True,
    )

    if missing:
        done = 0
        ok = 0
        fail = 0
        SAVE_EVERY = 50

        def worker(text: str) -> tuple[str, str | None]:
            return text, translate_one(text, loc)

        with ThreadPoolExecutor(max_workers=WORKERS) as ex:
            futs = [ex.submit(worker, t) for t in missing]
            for fut in as_completed(futs):
                try:
                    text, out = fut.result()
                except Exception as e:  # noqa: BLE001
                    print(f"  WARN future fail →{loc}: {e}", flush=True)
                    fail += 1
                    done += 1
                    continue
                done += 1
                if out is not None and is_good_cache(text, out):
                    with cache_lock:
                        cache[f"{loc}::{text}"] = out
                    ok += 1
                else:
                    fail += 1
                if done % SAVE_EVERY == 0 or done == len(missing):
                    with cache_lock:
                        try:
                            save_cache(cache)
                        except Exception as e:  # noqa: BLE001
                            print(f"  WARN cache save: {e}", flush=True)
                    print(
                        f"  {loc}: {done}/{len(missing)} (ok={ok} fail={fail})",
                        flush=True,
                    )

        still = [
            t
            for t in missing
            if not is_good_cache(t, cache.get(f"{loc}::{t}"))
        ]
        if still:
            print(f"  {loc}: sequential retry {len(still)} failures...", flush=True)
            time.sleep(5.0)
            for i, t in enumerate(still, 1):
                out = translate_one(t, loc)
                if out is not None and is_good_cache(t, out):
                    with cache_lock:
                        cache[f"{loc}::{t}"] = out
                if i % 25 == 0 or i == len(still):
                    with cache_lock:
                        save_cache(cache)
                    print(f"  {loc} retry: {i}/{len(still)}", flush=True)

        with cache_lock:
            save_cache(cache)

    uniq_map: dict[str, str] = {}
    missing_final = 0
    for t in unique:
        with cache_lock:
            val = cache.get(f"{loc}::{t}")
        if is_good_cache(t, val):
            uniq_map[t] = val  # type: ignore[assignment]
        else:
            uniq_map[t] = t
            missing_final += 1

    out = {vid: uniq_map[m] for vid, m in hi.items()}
    dest = OUT_DIR / f"{loc}.json"
    dest.write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    with cache_lock:
        save_cache(cache)
    sample = next(iter(out.values()), "")
    print(
        f"  wrote {dest.relative_to(ROOT)} ({len(out)}) hi_fallback={missing_final}",
        flush=True,
    )
    print(f"  sample: {sample[:120]}", flush=True)


def main(argv: list[str] | None = None) -> int:
    import sys

    args = list(sys.argv[1:] if argv is None else argv)
    only = [a for a in args if a in LOCALES]
    force = "--force" in args  # retranslate even if cache looks good
    locales = only or list(LOCALES)

    wait_for_hi_if_needed()

    hi = json.loads(HI_PATH.read_text(encoding="utf-8"))
    unique = set(hi.values())
    print(
        f"\nSource HI: {len(hi)} keys, {len(unique)} unique meanings → locales {locales}",
        flush=True,
    )

    cache = load_cache()
    removed = scrub_identity_cache(cache, unique)
    if removed:
        print(f"Scrubbed {removed} identity/failed cache entries", flush=True)
        save_cache(cache)

    if force:
        # Drop good cache for selected locales to force re-MT
        dropped = 0
        for loc in locales:
            for t in unique:
                key = f"{loc}::{t}"
                if key in cache:
                    del cache[key]
                    dropped += 1
        print(f"Force: dropped {dropped} cache keys for {locales}", flush=True)
        save_cache(cache)

    print(f"Cache entries: {len(cache)}", flush=True)

    # Smoke test gtx (Google free client; same hi→target as GoogleTranslator)
    try:
        probe = gtx_translate("हनुमान सीता को खोजते हैं।", "bn", "hi")
        print(f"gtx probe bn: {probe}", flush=True)
    except Exception as e:  # noqa: BLE001
        print(f"gtx probe FAIL: {e}", flush=True)
        raise SystemExit(1)

    cache_lock = Lock()
    t0 = time.time()
    for loc in locales:
        loc_t0 = time.time()
        process_locale(loc, hi, cache, cache_lock)
        print(f"  {loc} done in {time.time() - loc_t0:.1f}s", flush=True)

    save_cache(cache)
    print(f"\nALL DONE in {time.time() - t0:.1f}s. Cache size={len(cache)}", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
