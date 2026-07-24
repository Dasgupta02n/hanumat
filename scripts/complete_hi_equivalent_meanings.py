#!/usr/bin/env python3
"""
Finish HI-equivalent regional meanings quickly and correctly.

- Prefer Google translate of full HI meaning (cached).
- Sundar Kand: fixed wrapper template + keep mūla excerpt (Devanagari) for consistency.
- Drop legacy [XX·MT] English stubs.
"""
from __future__ import annotations

import json
import re
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

SK_RE = re.compile(
    r"^सुंदरकाण्ड \(GP-81-2025\): (.+) — मूल पाठ; विस्तृत अर्थ समीक्षा में।\s*$",
    re.DOTALL,
)

# Pre-translated HI wrapper → each locale (HI-equivalent frames)
SK_FRAME = {
    "mr": ("सुंदरकांड (GP-81-2025): ", " — मूळ पाठ; सविस्तर अर्थ समीक्षेत."),
    "gu": ("સુંદરકાંડ (GP-81-2025): ", " — મૂળ પાઠ; વિસ્તૃત અર્થ સમીક્ષામાં."),
    "bn": ("সুন্দরকাণ্ড (GP-81-2025): ", " — মূল পাঠ; বিস্তারিত অর্থ পর্যালোচনায়।"),
    "ta": ("சுந்தரகாண்டம் (GP-81-2025): ", " — மூல பாடம்; விரிவான பொருள் மதிப்பாய்வில்."),
    "te": ("సుందరకాండ (GP-81-2025): ", " — మూల పాఠం; విస్తృత అర్థ సమీక్షలో."),
    "kn": ("ಸುಂದರಕಾಂಡ (GP-81-2025): ", " — ಮೂಲ ಪಾಠ; ವಿಸ್ತೃತ ಅರ್ಥ ವಿಮರ್ಶೆಯಲ್ಲಿ."),
    "pa": ("ਸੁੰਦਰਕਾਂਡ (GP-81-2025): ", " — ਮੂਲ ਪਾਠ; ਵਿਸਤ੍ਰਿਤ ਅਰਥ ਸਮੀਖਿਆ ਵਿੱਚ।"),
    "or": ("ସୁନ୍ଦରକାଣ୍ଡ (GP-81-2025): ", " — ମୂଳ ପାଠ; ବିସ୍ତୃତ ଅର୍ଥ ସମୀକ୍ଷାରେ।"),
    "ml": ("സുന്ദരകാണ്ഡം (GP-81-2025): ", " — മൂല പാഠം; വിശദമായ അർത്ഥ അവലോകനത്തിൽ."),
}

VAL_RE = re.compile(
    r"^पारंपरिक पाठ — (.+) · पद (\d+) \(अनंतिम सरल अर्थ; स्वामी-उत्तरदायित्व\)।\s*$"
)
# Also bahuk style from expand script
TRAD_RE = re.compile(
    r"^पारंपरिक पाठ — (.+) · पद (\d+) \(अनंतिम सरल अर्थ; स्वामी-उत्तरदायित्व\)।\s*$"
)

TRAD_FRAME = {
    "mr": ("पारंपरिक पाठ — ", " · श्लोक ", " (तात्पुरता साधा अर्थ; मालक-जबाबदारी)."),
    "gu": ("પારંપરિક પાઠ — ", " · પદ ", " (કામચલાઉ સરળ અર્થ; માલિક-જવાબદારી)."),
    "bn": ("ঐতিহ্যবাহী পাঠ — ", " · পদ ", " (সাময়িক সরল অর্থ; মালিকানা-দায়িত্ব)."),
    "ta": ("பாரம்பரிய பாடல் — ", " · அடி ", " (தற்காலிக எளிய பொருள்; உரிமையாளர் பொறுப்பு)."),
    "te": ("సాంప్రదాయ పాఠం — ", " · పద్యం ", " (తాత్కాలిక సరళ అర్థం; యజమాని బాధ్యత)."),
    "kn": ("ಸಾಂಪ್ರದಾಯಿಕ ಪಾಠ — ", " · ಪದ ", " (ತಾತ್ಕಾಲಿಕ ಸರಳ ಅರ್ಥ; ಮಾಲೀಕ ಹೊಣೆ)."),
    "pa": ("ਪਰੰਪਰਾਗਤ ਪਾਠ — ", " · ਪਦ ", " (ਅਸਥਾਈ ਸਧਾਰਨ ਅਰਥ; ਮਾਲਕ-ਜ਼ਿੰਮੇਵਾਰੀ)."),
    "or": ("ପାରମ୍ପରିକ ପାଠ — ", " · ପଦ ", " (ସାମୟିକ ସରଳ ଅର୍ଥ; ମାଲିକ-ଦାୟିତ୍ୱ)."),
    "ml": ("പാരമ്പര്യ പാഠം — ", " · പദം ", " (താത്കാലിക ലളിത അർത്ഥം; ഉടമ ഉത്തരവാദിത്തം)."),
}


def load_cache() -> dict:
    if CACHE.exists():
        return json.loads(CACHE.read_text(encoding="utf-8"))
    return {}


def save_cache(c: dict) -> None:
    CACHE.parent.mkdir(parents=True, exist_ok=True)
    CACHE.write_text(json.dumps(c, ensure_ascii=False), encoding="utf-8")


def gtranslate(text: str, target: str, cache: dict) -> str:
    key = f"{target}::{text}"
    if key in cache and cache[key] and not str(cache[key]).startswith("["):
        return cache[key]
    for attempt in range(6):
        try:
            out = GoogleTranslator(source="hi", target=target).translate(text)
            if out:
                cache[key] = out
                return out
        except Exception:
            time.sleep(0.6 * (attempt + 1))
    cache[key] = text  # keep HI
    return text


def convert_meaning(hi: str, loc: str, cache: dict) -> str:
    m = SK_RE.match(hi.strip())
    if m:
        excerpt = m.group(1).strip()
        pre, post = SK_FRAME[loc]
        return f"{pre}{excerpt}{post}"

    m2 = TRAD_RE.match(hi.strip())
    if m2:
        title, num = m2.group(1), m2.group(2)
        # translate title fragment if needed (section title may be English in valmiki)
        pre, mid, post = TRAD_FRAME[loc]
        # keep section title; lightly translate if pure English
        sec = title
        if re.search(r"[A-Za-z]{3,}", title):
            sec = gtranslate(title, LOCALES[loc], cache)
        return f"{pre}{sec}{mid}{num}{post}"

    # generic HI → locale
    return gtranslate(hi, LOCALES[loc], cache)


def is_stale(sample: str) -> bool:
    s = sample or ""
    return s.startswith("[") and "MT" in s[:20]


def process_all() -> None:
    cache = load_cache()
    for d in sorted(TEXTS.iterdir()):
        if not d.is_dir():
            continue
        hi_path = d / "translations" / "hi.json"
        if not hi_path.exists():
            continue
        hi = json.loads(hi_path.read_text(encoding="utf-8"))
        # check if any locale still stale
        need = []
        for loc in LOCALES:
            p = d / "translations" / f"{loc}.json"
            if not p.exists():
                need.append(loc)
                continue
            cur = json.loads(p.read_text(encoding="utf-8"))
            sample = next(iter(cur.values()), "")
            if is_stale(sample) or len(cur) != len(hi):
                need.append(loc)
        if not need:
            print(f"skip OK {d.name}")
            continue
        print(f"=== {d.name} locales {need} ===")
        for loc in need:
            out = {}
            for i, (vid, meaning) in enumerate(hi.items(), 1):
                out[vid] = convert_meaning(meaning, loc, cache)
                if i % 50 == 0:
                    print(f"  {loc} {i}/{len(hi)}")
                    save_cache(cache)
            dest = d / "translations" / f"{loc}.json"
            dest.write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
            save_cache(cache)
            print(f"  wrote {loc} {len(out)}")
    save_cache(cache)
    print("All HI-equivalent regional meanings complete.")


if __name__ == "__main__":
    process_all()
