import { listCatalogLite, type CatalogItem } from "@/lib/catalog";
import { extrasFor } from "@/lib/mandir-extras";
import { getGallery } from "@/lib/gallery";
import { getTextBySlug } from "@/lib/content";
import { deities, deityHref, type DeityId, DEITY_IDS } from "@/lib/deities";
import { defaultLocale, type Locale } from "@/i18n/config";

const SKIP_VERSE_SLUGS = new Set(["valmiki-sundarakanda", "sundar-kand-manas"]);

export type SearchHit = {
  id: string;
  kind: "path" | "verse" | "temple" | "glossary" | "leela";
  deity: DeityId;
  href: string;
  title: string;
  titleHi: string;
  snippet: string;
  haystack: string;
};

function hay(...parts: (string | undefined | null)[]) {
  return parts
    .filter(Boolean)
    .join(" \n ")
    .toLowerCase()
    .normalize("NFKD");
}

function build(): SearchHit[] {
  const hits: SearchHit[] = [];
  for (const deity of DEITY_IDS) {
    const catalog: CatalogItem[] = listCatalogLite(undefined, deity);
    const extras = extrasFor(deity, defaultLocale);
    const gallery = getGallery(deity);

    for (const p of catalog) {
      hits.push({
        id: `path:${p.id}`,
        kind: "path",
        deity,
        href: deityHref(deity, defaultLocale, `/path/${p.slug}/`),
        title: p.title.en,
        titleHi: p.title.hi,
        snippet: typeof p.description === "string" ? p.description : p.description.en || "",
        haystack: hay(p.title.hi, p.title.en, p.slug, p.category, String(p.subtitle || "")),
      });

      if (SKIP_VERSE_SLUGS.has(p.slug) || p.verseCount > 80) continue;
      const pack = getTextBySlug(p.slug);
      if (!pack) continue;
      for (const v of pack.verses) {
        hits.push({
          id: `verse:${p.id}:${v.id}`,
          kind: "verse",
          deity,
          href: `${deityHref(deity, defaultLocale, `/path/${p.slug}/`)}?verse=${v.id}`,
          title: p.title.en,
          titleHi: p.title.hi,
          snippet: v.text.slice(0, 80),
          haystack: hay(v.text, v.iast, v.meaningHi, v.meaningEn, v.id),
        });
      }
    }

    for (const tm of extras.temples) {
      hits.push({
        id: `temple:${deity}:${tm.id}`,
        kind: "temple",
        deity,
        href: deityHref(deity, defaultLocale, "/temples/"),
        title: tm.name.en,
        titleHi: tm.name.hi,
        snippet: tm.region,
        haystack: hay(tm.name.hi, tm.name.en, tm.region, tm.note.hi, tm.note.en),
      });
    }

    for (const g of extras.glossary) {
      hits.push({
        id: `gloss:${deity}:${g.term}`,
        kind: "glossary",
        deity,
        href: deityHref(deity, defaultLocale, "/glossary/"),
        title: g.term,
        titleHi: g.hi,
        snippet: g.body.en,
        haystack: hay(g.term, g.hi, g.body.hi, g.body.en),
      });
    }

    for (const img of gallery.images) {
      hits.push({
        id: `leela:${deity}:${img.id}`,
        kind: "leela",
        deity,
        href: deityHref(deity, defaultLocale, `/gallery/${img.id}/`),
        title: img.scene.en,
        titleHi: img.scene.hi,
        snippet: img.style,
        haystack: hay(img.scene.hi, img.scene.en, img.style, img.leela, img.id),
      });
    }
  }
  return hits;
}

let CACHE: SearchHit[] | null = null;

export function searchIndex(): SearchHit[] {
  if (!CACHE) CACHE = build();
  return CACHE;
}

export function searchSite(
  query: string,
  opts?: { deity?: DeityId; locale?: Locale; limit?: number },
): SearchHit[] {
  const q = query.trim().toLowerCase().normalize("NFKD");
  if (q.length < 2) return [];
  const locale = opts?.locale || defaultLocale;
  const limit = opts?.limit ?? 24;
  const out: SearchHit[] = [];
  for (const hit of searchIndex()) {
    if (opts?.deity && hit.deity !== opts.deity) continue;
    if (!hit.haystack.includes(q)) continue;
    const href =
      locale === defaultLocale
        ? hit.href
        : hit.href.replace(`/${defaultLocale}/`, `/${locale}/`);
    out.push({ ...hit, href });
    if (out.length >= limit) break;
  }
  return out;
}

export function deityLabel(id: DeityId, locale: Locale) {
  return locale === "en" ? deities[id].brand.en : deities[id].brand.hi;
}
