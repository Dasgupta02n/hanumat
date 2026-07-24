/**
 * Feature flags — env-overridable (NEXT_PUBLIC_FF_*) with design defaults.
 * Example: NEXT_PUBLIC_FF_TWIN_TEXT=0
 */
function envFlag(name: string, defaultValue: boolean): boolean {
  if (typeof process === "undefined") return defaultValue;
  const key = `NEXT_PUBLIC_${name.toUpperCase()}`;
  const v = process.env[key];
  if (v === undefined || v === "") return defaultValue;
  return !(v === "0" || v === "false" || v === "off");
}

export const flags = {
  ff_path_sundar_kand: envFlag("FF_PATH_SUNDAR_KAND", true),
  ff_living_chalisa: envFlag("FF_LIVING_CHALISA", true),
  ff_chalisa_offline_pack: envFlag("FF_CHALISA_OFFLINE_PACK", true),
  ff_offline_sk_packs: envFlag("FF_OFFLINE_SK_PACKS", true),
  ff_twin_text: envFlag("FF_TWIN_TEXT", true),
  ff_japa: envFlag("FF_JAPA", true),
  ff_parayan_planner: envFlag("FF_PARAYAN_PLANNER", true),
  ff_my_path_sync: envFlag("FF_MY_PATH_SYNC", false),
  ff_shravan_nav: envFlag("FF_SHRAVAN_NAV", true),
  ff_kids: envFlag("FF_KIDS", true),
  ff_listen_together: envFlag("FF_LISTEN_TOGETHER", false),
  ff_karaoke_chalisa: envFlag("FF_KARAOKE_CHALISA", true),
  ff_low_data: envFlag("FF_LOW_DATA", true),
  ff_verse_virtualization: envFlag("FF_VERSE_VIRTUALIZATION", true),
} as const;

export type FlagName = keyof typeof flags;
