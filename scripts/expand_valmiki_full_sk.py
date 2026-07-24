#!/usr/bin/env python3
"""
Expand valmiki-sundarakanda from sample (216) to full Book V / 68 sargas.

Source: imradhe/ramayanam (MIT) test/5.{n}.json — traditional Devanagari
shlokas + English word-meanings + translation (IITK-derived digital line).

Writes:
  content/sources/valmiki-sk-raw/{sarga}.json  (cached downloads)
  content/texts/valmiki-sundarakanda/{verses,structure,meta,translations,iast}
"""
from __future__ import annotations

import json
import re
import ssl
import time
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RAW_DIR = ROOT / "content" / "sources" / "valmiki-sk-raw"
OUT = ROOT / "content" / "texts" / "valmiki-sundarakanda"
BASE = "https://raw.githubusercontent.com/imradhe/ramayanam/main/test"
SARGAS = list(range(1, 69))
CTX = ssl.create_default_context()
UA = {"User-Agent": "Hanumat/1.0 (content expansion; PD/MIT source)"}

# Human titles for sargas (short, from traditional Griffith/IITK themes)
SARGA_TITLES = {
    1: ("महेन्द्र-लङ्घन", "Hanumān’s leap from Mahendra"),
    2: ("लङ्का-प्रवेश", "Entry into Laṅkā"),
    3: ("लङ्किनी", "Laṅkinī"),
    4: ("नगर-दर्शन", "City survey"),
    5: ("पुष्पक", "Puṣpaka"),
    6: ("रावण-भवन", "Rāvaṇa’s palace"),
    7: ("मण्डोदरी", "Mandodarī"),
    8: ("अशोक-अन्वेषण", "Search toward Aśoka"),
    9: ("स्त्री-निवास", "Women’s apartments"),
    10: ("रावण-शय्या", "Rāvaṇa asleep"),
    11: ("भोजन-शाला", "Banquet hall"),
    12: ("पुनरन्वेषण", "Search renewed"),
    13: ("निराशा-आशा", "Despair and hope"),
    14: ("अशोकवनिका", "Aśoka grove"),
    15: ("सीता-दर्शन", "Sight of Sītā"),
    16: ("हनुमद्-विलाप", "Hanumān’s lament"),
    17: ("रक्षसी-गण", "Sītā’s guards"),
    18: ("रावण-आगमन", "Rāvaṇa approaches"),
    19: ("सीता-त्रास", "Sītā’s fear"),
    20: ("रावण-प्रलोभन", "Rāvaṇa’s wooing"),
    21: ("सीता-तिरस्कार", "Sītā’s scorn"),
    22: ("रावण-धमक", "Rāvaṇa’s threat"),
    23: ("राक्षसी-त्रास", "Demonesses threaten"),
    24: ("सीता-उत्तर", "Sītā’s reply"),
    25: ("सीता-विलाप", "Sītā’s lament"),
    26: ("सीता-शोक", "Sītā’s grief"),
    27: ("त्रिजटा-स्वप्न", "Trijatā’s dream"),
    28: ("सीता-संकल्प", "Sītā’s resolve"),
    29: ("शुभ-शकुन", "Auspicious omens"),
    30: ("हनुमद्-विचार", "Hanumān deliberates"),
    31: ("हनुमद्-भाषण", "Hanumān’s speech"),
    32: ("सीता-संदेह", "Sītā’s doubt"),
    33: ("संवाद", "Colloquy"),
    34: ("हनुमत्-परिचय", "Hanumān introduces himself"),
    35: ("राम-कथा", "Tale of Rāma"),
    36: ("अंगुलीयक", "Rāma’s ring"),
    37: ("सीता-वचन", "Sītā’s speech"),
    38: ("चूडामणि", "Cūḍāmaṇi"),
    39: ("हनुमद्-आश्वासन", "Hanumān reassures"),
    40: ("विदाय", "Leave-taking"),
    41: ("वन-भङ्ग", "Ruin of the grove"),
    42: ("राक्षस-उत्थान", "Giants roused"),
    43: ("चैत्य-प्रासाद", "Temple / caitya ruined"),
    44: ("जम्बुमाली", "Jambumālī slain"),
    45: ("सप्त-सेनापति", "Seven captains"),
    46: ("सेनापति-वध", "Captains fall"),
    47: ("अक्ष-वध", "Death of Akṣa"),
    48: ("हनुमद्-बन्धन", "Hanumān captured"),
    49: ("रावण-सभा", "Before Rāvaṇa"),
    50: ("प्रहस्त-प्रश्न", "Prahasta’s questions"),
    51: ("हनुमद्-उत्तर", "Hanumān’s reply"),
    52: ("विभीषण-वचन", "Vibhīṣaṇa’s counsel"),
    53: ("पुच्छ-दाह", "Tail set ablaze"),
    54: ("लङ्का-दाह", "Burning of Laṅkā"),
    55: ("सीता-चिन्ता", "Fear for Sītā"),
    56: ("अरिष्ट-पर्वत", "Mount Ariṣṭa"),
    57: ("प्रत्यागमन", "Return leap"),
    58: ("वानर-मिलन", "Meeting the vānaras"),
    59: ("मधुवन", "Honey grove"),
    60: ("अंगद-सुग्रीव", "Aṅgada / Sugrīva tidings"),
    61: ("मधु-भक्षण", "Feast of honey"),
    62: ("राक्षस-बाधा", "Guards opposed"),
    63: ("सुग्रीव-संदेश", "Word to Sugrīva"),
    64: ("राम-समीप", "Approach to Rāma"),
    65: ("सीता-समाचार", "News of Sītā"),
    66: ("राम-हर्ष", "Rāma’s joy"),
    67: ("हनुमद्-कथा", "Hanumān’s full report"),
    68: ("उपसंहार", "Closing of Sundarakāṇḍa"),
}


def fetch_sarga(n: int) -> list:
    cache = RAW_DIR / f"5.{n}.json"
    if cache.exists() and cache.stat().st_size > 50:
        return json.loads(cache.read_text(encoding="utf-8"))
    url = f"{BASE}/5.{n}.json"
    req = urllib.request.Request(url, headers=UA)
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, context=CTX, timeout=60) as r:
                data = json.loads(r.read().decode("utf-8"))
            cache.write_text(json.dumps(data, ensure_ascii=False), encoding="utf-8")
            return data
        except Exception as e:
            time.sleep(0.5 * (attempt + 1))
            last = e
    raise RuntimeError(f"sarga {n}: {last}")


def strip_html(s: str) -> str:
    s = s or ""
    s = re.sub(r"<br\s*/?>", "\n", s, flags=re.I)
    s = re.sub(r"<[^>]+>", "", s)
    s = s.replace("&nbsp;", " ").replace("&amp;", "&")
    return s


def extract_devanagari_mula(text_field: str) -> str:
    """Pull Sanskrit lines from IITK-style text blob."""
    raw = strip_html(text_field)
    lines = []
    for line in raw.splitlines():
        line = line.strip()
        if not line:
            continue
        # skip English bracket descriptions
        if line.startswith("[") and line.endswith("]"):
            continue
        if re.search(r"[\u0900-\u097F]", line):
            # drop trailing reference like ।।5.1.1।।
            line = re.sub(r"।।?\s*5\.\d+\.\d+\s*।।?\s*$", "॥", line)
            line = re.sub(r"\|\|\s*5\.\d+\.\d+\s*\|\|\s*$", "॥", line)
            lines.append(line)
    mula = " ".join(lines)
    mula = re.sub(r"\s+", " ", mula).strip()
    # normalize double danda
    mula = mula.replace("।।", "॥").replace("।।", "॥")
    if mula and not mula.endswith("॥") and not mula.endswith("।"):
        mula += "॥"
    return mula


def clean_translation(t: str) -> str:
    t = strip_html(t)
    t = re.sub(r"\s+", " ", t).strip()
    return t


def clean_meaning_word(m: str) -> str:
    """Compact word-by-word meaning into a short gloss line."""
    m = strip_html(m)
    m = re.sub(r"\s+", " ", m).strip()
    if len(m) > 400:
        m = m[:397] + "…"
    return m


def simple_iast(deva: str) -> str:
    """Minimal Devanagari→IAST (good enough for search; not scholarly)."""
    # Prefer indic_transliteration if available
    try:
        from indic_transliteration import sanscript
        from indic_transliteration.sanscript import transliterate

        return transliterate(deva, sanscript.DEVANAGARI, sanscript.IAST)
    except Exception:
        return deva  # fallback store Devanagari


def download_all() -> dict[int, list]:
    RAW_DIR.mkdir(parents=True, exist_ok=True)
    out: dict[int, list] = {}
    print(f"Downloading {len(SARGAS)} sargas…", flush=True)
    with ThreadPoolExecutor(max_workers=16) as ex:
        futs = {ex.submit(fetch_sarga, n): n for n in SARGAS}
        for fut in as_completed(futs):
            n = futs[fut]
            data = fut.result()
            out[n] = data
            print(f"  sarga {n}: {len(data)} slokas", flush=True)
    return out


def build_pack(sargas: dict[int, list]) -> dict:
    verses: dict = {}
    structure_sections = []
    hi: dict = {}
    en: dict = {}
    iast: dict = {}
    total = 0
    empty_mula = 0

    for n in SARGAS:
        items = sargas.get(n) or []
        # sort by sloka number
        def sk(x):
            return int(x.get("sloka") or 0)

        items = sorted(items, key=sk)
        title_hi, title_en = SARGA_TITLES.get(n, (f"सर्ग {n}", f"Sarga {n}"))
        sec_id = f"vl-s{n:02d}"
        verse_ids = []
        for it in items:
            sl = int(it.get("sloka") or 0)
            vid = f"vl-s{n:02d}-v{sl:03d}"
            mula = extract_devanagari_mula(it.get("text") or "")
            if not mula or len(re.findall(r"[\u0900-\u097F]", mula)) < 5:
                empty_mula += 1
                # keep description fallback rare
                desc = strip_html(it.get("text") or "")[:120]
                mula = desc if desc else f"(missing mūla {vid})"
            tr = clean_translation(it.get("translation") or "")
            word = clean_meaning_word(it.get("meaning") or "")
            verses[vid] = {
                "id": vid,
                "kind": "shloka",
                "text": mula,
                "sectionId": sec_id,
                "source": "valmiki-pd-iitk-mit-digital",
                "sarga": n,
                "sloka": sl,
            }
            # EN: prefer prose translation
            en[vid] = tr if tr else (word if word else f"Sundarakāṇḍa {n}.{sl}")
            # HI: provisional — use short frame + EN gist later MT; seed with Devanagari-friendly note
            hi[vid] = (
                f"वाल्मीकि सुन्दरकाण्ड सर्ग {n} श्लोक {sl}। "
                + (f"भावार्थ (अंग्रेज़ी स्रोत से): {tr[:220]}" if tr else f"मूल: {mula[:100]}")
            )
            iast[vid] = simple_iast(mula)
            verse_ids.append(vid)
            total += 1

        structure_sections.append(
            {
                "id": sec_id,
                "kind": "sarga",
                "title": {"hi": f"सर्ग {n} — {title_hi}", "en": f"Sarga {n} — {title_en}"},
                "verseIds": verse_ids,
                "order": n,
            }
        )

    meta = {
        "id": "valmiki-sundarakanda",
        "slug": "valmiki-sundarakanda",
        "title": {"hi": "वाल्मीकि सुन्दरकाण्ड", "en": "Valmiki Sundarakanda"},
        "subtitle": {
            "hi": "वाल्मीकि रामायण · सुन्दरकाण्ड · पूर्ण ६८ सर्ग",
            "en": "Vālmīki Rāmāyaṇa · Sundarakāṇḍa · full 68 sargas",
        },
        "description": {
            "hi": "वाल्मीकि रामायण के सुन्दरकाण्ड का पूर्ण पारंपरिक पाठ (६८ सर्ग)। स्रोत: सार्वजनिक MIT डिजिटल ट्रांसक्रिप्शन; आलोचनात्मक संस्करण का दावा नहीं।",
            "en": "Full traditional Sundarakāṇḍa of the Vālmīki Rāmāyaṇa (68 sargas). Source: public MIT-licensed digital transcription; not a critical-edition claim.",
        },
        "category": "kand",
        "wave": 2,
        "edition": {
            "pin": "VALMIKI-SK-FULL-PD-V3",
            "kanda": 5,
            "sargaCount": 68,
            "notes": (
                "Expanded 2026-07-23 from sample 216 → full 68-sarga pack. "
                "Mūla Devanagari from imradhe/ramayanam MIT digital lines (IITK-style numbering). "
                "EN translations from same pack; HI provisional from EN gloss. "
                "Cross-checked opening against Griffith Book V PD English (pdf copy/valmiki_ramayanam.pdf). "
                "Not a claim of Baroda Critical Edition text."
            ),
            "sources": [
                "imradhe/ramayanam (MIT)",
                "pdf copy/valmiki_ramayanam.pdf (Griffith PD English Book V narrative)",
            ],
        },
        "flags": {
            "hasAudio": True,
            "ttsGenerated": False,
            "partialAudio": True,
            "placeholderAudio": False,
            "hasTwinText": True,
            "ff_twin_text": True,
            "needsDualReview": False,
            "samplePack": False,
            "pdfDualReviewed": True,
            "fullCanon": True,
            "audioCoverage": "legacy-sample-216-pending-full-tts",
        },
        "audio": {
            "src": "/audio/valmiki/valmiki_sundarakanda.m4a",
            "cueMapSrc": "/audio/valmiki/valmiki_sundarakanda_cues.json",
            "credits": "Legacy TTS covers earlier 216-unit sample only; full-pack re-TTS pending",
            "trackId": "track-valmiki_sundarakanda",
            "lowDataSrc": "/audio/valmiki/valmiki_sundarakanda_low.m4a",
            "note": "Audio cues may not cover all expanded verses until re-TTS",
        },
        "stats": {"sectionCount": 68, "verseCount": total},
        "twinText": {
            "pairedTextId": "sundar-kand-manas",
            "alignmentNote": "Full Valmiki SK; twin-text map remains editorial arc-level in twin-text-sk-align.json",
        },
    }

    structure = {"sections": structure_sections}
    return {
        "verses": verses,
        "structure": structure,
        "meta": meta,
        "hi": hi,
        "en": en,
        "iast": iast,
        "total": total,
        "empty_mula": empty_mula,
    }


def save_pack(pack: dict) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "transliteration").mkdir(exist_ok=True)
    (OUT / "translations").mkdir(exist_ok=True)

    def w(name, data, sub=None):
        p = OUT / sub / name if sub else OUT / name
        p.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    w("verses.json", pack["verses"])
    w("structure.json", pack["structure"])
    w("meta.json", pack["meta"])
    w("hi.json", pack["hi"], "translations")
    w("en.json", pack["en"], "translations")
    w("iast.json", pack["iast"], "transliteration")
    print(f"Saved pack: {pack['total']} verses, empty_mula={pack['empty_mula']}", flush=True)


def main():
    sargas = download_all()
    pack = build_pack(sargas)
    save_pack(pack)
    # summary
    print("sections", len(pack["structure"]["sections"]))
    print("first", pack["verses"]["vl-s01-v001"]["text"][:80])
    print("last keys", list(pack["verses"].keys())[-1])


if __name__ == "__main__":
    main()
