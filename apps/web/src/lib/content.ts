import chalisaMeta from "../../../../content/texts/hanuman-chalisa/meta.json";
import chalisaStructure from "../../../../content/texts/hanuman-chalisa/structure.json";
import chalisaVerses from "../../../../content/texts/hanuman-chalisa/verses.json";
import chalisaHi from "../../../../content/texts/hanuman-chalisa/translations/hi.json";
import chalisaEn from "../../../../content/texts/hanuman-chalisa/translations/en.json";
import chalisaIast from "../../../../content/texts/hanuman-chalisa/transliteration/iast.json";

import skMeta from "../../../../content/texts/sundar-kand-manas/meta.json";
import skStructure from "../../../../content/texts/sundar-kand-manas/structure.json";
import skVerses from "../../../../content/texts/sundar-kand-manas/verses.json";
import skHi from "../../../../content/texts/sundar-kand-manas/translations/hi.json";
import skEn from "../../../../content/texts/sundar-kand-manas/translations/en.json";
import skIast from "../../../../content/texts/sundar-kand-manas/transliteration/iast.json";

import baanMeta from "../../../../content/texts/bajrang-baan/meta.json";
import baanStructure from "../../../../content/texts/bajrang-baan/structure.json";
import baanVerses from "../../../../content/texts/bajrang-baan/verses.json";
import baanHi from "../../../../content/texts/bajrang-baan/translations/hi.json";
import baanEn from "../../../../content/texts/bajrang-baan/translations/en.json";
import baanIast from "../../../../content/texts/bajrang-baan/transliteration/iast.json";

import ashtakMeta from "../../../../content/texts/sankatmochan-ashtak/meta.json";
import ashtakStructure from "../../../../content/texts/sankatmochan-ashtak/structure.json";
import ashtakVerses from "../../../../content/texts/sankatmochan-ashtak/verses.json";
import ashtakHi from "../../../../content/texts/sankatmochan-ashtak/translations/hi.json";
import ashtakEn from "../../../../content/texts/sankatmochan-ashtak/translations/en.json";
import ashtakIast from "../../../../content/texts/sankatmochan-ashtak/transliteration/iast.json";

import aartiMeta from "../../../../content/texts/hanuman-aarti/meta.json";
import aartiStructure from "../../../../content/texts/hanuman-aarti/structure.json";
import aartiVerses from "../../../../content/texts/hanuman-aarti/verses.json";
import aartiHi from "../../../../content/texts/hanuman-aarti/translations/hi.json";
import aartiEn from "../../../../content/texts/hanuman-aarti/translations/en.json";
import aartiIast from "../../../../content/texts/hanuman-aarti/transliteration/iast.json";

import n108Meta from "../../../../content/texts/hanuman-108-names/meta.json";
import n108Structure from "../../../../content/texts/hanuman-108-names/structure.json";
import n108Verses from "../../../../content/texts/hanuman-108-names/verses.json";
import n108Hi from "../../../../content/texts/hanuman-108-names/translations/hi.json";
import n108En from "../../../../content/texts/hanuman-108-names/translations/en.json";
import n108Iast from "../../../../content/texts/hanuman-108-names/transliteration/iast.json";

import bahukMeta from "../../../../content/texts/hanuman-bahuk/meta.json";
import bahukStructure from "../../../../content/texts/hanuman-bahuk/structure.json";
import bahukVerses from "../../../../content/texts/hanuman-bahuk/verses.json";
import bahukHi from "../../../../content/texts/hanuman-bahuk/translations/hi.json";
import bahukEn from "../../../../content/texts/hanuman-bahuk/translations/en.json";
import bahukIast from "../../../../content/texts/hanuman-bahuk/transliteration/iast.json";

import kavMeta from "../../../../content/texts/panchmukhi-kavach/meta.json";
import kavStructure from "../../../../content/texts/panchmukhi-kavach/structure.json";
import kavVerses from "../../../../content/texts/panchmukhi-kavach/verses.json";
import kavHi from "../../../../content/texts/panchmukhi-kavach/translations/hi.json";
import kavEn from "../../../../content/texts/panchmukhi-kavach/translations/en.json";
import kavIast from "../../../../content/texts/panchmukhi-kavach/transliteration/iast.json";

import marMeta from "../../../../content/texts/maruti-stotra/meta.json";
import marStructure from "../../../../content/texts/maruti-stotra/structure.json";
import marVerses from "../../../../content/texts/maruti-stotra/verses.json";
import marHi from "../../../../content/texts/maruti-stotra/translations/hi.json";
import marEn from "../../../../content/texts/maruti-stotra/translations/en.json";
import marIast from "../../../../content/texts/maruti-stotra/transliteration/iast.json";

import valMeta from "../../../../content/texts/valmiki-sundarakanda/meta.json";
import valStructure from "../../../../content/texts/valmiki-sundarakanda/structure.json";
import valVerses from "../../../../content/texts/valmiki-sundarakanda/verses.json";
import valHi from "../../../../content/texts/valmiki-sundarakanda/translations/hi.json";
import valEn from "../../../../content/texts/valmiki-sundarakanda/translations/en.json";
import valIast from "../../../../content/texts/valmiki-sundarakanda/transliteration/iast.json";

import bhajanMeta from "../../../../content/texts/hanuman-bhajan-set/meta.json";
import bhajanStructure from "../../../../content/texts/hanuman-bhajan-set/structure.json";
import bhajanVerses from "../../../../content/texts/hanuman-bhajan-set/verses.json";
import bhajanHi from "../../../../content/texts/hanuman-bhajan-set/translations/hi.json";
import bhajanEn from "../../../../content/texts/hanuman-bhajan-set/translations/en.json";
import bhajanIast from "../../../../content/texts/hanuman-bhajan-set/transliteration/iast.json";

import kathaData from "../../../../content/katha/stories.json";
import templesData from "../../../../content/places/temples.json";
import jayantiData from "../../../../content/calendar/jayanti.json";
import skPacks from "../../../../content/packs/sk-section-packs.json";
import twinAlign from "../../../../content/texts/twin-text-sk-align.json";
import chalisaPack from "../../../../content/packs/pack-chalisa-v1.json";

export type Section = {
  id: string;
  kind: string;
  title: { hi: string; en: string };
  verseIds: string[];
  order: number;
};

export type VerseUnit = {
  id: string;
  kind: string;
  text: string;
  sectionId: string;
  meaningHi: string;
  meaningEn: string;
  /** All locale meanings including hi/en and MT drafts */
  meanings: Record<string, string>;
  iast?: string;
};

export type AudioSegment = {
  id: string;
  sectionId: string;
  src: string;
  cueMapSrc: string;
  durationMs: number;
  /** Legacy per-segment low-data URL; prefer top-level audio.lowDataSegments */
  lowDataSrc?: string;
};

export type TextPackage = {
  id: string;
  slug: string;
  title: { hi: string; en: string };
  subtitle: { hi?: string; en?: string } | string;
  description: { hi: string; en: string } | string;
  category: string;
  wave: number;
  edition: { pin: string; notes?: string; publisher?: string };
  flags: Record<string, boolean | undefined>;
  sections: Section[];
  verses: VerseUnit[];
  audio?: {
    src?: string;
    lowDataSrc?: string;
    cueMapSrc?: string;
    segments?: AudioSegment[];
    /**
     * Parallel low-data track list: same length/order/sectionId as segments.
     * Each entry uses low-bitrate src; cueMapSrc/durationMs match the default segment.
     */
    lowDataSegments?: AudioSegment[];
    credits?: string;
    ttsGenerated?: boolean;
  };
  twinText?: unknown;
};

type LocMap = Record<string, string>;

function pack(
  meta: {
    id: string;
    slug: string;
    title: { hi: string; en: string };
    subtitle?: { hi?: string; en?: string } | string;
    description?: { hi: string; en: string } | string;
    category: string;
    wave?: number;
    edition: { pin: string; notes?: string; publisher?: string };
    flags: Record<string, boolean | undefined>;
    audio?: Record<string, unknown>;
    twinText?: unknown;
  },
  structure: { sections: Section[] },
  versesMap: Record<
    string,
    { id: string; kind: string; text: string; sectionId: string }
  >,
  bundles: Record<string, LocMap>,
  iast: LocMap = {},
): TextPackage {
  const sections = [...structure.sections].sort((a, b) => a.order - b.order);
  const verses: VerseUnit[] = [];
  for (const s of sections) {
    for (const vid of s.verseIds) {
      const v = versesMap[vid];
      if (!v) continue;
      const meanings: Record<string, string> = {};
      for (const [loc, map] of Object.entries(bundles)) {
        if (map[vid]) meanings[loc] = map[vid];
      }
      verses.push({
        id: v.id,
        kind: v.kind,
        text: v.text,
        sectionId: v.sectionId,
        meaningHi: bundles.hi?.[vid] || "",
        meaningEn: bundles.en?.[vid] || "",
        meanings,
        iast: iast[vid],
      });
    }
  }
  const audioMeta = meta.audio || {};
  return {
    id: meta.id,
    slug: meta.slug,
    title: meta.title,
    subtitle: meta.subtitle || "",
    description: meta.description || "",
    category: meta.category,
    wave: meta.wave ?? 0,
    edition: meta.edition,
    flags: meta.flags,
    sections,
    verses,
    twinText: meta.twinText,
    audio: {
      src: audioMeta.src as string | undefined,
      lowDataSrc: audioMeta.lowDataSrc as string | undefined,
      cueMapSrc: audioMeta.cueMapSrc as string | undefined,
      segments: (audioMeta.segments as AudioSegment[]) || undefined,
      lowDataSegments:
        (audioMeta.lowDataSegments as AudioSegment[]) || undefined,
      credits: audioMeta.credits as string | undefined,
      ttsGenerated: meta.flags.ttsGenerated,
    },
  };
}

function L(hi: LocMap, en: LocMap) {
  return { hi, en };
}

export const allTexts: TextPackage[] = [
  pack(
    chalisaMeta as never,
    chalisaStructure as never,
    chalisaVerses as never,
    L(
      chalisaHi as never,
      chalisaEn as never,
    ),
    chalisaIast as never,
  ),
  pack(
    skMeta as never,
    skStructure as never,
    skVerses as never,
    L(
      skHi as never,
      skEn as never,
    ),
    skIast as never,
  ),
  pack(
    baanMeta as never,
    baanStructure as never,
    baanVerses as never,
    L(
      baanHi as never,
      baanEn as never,
    ),
    baanIast as never,
  ),
  pack(
    ashtakMeta as never,
    ashtakStructure as never,
    ashtakVerses as never,
    L(
      ashtakHi as never,
      ashtakEn as never,
    ),
    ashtakIast as never,
  ),
  pack(
    aartiMeta as never,
    aartiStructure as never,
    aartiVerses as never,
    L(
      aartiHi as never,
      aartiEn as never,
    ),
    aartiIast as never,
  ),
  pack(
    n108Meta as never,
    n108Structure as never,
    n108Verses as never,
    L(
      n108Hi as never,
      n108En as never,
    ),
    n108Iast as never,
  ),
  pack(
    bahukMeta as never,
    bahukStructure as never,
    bahukVerses as never,
    L(
      bahukHi as never,
      bahukEn as never,
    ),
    bahukIast as never,
  ),
  pack(
    kavMeta as never,
    kavStructure as never,
    kavVerses as never,
    L(
      kavHi as never,
      kavEn as never,
    ),
    kavIast as never,
  ),
  pack(
    marMeta as never,
    marStructure as never,
    marVerses as never,
    L(
      marHi as never,
      marEn as never,
    ),
    marIast as never,
  ),
  pack(
    valMeta as never,
    valStructure as never,
    valVerses as never,
    L(
      valHi as never,
      valEn as never,
    ),
    valIast as never,
  ),
  pack(
    bhajanMeta as never,
    bhajanStructure as never,
    bhajanVerses as never,
    L(
      bhajanHi as never,
      bhajanEn as never,
    ),
    bhajanIast as never,
  ),
];

export const wave0Texts = allTexts.filter((t) => t.wave === 0);

export function getTextBySlug(slug: string): TextPackage | undefined {
  return allTexts.find((t) => t.slug === slug);
}

export function listCatalog(wave?: number) {
  return allTexts
    .filter((t) => wave === undefined || t.wave === wave)
    .map((t) => ({
      id: t.id,
      slug: t.slug,
      title: t.title,
      subtitle: t.subtitle,
      description: t.description,
      category: t.category,
      wave: t.wave,
      sectionCount: t.sections.length,
      verseCount: t.verses.length,
      badge:
        t.category === "chalisa"
          ? "Living"
          : t.category === "kand" && t.wave === 0
            ? "ध्वज"
            : t.wave > 0
              ? `W${t.wave}`
              : undefined,
    }));
}

export function listWave0Catalog() {
  return listCatalog(0);
}

export const kathaStories = kathaData.stories;
export const temples = templesData.temples;
export const jayantiTraditions = jayantiData.traditions;
export const skOfflinePacks = skPacks.packs;
export const twinTextAlign = twinAlign;
export const chalisaOfflinePack = chalisaPack;

export function meaningFor(v: VerseUnit, locale: string): string {
  return (
    v.meanings[locale] ||
    v.meanings.en ||
    v.meanings.hi ||
    v.meaningEn ||
    v.meaningHi ||
    ""
  );
}
