/** Lightweight client-safe SK offline pack index (Wave 1). */
import skPacks from "../../../../content/packs/sk-section-packs.json";

export type SkPack = {
  id: string;
  textId: string;
  sectionId: string;
  version: number;
  maxBytes: number;
  assets: { path: string; role: string }[];
};

export const skOfflinePacks = skPacks.packs as SkPack[];
