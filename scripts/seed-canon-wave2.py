#!/usr/bin/env python3
"""Household canon wave 2 — Achyutashtakam full, Vishnu names, Ganesha Pancharatnam, Madhurashtakam."""
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
        slug="achyutashtakam",
        deity="sarva",
        title={"hi": "अच्युताष्टकम्", "en": "Achyutashtakam"},
        subtitle={"hi": "शङ्कर · ८ श्लोक + फलश्रुति", "en": "Shankara · 8 verses + phala"},
        edition={
            "pin": "ACHYUTASHTAKAM-SHANKARA-GM-VV-2026",
            "notes": "Adi Shankara recension collated against Vignanam Devanagari/IAST class and Green Message. Meanings provisional. Dual-check a printed stotra book.",
        },
        description={
            "hi": "अच्युत-केशव-राम-गोविन्द नामों की आठ श्लोक स्तुति।",
            "en": "Eight-verse hymn of the names Achyuta, Keshava, Rama, Govinda.",
        },
        verses=[
            {
                "id": "ac-1",
                "text": "अच्युतं केशवं रामनारायणं\nकृष्णदामोदरं वासुदेवं हरिम्।\nश्रीधरं माधवं गोपिकावल्लभं\nजानकीनायकं रामचन्द्रं भजे॥",
                "iast": "acyutaṃ keśavaṃ rāmanārāyaṇaṃ kṛṣṇadāmodaraṃ vāsudevaṃ harim śrīdharaṃ mādhavaṃ gopikāvallabhaṃ jānakīnāyakaṃ rāmacandraṃ bhaje",
                "hi": "अच्युत, केशव, राम-नारायण, कृष्ण-दामोदर, वासुदेव, हरि, श्रीधर, माधव, गोपियों के प्रिय, जानकी-नायक रामचन्द्र का मैं भजन करता हूँ।",
                "en": "I worship Achyuta, Keshava, Rama-Narayana, Krishna Damodara, Vasudeva, Hari, Shridhara, Madhava, beloved of the gopis, Ramachandra lord of Janaki.",
            },
            {
                "id": "ac-2",
                "text": "अच्युतं केशवं सत्यभामाधवं\nमाधवं श्रीधरं राधिकाराधितम्।\nइन्दिरामन्दिरं चेतसा सुन्दरं\nदेवकीनन्दनं नन्दजं सन्दधे॥",
                "iast": "acyutaṃ keśavaṃ satyabhāmādhavaṃ mādhavaṃ śrīdharaṃ rādhikārādhitam indirāmandiraṃ cetasā sundaraṃ devakīnandanaṃ nandajaṃ sandadhe",
                "hi": "अच्युत, केशव, सत्यभामा के स्वामी, माधव, श्रीधर, राधा-आराधित, लक्ष्मी के मन्दिर, देवकी-नन्दन, नन्द के पुत्र — उन्हें मैं हृदय में धारण करता हूँ।",
                "en": "I hold in the heart Achyuta, Keshava, lord of Satyabhama, Madhava, Shridhara, worshipped by Radhika, temple of Lakshmi, son of Devaki, child of Nanda.",
            },
            {
                "id": "ac-3",
                "text": "विष्णवे जिष्णवे शङ्खिने चक्रिणे\nरुक्मिणीरागिणे जानकीजानये।\nबल्लवीवल्लभायार्चितायात्मने\nकंसविध्वंसिने वंशिने ते नमः॥",
                "iast": "viṣṇave jiṣṇave śaṅkhine cakriṇe rukmiṇīrāgiṇe jānakījānaye ballavīvallabhāyārcitāyātmane kaṃsavidhvaṃsine vaṃśine te namaḥ",
                "hi": "विष्णु, विजेता, शंख-चक्रधारी, रुक्मिणी-प्रिय, जानकी-पति, गोपियों के प्रिय, आराध्य आत्मा, कंस-विध्वंसी, वेणुधारी — आपको नमस्कार।",
                "en": "Salutation to Vishnu, the victor, bearer of conch and discus, beloved of Rukmini, husband of Janaki, dear to the cowherd women, the worshipped Self, destroyer of Kamsa, player of the flute.",
            },
            {
                "id": "ac-4",
                "text": "कृष्ण गोविन्द हे राम नारायण\nश्रीपते वासुदेवाजित श्रीनिधे।\nअच्युतानन्त हे माधवाधोक्षज\nद्वारकानायक द्रौपदीरक्षक॥",
                "iast": "kṛṣṇa govinda he rāma nārāyaṇa śrīpate vāsudevājita śrīnidhe acyutānanta he mādhavādhokṣaja dvārakānāyaka draupadīrakṣaka",
                "hi": "हे कृष्ण, गोविन्द, राम, नारायण, श्रीपति, वासुदेव, अजित, श्रीनिधि, अच्युत, अनन्त, माधव, अधोक्षज, द्वारका-नायक, द्रौपदी के रक्षक।",
                "en": "O Krishna, Govinda, Rama, Narayana, lord of Sri, Vasudeva, unconquered, treasure of Lakshmi, Achyuta, Ananta, Madhava, Adhokshaja, lord of Dvaraka, protector of Draupadi.",
            },
            {
                "id": "ac-5",
                "text": "राक्षसक्षोभितः सीतया शोभितो\nदण्डकारण्यभूपुण्यताकारणः।\nलक्ष्मणेनान्वितो वानरैः सेवितो\nऽगस्त्यसम्पूजितो राघवः पातु माम्॥",
                "iast": "rākṣasakṣobhitaḥ sītayā śobhito daṇḍakāraṇyabhūpuṇyatākāraṇaḥ lakṣmaṇenānvito vānaraiḥ sevito 'gastyasampūjito rāghavaḥ pātu mām",
                "hi": "राक्षसों को क्षुब्ध करने वाले, सीता से शोभित, दण्डकारण्य को पुण्य बनाने वाले, लक्ष्मण-सहित, वानर-सेवित, अगस्त्य-पूजित राघव मेरी रक्षा करें।",
                "en": "May Raghava protect me — agitator of rakshasas, radiant with Sita, who made Dandaka holy, accompanied by Lakshmana, served by vanaras, worshipped by Agastya.",
            },
            {
                "id": "ac-6",
                "text": "धेनुकारिष्टकोऽनिष्टकृद्द्वेषिणां\nकेशिहा कंसहृद्वंशिकावादकः।\nपूतनाकोपकः सूरजाखेलनो\nबालगोपालकः पातु मां सर्वदा॥",
                "iast": "dhenukāriṣṭako'niṣṭakṛddveṣiṇāṃ keśihā kaṃsahṛdvaṃśikāvādakaḥ pūtanākopakaḥ sūrajākhelano bālagopālakaḥ pātu māṃ sarvadā",
                "hi": "धेनुक-अरिष्ट का नाश, केशि-हन्ता, कंस-हन्ता, वेणुवादक, पूतना-कोप, यशोदा का खेल बालगोपाल सदा मेरी रक्षा करें।",
                "en": "May the child-cowherd always protect me — slayer of Dhenuka and Arishta, of Keshi and Kamsa, flute-player, wrath to Putana, playmate of Yashoda.",
            },
            {
                "id": "ac-7",
                "text": "विद्युदुद्योतवत्प्रस्फुरद्वाससं\nप्रावृडम्भोदवत्प्रोल्लसद्विग्रहम्।\nवन्यया मालया शोभितोरःस्थलं\nलोहिताङ्घ्रिद्वयं वारिजाक्षं भजे॥",
                "iast": "vidyududyotavatprasphuradvāsasaṃ prāvṛḍambhodavatprollasadvigraham vanyayā mālayā śobhitoraḥsthalaṃ lohitāṅghridvayaṃ vārijākṣaṃ bhaje",
                "hi": "बिजली-सी चमकती पीताम्बर, वर्षा-मेघ सा विग्रह, वन-माला से शोभित वक्ष, लाल चरण, कमल-नेत्र — उनका मैं भजन करता हूँ।",
                "en": "I worship the lotus-eyed one — garment flashing like lightning, body like a monsoon cloud, chest bright with a forest garland, two feet red.",
            },
            {
                "id": "ac-8",
                "text": "कुञ्चितैः कुन्तलैर्भ्राजमानाननं\nरत्नमौलिं लसत्कुण्डलं गण्डयोः।\nहारकेयूरकं कङ्कणप्रोज्ज्वलं\nकिङ्किणीमञ्जुलं श्यामलं तं भजे॥",
                "iast": "kuñcitaiḥ kuntalair bhrājamānānanaṃ ratnamauliṃ lasatkuṇḍalaṃ gaṇḍayoḥ hārakeyūrakaṃ kaṅkaṇaprojjvalaṃ kiṅkiṇīmañjulaṃ śyāmalaṃ taṃ bhaje",
                "hi": "घुँघराले केशों से चमकता मुख, रत्न-मुकुट, गालों पर कुण्डल, हार-केयूर-कङ्कण, किङ्किणी, श्यामल रूप — उनका भजन।",
                "en": "I worship that dark one — face bright with curled locks, jewel-crown, earrings on the cheeks, necklace, armlets, flashing bangles, and a sweet girdle of bells.",
            },
            {
                "id": "ac-9",
                "kind": "phala",
                "text": "अच्युतस्याष्टकं यः पठेदिष्टदं\nप्रेमतः प्रत्यहं पूरुषः सस्पृहम्।\nवृत्ततः सुन्दरं कर्तृविश्वम्भर\nस्तस्य वश्यो हरिर्जायते सत्वरम्॥",
                "iast": "acyutasyāṣṭakaṃ yaḥ paṭhed iṣṭadaṃ premataḥ pratyahaṃ pūruṣaḥ saspṛham vṛttataḥ sundaraṃ kartṛviśvambharas tasya vaśyo harir jāyate satvaram",
                "hi": "जो प्रेम से प्रतिदिन यह अच्युताष्टक पढ़ता है — सुन्दर वृत्त, इष्ट देने वाला — जगत् का भर्ता हरि शीघ्र उसके वश में हो जाते हैं।",
                "en": "Whoever recites this octet of Achyuta daily with love — beautiful in metre, giver of the desired — Hari, bearer of the world, quickly becomes gracious to him.",
            },
        ],
    )
)

VISHNU_NAMES = [
    ("विश्वम्", "viśvam", "विश्व — समस्त जगत्", "Vishva — the universe"),
    ("विष्णुः", "viṣṇuḥ", "विष्णु — सर्वव्यापी", "Vishnu — the all-pervading"),
    ("वषट्कारः", "vaṣaṭkāraḥ", "वषट्कार — यज्ञ में पुकारा गया", "Vashatkara — invoked in the sacrifice"),
    ("भूतभव्यभवत्प्रभुः", "bhūtabhavyabhavatprabhuḥ", "भूत-भव्य-भवत् प्रभु — तीनों कालों के स्वामी", "Lord of past, present, and future"),
    ("पूतात्मा", "pūtātmā", "पूतात्मा — शुद्ध आत्मा", "The pure Self"),
    ("परमात्मा", "paramātmā", "परमात्मा — परम आत्मा", "The supreme Self"),
    ("अव्ययः", "avyayaḥ", "अव्यय — अविनाशी", "The imperishable"),
    ("पुरुषः", "puruṣaḥ", "पुरुष — चेतन तत्त्व", "The Person, the conscious principle"),
    ("साक्षी", "sākṣī", "साक्षी — द्रष्टा", "The witness"),
    ("क्षेत्रज्ञः", "kṣetrajñaḥ", "क्षेत्रज्ञ — क्षेत्र को जानने वाला", "Knower of the field"),
    ("अक्षरः", "akṣaraḥ", "अक्षर — अविनाशी अक्षर", "The syllable that does not perish"),
    ("योगः", "yogaḥ", "योग — योग का स्वरूप", "Yoga itself"),
    ("केशवः", "keśavaḥ", "केशव — केशों वाले / ब्रह्मा-विष्णु-शिव", "Keshava"),
    ("नारायणः", "nārāyaṇaḥ", "नारायण — नार के अयन", "Narayana — resting-place of beings"),
    ("माधवः", "mādhavaḥ", "माधव — मा (लक्ष्मी) के स्वामी", "Madhava — lord of Ma / Lakshmi"),
    ("गोविन्दः", "govindaḥ", "गोविन्द — गौओं / इन्द्रियों के रक्षक", "Govinda — protector of cows and senses"),
    ("मधुसूदनः", "madhusūdanaḥ", "मधुसूदन — मधु दैत्य के हन्ता", "Madhusudana — slayer of Madhu"),
    ("त्रिविक्रमः", "trivikramaḥ", "त्रिविक्रम — तीन पग वाले", "Trivikrama — of the three strides"),
    ("वामनः", "vāmanaḥ", "वामन — वामन अवतार", "Vamana — the dwarf"),
    ("श्रीधरः", "śrīdharaḥ", "श्रीधर — श्री को धारण करने वाले", "Shridhara — bearer of Sri"),
    ("हृषीकेशः", "hṛṣīkeśaḥ", "हृषीकेश — इन्द्रियों के स्वामी", "Hrishikesha — lord of the senses"),
    ("पद्मनाभः", "padmanābhaḥ", "पद्मनाभ — नाभि-कमल", "Padmanabha — lotus-navelled"),
    ("दामोदरः", "dāmodaraḥ", "दामोदर — दाम से बँधे उदर", "Damodara — bound at the waist"),
    ("वासुदेवः", "vāsudevaḥ", "वासुदेव — वसुदेव के पुत्र / सर्वनिवासी", "Vasudeva"),
    ("रामः", "rāmaḥ", "राम — रमणीय / दशरथनन्दन", "Rama"),
    ("कृष्णः", "kṛṣṇaḥ", "कृष्ण — श्याम / आकर्षण", "Krishna"),
    ("हरिः", "hariḥ", "हरि — पाप हरने वाले", "Hari — who takes away"),
    ("अच्युतः", "acyutaḥ", "अच्युत — जो कभी नहीं गिरते", "Achyuta — the unfallen"),
    ("जनार्दनः", "janārdanaḥ", "जनार्दन — जनों के रक्षक", "Janardana — protector of people"),
    ("चक्रपाणिः", "cakrapāṇiḥ", "चक्रपाणि — चक्र हाथ में", "Chakrapani — discus in hand"),
]

vishnu_verses = [
    {
        "id": "vs-dhyana",
        "kind": "dhyana",
        "text": "शान्ताकारं भुजगशयनं पद्मनाभं सुरेशं\nविश्वाधारं गगनसदृशं मेघवर्णं शुभाङ्गम्।\nलक्ष्मीकान्तं कमलनयनं योगिभिर्ध्यानगम्यं\nवन्दे विष्णुं भवभयहरं सर्वलोकैकनाथम्॥",
        "iast": "śāntākāraṃ bhujagaśayanaṃ padmanābhaṃ sureśaṃ viśvādhāraṃ gaganasadṛśaṃ meghavarṇaṃ śubhāṅgam lakṣmīkāntaṃ kamalanayanaṃ yogibhirdhyānagamyaṃ vande viṣṇuṃ bhavabhayaharaṃ sarvalokaikanātham",
        "hi": "शान्त आकार, शेष-शय्या, पद्मनाभ, सुरेश, विश्वाधार, आकाश-सदृश, मेघवर्ण, लक्ष्मीकान्त, कमलनयन — भवभयहर विष्णु को वन्दन।",
        "en": "I bow to Vishnu — peaceful form, reclining on the serpent, lotus-navelled, lord of the gods, support of the world, sky-like, cloud-hued, beloved of Lakshmi, lotus-eyed, reachable in the yogis’ dhyana, taker of the fear of becoming, one lord of all worlds.",
    }
]
for i, (deva, iast, hi, en) in enumerate(VISHNU_NAMES, 1):
    vishnu_verses.append(
        {
            "id": f"vs-{i:02d}",
            "kind": "nama",
            "text": f"ॐ {deva} नमः",
            "iast": f"oṃ {iast} namaḥ",
            "hi": hi,
            "en": en,
        }
    )

PACKS.append(
    dict(
        slug="vishnu-sahasranama-selected",
        deity="sarva",
        title={"hi": "विष्णु सहस्रनाम · चयन", "en": "Vishnu Sahasranama · selected names"},
        subtitle={"hi": "ध्यान + ३० नाम · पूर्ण सहस्र नहीं", "en": "Dhyana + 30 names · not the full thousand"},
        edition={
            "pin": "VISHNU-SAHASRANAMA-DOOR-30",
            "notes": "Doorway to the Vishnu Sahasranama (Mahabharata Anushasana Parva class). Opening dhyana Shantakaram plus thirty public names. Not a dump of one thousand. Meanings provisional.",
        },
        category="nama",
        description={
            "hi": "सहस्रनाम का द्वार — शान्ताकारं ध्यान और तीस नाम। पूरी सूची नहीं।",
            "en": "A doorway to the sahasranama — the Shantakaram dhyana and thirty names. Not the full list.",
        },
        verses=vishnu_verses,
    )
)

PACKS.append(
    dict(
        slug="ganesha-pancharatnam",
        deity="sarva",
        title={"hi": "गणेश पञ्चरत्नम्", "en": "Ganesha Pancharatnam"},
        subtitle={"hi": "शङ्कर · ५ रत्न", "en": "Shankara · five jewels"},
        edition={
            "pin": "GANESHA-PANCHARATNAM-SHANKARA-GM",
            "notes": "Adi Shankara Ganesha Pancharatnam collated against Green Message / Vignanam class. Meanings provisional.",
        },
        description={
            "hi": "गणेश की पाँच रत्न-श्लोक स्तुति। पाठ आरम्भ।",
            "en": "Five-jewel hymn to Ganesha. Opening of any path.",
        },
        verses=[
            {
                "id": "gpn-1",
                "text": "मुदाकरात्तमोदकं सदा विमुक्तिसाधकं\nकलाधरावतंसकं विलासिलोकरक्षकम्।\nअनायकैकनायकं विनाशितेभदैत्यकं\nनताशुभाशुभाश्रयं नमामि तं विनायकम्॥",
                "iast": "mudākarāttamodakaṃ sadā vimuktisādhakaṃ kalādharāvataṃsakaṃ vilāsilokarakṣakam anāyakaikanāyakaṃ vināśitebhadaityakaṃ natāśubhāśubhāśrayaṃ namāmi taṃ vināyakam",
                "hi": "मुद से मोदक हाथ में, सदा मुक्ति साधक, चन्द्र-अवतंस, लोक-रक्षक, अनाथों के नाथक, गजासुर-हन्ता विनायक को नमस्कार।",
                "en": "I bow to Vinayaka — modaka held in joy, always the means of freedom, moon in his crest, protector of the playing world, sole leader of the leaderless, destroyer of the elephant-demon, refuge of those who bow through good and ill.",
            },
            {
                "id": "gpn-2",
                "text": "नतेतरातिभीकरं नवोदितार्कभास्वरं\nनमत्सुरारिनिर्जरं नताधिकापदुद्धरम्।\nसुरेश्वरं निधीश्वरं गजेश्वरं गणेश्वरं\nमहेश्वरं तमाश्रये परात्परं निरन्तरम्॥",
                "iast": "natetarātibhīkaraṃ navoditārkabhāsvaraṃ namatsurārinirjaraṃ natādhikāpaduddharam sureśvaraṃ nidhīśvaraṃ gajeśvaraṃ gaṇeśvaraṃ maheśvaraṃ tam āśraye parātparaṃ nirantaram",
                "hi": "अनत को भयङ्कर, नव सूर्य-समान, सुरारि-नाशक, आपद-उद्धारक, सुरेश्वर-निधीश्वर-गजेश्वर-गणेश्वर-महेश्वर — परात्पर का निरन्तर आश्रय।",
                "en": "I take refuge always in that Maheshvara beyond the beyond — terror to those who do not bow, bright as a new-risen sun, who crushes the enemies of the gods, who lifts the bowed from great distress, lord of gods, of treasure, of the elephant, of the ganas.",
            },
            {
                "id": "gpn-3",
                "text": "समस्तलोकशङ्करं निरस्तदैत्यकुञ्जरं\nदरेतरोदरं वरं वरेभवक्त्रमक्षरम्।\nकृपाकरं क्षमाकरं मुदाकरं यशस्करं\nमनस्करं नमस्कृतां नमस्करोमि भास्वरम्॥",
                "iast": "samastalokaśaṅkaraṃ nirastadaityakuñjaraṃ daretarodaraṃ varaṃ varebhavaktram akṣaram kṛpākaraṃ kṣamākaraṃ mudākaraṃ yaśaskaraṃ manaskaraṃ namaskṛtāṃ namaskaromi bhāsvaram",
                "hi": "सब लोकों का मङ्गल, दैत्य-गज का नाश, विशाल उदर, श्रेष्ठ गजमुख अक्षर, कृपा-क्षमा-मुद-यश के आकर — उस भास्वर को नमस्कार।",
                "en": "I bow to that shining one who blesses all worlds, who felled the asura-elephant, vast-bellied, excellent, elephant-faced, imperishable — mine of compassion, forbearance, joy, and glory, who makes the mind of those who bow.",
            },
            {
                "id": "gpn-4",
                "text": "अकिञ्चनार्तिमार्जनं चिरन्तनोक्तिभाजनं\nपुरारिपूर्वनन्दनं सुरारिगर्वचर्वणम्।\nप्रपञ्चनाशभीषणं धनञ्जयादिभूषणं\nकपोलदानवारणं भजे पुराणवारणम्॥",
                "iast": "akiñcanārtimārjanaṃ cirantanoktibhājanaṃ purāripūrvanandanaṃ surārigarvacarvaṇam prapañcanāśabhīṣaṇaṃ dhanañjayādibhūṣaṇaṃ kapoladānavāraṇaṃ bhaje purāṇavāraṇam",
                "hi": "दीन के दुःख हरने वाले, पुराण-उक्ति के पात्र, शिव-पुत्र, सुरारि-गर्व चूर्ण, प्रपञ्च-नाश में भीषण, अर्जुन आदि के भूषण, कपोल-दान गज — पुराण वारण का भजन।",
                "en": "I worship the ancient elephant — wiper of the poor’s distress, vessel of old speech, first son of the foe of the Triple City, chewer of asura-pride, terrible in the end of the world-show, ornament of Arjuna and the rest, temples flowing with ichor.",
            },
            {
                "id": "gpn-5",
                "text": "नितान्तकान्तदन्तकान्तिमन्तकान्तकात्मजं\nअचिन्त्यरूपमन्तहीनमन्तरायकृन्तनम्।\nहृदन्तरे निरन्तरं वसन्तमेव योगिनां\nतमेकदन्तमेव तं विचिन्तयामि सन्ततम्॥",
                "iast": "nitāntakāntadantakāntimantakāntakātmajaṃ acintyarūpamantahīnamantarāyakṛntanam hṛdantare nirantaraṃ vasantam eva yogināṃ tam ekadantam eva taṃ vicintayāmi santatam",
                "hi": "अत्यन्त कान्त दन्त-कान्ति, यम के हन्ता के आत्मज, अचिन्त्य रूप, अन्त-हीन, विघ्न काटने वाले, योगियों के हृदय में वसन्त — उस एकदन्त का मैं सदा चिन्तन करता हूँ।",
                "en": "I think always on that one-tusked one — of extreme beauty in the gleam of the tusk, son of the slayer of Death, of unthinkable form, without end, cutter of obstacles, who dwells without break in the yogis’ heart.",
            },
        ],
    )
)

PACKS.append(
    dict(
        slug="madhurashtakam",
        deity="sarva",
        title={"hi": "मधुराष्टकम्", "en": "Madhurashtakam"},
        subtitle={"hi": "वल्लभाचार्य · ८ श्लोक", "en": "Vallabhacharya · 8 verses"},
        edition={
            "pin": "MADHURASHTAKAM-VALLABHA-GM",
            "notes": "Vallabhacharya Madhurashtakam. Public recension (Green Message / Vignanam class). Meanings provisional.",
        },
        description={
            "hi": "कृष्ण की मधुरता के आठ श्लोक — अधर से गो तक सब मधुर।",
            "en": "Eight verses on Krishna’s sweetness — from the lip to the cow, all is sweet.",
        },
        verses=[
            {
                "id": "md-1",
                "text": "अधरं मधुरं वदनं मधुरं\nनयनं मधुरं हसितं मधुरम्।\nहृदयं मधुरं गमनं मधुरं\nमधुरधिपतेरखिलं मधुरम्॥",
                "iast": "adharaṃ madhuraṃ vadanaṃ madhuraṃ nayanaṃ madhuraṃ hasitaṃ madhuram hṛdayaṃ madhuraṃ gamanaṃ madhuraṃ madhurādhipater akhilaṃ madhuram",
                "hi": "अधर मधुर, वदन मधुर, नयन मधुर, हास मधुर, हृदय मधुर, गमन मधुर — मधुर के अधिपति का सब मधुर है।",
                "en": "The lip is sweet, the face is sweet, the eye is sweet, the laugh is sweet, the heart is sweet, the walk is sweet — all of the Lord of sweetness is sweet.",
            },
            {
                "id": "md-2",
                "text": "वचनं मधुरं चरितं मधुरं\nवसनं मधुरं वलितं मधुरम्।\nचलितं मधुरं भ्रमितं मधुरं\nमधुरधिपतेरखिलं मधुरम्॥",
                "iast": "vacanaṃ madhuraṃ caritaṃ madhuraṃ vasanaṃ madhuraṃ valitaṃ madhuram calitaṃ madhuraṃ bhramitaṃ madhuraṃ madhurādhipater akhilaṃ madhuram",
                "hi": "वचन मधुर, चरित मधुर, वसन मधुर, वलित मधुर, चलित मधुर, भ्रमित मधुर — सब मधुर।",
                "en": "Speech, life-story, garment, the turn of the waist, the step, the wander — all of the Lord of sweetness is sweet.",
            },
            {
                "id": "md-3",
                "text": "वेणुर्मधुरो रेणुर्मधुरः\nपाणिर्मधुरः पादौ मधुरौ।\nनृत्यं मधुरं सख्यं मधुरं\nमधुरधिपतेरखिलं मधुरम्॥",
                "iast": "veṇur madhuro reṇur madhuraḥ pāṇir madhuraḥ pādau madhurau nṛtyaṃ madhuraṃ sakhyaṃ madhuraṃ madhurādhipater akhilaṃ madhuram",
                "hi": "वेणु मधुर, धूलि मधुर, हाथ मधुर, दोनों चरण मधुर, नृत्य मधुर, सख्य मधुर।",
                "en": "The flute is sweet, the dust is sweet, the hand is sweet, both feet are sweet, the dance is sweet, the friendship is sweet.",
            },
            {
                "id": "md-4",
                "text": "गीतं मधुरं पीतं मधुरं\nभुक्तं मधुरं सुप्तं मधुरम्।\nरूपं मधुरं तिलकं मधुरं\nमधुरधिपतेरखिलं मधुरम्॥",
                "iast": "gītaṃ madhuraṃ pītaṃ madhuraṃ bhuktaṃ madhuraṃ suptaṃ madhuram rūpaṃ madhuraṃ tilakaṃ madhuraṃ madhurādhipater akhilaṃ madhuram",
                "hi": "गीत मधुर, पीत मधुर, भुक्त मधुर, सुप्त मधुर, रूप मधुर, तिलक मधुर।",
                "en": "The song is sweet, the yellow cloth is sweet, the meal is sweet, sleep is sweet, the form is sweet, the tilaka is sweet.",
            },
            {
                "id": "md-5",
                "text": "करणं मधुरं तरणं मधुरं\nहरणं मधुरं रमणं मधुरम्।\nवमितं मधुरं शमितं मधुरं\nमधुरधिपतेरखिलं मधुरम्॥",
                "iast": "karaṇaṃ madhuraṃ taraṇaṃ madhuraṃ haraṇaṃ madhuraṃ ramaṇaṃ madhuram vamitaṃ madhuraṃ śamitaṃ madhuraṃ madhurādhipater akhilaṃ madhuram",
                "hi": "करण मधुर, तरण मधुर, हरण मधुर, रमण मधुर, वमित मधुर, शमित मधुर।",
                "en": "Doing, crossing, taking, delighting, the play of the mouth, the stilling — all is sweet.",
            },
            {
                "id": "md-6",
                "text": "गुञ्जा मधुरा माला मधुरा\nयमुना मधुरा वीची मधुरा।\nसलिलं मधुरं कमलं मधुरं\nमधुरधिपतेरखिलं मधुरम्॥",
                "iast": "guñjā madhurā mālā madhurā yamunā madhurā vīcī madhurā salilaṃ madhuraṃ kamalaṃ madhuraṃ madhurādhipater akhilaṃ madhuram",
                "hi": "गुञ्जा मधुरा, माला मधुरा, यमुना मधुरा, लहर मधुरा, जल मधुर, कमल मधुर।",
                "en": "The gunja-bead is sweet, the garland is sweet, Yamuna is sweet, her wave is sweet, the water is sweet, the lotus is sweet.",
            },
            {
                "id": "md-7",
                "text": "गोपी मधुरा लीला मधुरा\nयुक्तं मधुरं मुक्तं मधुरम्।\nदृष्टं मधुरं शिष्टं मधुरं\nमधुरधिपतेरखिलं मधुरम्॥",
                "iast": "gopī madhurā līlā madhurā yuktaṃ madhuraṃ muktaṃ madhuram dṛṣṭaṃ madhuraṃ śiṣṭaṃ madhuraṃ madhurādhipater akhilaṃ madhuram",
                "hi": "गोपी मधुरा, लीला मधुरा, युक्त मधुर, मुक्त मधुर, दृष्ट मधुर, शिष्ट मधुर।",
                "en": "The gopi is sweet, the play is sweet, union is sweet, freedom is sweet, the seen is sweet, the cultured is sweet.",
            },
            {
                "id": "md-8",
                "text": "गोपा मधुरा गावो मधुरा\nयष्टिर्मधुरा सृष्टिर्मधुरा।\nदलितं मधुरं फलितं मधुरं\nमधुरधिपतेरखिलं मधुरम्॥",
                "iast": "gopā madhurā gāvo madhurā yaṣṭir madhurā sṛṣṭir madhurā dalitaṃ madhuraṃ phalitaṃ madhuraṃ madhurādhipater akhilaṃ madhuram",
                "hi": "गोप मधुर, गौएँ मधुरा, यष्टि मधुरा, सृष्टि मधुरा, दलित मधुर, फलित मधुर — मधुर के अधिपति का सब मधुर है।",
                "en": "The cowherds are sweet, the cows are sweet, the staff is sweet, creation is sweet, the fruit is sweet, the graceful is sweet — all of the Lord of sweetness is sweet.",
            },
        ],
    )
)

PACKS.append(
    dict(
        slug="asato-ma",
        deity="sarva",
        title={"hi": "असतो मा सद्गमय", "en": "Asato ma sad gamaya"},
        subtitle={"hi": "बृहदारण्यक १.३.२८ · पवमान", "en": "Brihadaranyaka 1.3.28 · Pavamana"},
        edition={
            "pin": "ASATO-MA-BAU-1-3-28",
            "notes": "Brihadaranyaka Upanishad 1.3.28. Traditional pavamana recitation. Meanings provisional.",
        },
        category="mantra",
        description={
            "hi": "असत से सत्, तम से ज्योति, मृत्यु से अमृत — तीन पंक्तियों का वैदिक मन्त्र।",
            "en": "From the unreal to the real, darkness to light, death to the deathless — three Vedic lines.",
        },
        verses=[
            {
                "id": "am-1",
                "kind": "mantra",
                "text": "असतो मा सद्गमय।\nतमसो मा ज्योतिर्गमय।\nमृत्योर्मा अमृतं गमय।\nॐ शान्तिः शान्तिः शान्तिः॥",
                "iast": "asato mā sad gamaya tamaso mā jyotir gamaya mṛtyor mā amṛtaṃ gamaya oṃ śāntiḥ śāntiḥ śāntiḥ",
                "hi": "मुझे असत् से सत् की ओर ले चलो। अन्धकार से ज्योति की ओर ले चलो। मृत्यु से अमृत की ओर ले चलो। ॐ शान्तिः शान्तिः शान्तिः।",
                "en": "Lead me from the unreal to the real. From darkness to light. From death to the deathless. Om peace, peace, peace.",
            },
        ],
    )
)

PACKS.append(
    dict(
        slug="krishna-prarthana",
        deity="sarva",
        title={"hi": "कृष्ण प्रार्थना", "en": "Krishna prayer"},
        subtitle={"hi": "कृष्णाय वासुदेवाय · जगद्गुरु", "en": "Krishnaya Vasudevaya · Jagadguru"},
        edition={
            "pin": "KRISHNA-PRARTHANA-HOUSEHOLD",
            "notes": "Two household Krishna verses plus the Vasudeva dwadashakshari. Bhagavata / smarta recitation class. Meanings provisional.",
        },
        category="stotra",
        description={
            "hi": "घर का कृष्ण नमन — जन्माष्टमी और एकादशी।",
            "en": "Household Krishna salutations — Janmashtami and Ekadashi.",
        },
        verses=[
            {
                "id": "kp-1",
                "text": "कृष्णाय वासुदेवाय देवकीनन्दनाय च।\nनन्दगोपकुमाराय गोविन्दाय नमो नमः॥",
                "iast": "kṛṣṇāya vāsudevāya devakīnandanāya ca nandagopakumārāya govindāya namo namaḥ",
                "hi": "कृष्ण, वासुदेव, देवकीनन्दन, नन्द-गोप कुमार, गोविन्द — बार-बार नमस्कार।",
                "en": "Salutation again and again to Krishna, Vasudeva, son of Devaki, child of Nanda the cowherd, Govinda.",
            },
            {
                "id": "kp-2",
                "text": "वसुदेवसुतं देवं कंसचाणूरमर्दनम्।\nदेवकीपरमानन्दं कृष्णं वन्दे जगद्गुरुम्॥",
                "iast": "vasudevasutaṃ devaṃ kaṃsacāṇūramardanam devakīparamānandaṃ kṛṣṇaṃ vande jagadgurum",
                "hi": "वसुदेव-सुत, कंस-चाणूर मर्दन, देवकी का परम आनन्द, जगद्गुरु कृष्ण को वन्दन।",
                "en": "I bow to Krishna, the world-teacher — son of Vasudeva, crusher of Kamsa and Chanura, Devaki’s highest joy.",
            },
            {
                "id": "kp-3",
                "kind": "mantra",
                "text": "ॐ नमो भगवते वासुदेवाय॥",
                "iast": "oṃ namo bhagavate vāsudevāya",
                "hi": "भगवान् वासुदेव को नमस्कार। बारह अक्षर का मन्त्र।",
                "en": "Om, salutation to Bhagavan Vasudeva. The twelve-syllable mantra.",
            },
        ],
    )
)


def main() -> None:
    for p in PACKS:
        write_pack(p)


if __name__ == "__main__":
    main()
