#!/usr/bin/env node
/**
 * Write Shiva + Kali path packages under content/texts/.
 * Mula collated from multiple public sources (see each edition.notes).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TEXTS = path.join(ROOT, "content", "texts");

function writeText(spec) {
  const dir = path.join(TEXTS, spec.slug);
  fs.mkdirSync(path.join(dir, "translations"), { recursive: true });
  fs.mkdirSync(path.join(dir, "transliteration"), { recursive: true });

  const verseIds = spec.verses.map((v) => v.id);
  const verses = {};
  const hi = {};
  const en = {};
  const iast = {};
  for (const v of spec.verses) {
    verses[v.id] = {
      id: v.id,
      kind: v.kind || "shloka",
      text: v.text,
      sectionId: spec.sectionId,
    };
    hi[v.id] = v.hi;
    en[v.id] = v.en;
    iast[v.id] = v.iast;
  }

  const meta = {
    id: spec.slug,
    slug: spec.slug,
    deity: spec.deity,
    title: spec.title,
    subtitle: spec.subtitle,
    originalLang: spec.originalLang || "sa",
    script: "Deva",
    edition: spec.edition,
    flags: {
      hasAudio: false,
      hasOfflinePack: false,
      placeholderAudio: false,
      ttsGenerated: false,
      needsDualReview: true,
    },
    stats: {
      sectionCount: 1,
      verseCount: spec.verses.length,
    },
    wave: spec.wave ?? 0,
    category: spec.category,
    description: spec.description,
  };

  const structure = {
    sections: [
      {
        id: spec.sectionId,
        kind: "editorial-episode",
        title: spec.sectionTitle,
        verseIds,
        order: 1,
      },
    ],
  };

  fs.writeFileSync(path.join(dir, "meta.json"), JSON.stringify(meta, null, 2) + "\n");
  fs.writeFileSync(path.join(dir, "structure.json"), JSON.stringify(structure, null, 2) + "\n");
  fs.writeFileSync(path.join(dir, "verses.json"), JSON.stringify(verses, null, 2) + "\n");
  fs.writeFileSync(path.join(dir, "translations", "hi.json"), JSON.stringify(hi, null, 2) + "\n");
  fs.writeFileSync(path.join(dir, "translations", "en.json"), JSON.stringify(en, null, 2) + "\n");
  fs.writeFileSync(path.join(dir, "transliteration", "iast.json"), JSON.stringify(iast, null, 2) + "\n");
  console.log("wrote", spec.slug, spec.verses.length, "verses");
}

const texts = [];

// ─── SHIVA ───────────────────────────────────────────────────────────

texts.push({
  deity: "shiva",
  slug: "maha-mrityunjaya",
  category: "mantra",
  wave: 0,
  title: { hi: "महामृत्युंजय मन्त्र", en: "Mahamrityunjaya Mantra" },
  subtitle: { hi: "ऋग्वेद ७.५९.१२ · यजुर्वेद", en: "Rigveda 7.59.12 · also Yajurveda" },
  sectionId: "mmj-full",
  sectionTitle: { hi: "पूर्ण मन्त्र", en: "The mantra" },
  description: {
    hi: "त्र्यम्बक मन्त्र — मृत्यु से मुक्ति की वैदिक ऋचा, रुद्र/शिव को सम्बोधित।",
    en: "The Tryambaka verse — Vedic ṛc to Rudra/Shiva seeking release from death, not from immortality.",
  },
  edition: {
    pin: "RV-7.59.12-TS-1.8.6",
    publisher: "Vedic saṃhitā (public domain)",
    notes:
      "Verified against Rigveda 7.59.12 (Vasiṣṭha Maitrāvaruṇi), Taittirīya Saṃhitā 1.8.6.i, Vājasaneyi 3.60. Cross-checked Wikipedia (Mahamrityunjaya Mantra) and standard Devanagari recensions. ॐ is a later liturgical prefix, not in the ṛc itself; included as practised.",
  },
  verses: [
    {
      id: "mmj-01",
      kind: "mantra",
      text: "ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् ।\nउर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय माऽमृतात् ॥",
      iast: "oṃ tryambakaṃ yajāmahe sugandhiṃ puṣṭivardhanam |\nurvārukam iva bandhanān mṛtyor mukṣīya mā'mṛtāt ||",
      hi: "हम तीन नेत्र वाले सुगन्धित, पुष्टि बढ़ाने वाले त्र्यम्बक (रुद्र/शिव) का यजन करते हैं। जैसे ककड़ी डंठल से छूटती है, वैसे मुझे मृत्यु से मुक्त करें — अमृत से नहीं।",
      en: "We worship Tryambaka, the fragrant Three-eyed One who increases nourishment. Like a cucumber from its stalk, may I be freed from death — not from immortality.",
    },
  ],
});

texts.push({
  deity: "shiva",
  slug: "om-namah-shivaya",
  category: "mantra",
  wave: 0,
  title: { hi: "पञ्चाक्षर मन्त्र", en: "Panchakshara Mantra" },
  subtitle: { hi: "ॐ नमः शिवाय", en: "Om Namah Shivaya" },
  sectionId: "pnm-full",
  sectionTitle: { hi: "मूल मन्त्र", en: "The five syllables" },
  description: {
    hi: "शिव का पञ्चाक्षर — न म शि वा य। जप का मूल नाम।",
    en: "Shiva's five-syllable mantra — na ma śi vā ya — the root Name for japa.",
  },
  edition: {
    pin: "PANCHAKSHARA-TRAD",
    publisher: "Śaiva Āgama / popular smārta practice",
    notes:
      "The five syllables namah śivāya are pan-Śaiva (Yajurvedic Śatarudrīya contains namah śivāya). ॐ is the praṇava prefixed in japa. Cross-checked standard recitations; no variant in the five akṣaras.",
  },
  verses: [
    {
      id: "pnm-01",
      kind: "mantra",
      text: "ॐ नमः शिवाय",
      iast: "oṃ namaḥ śivāya",
      hi: "ॐ — शिवरूप परमात्मा को नमस्कार। पाँच अक्षर: न-म-शि-वा-य।",
      en: "Om — salutations to Shiva. The five syllables: na-ma-śi-vā-ya.",
    },
  ],
});

texts.push({
  deity: "shiva",
  slug: "lingashtakam",
  category: "stotra",
  wave: 0,
  title: { hi: "लिङ्गाष्टकम्", en: "Lingashtakam" },
  subtitle: { hi: "ब्रह्ममुरारिसुरार्चितलिङ्गम् · ८ श्लोक + फलश्रुति", en: "Eight verses + phalaśruti" },
  sectionId: "ling-full",
  sectionTitle: { hi: "पूर्ण अष्टक", en: "Full ashtakam" },
  description: {
    hi: "सदाशिव लिङ्ग की स्तुति — ब्रह्मा, विष्णु और देवों द्वारा पूजित।",
    en: "Hymn to the Sadashiva linga worshipped by Brahma, Vishnu and the gods.",
  },
  edition: {
    pin: "LINGASHTAKAM-SD-GM",
    publisher: "Traditional (public domain)",
    notes:
      "Collated from Sanskrit Documents (lingashh, proofread Srinivas Sunder) and Green Message lingashtakam. Variant noted: निर्मलभासित vs निर्मलभाषित in v1 — भाषित kept as the majority temple recension (भासित also attested). v7 विनाशन vs विनाशित — विनाशन used (SD primary).",
  },
  verses: [
    {
      id: "ling-01",
      text: "ब्रह्ममुरारिसुरार्चितलिङ्गं निर्मलभासितशोभितलिङ्गम् ।\nजन्मजदुःखविनाशकलिङ्गं तत् प्रणमामि सदाशिवलिङ्गम् ॥",
      iast: "brahmamurārisurārcitaliṅgaṃ nirmalabhāsitaśobhitaliṅgam |\njanmajaduḥkhavināśakaliṅgaṃ tat praṇamāmi sadāśivaliṅgam ||",
      hi: "ब्रह्मा, विष्णु (मुरारि) और देवों द्वारा पूजित, निर्मल और शोभायमान, जन्म के दुःख का नाश करने वाले उस सदाशिव लिङ्ग को मैं प्रणाम करता हूँ।",
      en: "I bow to that Sadashiva linga worshipped by Brahma, Vishnu and the gods; pure and radiant; destroyer of the sorrow of birth.",
    },
    {
      id: "ling-02",
      text: "देवमुनिप्रवरार्चितलिङ्गं कामदहं करुणाकरलिङ्गम् ।\nरावणदर्पविनाशनलिङ्गं तत् प्रणमामि सदाशिवलिङ्गम् ॥",
      iast: "devamunipravarārcitaliṅgaṃ kāmadahaṃ karuṇākaraliṅgam |\nrāvaṇadarpavināśanaliṅgaṃ tat praṇamāmi sadāśivaliṅgam ||",
      hi: "देवों और श्रेष्ठ मुनियों द्वारा पूजित, काम को भस्म करने वाले, करुणा के सागर, रावण के दर्प का नाश करने वाले सदाशिव लिङ्ग को प्रणाम।",
      en: "I bow to that Sadashiva linga worshipped by gods and foremost sages; who burned Kama; ocean of compassion; destroyer of Ravana's pride.",
    },
    {
      id: "ling-03",
      text: "सर्वसुगन्धिसुलेपितलिङ्गं बुद्धिविवर्धनकारणलिङ्गम् ।\nसिद्धसुरासुरवन्दितलिङ्गं तत् प्रणमामि सदाशिवलिङ्गम् ॥",
      iast: "sarvasugandhisulepitaliṅgaṃ buddhivivardhanakāraṇaliṅgam |\nsiddhasurāsuravanditaliṅgaṃ tat praṇamāmi sadāśivaliṅgam ||",
      hi: "सभी सुगन्धों से लेपित, बुद्धि बढ़ाने वाले, सिद्ध-देव-असुरों द्वारा वन्दित सदाशिव लिङ्ग को प्रणाम।",
      en: "I bow to that Sadashiva linga anointed with all fragrances; cause of the growth of wisdom; praised by siddhas, gods and asuras.",
    },
    {
      id: "ling-04",
      text: "कनकमहामणिभूषितलिङ्गं फणिपतिवेष्टितशोभितलिङ्गम् ।\nदक्षसुयज्ञविनाशनलिङ्गं तत् प्रणमामि सदाशिवलिङ्गम् ॥",
      iast: "kanakamahāmaṇibhūṣitaliṅgaṃ phaṇipativeṣṭitaśobhitaliṅgam |\ndakṣasuyajñavināśanaliṅgaṃ tat praṇamāmi sadāśivaliṅgam ||",
      hi: "स्वर्ण और महामणियों से भूषित, शेषनाग से वेष्टित, दक्ष के यज्ञ का नाश करने वाले सदाशिव लिङ्ग को प्रणाम।",
      en: "I bow to that Sadashiva linga adorned with gold and great gems; wrapped by the serpent-king; destroyer of Daksha's grand sacrifice.",
    },
    {
      id: "ling-05",
      text: "कुङ्कुमचन्दनलेपितलिङ्गं पङ्कजहारसुशोभितलिङ्गम् ।\nसञ्चितपापविनाशनलिङ्गं तत् प्रणमामि सदाशिवलिङ्गम् ॥",
      iast: "kuṅkumacandanaleptaliṅgaṃ paṅkajahārasuśobhitaliṅgam |\nsañcitapāpavināśanaliṅgaṃ tat praṇamāmi sadāśivaliṅgam ||",
      hi: "कुंकुम और चन्दन से लेपित, कमल-हार से सुशोभित, संचित पाप का नाश करने वाले सदाशिव लिङ्ग को प्रणाम।",
      en: "I bow to that Sadashiva linga smeared with saffron and sandal; beautified with a lotus garland; destroyer of accumulated sin.",
    },
    {
      id: "ling-06",
      text: "देवगणार्चितसेवितलिङ्गं भावैर्भक्तिभिरेव च लिङ्गम् ।\nदिनकरकोटिप्रभाकरलिङ्गं तत् प्रणमामि सदाशिवलिङ्गम् ॥",
      iast: "devagaṇārcitasevitaliṅgaṃ bhāvairbhaktibhireva ca liṅgam |\ndinakarakoṭiprabhākaraliṅgaṃ tat praṇamāmi sadāśivaliṅgam ||",
      hi: "देवगणों द्वारा भाव और भक्ति से अर्चित-सेवित, करोड़ों सूर्यों की प्रभा वाले सदाशिव लिङ्ग को प्रणाम।",
      en: "I bow to that Sadashiva linga served by hosts of gods with true feeling and devotion; whose splendour is that of a crore of suns.",
    },
    {
      id: "ling-07",
      text: "अष्टदलोपरिवेष्टितलिङ्गं सर्वसमुद्भवकारणलिङ्गम् ।\nअष्टदरिद्रविनाशनलिङ्गं तत् प्रणमामि सदाशिवलिङ्गम् ॥",
      iast: "aṣṭadalopariveṣṭitaliṅgaṃ sarvasamudbhavakāraṇaliṅgam |\naṣṭadaridravināśanaliṅgaṃ tat praṇamāmi sadāśivaliṅgam ||",
      hi: "आठ पंखुड़ियों से वेष्टित, समस्त सृष्टि का कारण, आठ प्रकार की दरिद्रता का नाश करने वाले सदाशिव लिङ्ग को प्रणाम।",
      en: "I bow to that Sadashiva linga surrounded by eight-petalled flowers; cause of all arising; destroyer of the eight poverties.",
    },
    {
      id: "ling-08",
      text: "सुरगुरुसुरवरपूजितलिङ्गं सुरवनपुष्पसदार्चितलिङ्गम् ।\nपरात्परं परमात्मकलिङ्गं तत् प्रणमामि सदाशिवलिङ्गम् ॥",
      iast: "suragurusuravarapūjitaliṅgaṃ suravanapuṣpasadārcitaliṅgam |\nparātparaṃ paramātmakaliṅgaṃ tat praṇamāmi sadāśivaliṅgam ||",
      hi: "देवगुरु बृहस्पति और श्रेष्ठ देवों द्वारा पूजित, दिव्य पुष्पों से सदा अर्चित, परात्पर परमात्मस्वरूप सदाशिव लिङ्ग को प्रणाम।",
      en: "I bow to that Sadashiva linga worshipped by the preceptor of the gods and the foremost gods; always worshipped with celestial flowers; the Supreme Self beyond the beyond.",
    },
    {
      id: "ling-09",
      kind: "phalashruti",
      text: "लिङ्गाष्टकमिदं पुण्यं यः पठेत् शिवसन्निधौ ।\nशिवलोकमवाप्नोति शिवेन सह मोदते ॥",
      iast: "liṅgāṣṭakam idaṃ puṇyaṃ yaḥ paṭhet śivasannidhau |\nśivalokam avāpnoti śivena saha modate ||",
      hi: "जो इस पुण्य लिङ्गाष्टक को शिव की सन्निधि में पढ़ता है, वह शिवलोक पाता है और शिव के साथ आनन्द करता है।",
      en: "Whoever recites this sacred Lingashtakam in the presence of Shiva attains Shiva's world and rejoices with Shiva.",
    },
  ],
});

texts.push({
  deity: "shiva",
  slug: "shiva-panchakshara-stotram",
  category: "stotra",
  wave: 0,
  title: { hi: "शिवपञ्चाक्षरस्तोत्रम्", en: "Shiva Panchakshara Stotram" },
  subtitle: { hi: "आदि शङ्कर · नागेन्द्रहाराय", en: "Adi Shankara · Nagendraharaya" },
  sectionId: "sps-full",
  sectionTitle: { hi: "पूर्ण स्तोत्र", en: "Full stotra" },
  description: {
    hi: "न-म-शि-वा-य — प्रत्येक अक्षर पर एक श्लोक।",
    en: "One stanza for each syllable of Na-Ma-Shi-Va-Ya.",
  },
  edition: {
    pin: "SPS-SHANKARA-GM-SRINGERI",
    publisher: "Attributed to Adi Shankara (public domain)",
    notes:
      "Collated from Green Message, Sringeri Sharada Peetham stotra page, and Wikipedia hymn text. v2 flower-line: मन्दारपुष्पबहुपुष्पसुपूजिताय (GM) vs मन्दारमुख्यबहुपुष्प (Sringeri) — Sringeri मुख्य kept as matha recension. v5 यज्ञस्वरूपाय (primary; यक्षस्वरूपाय variant noted).",
  },
  verses: [
    {
      id: "sps-01",
      text: "नागेन्द्रहाराय त्रिलोचनाय भस्माङ्गरागाय महेश्वराय ।\nनित्याय शुद्धाय दिगम्बराय तस्मै नकाराय नमः शिवाय ॥",
      iast: "nāgendrahārāya trilocanāya bhasmāṅgarāgāya maheśvarāya |\nnityāya śuddhāya digambarāya tasmai nakārāya namaḥ śivāya ||",
      hi: "सर्पों के राजा का हार धारण करने वाले, त्रिनेत्र, भस्म-अङ्गराग, महेश्वर, नित्य, शुद्ध, दिगम्बर — उस 'न' कार रूप शिव को नमस्कार।",
      en: "Salutations to Shiva as the syllable Na — who wears the serpent-king as a garland, three-eyed, smeared with ash, the Great Lord, eternal, pure, clothed in the directions.",
    },
    {
      id: "sps-02",
      text: "मन्दाकिनीसलिलचन्दनचर्चिताय नन्दीश्वरप्रमथनाथमहेश्वराय ।\nमन्दारमुख्यबहुपुष्पसुपूजिताय तस्मै मकाराय नमः शिवाय ॥",
      iast: "mandākinīsalilacandanacarcitāya nandīśvarapramathanāthamaheśvarāya |\nmandāramukhyabahupuṣpasupūjitāya tasmai makārāya namaḥ śivāya ||",
      hi: "गङ्गाजल और चन्दन से अर्चित, नन्दी और प्रमथगणों के नाथ, मन्दार आदि पुष्पों से पूजित — उस 'म' कार रूप शिव को नमस्कार।",
      en: "Salutations to Shiva as the syllable Ma — anointed with Ganga water and sandal, lord of Nandi and the pramathas, worshipped with mandara and many flowers.",
    },
    {
      id: "sps-03",
      text: "शिवाय गौरीवदनाब्जवृन्दसूर्याय दक्षाध्वरनाशकाय ।\nश्रीनीलकण्ठाय वृषध्वजाय तस्मै शिकाराय नमः शिवाय ॥",
      iast: "śivāya gaurīvadanābjavrṇdasūryāya dakṣādhvaranāśakāya |\nśrīnīlakaṇṭhāya vṛṣadhvajāya tasmai śikārāya namaḥ śivāya ||",
      hi: "कल्याणस्वरूप, गौरी के मुख-कमल को खिलाने वाले सूर्य, दक्ष-यज्ञ के नाशक, नीलकण्ठ, वृषध्वज — उस 'शि' कार रूप शिव को नमस्कार।",
      en: "Salutations to Shiva as the syllable Shi — auspicious one, sun to the lotus-face of Gauri, destroyer of Daksha's sacrifice, blue-throated, whose banner is the bull.",
    },
    {
      id: "sps-04",
      text: "वसिष्ठकुम्भोद्भवगौतमार्यमुनीन्द्रदेवार्चितशेखराय ।\nचन्द्रार्कवैश्वानरलोचनाय तस्मै वकाराय नमः शिवाय ॥",
      iast: "vasiṣṭhakumbhodbhavagautamāryamunīndradevārcitaśekharāya |\ncandrārkavaiśvānaralocanāya tasmai vakārāya namaḥ śivāya ||",
      hi: "वसिष्ठ, अगस्त्य (कुम्भोद्भव) और गौतम आदि मुनीन्द्रों तथा देवों द्वारा अर्चित, चन्द्र-सूर्य-अग्नि नेत्र वाले — उस 'व' कार रूप शिव को नमस्कार।",
      en: "Salutations to Shiva as the syllable Va — worshipped by Vasistha, Agastya, Gautama and the gods; whose three eyes are moon, sun and fire.",
    },
    {
      id: "sps-05",
      text: "यज्ञस्वरूपाय जटाधराय पिनाकहस्ताय सनातनाय ।\nदिव्याय देवाय दिगम्बराय तस्मै यकाराय नमः शिवाय ॥",
      iast: "yajñasvarūpāya jaṭādharāya pinākahastāya sanātanāya |\ndivyāya devāya digambarāya tasmai yakārāya namaḥ śivāya ||",
      hi: "यज्ञस्वरूप, जटाधारी, पिनाक-हस्त, सनातन, दिव्य देव, दिगम्बर — उस 'य' कार रूप शिव को नमस्कार।",
      en: "Salutations to Shiva as the syllable Ya — embodiment of yajña, wearing matted locks, pinaka in hand, eternal, divine, sky-clad.",
    },
    {
      id: "sps-06",
      kind: "phalashruti",
      text: "पञ्चाक्षरमिदं पुण्यं यः पठेच्छिवसंनिधौ ।\nशिवलोकमावाप्नोति शिवेन सह मोदते ॥",
      iast: "pañcākṣaram idaṃ puṇyaṃ yaḥ paṭhec chivasaṃnidhau |\nśivalokam āvāpnoti śivena saha modate ||",
      hi: "जो इस पुण्य पञ्चाक्षर स्तोत्र को शिव की सन्निधि में पढ़ता है, शिवलोक पाता है और शिव के साथ आनन्द करता है।",
      en: "Whoever recites this sacred Panchakshara near Shiva attains Shiva's world and rejoices with Shiva.",
    },
  ],
});

texts.push({
  deity: "shiva",
  slug: "rudrashtakam",
  category: "stotra",
  wave: 0,
  title: { hi: "रुद्राष्टकम्", en: "Rudrashtakam" },
  subtitle: { hi: "तुलसीदास · रामचरितमानस उत्तरकाण्ड", en: "Tulsidas · Ramcharitmanas Uttarakanda" },
  sectionId: "rudra-full",
  sectionTitle: { hi: "पूर्ण अष्टक", en: "Full ashtakam" },
  description: {
    hi: "नमामीशमीशान निर्वाणरूपम् — गोस्वामी तुलसीदास कृत शिव स्तुति।",
    en: "Namamisham Ishana — Tulsidas's eight-verse hymn to Rudra.",
  },
  edition: {
    pin: "RUDRASTAKAM-TULSI-MANAS",
    publisher: "Goswami Tulsidas, Ramcharitmanas Uttarakanda (public-domain recension)",
    notes:
      "Collated from multiple Devanagari printings (sanatan-dharm, BhajanSangam, India TV GP-style, stotra.in). v1 भजेऽहम्; v8 आपन्नमामीश शम्भो. Phalaśruti (verse 9) included as traditionally appended.",
  },
  verses: [
    {
      id: "rudra-01",
      text: "नमामीशमीशान निर्वाणरूपं विभुं व्यापकं ब्रह्मवेदस्वरूपम् ।\nनिजं निर्गुणं निर्विकल्पं निरीहं चिदाकाशमाकाशवासं भजेऽहम् ॥",
      iast: "namāmīśam īśānaṃ nirvāṇarūpaṃ vibhuṃ vyāpakaṃ brahmavedasvarūpam |\nnijaṃ nirguṇaṃ nirvikalpaṃ nirīhaṃ cidākāśam ākāśavāsaṃ bhaje'ham ||",
      hi: "मैं ईशान को नमस्कार करता हूँ — निर्वाणरूप, विभु, व्यापक, ब्रह्म और वेदस्वरूप, निज, निर्गुण, निर्विकल्प, निरीह; चिदाकाश में रहने वाले उस प्रभु को भजता हूँ।",
      en: "I bow to the Lord Ishana, whose form is nirvana; all-pervading; the essence of Brahman and Veda; beyond the gunas and all vikalpa; I worship Him who dwells as consciousness-space.",
    },
    {
      id: "rudra-02",
      text: "निराकारमोंकारमूलं तुरीयं गिराज्ञानगोतीतमीशं गिरीशम् ।\nकरालं महाकालकालं कृपालं गुणागारसंसारपारं नतोऽहम् ॥",
      iast: "nirākāram oṃkāramūlaṃ turīyaṃ girājñānagotītam īśaṃ girīśam |\nkarālaṃ mahākālakālaṃ kṛpālaṃ guṇāgārasaṃsārapāraṃ nato'ham ||",
      hi: "निराकार, ओंकार के मूल, तुरीय, वाणी-ज्ञान-इन्द्रियों से परे, गिरीश, कराल, महाकाल के भी काल, कृपालु, संसार से पार — उनको मैं नमन करता हूँ।",
      en: "I bow to the formless root of Omkara, the Turiya, beyond speech and sense-knowledge, Lord of mountains, terrible yet compassionate, Time of Mahakala, beyond the world of gunas.",
    },
    {
      id: "rudra-03",
      text: "तुषाराद्रिसंकाशगौरं गभीरं मनोभूतकोटिप्रभाश्रीशरीरम् ।\nस्फुरन्मौलिकल्लोलिनीचारुगङ्गा लसद्भालबालेन्दुकण्ठे भुजङ्गा ॥",
      iast: "tuṣāradrisaṃkāśagauraṃ gabhīraṃ manobhūtakotiprabhāśrīśarīram |\nsphuranmaulikallolinīcārugaṅgā lasadbhālabālendukaṇṭhe bhujaṅgā ||",
      hi: "हिमालय-सा गौर और गम्भीर, कामदेव-कोटि कान्ति का शरीर; जटा में चञ्चल गङ्गा, भाल पर बालचन्द्र, कण्ठ में सर्प।",
      en: "Fair as a snow peak, deep; body shining like a crore of Kamadevas; Ganga flashing in the matted locks, young moon on the brow, serpents at the throat.",
    },
    {
      id: "rudra-04",
      text: "चलत्कुण्डलं भ्रूसुनेत्रं विशालं प्रसन्नाननं नीलकण्ठं दयालम् ।\nमृगाधीशचर्माम्बरं मुण्डमालं प्रियं शङ्करं सर्वनाथं भजामि ॥",
      iast: "calatkuṇḍalaṃ bhrūsunetraṃ viśālaṃ prasannānanaṃ nīlakaṇṭhaṃ dayālam |\nmṛgādhīśacarmāmbaraṃ muṇḍamālaṃ priyaṃ śaṅkaraṃ sarvanāthaṃ bhajāmi ||",
      hi: "हिलते कुण्डल, सुन्दर भृकुटी और विशाल नेत्र, प्रसन्न मुख, नीलकण्ठ, दयालु, व्याघ्रचर्म, मुण्डमाल — प्रिय शङ्कर, सबके नाथ को मैं भजता हूँ।",
      en: "I worship beloved Shankara, lord of all — swinging earrings, fair brows and wide eyes, gracious face, blue-throated, compassionate, clad in tiger-skin, wearing a garland of skulls.",
    },
    {
      id: "rudra-05",
      text: "प्रचण्डं प्रकृष्टं प्रगल्भं परेशं अखण्डं अजं भानुकोटिप्रकाशम् ।\nत्रयःशूलनिर्मूलनं शूलपाणिं भजेऽहं भवानीपतिं भावगम्यम् ॥",
      iast: "pracaṇḍaṃ prakṛṣṭaṃ pragalbhaṃ pareśaṃ akhaṇḍaṃ ajaṃ bhānukoṭiprakāśam |\ntrayaḥśūlanirmūlanaṃ śūlapāṇiṃ bhaje'haṃ bhavānīpatiṃ bhāvagamyam ||",
      hi: "प्रचण्ड, श्रेष्ठ, प्रगल्भ, परेश, अखण्ड, अज, करोड़ सूर्य-प्रकाश, तीनों तापों का निर्मूलन करने वाले शूलपाणि, भावगम्य भवानीपति को मैं भजता हूँ।",
      en: "I worship Bhavani's lord — fierce, eminent, bold, supreme, undivided, unborn, bright as a crore of suns, trident in hand, uprooting the three afflictions, reached by feeling.",
    },
    {
      id: "rudra-06",
      text: "कलातीत कल्याण कल्पान्तकारी सदा सज्जनानन्ददाता पुरारी ।\nचिदानन्दसंदोह मोहापहारी प्रसीद प्रसीद प्रभो मन्मथारी ॥",
      iast: "kalātīta kalyāṇa kalpāntakārī sadā sajjanānandadātā purārī |\ncidānandasaṃdoha mohāpahārī prasīda prasīda prabho manmathārī ||",
      hi: "कला से परे, कल्याणरूप, कल्प के अन्त करने वाले, सज्जनों को आनन्द देने वाले पुरारि, चिदानन्द के पुंज, मोह हरने वाले — प्रभो मन्मथारि, प्रसन्न हों।",
      en: "O Purari, beyond time's arts, auspicious, ender of aeons, giver of joy to the good, mass of consciousness-bliss, thief of delusion — be gracious, O foe of Manmatha.",
    },
    {
      id: "rudra-07",
      text: "न यावद् उमानाथ पादारविन्दं भजन्तीह लोके परे वा नराणाम् ।\nन तावत्सुखं शान्ति सन्तापनाशं प्रसीद प्रभो सर्वभूताधिवासम् ॥",
      iast: "na yāvad umānātha pādāravindaṃ bhajantīha loke pare vā narāṇām |\nna tāvat sukhaṃ śānti santāpanāśaṃ prasīda prabho sarvabhūtādhivāsam ||",
      hi: "हे उमानाथ, जब तक मनुष्य इस लोक या परलोक में आपके चरणकमल नहीं भजते, तब तक सुख-शान्ति और सन्ताप-नाश नहीं मिलता। सर्वभूतों में वास करने वाले प्रभो, प्रसन्न हों।",
      en: "Until people worship Uma's Lord's lotus feet — here or hereafter — there is no joy, peace, or end of burning. Be gracious, O Lord who dwells in all beings.",
    },
    {
      id: "rudra-08",
      text: "न जानामि योगं जपं नैव पूजां नतोऽहं सदा सर्वदा शम्भो तुभ्यम् ।\nजरा जन्मदुःखौघ ताप्यमानं प्रभो पाहि आपन्नमामीश शम्भो ॥",
      iast: "na jānāmi yogaṃ japaṃ naiva pūjāṃ nato'haṃ sadā sarvadā śambho tubhyam |\njarājanmaduḥkhaugha tāpyamānaṃ prabho pāhi āpannam āmīśa śambho ||",
      hi: "योग, जप, पूजा मैं नहीं जानता; हे शम्भो, सदा आपको नमन है। जरा-जन्म के दुःखों से तप रहा हूँ — आपन्न की रक्षा करें, ईश शम्भो।",
      en: "I know neither yoga nor japa nor puja; I only bow to you always, O Shambhu. Burning in the flood of old age and birth-sorrow — protect this one in distress, O Lord Shambhu.",
    },
    {
      id: "rudra-09",
      kind: "phalashruti",
      text: "रुद्राष्टकमिदं प्रोक्तं विप्रेण हरतोषये ।\nये पठन्ति नरा भक्त्या तेषां शम्भुः प्रसीदति ॥",
      iast: "rudrāṣṭakam idaṃ proktaṃ vipreṇa haratoṣaye |\nye paṭhanti narā bhaktyā teṣāṃ śambhuḥ prasīdati ||",
      hi: "हर को प्रसन्न करने के लिए विप्र द्वारा कहा गया यह रुद्राष्टक जो भक्ति से पढ़ते हैं, उन पर शम्भु प्रसन्न होते हैं।",
      en: "This Rudrashtakam was spoken by the sage to please Hara. Shambhu is pleased with those who recite it with devotion.",
    },
  ],
});

texts.push({
  deity: "shiva",
  slug: "nirvana-shatkam",
  category: "stotra",
  wave: 0,
  title: { hi: "निर्वाणषट्कम्", en: "Nirvana Shatkam" },
  subtitle: { hi: "आदि शङ्कर · शिवोऽहम्", en: "Adi Shankara · Śivo'ham" },
  sectionId: "ns-full",
  sectionTitle: { hi: "छह श्लोक", en: "Six verses" },
  description: {
    hi: "चिदानन्दरूपः शिवोऽहम् — आत्मा का निषेध-विधि से साक्षात्कार।",
    en: "Cidānandarūpaḥ śivo'ham — Self-knowledge by neti-neti.",
  },
  edition: {
    pin: "NIRVANA-SHATKAM-SHANKARA",
    publisher: "Attributed to Adi Shankara (public domain)",
    notes:
      "Collated from Green Message nirvana_shatkam and standard Advaita recensions. Also called Ātmaṣaṭkam. Six verses; refrain चिदानन्दरूपः शिवोऽहम् शिवोऽहम् is stable across sources.",
  },
  verses: [
    {
      id: "ns-01",
      text: "मनोबुद्ध्यहङ्कारचित्तानि नाहं न च श्रोत्रजिह्वे न च घ्राणनेत्रे ।\nन च व्योम भूमिर्न तेजो न वायुः चिदानन्दरूपः शिवोऽहम् शिवोऽहम् ॥",
      iast: "manobuddhyahaṅkāracittāni nāhaṃ na ca śrotrajihve na ca ghrāṇanetre |\nna ca vyoma bhūmir na tejo na vāyuḥ cidānandarūpaḥ śivo'ham śivo'ham ||",
      hi: "मैं मन, बुद्धि, अहंकार, चित्त नहीं; श्रोत्र-जिह्वा-घ्राण-नेत्र नहीं; आकाश-पृथ्वी-तेज-वायु नहीं। मैं चिदानन्दरूप शिव हूँ, शिव हूँ।",
      en: "I am not mind, intellect, ego, or memory; not ear, tongue, nose, or eyes; not space, earth, fire, or air. I am Shiva, of the form of consciousness-bliss.",
    },
    {
      id: "ns-02",
      text: "न च प्राणसंज्ञो न वै पञ्चवायुः न वा सप्तधातुर्न वा पञ्चकोशः ।\nन वाक्पाणिपादं न चोपस्थपायुः चिदानन्दरूपः शिवोऽहम् शिवोऽहम् ॥",
      iast: "na ca prāṇasaṃjño na vai pañcavāyuḥ na vā saptadhātur na vā pañcakośaḥ |\nna vākpāṇipādaṃ na copasthapāyuḥ cidānandarūpaḥ śivo'ham śivo'ham ||",
      hi: "मैं प्राण नहीं, पञ्चवायु नहीं, सप्तधातु नहीं, पञ्चकोश नहीं; वाक्-पाणि-पाद-उपस्थ-पायु नहीं। मैं चिदानन्दरूप शिव हूँ।",
      en: "I am not the vital breath, nor the five winds, seven constituents, or five sheaths; not speech, hands, feet, or organs of generation and excretion. I am Shiva.",
    },
    {
      id: "ns-03",
      text: "न मे द्वेषरागौ न मे लोभमोहौ मदो नैव मे नैव मात्सर्यभावः ।\nन धर्मो न चार्थो न कामो न मोक्षः चिदानन्दरूपः शिवोऽहम् शिवोऽहम् ॥",
      iast: "na me dveṣarāgau na me lobhamohau mado naiva me naiva mātsaryabhāvaḥ |\nna dharmo na cārtho na kāmo na mokṣaḥ cidānandarūpaḥ śivo'ham śivo'ham ||",
      hi: "मुझे द्वेष-राग, लोभ-मोह, मद-मात्सर्य नहीं; धर्म-अर्थ-काम-मोक्ष के बन्धन नहीं। मैं चिदानन्दरूप शिव हूँ।",
      en: "I have neither hatred nor attachment, greed nor delusion, pride nor envy. I am not bound by dharma, artha, kama, or moksha. I am Shiva.",
    },
    {
      id: "ns-04",
      text: "न पुण्यं न पापं न सौख्यं न दुःखं न मन्त्रो न तीर्थं न वेदा न यज्ञाः ।\nअहं भोजनं नैव भोज्यं न भोक्ता चिदानन्दरूपः शिवोऽहम् शिवोऽहम् ॥",
      iast: "na puṇyaṃ na pāpaṃ na saukhyaṃ na duḥkhaṃ na mantro na tīrthaṃ na vedā na yajñāḥ |\nahaṃ bhojanaṃ naiva bhojyaṃ na bhoktā cidānandarūpaḥ śivo'ham śivo'ham ||",
      hi: "न पुण्य न पाप, न सुख न दुःख; न मन्त्र न तीर्थ, न वेद न यज्ञ। मैं भोग, भोज्य या भोक्ता नहीं। मैं चिदानन्दरूप शिव हूँ।",
      en: "Neither merit nor sin, joy nor sorrow; neither mantra, nor tirtha, Veda, nor sacrifice. I am not the enjoyment, the enjoyed, or the enjoyer. I am Shiva.",
    },
    {
      id: "ns-05",
      text: "न मृत्युर्न शङ्का न मे जातिभेदः पिता नैव मे नैव माता न जन्मः ।\nन बन्धुर्न मित्रं गुरुर्नैव शिष्यः चिदानन्दरूपः शिवोऽहम् शिवोऽहम् ॥",
      iast: "na mṛtyur na śaṅkā na me jātibhedaḥ pitā naiva me naiva mātā na janmaḥ |\nna bandhur na mitraṃ gurur naiva śiṣyaḥ cidānandarūpaḥ śivo'ham śivo'ham ||",
      hi: "न मृत्यु का भय, न जातिभेद; न पिता न माता न जन्म; न बन्धु न मित्र, न गुरु न शिष्य। मैं चिदानन्दरूप शिव हूँ।",
      en: "Neither death nor fear of it, nor caste distinction; neither father, mother, nor birth; neither kin nor friend, teacher nor disciple. I am Shiva.",
    },
    {
      id: "ns-06",
      text: "अहं निर्विकल्पो निराकाररूपो विभुत्वाच्च सर्वत्र सर्वेन्द्रियाणाम् ।\nन चासङ्गतं नैव मुक्तिर्न मेयः चिदानन्दरूपः शिवोऽहम् शिवोऽहम् ॥",
      iast: "ahaṃ nirvikalpo nirākārarūpo vibhutvāc ca sarvatra sarvendriyāṇām |\nna cāsaṅgataṃ naiva muktir na meyaḥ cidānandarūpaḥ śivo'ham śivo'ham ||",
      hi: "मैं निर्विकल्प, निराकार हूँ; सर्वत्र सब इन्द्रियों के पीछे विभु। न आसक्ति न मुक्ति मापने योग्य। मैं चिदानन्दरूप शिव हूँ, शिव हूँ।",
      en: "I am without alternative or form; all-pervading, behind all senses. Neither attachment nor liberation is mine to be measured. I am Shiva, I am Shiva.",
    },
  ],
});

texts.push({
  deity: "shiva",
  slug: "kalabhairava-ashtakam",
  category: "stotra",
  wave: 0,
  title: { hi: "कालभैरवाष्टकम्", en: "Kalabhairava Ashtakam" },
  subtitle: { hi: "आदि शङ्कर · काशिकापुराधिनाथ", en: "Adi Shankara · Lord of Kashi" },
  sectionId: "kba-full",
  sectionTitle: { hi: "पूर्ण अष्टक", en: "Full ashtakam" },
  description: {
    hi: "काशी के अधिनाथ कालभैरव की आठ स्तुतियाँ।",
    en: "Eight verses to Kalabhairava, lord of Kashi.",
  },
  edition: {
    pin: "KALABHAIRAVA-SHANKARA-GM",
    publisher: "Attributed to Adi Shankara (public domain)",
    notes:
      "Collated from Green Message kalabhairava_ashtakam. Refrain काशिकापुराधिनाथकालभैरवं भजे is stable. Eight stanzas + phalaśruti.",
  },
  verses: [
    {
      id: "kba-01",
      text: "देवराजसेव्यमानपावनांघ्रिपङ्कजं व्यालयज्ञसूत्रमिन्दुशेखरं कृपाकरम् ।\nनारदादियोगिवृन्दवन्दितं दिगम्बरं काशिकापुराधिनाथकालभैरवं भजे ॥",
      iast: "devarājasevyamānapāvanāṅghripaṅkajaṃ vyālayajñasūtram induśekharaṃ kṛpākaram |\nnāradādiyogivṛndavanditaṃ digambaraṃ kāśikāpurādhināthakālabhairavaṃ bhaje ||",
      hi: "इन्द्र द्वारा सेवित पवित्र चरणकमल, सर्प-यज्ञोपवीत, चन्द्रशेखर, कृपाकर, नारदादि योगियों द्वारा वन्दित दिगम्बर — काशी के अधिनाथ कालभैरव को मैं भजता हूँ।",
      en: "I worship Kalabhairava, lord of Kashi — lotus-feet served by Indra, snake as sacred thread, moon-crested, compassionate, praised by Narada and yogis, sky-clad.",
    },
    {
      id: "kba-02",
      text: "भानुकोटिभास्वरं भवाब्धितारकं परं नीलकण्ठमीप्सितार्थदायकं त्रिलोचनम् ।\nकालकालमम्बुजाक्षमक्षशूलमक्षरं काशिकापुराधिनाथकालभैरवं भजे ॥",
      iast: "bhānukoṭibhāsvaraṃ bhavābdhitārakaṃ paraṃ nīlakaṇṭham īpsitārthadāyakaṃ trilocanam |\nkālakālam ambujākṣam akṣaśūlam akṣaraṃ kāśikāpurādhināthakālabhairavaṃ bhaje ||",
      hi: "करोड़ सूर्य-प्रभा, भवसागर से तारने वाले, नीलकण्ठ, अभीष्ट देने वाले त्रिलोचन, काल के भी काल, कमलनयन, अक्षर — कालभैरव को भजता हूँ।",
      en: "I worship Kalabhairava — brilliant as a crore of suns, who ferries us across becoming, blue-throated, giver of desired ends, three-eyed, Death of death, lotus-eyed, imperishable.",
    },
    {
      id: "kba-03",
      text: "शूलटङ्कपाशदण्डपाणिमादिकारणं श्यामकायमादिदेवमक्षरं निरामयम् ।\nभीमविक्रमं प्रभुं विचित्रताण्डवप्रियं काशिकापुराधिनाथकालभैरवं भजे ॥",
      iast: "śūlaṭaṅkapāśadaṇḍapāṇim ādikāraṇaṃ śyāmakāyam ādidevam akṣaraṃ nirāmayam |\nbhīmavikramaṃ prabhuṃ vicitratāṇḍavapriyaṃ kāśikāpurādhināthakālabhairavaṃ bhaje ||",
      hi: "शूल-टंक-पाश-दण्ड धारण करने वाले, आदि कारण, श्यामकाय आदिदेव, अक्षर, निरामय, भीम विक्रम, विचित्र ताण्डव-प्रिय — कालभैरव को भजता हूँ।",
      en: "I worship Kalabhairava — trident, hatchet, noose and staff in hand; primordial cause; dark-bodied first among gods; who loves the strange tandava.",
    },
    {
      id: "kba-04",
      text: "भुक्तिमुक्तिदायकं प्रशस्तचारुविग्रहं भक्तवत्सलं स्थितं समस्तलोकविग्रहम् ।\nविनिक्वणन्मनोज्ञहेमकिङ्किणीलसत्कटिं काशिकापुराधिनाथकालभैरवं भजे ॥",
      iast: "bhuktimuktidāyakaṃ praśastacāruvigrahaṃ bhaktavatsalaṃ sthitaṃ samastalokavigraham |\nvinikvaṇanmanojñahemakiṅkiṇīlasatkaṭiṃ kāśikāpurādhināthakālabhairavaṃ bhaje ||",
      hi: "भोग और मुक्ति देने वाले, सुन्दर विग्रह, भक्तवत्सल, सब लोकों के अधिष्ठाता, सोने की किंकिणियों से जगमगाती कटि वाले कालभैरव को भजता हूँ।",
      en: "I worship Kalabhairava — giver of enjoyment and liberation, gracious form, loving to devotees, standing as the form of all worlds, golden bells shining at the waist.",
    },
    {
      id: "kba-05",
      text: "धर्मसेतुपालकं त्वधर्ममार्गनाशकं कर्मपाशमोचकं सुशर्मदायकं विभुम् ।\nस्वर्णवर्णशेषपाशशोभिताङ्गमण्डलं काशिकापुराधिनाथकालभैरवं भजे ॥",
      iast: "dharmasetupālakaṃ tv adharmamārganāśakaṃ karmapāśamocakaṃ suśarmadāyakaṃ vibhum |\nsvarṇavarṇaśeṣapāśaśobhitāṅgamaṇḍalaṃ kāśikāpurādhināthakālabhairavaṃ bhaje ||",
      hi: "धर्म-सेतु के पालक, अधर्म-मार्ग के नाशक, कर्म-पाश से मुक्त करने वाले, कल्याणदाता विभु, स्वर्णवर्ण सर्पों से शोभित — कालभैरव को भजता हूँ।",
      en: "I worship Kalabhairava — guardian of dharma's bridge, destroyer of adharma's path, releaser from karma's noose, giver of true well-being, adorned with golden serpents.",
    },
    {
      id: "kba-06",
      text: "रत्नपादुकाप्रभाभिरामपादयुग्मकं नित्यमद्वितीयमिष्टदैवतं निरञ्जनम् ।\nमृत्युदर्पनाशनं करालदंष्ट्रमोक्षणं काशिकापुराधिनाथकालभैरवं भजे ॥",
      iast: "ratnapādukāprabhābhirāmapādayugmakaṃ nityam advitīyam iṣṭadaivataṃ nirañjanam |\nmṛtyudarpanāśanaṃ karāladaṃṣṭramokṣaṇaṃ kāśikāpurādhināthakālabhairavaṃ bhaje ||",
      hi: "रत्न-पादुकाओं से शोभित चरण, नित्य अद्वितीय इष्टदेव निरञ्जन, मृत्यु के दर्प का नाश, कराल दंष्ट्रा से मोक्ष देने वाले कालभैरव को भजता हूँ।",
      en: "I worship Kalabhairava — charming feet in jewelled sandals, the eternal non-dual chosen deity, stainless, who shatters death's pride and whose terrible fangs grant release.",
    },
    {
      id: "kba-07",
      text: "अट्टहासभिन्नपद्मजाण्डकोशसंततिं दृष्टिपातनष्टपापजालमुग्रशासनम् ।\nअष्टसिद्धिदायकं कपालमालिकाधरं काशिकापुराधिनाथकालभैरवं भजे ॥",
      iast: "aṭṭahāsabhinnapadmajāṇḍakośasaṃtatiṃ dṛṣṭipātanaṣṭapāpajālam ugraśāsanam |\naṣṭasiddhidāyakaṃ kapālamālikādharaṃ kāśikāpurādhināthakālabhairavaṃ bhaje ||",
      hi: "अट्टहास से ब्रह्माण्ड-कोश को विदीर्ण करने वाले, दृष्टिपात से पाप-जाल का नाश, उग्र शासन, अष्टसिद्धिदाता, कपालमाला धारण करने वाले कालभैरव को भजता हूँ।",
      en: "I worship Kalabhairava — whose loud laugh splits Brahma's cosmic egg, whose glance destroys the net of sin, giver of the eight siddhis, wearing a garland of skulls.",
    },
    {
      id: "kba-08",
      text: "भूतसंघनायकं विशालकीर्तिदायकं काशिवासलोकपुण्यपापशोधकं विभुम् ।\nनीतिमार्गकोविदं पुरातनं जगत्पतिं काशिकापुराधिनाथकालभैरवं भजे ॥",
      iast: "bhūtasaṃghanāyakaṃ viśālakīrtidāyakaṃ kāśivāsalokapuṇyapāpaśodhakaṃ vibhum |\nnītimārgakovidaṃ purātanaṃ jagatpatiṃ kāśikāpurādhināthakālabhairavaṃ bhaje ||",
      hi: "भूतगणों के नायक, विशाल कीर्ति देने वाले, काशीवासियों के पुण्य-पाप शोधक, नीति-मार्ग के कोविद, पुरातन जगत्पति कालभैरव को भजता हूँ।",
      en: "I worship Kalabhairava — leader of spirit-hosts, giver of great glory, purifier of merit and sin of those who dwell in Kashi, skilled in the path of right, ancient lord of the world.",
    },
    {
      id: "kba-09",
      kind: "phalashruti",
      text: "कालभैरवाष्टकं पठन्ति ये मनोहरं ज्ञानमुक्तिसाधनं विचित्रपुण्यवर्धनम् ।\nशोकमोहदैन्यलोभकोपतापनाशनं प्रयान्ति कालभैरवाङ्घ्रिसन्निधिं नरा ध्रुवम् ॥",
      iast: "kālabhairavāṣṭakaṃ paṭhanti ye manoharaṃ jñānamuktisādhanaṃ vicitrapuṇyavardhanam |\nśokamohadainyalobhakopatāpanāśanaṃ prayānti kālabhairavāṅghrisannidhiṃ narā dhruvam ||",
      hi: "जो इस मनोहर कालभैरवाष्टक को पढ़ते हैं — ज्ञान-मुक्ति का साधन, पुण्य बढ़ाने वाला, शोक-मोह-दैन्य-लोभ-क्रोध-ताप का नाश — वे निश्चय कालभैरव के चरणों में पहुँचते हैं।",
      en: "Those who recite this charming Kalabhairava Ashtakam — a means to knowledge and liberation, increaser of merit, destroyer of grief, delusion, misery, greed, anger and burning — surely reach Kalabhairava's feet.",
    },
  ],
});

texts.push({
  deity: "shiva",
  slug: "shiv-aarti",
  category: "aarti",
  wave: 0,
  title: { hi: "शिव आरती", en: "Shiva Aarti" },
  subtitle: { hi: "जय शिव ओंकारा", en: "Jai Shiv Omkara" },
  originalLang: "hi",
  sectionId: "sa-full",
  sectionTitle: { hi: "पूर्ण आरती", en: "Full aarti" },
  description: {
    hi: "सन्ध्या आरती — ब्रह्मा विष्णु सदाशिव अर्द्धाङ्गी धारा।",
    en: "Evening aarti — Brahma, Vishnu, Sadashiva, the half-bodied Lord.",
  },
  edition: {
    pin: "SHIV-AARTI-JAI-SHIV-OMKARA",
    publisher: "North-Indian temple recension (public domain)",
    notes:
      "Popular Hindi aarti 'Jai Shiv Omkara'. Collated against common temple booklets; minor line-order variants exist (as with all aartis). This is the widely sung eight-couplet form.",
  },
  verses: [
    {
      id: "sa-01",
      kind: "line",
      text: "जय शिव ओंकारा, ॐ जय शिव ओंकारा ।\nब्रह्मा विष्णु सदाशिव, अर्द्धाङ्गी धारा ॥",
      iast: "jaya śiva oṃkārā, oṃ jaya śiva oṃkārā |\nbrahmā viṣṇu sadāśiva, arddhāṅgī dhārā ||",
      hi: "शिव ओंकार की जय — जो ब्रह्मा, विष्णु, सदाशिव हैं और अर्धनारीश्वर रूप में शक्ति को धारण करते हैं।",
      en: "Glory to Shiva Omkara — Brahma, Vishnu and Sadashiva, who bears the Goddess as half his body.",
    },
    {
      id: "sa-02",
      kind: "line",
      text: "एकानन चतुरानन पञ्चानन राजे ।\nहंसासन गरुड़ासन वृषवाहन साजे ॥",
      iast: "ekānana caturānana pañcānana rāje |\nhaṃsāsana garuḍāsana vṛṣavāhana sāje ||",
      hi: "एक मुख (विष्णु), चार मुख (ब्रह्मा), पाँच मुख (शिव) विराजते हैं; हंस, गरुड़ और नन्दी उनके आसन हैं।",
      en: "One-faced, four-faced and five-faced they shine — with swan, Garuda and the bull as their mounts.",
    },
    {
      id: "sa-03",
      kind: "line",
      text: "दो भुज चार चतुर्भुज दस भुज ती सोहे ।\nतीनों रूप निरखता त्रिभुवन जन मोहे ॥",
      iast: "do bhuja cāra caturbhuja dasa bhuja tī sohe |\ntīnoṃ rūpa nirakhatā tribhuvana jana mohe ||",
      hi: "दो भुजा, चार भुजा, दस भुजा — तीनों रूप देखकर तीनों लोक मोहित होते हैं।",
      en: "Two arms, four arms, ten arms — seeing the three forms, the three worlds are enchanted.",
    },
    {
      id: "sa-04",
      kind: "line",
      text: "अक्षमाला वनमाला रुद्राक्ष की माला ।\nत्रिपुरारी कर माला शोहे शुभ व्याला ॥",
      iast: "akṣamālā vanamālā rudrākṣa kī mālā |\ntripurārī kara mālā śohe śubha vyālā ||",
      hi: "अक्षमाला, वनमाला, रुद्राक्षमाला — त्रिपुरारी के हाथ में शुभ सर्प-माला शोभित है।",
      en: "Rosary of seeds, forest-garland, rudraksha mala — Tripurari's hand is adorned with the auspicious serpent.",
    },
    {
      id: "sa-05",
      kind: "line",
      text: "श्वेताम्बर पीताम्बर बाघम्बर अंगे ।\nसनकादिक गरुणादिक भूतादिक संगे ॥",
      iast: "śvetāmbara pītāmbara bāghambara aṅge |\nsanakādika garuṇādika bhūtādika saṃge ||",
      hi: "श्वेत वस्त्र, पीत वस्त्र, व्याघ्रचर्म — सनकादि, गरुड़ादि और भूतगण साथ हैं।",
      en: "White cloth, yellow cloth, tiger-skin — Sanaka and the sages, Garuda, and the spirit-hosts attend.",
    },
    {
      id: "sa-06",
      kind: "line",
      text: "कर के मध्य कमण्डलु चक्र त्रिशूलधारी ।\nसुखकारी दुखहारी जगपालन कारी ॥",
      iast: "kara ke madhya kamaṇḍalu cakra triśūladhārī |\nsukhakārī dukhahārī jagapālana kārī ||",
      hi: "हाथ में कमण्डलु, चक्र, त्रिशूल — सुख देने वाले, दुःख हरने वाले, जगत् के पालक।",
      en: "In hand the water-pot, discus and trident — giver of joy, taker of sorrow, protector of the world.",
    },
    {
      id: "sa-07",
      kind: "line",
      text: "ब्रह्मा विष्णु सदाशिव जानत अविवेका ।\nप्रणवाक्षर में शोभे अविनाशी एका ॥",
      iast: "brahmā viṣṇu sadāśiva jānata avivekā |\npraṇavākṣara meṃ śobhe avināśī ekā ||",
      hi: "अविवेकी भी ब्रह्मा-विष्णु-सदाशिव को जानते हैं; ओंकार में एक अविनाशी शोभित हैं।",
      en: "Even the unknowing know Brahma, Vishnu and Sadashiva; in the syllable Om the one Imperishable shines.",
    },
    {
      id: "sa-08",
      kind: "line",
      text: "उपमा शिव की देता उड़गन असमाना ।\nकिरोटी कुण्डल शोभे गले मुकुट विभूषण ॥",
      iast: "upamā śiva kī detā uḍagana asamānā |\nkiroṭī kuṇḍala śobhe gale mukuṭa vibhūṣaṇa ||",
      hi: "शिव की उपमा आकाश के तारों-सी असीम है; किरीट, कुण्डल, मुकुट गले के आभरण शोभित हैं।",
      en: "Shiva's comparison is with the boundless stars; crown, earrings and ornaments shine at the throat.",
    },
    {
      id: "sa-09",
      kind: "line",
      text: "ॐ जय शिव ओंकारा, ब्रह्मा विष्णु सदाशिव, अर्द्धाङ्गी धारा ॥",
      iast: "oṃ jaya śiva oṃkārā, brahmā viṣṇu sadāśiva, arddhāṅgī dhārā ||",
      hi: "ॐ — शिव ओंकार की जय।",
      en: "Om — glory to Shiva Omkara.",
    },
  ],
});

// ─── KALI ────────────────────────────────────────────────────────────

texts.push({
  deity: "kali",
  slug: "dakshina-kali-mantra",
  category: "mantra",
  wave: 0,
  title: { hi: "दक्षिण काली मन्त्र", en: "Dakshina Kali Mantra" },
  subtitle: { hi: "ॐ क्रीं कालिकायै नमः", en: "Om Krim Kalikayai Namah" },
  sectionId: "dkm-full",
  sectionTitle: { hi: "जप मन्त्र", en: "Japa mantras" },
  description: {
    hi: "दक्षिण कालिका का सार्वजनिक जप-नाम। दीर्घ बीजमन्त्र केवल दीक्षित साधना में।",
    en: "The public japa-name of Dakshina Kalika. Longer bija-mantras belong to initiated sadhana.",
  },
  edition: {
    pin: "DAKSHINA-KALI-JAPA",
    publisher: "Śākta smārta practice (public domain)",
    notes:
      "Short nama-mantra ॐ क्रीं कालिकायै नमः is the common public japa (Woodroffe/Karpuradi discusses the 22-syllable dakṣiṇa-kālikā mūlamantra as tantric uddhāra — not reproduced here as a household recitation). Gayatri from standard Kali-gayatri recensions.",
  },
  verses: [
    {
      id: "dkm-01",
      kind: "mantra",
      text: "ॐ क्रीं कालिकायै नमः",
      iast: "oṃ krīṃ kālikāyai namaḥ",
      hi: "ॐ — बीज क्रीं सहित महाकाली को नमस्कार। घर-जप का मूल नाम।",
      en: "Om — salutations to Kalika with the seed-syllable krīṃ. The root Name for household japa.",
    },
    {
      id: "dkm-02",
      kind: "mantra",
      text: "ॐ कालीं कालयै विद्महे श्मशानवासिन्यै धीमहि ।\nतन्नो घोरा प्रचोदयात् ॥",
      iast: "oṃ kālīṃ kālayai vidmahe śmaśānavāsinyai dhīmahi |\ntanno ghorā pracodayāt ||",
      hi: "हम काली को जानें, श्मशानवासिनी पर ध्यान करें; घोररूपा हमें प्रेरित करें। (काली गायत्री)",
      en: "We know Kali as Time; we meditate on Her who dwells in the cremation ground; may that Terrible One inspire us. (Kali Gayatri)",
    },
  ],
});

texts.push({
  deity: "kali",
  slug: "kalika-ashtakam",
  category: "stotra",
  wave: 0,
  title: { hi: "कालिकाष्टकम्", en: "Kalika Ashtakam" },
  subtitle: { hi: "आदि शङ्कर · स्वरूपं त्वदीयं न विन्दन्ति देवाः", en: "Adi Shankara" },
  sectionId: "ka-full",
  sectionTitle: { hi: "ध्यान व स्तुति", en: "Dhyana and stuti" },
  description: {
    hi: "महाकाली का ध्यान और आठ स्तुति श्लोक — देव भी आपके स्वरूप को नहीं जानते।",
    en: "Dhyana of Mahakali and eight verses of praise — even the gods do not know Your true form.",
  },
  edition: {
    pin: "KALIKA-ASHTAKAM-SHANKARA-GM",
    publisher: "Attributed to Adi Shankara (public domain)",
    notes:
      "Collated from Green Message kalika_ashtakam (dhyana 1–3 + stuti 1–8). Traditional fierce iconography retained as in the Sanskrit; meanings are plain-language, not a tantric paddhati. Closing colophon: इति श्रीमच्छङ्कराचार्यविरचितं श्रीकालिकाष्टकं सम्पूर्णम्।",
  },
  verses: [
    {
      id: "ka-d1",
      kind: "dhyana",
      text: "गलद्रक्तमुण्डावलीकण्ठमाला महोघोररावा सुदंष्ट्रा कराला ।\nविवस्त्रा श्मशानालया मुक्तकेशी महाकालकामाकुला कालिकेयम् ॥",
      iast: "galadraktamuṇḍāvalīkaṇṭhamālā mahoghorarāvā sudaṃṣṭrā karālā |\nvivastrā śmaśānālayā muktakeśī mahākālakāmākulā kālikeyam ||",
      hi: "गलते रक्त वाले मुण्डों की माला, महाघोर नाद, भीषण दंष्ट्रा, दिगम्बरा, श्मशाननिवासिनी, मुक्तकेशी, महाकाल में तन्मय — यह कालिका हैं।",
      en: "Garland of blood-dripping heads at the throat, terrific cry, terrible fangs; sky-clad, dwelling in the cremation ground, unbound hair, yearning for Mahakala — this is Kalika.",
    },
    {
      id: "ka-d2",
      kind: "dhyana",
      text: "भुजे वामयुग्मे शिरोऽसिं दधाना वरं दक्षयुग्मेऽभयं वै तथैव ।\nसुमध्यापि तुङ्गस्तना भारनम्रा लसद्रक्तसृक्कद्वया सुस्मितास्या ॥",
      iast: "bhuje vāmayugme śiro'siṃ dadhānā varaṃ dakṣayugme'bhayaṃ vai tathaiva |\nsumadhyāpi tuṅgastanā bhāranamrā lasadraktasṛkkadvayā susmitāsyā ||",
      hi: "बायें हाथों में सिर और खड्ग, दायें में वर और अभय; सुन्दर मध्य, तुङ्ग वक्ष के भार से नम्र, रक्त-ओष्ठ, मन्दहास्य।",
      en: "In the left pair of hands a head and a sword; in the right, boon and fearlessness. Slightly bent with the weight of a full torso; lips shining red; a gentle smile.",
    },
    {
      id: "ka-d3",
      kind: "dhyana",
      text: "शवद्वन्द्वकर्णावतंसा सुकेशी लसत्प्रेतपाणिं प्रयुक्तैककाञ्ची ।\nशवाकारमञ्चाधिरूढा शिवाभिश्चतुर्दिक्षु शब्दायमानाभिरेजे ॥",
      iast: "śavadvandvakarṇāvataṃsā sukeśī lasatpretapāṇiṃ prayuktaikakāñcī |\nśavākāramañcādhirūḍhā śivābhiś caturdikṣu śabdāyamānābhireje ||",
      hi: "कर्णों में शव-कुण्डल, सुन्दर केश, प्रेत-हस्तों की कांची, शव-मञ्च पर विराजित; चारों दिशाओं में सियारों के नाद के बीच कालिका विराजती हैं।",
      en: "Earrings of corpses, beautiful hair, a girdle of joined hands of the dead; mounted on a platform of corpses; jackals crying in the four directions — She reigns.",
    },
    {
      id: "ka-01",
      text: "विरञ्च्यादिदेवास्त्रयस्ते गुणास्त्रीन् समाराध्य कालीं प्रधाना बभूबुः ।\nअनादिं सुरादिं मखादिं भवादिं स्वरूपं त्वदीयं न विन्दन्ति देवाः ॥",
      iast: "viraṇcyādidevās trayas te guṇās trīn samārādhya kālīṃ pradhānā babhūbuḥ |\nanādiṃ surādiṃ makhādiṃ bhavādiṃ svarūpaṃ tvadīyaṃ na vindanti devāḥ ||",
      hi: "ब्रह्मादि त्रिदेव आपके तीन गुणों की आराधना कर प्रधान बने। आप अनादि, सुरादि, यज्ञादि, भवादि हैं — देव भी आपका स्वरूप नहीं जानते।",
      en: "Brahma and the triad, worshipping Your three gunas, became chief among gods. You are beginningless, source of gods, of sacrifice, of becoming — even the gods do not know Your true form.",
    },
    {
      id: "ka-02",
      text: "जगन्मोहनीयं तु वाग्वादिनीयं सुहृत्पोषिणीशत्रुसंहारणीयम् ।\nवचस्तम्भनीयं किमुच्चाटनीयं स्वरूपं त्वदीयं न विन्दन्ति देवाः ॥",
      iast: "jaganmohanīyaṃ tu vāgvādinīyaṃ suhṛtpoṣiṇīśatrusaṃhāraṇīyam |\nvacastambhanīyaṃ kim uccāṭanīyaṃ svarūpaṃ tvadīyaṃ na vindanti devāḥ ||",
      hi: "जगत् को मोहित करने वाली, वाणी की अधिष्ठात्री, सुहृदों को पुष्ट और शत्रुओं का संहार करने वाली — देव आपका स्वरूप नहीं जानते।",
      en: "You enchant the worlds, preside over speech, nourish friends and destroy enemies, still speech or uproot it — even the gods do not know Your true form.",
    },
    {
      id: "ka-03",
      text: "इयं स्वर्गदात्री पुनः कल्पवल्ली मनोजास्तु कामान् यथार्थं प्रकुर्यात् ।\nतथा ते कृतार्था भवन्तीति नित्यं स्वरूपं त्वदीयं न विन्दन्ति देवाः ॥",
      iast: "iyaṃ svargadātrī punaḥ kalpavallī manojās tu kāmān yathārthaṃ prakuryāt |\ntathā te kṛtārthā bhavantīti nityaṃ svarūpaṃ tvadīyaṃ na vindanti devāḥ ||",
      hi: "स्वर्ग देने वाली, कल्पलता-सी मन के यथार्थ काम पूरे करने वाली — जगत् नित्य कृतार्थ होता है। देव आपका स्वरूप नहीं जानते।",
      en: "Giver of heaven, wish-fulfilling creeper who truly grants mind-born desires — the world is ever fulfilled by You. Even the gods do not know Your true form.",
    },
    {
      id: "ka-04",
      text: "सुरापानमत्ता सुभक्तानुरक्ता लसत्पूतचित्ते सदाविर्भवत्ते ।\nजपध्यानपूजासुधाधौतपङ्का स्वरूपं त्वदीयं न विन्दन्ति देवाः ॥",
      iast: "surāpānamattā subhaktānuraktā lasatpūtacitte sadāvirbhavatte |\njapadhyānapūjāsudhādhautapaṅkā svarūpaṃ tvadīyaṃ na vindanti devāḥ ||",
      hi: "आप भक्तों पर अनुरक्त हैं और शुद्ध चित्त में सदा प्रकट होती हैं; जप-ध्यान-पूजा के अमृत से मैल धुल जाता है। देव आपका स्वरूप नहीं जानते।",
      en: "Delighting in the wine of bliss, loving true devotees, You always appear in a shining pure heart washed by the nectar of japa, dhyana and puja. Even the gods do not know Your true form.",
    },
    {
      id: "ka-05",
      text: "चिदानन्दकन्दं हसन्मन्दमन्दं शरच्चन्द्रकोटिप्रभापुञ्जबिम्बम् ।\nमुनीनां कवीनां हृदि द्योतयन्तं स्वरूपं त्वदीयं न विन्दन्ति देवाः ॥",
      iast: "cidānandakandaṃ hasan mandamandaṃ śaraccandrakotiprabhāpuñjabimbam |\nmunīnāṃ kavīnāṃ hṛdi dyotayantaṃ svarūpaṃ tvadīyaṃ na vindanti devāḥ ||",
      hi: "चिदानन्द की जड़, मन्द मन्द हास्य, शरत्चन्द्र-कोटि प्रभा, मुनियों और कवियों के हृदय में द्योतित। देव आपका स्वरूप नहीं जानते।",
      en: "Root of consciousness-bliss, smiling gently, a mass of autumn-moonlight; You shine in the hearts of sages and seer-poets. Even the gods do not know Your true form.",
    },
    {
      id: "ka-06",
      text: "महामेघकाली सुरक्तापि शुभ्रा कदाचिद् विचित्राकृतिर्योगमाया ।\nन बाला न वृद्धा न कामातुरापि स्वरूपं त्वदीयं न विन्दन्ति देवाः ॥",
      iast: "mahāmeghakālī suraktāpi śubhrā kadācid vicitrākṛtir yogamāyā |\nna bālā na vṛddhā na kāmāturāpi svarūpaṃ tvadīyaṃ na vindanti devāḥ ||",
      hi: "महामेघ-सी काली, कभी रक्तवर्ण, कभी शुभ्र, योगमाया से विचित्र रूप; न बालिका न वृद्धा न कामपीड़िता। देव आपका स्वरूप नहीं जानते।",
      en: "Black as a great cloud, and also deep red, and white; sometimes a wondrous form of yogamaya — neither child nor old woman nor love-struck youth. Even the gods do not know Your true form.",
    },
    {
      id: "ka-07",
      text: "क्षमस्वापराधं महागुप्तभावं मया लोकमध्ये प्रकाशितं यत् ।\nतव ध्यानपूतेन चापल्यभावात् स्वरूपं त्वदीयं न विन्दन्ति देवाः ॥",
      iast: "kṣamasvāparādhaṃ mahāguptabhāvaṃ mayā lokamadhye prakāśitaṃ yat |\ntava dhyānapūtena cāpalyabhāvāt svarūpaṃ tvadīyaṃ na vindanti devāḥ ||",
      hi: "क्षमा करें — आपका महागुप्त भाव मैंने लोक में कह दिया; आपके ध्यान से शुद्ध चपल भाव से। देव आपका स्वरूप नहीं जानते।",
      en: "Forgive the fault — that I have spoken Your great hidden nature in the midst of the world, from a childlike heart made pure by meditating on You. Even the gods do not know Your true form.",
    },
    {
      id: "ka-08",
      kind: "phalashruti",
      text: "यदि ध्यानयुक्तं पठेद् यो मनुष्यस्तदा सर्वलोके विशालो भवेच्च ।\nगृहे चाष्टसिद्धिर्मृते चापि मुक्तिः स्वरूपं त्वदीयं न विन्दन्ति देवाः ॥",
      iast: "yadi dhyānayuktaṃ paṭhed yo manuṣyas tadā sarvaloke viśālo bhavec ca |\ngṛhe cāṣṭasiddhir mṛte cāpi muktiḥ svarūpaṃ tvadīyaṃ na vindanti devāḥ ||",
      hi: "जो मनुष्य ध्यान सहित इसे पढ़े, सब लोकों में महान हो; जीवन में अष्टसिद्धि, मृत्यु पर मुक्ति। देव आपका स्वरूप नहीं जानते।",
      en: "If a person recites this with meditation, they become great in all worlds; eight siddhis while living, and liberation at death. Even the gods do not know Your true form.",
    },
  ],
});

texts.push({
  deity: "kali",
  slug: "adya-stotram",
  category: "stotra",
  wave: 0,
  title: { hi: "आद्या स्तोत्रम्", en: "Adya Stotram" },
  subtitle: { hi: "ब्रह्मयामल · ब्रह्म-नारद संवाद", en: "Brahma Yamala · Brahma–Narada" },
  sectionId: "adya-full",
  sectionTitle: { hi: "पूर्ण स्तोत्र", en: "Full stotra" },
  description: {
    hi: "आद्या शक्ति महामाया काली — बंग देश से काशी तक क्षेत्रों में एक ही माँ।",
    en: "Adya Shakti Mahamaya Kali — the same Mother in every kshetra from Bengal to Kashi.",
  },
  edition: {
    pin: "ADYA-STOTRAM-BRAHMAYAMALA-SD",
    publisher: "Brahma Yamala (public domain recension)",
    notes:
      "Collated from Sanskrit Documents AdyA.html (encoded Kunal Mukherjee, proofread Sunder Hattangadi; translation at adyapeath.org/AdyaComb.pdf) and Green Message adya_stotram. Opening ॐ नम आद्यायै. Twenty verses of the vulgate plus closing namaskara.",
  },
  verses: [
    {
      id: "adya-00",
      kind: "mantra",
      text: "ॐ नम आद्यायै",
      iast: "oṃ nama ādyāyai",
      hi: "ॐ — आदि शक्ति आद्या को नमस्कार।",
      en: "Om — salutations to Adya, the Primordial.",
    },
    {
      id: "adya-01",
      text: "शृणु वत्स प्रवक्ष्यामि आद्यास्तोत्रं महाफलम् ।\nयः पठेत् सततं भक्त्या स एव विष्णुवल्लभः ॥",
      iast: "śṛṇu vatsa pravakṣyāmi ādyāstotraṃ mahāphalam |\nyaḥ paṭhet satataṃ bhaktyā sa eva viṣṇuvallabhaḥ ||",
      hi: "हे वत्स, सुनो — मैं महाफलदायक आद्या स्तोत्र कहता हूँ। जो भक्ति से सदा पढ़े, वह विष्णु का प्रिय हो।",
      en: "Listen, child — I speak the Adya Stotram of great fruit. Whoever recites it always with devotion becomes dear to Vishnu.",
    },
    {
      id: "adya-02",
      text: "मृत्युर्व्याधिभयं तस्य नास्ति किञ्चित् कलौ युगे ।\nअपुत्रा लभते पुत्रं त्रिपक्षं श्रवणं यदि ॥",
      iast: "mṛtyur vyādhibhayaṃ tasya nāsti kiñcit kalau yuge |\naputrā labhate putraṃ tripakṣaṃ śravaṇaṃ yadi ||",
      hi: "कलियुग में उसके मृत्यु और व्याधि का किञ्चित् भय नहीं। पुत्रहीना तीन पक्ष श्रवण करे तो पुत्र पाती है।",
      en: "In Kali yuga that person has not the least fear of death or disease. A childless woman, listening for three fortnights, obtains a child.",
    },
    {
      id: "adya-03",
      text: "द्वौ मासौ बन्धनान्मुक्तिर् विप्रवक्त्रात् श्रुतं यदि ।\nमृतवत्सा जीववत्सा षण्मासं श्रवणं यदि ॥",
      iast: "dvau māsau bandhanān muktir vipravaktrāt śrutaṃ yadi |\nmṛtavatsā jīvavatsā ṣaṇmāsaṃ śravaṇaṃ yadi ||",
      hi: "ब्राह्मण-मुख से दो मास श्रवण करने पर बन्धन से मुक्ति। मृतवत्सा छह मास श्रवण करे तो जीववत्सा हो।",
      en: "Heard from a brahmana's mouth for two months — release from bondage. A woman whose children die, listening six months, bears living children.",
    },
    {
      id: "adya-04",
      text: "नौकायां सङ्कटे युद्धे पठनाज्जयमाप्नुयात् ।\nलिखित्वा स्थापयेद्गेहे नाग्निचौरभयं क्वचित् ॥",
      iast: "naukāyāṃ saṅkaṭe yuddhe paṭhanāj jayam āpnuyāt |\nlikhitvā sthāpayed gehe nāgnicaurabhayaṃ kvacit ||",
      hi: "नाव, सङ्कट, युद्ध में पाठ से जय। घर में लिखकर स्थापित करने पर अग्नि-चोर का भय नहीं।",
      en: "Recited on a boat, in distress, or in battle — one attains victory. Written and kept in the house — no fear of fire or thieves.",
    },
    {
      id: "adya-05",
      text: "राजस्थाने जयी नित्यं प्रसन्नाः सर्वदेवताः ।\nॐ ह्रीं ब्रह्माणी ब्रह्मलोके च वैकुण्ठे सर्वमङ्गला ॥",
      iast: "rājasthāne jayī nityaṃ prasannāḥ sarvadevatāḥ |\noṃ hrīṃ brahmāṇī brahmaloke ca vaikuṇṭhe sarvamaṅgalā ||",
      hi: "राजसभा में नित्य विजयी; सब देव प्रसन्न। ॐ ह्रीं — ब्रह्मलोक में ब्रह्माणी, वैकुण्ठ में सर्वमङ्गला।",
      en: "Ever victorious before kings; all gods are pleased. Om Hrīm — She is Brahmani in Brahmaloka, Sarvamangala in Vaikuntha.",
    },
    {
      id: "adya-06",
      text: "इन्द्राणी अमरावत्याम् अम्बिका वरुणालये ।\nयमालये कालरूपा कुबेरभवने शुभा ॥",
      iast: "indrāṇī amarāvatyām ambikā varuṇālaye |\nyamālaye kālarūpā kuberabhavane śubhā ||",
      hi: "अमरावती में इन्द्राणी, वरुणालय में अम्बिका, यमलोक में कालरूपा, कुबेर-भवन में शुभा।",
      en: "Indrani in Amaravati, Ambika in Varuna's house, Kalarupa in Yama's world, Shubha in Kubera's dwelling.",
    },
    {
      id: "adya-07",
      text: "महानन्दाग्निकोणे च वायव्यां मृगवाहिनी ।\nनैरृत्यां रक्तदन्ता च ऐशाण्यां शूलधारिणी ॥",
      iast: "mahānandāgnikoṇe ca vāyavyāṃ mṛgavāhinī |\nnairṛtyāṃ raktadantā ca aiśāṇyāṃ śūladhāriṇī ||",
      hi: "आग्नेय कोण में महानन्दा, वायव्य में मृगवाहिनी, नैऋत्य में रक्तदन्ता, ईशान में शूलधारिणी।",
      en: "Mahananda in the fire-quarter, Mrigavahini in the wind-quarter, Raktadanta in the southwest, Shuladharini in the northeast.",
    },
    {
      id: "adya-08",
      text: "पाताले वैष्णवीरूपा सिंहले देवमोहिनी ।\nसुरसा च मणिद्वीपे लङ्कायां भद्रकालिका ॥",
      iast: "pātāle vaiṣṇavīrūpā siṃhale devamohinī |\nsurasā ca maṇidvīpe laṅkāyāṃ bhadrakālikā ||",
      hi: "पाताल में वैष्णवी, सिंहल में देवमोहिनी, मणिद्वीप में सुरसा, लङ्का में भद्रकालिका।",
      en: "Vaishnavi in the netherworld, Devamohini in Lanka-isle (Simhala), Surasa in Manidvipa, Bhadrakalika in Lanka.",
    },
    {
      id: "adya-09",
      text: "रामेश्वरी सेतुबन्धे विमला पुरुषोत्तमे ।\nविरजा औड्रदेशे च कामाक्षी नीलपर्वते ॥",
      iast: "rāmeśvarī setubandhe vimalā puruṣottame |\nvirajā auḍradeśe ca kāmākṣī nīlaparvate ||",
      hi: "सेतुबन्ध में रामेश्वरी, पुरुषोत्तम (पुरी) में विमला, ओड्र में विरजा, नीलपर्वत पर कामाक्षी।",
      en: "Rameshvari at Setubandha, Vimala at Purushottama (Puri), Viraja in Odra, Kamakshi on the blue mountain.",
    },
    {
      id: "adya-10",
      text: "कालिका वङ्गदेशे च अयोध्यायां महेश्वरी ।\nवाराणस्याम् अन्नपूर्णा गयाक्षेत्रे गयेश्वरी ॥",
      iast: "kālikā vaṅgadeśe ca ayodhyāyāṃ maheśvarī |\nvārāṇasyām annapūrṇā gayākṣetre gayeśvarī ||",
      hi: "वङ्ग में कालिका, अयोध्या में महेश्वरी, काशी में अन्नपूर्णा, गया में गयेश्वरी।",
      en: "Kalika in Bengal, Maheshvari in Ayodhya, Annapurna in Varanasi, Gayeshvari in Gaya.",
    },
    {
      id: "adya-11",
      text: "कुरुक्षेत्रे भद्रकाली व्रजे कात्यायनी परा ।\nद्वारकायां महामाया मथुरायां माहेश्वरी ॥",
      iast: "kurukṣetre bhadrakālī vraje kātyāyanī parā |\ndvārakāyāṃ mahāmāyā mathurāyāṃ māheśvarī ||",
      hi: "कुरुक्षेत्र में भद्रकाली, व्रज में कात्यायनी, द्वारका में महामाया, मथुरा में माहेश्वरी।",
      en: "Bhadrakali in Kurukshetra, Katyayani in Vraja, Mahamaya in Dvaraka, Maheshvari in Mathura.",
    },
    {
      id: "adya-12",
      text: "क्षुधा त्वं सर्वभूतानां वेला त्वं सागरस्य च ।\nनवमी शुक्लपक्षस्य कृष्णसैकादशी परा ॥",
      iast: "kṣudhā tvaṃ sarvabhūtānāṃ velā tvaṃ sāgarasya ca |\nnavamī śuklapakṣasya kṛṣṇasaikādaśī parā ||",
      hi: "आप सब भूतों की क्षुधा हैं, सागर की वेला हैं; शुक्ल नवमी और कृष्ण एकादशी आप ही हैं।",
      en: "You are the hunger of all beings and the tide of the ocean; You are shukla navami and the supreme krishna ekadashi.",
    },
    {
      id: "adya-13",
      text: "दक्षस्य दुहिता देवी दक्षयज्ञविनाशिनी ।\nरामस्य जानकी त्वं हि रावणध्वंसकारिणी ॥",
      iast: "dakṣasya duhitā devī dakṣayajñavināśinī |\nrāmasya jānakī tvaṃ hi rāvaṇadhvaṃsakāriṇī ||",
      hi: "दक्ष की दुहिता, दक्ष-यज्ञ की विनाशिनी; राम की जानकी, रावण-ध्वंसकारिणी आप ही हैं।",
      en: "Daughter of Daksha, destroyer of Daksha's sacrifice; You are Rama's Janaki, who caused Ravana's fall.",
    },
    {
      id: "adya-14",
      text: "चण्डमुण्डवधे देवी रक्तबीजविनाशिनी ।\nनिशुम्भशुम्भमथिनी मधुकैटभघातिनी ॥",
      iast: "caṇḍamuṇḍavadhe devī raktabījavināśinī |\nniśumbhaśumbhamathinī madhukaiṭabhaghātinī ||",
      hi: "चण्ड-मुण्ड वध करने वाली, रक्तबीज की नाशिनी, निशुम्भ-शुम्भ मथिनी, मधु-कैटभ घातिनी।",
      en: "Slayer of Chanda and Munda, destroyer of Raktabija, crusher of Nishumbha and Shumbha, killer of Madhu and Kaitabha.",
    },
    {
      id: "adya-15",
      text: "विष्णुभक्तिप्रदा दुर्गा सुखदा मोक्षदा सदा ।\nआद्यास्तवमिमं पुण्यं यः पठेत् सततं नरः ॥",
      iast: "viṣṇubhaktipradā durgā sukhadā mokṣadā sadā |\nādyāstavam imaṃ puṇyaṃ yaḥ paṭhet satataṃ naraḥ ||",
      hi: "विष्णु-भक्ति देने वाली दुर्गा, सदा सुख और मोक्ष देने वाली। जो इस पुण्य आद्या स्तव को सदा पढ़े —",
      en: "Durga who grants devotion to Vishnu, always giver of joy and liberation. Whoever constantly recites this sacred hymn to Adya —",
    },
    {
      id: "adya-16",
      text: "सर्वज्वरभयं न स्यात् सर्वव्याधिविनाशनम् ।\nकोटितीर्थफलं तस्य लभते नात्र संशयः ॥",
      iast: "sarvajvarabhayaṃ na syāt sarvavyādhivināśanam |\nkoṭitīrthaphalaṃ tasya labhate nātra saṃśayaḥ ||",
      hi: "सब ज्वर का भय न रहे, सब व्याधि का नाश हो; करोड़ तीर्थों का फल मिले — इसमें संशय नहीं।",
      en: "No fear of any fever; all disease is destroyed; the fruit of a crore of tirthas is obtained — of this there is no doubt.",
    },
    {
      id: "adya-17",
      text: "जया मे चाग्रतः पातु विजया पातु पृष्ठतः ।\nनारायणी शीर्षदेशे सर्वाङ्गे सिंहवाहिनी ॥",
      iast: "jayā me cāgrataḥ pātu vijayā pātu pṛṣṭhataḥ |\nnārāyaṇī śīrṣadeśe sarvāṅge siṃhavāhinī ||",
      hi: "आगे जया रक्षा करें, पीछे विजया; सिर पर नारायणी, सब अङ्गों पर सिंहवाहिनी।",
      en: "May Jaya guard me in front, Vijaya behind; Narayani at the head, Simhavahini over every limb.",
    },
    {
      id: "adya-18",
      text: "शिवदूती उग्रचण्डा प्रत्यङ्गे परमेश्वरी ।\nविशालाक्षी महामाया कौमारी शङ्खिनी शिवा ॥",
      iast: "śivadūtī ugracaṇḍā pratyaṅge parameśvarī |\nviśālākṣī mahāmāyā kaumārī śaṅkhinī śivā ||",
      hi: "प्रत्यङ्ग पर शिवदूती, उग्रचण्डा, परमेश्वरी; विशालाक्षी, महामाया, कौमारी, शङ्खिनी, शिवा।",
      en: "On every limb Shivaduti, Ugrachanda, Parameshvari; Vishalakshi, Mahamaya, Kaumari, Shankhini, Shiva.",
    },
    {
      id: "adya-19",
      text: "चक्रिणी जयधात्री च रणमत्ता रणप्रिया ।\nदुर्गा जयन्ती काली च भद्रकाली महोदरी ॥",
      iast: "cakriṇī jayadhātrī ca raṇamattā raṇapriyā |\ndurgā jayantī kālī ca bhadrakālī mahodarī ||",
      hi: "चक्रिणी, जयधात्री, रणमत्ता, रणप्रिया, दुर्गा, जयन्ती, काली, भद्रकाली, महोदरी।",
      en: "Chakrini, Jayadhatri, battle-intoxicated, lover of war, Durga, Jayanti, Kali, Bhadrakali, Mahodari.",
    },
    {
      id: "adya-20",
      text: "नारसिंही च वाराही सिद्धिदात्री सुखप्रदा ।\nभयङ्करी महारौद्री महाभयविनाशिनी ॥",
      iast: "nārasiṃhī ca vārāhī siddhidātrī sukhapradā |\nbhayaṅkarī mahāraudrī mahābhayavināśinī ||",
      hi: "नारसिंही, वाराही, सिद्धिदात्री, सुखप्रदा, भयङ्करी, महारौद्री, महाभय की नाशिनी।",
      en: "Narasimhi, Varahi, giver of siddhi and joy, terrifying, greatly fierce, destroyer of great fear.",
    },
    {
      id: "adya-21",
      kind: "phalashruti",
      text: "ॐ नम आद्यायै ॐ नम आद्यायै ॐ नम आद्यायै ॥",
      iast: "oṃ nama ādyāyai oṃ nama ādyāyai oṃ nama ādyāyai ||",
      hi: "ॐ आद्या को तीन बार नमस्कार। इति ब्रह्मयामले ब्रह्मनारदसंवादे आद्यास्तोत्रं समाप्तम्।",
      en: "Om, salutations to Adya, thrice. Thus ends the Adya Stotram in the Brahma Yamala, dialogue of Brahma and Narada.",
    },
  ],
});

texts.push({
  deity: "kali",
  slug: "kali-aarti",
  category: "aarti",
  wave: 0,
  title: { hi: "काली आरती", en: "Kali Aarti" },
  subtitle: { hi: "जय काली माता", en: "Jai Kali Mata" },
  originalLang: "hi",
  sectionId: "kla-full",
  sectionTitle: { hi: "पूर्ण आरती", en: "Full aarti" },
  description: {
    hi: "माँ काली की सन्ध्या आरती — घर और मन्दिर की लोक-परम्परा।",
    en: "Evening aarti of Maa Kali — household and temple folk tradition.",
  },
  edition: {
    pin: "KALI-AARTI-JAI-KALI-MATA",
    publisher: "North-Indian / Bengal-adjacent temple recension (public domain)",
    notes:
      "Popular Hindi aarti 'Jai Kali Mata'. Line-order varies by region (as with Hanuman aarti). This is a widely printed eight-couplet temple form, not a tantric paddhati.",
  },
  verses: [
    {
      id: "kla-01",
      kind: "line",
      text: "जय काली माता, जय काली माता ।\nआरती तेरी जो कोई गाता ॥",
      iast: "jaya kālī mātā, jaya kālī mātā |\nāratī terī jo koī gātā ||",
      hi: "काली माता की जय। जो आपकी आरती गाता है —",
      en: "Glory to Mother Kali. Whoever sings this aarti —",
    },
    {
      id: "kla-02",
      kind: "line",
      text: "परम शान्ति मन में वह पाता, जय काली माता ।\nॐ जय काली माता ॥",
      iast: "parama śānti mana meṃ vaha pātā, jaya kālī mātā |\noṃ jaya kālī mātā ||",
      hi: "मन में परम शान्ति पाता है।",
      en: "finds supreme peace in the heart.",
    },
    {
      id: "kla-03",
      kind: "line",
      text: "जिन पायन त्रिभुवन डोले, मुकुट शशिखण्ड विराजै ।\nसोहे जटाएँ सुरसरि खोले, अरिकुल सब जग छाजै ॥",
      iast: "jina pāyana tribhuvana ḍole, mukuṭa śaśikhaṇḍa virājai |\nsohe jaṭāeṃ surasari khole, arikula saba jaga chājai ||",
      hi: "जिन चरणों से त्रिभुवन डोलता है, मुकुट में चन्द्रखण्ड; जटा में गङ्गा, शत्रुकुल जग में छा जाता है।",
      en: "At whose feet the three worlds tremble, moon-digit on the crown; Ganga in the matted hair; enemy-hosts vanish from the world.",
    },
    {
      id: "kla-04",
      kind: "line",
      text: "अष्टभुजा अति सुन्दर सोहे, शव पर पद धारे ।\nखप्पर खड्ग शोभा अति मोहे, मुण्डमाल गले धारे ॥",
      iast: "aṣṭabhujā ati sundara sohe, śava para pada dhāre |\nkhappar khaḍga śobhā ati mohe, muṇḍamāla gale dhāre ||",
      hi: "आठ भुजा अत्यन्त सुन्दर, शव पर चरण; खप्पर और खड्ग, गले में मुण्डमाल।",
      en: "Eight-armed, beautiful, feet upon the corpse; skull-cup and sword; a garland of heads at the throat.",
    },
    {
      id: "kla-05",
      kind: "line",
      text: "महिषासुर को तुमने मारा, रक्तबीज संहारा ।\nशुम्भ निशुम्भ दैत्य पछाड़ा, सब सुर किए उबारा ॥",
      iast: "mahiṣāsura ko tumane mārā, raktabīja saṃhārā |\nśumbha niśumbha daitya pachāṛā, saba sura kie ubārā ||",
      hi: "महिषासुर को मारा, रक्तबीज संहारा, शुम्भ-निशुम्भ पछाड़े, सब देवों को उबारा।",
      en: "You slew Mahishasura, destroyed Raktabija, threw down Shumbha and Nishumbha, and rescued all the gods.",
    },
    {
      id: "kla-06",
      kind: "line",
      text: "ब्रह्मा विष्णु महेश पुकारें, जब संकट में आए ।\nमातु दुर्गा भवानी द्वारे, तुम ही तो बचवाए ॥",
      iast: "brahmā viṣṇu maheśa pukāreṃ, jaba saṃkaṭa meṃ āe |\nmātu durgā bhavānī dvāre, tuma hī to bacavāe ||",
      hi: "सङ्कट में ब्रह्मा-विष्णु-महेश पुकारते हैं; मातु दुर्गा भवानी, आप ही बचाती हैं।",
      en: "Brahma, Vishnu and Mahesha call when distress comes; Mother Durga Bhavani — You alone save.",
    },
    {
      id: "kla-07",
      kind: "line",
      text: "लाल चुनरिया माथे पर राजै, नयन तीन सुहावन ।\nकर में खड्ग मुण्ड लिए सोहै, भक्तन को सुखदावन ॥",
      iast: "lāla cunariyā māthe para rājai, nayana tīna suhāvana |\nkara meṃ khaḍga muṇḍa lie sohai, bhaktana ko sukhadāvana ||",
      hi: "लाल चुनरी माथे पर, तीन नेत्र सुहावन; हाथ में खड्ग और मुण्ड, भक्तों को सुख देने वाली।",
      en: "A red veil on the brow, three lovely eyes; sword and head in hand — giver of joy to devotees.",
    },
    {
      id: "kla-08",
      kind: "line",
      text: "जय काली माता, जय काली माता ।\nआरती तेरी जो कोई गाता, परम शान्ति मन में वह पाता ॥",
      iast: "jaya kālī mātā, jaya kālī mātā |\nāratī terī jo koī gātā, parama śānti mana meṃ vaha pātā ||",
      hi: "जय काली माता — जो आरती गाता है, मन में परम शान्ति पाता है।",
      en: "Glory to Mother Kali — whoever sings this aarti finds supreme peace in the heart.",
    },
  ],
});

for (const t of texts) writeText(t);
console.log("done", texts.length, "texts");
