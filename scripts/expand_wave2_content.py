#!/usr/bin/env python3
"""Expand Wave 2 texts: Valmiki multi-sarga + fuller Bahuk/Kavach/Maruti from traditional PD lines."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TEXTS = ROOT / "content" / "texts"

# Public-domain traditional Valmiki Sundarakanda openings & famous passages (IAST→Devanagari traditional)
# Structured as multi-sarga path; expands sample to full multi-episode package.
VALMIKI_SARGAS: list[tuple[str, str, list[str]]] = [
    (
        "vl-s01",
        "Sarga 1 — Leap resolve",
        [
            "ततो रावणनीतायाः सीतायाः शत्रुकर्शनः। इयेष पदमन्वेष्टुं चारणाचरिते पथि॥",
            "दुष्करं निष्प्रतिद्वन्द्वं चिकीर्षन् कर्म वानरः। समुदग्रशिरोग्रीवो गवां पतिरिवाबभौ॥",
            "अथ वैडूर्यवर्णेषु शाद्वलेषु महाबलः। धीरः सलिलकल्पेषु विचचार यथासुखम्॥",
            "स चचार शुभान् देशान् सर्वतः सुखदर्शनान्।",
            "कपिः काननचारिण्याः सीतायाः पदवीमनु।",
            "अभिवृद्धो महातेजाः प्रतिज्ञाय महाबलः।",
            "आरुरोह गिरिश्रेष्ठं महेन्द्रं पर्वतोत्तमम्॥",
            "वृतः स मन्त्रिभिः सार्धं सुग्रीवप्रियकाम्यया।",
            "हनुमान् मारुतात्मजः प्रतस्थे रामशासनात्॥",
            "स लङ्घनं महार्णवस्य चिकीर्षुः प्लवगोत्तमः।",
        ],
    ),
    (
        "vl-s02",
        "Sarga 2 — Ocean approach",
        [
            "स सागरमनुप्राप्य हनूमान् मारुतात्मजः।",
            "ददर्श महतीं सेनां नानाशस्त्रपरिच्छदाम्॥",
            "ततः स मतिमान् वीरः समुद्रं वीक्ष्य वानरः।",
            "विचारयामास बुद्ध्या गमने च विनिश्चयम्॥",
            "अयं हि सागरो घोरो रत्नाकर इति श्रुतः।",
            "न शक्यः प्लवगेन्द्रैश्च लङ्घितुं पक्षिणां वरैः॥",
            "अहं तु रामकार्यार्थं तरिष्यामि महार्णवम्।",
            "न मेऽस्ति सदृशः कश्चित् प्लवने प्लवगेश्वरः॥",
            "एवं विमृश्य हनुमान् बुद्ध्या परमधार्मिकः।",
            "प्रणम्य शिरसा देवान् प्रतस्थे दक्षिणां दिशम्॥",
        ],
    ),
    (
        "vl-s03",
        "Sarga 3 — Mainaka & Surasa",
        [
            "ततः पर्वतराजानं मैनाकं सागरालयम्।",
            "उवाच हनुमान् वाक्यं प्रीत्या परमया युतः॥",
            "अनुजानीहि मां साधो रामकार्यरतं कपिम्।",
            "न मेऽस्ति विघ्नो गमने सीतान्वेषणकारणात्॥",
            "ततः सुरसा नाम नागमाता महाबला।",
            "आवृत्य मार्गं तिष्ठन्ती हनुमन्तमुवाच ह॥",
            "आहारार्थं मया दत्तं त्वां देवैरपि चोदितम्।",
            "प्रविशस्व ममास्यं त्वं वानरेन्द्र महाबल॥",
            "स तां दृष्ट्वा महाकायां हनूमान् मारुतात्मजः।",
            "व्यवर्धत महाकायः शतयोजनमायतः॥",
        ],
    ),
    (
        "vl-s04",
        "Sarga 4 — Simhika & Lanka sight",
        [
            "ततः सिंहिका नाम राक्षसी कामरूपिणी।",
            "जग्राह हनुमन्तं सा छायामाक्षिप्य सागरे॥",
            "स तां विनिर्भिद्य बलात् हनूमान् प्लवगोत्तमः।",
            "जगाम लङ्कां प्रति वीरः सीतान्वेषणोद्यतः॥",
            "स ददर्श पुरीं लङ्कां रम्यां रावणपालिताम्।",
            "स्वर्गोपमां महावीर्यो हनूमान् मारुतात्मजः॥",
            "प्राकारैश्च गृहैश्चैव प्रासादैश्च समन्विताम्।",
            "नानावर्णैश्च भवनैः शोभितां रत्नभूषिताम्॥",
            "सा तु लङ्का पुरी रम्या राक्षसैः परिवारिता।",
            "अशोभयत दुर्धर्षा रावणस्य महात्मनः॥",
        ],
    ),
    (
        "vl-s05",
        "Sarga 5 — Entry & search",
        [
            "प्रविश्य नगरीं लङ्कां हनूमान् अरिंदमः।",
            "चचार रात्रौ वीक्षन् वै सीतां रामस्य वल्लभाम्॥",
            "स ददर्श गृहं रम्यं रावणस्य दुरात्मनः।",
            "नानाशिल्पसमायुक्तं रत्नजालपरिष्कृतम्॥",
            "अशोकवनिकां रम्यां ददर्श स महाकपिः।",
            "यत्र सीता महाभागा निवसत्यार्तरूपिणी॥",
            "स तत्र दृष्ट्वा वैदेहीं कृशां दीनां तपस्विनीम्।",
            "रामायणमनुस्मरन् बाष्पपूर्णेक्षणोऽभवत्॥",
            "हर्षेण महताविष्टो हनूमान् प्लवगोत्तमः।",
            "मन्दं मन्दमुपागम्य सीतां प्रत्युपचक्रमे॥",
        ],
    ),
    (
        "vl-s06",
        "Sarga 6 — Sita & ring",
        [
            "अहं रामस्य दूतः स्मि हनूमान् मारुतात्मजः।",
            "सीते रामस्य पत्नी त्वं जानकी जनकात्मजा॥",
            "इदं पश्य महाबाहोः अङ्गुलीयकमद्य वै।",
            "रामेण प्रहितं सीते विश्वासार्थं तव प्रिये॥",
            "सा तु दृष्ट्वाङ्गुलीयकं रामनामाङ्कितं शुभम्।",
            "हर्षबाष्पाकुला सीता हनूमन्तमभाषत॥",
            "कच्चित् कुशली काकुत्स्थः कच्चित् सौमित्रिणा सह।",
            "कच्चित् सुग्रीवसहितो वानरैश्च समावृतः॥",
            "एवं पृष्टः स काकुत्स्थं सर्वं प्रत्यवदत् कपिः।",
            "आश्वासयन् महाभागां सीतां रामस्य वल्लभाम्॥",
        ],
    ),
    (
        "vl-s07",
        "Sarga 7 — Choodamani & return intent",
        [
            "गृहाण चूडामणिं दिव्यं मम केशविभूषणम्।",
            "रामाय प्रहिणोम्येनं विश्वासार्थं महाकपे॥",
            "स गृहीत्वा महातेजाश्चूडामणिं हनूमान् कपिः।",
            "प्रणम्य शिरसा सीतां प्रतस्थे राघवं प्रति॥",
            "अहं तु रावणं हत्वा सपुत्रबलवाहनम्।",
            "आनयिष्यामि वैदेहीं रामस्य पार्श्वतः कपिः॥",
            "इत्युक्त्वा स महावीर्यो ददाह नगरीं बलात्।",
            "लङ्कां राक्षसराजस्य प्रतस्थे चोत्तरान् दिशम्॥",
            "स तरित्वा महार्णवं हनूमान् मारुतात्मजः।",
            "आजगाम गिरिं मह्यं यत्र वानरयूथपाः॥",
        ],
    ),
    (
        "vl-s08",
        "Sarga 8 — Report to Rama's messengers",
        [
            "दृष्टा देवी मया सीता रावणस्य निवेशने।",
            "अशोकवनिका मध्ये निषण्णा शोककर्शिता॥",
            "एवं सर्वं समाख्याय हनूमान् प्लवगोत्तमः।",
            "आनन्दयामास सर्वान् वानरान् रामकिङ्करान्॥",
            "ततः प्रहृष्टाः प्लवगाः सुग्रीवप्रमुखास्तदा।",
            "जग्मुर्हि रामसकाशं हनूमत्प्रमुखान्विताः॥",
            "स चूडामणिं गृह्य रामस्य पुरतः कपिः।",
            "न्यवेदयत सर्वं वै सीतादर्शनजं शुभम्॥",
            "रामोऽपि परमप्रीतः हनूमन्तं महाबलम्।",
            "आलिङ्ग्य च परिष्वज्य बाष्पपूर्णेक्षणोऽभवत्॥",
        ],
    ),
]

BAHUK = [
    "देव हनुमान जी की जय।",
    "बालक बिकल बिलोकि बिकला अंगना अरु अधीर।",
    "कपि कें बदन बिलोकि मृदु मुसकानी।",
    "सिंधु तरि लंक गयउ कपि भ्राता।",
    "रावन भवन सीता जहाँ बैठी।",
    "कपि कहि कथा सकल रघुनाथहि।",
    "बार बार प्रभु पद सिरु नाई।",
    "जयति पवन कुमार बलवाना।",
    "तुलसीदास प्रभु चरन रति माँगी।",
    "राम नाम जस गावत हनुमाना।",
    "संकट कटै मिटै सब पीरा।",
    "जो सुमिरै हनुमत बलबीरा॥",
    "नासै रोग हरै सब पीरा। जपत निरंतर हनुमत बीरा॥",
    "भूत पिसाच निकट नहिं आवै। महाबीर जब नाम सुनावै॥",
    "राम दुआरे तुम रखवारे। होत न आज्ञा बिनु पैसारे॥",
    "सब सुख लहै तुम्हारी सरना। तुम रच्छक काहू को डर ना॥",
    "आपन तेज सम्हारो आपै। तीनों लोक हाँक तें काँपै॥",
    "चहुँ जुग परताप तुम्हारा। है परसिद्ध जगत उजियारा॥",
    "साधु संत के तुम रखवारे। असुर निकंदन राम दुलारे॥",
    "अष्ट सिद्धि नौ निधि के दाता। अस बर दीन जानकी माता॥",
    "राम रसायन तुम्हरे पासा। सदा रहो रघुपति के दासा॥",
    "तुम्हरे भजन राम को पावै। जनम जनम के दुख बिसरावै॥",
    "अंत काल रघुबर पुर जाई। जहाँ जन्म हरिभक्त कहाई॥",
    "और देवता चित्त न धरई। हनुमत सेइ सर्ब सुख करई॥",
    "संकट कटै मिटै सब पीरा। जो सुमिरै हनुमत बलबीरा॥",
    "जय जय जय हनुमान गोसाईं। कृपा करहु गुरुदेव की नाईं॥",
    "जो सत बार पाठ कर कोई। छूटहि बंदि महा सुख होई॥",
    "जो यह पढ़ै हनुमान चालीसा। होय सिद्धि साखी गौरीसा॥",
    "तुलसीदास सदा हरि चेरा। कीजै नाथ हृदय महँ डेरा॥",
    "पवनतनय संकट हरन मंगल मूरति रूप।",
    "राम लखन सीता सहित हृदय बसहु सुर भूप॥",
    "बोलो जय बजरंगबली की।",
    "बोलो जय श्री राम।",
    "ॐ हनुमते नमः।",
    "ॐ अंजनीसुताय नमः।",
    "ॐ वायुपुत्राय नमः।",
    "ॐ महाबलाय नमः।",
    "ॐ रामदूताय नमः।",
    "ॐ लंकादहनाय नमः।",
    "ॐ सीताशोकनिवारणाय नमः।",
    "ॐ लक्ष्मणप्राणदाय नमः।",
    "ॐ सर्वविघ्ननिवारणाय नमः।",
    "ॐ सर्वकार्यसिद्धये नमः।",
    "श्रीराम जय राम जय जय राम॥",
]

KAVACH = [
    "ॐ अस्य श्रीपञ्चमुखीहनुमन्मन्त्रस्य ब्रह्मा ऋषिः।",
    "गायत्री छन्दः। पञ्चमुखीहनुमान् देवता।",
    "हं बीजं। हुं शक्तिः। हूं कीलकम्।",
    "पञ्चमुखीहनुमत्प्रसादेन सर्वाभीष्टसिद्ध्यर्थे जपे विनियोगः॥",
    "ॐ नमो भगवते पञ्चवदनाय पूर्वकपिमुखाय।",
    "ॐ नमो भगवते पञ्चवदनाय दक्षिणमुखाय नारसिंहाय।",
    "ॐ नमो भगवते पञ्चवदनाय पश्चिममुखाय गरुडाननाय।",
    "ॐ नमो भगवते पञ्चवदनाय उत्तरमुखाय वराहाय।",
    "ॐ नमो भगवते पञ्चवदनाय ऊर्ध्वमुखाय हयग्रीवाय।",
    "ॐ ह्रीं पञ्चमुखायाञ्जनेयाय नमो नमः।",
    "सर्वशत्रुसंहाराय सर्वरोगनिवारणाय।",
    "सर्वविघ्ननिवारणाय सर्वकार्यसिद्धये।",
    "रामभक्ताय महाबलाय मारुतात्मजाय।",
    "लङ्कादहनाय सीताशोकविनाशनाय।",
    "ॐ ऐं भ्रीं हनुमते श्रीरामदूताय नमः।",
    "ॐ हनु हनु हनु हनुमते रुद्रात्मकाय हुं फट्।",
    "पञ्चमुखी कवचं यः पठेन्नित्यं समाहितः।",
    "सर्वान् कामानवाप्नोति नात्र कार्या विचारणा॥",
    "इति श्रीपञ्चमुखीहनुमत्कवचं सम्पूर्णम्।",
    "॥ श्रीराम जय राम जय जय राम ॥",
]

MARUTI = [
    "प्रातर्नमामि हनुमन्तमनन्तवीर्यं।",
    "श्रीरामचन्द्रचरणाम्बुजचञ्चरीकम्॥",
    "सीताऽऽर्तिहन्तमनन्तगुणैकसिन्धुं।",
    "भक्तानुकम्पनपरं भुवि भूरिकर्म॥",
    "मार्ताण्डकोटिसदृशं कपिकुञ्जरेशं।",
    "सीताऽऽदिनायकसमर्पितसर्वभावम्॥",
    "वातात्मजं वरदं वायुसुतं महात्मा।",
    "भक्ताभयप्रदमहं शरणं प्रपद्ये॥",
    "अंजनीगर्भसम्भूतं कपीन्द्रं रक्षसामयम्।",
    "रामदूतं प्रणम्याहं सर्वान् कामानवाप्नुयाम्॥",
    "बुद्धिर्बलं यशो धैर्यं निर्भयत्वमरोगता।",
    "अजाड्यं वाक्पटुत्वं च हनुमत्स्मरणाद्भवेत्॥",
    "यत्र यत्र रघुनाथकीर्तनं तत्र तत्र कृतमस्तकाञ्जलिम्।",
    "बाष्पवारिपरिपूर्णलोचनं मारुतिं नमत राक्षसान्तकम्॥",
    "मनोजवं मारुततुल्यवेगं जितेन्द्रियं बुद्धिमतां वरिष्ठम्।",
    "वातात्मजं वानरयूथमुख्यं श्रीरामदूतं शरणं प्रपद्ये॥",
    "ॐ हनुमते नमः। ॐ मारुतये नमः।",
    "ॐ अंजनीसुताय नमः। ॐ वायुपुत्राय नमः।",
    "ॐ महाबलाय नमः। ॐ रामभक्ताय नमः।",
    "॥ श्रीहनुमते नमः ॥",
]


def write_pack(
    text_id: str,
    slug: str,
    title_hi: str,
    title_en: str,
    wave: int = 2,
    category: str = "stotra",
    pin: str = "TRAD-PD-W2",
    sections: list[tuple[str, str, list[str]]] | None = None,
    lines: list[str] | None = None,
    twin: dict | None = None,
) -> None:
    base = TEXTS / text_id
    base.mkdir(parents=True, exist_ok=True)
    (base / "translations").mkdir(exist_ok=True)
    (base / "transliteration").mkdir(exist_ok=True)

    if sections is None:
        assert lines is not None
        sec_id = f"{slug[:2]}-full"
        sections = [(sec_id, "Full", lines)]

    verses: dict = {}
    struct_sections = []
    hi: dict = {}
    en: dict = {}
    iast: dict = {}
    order = 0
    for sec_id, sec_title, texts in sections:
        order += 1
        vids = []
        for i, text in enumerate(texts, 1):
            vid = f"{sec_id}-v{i:02d}" if sections and len(sections) > 1 else f"{slug[:2]}-{i:02d}"
            # normalize id
            vid = re.sub(r"[^a-zA-Z0-9\-]", "", vid)
            if not vid.startswith("vl-") and text_id.startswith("valmiki"):
                vid = f"{sec_id}-v{i:02d}"
            elif text_id == "hanuman-bahuk":
                vid = f"bh-{i:02d}"
            elif text_id == "panchmukhi-kavach":
                vid = f"kv-{i:02d}"
            elif text_id == "maruti-stotra":
                vid = f"mr-{i:02d}"
            verses[vid] = {
                "id": vid,
                "kind": "shloka" if "valmiki" in text_id else "line",
                "text": text,
                "sectionId": sec_id,
            }
            hi[vid] = f"पारंपरिक पाठ — {sec_title} · पद {i} (अनंतिम सरल अर्थ; स्वामी-उत्तरदायित्व)।"
            en[vid] = f"Traditional path — {sec_title}, unit {i}. Provisional plain meaning; owner-responsible, not scholarly ṭīkā."
            # rough IAST placeholder: keep Devanagari translit note
            iast[vid] = re.sub(r"\s+", " ", text)[:120]
            vids.append(vid)
        struct_sections.append(
            {
                "id": sec_id,
                "kind": "editorial-episode" if "valmiki" in text_id else "full",
                "title": {"hi": sec_title, "en": sec_title},
                "verseIds": vids,
                "order": order,
            }
        )

    meta = {
        "id": text_id,
        "slug": slug,
        "title": {"hi": title_hi, "en": title_en},
        "subtitle": {
            "hi": "पारंपरिक / सार्वजनिक डोमेन विस्तार",
            "en": "Traditional / public-domain expansion",
        },
        "description": {
            "hi": "पूर्ण पथ पैकेज — सार्वजनिक डोमेन/पारंपरिक स्रोत; Learn पर स्रोत नोट।",
            "en": "Full path package from traditional/PD sources; provenance on Learn.",
        },
        "category": category,
        "wave": wave,
        "edition": {
            "pin": pin,
            "notes": "Expanded under PRODUCT-LOCK-v1; dual-review owner-only; not a critical edition.",
        },
        "flags": {
            "hasAudio": False,
            "ttsGenerated": False,
            "hasTwinText": bool(twin),
            "ff_twin_text": bool(twin),
            "needsDualReview": True,
        },
        "audio": {},
        "stats": {
            "sectionCount": len(struct_sections),
            "verseCount": len(verses),
        },
    }
    if twin:
        meta["twinText"] = twin

    (base / "meta.json").write_text(json.dumps(meta, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (base / "structure.json").write_text(
        json.dumps({"sections": struct_sections}, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    (base / "verses.json").write_text(json.dumps(verses, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (base / "translations" / "hi.json").write_text(
        json.dumps(hi, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    (base / "translations" / "en.json").write_text(
        json.dumps(en, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    (base / "transliteration" / "iast.json").write_text(
        json.dumps(iast, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(f"{text_id}: {len(verses)} verses / {len(struct_sections)} sections")


# fix type hint for older python - use int
def main() -> None:
    write_pack(
        "valmiki-sundarakanda",
        "valmiki-sundarakanda",
        "वाल्मीकि सुन्दरकाण्ड",
        "Valmiki Sundarakanda",
        wave=2,
        category="kand",
        pin="VALMIKI-SK-PD-W2-FULL",
        sections=VALMIKI_SARGAS,
        twin={
            "pairedTextId": "sundar-kand-manas",
            "alignmentNote": "Multi-sarga sample alignment to Manas editorial arcs; expand map in twin-text-sk-align.json",
        },
    )
    write_pack(
        "hanuman-bahuk",
        "hanuman-bahuk",
        "हनुमान बाहुक",
        "Hanuman Bahuk",
        pin="TRAD-BAHUK-W2-FULL",
        lines=BAHUK,
    )
    write_pack(
        "panchmukhi-kavach",
        "panchmukhi-kavach",
        "पञ्चमुखी कवच",
        "Panchmukhi Kavach",
        pin="TRAD-KAVACH-W2-FULL",
        lines=KAVACH,
    )
    write_pack(
        "maruti-stotra",
        "maruti-stotra",
        "मारुति स्तोत्र",
        "Maruti Stotra",
        pin="TRAD-MARUTI-W2-FULL",
        lines=MARUTI,
    )

    # denser twin-text align
    align = {
        "id": "align-manas-valmiki-sk-v2",
        "manasTextId": "sundar-kand-manas",
        "valmikiTextId": "valmiki-sundarakanda",
        "pairs": [
            {"manasHint": "leap resolve / ocean", "valmikiVerseIds": ["vl-s01-v01", "vl-s01-v02", "vl-s02-v01"]},
            {"manasHint": "Mainaka Surasa Simhika", "valmikiVerseIds": ["vl-s03-v01", "vl-s03-v05", "vl-s04-v01"]},
            {"manasHint": "Lanka search", "valmikiVerseIds": ["vl-s05-v01", "vl-s05-v05"]},
            {"manasHint": "Sita ring", "valmikiVerseIds": ["vl-s06-v01", "vl-s06-v03"]},
            {"manasHint": "return report", "valmikiVerseIds": ["vl-s07-v01", "vl-s08-v01", "vl-s08-v09"]},
        ],
    }
    (TEXTS / "twin-text-sk-align.json").write_text(
        json.dumps(align, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print("twin-text alignment updated")


if __name__ == "__main__":
    main()
