/**
 * Household panchang for the mandir — tithi / paksha / vara / nakshatra
 * from lunar age, plus named festivals. Local printed panchang wins.
 * Not a kundali engine and not a muhurat consultancy.
 */

const SYNODIC = 29.530588853;
/** Approximate new moon near J2000 (UTC). */
const NEW_MOON_UTC = Date.UTC(2000, 0, 6, 18, 14, 0);
const NAKSHATRAS = [
  "Ashwini",
  "Bharani",
  "Krittika",
  "Rohini",
  "Mrigashirsha",
  "Ardra",
  "Punarvasu",
  "Pushya",
  "Ashlesha",
  "Magha",
  "Purva Phalguni",
  "Uttara Phalguni",
  "Hasta",
  "Chitra",
  "Swati",
  "Vishakha",
  "Anuradha",
  "Jyeshtha",
  "Mula",
  "Purva Ashadha",
  "Uttara Ashadha",
  "Shravana",
  "Dhanishta",
  "Shatabhisha",
  "Purva Bhadrapada",
  "Uttara Bhadrapada",
  "Revati",
] as const;
const NAKSHATRAS_HI = [
  "अश्विनी",
  "भरणी",
  "कृत्तिका",
  "रोहिणी",
  "मृगशिरा",
  "आर्द्रा",
  "पुनर्वसु",
  "पुष्य",
  "आश्लेषा",
  "मघा",
  "पूर्वा फाल्गुनी",
  "उत्तरा फाल्गुनी",
  "हस्त",
  "चित्रा",
  "स्वाती",
  "विशाखा",
  "अनुराधा",
  "ज्येष्ठा",
  "मूल",
  "पूर्वाषाढ़ा",
  "उत्तराषाढ़ा",
  "श्रवण",
  "धनिष्ठा",
  "शतभिषा",
  "पूर्वा भाद्रपद",
  "उत्तरा भाद्रपद",
  "रेवती",
] as const;
const VARA_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;
const VARA_HI = ["रविवार", "सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"] as const;
const TITHI_EN = [
  "Pratipada",
  "Dwitiya",
  "Tritiya",
  "Chaturthi",
  "Panchami",
  "Shashthi",
  "Saptami",
  "Ashtami",
  "Navami",
  "Dashami",
  "Ekadashi",
  "Dwadashi",
  "Trayodashi",
  "Chaturdashi",
  "Purnima",
] as const;
const TITHI_HI = [
  "प्रतिपदा",
  "द्वितीया",
  "तृतीया",
  "चतुर्थी",
  "पञ्चमी",
  "षष्ठी",
  "सप्तमी",
  "अष्टमी",
  "नवमी",
  "दशमी",
  "एकादशी",
  "द्वादशी",
  "त्रयोदशी",
  "चतुर्दशी",
  "पूर्णिमा",
] as const;
const KRISHNA_15_EN = "Amavasya";
const KRISHNA_15_HI = "अमावस्या";

export type DeityTag = "hanuman" | "shiva" | "kali" | "sarva";

export type NamedFestival = {
  start: string;
  end: string;
  hi: string;
  en: string;
  deity?: DeityTag;
  href?: string;
  /** Regional lenses this row is most at home in. Omit = every panjika. */
  panjika?: string[];
};

export type PanchangDay = {
  iso: string;
  weekday: number;
  vara: { hi: string; en: string };
  tithiNum: number;
  tithi: { hi: string; en: string };
  paksha: { hi: string; en: string };
  nakshatra: { hi: string; en: string };
  flags: {
    ekadashi: boolean;
    purnima: boolean;
    amavasya: boolean;
    pradosha: boolean;
  };
  festivals: NamedFestival[];
  approximate: true;
};

const IST = "Asia/Kolkata";
const WD_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

function istYmd(now: Date): { iso: string; weekday: number; year: number; month: number; day: number } {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: IST,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value || "";
  const year = Number(get("year"));
  const month = Number(get("month"));
  const day = Number(get("day"));
  const weekday = WD_SHORT.indexOf(get("weekday") as (typeof WD_SHORT)[number]);
  return {
    iso: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    weekday: weekday < 0 ? 0 : weekday,
    year,
    month,
    day,
  };
}

/** Noon IST as UTC instant for a calendar date (YYYY-MM-DD). */
export function noonIst(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d, 6, 30, 0));
}

function lunarAgeDays(epochMs: number): number {
  const days = (epochMs - NEW_MOON_UTC) / 86400000;
  return ((days % SYNODIC) + SYNODIC) % SYNODIC;
}

/** 0–29 from the last new moon. 0–14 shukla, 15–29 krishna. */
export function tithiIndexFromEpoch(epochMs: number): { tithiIndex0: number; shukla: boolean } {
  const age = lunarAgeDays(epochMs);
  const tithiIndex0 = Math.min(29, Math.floor(age / (SYNODIC / 30)));
  return { tithiIndex0, shukla: tithiIndex0 < 15 };
}

export const SYNODIC_DAYS = SYNODIC;

/**
 * Named festivals only. Collated against Drik Panchang Indian Calendar
 * (https://www.drikpanchang.com/calendars/indian/indiancalendar.html) and a
 * second public calendar (India TV / Hindu Blog / Times of India / Hindustan Times).
 * Tithi-overlap days are a window; local printed panchang wins.
 */
export const YEAR_FESTIVALS: NamedFestival[] = [
  { start: "2026-01-14", end: "2026-01-14", hi: "मकर संक्रान्ति / उत्तरायण / पोंगल", en: "Makar Sankranti / Uttarayan / Pongal", deity: "sarva", panjika: ["hindi", "gujarati", "tamil", "punjabi", "bengali"] },
  { start: "2026-01-23", end: "2026-01-23", hi: "वसन्त पञ्चमी", en: "Vasant Panchami", deity: "sarva", href: "/en/path/saraswati-stotram/" },
  { start: "2026-02-15", end: "2026-02-16", hi: "महाशिवरात्रि", en: "Maha Shivaratri", deity: "shiva", href: "/shiva/en/path/shiva-manasa-puja/" },
  { start: "2026-03-03", end: "2026-03-04", hi: "होली", en: "Holi", deity: "sarva" },
  { start: "2026-03-19", end: "2026-03-19", hi: "गुड़ी पड़वा / उगादि / चैत्र शुक्ल", en: "Gudi Padwa / Ugadi / Chaitra Shukla", deity: "sarva", panjika: ["marathi", "telugu", "kannada", "hindi"], href: "/en/path/gayatri-mantra/" },
  { start: "2026-03-26", end: "2026-03-27", hi: "राम नवमी", en: "Ram Navami", deity: "sarva", href: "/en/path/hanuman-chalisa/" },
  { start: "2026-04-01", end: "2026-04-02", hi: "हनुमान जयन्ती", en: "Hanuman Jayanti", deity: "hanuman", href: "/en/path/hanuman-chalisa/" },
  { start: "2026-04-14", end: "2026-04-14", hi: "वैशाखी / पुथाण्डु / विषु", en: "Baisakhi / Puthandu / Vishu", deity: "sarva", panjika: ["punjabi", "tamil", "malayalam"] },
  { start: "2026-04-15", end: "2026-04-15", hi: "পহেলা বৈশাখ · बंगाली नववर्ष", en: "Pohela Boishakh · Bengali new year", deity: "sarva", panjika: ["bengali"], href: "/kali/en/" },
  { start: "2026-04-19", end: "2026-04-19", hi: "अक्षय तृतीया", en: "Akshaya Tritiya", deity: "sarva", href: "/en/path/mahalakshmi-ashtakam/" },
  { start: "2026-08-13", end: "2026-09-11", hi: "श्रावण मास", en: "Shravan month", deity: "shiva", href: "/shiva/en/path/om-namah-shivaya/" },
  { start: "2026-08-26", end: "2026-08-26", hi: "ओणम्", en: "Onam", deity: "sarva", panjika: ["malayalam"] },
  { start: "2026-08-28", end: "2026-08-28", hi: "रक्षा बन्धन", en: "Raksha Bandhan", deity: "sarva" },
  { start: "2026-09-03", end: "2026-09-04", hi: "जन्माष्टमी", en: "Janmashtami", deity: "sarva", href: "/en/path/krishna-prarthana/" },
  { start: "2026-09-14", end: "2026-09-14", hi: "गणेश चतुर्थी", en: "Ganesh Chaturthi", deity: "sarva", href: "/en/path/ganesha-pancharatnam/", panjika: ["marathi", "hindi", "gujarati", "kannada", "telugu"] },
  { start: "2026-10-11", end: "2026-10-19", hi: "शरद नवरात्रि", en: "Sharad Navaratri", deity: "kali", href: "/kali/en/path/durga-saptashloki/" },
  { start: "2026-10-20", end: "2026-10-20", hi: "दशहरा / विजयादशमी", en: "Dussehra / Vijayadashami", deity: "kali", href: "/kali/en/path/durga-saptashloki/" },
  { start: "2026-11-08", end: "2026-11-08", hi: "दीपावली / लक्ष्मी पूजा", en: "Deepavali / Lakshmi puja", deity: "sarva", href: "/en/path/mahalakshmi-ashtakam/" },
  { start: "2026-11-08", end: "2026-11-10", hi: "काली पूजा", en: "Kali puja", deity: "kali", href: "/kali/en/path/kalika-ashtakam/", panjika: ["bengali", "hindi"] },
  { start: "2026-11-09", end: "2026-11-09", hi: "बेस्तु वरस / अन्नकूट", en: "Bestu Varas / Annakut", deity: "sarva", panjika: ["gujarati", "hindi"], href: "/en/path/mahalakshmi-ashtakam/" },
  { start: "2026-11-24", end: "2026-11-24", hi: "गुरु नानक जयन्ती", en: "Guru Nanak Jayanti", deity: "sarva", panjika: ["punjabi", "hindi"] },
  { start: "2027-03-06", end: "2027-03-07", hi: "महाशिवरात्रि", en: "Maha Shivaratri", deity: "shiva", href: "/shiva/en/path/shiva-manasa-puja/" },
  { start: "2027-04-20", end: "2027-04-20", hi: "हनुमान जयन्ती", en: "Hanuman Jayanti", deity: "hanuman", href: "/en/path/hanuman-chalisa/" },
];

function panchangAt(iso: string, weekday: number, epochMs: number): PanchangDay {
  const age = lunarAgeDays(epochMs);
  const tithiIndex0 = Math.min(29, Math.floor(age / (SYNODIC / 30)));
  const shukla = tithiIndex0 < 15;
  const tithiInPaksha = (tithiIndex0 % 15) + 1;
  const purnima = shukla && tithiInPaksha === 15;
  const amavasya = !shukla && tithiInPaksha === 15;
  const tithiEn = !shukla && tithiInPaksha === 15 ? KRISHNA_15_EN : TITHI_EN[tithiInPaksha - 1];
  const tithiHi = !shukla && tithiInPaksha === 15 ? KRISHNA_15_HI : TITHI_HI[tithiInPaksha - 1];
  const nak = Math.min(26, Math.floor((age / SYNODIC) * 27));
  const pradosha = tithiInPaksha === 13;
  const festivals = YEAR_FESTIVALS.filter((f) => iso >= f.start && iso <= f.end);

  return {
    iso,
    weekday,
    vara: { hi: VARA_HI[weekday], en: VARA_EN[weekday] },
    tithiNum: tithiInPaksha,
    tithi: { hi: tithiHi, en: tithiEn },
    paksha: shukla
      ? { hi: "शुक्ल पक्ष", en: "Shukla paksha" }
      : { hi: "कृष्ण पक्ष", en: "Krishna paksha" },
    nakshatra: { hi: NAKSHATRAS_HI[nak], en: NAKSHATRAS[nak] },
    flags: {
      ekadashi: tithiInPaksha === 11,
      purnima,
      amavasya,
      pradosha,
    },
    festivals,
    approximate: true,
  };
}

export function panchangFor(now = new Date()): PanchangDay {
  const { iso, weekday } = istYmd(now);
  return panchangAt(iso, weekday, now.getTime());
}

/** Tithi at noon IST for a calendar date. Use for month grids. */
export function panchangForIso(iso: string): PanchangDay {
  const noon = noonIst(iso);
  return panchangAt(iso, noon.getUTCDay(), noon.getTime());
}

export function panchangMonth(year: number, month: number): PanchangDay[] {
  const last = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const days: PanchangDay[] = [];
  for (let d = 1; d <= last; d++) {
    const iso = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    days.push(panchangForIso(iso));
  }
  return days;
}

export type TodaySadhana = {
  label: { hi: string; en: string };
  href: string;
};

export function sadhanaForPanchang(
  p: PanchangDay,
  locale: string,
): TodaySadhana[] {
  const out: TodaySadhana[] = [];
  const fest = p.festivals.map((f) => f.en).join(" ");
  if (p.weekday === 0) {
    out.push({
      label: { hi: "रविवार · गायत्री", en: "Sunday · Gayatri" },
      href: `/${locale}/path/gayatri-mantra/`,
    });
  }
  if (p.weekday === 1) {
    out.push({
      label: { hi: "सोमवार · ॐ नमः शिवाय", en: "Monday · Om Namah Shivaya" },
      href: `/shiva/${locale}/path/om-namah-shivaya/`,
    });
  }
  if (p.weekday === 2) {
    out.push({
      label: { hi: "मंगलवार · चालीसा व जप", en: "Tuesday · Chalisa and japa" },
      href: `/${locale}/path/hanuman-chalisa/`,
    });
  }
  if (p.weekday === 3) {
    out.push({
      label: { hi: "बुधवार · गणेश प्रार्थना", en: "Wednesday · Ganesha prayer" },
      href: `/${locale}/path/ganesha-prarthana/`,
    });
  }
  if (p.weekday === 4) {
    out.push({
      label: { hi: "गुरुवार · गुरु स्तोत्र", en: "Thursday · Guru stotram" },
      href: `/${locale}/path/guru-stotram/`,
    });
  }
  if (p.weekday === 5) {
    out.push({
      label: { hi: "शुक्रवार · महालक्ष्मी", en: "Friday · Mahalakshmi" },
      href: `/${locale}/path/mahalakshmi-ashtakam/`,
    });
  }
  if (p.weekday === 6) {
    out.push({
      label: { hi: "शनिवार · सुंदरकांड", en: "Saturday · Sundar Kand" },
      href: `/${locale}/path/sundar-kand/`,
    });
  }
  if (p.flags.pradosha) {
    out.push({
      label: { hi: "प्रदोष · रुद्राष्टकम्", en: "Pradosha · Rudrashtakam" },
      href: `/shiva/${locale}/path/rudrashtakam/`,
    });
  }
  if (p.flags.amavasya) {
    out.push({
      label: { hi: "अमावस्या · माँ का जप", en: "Amavasya · Mother’s japa" },
      href: `/kali/${locale}/japa/`,
    });
  }
  if (p.flags.ekadashi) {
    out.push({
      label: { hi: "एकादशी · गीता का एक अध्याय", en: "Ekadashi · one Gita chapter" },
      href: `/${locale}/path/bhagavad-gita/`,
    });
  }
  if (p.flags.purnima) {
    out.push({
      label: { hi: "पूर्णिमा · विष्णु नाम / गीता", en: "Purnima · Vishnu names / Gita" },
      href: `/${locale}/path/vishnu-sahasranama-selected/`,
    });
  }
  if (/Ganesh/i.test(fest)) {
    out.push({
      label: { hi: "गणेश चतुर्थी · पञ्चरत्न", en: "Ganesh Chaturthi · Pancharatnam" },
      href: `/${locale}/path/ganesha-pancharatnam/`,
    });
  }
  if (/Janmashtami/i.test(fest)) {
    out.push({
      label: { hi: "जन्माष्टमी · कृष्ण प्रार्थना", en: "Janmashtami · Krishna prayer" },
      href: `/${locale}/path/krishna-prarthana/`,
    });
  }
  if (/Navaratri|Dussehra/i.test(fest)) {
    out.push({
      label: { hi: "नवरात्रि · सप्तश्लोकी", en: "Navaratri · Saptashloki" },
      href: `/kali/${locale}/path/durga-saptashloki/`,
    });
  }
  if (/Deepavali|Lakshmi/i.test(fest)) {
    out.push({
      label: { hi: "दीपावली · महालक्ष्मी", en: "Deepavali · Mahalakshmi" },
      href: `/${locale}/path/mahalakshmi-ashtakam/`,
    });
  }
  if (/Shivaratri/i.test(fest)) {
    out.push({
      label: { hi: "शिवरात्रि · मानस पूजा", en: "Shivaratri · manasa puja" },
      href: `/shiva/${locale}/path/shiva-manasa-puja/`,
    });
  }
  if (!out.length) {
    out.push({
      label: { hi: "आज का पाठ · चालीसा", en: "Today’s path · Chalisa" },
      href: `/${locale}/path/hanuman-chalisa/`,
    });
  }
  return out;
}
