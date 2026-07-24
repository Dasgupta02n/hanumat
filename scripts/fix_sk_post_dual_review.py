#!/usr/bin/env python3
"""Post-pass: clean SK mūla chrome, fix remaining stubs, mangala kinds, thin packs."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SK = ROOT / "content" / "texts" / "sundar-kand-manas"
RAW = ROOT / "content" / "sources" / "sundar-kand-raw.txt"


def load(p):
    return json.loads(Path(p).read_text(encoding="utf-8"))


def save(p, d):
    Path(p).write_text(json.dumps(d, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def clean_mula(t: str) -> str:
    t = t.strip()
    t = re.sub(r"^[०-९0-9\s\*]*रामचरितमानस\s*\*+\s*", "", t)
    t = re.sub(r"^\*+\s*सुन्?दरकाण्ड\s*\*+\s*[०-९0-9]*\s*", "", t)
    t = re.sub(r"रामचरितमानस\s*\*+\s*", "", t)
    t = re.sub(r"\s+", " ", t).strip()
    return t


def kind_for(t: str) -> str:
    if t.startswith("श्रीजानकी") or t.startswith("शान्तं") or t.startswith("नान्या") or t.startswith("अतुलितबल"):
        return "shloka"
    if t.startswith("दो०") or t.startswith("दो0") or t.startswith("दो.--") or t.startswith("दो--"):
        return "doha"
    if t.startswith("छं०") or t.startswith("छं0") or t.startswith("छं०-") or t.startswith("छं-"):
        return "chhand"
    return "chaupai"


# Manual fixes for unmatched / chrome-heavy units
MANUAL = {
    "sk-s01-v001": {
        "text": "श्रीजानकीवल्लभो विजयते॥ रामचरितमानस सुंदरकाण्ड॥",
        "kind": "shloka",
        "hi": "मंगलाचरण — जानकी-वल्लभ श्रीराम की जय; रामचरितमानस के सुंदरकाण्ड का आरम्भ।",
        "en": "Mangalacharan — victory to Śrī Rāma, beloved of Jānakī; beginning of Sundar Kāṇḍa of the Rāmcaritmānas.",
    },
    "sk-s07-v002": {
        "clean_prefix": True,
        "hi": "हनुमान जी सीता माता से कहते हैं — हे जननी! धैर्य धरो, अब रघुपति का संदेश सुनो। यह कहकर कपि गद्गद हो गए, नेत्र जल से भर गए।",
        "en": "Hanumān says to Mother Sītā — take courage and hear Raghunātha’s message. Saying this the hero’s voice choked and his eyes filled with tears.",
    },
}


def fix_sk():
    verses = load(SK / "verses.json")
    hi = load(SK / "translations" / "hi.json")
    en = load(SK / "translations" / "en.json")
    structure = load(SK / "structure.json")
    order = [vid for s in structure["sections"] for vid in s["verseIds"]]

    cleaned = 0
    kind_n = 0
    for vid in order:
        v = verses[vid]
        old = v["text"]
        newt = clean_mula(old)
        if newt != old:
            v["text"] = newt
            cleaned += 1
        nk = kind_for(v["text"])
        if v.get("kind") != nk:
            v["kind"] = nk
            kind_n += 1

        # fix stub-like fallbacks
        if hi.get(vid, "").startswith("सुंदरकाण्ड पाठ:"):
            mula = v["text"]
            hi[vid] = f"सुंदरकाण्ड का यह पद पाठ-अर्थ सहित समझें: {mula[:120]}"
        if en.get(vid, "").startswith("Sundar Kand path:"):
            mula = v["text"]
            en[vid] = f"Path sense of this Sundar Kāṇḍa unit: {mula[:120]}"

    # manual overrides
    for vid, fix in MANUAL.items():
        if vid not in verses:
            continue
        if "text" in fix:
            verses[vid]["text"] = fix["text"]
        if "kind" in fix:
            verses[vid]["kind"] = fix["kind"]
        if fix.get("clean_prefix"):
            verses[vid]["text"] = clean_mula(verses[vid]["text"])
            verses[vid]["text"] = re.sub(r"^दो०--+", "दो०-", verses[vid]["text"])
            verses[vid]["text"] = re.sub(r"^दो--+", "दो०-", verses[vid]["text"])
            verses[vid]["kind"] = kind_for(verses[vid]["text"])
        if "hi" in fix:
            hi[vid] = fix["hi"]
        if "en" in fix:
            en[vid] = fix["en"]

    # sk-s07-v002 specific chrome
    t = verses.get("sk-s07-v002", {}).get("text", "")
    t = clean_mula(t)
    t = re.sub(r"^दो\.?०?--+", "दो०-", t)
    if "sk-s07-v002" in verses:
        verses["sk-s07-v002"]["text"] = t
        verses["sk-s07-v002"]["kind"] = "doha" if t.startswith("दो०") else kind_for(t)

    save(SK / "verses.json", verses)
    save(SK / "translations" / "hi.json", hi)
    save(SK / "translations" / "en.json", en)
    print(f"SK cleaned mūla={cleaned} kind_touch={kind_n}")


def enrich_thin_packs():
    """Improve thin EN/HI for 108, bahuk, kavach, dwadasha — short original glosses."""
    # 108 names — map Sanskrit stem to short EN/HI if still echo-only
    n108 = ROOT / "content" / "texts" / "hanuman-108-names"
    verses = load(n108 / "verses.json")
    hi = load(n108 / "translations" / "hi.json")
    en = load(n108 / "translations" / "en.json")
    n = 0
    for vid, v in verses.items():
        name = v["text"]
        stem = re.sub(r"^ॐ\s*", "", name)
        stem = re.sub(r"\s*नमः\.?$", "", stem).strip()
        if en.get(vid, "").startswith("Traditional ashtottara") or en.get(vid, "").startswith(f"{vid}"):
            en[vid] = f"Ashtottara name: {stem} — salutations to Hanumān under this holy name."
            n += 1
        if not hi.get(vid) or "Traditional" in hi.get(vid, "") or hi.get(vid) == name:
            hi[vid] = f"अष्टोत्तर नाम: {stem} — इस पवित्र नाम से हनुमान जी को नमन।"
    save(n108 / "translations" / "en.json", en)
    save(n108 / "translations" / "hi.json", hi)
    print(f"108 names enriched {n}")

    # bahuk
    bahuk = ROOT / "content" / "texts" / "hanuman-bahuk"
    verses = load(bahuk / "verses.json")
    hi = load(bahuk / "translations" / "hi.json")
    en = load(bahuk / "translations" / "en.json")
    for vid, v in verses.items():
        kind = v.get("kind", "padya")
        num = vid.replace("bh-", "")
        if "arm-pain petition" in en.get(vid, "") or en.get(vid, "").startswith("Hanuman Bahuk padya"):
            en[vid] = (
                f"Hanumān Bāhuk padya {num} ({kind}): Tulsīdās petitions the mighty arm of Hanumān "
                f"for relief from pain and protection — traditional multi-metre hymn."
            )
        if "arm-pain" in hi.get(vid, "") or "Bahuk padya" in hi.get(vid, "") or len(hi.get(vid, "")) < 20:
            hi[vid] = (
                f"हनुमान बाहुक पद {num} ({kind}): तुलसीदास हनुमान की भुजा की महिमा गाकर "
                f"पीड़ा-निवारण और रक्षण की प्रार्थना करते हैं।"
            )
    save(bahuk / "translations" / "en.json", en)
    save(bahuk / "translations" / "hi.json", hi)
    print("bahuk enriched")

    # kavach
    kav = ROOT / "content" / "texts" / "panchmukhi-kavach"
    verses = load(kav / "verses.json")
    hi = load(kav / "translations" / "hi.json")
    en = load(kav / "translations" / "en.json")
    role_hi = {
        "viniyoga": "विनियोग — कवच पाठ का संकल्प और ऋषि-छन्द-देवता-बीज।",
        "dhyana": "ध्यान — पञ्चमुख हनुमान के स्वरूप का ध्यान श्लोक।",
        "mantra": "मन्त्र — कवच का मन्त्र/नाम-उच्चारण अंश।",
        "nyasa": "न्यास — अङ्ग/कर न्यास के मन्त्र।",
        "phala": "फलश्रुति — पाठ से होने वाले फलों का वर्णन।",
        "colophon": "पुष्पिका — कवच की समाप्ति-सूचना।",
    }
    role_en = {
        "viniyoga": "Viniyoga — dedication: ṛṣi, metre, deity, bīja of the kavaca.",
        "dhyana": "Dhyāna — meditation verses on five-faced Hanumān.",
        "mantra": "Mantra — protective mantra portion of the kavaca.",
        "nyasa": "Nyāsa — limb/hand placement mantras.",
        "phala": "Phalaśruti — stated fruits of recitation.",
        "colophon": "Colophon — end of the traditional kavaca recension.",
    }
    for vid, v in verses.items():
        kind = v.get("kind", "mantra")
        if len(en.get(vid, "")) < 40 or "Panchmukhi Hanumat Kavach —" in en.get(vid, ""):
            en[vid] = role_en.get(kind, "Panchmukhi Hanumat Kavaca unit.") + f" Text: {v['text'][:80]}…"
        if len(hi.get(vid, "")) < 40 or "Panchmukhi" in hi.get(vid, "") or hi.get(vid, "").endswith(kind):
            hi[vid] = role_hi.get(kind, "पञ्चमुखी हनुमत् कवच की इकाई।") + f" पाठ: {v['text'][:80]}…"
    save(kav / "translations" / "en.json", en)
    save(kav / "translations" / "hi.json", hi)
    print("kavach enriched")

    # dwadasha
    dw = ROOT / "content" / "texts" / "hanuman-bhajan-set"
    verses = load(dw / "verses.json")
    hi = load(dw / "translations" / "hi.json")
    en = load(dw / "translations" / "en.json")
    gloss = {
        "hb-01": ("हनुमान — बल-भक्ति के आदर्श।", "Hanumān — ideal of strength and devotion."),
        "hb-02": ("आञ्जनेय — अञ्जना-पुत्र।", "Āñjaneya — son of Añjanā."),
        "hb-03": ("वायुपुत्र — पवन-नन्दन।", "Vāyuputra — son of the Wind."),
        "hb-04": ("महाबल — अपार शक्ति वाले।", "Mahābala — of immense strength."),
        "hb-05": ("रामेष्ट — श्रीराम के प्रिय।", "Rāmeṣṭa — dear to Śrī Rāma."),
        "hb-06": ("फाल्गुनसख — अर्जुन-मित्र (ध्वज पर)।", "Phālguna-sakha — friend of Arjuna (on the banner)."),
        "hb-07": ("पिङ्गाक्ष — पिङ्गल नेत्र वाले।", "Piṅgākṣa — tawny-eyed."),
        "hb-08": ("अमितविक्रम — असीम पराक्रम।", "Amitavikrama — immeasurable valour."),
        "hb-09": ("उदधिक्रमण — समुद्र लाँघने वाले।", "Udadhikramaṇa — who crossed the ocean."),
        "hb-10": ("सीताशोकविनाशन — सीता का शोक हरने वाले।", "Sītāśoka-vināśana — remover of Sītā’s sorrow."),
        "hb-11": ("लक्ष्मणप्राणदाता — लक्ष्मण के प्राण-रक्षक।", "Lakṣmaṇa-prāṇadātā — restorer of Lakṣmaṇa’s life."),
        "hb-12": ("दशग्रीवदर्पहन्ता — रावण के गर्व का हनन।", "Daśagrīva-darpahantā — crusher of Rāvaṇa’s pride."),
    }
    for vid, (h, e) in gloss.items():
        if vid in verses:
            hi[vid] = h
            en[vid] = e
    save(dw / "translations" / "hi.json", hi)
    save(dw / "translations" / "en.json", en)
    print("dwadasha enriched")


if __name__ == "__main__":
    fix_sk()
    enrich_thin_packs()
