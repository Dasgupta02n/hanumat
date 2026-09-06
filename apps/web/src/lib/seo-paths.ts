import type { DeityId } from "@/lib/deities";

export type SeoCopy = {
  title: { hi: string; en: string };
  description: { hi: string; en: string };
  keywords: string[];
  how: { hi: string; en: string };
};

const FALLBACK: SeoCopy = {
  title: {
    hi: "पाठ · अर्थ · IAST · निःशुल्क मन्दिर",
    en: "Path · meaning · IAST · free digital mandir",
  },
  description: {
    hi: "मूल, IAST, सरल अर्थ। बिना विज्ञापन, बिना खाता। हनुमत — तीन धाम।",
    en: "Mula, IAST, plain meaning. No ads, no account. Hanumat — three mandirs.",
  },
  keywords: ["digital mandir", "IAST", "stotra", "free", "no ads"],
  how: {
    hi: "पाठ स्टूडियो में मूल पढ़ें, IAST खोलें, अर्थ देखें। मंगलवार/सोमवार का पाठ आंगन पर।",
    en: "Open Path Studio for mula, IAST, and meaning. Tuesday and Monday paths are on the courtyard.",
  },
};

const MAP: Record<string, SeoCopy> = {
  "bhagavad-gita": {
    title: {
      hi: "भगवद्गीता अर्थ सहित — १८ अध्याय, IAST",
      en: "Bhagavad Gita in English — 18 chapters, IAST, free Path Studio",
    },
    description: {
      hi: "श्रीमद्भगवद्गीता — मूल, IAST, हिंदी-अंग्रेज़ी अर्थ। बिना विज्ञापन, बिना खाता।",
      en: "Bhagavad Gita — mula, IAST, Hindi and English meaning. Free, no ads, no account.",
    },
    keywords: [
      "Bhagavad Gita",
      "Bhagavad Gita English meaning",
      "Bhagavad Gita IAST",
      "भगवद्गीता अर्थ",
      "Gita Path Studio",
    ],
    how: {
      hi: "अध्याय चुनें, मूल-IAST-अर्थ साथ पढ़ें। एकादशी पर एक अध्याय।",
      en: "Pick a chapter. Read mula, IAST, and meaning together. One chapter on Ekadashi.",
    },
  },
  "hanuman-chalisa": {
    title: {
      hi: "हनुमान चालीसा अर्थ सहित — पाठ, IAST",
      en: "Hanuman Chalisa in English — meaning, IAST, free Path Studio",
    },
    description: {
      hi: "तुलसीदास की हनुमान चालीसा — मूल, IAST, हिंदी-अंग्रेज़ी अर्थ। बिना विज्ञापन। मंगलवार का पाठ।",
      en: "Tulsidas’ Hanuman Chalisa with English meaning and IAST (Roman letters). Free, no ads. Tuesday path.",
    },
    keywords: [
      "Hanuman Chalisa",
      "Hanuman Chalisa English meaning",
      "Hanuman Chalisa IAST",
      "हनुमान चालीसा अर्थ",
      "Chalisa lyrics",
      "Tuesday Hanuman",
    ],
    how: {
      hi: "चालीसा खोलें → अर्थ/IAST बटन → मंगलवार जप माला। ऑफ़लाइन पैक मेरा पथ से।",
      en: "Open Chalisa → Meaning / Roman letters (IAST) → Tuesday japa. Offline pack from My Path.",
    },
  },
  "sundar-kand": {
    title: {
      hi: "सुंदरकांड पाठ अर्थ सहित — रामचरितमानस",
      en: "Sundar Kand with meaning — Ramcharitmanas Path Studio",
    },
    description: {
      hi: "तुलसीदास सुंदरकांड — खंडों में पाठ व अर्थ। पारायण ७/४० दिन। बिना विज्ञापन।",
      en: "Tulsidas Sundar Kand in sections — text and meaning. 7/40-day parayan. Free, no ads.",
    },
    keywords: ["Sundar Kand", "Sundar Kand meaning", "सुंदरकांड पाठ", "Ramcharitmanas"],
    how: {
      hi: "खंड चुनें, अर्थ पढ़ें, पारायण योजना से दिन बाँटें।",
      en: "Pick a section, read the meaning, split days in the parayan planner.",
    },
  },
  "valmiki-sundarakanda": {
    title: {
      hi: "वाल्मीकि सुन्दरकाण्ड — ६८ सर्ग",
      en: "Valmiki Sundarakanda — 68 sargas, Path Studio",
    },
    description: {
      hi: "वाल्मीकि रामायण सुन्दरकाण्ड पूर्ण — मूल, IAST, अर्थ। निःशुल्क मन्दिर।",
      en: "Full Valmiki Ramayana Sundarakanda — mula, IAST, meaning. Free mandir.",
    },
    keywords: ["Valmiki Sundarakanda", "Sundarakanda Sanskrit", "वाल्मीकि सुन्दरकाण्ड"],
    how: FALLBACK.how,
  },
  lingashtakam: {
    title: {
      hi: "लिङ्गाष्टकम् अर्थ सहित — शिव स्तोत्र",
      en: "Lingashtakam in English — meaning, IAST, Shiva stotra",
    },
    description: {
      hi: "ब्रह्ममुरारि… लिङ्गाष्टकम् — मूल, IAST, अर्थ। सोमवार व शिवरात्रि पाठ। शिवायतन।",
      en: "Lingashtakam (Brahma Murari…) with English meaning and IAST. Monday and Shivaratri path. Shivayatan.",
    },
    keywords: ["Lingashtakam", "Lingashtakam meaning", "लिङ्गाष्टकम्", "Shiva stotra", "Monday Shiva"],
    how: {
      hi: "शिवायतन → लिङ्गाष्टकम् → IAST/अर्थ। सोमवार जप: ॐ नमः शिवाय।",
      en: "Shivayatan → Lingashtakam → IAST/meaning. Monday japa: Om Namah Shivaya.",
    },
  },
  "om-namah-shivaya": {
    title: {
      hi: "ॐ नमः शिवाय — पञ्चाक्षर जप",
      en: "Om Namah Shivaya — Panchakshara mantra, japa",
    },
    description: {
      hi: "पञ्चाक्षर मन्त्र — मूल, IAST, जप माला। सोमवार पाठ। बिना विज्ञापन।",
      en: "Five-syllable Shiva mantra with IAST and japa mala. Monday path. No ads.",
    },
    keywords: ["Om Namah Shivaya", "Panchakshara", "ॐ नमः शिवाय", "Shiva japa"],
    how: FALLBACK.how,
  },
  "maha-mrityunjaya": {
    title: {
      hi: "महामृत्युंजय मन्त्र अर्थ सहित",
      en: "Mahamrityunjaya mantra — meaning and IAST",
    },
    description: {
      hi: "त्र्यम्बकं यजामहे — ऋग्वेद ७.५९.१२। मूल, IAST, अर्थ। शिवरात्रि पाठ।",
      en: "Tryambakam yajamahe — Rigveda 7.59.12. Mula, IAST, meaning. Shivaratri path.",
    },
    keywords: ["Mahamrityunjaya", "Mrityunjaya mantra meaning", "महामृत्युंजय"],
    how: FALLBACK.how,
  },
  rudrashtakam: {
    title: {
      hi: "रुद्राष्टकम् अर्थ सहित — तुलसीदास",
      en: "Rudrashtakam with meaning — Tulsidas, Pradosha path",
    },
    description: {
      hi: "नमामीशमीशान… रुद्राष्टकम् — मूल, IAST, अर्थ। प्रदोष पाठ।",
      en: "Namamishamishan… Rudrashtakam with IAST and meaning. Pradosha path.",
    },
    keywords: ["Rudrashtakam", "रुद्राष्टकम्", "Pradosha"],
    how: FALLBACK.how,
  },
  "kalika-ashtakam": {
    title: {
      hi: "कालिकाष्टकम् अर्थ सहित — माँ काली स्तोत्र",
      en: "Kalika Ashtakam in English — meaning, IAST",
    },
    description: {
      hi: "शङ्कर कालिकाष्टकम् — मूल, IAST, अर्थ। काली पूजा / अमावस्या। कर्पूरादि नहीं।",
      en: "Shankara Kalika Ashtakam with English meaning and IAST. Kali puja / Amavasya. No Karpuradi paddhati.",
    },
    keywords: ["Kalika Ashtakam", "Kali stotra", "कालिकाष्टकम्", "Kali puja"],
    how: {
      hi: "कालिका धाम → कालिकाष्टकम्। अमावस्या जप माला।",
      en: "Kalika Dham → Kalika Ashtakam. Amavasya japa mala.",
    },
  },
  "adya-stotram": {
    title: {
      hi: "आद्या स्तोत्रम् अर्थ सहित",
      en: "Adya Stotram — meaning, IAST, Maa Kali",
    },
    description: {
      hi: "ब्रह्मयामल आद्या स्तोत्र — मूल, IAST, अर्थ। सार्वजनिक पाठ, तान्त्रिक पद्धति नहीं।",
      en: "Brahma Yamala Adya Stotram with meaning and IAST. Public recension, not a tantric paddhati.",
    },
    keywords: ["Adya Stotram", "आद्या स्तोत्र", "Adya Kali"],
    how: FALLBACK.how,
  },
  "gayatri-mantra": {
    title: {
      hi: "गायत्री मन्त्र अर्थ सहित — ऋग्वेद",
      en: "Gayatri mantra — meaning, IAST, Rigveda 3.62.10",
    },
    description: {
      hi: "तत्सवितुर्वरेण्यम् — मूल, IAST, अर्थ। बिना विज्ञापन।",
      en: "Tat savitur varenyam — mula, IAST, meaning. Free, no ads.",
    },
    keywords: ["Gayatri mantra", "गायत्री मन्त्र", "Gayatri IAST"],
    how: FALLBACK.how,
  },
  "vishnu-sahasranama-selected": {
    title: {
      hi: "विष्णु सहस्रनाम · चयन — ध्यान व नाम",
      en: "Vishnu Sahasranama selected names — dhyana and Path Studio",
    },
    description: {
      hi: "शान्ताकारं ध्यान और तीस नाम। पूर्ण सहस्र नहीं। मूल, IAST, अर्थ।",
      en: "Shantakaram dhyana and thirty names. Not the full thousand. Mula, IAST, meaning.",
    },
    keywords: ["Vishnu Sahasranama", "विष्णु सहस्रनाम", "Vishnu 108 names"],
    how: FALLBACK.how,
  },
  "ganesha-pancharatnam": {
    title: {
      hi: "गणेश पञ्चरत्नम् अर्थ सहित",
      en: "Ganesha Pancharatnam — meaning, IAST",
    },
    description: {
      hi: "शङ्कर गणेश पञ्चरत्न — मूल, IAST, अर्थ। पाठ आरम्भ।",
      en: "Shankara’s five-jewel hymn to Ganesha. Mula, IAST, meaning.",
    },
    keywords: ["Ganesha Pancharatnam", "गणेश पञ्चरत्न"],
    how: FALLBACK.how,
  },
  madhurashtakam: {
    title: {
      hi: "मधुराष्टकम् अर्थ सहित — वल्लभाचार्य",
      en: "Madhurashtakam — Vallabhacharya, meaning and IAST",
    },
    description: {
      hi: "अधरं मधुरं — कृष्ण की मधुरता। मूल, IAST, अर्थ।",
      en: "Adharam madhuram — Krishna’s sweetness. Mula, IAST, meaning.",
    },
    keywords: ["Madhurashtakam", "मधुराष्टकम्", "Adharam madhuram"],
    how: FALLBACK.how,
  },
  "kali-gayatri": {
    title: {
      hi: "काली गायत्री मन्त्र",
      en: "Kali Gayatri mantra — IAST and meaning",
    },
    description: {
      hi: "ॐ कालीकाल्यै विद्महे — घर जप। मूल, IAST, अर्थ।",
      en: "Om Kalikalyai vidmahe — household japa. Mula, IAST, meaning.",
    },
    keywords: ["Kali Gayatri", "काली गायत्री"],
    how: FALLBACK.how,
  },
};

export function seoFor(slug: string): SeoCopy {
  return MAP[slug] || FALLBACK;
}

export function pathJsonLd(opts: {
  deity: DeityId;
  slug: string;
  locale: string;
  name: string;
  description: string;
  url: string;
  image: string;
}) {
  const seo = seoFor(opts.slug);
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: opts.name,
    description: opts.description,
    inLanguage: opts.locale === "en" ? "en" : "hi",
    url: opts.url,
    image: opts.image,
    isAccessibleForFree: true,
    creator: { "@type": "Organization", name: "Hanumat", url: "https://hanumat.life" },
    about: opts.deity,
    keywords: seo.keywords.join(", "),
  };
}
