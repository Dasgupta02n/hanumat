import Image from "next/image";
import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { listCatalogLite } from "@/lib/catalog";
import { deityHref, type DeityId, deities } from "@/lib/deities";
import type { Locale } from "@/i18n/config";

export function MandirHome({
  deity,
  locale,
}: {
  deity: DeityId;
  locale: Locale;
}) {
  const d = deities[deity];
  const h = (p = "/") => deityHref(deity, locale, p);
  const catalog = listCatalogLite(undefined, deity);
  const en = locale === "en";

  const pillars = [
    {
      href: h(`/path/${d.featuredSlug}/`),
      title: en ? d.featuredLabel.en : d.featuredLabel.hi,
      body: en ? "Open Path Studio — mula, IAST, meaning." : "पाठ स्टूडियो — मूल, IAST, अर्थ।",
    },
    {
      href: h(`/path/${d.ctaSecondarySlug}/`),
      title: en ? d.ctaSecondaryLabel.en : d.ctaSecondaryLabel.hi,
      body: en ? "A second gate of this mandir." : "इस मन्दिर का दूसरा द्वार।",
    },
    {
      href: h("/japa/"),
      title: en ? "Japa mala" : "जप माला",
      body: en ? d.mantra.en : d.mantra.hi,
    },
    {
      href: h("/path/"),
      title: en ? "Full library" : "पूर्ण संग्रह",
      body: en
        ? `${catalog.length} paths collated from named sources.`
        : `${catalog.length} पाठ — नामित स्रोतों से संकलित।`,
    },
  ];

  return (
    <SiteShell wide>
      <h1 className="sr-only">{en ? d.homeTitle.en : d.homeTitle.hi}</h1>

      <section className="relative overflow-hidden">
        <div className="relative min-h-[22rem] md:min-h-[28rem]">
          <Image
            src={d.heroImg}
            alt={en ? d.brand.en : d.brand.hi}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(246,241,231,0.97) 0%, rgba(246,241,231,0.55) 42%, rgba(20,17,14,0.25) 100%)",
            }}
          />
          <div className="shell relative flex min-h-[22rem] items-end pb-10 pt-24 md:min-h-[28rem]">
            <div className="max-w-2xl">
              <p className="section-kicker mb-3">{en ? d.eyebrow.en : d.eyebrow.hi}</p>
              <p
                className="text-3xl leading-tight sm:text-4xl md:text-5xl"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--hanumat-shadow)",
                  fontWeight: 600,
                }}
              >
                {en ? d.homeTitle.en : d.homeTitle.hi}
              </p>
              <p
                className="mt-4 max-w-xl text-base leading-relaxed"
                style={{ color: "var(--hanumat-stone)" }}
              >
                {en ? d.homeBody.en : d.homeBody.hi}
              </p>
              <p
                className="mt-3 font-serif text-xl"
                lang="hi"
                style={{ color: "var(--hanumat-vermillion-deep)" }}
              >
                {d.mantra.hi}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href={h(`/path/${d.featuredSlug}/`)} className="btn-primary">
                  {en ? d.featuredLabel.en : d.featuredLabel.hi}
                </Link>
                <Link href={h("/path/")} className="btn-ghost">
                  {en ? "All paths" : "सभी पाठ"}
                </Link>
                <Link href="/" className="btn-gold">
                  {en ? "Three mandirs" : "तीन धाम"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="shell section-pad" aria-labelledby="pillars-heading">
        <div className="text-center">
          <p className="section-kicker">
            {en ? "Four gates of the mandir" : "मन्दिर के चार द्वार"}
          </p>
          <h2 id="pillars-heading" className="section-title mt-2 text-3xl sm:text-4xl">
            {en ? "Begin your path" : "अपना पथ आरंभ करें"}
          </h2>
          <hr className="temple-rule mt-4" />
        </div>
        <div className="pillar-grid pillar-grid-4 mt-10">
          {pillars.map((p) => (
            <Link key={p.href} href={p.href} className="temple-card temple-card-frame group p-5">
              <h3
                className="text-2xl"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--hanumat-shadow)",
                  fontWeight: 600,
                }}
              >
                {p.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--hanumat-stone)" }}>
                {p.body}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="shell section-pad" aria-labelledby="library-heading">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="section-kicker">{en ? "Canon" : "ग्रंथ"}</p>
            <h2 id="library-heading" className="section-title mt-1 text-3xl">
              {en ? "Path library" : "पाठ संग्रह"}
            </h2>
          </div>
          <Link
            href={h("/path/")}
            className="text-sm font-medium hover:underline"
            style={{ color: "var(--hanumat-vermillion-deep)" }}
          >
            {en ? "All" : "सभी"} →
          </Link>
        </div>
        <div className="pillar-grid mt-10">
          {catalog.map((p) => (
            <Link
              key={p.id}
              href={h(`/path/${p.slug}/`)}
              className="temple-card temple-card-frame group p-5"
            >
              <p className="section-kicker text-[10px]">{p.category}</p>
              <h3
                className="mt-2 text-2xl"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--hanumat-shadow)",
                  fontWeight: 600,
                }}
              >
                {en ? p.title.en : p.title.hi}
              </h3>
              <p
                className="mt-1 text-xs tracking-wide"
                style={{ color: "var(--hanumat-vermillion-deep)" }}
              >
                {p.verseCount} {en ? "verses" : "श्लोक"}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
