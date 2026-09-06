import type { TextPackage, Section, VerseUnit } from "./content";

type LocMap = Record<string, string>;

function L(hi: LocMap, en: LocMap) {
  return { hi, en };
}

function pack(
  meta: {
    id: string;
    slug: string;
    deity?: string;
    title: { hi: string; en: string };
    subtitle?: { hi?: string; en?: string } | string;
    description?: { hi: string; en: string } | string;
    category: string;
    wave?: number;
    edition: { pin: string; notes?: string; publisher?: string };
    flags: Record<string, boolean | undefined>;
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
  return {
    id: meta.id,
    slug: meta.slug,
    deity: meta.deity,
    title: meta.title,
    subtitle: meta.subtitle || "",
    description: meta.description || "",
    category: meta.category,
    wave: meta.wave ?? 0,
    edition: meta.edition,
    flags: meta.flags,
    sections,
    verses,
  };
}

import gitaMeta from "../../../../content/texts/bhagavad-gita/meta.json";
import gitaStructure from "../../../../content/texts/bhagavad-gita/structure.json";
import gitaVerses from "../../../../content/texts/bhagavad-gita/verses.json";
import gitaHi from "../../../../content/texts/bhagavad-gita/translations/hi.json";
import gitaEn from "../../../../content/texts/bhagavad-gita/translations/en.json";
import gitaIast from "../../../../content/texts/bhagavad-gita/transliteration/iast.json";

import gyMeta from "../../../../content/texts/gayatri-mantra/meta.json";
import gyStructure from "../../../../content/texts/gayatri-mantra/structure.json";
import gyVerses from "../../../../content/texts/gayatri-mantra/verses.json";
import gyHi from "../../../../content/texts/gayatri-mantra/translations/hi.json";
import gyEn from "../../../../content/texts/gayatri-mantra/translations/en.json";
import gyIast from "../../../../content/texts/gayatri-mantra/transliteration/iast.json";

import gpMeta from "../../../../content/texts/ganesha-prarthana/meta.json";
import gpStructure from "../../../../content/texts/ganesha-prarthana/structure.json";
import gpVerses from "../../../../content/texts/ganesha-prarthana/verses.json";
import gpHi from "../../../../content/texts/ganesha-prarthana/translations/hi.json";
import gpEn from "../../../../content/texts/ganesha-prarthana/translations/en.json";
import gpIast from "../../../../content/texts/ganesha-prarthana/transliteration/iast.json";

import mlMeta from "../../../../content/texts/mahalakshmi-ashtakam/meta.json";
import mlStructure from "../../../../content/texts/mahalakshmi-ashtakam/structure.json";
import mlVerses from "../../../../content/texts/mahalakshmi-ashtakam/verses.json";
import mlHi from "../../../../content/texts/mahalakshmi-ashtakam/translations/hi.json";
import mlEn from "../../../../content/texts/mahalakshmi-ashtakam/translations/en.json";
import mlIast from "../../../../content/texts/mahalakshmi-ashtakam/transliteration/iast.json";

import ssMeta from "../../../../content/texts/saraswati-stotram/meta.json";
import ssStructure from "../../../../content/texts/saraswati-stotram/structure.json";
import ssVerses from "../../../../content/texts/saraswati-stotram/verses.json";
import ssHi from "../../../../content/texts/saraswati-stotram/translations/hi.json";
import ssEn from "../../../../content/texts/saraswati-stotram/translations/en.json";
import ssIast from "../../../../content/texts/saraswati-stotram/transliteration/iast.json";

import gsMeta from "../../../../content/texts/guru-stotram/meta.json";
import gsStructure from "../../../../content/texts/guru-stotram/structure.json";
import gsVerses from "../../../../content/texts/guru-stotram/verses.json";
import gsHi from "../../../../content/texts/guru-stotram/translations/hi.json";
import gsEn from "../../../../content/texts/guru-stotram/translations/en.json";
import gsIast from "../../../../content/texts/guru-stotram/transliteration/iast.json";

import acMeta from "../../../../content/texts/achyutashtakam/meta.json";
import acStructure from "../../../../content/texts/achyutashtakam/structure.json";
import acVerses from "../../../../content/texts/achyutashtakam/verses.json";
import acHi from "../../../../content/texts/achyutashtakam/translations/hi.json";
import acEn from "../../../../content/texts/achyutashtakam/translations/en.json";
import acIast from "../../../../content/texts/achyutashtakam/transliteration/iast.json";

import vsMeta from "../../../../content/texts/vishnu-sahasranama-selected/meta.json";
import vsStructure from "../../../../content/texts/vishnu-sahasranama-selected/structure.json";
import vsVerses from "../../../../content/texts/vishnu-sahasranama-selected/verses.json";
import vsHi from "../../../../content/texts/vishnu-sahasranama-selected/translations/hi.json";
import vsEn from "../../../../content/texts/vishnu-sahasranama-selected/translations/en.json";
import vsIast from "../../../../content/texts/vishnu-sahasranama-selected/transliteration/iast.json";

import gpnMeta from "../../../../content/texts/ganesha-pancharatnam/meta.json";
import gpnStructure from "../../../../content/texts/ganesha-pancharatnam/structure.json";
import gpnVerses from "../../../../content/texts/ganesha-pancharatnam/verses.json";
import gpnHi from "../../../../content/texts/ganesha-pancharatnam/translations/hi.json";
import gpnEn from "../../../../content/texts/ganesha-pancharatnam/translations/en.json";
import gpnIast from "../../../../content/texts/ganesha-pancharatnam/transliteration/iast.json";

import mdMeta from "../../../../content/texts/madhurashtakam/meta.json";
import mdStructure from "../../../../content/texts/madhurashtakam/structure.json";
import mdVerses from "../../../../content/texts/madhurashtakam/verses.json";
import mdHi from "../../../../content/texts/madhurashtakam/translations/hi.json";
import mdEn from "../../../../content/texts/madhurashtakam/translations/en.json";
import mdIast from "../../../../content/texts/madhurashtakam/transliteration/iast.json";

import amMeta from "../../../../content/texts/asato-ma/meta.json";
import amStructure from "../../../../content/texts/asato-ma/structure.json";
import amVerses from "../../../../content/texts/asato-ma/verses.json";
import amHi from "../../../../content/texts/asato-ma/translations/hi.json";
import amEn from "../../../../content/texts/asato-ma/translations/en.json";
import amIast from "../../../../content/texts/asato-ma/transliteration/iast.json";

import kpMeta from "../../../../content/texts/krishna-prarthana/meta.json";
import kpStructure from "../../../../content/texts/krishna-prarthana/structure.json";
import kpVerses from "../../../../content/texts/krishna-prarthana/verses.json";
import kpHi from "../../../../content/texts/krishna-prarthana/translations/hi.json";
import kpEn from "../../../../content/texts/krishna-prarthana/translations/en.json";
import kpIast from "../../../../content/texts/krishna-prarthana/transliteration/iast.json";

function P(
  meta: object,
  structure: object,
  verses: object,
  hi: object,
  en: object,
  iast: object,
): TextPackage {
  return pack(
    meta as never,
    structure as never,
    verses as never,
    L(hi as never, en as never),
    iast as never,
  );
}

export const sarvaTexts: TextPackage[] = [
  P(gitaMeta, gitaStructure, gitaVerses, gitaHi, gitaEn, gitaIast),
  P(gyMeta, gyStructure, gyVerses, gyHi, gyEn, gyIast),
  P(gpMeta, gpStructure, gpVerses, gpHi, gpEn, gpIast),
  P(mlMeta, mlStructure, mlVerses, mlHi, mlEn, mlIast),
  P(ssMeta, ssStructure, ssVerses, ssHi, ssEn, ssIast),
  P(gsMeta, gsStructure, gsVerses, gsHi, gsEn, gsIast),
  P(acMeta, acStructure, acVerses, acHi, acEn, acIast),
  P(vsMeta, vsStructure, vsVerses, vsHi, vsEn, vsIast),
  P(gpnMeta, gpnStructure, gpnVerses, gpnHi, gpnEn, gpnIast),
  P(mdMeta, mdStructure, mdVerses, mdHi, mdEn, mdIast),
  P(amMeta, amStructure, amVerses, amHi, amEn, amIast),
  P(kpMeta, kpStructure, kpVerses, kpHi, kpEn, kpIast),
];
