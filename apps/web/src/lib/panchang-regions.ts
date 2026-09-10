/**
 * Regional panjika lenses on the same household tithi engine.
 * Labels and era years change; local printed panjika still wins.
 */

import {
  noonIst,
  SYNODIC_DAYS,
  tithiIndexFromEpoch,
  YEAR_FESTIVALS,
  type NamedFestival,
} from "@/lib/panchang";

export const PANJIKA_IDS = [
  "hindi",
  "bengali",
  "gujarati",
  "marathi",
  "tamil",
  "telugu",
  "kannada",
  "malayalam",
  "punjabi",
] as const;

export type PanjikaId = (typeof PANJIKA_IDS)[number];

export type MonthKind = "amanta" | "purnimanta" | "solar";
export type EraKind = "vikram" | "saka" | "bangabda" | "tamil" | "kollam";

export type PanjikaDef = {
  id: PanjikaId;
  en: string;
  native: string;
  region: string;
  era: EraKind;
  monthKind: MonthKind;
  newYear: string;
};

export const PANJIKA: PanjikaDef[] = [
  {
    id: "hindi",
    en: "Hindi panchang",
    native: "हिन्दी पञ्चाङ्ग",
    region: "North India",
    era: "vikram",
    monthKind: "purnimanta",
    newYear: "Chaitra Shukla 1 (Gudi Padwa / Ugadi season)",
  },
  {
    id: "bengali",
    en: "Bengali panjika",
    native: "বাংলা পঞ্জিকা",
    region: "Bengal",
    era: "bangabda",
    monthKind: "solar",
    newYear: "Pohela Boishakh · 15 Apr 2026",
  },
  {
    id: "gujarati",
    en: "Gujarati panchang",
    native: "ગુજરાતી પંચાંગ",
    region: "Gujarat",
    era: "vikram",
    monthKind: "amanta",
    newYear: "Bestu Varas · 9 Nov 2026 (after Deepavali)",
  },
  {
    id: "marathi",
    en: "Marathi panchang",
    native: "मराठी पंचांग",
    region: "Maharashtra",
    era: "saka",
    monthKind: "amanta",
    newYear: "Gudi Padwa · 19 Mar 2026",
  },
  {
    id: "tamil",
    en: "Tamil calendar",
    native: "தமிழ் நாட்காட்டி",
    region: "Tamil Nadu",
    era: "tamil",
    monthKind: "solar",
    newYear: "Puthandu · 14 Apr 2026",
  },
  {
    id: "telugu",
    en: "Telugu panchangam",
    native: "తెలుగు పంచాంగం",
    region: "Andhra / Telangana",
    era: "saka",
    monthKind: "amanta",
    newYear: "Ugadi · 19 Mar 2026",
  },
  {
    id: "kannada",
    en: "Kannada panchanga",
    native: "ಕನ್ನಡ ಪಂಚಾಂಗ",
    region: "Karnataka",
    era: "saka",
    monthKind: "amanta",
    newYear: "Ugadi · 19 Mar 2026",
  },
  {
    id: "malayalam",
    en: "Malayalam panjangam",
    native: "മലയാളം പഞ്ചാംഗം",
    region: "Kerala",
    era: "kollam",
    monthKind: "solar",
    newYear: "Vishu · 14 Apr 2026 · Kollam year from Chingam",
  },
  {
    id: "punjabi",
    en: "Punjabi panchang",
    native: "ਪੰਜਾਬੀ ਪੰਚਾਂਗ",
    region: "Punjab",
    era: "vikram",
    monthKind: "purnimanta",
    newYear: "Baisakhi · 14 Apr 2026",
  },
];

const LUNAR_MONTHS: Record<string, readonly string[]> = {
  en: ["Chaitra", "Vaishakha", "Jyeshtha", "Ashadha", "Shravana", "Bhadrapada", "Ashvina", "Kartika", "Margashirsha", "Pausha", "Magha", "Phalguna"],
  hi: ["चैत्र", "वैशाख", "ज्येष्ठ", "आषाढ़", "श्रावण", "भाद्रपद", "आश्विन", "कार्तिक", "मार्गशीर्ष", "पौष", "माघ", "फाल्गुन"],
  mr: ["चैत्र", "वैशाख", "ज्येष्ठ", "आषाढ", "श्रावण", "भाद्रपद", "आश्विन", "कार्तिक", "मार्गशीर्ष", "पौष", "माघ", "फाल्गुन"],
  gu: ["ચૈત્ર", "વૈશાખ", "જ્યેષ્ઠ", "આષાઢ", "શ્રાવણ", "ભાદરવો", "આસો", "કારતક", "માગશર", "પોષ", "મહા", "ફાગણ"],
  te: ["చైత్రం", "వైశాఖం", "జ్యేష్ఠం", "ఆషాఢం", "శ్రావణం", "భాద్రపదం", "ఆశ్వయుజం", "కార్తీకం", "మార్గశిరం", "పుష్యం", "మాఘం", "ఫాల్గుణం"],
  kn: ["ಚೈತ್ರ", "ವೈಶಾಖ", "ಜ್ಯೇಷ್ಠ", "ಆಷಾಢ", "ಶ್ರಾವಣ", "ಭಾದ್ರಪದ", "ಆಶ್ವಯುಜ", "ಕಾರ್ತೀಕ", "ಮಾರ್ಗಶಿರ", "ಪುಷ್ಯ", "ಮಾಘ", "ಫಾಲ್ಗುಣ"],
};

const SOLAR_BN = ["বৈশাখ", "জ্যৈষ্ঠ", "আষাঢ়", "শ্রাবণ", "ভাদ্র", "আশ্বিন", "কার্তিক", "অগ্রহায়ণ", "পৌষ", "মাঘ", "ফাল্গুন", "চৈত্র"] as const;
const SOLAR_TA = ["சித்திரை", "வைகாசி", "ஆனி", "ஆடி", "ஆவணி", "புரட்டாசி", "ஐப்பசி", "கார்த்திகை", "மார்கழி", "தை", "மாசி", "பங்குனி"] as const;
const SOLAR_ML = ["മേടം", "ഇടവം", "മിഥുനം", "കർക്കടകം", "ചിങ്ങം", "കന്നി", "തുലാം", "വൃശ്ചികം", "ധനു", "മകരം", "കുംഭം", "മീനം"] as const;

const WD: Record<string, readonly string[]> = {
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  hi: ["रविवार", "सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"],
  bn: ["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"],
  gu: ["રવિવાર", "સોમવાર", "મંગળવાર", "બુધવાર", "ગુરુવાર", "શુક્રવાર", "શનિવાર"],
  mr: ["रविवार", "सोमवार", "मंगळवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"],
  ta: ["ஞாயிறு", "திங்கள்", "செவ்வாய்", "புதன்", "வியாழன்", "வெள்ளி", "சனி"],
  te: ["ఆదివారం", "సోమవారం", "మంగళవారం", "బుధవారం", "గురువారం", "శుక్రవారం", "శనివారం"],
  kn: ["ಭಾನುವಾರ", "ಸೋಮವಾರ", "ಮಂಗಳವಾರ", "ಬುಧವಾರ", "ಗುರುವಾರ", "ಶುಕ್ರವಾರ", "ಶನಿವಾರ"],
  ml: ["ഞായർ", "തിങ്കൾ", "ചൊവ്വ", "ബുധൻ", "വ്യാഴം", "വെള്ളി", "ശനി"],
  pa: ["ਐਤਵਾਰ", "ਸੋਮਵਾਰ", "ਮੰਗਲਵਾਰ", "ਬੁੱਧਵਾਰ", "ਵੀਰਵਾਰ", "ਸ਼ੁੱਕਰਵਾਰ", "ਸ਼ਨੀਵਾਰ"],
};

const TITHI: Record<string, readonly string[]> = {
  en: ["Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima"],
  hi: ["प्रतिपदा", "द्वितीया", "तृतीया", "चतुर्थी", "पञ्चमी", "षष्ठी", "सप्तमी", "अष्टमी", "नवमी", "दशमी", "एकादशी", "द्वादशी", "त्रयोदशी", "चतुर्दशी", "पूर्णिमा"],
  bn: ["প্রতিপদ", "দ্বিতীয়া", "তৃতীয়া", "চতুর্থী", "পঞ্চমী", "ষষ্ঠী", "সপ্তমী", "অষ্টমী", "নবমী", "দশমী", "একাদশী", "দ্বাদশী", "ত্রয়োদশী", "চতুর্দশী", "পূর্ণিমা"],
  gu: ["પડવો", "બીજ", "ત્રીજ", "ચોથ", "પંચમ", "છઠ", "સાતમ", "આઠમ", "નોમ", "દસમ", "એકાદશી", "બારસ", "તેરસ", "ચૌદસ", "પૂનમ"],
  ta: ["பிரதமை", "துவிதியை", "திருதியை", "சதுர்த்தி", "பஞ்சமி", "சஷ்டி", "சப்தமி", "அஷ்டமி", "நவமி", "தசமி", "ஏகாதசி", "துவாதசி", "திரயோதசி", "சதுர்த்தசி", "பௌர்ணமி"],
};

const AMAVASYA: Record<string, string> = {
  en: "Amavasya",
  hi: "अमावस्या",
  bn: "অমাবস্যা",
  gu: "અમાસ",
  ta: "அமாவாசை",
};

const PAKSHA: Record<string, { shukla: string; krishna: string }> = {
  en: { shukla: "Shukla paksha", krishna: "Krishna paksha" },
  hi: { shukla: "शुक्ल पक्ष", krishna: "कृष्ण पक्ष" },
  bn: { shukla: "শুक्ल পক্ষ", krishna: "কৃষ্ণ পক্ষ" },
  gu: { shukla: "સુદ", krishna: "વદ" },
  ta: { shukla: "சுக்ல பக்ஷம்", krishna: "கிருஷ்ண பக்ஷம்" },
};

const LANG: Record<PanjikaId, string> = {
  hindi: "hi",
  bengali: "bn",
  gujarati: "gu",
  marathi: "mr",
  tamil: "ta",
  telugu: "te",
  kannada: "kn",
  malayalam: "ml",
  punjabi: "pa",
};

/** Chaitra Shukla 1 2026 (Gudi Padwa / Ugadi) — lunation epoch for amanta months. */
const CHAITRA_SHUKLA_2026 = Date.UTC(2026, 2, 19, 6, 30, 0);

function langOf(id: PanjikaId): string {
  return LANG[id];
}

function dayOfYear(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  const utc = Date.UTC(y, m - 1, d);
  const start = Date.UTC(y, 0, 1);
  return Math.floor((utc - start) / 86400000) + 1;
}

function amantaMonthIndex(iso: string): number {
  const noon = noonIst(iso).getTime();
  const raw = Math.floor((noon - CHAITRA_SHUKLA_2026) / (SYNODIC_DAYS * 86400000));
  return ((raw % 12) + 12) % 12;
}

function solarMonthIndex(iso: string, startDoy: number): number {
  const doy = dayOfYear(iso);
  const shifted = (doy - startDoy + 365) % 365;
  return Math.min(11, Math.floor(shifted / 30.44));
}

export function panjikaById(id: string): PanjikaDef {
  return PANJIKA.find((p) => p.id === id) || PANJIKA[0];
}

export function weekdayLabel(weekday: number, panjika: PanjikaId, ui: "en" | "hi"): string {
  const lang = ui === "en" && panjika === "hindi" ? "en" : langOf(panjika);
  const row = WD[lang] || WD.en;
  return row[weekday] || WD.en[weekday];
}

export function tithiLabel(tithiNum: number, shukla: boolean, panjika: PanjikaId, ui: "en" | "hi"): string {
  const lang = ui === "en" && (panjika === "hindi" || panjika === "marathi") ? "en" : langOf(panjika);
  if (!shukla && tithiNum === 15) {
    return AMAVASYA[lang] || AMAVASYA.en;
  }
  const row = TITHI[lang] || TITHI.en;
  const idx = Math.min(14, Math.max(1, tithiNum) - 1);
  return row[idx] || TITHI.en[idx];
}

export function pakshaLabel(shukla: boolean, panjika: PanjikaId, ui: "en" | "hi"): string {
  const lang = ui === "en" && panjika === "hindi" ? "en" : langOf(panjika);
  const p = PAKSHA[lang] || PAKSHA.en;
  return shukla ? p.shukla : p.krishna;
}

export function monthLabel(iso: string, panjika: PanjikaId, ui: "en" | "hi"): string {
  const def = panjikaById(panjika);
  if (def.monthKind === "solar") {
    if (panjika === "bengali") return SOLAR_BN[solarMonthIndex(iso, 105)];
    if (panjika === "tamil") return SOLAR_TA[solarMonthIndex(iso, 104)];
    if (panjika === "malayalam") return SOLAR_ML[solarMonthIndex(iso, 104)];
  }
  const { shukla } = tithiIndexFromEpoch(noonIst(iso).getTime());
  let idx = amantaMonthIndex(iso);
  if (def.monthKind === "purnimanta" && !shukla) idx = (idx + 1) % 12;
  const lang = ui === "en" ? "en" : panjika === "gujarati" ? "gu" : panjika === "telugu" ? "te" : panjika === "kannada" ? "kn" : panjika === "marathi" ? "mr" : "hi";
  const row = LUNAR_MONTHS[lang] || LUNAR_MONTHS.en;
  return row[idx];
}

export function eraLabel(iso: string, panjika: PanjikaId, ui: "en" | "hi"): string {
  const y = Number(iso.slice(0, 4));
  const def = panjikaById(panjika);
  if (def.era === "vikram") {
    const vs = iso >= `${y}-03-19` ? y + 57 : y + 56;
    return ui === "hi" ? `विक्रम संवत् ${vs}` : `Vikram Samvat ${vs}`;
  }
  if (def.era === "saka") {
    const se = iso >= `${y}-03-19` ? y - 78 : y - 79;
    return ui === "hi" ? `शक संवत् ${se}` : `Shaka Samvat ${se}`;
  }
  if (def.era === "bangabda") {
    const b = iso >= `${y}-04-15` ? y - 593 : y - 594;
    return `বঙ্গাব্দ ${b}`;
  }
  if (def.era === "tamil") {
    return ui === "en" ? `Tamil year from Puthandu` : `तमिल वर्ष · पुथाण्डु`;
  }
  const kollam = iso >= `${y}-08-17` ? 1201 + (y - 2026) + 1 : 1201 + (y - 2026);
  return `കൊല്ലവർഷം ${kollam}`;
}

export function festivalsForLens(iso: string, panjika: PanjikaId): NamedFestival[] {
  return YEAR_FESTIVALS.filter((f) => {
    if (!(iso >= f.start && iso <= f.end)) return false;
    if (!f.panjika || f.panjika.length === 0) return true;
    return f.panjika.includes(panjika);
  });
}

export function yearFestivals(year: number, panjika: PanjikaId): NamedFestival[] {
  const prefix = `${year}-`;
  return YEAR_FESTIVALS.filter((f) => {
    if (!f.start.startsWith(prefix) && !f.end.startsWith(prefix)) return false;
    if (!f.panjika || f.panjika.length === 0) return true;
    return f.panjika.includes(panjika);
  });
}

export function isPanjikaId(v: string): v is PanjikaId {
  return (PANJIKA_IDS as readonly string[]).includes(v);
}
