/**
 * On-device meaning translation (Chrome / Edge Translator API).
 * No accounts, no ads, no verse sent to a server.
 * Mula stays in the original script; only the plain meaning is translated.
 */

export type TranslatorStatus =
  | "idle"
  | "packed"
  | "checking"
  | "downloadable"
  | "downloading"
  | "translating"
  | "ready"
  | "unavailable"
  | "unsupported";

export type LiveLang = { code: string; en: string; native: string };

/** Languages offered beyond Hindi/English. Availability is per device. */
export const LIVE_LANGS: LiveLang[] = [
  { code: "bn", en: "Bengali", native: "বাংলা" },
  { code: "ta", en: "Tamil", native: "தமிழ்" },
  { code: "te", en: "Telugu", native: "తెలుగు" },
  { code: "mr", en: "Marathi", native: "मराठी" },
  { code: "gu", en: "Gujarati", native: "ગુજરાતી" },
  { code: "kn", en: "Kannada", native: "ಕನ್ನಡ" },
  { code: "ml", en: "Malayalam", native: "മലയാളം" },
  { code: "pa", en: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { code: "or", en: "Odia", native: "ଓଡ଼ିଆ" },
  { code: "as", en: "Assamese", native: "অসমীয়া" },
  { code: "ur", en: "Urdu", native: "اردو" },
  { code: "ne", en: "Nepali", native: "नेपाली" },
  { code: "si", en: "Sinhala", native: "සිංහල" },
  { code: "es", en: "Spanish", native: "Español" },
  { code: "fr", en: "French", native: "Français" },
  { code: "de", en: "German", native: "Deutsch" },
  { code: "pt", en: "Portuguese", native: "Português" },
  { code: "it", en: "Italian", native: "Italiano" },
  { code: "ru", en: "Russian", native: "Русский" },
  { code: "ja", en: "Japanese", native: "日本語" },
  { code: "ko", en: "Korean", native: "한국어" },
  { code: "zh", en: "Chinese", native: "中文" },
  { code: "ar", en: "Arabic", native: "العربية" },
  { code: "id", en: "Indonesian", native: "Bahasa Indonesia" },
  { code: "th", en: "Thai", native: "ไทย" },
  { code: "vi", en: "Vietnamese", native: "Tiếng Việt" },
  { code: "tr", en: "Turkish", native: "Türkçe" },
  { code: "nl", en: "Dutch", native: "Nederlands" },
  { code: "pl", en: "Polish", native: "Polski" },
];

const INDIC = new Set([
  "bn",
  "ta",
  "te",
  "mr",
  "gu",
  "kn",
  "ml",
  "pa",
  "or",
  "as",
  "ur",
  "ne",
  "si",
  "hi",
]);

type Availability = "unavailable" | "downloadable" | "downloading" | "available";

type TranslatorInstance = {
  translate: (input: string) => Promise<string>;
  destroy?: () => void;
};

type TranslatorCtor = {
  availability: (opts: {
    sourceLanguage: string;
    targetLanguage: string;
  }) => Promise<Availability>;
  create: (opts: {
    sourceLanguage: string;
    targetLanguage: string;
    monitor?: (m: {
      addEventListener: (
        type: "downloadprogress",
        fn: (e: { loaded: number; total: number }) => void,
      ) => void;
    }) => void;
  }) => Promise<TranslatorInstance>;
};

function ctor(): TranslatorCtor | undefined {
  if (typeof globalThis === "undefined") return undefined;
  return (globalThis as { Translator?: TranslatorCtor }).Translator;
}

export function translatorSupported(): boolean {
  return typeof ctor()?.create === "function";
}

export function langLabel(code: string): string {
  if (code === "en") return "English";
  if (code === "hi") return "हिन्दी";
  const row = LIVE_LANGS.find((l) => l.code === code);
  return row ? `${row.native} · ${row.en}` : code;
}

export async function pairAvailability(
  target: string,
): Promise<{ source: string; availability: Availability } | null> {
  const api = ctor();
  if (!api?.availability) return null;
  const sources = INDIC.has(target) ? ["hi", "en"] : ["en", "hi"];
  for (const source of sources) {
    if (source === target) continue;
    try {
      const a = await api.availability({
        sourceLanguage: source,
        targetLanguage: target,
      });
      if (a && a !== "unavailable") return { source, availability: a };
    } catch {
      /* pair not offered */
    }
  }
  return null;
}

export async function createTranslator(
  source: string,
  target: string,
  onProgress?: (pct: number) => void,
): Promise<TranslatorInstance> {
  const api = ctor();
  if (!api) throw new Error("unsupported");
  return api.create({
    sourceLanguage: source,
    targetLanguage: target,
    monitor: onProgress
      ? (m) => {
          m.addEventListener("downloadprogress", (e) => {
            const total = e.total || 1;
            onProgress(Math.round((e.loaded / total) * 100));
          });
        }
      : undefined,
  });
}

const memory = new Map<string, string>();

export function cacheKey(textId: string, verseId: string, lang: string) {
  return `${textId}:${verseId}:${lang}`;
}

export function cachedMeaning(key: string): string | undefined {
  return memory.get(key);
}

export function storeMeaning(key: string, value: string) {
  memory.set(key, value);
}
