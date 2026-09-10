import type { DeityTag } from "@/lib/panchang";

export type YearRitual = {
  id: string;
  deity: DeityTag;
  en: string;
  hi: string;
  whenEn: string;
  whenHi: string;
  href: string;
};

export const YEAR_RITUALS: YearRitual[] = [
  {
    id: "mangalwar",
    deity: "hanuman",
    en: "Mangalwar path",
    hi: "मंगलवार पाठ",
    whenEn: "Every Tuesday — Chalisa, japa, aarti, prasad",
    whenHi: "प्रत्येक मंगलवार — चालीसा, जप, आरती, प्रसाद",
    href: "/en/path/hanuman-chalisa/",
  },
  {
    id: "shanivar",
    deity: "hanuman",
    en: "Saturday Sundar Kand",
    hi: "शनिवार सुंदरकांड",
    whenEn: "Saturday — Sundar Kand, Sankatmochan",
    whenHi: "शनिवार — सुंदरकांड, संकटमोचन",
    href: "/en/path/sundar-kand/",
  },
  {
    id: "jayanti-path",
    deity: "hanuman",
    en: "Hanuman Jayanti",
    hi: "हनुमान जयन्ती",
    whenEn: "Chaitra Purnima (1–2 Apr 2026) — Chalisa and japa",
    whenHi: "चैत्र पूर्णिमा (1–2 अप्रैल 2026) — चालीसा व जप",
    href: "/en/path/hanuman-chalisa/",
  },
  {
    id: "sankat-path",
    deity: "hanuman",
    en: "Refuge path",
    hi: "संकट पाठ",
    whenEn: "When the home needs a short, fearless Name",
    whenHi: "जब घर को छोटा, निर्भय नाम चाहिए",
    href: "/en/sankat/",
  },
  {
    id: "somvar",
    deity: "shiva",
    en: "Monday Panchakshara",
    hi: "सोमवार पञ्चाक्षर",
    whenEn: "Every Monday — Om Namah Shivaya, bel, quiet abhisheka mood",
    whenHi: "प्रत्येक सोमवार — ॐ नमः शिवाय, बिल्व, अभिषेक भाव",
    href: "/shiva/en/path/om-namah-shivaya/",
  },
  {
    id: "pradosha",
    deity: "shiva",
    en: "Pradosha",
    hi: "प्रदोष",
    whenEn: "Trayodashi dusk — Rudrashtakam",
    whenHi: "त्रयोदशी संध्या — रुद्राष्टकम्",
    href: "/shiva/en/path/rudrashtakam/",
  },
  {
    id: "shivaratri",
    deity: "shiva",
    en: "Maha Shivaratri vigil",
    hi: "महाशिवरात्रि जागरण",
    whenEn: "15–16 Feb 2026 — manasa puja, Mrityunjaya, Lingashtakam",
    whenHi: "15–16 फ़रवरी 2026 — मानस पूजा, मृत्युंजय, लिङ्गाष्टकम्",
    href: "/shiva/en/path/shiva-manasa-puja/",
  },
  {
    id: "shravan-mon",
    deity: "shiva",
    en: "Shravan Mondays",
    hi: "श्रावण सोमवार",
    whenEn: "13 Aug – 11 Sep 2026 — Om Namah Shivaya",
    whenHi: "13 अगस्त – 11 सितम्बर 2026 — ॐ नमः शिवाय",
    href: "/shiva/en/path/om-namah-shivaya/",
  },
  {
    id: "amavasya-kali",
    deity: "kali",
    en: "Amavasya japa",
    hi: "अमावस्या जप",
    whenEn: "New moon — Mother’s japa, Adya Stotram, a lamp",
    whenHi: "अमावस्या — माँ का जप, आद्या स्तोत्र, दीप",
    href: "/kali/en/japa/",
  },
  {
    id: "navaratri",
    deity: "kali",
    en: "Sharad Navaratri",
    hi: "शरद नवरात्रि",
    whenEn: "11–19 Oct 2026 — Durga Saptashloki",
    whenHi: "11–19 अक्टूबर 2026 — दुर्गा सप्तश्लोकी",
    href: "/kali/en/path/durga-saptashloki/",
  },
  {
    id: "kali-puja",
    deity: "kali",
    en: "Kali puja / Deepavali",
    hi: "काली पूजा / दीपावली",
    whenEn: "8–10 Nov 2026 — Kalika Ashtakam, aarti",
    whenHi: "8–10 नवम्बर 2026 — कालिकाष्टकम्, आरती",
    href: "/kali/en/path/kalika-ashtakam/",
  },
  {
    id: "adya",
    deity: "kali",
    en: "Adya Stotram",
    hi: "आद्या स्तोत्र",
    whenEn: "Daily or Amavasya — Adya as the first Shakti",
    whenHi: "नित्य या अमावस्या — आदि शक्ति आद्या",
    href: "/kali/en/path/adya-stotram/",
  },
];

export const HUB_TILES = [
  {
    id: "panchang",
    href: "/panchang/#panchang",
    en: "Panchang",
    hi: "पञ्चाङ्ग",
    enSub: "Tithi · panjika · month",
    hiSub: "तिथि · पञ्जिका · मास",
  },
  {
    id: "muhurat",
    href: "/panchang/#muhurat",
    en: "Muhurat",
    hi: "मुहूर्त",
    enSub: "Rahu kalam · Abhijit · Brahma",
    hiSub: "राहु काल · अभिजित् · ब्रह्म",
  },
  {
    id: "festivals",
    href: "/panchang/#festivals",
    en: "Festivals",
    hi: "त्यौहार",
    enSub: "Year list · three dhams",
    hiSub: "वर्ष सूची · तीन धाम",
  },
  {
    id: "rituals",
    href: "/panchang/#rituals",
    en: "Rituals",
    hi: "अनुष्ठान",
    enSub: "Hanuman · Shiva · Kali paths",
    hiSub: "हनुमान · शिव · काली पाठ",
  },
] as const;
