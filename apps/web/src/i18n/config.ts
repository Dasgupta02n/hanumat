/** Product: Hindi + English only. English is the default entry locale. */
export const locales = ["en", "hi"] as const;

export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export function isLocale(v: string): v is Locale {
  return (locales as readonly string[]).includes(v);
}

/** No machine-assisted regional locales in v1 UI */
export const machineAssistedLocales: readonly Locale[] = [];
