#!/usr/bin/env python3
"""Household canon paths — dual public recensions, provisional meanings."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TEXTS = ROOT / "content" / "texts"


def write_pack(spec: dict) -> None:
    slug = spec["slug"]
    verses = spec["verses"]
    sid = spec.get("sectionId") or f"{slug}-full"
    d = TEXTS / slug
    (d / "translations").mkdir(parents=True, exist_ok=True)
    (d / "transliteration").mkdir(parents=True, exist_ok=True)
    verse_ids = []
    vmap, hi, en, iast = {}, {}, {}, {}
    for v in verses:
        vid = v["id"]
        verse_ids.append(vid)
        vmap[vid] = {
            "id": vid,
            "kind": v.get("kind", "shloka"),
            "text": v["text"],
            "sectionId": sid,
        }
        hi[vid] = v["hi"]
        en[vid] = v["en"]
        iast[vid] = v["iast"]
    meta = {
        "id": slug,
        "slug": slug,
        "deity": spec["deity"],
        "title": spec["title"],
        "subtitle": spec.get("subtitle"),
        "originalLang": spec.get("originalLang", "sa"),
        "script": "Deva",
        "edition": spec["edition"],
        "flags": {"hasOfflinePack": False, "needsDualReview": True},
        "stats": {"sectionCount": 1, "verseCount": len(verses)},
        "wave": spec.get("wave", 1),
        "category": spec.get("category", "stotra"),
        "description": spec["description"],
    }
    structure = {
        "sections": [
            {
                "id": sid,
                "kind": "editorial-episode",
                "title": spec.get("sectionTitle") or {"hi": "पूर्ण पाठ", "en": "Full path"},
                "verseIds": verse_ids,
                "order": 1,
            }
        ]
    }
    (d / "meta.json").write_text(json.dumps(meta, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (d / "structure.json").write_text(
        json.dumps(structure, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    (d / "verses.json").write_text(json.dumps(vmap, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    (d / "translations" / "hi.json").write_text(
        json.dumps(hi, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    (d / "translations" / "en.json").write_text(
        json.dumps(en, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    (d / "transliteration" / "iast.json").write_text(
        json.dumps(iast, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print("wrote", slug, len(verses))


PACKS = []

PACKS.append(
    dict(
        slug="gayatri-mantra",
        deity="sarva",
        title={"hi": "गायत्री मन्त्र", "en": "Gayatri mantra"},
        subtitle={"hi": "ऋग्वेद ३.६२.१०", "en": "Rigveda 3.62.10"},
        edition={
            "pin": "GAYATRI-RV-3-62-10",
            "notes": "Rigveda 3.62.10. ॐ भूर्भुवः स्वः is the traditional vyāhṛti prefix, collated against Green Message and standard smārta recitation. Meanings provisional.",
        },
        category="mantra",
        description={
            "hi": "सवितृ देवता की गायत्री — जप का मूल मन्त्र।",
            "en": "The Gayatri of Savitr — the root mantra of japa.",
        },
        verses=[
            {
                "id": "gy-1",
                "kind": "mantra",
                "text": "ॐ भूर्भुवः स्वः।\nतत्सवितुर्वरेण्यं\nभर्गो देवस्य धीमहि।\nधियो यो नः प्रचोदयात्॥",
                "iast": "oṃ bhūr bhuvaḥ svaḥ tat savitur vareṇyaṃ bhargo devasya dhīmahi dhiyo yo naḥ pracodayāt",
                "hi": "हम उस सवितृ देव के वरेण्य तेज का ध्यान करते हैं। वह हमारी बुद्धियों को प्रेरित करे।",
                "en": "We meditate on the adorable splendour of Savitr. May he impel our intellects.",
            }
        ],
    )
)

PACKS.append(
    dict(
        slug="ganesha-prarthana",
        deity="sarva",
        title={"hi": "गणेश प्रार्थना", "en": "Ganesha prayer"},
        subtitle={"hi": "वक्रतुण्ड · शुक्लाम्बर", "en": "Vakratunda · Shuklambaradharam"},
        edition={
            "pin": "GANESHA-HOUSEHOLD-GM-SD",
            "notes": "Two household invocatory verses, stable across Green Message / Sanskrit Documents class. Meanings provisional.",
        },
        category="stotra",
        description={
            "hi": "पाठ आरम्भ की गणेश प्रार्थना।",
            "en": "Opening prayer to Ganesha before any path.",
        },
        verses=[
            {
                "id": "gp-1",
                "text": "वक्रतुण्ड महाकाय सूर्यकोटिसमप्रभ।\nनिर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥",
                "iast": "vakratuṇḍa mahākāya sūryakoṭisamaprabha nirvighnaṃ kuru me deva sarvakāryeṣu sarvadā",
                "hi": "हे वक्रतुण्ड महाकाय, कोटि सूर्य-समान प्रभा वाले देव, मेरे सब कार्यों में सदा निर्विघ्न करो।",
                "en": "O curved-trunk, great-bodied Lord, bright as a crore of suns — make every work of mine free of obstacle, always.",
            },
            {
                "id": "gp-2",
                "text": "शुक्लाम्बरधरं विष्णुं शशिवर्णं चतुर्भुजम्।\nप्रसन्नवदनं ध्यायेत् सर्वविघ्नोपशान्तये॥",
                "iast": "śuklāmbaradharaṃ viṣṇuṃ śaśivarṇaṃ caturbhujam prasannavadanaṃ dhyāyet sarvavighnopaśāntaye",
                "hi": "श्वेत वस्त्रधारी, शशिवर्ण, चतुर्भुज, प्रसन्नमुख गणेश का ध्यान सब विघ्न शान्त करने को।",
                "en": "Meditate on the white-robed, moon-hued, four-armed, smiling Lord to still every obstacle.",
            },
        ],
    )
)

PACKS.append(
    dict(
        slug="mahalakshmi-ashtakam",
        deity="sarva",
        title={"hi": "महालक्ष्म्यष्टकम्", "en": "Mahalakshmi Ashtakam"},
        subtitle={"hi": "इन्द्र-कृत · ८ श्लोक", "en": "Indra’s hymn · 8 verses"},
        edition={
            "pin": "MAHALAKSHMI-ASHTAKAM-GM-SD",
            "notes": "Indra-krta ashtakam collated against Green Message and Sanskrit Documents. Padma Purana class. Meanings provisional.",
        },
        description={
            "hi": "महालक्ष्मी की आठ श्लोक स्तुति।",
            "en": "Eight-verse hymn to Mahalakshmi.",
        },
        verses=[
            {
                "id": "ml-1",
                "text": "नमस्तेऽस्तु महामाये श्रीपीठे सुरपूजिते।\nशङ्खचक्रगदाहस्ते महालक्ष्मि नमोऽस्तु ते॥",
                "iast": "namaste'stu mahāmāye śrīpīṭhe surapūjite śaṅkhacakragadāhaste mahālakṣmi namo'stu te",
                "hi": "महामाया, श्रीपीठ पर देवपूजिता, शंख-चक्र-गदा हाथ में — महालक्ष्मी, आपको नमस्कार।",
                "en": "Salutation to you, Mahamaya, worshipped by the gods at Sri-pitha, holding conch, discus, and mace.",
            },
            {
                "id": "ml-2",
                "text": "नमस्ते गरुडारूढे कोलासुरभयंकरि।\nसर्वपापहरे देवि महालक्ष्मि नमोऽस्तु ते॥",
                "iast": "namaste garuḍārūḍhe kolāsurabhayaṅkari sarvapāpahare devi mahālakṣmi namo'stu te",
                "hi": "गरुड़ पर आरूढ़, कोलासुर की भयङ्करी, सब पाप हरने वाली देवि — नमस्कार।",
                "en": "Mounted on Garuda, terror to the asura Kola, remover of all sin — salutations.",
            },
            {
                "id": "ml-3",
                "text": "सर्वज्ञे सर्ववरदे सर्वदुष्टभयंकरि।\nसर्वदुःखहरे देवि महालक्ष्मि नमोऽस्तु ते॥",
                "iast": "sarvajñe sarvavarade sarvaduṣṭabhayaṅkari sarvaduḥkhahare devi mahālakṣmi namo'stu te",
                "hi": "सर्वज्ञा, सब वर देने वाली, दुष्टों की भयङ्करी, सब दुःख हरने वाली।",
                "en": "All-knowing, giver of every boon, terror to the wicked, taker of every sorrow.",
            },
            {
                "id": "ml-4",
                "text": "सिद्धिबुद्धिप्रदे देवि भुक्तिमुक्तिप्रदायिनि।\nमन्त्रमूर्ते सदा देवि महालक्ष्मि नमोऽस्तु ते॥",
                "iast": "siddhibuddhiprade devi bhuktimuktipradāyini mantramūrte sadā devi mahālakṣmi namo'stu te",
                "hi": "सिद्धि और बुद्धि देने वाली, भोग और मुक्ति देने वाली, मन्त्र-मूर्ति देवि।",
                "en": "Giver of siddhi and buddhi, of enjoyment and liberation, always the mantra-form.",
            },
            {
                "id": "ml-5",
                "text": "आद्यन्तरहिते देवि आद्यशक्ति महेश्वरि।\nयोगजे योगसम्भूते महालक्ष्मि नमोऽस्तु ते॥",
                "iast": "ādyantarahite devi ādyaśakti maheśvari yogaje yogasambhūte mahālakṣmi namo'stu te",
                "hi": "आदि-अन्त रहित, आदि शक्ति महेश्वरी, योग से जन्मी।",
                "en": "Without beginning or end, primal Shakti, Maheshvari, born of yoga.",
            },
            {
                "id": "ml-6",
                "text": "स्थूलसूक्ष्ममहारौद्रे महाशक्ति महोदरे।\nमहापापहरे देवि महालक्ष्मि नमोऽस्तु ते॥",
                "iast": "sthūlasūkṣmamahāraudre mahāśakti mahodare mahāpāpahare devi mahālakṣmi namo'stu te",
                "hi": "स्थूल-सूक्ष्म महाघोर रूप, महाशक्ति, महापाप हरने वाली।",
                "en": "Gross and subtle, fiercely great, vast-wombed Shakti, remover of great sin.",
            },
            {
                "id": "ml-7",
                "text": "पद्मासनस्थिते देवि परब्रह्मस्वरूपिणि।\nपरमेशि जगनमातर्महालक्ष्मि नमोऽस्तु ते॥",
                "iast": "padmāsanasthite devi parabrahmasvarūpiṇi parameśi jaganmātar mahālakṣmi namo'stu te",
                "hi": "पद्मासन पर विराजित, परब्रह्म रूप, जगन्माता परमेशी।",
                "en": "Seated on the lotus, form of the supreme Brahman, mother of the world.",
            },
            {
                "id": "ml-8",
                "text": "श्वेताम्बरधरे देवि नानालङ्कारभूषिते।\nजगत्स्थिते जगन्मातर्महालक्ष्मि नमोऽस्तु ते॥",
                "iast": "śvetāmbaradhare devi nānālaṅkārabhūṣite jagatsthite jaganmātar mahālakṣmi namo'stu te",
                "hi": "श्वेत वस्त्र, अनेक आभूषण, जगत् में स्थित जगन्माता।",
                "en": "White-robed, adorned with many ornaments, abiding in the world as its mother.",
            },
        ],
    )
)

PACKS.append(
    dict(
        slug="saraswati-stotram",
        deity="sarva",
        title={"hi": "सरस्वती स्तोत्र", "en": "Saraswati stotra"},
        subtitle={"hi": "या कुन्देन्दु · शारदा", "en": "Yā kundendu · Sharada"},
        edition={
            "pin": "SARASWATI-YAKUNDENDU-GM",
            "notes": "Opening dhyana Yā kundendu plus Sharada verse — Green Message / school-book recension. Meanings provisional.",
        },
        description={
            "hi": "विद्या की देवी सरस्वती का ध्यान-श्लोक।",
            "en": "Dhyana verses of Saraswati, goddess of learning.",
        },
        verses=[
            {
                "id": "ss-1",
                "text": "या कुन्देन्दुतुषारहारधवला या शुभ्रवस्त्रावृता।\nया वीणावरदण्डमण्डितकरा या श्वेतपद्मासना॥\nया ब्रह्माच्युतशङ्करप्रभृतिभिर्देवैः सदा वन्दिता।\nसा मां पातु सरस्वती भगवती निःशेषजाड्यापहा॥",
                "iast": "yā kundendutuṣārahāradhavalā yā śubhravastrāvṛtā yā vīṇāvaradaṇḍamaṇḍitakarā yā śvetapadmāsanā yā brahmācyutaśaṅkaraprabhṛtibhir devaiḥ sadā vanditā sā māṃ pātu sarasvatī bhagavatī niḥśeṣajāḍyāpahā",
                "hi": "कुन्द-चन्द्र-हार जैसी धवल, शुभ्र वस्त्र, वीणा-वरदण्ड हाथ, श्वेत पद्मासन, ब्रह्मा-विष्णु-शंकर से वंदित सरस्वती मेरी जड़ता हरें।",
                "en": "White as jasmine, moon, and frost-garland, robed in white, vīnā in hand, on a white lotus — may Saraswati, praised by Brahma, Vishnu, and Shiva, take away all dullness.",
            },
        ],
    )
)

PACKS.append(
    dict(
        slug="guru-stotram",
        deity="sarva",
        title={"hi": "गुरु स्तोत्रम्", "en": "Guru stotram"},
        subtitle={"hi": "अखण्डमण्डलाकारम्", "en": "Akhanda-mandalakaram"},
        edition={
            "pin": "GURU-STOTRAM-HOUSEHOLD",
            "notes": "Two opening verses of the Guru Gita / household guru-stotra class. Green Message and Vedanta recensions agree on these lines. Meanings provisional.",
        },
        description={
            "hi": "गुरु को ब्रह्म रूप में नमन।",
            "en": "Salutation to the Guru as Brahman.",
        },
        verses=[
            {
                "id": "gs-1",
                "text": "अखण्डमण्डलाकारं व्याप्तं येन चराचरम्।\nतत्पदं दर्शितं येन तस्मै श्रीगुरवे नमः॥",
                "iast": "akhaṇḍamaṇḍalākāraṃ vyāptaṃ yena carācaram tatpadaṃ darśitaṃ yena tasmai śrīgurave namaḥ",
                "hi": "जिसने चराचर में व्याप्त अखण्ड मण्डल का पद दिखाया, उस श्री गुरु को नमस्कार।",
                "en": "Salutation to the Guru who showed that undivided vastness which pervades the moving and the still.",
            },
            {
                "id": "gs-2",
                "text": "गुरुर्ब्रह्मा गुरुर्विष्णुर्गुरुर्देवो महेश्वरः।\nगुरुः साक्षात् परं ब्रह्म तस्मै श्रीगुरवे नमः॥",
                "iast": "gururbrahmā gururviṣṇur gururdevo maheśvaraḥ guruḥ sākṣāt paraṃ brahma tasmai śrīgurave namaḥ",
                "hi": "गुरु ब्रह्मा हैं, विष्णु हैं, महेश्वर हैं — साक्षात् परब्रह्म। उस श्री गुरु को नमस्कार।",
                "en": "The Guru is Brahma, Vishnu, Maheshvara — the supreme Brahman itself. Salutation to that Guru.",
            },
        ],
    )
)

PACKS.append(
    dict(
        slug="shiva-manasa-puja",
        deity="shiva",
        title={"hi": "शिव मानस पूजा", "en": "Shiva manasa puja"},
        subtitle={"hi": "शङ्कर · ५ श्लोक", "en": "Shankara · 5 verses"},
        edition={
            "pin": "SHIVA-MANASA-PUJA-GM-SD",
            "notes": "Adi Shankara recension collated against Green Message and Sanskrit Documents shivamAnasa. Meanings provisional.",
        },
        description={
            "hi": "मन से शिव की पूजा — रत्नसिंहासन से आरती तक।",
            "en": "Worship of Shiva in the mind — from the jewel-throne to aarti.",
        },
        verses=[
            {
                "id": "smp-1",
                "text": "रत्नैः कल्पितमासनं हिमजलैः स्नानं च दिव्याम्बरं\nनानारत्नविभूषितं मृगमदामोदाङ्कितं चन्दनम्।\nजातीचम्पकबिल्वपत्ररचितं पुष्पं च धूपं तथा\nदीपं देव दयानिधे पशुपते हृत्कल्पितं गृह्यताम्॥",
                "iast": "ratnaiḥ kalpitam āsanaṃ himajalaiḥ snānaṃ ca divyāmbaraṃ nānāratnavibhūṣitaṃ mṛgamadāmodāṅkitaṃ candanam jātīcampakabilvapatraracitaṃ puṣpaṃ ca dhūpaṃ tathā dīpaṃ deva dayānidhe paśupate hṛtkalpitaṃ gṛhyatām",
                "hi": "रत्नों का आसन, हिमजल स्नान, दिव्य वस्त्र, चन्दन, बिल्व-पुष्प, धूप-दीप — हे पशुपते, हृदय में कल्पित यह पूजा ग्रहण करो।",
                "en": "A throne of jewels, a bath of snow-water, divine cloth, sandal, bel and flowers, incense and lamp — O Pashupati, accept this worship imagined in the heart.",
            },
            {
                "id": "smp-2",
                "text": "सौवर्णे नवरत्नखण्डरचिते पात्रे घृतं पायसं\nभक्ष्यं पञ्चविधं पयोदधियुतं रम्भाफलं पानकम्।\nशाकानामयुतं जलं रुचिकरं कर्पूरखण्डोज्ज्वलं\nताम्बूलं मनसा मया विरचितं भक्त्या प्रभो स्वीकुरु॥",
                "iast": "sauvarṇe navaratnakhaṇḍaracite pātre ghṛtaṃ pāyasaṃ bhakṣyaṃ pañcavidhaṃ payodadhiyutaṃ rambhāphalaṃ pānakam śākānām ayutaṃ jalaṃ rucikaraṃ karpūrakhaṇḍojjvalaṃ tāmbūlaṃ manasā mayā viracitaṃ bhaktyā prabho svīkuru",
                "hi": "स्वर्ण-रत्न पात्र में घृत-पायस, पञ्चभक्ष्य, केला, पानक, शाक, कर्पूर-ताम्बूल — मन से रची यह नैवेद्य स्वीकार करो।",
                "en": "In a golden jewelled bowl: ghee, payasa, five foods, banana, drink, greens, camphor, betel — accept this mental naivedya, Lord.",
            },
            {
                "id": "smp-3",
                "text": "छत्रं चामरयोर्युगं व्यजनकं चादर्शकं निर्मलं\nवीणाभेरिमृदङ्गकाहलकला गीतं च नृत्यं तथा।\nआसाभ्यां पदुकाविभूषणमपि पुष्पाञ्जलिर्वन्दनं\nनैवेद्यं सकलं च तव ग्रसनं भक्त्या प्रभो स्वीकुरु॥",
                "iast": "chatraṃ cāmarayor yugaṃ vyajanakaṃ cādarśakaṃ nirmalaṃ vīṇābherimṛdaṅgakāhalakalā gītaṃ ca nṛtyaṃ tathā āsābhyāṃ padukāvibhūṣaṇam api puṣpāñjalir vandanaṃ naivedyaṃ sakalaṃ ca tava grasanaṃ bhaktyā prabho svīkuru",
                "hi": "छत्र, चामर, व्यजन, दर्पण, वीणा-मृदङ्ग, गीत-नृत्य, पादुका, पुष्पाञ्जलि — सब मानस उपचार ग्रहण करो।",
                "en": "Canopy, chowries, fan, mirror, vīnā and drums, song and dance, sandals, a handful of flowers — accept every inner offering.",
            },
            {
                "id": "smp-4",
                "text": "आत्मा त्वं गिरिजा मतिः सहचराः प्राणाः शरीरं गृहं\nपूजा ते विषयोपभोगरचना निद्रा समाधिस्थितिः।\nसञ्चारः पदयोः प्रदक्षिणविधिः स्तोत्राणि सर्वा गिरो\nयद्यत्कर्म करोमि तत्तदखिलं शम्भो तवाराधनम्॥",
                "iast": "ātmā tvaṃ girijā matiḥ sahacarāḥ prāṇāḥ śarīraṃ gṛhaṃ pūjā te viṣayopabhogaracanā nidrā samādhisthitiḥ sañcāraḥ padayoḥ pradakṣiṇavidhiḥ stotrāṇi sarvā giro yadyat karma karomi tattad akhilaṃ śambho tavārādhanam",
                "hi": "आत्मा तुम हो, मति गिरिजा, प्राण सखा, देह घर; विषय-भोग पूजा, निद्रा समाधि, चलना प्रदक्षिणा — हे शम्भो, मेरा हर कर्म तुम्हारी आराधना है।",
                "en": "You are the Self, Girija is my mind, the breaths companions, the body a house; enjoyment is your puja, sleep is samadhi, walking is pradakshina — whatever I do, Shambhu, is your worship.",
            },
            {
                "id": "smp-5",
                "text": "करचरणकृतं वाक्कायजं कर्मजं वा\nश्रवणनयनजं वा मानसं वापराधम्।\nविहितमविहितं वा सर्वमेतत्क्षमस्व\nजय जय करुणाब्धे श्रीमहादेव शम्भो॥",
                "iast": "karacaraṇakṛtaṃ vākkāyajaṃ karmajaṃ vā śravaṇanayanajaṃ vā mānasaṃ vāparādham vihitam avihitaṃ vā sarvam etat kṣamasva jaya jaya karuṇābdhe śrīmahādeva śambho",
                "hi": "हाथ-पाँव, वाणी, शरीर, कर्म, कान-आँख, मन से हुआ अपराध — विहित या अविहित — क्षमा करो। जय करुणाब्धे महादेव शम्भो।",
                "en": "Whatever offence of hand or foot, speech or body, deed, ear, eye, or mind — prescribed or not — forgive it all. Victory, ocean of compassion, Mahadeva Shambhu.",
            },
        ],
    )
)

PACKS.append(
    dict(
        slug="achyutashtakam",
        deity="sarva",
        title={"hi": "अच्युताष्टकम् · आरम्भ", "en": "Achyutashtakam · opening"},
        subtitle={"hi": "शङ्कर · प्रथम श्लोक", "en": "Shankara · first verse"},
        edition={
            "pin": "ACHYUTASHTAKAM-GM-SD",
            "notes": "Adi Shankara recension. Green Message / Sanskrit Documents. Meanings provisional.",
        },
        description={
            "hi": "अच्युत-केशव-राम-गोविन्द नामों की स्तुति।",
            "en": "Hymn of the names Achyuta, Keshava, Rama, Govinda.",
        },
        verses=[
            {
                "id": "ac-1",
                "text": "अच्युतं केशवं रामनारायणं\nकृष्णदामोदरं वासुदेवं हरिम्।\nश्रीधरं माधवं गोपिकावल्लभं\nजानकीनायकं रामचन्द्रं भजे॥",
                "iast": "acyutaṃ keśavaṃ rāmanārāyaṇaṃ kṛṣṇadāmodaraṃ vāsudevaṃ harim śrīdharaṃ mādhavaṃ gopikāvallabhaṃ jānakīnāyakaṃ rāmacandraṃ bhaje",
                "hi": "अच्युत, केशव, राम-नारायण, कृष्ण-दामोदर, वासुदेव, हरि, श्रीधर, माधव, गोपी-वल्लभ, जानकीनायक रामचन्द्र — उन्हें भजता हूँ।",
                "en": "I worship Achyuta, Keshava, Rama-Narayana, Krishna Damodara, Vasudeva, Hari, Shridhara, Madhava, beloved of the gopis, Janaki’s lord Ramachandra.",
            },
        ],
    )
)

PACKS.append(
    dict(
        slug="durga-saptashloki",
        deity="kali",
        title={"hi": "दुर्गासप्तश्लोकी", "en": "Durga Saptashloki"},
        subtitle={"hi": "देवी माहात्म्य से सात श्लोक", "en": "Seven verses from the Devi Mahatmya"},
        edition={
            "pin": "DURGA-SAPTASHLOKI-DM-GM",
            "notes": "Seven household verses drawn from Devi Mahatmya (Markandeya Purana), collated against Green Message saptashloki. Not the full 700-verse Durga Saptashati. Meanings provisional. Not a tantric paddhati.",
        },
        description={
            "hi": "देवी माहात्म्य के सात घर-पाठ श्लोक — पूर्ण सप्तशती नहीं।",
            "en": "Seven household verses from the Devi Mahatmya — not the full Saptashati.",
        },
        verses=[
            {
                "id": "ds-1",
                "text": "ज्ञानिनामपि चेतांसि देवी भगवती हि सा।\nबलादाकृष्य मोहाय महामाया प्रयच्छति॥",
                "iast": "jñāninām api cetāṃsi devī bhagavatī hi sā balād ākṛṣya mohāya mahāmāyā prayacchati",
                "hi": "ज्ञानी के चित्त को भी महामाया बल से खींचकर मोह में डालती हैं।",
                "en": "Even the minds of the wise the blessed Devi, Mahamaya, draws by force into delusion.",
            },
            {
                "id": "ds-2",
                "text": "दुर्गमे दुस्तरे कार्ये दुर्गमा सिन्धुसन्निभे।\nन भयं भवतः किञ्चित् दुर्गाश्रितमनसो नृणाम्॥",
                "iast": "durgame dustare kārye durgamā sindhusannibhe na bhayaṃ bhavataḥ kiñcit durgāśritamanaso nṛṇām",
                "hi": "दुर्गम, दुस्तर कार्य में — दुर्गा के आश्रित मन वाले को भय नहीं।",
                "en": "In work that is hard to cross, like a difficult sea — those whose mind takes refuge in Durga have no fear.",
            },
            {
                "id": "ds-3",
                "text": "सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके।\nशरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते॥",
                "iast": "sarvamaṅgalamāṅgalye śive sarvārthasādhike śaraṇye tryambake gauri nārāyaṇi namo'stu te",
                "hi": "सब मंगलों का मंगल, शिवा, सब अर्थ सिद्ध करने वाली, शरण्या त्र्यम्बका गौरी नारायणि — आपको नमस्कार।",
                "en": "Auspiciousness of all auspicious things, Shivaa, fulfiller of every aim, refuge, three-eyed Gauri, Narayani — salutations.",
            },
            {
                "id": "ds-4",
                "text": "शरणागतदीनार्तपरित्राणपरायणे।\nसर्वस्यार्तिहरे देवि नारायणि नमोऽस्तु ते॥",
                "iast": "śaraṇāgatadīnārtaparitrāṇaparāyaṇe sarvasyārtihare devi nārāyaṇi namo'stu te",
                "hi": "शरणागत दीन-आर्त की रक्षा में तत्पर, सबकी आर्ति हरने वाली नारायणि — नमस्कार।",
                "en": "Devoted to saving the poor and pained who come for refuge, taker of all distress — salutations, Narayani.",
            },
            {
                "id": "ds-5",
                "text": "सर्वस्वरूपे सर्वेशे सर्वशक्तिसमन्विते।\nभयेभ्यस्त्राहि नो देवि दुर्गे देवि नमोऽस्तु ते॥",
                "iast": "sarvasvarūpe sarveśe sarvaśaktisamanvite bhayebhyas trāhi no devi durge devi namo'stu te",
                "hi": "सब रूप, सर्वेशी, सर्वशक्ति से युक्त दुर्गे — भय से हमारी रक्षा करो।",
                "en": "You who are every form, lady of all, joined to every shakti — Durga, save us from fears.",
            },
            {
                "id": "ds-6",
                "text": "रोगानशेषानपहंसि तुष्टा\nरुष्टा तु कामान् सकलानभीष्टान्।\nत्वामाश्रितानां न विपन्नराणां\nत्वामश्रिता ह्यश्रयतां प्रयान्ति॥",
                "iast": "rogān aśeṣān apahaṃsi tuṣṭā ruṣṭā tu kāmān sakalān abhīṣṭān tvām āśritānāṃ na vipannarāṇāṃ tvām aśritā hy aśrayatāṃ prayānti",
                "hi": "प्रसन्न हो सब रोग हरती हो; रुष्ट हो सब कामनाएँ हर लेती हो। तुम्हारे आश्रित नहीं बिगड़ते; अनआश्रित आश्रयहीन हो जाते हैं।",
                "en": "Pleased, you take away all disease; displeased, every desired thing. Those who take refuge in you do not fall; those who do not, lose all refuge.",
            },
            {
                "id": "ds-7",
                "text": "सर्वाबाधाप्रशमनं त्रैलोक्यस्याखिलेश्वरि।\nएवमेव त्वया कार्यमस्मद्वैरिविनाशनम्॥",
                "iast": "sarvābādhāpraśamanaṃ trailokyasyākhileśvari evam eva tvayā kāryam asmadvairivināśanam",
                "hi": "त्रिलोकी की ईश्वरी, सब बाधा शान्त करो — हमारे विरोधी का नाश यही आपका कार्य है।",
                "en": "Lady of the three worlds, still every obstruction — this itself is your work: the end of what stands against us.",
            },
        ],
    )
)


def main() -> None:
    for p in PACKS:
        write_pack(p)


if __name__ == "__main__":
    main()
