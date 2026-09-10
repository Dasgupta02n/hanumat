/**
 * Household muhurat windows — not a kundali or paid muhurat.
 * Day is split from approximate sunrise–sunset for the Indian belt (IST).
 * Local printed panjika wins.
 */

function dayOfYear(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  const utc = Date.UTC(y, m - 1, d);
  return Math.floor((utc - Date.UTC(y, 0, 1)) / 86400000) + 1;
}

/** Approximate sunrise hour (IST decimal) for ~23°N. */
export function indiaSunriseHour(iso: string): number {
  const rad = ((dayOfYear(iso) - 172) / 365) * 2 * Math.PI;
  return 6.15 - 0.7 * Math.cos(rad);
}

export function indiaSunsetHour(iso: string): number {
  const rise = indiaSunriseHour(iso);
  const rad = ((dayOfYear(iso) - 172) / 365) * 2 * Math.PI;
  const dayLen = 11.15 + 1.55 * Math.cos(rad);
  return rise + dayLen;
}

function fmt(hour: number): string {
  const h = ((hour % 24) + 24) % 24;
  const hh = Math.floor(h);
  const mm = Math.round((h - hh) * 60);
  const carry = mm === 60 ? 1 : 0;
  const m = mm === 60 ? 0 : mm;
  const H = (hh + carry) % 24;
  return `${String(H).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function slice(iso: string, index: number): { start: number; end: number } {
  const rise = indiaSunriseHour(iso);
  const set = indiaSunsetHour(iso);
  const part = (set - rise) / 8;
  return { start: rise + index * part, end: rise + (index + 1) * part };
}

/** Eighths of daytime: Sun 8, Mon 2, Tue 7, Wed 5, Thu 6, Fri 4, Sat 3 (1-based). */
const RAHU_EIGHTH = [7, 1, 6, 4, 5, 3, 2] as const;
const YAMA_EIGHTH = [3, 2, 1, 0, 6, 5, 4] as const;
const GULIKA_EIGHTH = [5, 4, 3, 2, 1, 0, 6] as const;

export type MuhuratWindow = {
  id: string;
  en: string;
  hi: string;
  start: string;
  end: string;
  kind: "avoid" | "favour";
  noteEn: string;
  noteHi: string;
};

export function householdMuhurat(iso: string, weekday: number): MuhuratWindow[] {
  const rise = indiaSunriseHour(iso);
  const set = indiaSunsetHour(iso);
  const noon = (rise + set) / 2;
  const abhijitHalf = (set - rise) / 30;
  const rahu = slice(iso, RAHU_EIGHTH[weekday]);
  const yama = slice(iso, YAMA_EIGHTH[weekday]);
  const gulika = slice(iso, GULIKA_EIGHTH[weekday]);
  return [
    {
      id: "brahma",
      en: "Brahma muhurat",
      hi: "ब्रह्म मुहूर्त",
      start: fmt(rise - 1.6),
      end: fmt(rise - 0.8),
      kind: "favour",
      noteEn: "Quiet japa before dawn. Household custom, not a priest booking.",
      noteHi: "प्रभात से पहले शांत जप। गृह रीति — पुरोहित बुकिंग नहीं।",
    },
    {
      id: "abhijit",
      en: "Abhijit muhurat",
      hi: "अभिजित् मुहूर्त",
      start: fmt(noon - abhijitHalf),
      end: fmt(noon + abhijitHalf),
      kind: "favour",
      noteEn: "Midday window used in many homes for a simple start.",
      noteHi: "मध्याह्न का गृह आरम्भ काल।",
    },
    {
      id: "rahu",
      en: "Rahu kalam",
      hi: "राहु काल",
      start: fmt(rahu.start),
      end: fmt(rahu.end),
      kind: "avoid",
      noteEn: "Many families pause new starts in this eighth of the day.",
      noteHi: "कई घर इस काल में नया काम नहीं शुरू करते।",
    },
    {
      id: "yama",
      en: "Yamaganda",
      hi: "यमगण्ड",
      start: fmt(yama.start),
      end: fmt(yama.end),
      kind: "avoid",
      noteEn: "Another weekday eighth some households skip for new work.",
      noteHi: "कुछ घर इस काल को भी छोड़ते हैं।",
    },
    {
      id: "gulika",
      en: "Gulikai / Gulika",
      hi: "गुलिक काल",
      start: fmt(gulika.start),
      end: fmt(gulika.end),
      kind: "avoid",
      noteEn: "South-Indian weekday eighth. Confirm a printed panjangam.",
      noteHi: "दक्षिण की गृह रीति। मुद्रित पञ्चाङ्ग देखें।",
    },
  ];
}
