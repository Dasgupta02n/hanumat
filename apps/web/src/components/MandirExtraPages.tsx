import Image from "next/image";
import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { extrasFor, type ExtraKind } from "@/lib/mandir-extras";
import { deityHref, deities, type DeityId } from "@/lib/deities";
import { galleryPick } from "@/lib/gallery";
import { getTextBySlug } from "@/lib/content";
import { listCatalogLite } from "@/lib/catalog";
import type { Locale } from "@/i18n/config";
import { SiteSearch } from "@/components/SiteSearch";

function chunk<T>(items: T[], days: number): T[][] {
  if (days <= 1) return [items];
  const size = Math.max(1, Math.ceil(items.length / days));
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

export function MandirExtraPage({
  deity,
  kind,
  locale,
}: {
  deity: DeityId;
  kind: ExtraKind;
  locale: Locale;
}) {
  const en = locale === "en";
  const x = extrasFor(deity, locale);
  const d = deities[deity];
  const h = (p: string) => deityHref(deity, locale, p);
  const t = (hi: string, eng: string) => (en ? eng : hi);

  const titles: Record<ExtraKind, { hi: string; en: string }> = {
    calendar: { hi: "कैलेंडर", en: "Calendar" },
    parayan: { hi: "पारायण", en: "Parayan" },
    katha: { hi: "कथा", en: "Katha" },
    temples: { hi: "क्षेत्र / मंदिर", en: "Kshetras / temples" },
    glossary: { hi: "शब्दकोश", en: "Glossary" },
    kids: { hi: "बाल मार्ग", en: "Kids path" },
    radio: { hi: "श्रवण सूची", en: "Listen list" },
    sankat: { hi: "सङ्कट पाठ", en: "In distress" },
    search: { hi: "खोज", en: "Search" },
  };

  return (
    <SiteShell wide>
      <div className="shell section-pad">
        <p className="section-kicker">{en ? d.eyebrow.en : d.eyebrow.hi}</p>
        <h1 className="section-title mt-2 text-4xl">{t(titles[kind].hi, titles[kind].en)}</h1>

        {kind === "search" && (
          <div className="mt-8">
            <SiteSearch deity={deity} locale={locale} />
          </div>
        )}

        {kind === "calendar" && (
          <div className="pillar-grid mt-10">
            {x.calendar.map((c) => (
              <article key={c.id} className="temple-card temple-card-frame p-6">
                <h2 className="section-title text-2xl">{t(c.title.hi, c.title.en)}</h2>
                <p className="mt-2 text-sm" style={{ color: "var(--hanumat-stone)" }}>
                  {t(c.body.hi, c.body.en)}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {c.links.map((l) => (
                    <Link key={l.href} href={l.href} className="btn-ghost !px-3 !py-1.5 text-xs">
                      {t(l.label.hi, l.label.en)}
                    </Link>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}

        {kind === "temples" && (
          <ul className="pillar-grid mt-10">
            {x.temples.map((tm) => (
              <li key={tm.id} className="temple-card temple-card-frame p-5">
                <h2 className="section-title text-xl">{t(tm.name.hi, tm.name.en)}</h2>
                <p className="section-kicker mt-2 text-[10px]">{tm.region}</p>
                <p className="mt-2 text-sm" style={{ color: "var(--hanumat-stone)" }}>
                  {t(tm.note.hi, tm.note.en)}
                </p>
              </li>
            ))}
          </ul>
        )}

        {kind === "glossary" && (
          <ul className="mt-10 space-y-3">
            {x.glossary.map((g) => (
              <li key={g.term} className="temple-card p-5">
                <h2 className="font-serif text-lg">
                  {g.term} · <span lang="hi">{g.hi}</span>
                </h2>
                <p className="mt-1 text-sm" style={{ color: "var(--hanumat-stone)" }}>
                  {t(g.body.hi, g.body.en)}
                </p>
              </li>
            ))}
          </ul>
        )}

        {kind === "katha" && (
          <div className="pillar-grid mt-10">
            {x.katha.map((k) => (
              <article key={k.id} className="temple-card temple-card-frame overflow-hidden">
                <div className="relative h-40">
                  <Image
                    src={galleryPick(deity, k.galleryIndex)}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="50vw"
                  />
                </div>
                <div className="p-5">
                  <h2 className="section-title text-xl">{t(k.title.hi, k.title.en)}</h2>
                  <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--hanumat-stone)" }}>
                    {t(k.body.hi, k.body.en)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}

        {kind === "kids" && (
          <div className="mt-10 space-y-4">
            {x.kids.map((k) => (
              <article key={k.id} className="temple-card p-6">
                <h2 className="section-title text-xl">{t(k.title.hi, k.title.en)}</h2>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--hanumat-stone)" }}>
                  {t(k.body.hi, k.body.en)}
                </p>
              </article>
            ))}
          </div>
        )}

        {kind === "sankat" && (
          <div className="mt-8">
            <p className="max-w-xl text-sm" style={{ color: "var(--hanumat-stone)" }}>
              {t(x.sankat.intro.hi, x.sankat.intro.en)}
            </p>
            <ul className="mt-6 space-y-3">
              {x.sankat.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="temple-card temple-card-frame flex items-center justify-between px-5 py-4">
                    <span className="font-serif text-lg">{t(l.label.hi, l.label.en)}</span>
                    <span style={{ color: "var(--hanumat-gold-deep)" }}>→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {kind === "radio" && (
          <div className="mt-8">
            <p className="max-w-xl text-sm" style={{ color: "var(--hanumat-stone)" }}>
              {t(x.radioNote.hi, x.radioNote.en)}
            </p>
            <Link href={h("/listen/")} className="btn-gold mt-6 inline-flex">
              {en ? "Open Listen" : "श्रवण खोलें"}
            </Link>
          </div>
        )}

        {kind === "parayan" && (
          <div className="mt-10 space-y-12">
            {x.parayanSlugs.map((slug) => {
              const text = getTextBySlug(slug);
              if (!text) return null;
              const sections = text.sections || [];
              const plans = [7, 9, 21, 40];
              return (
                <section key={slug}>
                  <h2 className="section-title text-2xl">
                    {en ? text.title.en : text.title.hi}
                  </h2>
                  {plans.map((days) => {
                    const chunks = chunk(
                      sections.length
                        ? sections
                        : [
                            {
                              id: "full",
                              kind: "editorial-episode",
                              title: text.title,
                              verseIds: [],
                              order: 1,
                            },
                          ],
                      days,
                    );
                    return (
                      <div key={days} className="mt-6">
                        <h3 className="section-kicker">
                          {days} {en ? "days" : "दिन"}
                        </h3>
                        <ol className="mt-3 space-y-2">
                          {chunks.map((ch, i) => {
                            const first = ch[0];
                            return (
                              <li key={i} className="temple-card flex items-center justify-between px-4 py-3">
                                <div>
                                  <p className="text-sm">
                                    {en ? "Day" : "दिन"} {i + 1}
                                  </p>
                                  <p className="text-xs" style={{ color: "var(--hanumat-stone)" }}>
                                    {first?.title ? (en ? first.title.en : first.title.hi) : "—"}
                                    {ch.length > 1 ? ` · ${ch.length}` : ""}
                                  </p>
                                </div>
                                <Link href={h(`/path/${slug}/`)} className="btn-ghost !px-3 !py-1 text-xs">
                                  {en ? "Open" : "खोलें"}
                                </Link>
                              </li>
                            );
                          })}
                        </ol>
                      </div>
                    );
                  })}
                </section>
              );
            })}
          </div>
        )}

        {kind !== "search" && (
          <p className="mt-12 text-center text-xs" style={{ color: "var(--hanumat-stone)" }}>
            {en
              ? "Local panchang and family custom win. No ads."
              : "स्थानीय पंचांग और घर की रीति मान्य। विज्ञापन नहीं।"}
          </p>
        )}
      </div>
    </SiteShell>
  );
}

export function MandirListenPlayer({
  deity,
  locale,
}: {
  deity: DeityId;
  locale: Locale;
}) {
  const en = locale === "en";
  const catalog = listCatalogLite(undefined, deity);
  const h = (p: string) => deityHref(deity, locale, p);
  const d = deities[deity];

  return (
    <SiteShell wide>
      <div className="shell section-pad">
        <p className="section-kicker">{en ? d.eyebrow.en : d.eyebrow.hi}</p>
        <h1 className="section-title mt-2 text-4xl">{en ? "Listen" : "श्रवण"}</h1>
        <p className="mt-2 max-w-xl text-sm" style={{ color: "var(--hanumat-stone)" }}>
          {en
            ? "Same player as Hanumat. Paths without recitation audio stay “read until audio exists.”"
            : "हनुमत जैसा वादक। जिन पाठों पर श्रवण नहीं, वे ‘पाठ तक श्रवण’ रहेंगे।"}
        </p>
        <ul className="mt-10 space-y-4">
          {catalog.map((p) => {
            const pack = getTextBySlug(p.slug);
            const src =
              pack?.audio?.src ||
              pack?.audio?.segments?.[0]?.src ||
              "";
            return (
              <li key={p.id} className="temple-card temple-card-frame p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-serif text-lg">{en ? p.title.en : p.title.hi}</h2>
                  <Link href={h(`/path/${p.slug}/`)} className="text-xs" style={{ color: "var(--hanumat-vermillion-deep)" }}>
                    Path Studio →
                  </Link>
                </div>
                {src ? (
                  <audio className="mt-3 w-full" controls preload="none" src={src} />
                ) : (
                  <p className="mt-3 text-xs" style={{ color: "var(--hanumat-stone)" }}>
                    {en ? "Read until audio exists — open Path Studio." : "श्रवण आने तक पाठ करें — पाठ स्टूडियो खोलें।"}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </SiteShell>
  );
}
