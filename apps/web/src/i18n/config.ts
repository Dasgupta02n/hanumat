/** Product: Hindi + English only */
export const locales = ["hi", "en"] as const;

export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "hi";

export function isLocale(v: string): v is Locale {
  return (locales as readonly string[]).includes(v);
}

/** No machine-assisted regional locales in v1 UI */
export const machineAssistedLocales: readonly Locale[] = [];
