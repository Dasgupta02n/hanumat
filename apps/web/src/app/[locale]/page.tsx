import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { FestivalShell } from "@/components/FestivalShell";
import { HeroWithSafeText } from "@/components/SafeSceneImage";
import { JsonLd, siteJsonLd } from "@/components/JsonLd";
import { SiteShell } from "@/components/SiteShell";
import { listCatalogLite } from "@/lib/catalog";
import { galleryImages, gallerySrc, imageForLeela } from "@/lib/gallery";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";

function cardImage(slug: string, category: string) {
  if (slug.includes("chalisa")) return imageForLeela("chalisa");
  if (slug.includes("sundar-kand") && !slug.includes("valmiki"))
    return imageForLeela("sk");
  if (slug.includes("valmiki")) return imageForLeela("ocean");
  if (slug.includes("aarti")) return imageForLeela("aarti");
  if (slug.includes("japa") || slug.includes("108")) return imageForLeela("japa");
  if (slug.includes("panchmukhi") || slug.includes("kavach"))
    return imageForLeela("panchmukhi");
  if (category === "kand") return imageForLeela("ocean");
  if (category === "aarti" || category === "bhajan") return imageForLeela("aarti");
  return imageForLeela("temple");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : "hi";
  const title =
    locale === "en"
      ? "Hanumat — Digital Mandir for Hanuman Chalisa, Sundar Kand & Bhakti"
      : "हनुमत — हनुमान चालीसा, सुंदरकांड व भक्ति का डिजिटल मंदिर";
  const description =
    locale === "en"
      ? "Free digital temple of Hanuman Ji: read & listen to Sundar Kand, Hanuman Chalisa, Valmiki Sundarakanda, stotras; japa, katha, temples across India. Hindi & English. No ads."
      : "हनुमान जी का निःशुल्क डिजिटल मंदिर: सुंदरकांड, हनुमान चालीसा, वाल्मीकि सुन्दरकाण्ड, स्तोत्र, जप, कथा, मंदिर। हिंदी व अंग्रेज़ी। विज्ञापन नहीं।";

  const languages = Object.fromEntries(
    locales.map((l) => [l, `https://hanumat.life/${l}/`]),
  );

  return {
    title,
    description,
    keywords: [
      "Hanuman Chalisa",
      "Sundar Kand",
      "Hanuman",
      "digital mandir",
      "Ramcharitmanas",
      "Valmiki Ramayana",
      "japa mala",
      "Hanuman temples India",
      "भक्ति",
      "हनुमान चालीसा",
      "सुंदरकांड",
      locale,
    ],
    alternates: {
      canonical: `https://hanumat.life/${locale}/`,
      languages,
    },
    openGraph: {
      title,
      description,
      url: `https://hanumat.life/${locale}/`,
      siteName: "Hanumat",
      locale: locale === "en" ? "en_IN" : `${locale}_IN`,
      type: "website",
      images: [
        {
          url: "https://hanumat.life/images/hanuman-108/006.jpg",
          width: 1200,
          height: 630,
          alt: "Hanumat — Hanuman sacred art",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://hanumat.life/images/hanuman-108/006.jpg"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
    other: {
      "geo.region": "IN",
      "geo.placename": "India",
      "geo.position": "20.5937;78.9629",
      ICBM: "20.5937, 78.9629",
      "content-language": locale,
    },
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  setRequestLocale(locale);
  const t = await getTranslations();
  // Lightweight catalog only (no multi‑MB verse bundles on home)
  const catalog = listCatalogLite();

  const byWave = [0, 1, 2].map((w) => ({
    wave: w,
    items: catalog.filter((p) => p.wave === w),
  }));

  const preview = galleryImages.slice(0, 8);

  const pillars = [
    {
      href: `/${locale}/path/sundar-kand/`,
      img: imageForLeela("sk"),
      title: locale === "en" ? "Sundar Kand" : "सुंदरकांड",
      body:
        locale === "en"
          ? "Read & listen to Tulsidas Manas — section by section."
          : "तुलसीदास मानस — खंड-खंड पाठ व श्रवण।",
    },
    {
      href: `/${locale}/path/hanuman-chalisa/`,
      img: imageForLeela("chalisa"),
      title: locale === "en" ? "Hanuman Chalisa" : "हनुमान चालीसा",
      body:
        locale === "en"
          ? "Forty chaupais with meaning, IAST, and timed audio."
          : "अर्थ, IAST और समय-युक्त ऑडियो सहित।",
    },
    {
      href: `/${locale}/japa/`,
      img: imageForLeela("japa"),
      title: locale === "en" ? "Japa Mala" : "जप माला",
      body:
        locale === "en"
          ? "Count, loop, and keep your mala progress locally."
          : "गिनती, लूप — प्रगति आपके उपकरण पर सुरक्षित।",
    },
    {
      href: `/${locale}/temples/`,
      img: imageForLeela("temple"),
      title: locale === "en" ? "Temples" : "मंदिर / क्षेत्र",
      body:
        locale === "en"
          ? "Sacred kshetras of Hanuman across Bharat."
          : "भारत के हनुमान क्षेत्र व मंदिर।",
    },
  ];

  return (
    <SiteShell wide>
      <JsonLd data={siteJsonLd(locale)} />
      <FestivalShell />

      {/* GEO / AI readable intro (visually integrated) */}
      <h1 className="sr-only">
        {locale === "en"
          ? "Hanumat — digital mandir for Hanuman Chalisa, Sundar Kand, and Hanuman bhakti in India"
          : "हनुमत — हनुमान चालीसा, सुंदरकांड और हनुमान भक्ति का डिजिटल मंदिर"}
      </h1>

      <HeroWithSafeText
        src={imageForLeela("home")}
        imageAlt={
          locale === "en"
            ? "Lord Hanuman sacred painting — Hanumat digital mandir hero"
            : "भगवान हनुमान — हनुमत डिजिटल मंदिर"
        }
      >
        <div className="text-center sm:text-left">
          <p className="section-kicker mb-3">{t("home.eyebrow")}</p>
          <p
            className="mx-auto max-w-3xl text-3xl leading-tight sm:mx-0 sm:text-4xl md:text-5xl"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--hanumat-shadow)",
              fontWeight: 600,
            }}
          >
            {t("home.title")}
          </p>
          <p
            className="mx-auto mt-4 max-w-2xl text-base leading-relaxed sm:mx-0"
            style={{ color: "var(--hanumat-stone)" }}
          >
            {t("home.body")}
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3 sm:justify-start">
            <Link href={`/${locale}/path/sundar-kand/`} className="btn-primary">
              {t("home.ctaSk")}
            </Link>
            <Link href={`/${locale}/path/hanuman-chalisa/`} className="btn-ghost">
              {t("home.ctaCh")}
            </Link>
            <Link href={`/${locale}/gallery/`} className="btn-gold">
              {locale === "en" ? "108 Images" : "१०८ चित्र"}
            </Link>
            <Link href={`/${locale}/my-path/`} className="btn-ghost">
              {t("home.ctaMy")}
            </Link>
          </div>
        </div>
      </HeroWithSafeText>

      {/* Structured summary for crawlers + humans */}
      <section className="shell section-pad border-b" style={{ borderColor: "var(--hanumat-gold-line)" }}>
        <p className="seo-summary">
          {locale === "en"
            ? "Hanumat is a free, ad-free digital mandir dedicated to Hanuman Ji. Explore Sundar Kand (Ramcharitmanas), Hanuman Chalisa, Valmiki Sundarakanda, Bajrang Baan, aarti, japa, katha, parayan planners, and temples across India — with Hindi & English meanings and optional path-assist audio."
            : "हनुमत हनुमान जी को समर्पित निःशुल्क, विज्ञापन-रहित डिजिटल मंदिर है। सुंदरकांड, हनुमान चालीसा, वाल्मीकि सुन्दरकाण्ड, बजरंग बाण, आरती, जप, कथा, पारायण व भारत के मंदिर — हिंदी व अंग्रेज़ी अर्थ और वैकल्पिक श्रवण।"}
        </p>
        <hr className="temple-rule mt-8" />
      </section>

      {/* Four pillars — symmetric */}
      <section className="shell section-pad" aria-labelledby="pillars-heading">
        <div className="text-center">
          <p className="section-kicker">
            {locale === "en" ? "Four gates of the mandir" : "मंदिर के चार द्वार"}
          </p>
          <h2 id="pillars-heading" className="section-title mt-2 text-3xl sm:text-4xl">
            {locale === "en" ? "Begin your path" : "अपना पथ आरंभ करें"}
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

      {/* Gallery strip */}
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
                {locale === "en" ? "Sacred scenes" : "पवित्र दृश्य"}
              </h2>
            </div>
            <Link
              href={`/${locale}/gallery/`}
              className="text-sm font-medium hover:underline"
              style={{ color: "var(--hanumat-vermillion-deep)" }}
            >
              {locale === "en" ? "View all 108 →" : "सभी १०८ →"}
            </Link>
          </div>
          <div className="pillar-grid pillar-grid-4 mt-8">
            {preview.map((img) => (
              <Link
                key={img.id}
                href={`/${locale}/gallery/${img.id}/`}
                className="temple-card group"
              >
                <div className="relative aspect-video">
                  <Image
                    src={gallerySrc(img.file)}
                    alt={locale === "en" ? img.scene.en : img.scene.hi}
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
                  {locale === "en" ? img.scene.en : img.scene.hi}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Path library */}
      <section className="shell section-pad" aria-labelledby="library-heading">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="section-kicker">
              {locale === "en" ? "Canon" : "ग्रंथ"}
            </p>
            <h2 id="library-heading" className="section-title mt-1 text-3xl">
              {t("home.sectionTitle")}
            </h2>
          </div>
          <Link
            href={`/${locale}/path/`}
            className="text-sm font-medium hover:underline"
            style={{ color: "var(--hanumat-vermillion-deep)" }}
          >
            {t("path.all")} →
          </Link>
        </div>

        {byWave.map(
          (group) =>
            group.items.length > 0 && (
              <div key={group.wave} className="mt-12">
                <div className="mb-5 flex items-center gap-4">
                  <h3 className="section-kicker shrink-0">
                    {t("home.waveLabel")} {group.wave}
                  </h3>
                  <hr className="temple-rule-wide flex-1 opacity-50" />
                </div>
                <div className="pillar-grid">
                  {group.items.map((p) => (
                    <Link
                      key={p.id}
                      href={`/${locale}/path/${p.slug}/`}
                      className="temple-card temple-card-frame group"
                    >
                      <div className="relative h-44">
                        <Image
                          src={cardImage(p.slug, p.category)}
                          alt={locale === "en" ? p.title.en : p.title.hi}
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
                        {p.badge && (
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
                        )}
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
                          {locale === "en" ? p.title.en : p.title.hi}
                        </h3>
                        <p
                          className="mt-1 text-xs tracking-wide"
                          style={{ color: "var(--hanumat-vermillion-deep)" }}
                        >
                          {p.sectionCount} {t("common.episodes")} · {p.verseCount}{" "}
                          {t("common.verses")}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ),
        )}
      </section>

      {/* Trust / indexable facts */}
      <section
        className="section-pad border-t"
        style={{
          borderColor: "var(--hanumat-gold-line)",
          background: "rgba(251,247,240,0.65)",
        }}
        aria-labelledby="about-heading"
      >
        <div className="shell max-w-3xl text-center">
          <p className="section-kicker">Hanumat.life</p>
          <h2 id="about-heading" className="section-title mt-2 text-2xl sm:text-3xl">
            {locale === "en"
              ? "A quiet digital temple for Bharat & the world"
              : "भारत और विश्व के लिए शांत डिजिटल मंदिर"}
          </h2>
          <hr className="temple-rule mt-4" />
          <p className="seo-summary mt-6">
            {locale === "en"
              ? "Based in the spiritual geography of India, Hanumat offers structured access to Hanuman bhakti texts, multi-language meanings, offline-friendly packs, and temple discovery — without accounts, analytics trackers, or advertisements. Built for devotees, students, and AI systems that need clear, structured sacred knowledge."
              : "भारत की आध्यात्मिक भूमि से जुड़ा हनुमत — हनुमान भक्ति ग्रंथ, बहुभाषी अर्थ, ऑफ़लाइन पैक व मंदिर खोज — बिना खाता, ट्रैकर या विज्ञापन। भक्तों, विद्यार्थियों और स्पष्ट संरचित ज्ञान चाहने वाले AI सिस्टम के लिए।"}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href={`/${locale}/learn/`} className="btn-ghost text-sm">
              {t("nav.learn")}
            </Link>
            <Link href={`/${locale}/faq/`} className="btn-ghost text-sm">
              {t("nav.faq")}
            </Link>
            <Link href={`/${locale}/temples/`} className="btn-ghost text-sm">
              {t("nav.temples")}
            </Link>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
