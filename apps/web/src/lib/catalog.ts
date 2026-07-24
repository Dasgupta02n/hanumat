/**
 * Lightweight catalog for home/listing pages.
 * Does NOT import full verses/translations (avoids multi‑MB Valmiki bundle on home).
 */
import chalisaMeta from "../../../../content/texts/hanuman-chalisa/meta.json";
import skMeta from "../../../../content/texts/sundar-kand-manas/meta.json";
import baanMeta from "../../../../content/texts/bajrang-baan/meta.json";
import ashtakMeta from "../../../../content/texts/sankatmochan-ashtak/meta.json";
import aartiMeta from "../../../../content/texts/hanuman-aarti/meta.json";
import namesMeta from "../../../../content/texts/hanuman-108-names/meta.json";
import bahukMeta from "../../../../content/texts/hanuman-bahuk/meta.json";
import bhajanMeta from "../../../../content/texts/hanuman-bhajan-set/meta.json";
import marutiMeta from "../../../../content/texts/maruti-stotra/meta.json";
import kavachMeta from "../../../../content/texts/panchmukhi-kavach/meta.json";
import valMeta from "../../../../content/texts/valmiki-sundarakanda/meta.json";

type MetaLite = {
  id: string;
  slug: string;
  title: { hi: string; en: string };
  subtitle?: { hi?: string; en?: string } | string;
  description?: { hi?: string; en?: string } | string;
  category: string;
  wave?: number;
  stats?: { sectionCount?: number; verseCount?: number };
};

const metas: MetaLite[] = [
  chalisaMeta as MetaLite,
  skMeta as MetaLite,
  baanMeta as MetaLite,
  ashtakMeta as MetaLite,
  aartiMeta as MetaLite,
  namesMeta as MetaLite,
  bahukMeta as MetaLite,
  bhajanMeta as MetaLite,
  marutiMeta as MetaLite,
  kavachMeta as MetaLite,
  valMeta as MetaLite,
];

export type CatalogItem = {
  id: string;
  slug: string;
  title: { hi: string; en: string };
  subtitle: { hi?: string; en?: string } | string;
  description: { hi?: string; en?: string } | string;
  category: string;
  wave: number;
  sectionCount: number;
  verseCount: number;
  badge?: string;
};

export function listCatalogLite(wave?: number): CatalogItem[] {
  return metas
    .filter((t) => wave === undefined || (t.wave ?? 0) === wave)
    .map((t) => ({
      id: t.id,
      slug: t.slug,
      title: t.title,
      subtitle: t.subtitle || "",
      description: t.description || "",
      category: t.category,
      wave: t.wave ?? 0,
      sectionCount: t.stats?.sectionCount ?? 1,
      verseCount: t.stats?.verseCount ?? 0,
      badge:
        t.category === "chalisa"
          ? "Living"
          : t.category === "kand" && (t.wave ?? 0) === 0
            ? "ध्वज"
            : (t.wave ?? 0) > 0
              ? `W${t.wave}`
              : undefined,
    }));
}
