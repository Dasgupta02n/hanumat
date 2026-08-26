import type { TextPackage, Section, VerseUnit, AudioSegment } from "./content";

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
    audio?: Record<string, unknown>;
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

import mmjMeta from "../../../../content/texts/maha-mrityunjaya/meta.json";
import mmjStructure from "../../../../content/texts/maha-mrityunjaya/structure.json";
import mmjVerses from "../../../../content/texts/maha-mrityunjaya/verses.json";
import mmjHi from "../../../../content/texts/maha-mrityunjaya/translations/hi.json";
import mmjEn from "../../../../content/texts/maha-mrityunjaya/translations/en.json";
import mmjIast from "../../../../content/texts/maha-mrityunjaya/transliteration/iast.json";

import pnmMeta from "../../../../content/texts/om-namah-shivaya/meta.json";
import pnmStructure from "../../../../content/texts/om-namah-shivaya/structure.json";
import pnmVerses from "../../../../content/texts/om-namah-shivaya/verses.json";
import pnmHi from "../../../../content/texts/om-namah-shivaya/translations/hi.json";
import pnmEn from "../../../../content/texts/om-namah-shivaya/translations/en.json";
import pnmIast from "../../../../content/texts/om-namah-shivaya/transliteration/iast.json";

import lingMeta from "../../../../content/texts/lingashtakam/meta.json";
import lingStructure from "../../../../content/texts/lingashtakam/structure.json";
import lingVerses from "../../../../content/texts/lingashtakam/verses.json";
import lingHi from "../../../../content/texts/lingashtakam/translations/hi.json";
import lingEn from "../../../../content/texts/lingashtakam/translations/en.json";
import lingIast from "../../../../content/texts/lingashtakam/transliteration/iast.json";

import spsMeta from "../../../../content/texts/shiva-panchakshara-stotram/meta.json";
import spsStructure from "../../../../content/texts/shiva-panchakshara-stotram/structure.json";
import spsVerses from "../../../../content/texts/shiva-panchakshara-stotram/verses.json";
import spsHi from "../../../../content/texts/shiva-panchakshara-stotram/translations/hi.json";
import spsEn from "../../../../content/texts/shiva-panchakshara-stotram/translations/en.json";
import spsIast from "../../../../content/texts/shiva-panchakshara-stotram/transliteration/iast.json";

import rudraMeta from "../../../../content/texts/rudrashtakam/meta.json";
import rudraStructure from "../../../../content/texts/rudrashtakam/structure.json";
import rudraVerses from "../../../../content/texts/rudrashtakam/verses.json";
import rudraHi from "../../../../content/texts/rudrashtakam/translations/hi.json";
import rudraEn from "../../../../content/texts/rudrashtakam/translations/en.json";
import rudraIast from "../../../../content/texts/rudrashtakam/transliteration/iast.json";

import nsMeta from "../../../../content/texts/nirvana-shatkam/meta.json";
import nsStructure from "../../../../content/texts/nirvana-shatkam/structure.json";
import nsVerses from "../../../../content/texts/nirvana-shatkam/verses.json";
import nsHi from "../../../../content/texts/nirvana-shatkam/translations/hi.json";
import nsEn from "../../../../content/texts/nirvana-shatkam/translations/en.json";
import nsIast from "../../../../content/texts/nirvana-shatkam/transliteration/iast.json";

import kbaMeta from "../../../../content/texts/kalabhairava-ashtakam/meta.json";
import kbaStructure from "../../../../content/texts/kalabhairava-ashtakam/structure.json";
import kbaVerses from "../../../../content/texts/kalabhairava-ashtakam/verses.json";
import kbaHi from "../../../../content/texts/kalabhairava-ashtakam/translations/hi.json";
import kbaEn from "../../../../content/texts/kalabhairava-ashtakam/translations/en.json";
import kbaIast from "../../../../content/texts/kalabhairava-ashtakam/transliteration/iast.json";

import saMeta from "../../../../content/texts/shiv-aarti/meta.json";
import saStructure from "../../../../content/texts/shiv-aarti/structure.json";
import saVerses from "../../../../content/texts/shiv-aarti/verses.json";
import saHi from "../../../../content/texts/shiv-aarti/translations/hi.json";
import saEn from "../../../../content/texts/shiv-aarti/translations/en.json";
import saIast from "../../../../content/texts/shiv-aarti/transliteration/iast.json";

import dkmMeta from "../../../../content/texts/dakshina-kali-mantra/meta.json";
import dkmStructure from "../../../../content/texts/dakshina-kali-mantra/structure.json";
import dkmVerses from "../../../../content/texts/dakshina-kali-mantra/verses.json";
import dkmHi from "../../../../content/texts/dakshina-kali-mantra/translations/hi.json";
import dkmEn from "../../../../content/texts/dakshina-kali-mantra/translations/en.json";
import dkmIast from "../../../../content/texts/dakshina-kali-mantra/transliteration/iast.json";

import kaMeta from "../../../../content/texts/kalika-ashtakam/meta.json";
import kaStructure from "../../../../content/texts/kalika-ashtakam/structure.json";
import kaVerses from "../../../../content/texts/kalika-ashtakam/verses.json";
import kaHi from "../../../../content/texts/kalika-ashtakam/translations/hi.json";
import kaEn from "../../../../content/texts/kalika-ashtakam/translations/en.json";
import kaIast from "../../../../content/texts/kalika-ashtakam/transliteration/iast.json";

import adyaMeta from "../../../../content/texts/adya-stotram/meta.json";
import adyaStructure from "../../../../content/texts/adya-stotram/structure.json";
import adyaVerses from "../../../../content/texts/adya-stotram/verses.json";
import adyaHi from "../../../../content/texts/adya-stotram/translations/hi.json";
import adyaEn from "../../../../content/texts/adya-stotram/translations/en.json";
import adyaIast from "../../../../content/texts/adya-stotram/transliteration/iast.json";

import klaMeta from "../../../../content/texts/kali-aarti/meta.json";
import klaStructure from "../../../../content/texts/kali-aarti/structure.json";
import klaVerses from "../../../../content/texts/kali-aarti/verses.json";
import klaHi from "../../../../content/texts/kali-aarti/translations/hi.json";
import klaEn from "../../../../content/texts/kali-aarti/translations/en.json";
import klaIast from "../../../../content/texts/kali-aarti/transliteration/iast.json";

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

export const deityTexts: TextPackage[] = [
  P(mmjMeta, mmjStructure, mmjVerses, mmjHi, mmjEn, mmjIast),
  P(pnmMeta, pnmStructure, pnmVerses, pnmHi, pnmEn, pnmIast),
  P(lingMeta, lingStructure, lingVerses, lingHi, lingEn, lingIast),
  P(spsMeta, spsStructure, spsVerses, spsHi, spsEn, spsIast),
  P(rudraMeta, rudraStructure, rudraVerses, rudraHi, rudraEn, rudraIast),
  P(nsMeta, nsStructure, nsVerses, nsHi, nsEn, nsIast),
  P(kbaMeta, kbaStructure, kbaVerses, kbaHi, kbaEn, kbaIast),
  P(saMeta, saStructure, saVerses, saHi, saEn, saIast),
  P(dkmMeta, dkmStructure, dkmVerses, dkmHi, dkmEn, dkmIast),
  P(kaMeta, kaStructure, kaVerses, kaHi, kaEn, kaIast),
  P(adyaMeta, adyaStructure, adyaVerses, adyaHi, adyaEn, adyaIast),
  P(klaMeta, klaStructure, klaVerses, klaHi, klaEn, klaIast),
];
