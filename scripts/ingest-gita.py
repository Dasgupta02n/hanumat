#!/usr/bin/env python3
"""Build Bhagavad Gita Path Studio pack from the Unlicense gita/gita dataset.

Mula + IAST from verse.json (ancient Sanskrit).
English: Shri Purohit Swami (1935, public domain).
Hindi: Swami Tejomayananda attribution in the same public dataset —
owner-responsible plain meaning, not a Chinmaya or Gita Press license.
"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT / "content" / "cache"
OUT = ROOT / "content" / "texts" / "bhagavad-gita"

CHAPTERS = [
    (1, "अर्जुनविषादयोग", "Arjuna’s grief"),
    (2, "साङ्ख्ययोग", "Sankhya yoga"),
    (3, "कर्मयोग", "Karma yoga"),
    (4, "ज्ञानकर्मसंन्यासयोग", "Knowledge and renunciation of action"),
    (5, "संन्यासयोग", "Renunciation"),
    (6, "ध्यानयोग", "Meditation"),
    (7, "ज्ञानविज्ञानयोग", "Knowledge and realisation"),
    (8, "अक्षरब्रह्मयोग", "The imperishable Brahman"),
    (9, "राजविद्याराजगुह्ययोग", "The royal secret"),
    (10, "विभूतियोग", "The divine glories"),
    (11, "विश्वरूपदर्शनयोग", "The cosmic form"),
    (12, "भक्तियोग", "Bhakti yoga"),
    (13, "क्षेत्रक्षेत्रज्ञविभागयोग", "Field and knower"),
    (14, "गुणत्रयविभागयोग", "The three gunas"),
    (15, "पुरुषोत्तमयोग", "The supreme person"),
    (16, "दैवासुरसम्पद्विभागयोग", "Divine and asuric"),
    (17, "श्रद्धात्रयविभागयोग", "Three kinds of faith"),
    (18, "मोक्षसंन्यासयोग", "Liberation and renunciation"),
]


def clean_en(s: str) -> str:
    s = (s or "").replace("\xa0", " ").strip()
    s = re.sub(r"^[\"']|[\"']$", "", s)
    return re.sub(r"\s+", " ", s).strip()


def clean_hi(s: str) -> str:
    s = (s or "").replace("\xa0", " ")
    s = re.sub(r"।।\d+\.\d+।।", " ", s)
    s = re.sub(r"\s+", " ", s).strip()
    return s


def clean_mula(s: str) -> str:
    s = (s or "").replace("\r", "")
    s = re.sub(r"।।\d+\.\d+।।", "", s)
    lines = [ln.strip() for ln in s.split("\n") if ln.strip()]
    return "\n".join(lines).strip()


def clean_iast(s: str) -> str:
    s = (s or "").replace("\r", "")
    lines = [ln.strip() for ln in s.split("\n") if ln.strip()]
    return " ".join(lines)


def main() -> None:
    verses_src = json.loads((CACHE / "gita-verse.json").read_text(encoding="utf-8"))
    trans = json.loads((CACHE / "gita-translation.json").read_text(encoding="utf-8"))
    en_map = {
        t["verse_id"]: clean_en(t["description"])
        for t in trans
        if t.get("author_id") == 21
    }
    hi_map = {
        t["verse_id"]: clean_hi(t["description"])
        for t in trans
        if t.get("author_id") == 17
    }

    verses: dict = {}
    hi: dict = {}
    en: dict = {}
    iast: dict = {}
    sections = []
    by_ch: dict[int, list[str]] = {n: [] for n, _, _ in CHAPTERS}

    for v in verses_src:
        ch = int(v["chapter_number"])
        num = int(v["verse_number"])
        vid = f"bg-{ch}-{num}"
        sid = f"bg-c{ch:02d}"
        mula = clean_mula(v["text"])
        if not mula:
            continue
        verses[vid] = {
            "id": vid,
            "kind": "shloka",
            "text": mula,
            "sectionId": sid,
        }
        iast[vid] = clean_iast(v.get("transliteration") or "")
        en[vid] = en_map.get(v["id"]) or en_map.get(v["verse_order"]) or ""
        hi[vid] = hi_map.get(v["id"]) or hi_map.get(v["verse_order"]) or ""
        if not en[vid]:
            en[vid] = (v.get("word_meanings") or "")[:400] or "—"
        if not hi[vid]:
            hi[vid] = "अर्थ अनंतिम — अंग्रेज़ी पंक्ति का सादा रूप। शास्त्रीय टीका नहीं।"
        by_ch[ch].append(vid)

    for n, hi_title, en_title in CHAPTERS:
        sid = f"bg-c{n:02d}"
        ids = by_ch[n]
        if not ids:
            continue
        sections.append(
            {
                "id": sid,
                "kind": "adhyaya",
                "title": {"hi": f"{n}. {hi_title}", "en": f"{n}. {en_title}"},
                "verseIds": ids,
                "order": n,
            }
        )

    missing_hi = sum(1 for k in verses if not hi.get(k) or hi[k].startswith("अर्थ अनंतिम"))
    missing_en = sum(1 for k in verses if en.get(k) in ("", "—"))
    print("verses", len(verses), "sections", len(sections), "hi-fallback", missing_hi, "en-empty", missing_en)

    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "translations").mkdir(exist_ok=True)
    (OUT / "transliteration").mkdir(exist_ok=True)

    meta = {
        "id": "bhagavad-gita",
        "slug": "bhagavad-gita",
        "deity": "sarva",
        "title": {"hi": "श्रीमद्भगवद्गीता", "en": "Bhagavad Gita"},
        "subtitle": {
            "hi": "१८ अध्याय · कुरुक्षेत्र संवाद",
            "en": "18 chapters · the dialogue at Kurukshetra",
        },
        "originalLang": "sa",
        "script": "Deva",
        "edition": {
            "pin": "BG-GITA-JSON-PUROHIT-TEJO-2026",
            "publisher": "Public-domain / Unlicense compilation (gita/gita)",
            "notes": (
                "Mula and IAST from the Unlicense gita/gita verse.json (ancient Sanskrit). "
                "English meaning: Shri Purohit Swami (1935, public domain). "
                "Hindi meaning: Tejomayananda attribution in the same public dataset — "
                "owner-responsible plain language, not a Chinmaya or Gita Press digital license. "
                "Not scholarly ṭīkā. Dual-check against a printed Gita when possible."
            ),
        },
        "flags": {
            "hasOfflinePack": False,
            "needsDualReview": True,
        },
        "stats": {"sectionCount": len(sections), "verseCount": len(verses)},
        "wave": 0,
        "category": "gita",
        "description": {
            "hi": "कृष्ण-अर्जुन संवाद — कर्म, भक्ति, ज्ञान। मूल, IAST, हिंदी-अंग्रेज़ी अर्थ।",
            "en": "The Krishna–Arjuna dialogue — action, devotion, knowledge. Mula, IAST, Hindi and English meaning.",
        },
    }
    (OUT / "meta.json").write_text(json.dumps(meta, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (OUT / "structure.json").write_text(
        json.dumps({"sections": sections}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    (OUT / "verses.json").write_text(json.dumps(verses, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (OUT / "translations" / "hi.json").write_text(
        json.dumps(hi, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    (OUT / "translations" / "en.json").write_text(
        json.dumps(en, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    (OUT / "transliteration" / "iast.json").write_text(
        json.dumps(iast, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print("wrote", OUT)


if __name__ == "__main__":
    main()
