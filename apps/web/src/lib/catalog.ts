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
import mmjMeta from "../../../../content/texts/maha-mrityunjaya/meta.json";
import pnmMeta from "../../../../content/texts/om-namah-shivaya/meta.json";
import lingMeta from "../../../../content/texts/lingashtakam/meta.json";
import spsMeta from "../../../../content/texts/shiva-panchakshara-stotram/meta.json";
import rudraMeta from "../../../../content/texts/rudrashtakam/meta.json";
import nsMeta from "../../../../content/texts/nirvana-shatkam/meta.json";
import kbaMeta from "../../../../content/texts/kalabhairava-ashtakam/meta.json";
import saMeta from "../../../../content/texts/shiv-aarti/meta.json";
import dkmMeta from "../../../../content/texts/dakshina-kali-mantra/meta.json";
import kaMeta from "../../../../content/texts/kalika-ashtakam/meta.json";
import adyaMeta from "../../../../content/texts/adya-stotram/meta.json";
import klaMeta from "../../../../content/texts/kali-aarti/meta.json";
import stMeta from "../../../../content/texts/shiva-tandava-stotram/meta.json";
import bilMeta from "../../../../content/texts/bilvashtakam/meta.json";
import ddMeta from "../../../../content/texts/daridraya-dahana-stotram/meta.json";
import jyMeta from "../../../../content/texts/jyotirlinga-stotra/meta.json";
import svMeta from "../../../../content/texts/somvar-vrat-katha/meta.json";
import kgMeta from "../../../../content/texts/kali-gayatri/meta.json";
import mkMeta from "../../../../content/texts/mahakali-stotra/meta.json";
import ksnMeta from "../../../../content/texts/kali-sahasranama-selected/meta.json";
import kabMeta from "../../../../content/texts/kali-aarti-bengal/meta.json";
import gitaMeta from "../../../../content/texts/bhagavad-gita/meta.json";
import gyMeta from "../../../../content/texts/gayatri-mantra/meta.json";
import ganeshMeta from "../../../../content/texts/ganesha-prarthana/meta.json";
import mlMeta from "../../../../content/texts/mahalakshmi-ashtakam/meta.json";
import saraMeta from "../../../../content/texts/saraswati-stotram/meta.json";
import guruMeta from "../../../../content/texts/guru-stotram/meta.json";
import acMeta from "../../../../content/texts/achyutashtakam/meta.json";
import smpMeta from "../../../../content/texts/shiva-manasa-puja/meta.json";
import dsMeta from "../../../../content/texts/durga-saptashloki/meta.json";
import vsMeta from "../../../../content/texts/vishnu-sahasranama-selected/meta.json";
import gpnMeta from "../../../../content/texts/ganesha-pancharatnam/meta.json";
import mdMeta from "../../../../content/texts/madhurashtakam/meta.json";
import amMeta from "../../../../content/texts/asato-ma/meta.json";
import kpMeta from "../../../../content/texts/krishna-prarthana/meta.json";

type MetaLite = {
  id: string;
  slug: string;
  deity?: string;
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
  mmjMeta as MetaLite,
  pnmMeta as MetaLite,
  lingMeta as MetaLite,
  spsMeta as MetaLite,
  rudraMeta as MetaLite,
  nsMeta as MetaLite,
  kbaMeta as MetaLite,
  saMeta as MetaLite,
  dkmMeta as MetaLite,
  kaMeta as MetaLite,
  adyaMeta as MetaLite,
  klaMeta as MetaLite,
  stMeta as MetaLite,
  bilMeta as MetaLite,
  ddMeta as MetaLite,
  jyMeta as MetaLite,
  svMeta as MetaLite,
  kgMeta as MetaLite,
  mkMeta as MetaLite,
  ksnMeta as MetaLite,
  kabMeta as MetaLite,
  gitaMeta as MetaLite,
  gyMeta as MetaLite,
  ganeshMeta as MetaLite,
  mlMeta as MetaLite,
  saraMeta as MetaLite,
  guruMeta as MetaLite,
  acMeta as MetaLite,
  smpMeta as MetaLite,
  dsMeta as MetaLite,
  vsMeta as MetaLite,
  gpnMeta as MetaLite,
  mdMeta as MetaLite,
  amMeta as MetaLite,
  kpMeta as MetaLite,
];

export type CatalogItem = {
  id: string;
  slug: string;
  deity: string;
  title: { hi: string; en: string };
  subtitle: { hi?: string; en?: string } | string;
  description: { hi?: string; en?: string } | string;
  category: string;
  wave: number;
  sectionCount: number;
  verseCount: number;
  badge?: string;
};

export function listCatalogLite(wave?: number, deity = "hanuman"): CatalogItem[] {
  return metas
    .filter((t) => {
      const d = t.deity || "hanuman";
      if (deity === "hanuman") return d === "hanuman" || d === "sarva";
      if (deity === "all") return true;
      return d === deity;
    })
    .filter((t) => wave === undefined || (t.wave ?? 0) === wave)
    .map((t) => ({
      id: t.id,
      slug: t.slug,
      deity: t.deity || "hanuman",
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
          : t.category === "gita"
            ? "Gita"
            : t.category === "kand" && (t.wave ?? 0) === 0
            ? "ध्वज"
            : (t.wave ?? 0) > 0
              ? `W${t.wave}`
              : undefined,
    }));
}
