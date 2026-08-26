export const DEITY_IDS = ["hanuman", "shiva", "kali"] as const;
export type DeityId = (typeof DEITY_IDS)[number];

export function isDeityId(v: string): v is DeityId {
  return (DEITY_IDS as readonly string[]).includes(v);
}

export type DeityConfig = {
  id: DeityId;
  /** URL prefix; empty for Hanuman so existing /hi /en routes stay live. */
  prefix: string;
  brand: { hi: string; en: string };
  tagline: { hi: string; en: string };
  homeTitle: { hi: string; en: string };
  homeBody: { hi: string; en: string };
  eyebrow: { hi: string; en: string };
  mantra: { hi: string; en: string; iast: string };
  featuredSlug: string;
  featuredLabel: { hi: string; en: string };
  ctaSecondarySlug: string;
  ctaSecondaryLabel: { hi: string; en: string };
  portalImg: string;
  heroImg: string;
  learnNote: { hi: string; en: string };
};

export const deities: Record<DeityId, DeityConfig> = {
  hanuman: {
    id: "hanuman",
    prefix: "",
    brand: { hi: "हनुमत", en: "Hanumat" },
    tagline: { hi: "एक मन्दिर · हर पाठ", en: "One mandir · every path" },
    homeTitle: {
      hi: "हनुमान भक्ति का पूर्ण डिजिटल मन्दिर",
      en: "Complete digital mandir of Hanuman bhakti",
    },
    homeBody: {
      hi: "सुंदरकांड, चालीसा, स्तोत्र, जप, कथा — पाठ, अर्थ, श्रवण। बिना विज्ञापन।",
      en: "Sundar Kand, Chalisa, stotras, japa, katha — text, meaning, listening. No ads.",
    },
    eyebrow: { hi: "हनुमत · हनुमान धाम", en: "Hanumat · Hanuman dham" },
    mantra: {
      hi: "ॐ हनुमते नमः",
      en: "Om Hanumate Namah",
      iast: "oṃ hanumate namaḥ",
    },
    featuredSlug: "hanuman-chalisa",
    featuredLabel: { hi: "चालीसा", en: "Chalisa" },
    ctaSecondarySlug: "sundar-kand",
    ctaSecondaryLabel: { hi: "सुंदरकांड", en: "Sundar Kand" },
    portalImg: "/images/deities/hanuman-portal.jpg",
    heroImg: "/images/hanuman-108/006.jpg",
    learnNote: {
      hi: "हनुमान पाठ — गीता प्रेस परंपरा व सार्वजनिक स्रोत।",
      en: "Hanuman paths — Gita Press tradition and public-domain sources.",
    },
  },
  shiva: {
    id: "shiva",
    prefix: "/shiva",
    brand: { hi: "शिवायतन", en: "Shivayatan" },
    tagline: { hi: "नमः शिवाय · हर पाठ", en: "Namah Shivaya · every path" },
    homeTitle: {
      hi: "शिव भक्ति का डिजिटल मन्दिर",
      en: "Digital mandir of Shiva bhakti",
    },
    homeBody: {
      hi: "महामृत्युंजय, लिङ्गाष्टकम्, रुद्राष्टकम्, पञ्चाक्षर, निर्वाणषट्कम् — मूल, IAST, अर्थ।",
      en: "Mahamrityunjaya, Lingashtakam, Rudrashtakam, Panchakshara, Nirvana Shatkam — mula, IAST, meaning.",
    },
    eyebrow: { hi: "शिवायतन · शिव धाम", en: "Shivayatan · Shiva dham" },
    mantra: {
      hi: "ॐ नमः शिवाय",
      en: "Om Namah Shivaya",
      iast: "oṃ namaḥ śivāya",
    },
    featuredSlug: "lingashtakam",
    featuredLabel: { hi: "लिङ्गाष्टकम्", en: "Lingashtakam" },
    ctaSecondarySlug: "maha-mrityunjaya",
    ctaSecondaryLabel: { hi: "मृत्युंजय", en: "Mrityunjaya" },
    portalImg: "/images/deities/shiva-portal.jpg",
    heroImg: "/images/deities/shiva-hero.jpg",
    learnNote: {
      hi: "मूल ऋग्वेद / शङ्कर / तुलसीदास — संस्कृत डॉक्यूमेंट्स व Green Message से द्वितीय जाँच।",
      en: "Mula from Rigveda / Shankara / Tulsidas — collated against Sanskrit Documents and Green Message.",
    },
  },
  kali: {
    id: "kali",
    prefix: "/kali",
    brand: { hi: "कालिका धाम", en: "Kalika Dham" },
    tagline: { hi: "जय माँ काली · हर पाठ", en: "Jai Maa Kali · every path" },
    homeTitle: {
      hi: "माँ काली का डिजिटल मन्दिर",
      en: "Digital mandir of Maa Kali",
    },
    homeBody: {
      hi: "आद्या स्तोत्र, कालिकाष्टकम्, मूल मन्त्र, आरती — मूल, IAST, अर्थ।",
      en: "Adya Stotram, Kalika Ashtakam, mula mantra, aarti — mula, IAST, meaning.",
    },
    eyebrow: { hi: "कालिका धाम · महाकाली", en: "Kalika Dham · Mahakali" },
    mantra: {
      hi: "ॐ क्रीं कालिकायै नमः",
      en: "Om Krim Kalikayai Namah",
      iast: "oṃ krīṃ kālikāyai namaḥ",
    },
    featuredSlug: "kalika-ashtakam",
    featuredLabel: { hi: "कालिकाष्टकम्", en: "Kalika Ashtakam" },
    ctaSecondarySlug: "adya-stotram",
    ctaSecondaryLabel: { hi: "आद्या स्तोत्र", en: "Adya Stotram" },
    portalImg: "/images/deities/kali-portal.jpg",
    heroImg: "/images/deities/kali-hero.jpg",
    learnNote: {
      hi: "ब्रह्मयामल आद्या स्तोत्र व शङ्कर कालिकाष्टकम् — संस्कृत डॉक्यूमेंट्स / Green Message / आद्यापीठ।",
      en: "Brahma Yamala Adya Stotram and Shankara Kalika Ashtakam — Sanskrit Documents / Green Message / Adyapeath.",
    },
  },
};

/** Locale-prefixed path inside a deity mandir. */
export function deityHref(
  deity: DeityId,
  locale: string,
  path = "/",
): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  const suffix = p === "/" ? "/" : p.endsWith("/") ? p : `${p}/`;
  const prefix = deities[deity].prefix;
  return `${prefix}/${locale}${suffix}`;
}

export function deityOfMeta(meta: { deity?: string; id?: string }): DeityId {
  if (meta.deity && isDeityId(meta.deity)) return meta.deity;
  return "hanuman";
}
