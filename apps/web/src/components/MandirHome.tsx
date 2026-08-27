import Image from "next/image";
import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { HeroWithSafeText } from "@/components/SafeSceneImage";
import { listCatalogLite } from "@/lib/catalog";
import { deityHref, type DeityId, deities } from "@/lib/deities";
import { getGallery, gallerySrc } from "@/lib/gallery";
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
  const gallery = getGallery(deity);
  const preview = gallery.images.slice(0, 8);
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
      href: h("/gallery/"),
      title: en ? "108 Images" : "१०८ चित्र",
      body: en
        ? "108 folk-style leela paintings, each in a different tradition."
        : "१०८ लोक-शैली लीला चित्र — प्रत्येक अलग परंपरा में।",
    },
  ];

  return (
    <SiteShell wide>
      <h1 className="sr-only">{en ? d.homeTitle.en : d.homeTitle.hi}</h1>

      <HeroWithSafeText
        src={d.heroImg}
        deity={deity}
        imageAlt={en ? d.brand.en : d.brand.hi}
      >
        <div className="text-center sm:text-left">
          <p className="section-kicker mb-3">{en ? d.eyebrow.en : d.eyebrow.hi}</p>
          <p
            className="mx-auto max-w-3xl text-3xl leading-tight sm:mx-0 sm:text-4xl md:text-5xl"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--hanumat-shadow)",
              fontWeight: 600,
            }}
          >
            {en ? d.homeTitle.en : d.homeTitle.hi}
          </p>
          <p
            className="mx-auto mt-4 max-w-2xl text-base leading-relaxed sm:mx-0"
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
          <div className="mt-7 flex flex-wrap justify-center gap-3 sm:justify-start">
            <Link href={h(`/path/${d.featuredSlug}/`)} className="btn-primary">
              {en ? d.featuredLabel.en : d.featuredLabel.hi}
            </Link>
            <Link href={h("/gallery/")} className="btn-gold">
              {en ? "108 Images" : "१०८ चित्र"}
            </Link>
            <Link href={h("/japa/")} className="btn-ghost">
              {en ? "Japa" : "जप"}
            </Link>
            <Link href="/" className="btn-ghost">
              {en ? "Three mandirs" : "तीन धाम"}
            </Link>
          </div>
        </div>
      </HeroWithSafeText>

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

      <section
        className="section-pad"
        style={{ background: "rgba(239,232,219,0.45)" }}
        aria-labelledby="gallery-heading"
      >
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="section-kicker">Chitra Leela</p>
              <h2 id="gallery-heading" className="section-title mt-1 text-3xl">
                {en ? gallery.title.en : gallery.title.hi}
              </h2>
            </div>
            <Link
              href={h("/gallery/")}
              className="text-sm font-medium hover:underline"
              style={{ color: "var(--hanumat-vermillion-deep)" }}
            >
              {en ? "View all 108 →" : "सभी १०८ →"}
            </Link>
          </div>
          <div className="pillar-grid pillar-grid-4 mt-8">
            {preview.map((img) => (
              <Link
                key={img.id}
                href={h(`/gallery/${img.id}/`)}
                className="temple-card group"
              >
                <div className="relative aspect-video">
                  <Image
                    src={gallerySrc(img.file, deity)}
                    alt={en ? img.scene.en : img.scene.hi}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="25vw"
                  />
                </div>
                <p
                  className="border-t px-3 py-2 text-xs"
                  style={{
                    borderColor: "var(--hanumat-gold-line)",
                    color: "var(--hanumat-stone)",
                  }}
                >
                  {en ? img.scene.en : img.scene.hi}
                </p>
              </Link>
            ))}
          </div>
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
