import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SiteShell } from "@/components/SiteShell";
import { MandirHome } from "@/components/MandirHome";
import { MandirGalleryIndex, MandirGalleryDetail } from "@/components/MandirGallery";
import { getGallery, galleryPick } from "@/lib/gallery";
import { PathStudioDynamic } from "@/components/PathStudioDynamic";
import { MandirExtraPage, MandirListenPlayer } from "@/components/MandirExtraPages";
import type { ExtraKind } from "@/lib/mandir-extras";
import { listCatalogLite } from "@/lib/catalog";
import { getTextBySlug, textsForDeity } from "@/lib/content";
import { deityHref, deities, type DeityId } from "@/lib/deities";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { seoFor } from "@/lib/seo-paths";
import { PathLead } from "@/components/PathLead";

export function deityLocaleParams() {
  return locales.map((locale) => ({ locale }));
}

export function mandirPathMetadata(
  deity: DeityId,
  locale: string,
  slug: string,
): Metadata {
  const text = getTextBySlug(slug);
  const d = deities[deity];
  const en = locale === "en";
  const seo = seoFor(slug);
  const title = text
    ? `${en ? seo.title.en : seo.title.hi} · ${en ? d.brand.en : d.brand.hi}`
    : d.brand.en;
  const description = en ? seo.description.en : seo.description.hi;
  const img = galleryPick(deity, slug.length * 7);
  const url = `https://hanumat.life${deityHref(deity, locale, `/path/${slug}/`)}`;
  const other = locale === "en" ? "hi" : "en";
  return {
    title,
    description,
    keywords: seo.keywords,
    alternates: {
      canonical: url,
      languages: {
        [locale]: url,
        [other]: `https://hanumat.life${deityHref(deity, other, `/path/${slug}/`)}`,
        "x-default": `https://hanumat.life${deityHref(deity, "en", `/path/${slug}/`)}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      locale: en ? "en_IN" : "hi_IN",
      images: [{ url: `https://hanumat.life${img}`, width: 1200, height: 630 }],
    },
  };
}

export function deityPathParams(deity: DeityId) {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    for (const p of textsForDeity(deity)) {
      params.push({ locale, slug: p.slug });
    }
  }
  return params;
}

export function deityGalleryParams(deity: DeityId) {
  const params: { locale: string; id: string }[] = [];
  for (const locale of locales) {
    for (const img of getGallery(deity).images) {
      params.push({ locale, id: img.id });
    }
  }
  return params;
}

export function deitySectionParams(deity: DeityId) {
  const params: { locale: string; slug: string; section: string }[] = [];
  for (const locale of locales) {
    for (const p of textsForDeity(deity)) {
      for (const s of p.sections) {
        params.push({ locale, slug: p.slug, section: s.id });
      }
    }
  }
  return params;
}

async function parseLocale(raw: string): Promise<Locale> {
  if (!isLocale(raw)) notFound();
  return raw;
}

export async function renderMandirHome(deity: DeityId, rawLocale: string) {
  const locale = await parseLocale(rawLocale);
  return <MandirHome deity={deity} locale={locale} />;
}

export async function renderMandirPathIndex(deity: DeityId, rawLocale: string) {
  const locale = await parseLocale(rawLocale);
  const t = await getTranslations();
  const catalog = listCatalogLite(undefined, deity);
  const h = (p: string) => deityHref(deity, locale, p);
  const en = locale === "en";

  return (
    <SiteShell wide>
      <div className="shell section-pad">
        <p className="section-kicker">{en ? deities[deity].eyebrow.en : deities[deity].eyebrow.hi}</p>
        <h1 className="section-title mt-2 text-4xl">{t("path.title")}</h1>
        <p className="mt-3 max-w-xl text-sm" style={{ color: "var(--hanumat-stone)" }}>
          {en ? deities[deity].homeBody.en : deities[deity].homeBody.hi}
        </p>
        <hr className="temple-rule mt-6" />
        <div className="pillar-grid mt-10">
          {catalog.map((p, i) => (
            <Link
              key={p.id}
              href={h(`/path/${p.slug}/`)}
              className="temple-card temple-card-frame group"
            >
              <div className="relative h-44">
                <Image
                  src={galleryPick(deity, i * 9 + 5)}
                  alt=""
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="50vw"
                />
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-20"
                  style={{
                    background: "linear-gradient(to top, rgba(246,241,231,0.95), transparent)",
                  }}
                />
              </div>
              <div className="p-5">
                <p className="section-kicker text-[10px]">{p.category}</p>
                <p
                  className="mt-2 text-2xl"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "var(--hanumat-shadow)",
                    fontWeight: 600,
                  }}
                >
                  {en ? p.title.en : p.title.hi}
                </p>
                <p className="mt-1 text-xs" style={{ color: "var(--hanumat-vermillion-deep)" }}>
                  {p.verseCount} {t("common.verses")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}

export async function renderMandirPath(
  deity: DeityId,
  rawLocale: string,
  slug: string,
  section?: string,
) {
  const locale = await parseLocale(rawLocale);
  const text = getTextBySlug(slug);
  if (!text || (text.deity || "hanuman") !== deity) notFound();
  const h = (p: string) => deityHref(deity, locale, p);
  const en = locale === "en";
  const desc =
    typeof text.description === "string"
      ? text.description
      : en
        ? text.description.en
        : text.description.hi;
  const sec = section ? text.sections.find((s) => s.id === section) : undefined;
  if (section && !sec) notFound();

  return (
    <SiteShell>
      <div className="mb-8">
        <p className="section-kicker">
          {text.category}
          {sec ? ` · ${en ? sec.title.en : sec.title.hi}` : ""}
        </p>
        <h1 className="section-title mt-1 text-4xl">
          {en ? text.title.en : text.title.hi}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--hanumat-stone)" }}>
          {desc}
        </p>
        <p className="mt-2 text-[11px]" style={{ color: "var(--hanumat-stone-light)" }}>
          {text.edition.pin}
          {text.edition.notes ? ` · ${text.edition.notes}` : ""}
        </p>
        <Link
          href={h("/path/")}
          className="mt-3 inline-block text-xs hover:underline"
          style={{ color: "var(--hanumat-vermillion-deep)" }}
        >
          ← {en ? "All paths" : "सभी पाठ"}
        </Link>
        <PathLead deity={deity} locale={locale} text={text} />
      </div>
      <PathStudioDynamic text={text} initialSectionId={section} />
    </SiteShell>
  );
}

export async function renderMandirListen(deity: DeityId, rawLocale: string) {
  const locale = await parseLocale(rawLocale);
  return <MandirListenPlayer deity={deity} locale={locale} />;
}

export async function renderMandirExtra(
  deity: DeityId,
  rawLocale: string,
  kind: ExtraKind,
) {
  const locale = await parseLocale(rawLocale);
  return <MandirExtraPage deity={deity} kind={kind} locale={locale} />;
}

export async function renderMandirLearn(deity: DeityId, rawLocale: string) {
  const locale = await parseLocale(rawLocale);
  const d = deities[deity];
  const catalog = listCatalogLite(undefined, deity);
  const en = locale === "en";

  return (
    <SiteShell>
      <h1 className="section-title text-4xl">{en ? "Learn · Sources" : "जानें · स्रोत"}</h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--hanumat-stone)" }}>
        {en ? d.learnNote.en : d.learnNote.hi}
      </p>
      <section className="mt-8 space-y-4 text-sm leading-relaxed">
        {catalog.map((p) => (
          <article key={p.id} className="temple-card p-5">
            <h2 className="font-serif text-lg">{en ? p.title.en : p.title.hi}</h2>
            <p className="mt-1 text-xs" style={{ color: "var(--hanumat-vermillion-deep)" }}>
              {p.category} · {p.verseCount} {en ? "verses" : "श्लोक"}
            </p>
          </article>
        ))}
        <div className="temple-card p-5">
          <h2 className="font-serif text-lg">{en ? "Disclaimers" : "अस्वीकरण"}</h2>
          <ul className="mt-2 list-inside list-disc space-y-1" style={{ color: "var(--hanumat-stone)" }}>
            <li>{en ? "Meanings are provisional plain language — not scholarly ṭīkā." : "अर्थ साधारण भाषा में हैं — शास्त्रीय टीका नहीं।"}</li>
            <li>{en ? "No TTS path-assist on this dham yet; Path Studio is text + meaning." : "इस धाम पर अभी TTS नहीं; पाठ स्टूडियो मूल + अर्थ है।"}</li>
            <li>{en ? "Traditions vary; report errors to hello@hanumat.life." : "परम्पराएँ भिन्न हैं; त्रुटि hello@hanumat.life पर लिखें।"}</li>
          </ul>
        </div>
      </section>
    </SiteShell>
  );
}

export async function renderMandirGallery(deity: DeityId, rawLocale: string) {
  const locale = await parseLocale(rawLocale);
  return <MandirGalleryIndex deity={deity} locale={locale} />;
}

export async function renderMandirGalleryDetail(
  deity: DeityId,
  rawLocale: string,
  id: string,
) {
  const locale = await parseLocale(rawLocale);
  return <MandirGalleryDetail deity={deity} locale={locale} id={id} />;
}

export async function renderMandirFaq(deity: DeityId, rawLocale: string) {
  const locale = await parseLocale(rawLocale);
  const en = locale === "en";
  const faqs =
    deity === "shiva"
      ? [
          {
            q: en ? "Are the shlokas verified?" : "क्या श्लोक जाँचे गए हैं?",
            a: en
              ? "Yes. Each path names its sources (edition pin). Hymns were collated against at least two public recensions — Sanskrit Documents, Green Message, Rigveda / Tulsidas / Shankara where they apply."
              : "हाँ। प्रत्येक पाठ में स्रोत (edition pin) है। मूल कम-से-कम दो सार्वजनिक पाठों से मिलाए गए।",
          },
          {
            q: en ? "What is a jyotirlinga?" : "ज्योतिर्लिङ्ग क्या है?",
            a: en
              ? "Twelve light-form lingas of Shiva. This mandir lists principal kshetras (Somnath, Kedarnath, Mahakaleshwar, Kashi, Rameshwaram…) as a quiet map — no trackers."
              : "शिव के द्वादश ज्योति-रूप लिङ्ग। यहाँ प्रधान क्षेत्र सूची हैं — बिना ट्रैकर।",
          },
          {
            q: en ? "When is Pradosha / Shivaratri?" : "प्रदोष / शिवरात्रि कब?",
            a: en
              ? "Pradosha is the trayodashi dusk; Maha Shivaratri is the great night vigil. Windows on the home banner are approximate — local panchang wins."
              : "प्रदोष त्रयोदशी संध्या है; महाशिवरात्रि जागरण। बैनर अनुमानित है — स्थानीय पंचांग प्रधान।",
          },
          {
            q: en ? "Does this mandir show ads?" : "क्या विज्ञापन हैं?",
            a: en ? "No. Pure seva — no ads, no accounts, no trackers." : "नहीं। निःशुल्क सेवा — बिना विज्ञापन, खाता या ट्रैकर।",
          },
        ]
      : [
          {
            q: en ? "Are the shlokas verified?" : "क्या श्लोक जाँचे गए हैं?",
            a: en
              ? "Yes. Adya Stotram (Brahma Yamala / Adyapeath) and Kalika Ashtakam (Shankara recension) were collated against Sanskrit Documents and Green Message. We do not publish Karpuradi paddhati or unverified Kali Chalisa."
              : "हाँ। आद्या स्तोत्र व कालिकाष्टकम् दो सार्वजनिक पाठों से मिलाए गए। कर्पूरादि पद्धति और असत्यापित काली चालीसा नहीं हैं।",
          },
          {
            q: en ? "Is this a tantric paddhati?" : "क्या यह तान्त्रिक पद्धति है?",
            a: en
              ? "No. Public stotra, nama-mantra, and aarti only. Longer initiated bija-mantras are not published as household recitation."
              : "नहीं। सार्वजनिक स्तोत्र, नाम-मन्त्र और आरती मात्र।",
          },
          {
            q: en ? "Which Kali kshetras are listed?" : "कौन-से काली क्षेत्र हैं?",
            a: en
              ? "Kalighat, Dakshineswar, Kamakhya, Tarapith, Adyapeath — as a quiet temple list, no maps that track you."
              : "कालीघाट, दक्षिणेश्वर, कामाख्या, तारापीठ, आद्यापीठ — शांत सूची, बिना ट्रैकर।",
          },
          {
            q: en ? "Does this mandir show ads?" : "क्या विज्ञापन हैं?",
            a: en ? "No. Pure seva — no ads, no accounts, no trackers." : "नहीं। निःशुल्क सेवा — बिना विज्ञापन, खाता या ट्रैकर।",
          },
        ];

  return (
    <SiteShell>
      <h1 className="section-title text-4xl">FAQ</h1>
      <div className="mt-8 space-y-4">
        {faqs.map((f) => (
          <article key={f.q} className="temple-card p-5">
            <h2 className="font-serif text-lg">{f.q}</h2>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--hanumat-stone)" }}>
              {f.a}
            </p>
          </article>
        ))}
      </div>
    </SiteShell>
  );
}
