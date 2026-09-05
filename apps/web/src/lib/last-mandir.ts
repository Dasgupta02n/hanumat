import type { DeityId } from "@/lib/deities";
import { isDeityId } from "@/lib/deities";

export const LAST_MANDIR_KEY = "hanumat:last-mandir";

export function saveLastMandir(id: DeityId) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LAST_MANDIR_KEY, id);
  } catch {
    /* ignore */
  }
}

export function loadLastMandir(): DeityId | null {
  if (typeof window === "undefined") return null;
  try {
    const v = localStorage.getItem(LAST_MANDIR_KEY);
    return v && isDeityId(v) ? v : null;
  } catch {
    return null;
  }
}
