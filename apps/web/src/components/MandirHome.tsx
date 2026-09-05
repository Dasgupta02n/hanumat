import Image from "next/image";
import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { HeroWithSafeText } from "@/components/SafeSceneImage";
import { listCatalogLite } from "@/lib/catalog";
import { deityHref, type DeityId, deities } from "@/lib/deities";
import { getGallery, gallerySrc, galleryPick } from "@/lib/gallery";
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
  const byWave = [0, 1, 2].map((w) => ({
    wave: w,
    items: catalog.filter((p) => p.wave === w),
  }));

  const pillars = [
    {
      href: h(`/path/${d.featuredSlug}/`),
      img: galleryPick(deity, 11),
      title: en ? d.featuredLabel.en : d.featuredLabel.hi,
      body: en
        ? "Open Path Studio — mula, IAST, meaning."
        : "पाठ स्टूडियो — मूल, IAST, अर्थ।",
    },
    {
      href: h(`/path/${d.ctaSecondarySlug}/`),
      img: galleryPick(deity, 18),
      title: en ? d.ctaSecondaryLabel.en : d.ctaSecondaryLabel.hi,
      body: en
        ? "A second gate of this mandir."
        : "इस मन्दिर का दूसरा द्वार।",
    },
    {
      href: h("/japa/"),
      img: galleryPick(deity, 45),
      title: en ? "Japa Mala" : "जप माला",
      body: en ? d.mantra.en : d.mantra.hi,
    },
    {
      href: h("/gallery/"),
      img: galleryPick(deity, 2),
      title: en ? "108 Images" : "१०८ चित्र",
      body: en
        ? "108 folk-style leela paintings, each in a different tradition."
        : "१०८ लोक-शैली लीला चित्र — प्रत्येक अलग परंपरा में।",
    },
  ];

  const summary =
    deity === "shiva"
      ? en
        ? "Shivayatan is a free, ad-free digital mandir dedicated to Shiva. Read Mahamrityunjaya, Lingashtakam, Rudrashtakam, Panchakshara, Nirvana Shatkam, Kalabhairava Ashtakam and Shiv aarti — with Hindi & English meanings, IAST, japa, and 108 folk leela paintings."
        : "शिवायतन शिव को समर्पित निःशुल्क, विज्ञापन-रहित डिजिटल मन्दिर है। महामृत्युंजय, लिङ्गाष्टकम्, रुद्राष्टकम्, पञ्चाक्षर, निर्वाणषट्कम्, कालभैरवाष्टकम् व शिव आरती — हिंदी-अंग्रेज़ी अर्थ, IAST, जप और १०८ लोक लीला चित्र।"
      : en
        ? "Kalika Dham is a free, ad-free digital mandir dedicated to Maa Kali. Read Adya Stotram, Kalika Ashtakam, the Dakshina Kali mula mantra and Kali aarti — with Hindi & English meanings, IAST, japa, and 108 folk leela paintings."
        : "कालिका धाम माँ काली को समर्पित निःशुल्क, विज्ञापन-रहित डिजिटल मन्दिर है। आद्या स्तोत्र, कालिकाष्टकम्, मूल मन्त्र व काली आरती — हिंदी-अंग्रेज़ी अर्थ, IAST, जप और १०८ लोक लीला चित्र।";

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
            <Link href={h(`/path/${d.ctaSecondarySlug}/`)} className="btn-ghost">
              {en ? d.ctaSecondaryLabel.en : d.ctaSecondaryLabel.hi}
            </Link>
            <Link href={h("/gallery/")} className="btn-gold">
              {en ? "108 Images" : "१०८ चित्र"}
            </Link>
            <Link href={h("/japa/")} className="btn-ghost">
              {en ? "Japa" : "जप"}
            </Link>
          </div>
        </div>
      </HeroWithSafeText>

      <section
        className="shell section-pad border-b"
        style={{ borderColor: "var(--hanumat-gold-line)" }}
      >
        <p className="seo-summary">{summary}</p>
        <hr className="temple-rule mt-8" />
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
            <Link key={p.href} href={p.href} className="temple-card temple-card-frame group">
              <div className="relative aspect-[4/3]">
                <Image
                  src={p.img}
                  alt={p.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(28,24,20,0.55) 0%, transparent 55%)",
                  }}
                />
                <p
                  className="absolute bottom-3 left-3 right-3 text-lg"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "#FBF7F0",
                    fontWeight: 600,
                  }}
                >
                  {p.title}
                </p>
              </div>
              <p className="px-4 py-3 text-sm leading-relaxed" style={{ color: "var(--hanumat-stone)" }}>
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
                {en ? "Sacred scenes" : "पवित्र दृश्य"}
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

        {byWave.map(
          (group) =>
            group.items.length > 0 && (
              <div key={group.wave} className="mt-12">
                <div className="mb-5 flex items-center gap-4">
                  <h3 className="section-kicker shrink-0">
                    {en ? "Wave" : "तरंग"} {group.wave}
                  </h3>
                  <hr className="temple-rule-wide flex-1 opacity-50" />
                </div>
                <div className="pillar-grid">
                  {group.items.map((p, i) => (
                    <Link
                      key={p.id}
                      href={h(`/path/${p.slug}/`)}
                      className="temple-card temple-card-frame group"
                    >
                      <div className="relative h-44">
                        <Image
                          src={galleryPick(deity, i * 9 + group.wave * 3 + 5)}
                          alt={en ? p.title.en : p.title.hi}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-105"
                          sizes="50vw"
                        />
                        <div
                          className="pointer-events-none absolute inset-x-0 bottom-0 h-20"
                          style={{
                            background:
                              "linear-gradient(to top, rgba(246,241,231,0.95), transparent)",
                          }}
                        />
                        {p.badge ? (
                          <span
                            className="absolute bottom-3 left-3 rounded-full px-2.5 py-0.5 text-[10px] tracking-wide"
                            style={{
                              background: "rgba(251,247,240,0.95)",
                              color: "var(--hanumat-gold-deep)",
                              border: "1px solid var(--hanumat-gold-line)",
                            }}
                          >
                            {p.badge}
                          </span>
                        ) : null}
                      </div>
                      <div className="p-5">
                        <h3
                          className="text-2xl"
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
                          {p.sectionCount} {en ? "episodes" : "खंड"} · {p.verseCount}{" "}
                          {en ? "verses" : "श्लोक"}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ),
        )}
      </section>

      <section
        className="section-pad border-t"
        style={{
          borderColor: "var(--hanumat-gold-line)",
          background: "rgba(251,247,240,0.65)",
        }}
        aria-labelledby="about-heading"
      >
        <div className="shell max-w-3xl text-center">
          <p className="section-kicker">{en ? d.brand.en : d.brand.hi}</p>
          <h2 id="about-heading" className="section-title mt-2 text-2xl sm:text-3xl">
            {en
              ? "A quiet digital temple for Bharat & the world"
              : "भारत और विश्व के लिए शांत डिजिटल मंदिर"}
          </h2>
          <hr className="temple-rule mt-4" />
          <p className="seo-summary mt-6">
            {en ? d.learnNote.en : d.learnNote.hi}{" "}
            {en
              ? "No accounts, no trackers, no advertisements."
              : "बिना खाता, ट्रैकर या विज्ञापन।"}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href={h("/learn/")} className="btn-ghost text-sm">
              {en ? "Learn" : "जानें"}
            </Link>
            <Link href={h("/faq/")} className="btn-ghost text-sm">
              {en ? "FAQ" : "प्रश्न"}
            </Link>
            <Link href={h("/gallery/")} className="btn-ghost text-sm">
              {en ? "108 Images" : "१०८ चित्र"}
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
