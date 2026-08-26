import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { SiteShell } from "@/components/SiteShell";
import { MandirHome } from "@/components/MandirHome";
import { PathStudioDynamic } from "@/components/PathStudioDynamic";
import { listCatalogLite } from "@/lib/catalog";
import { getTextBySlug, textsForDeity } from "@/lib/content";
import { deityHref, deities, type DeityId } from "@/lib/deities";
import { isLocale, locales, type Locale } from "@/i18n/config";

export function deityLocaleParams() {
  return locales.map((locale) => ({ locale }));
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
    <SiteShell>
      <h1 className="section-title text-4xl">{t("path.title")}</h1>
      <p className="mt-2 max-w-xl text-sm" style={{ color: "var(--hanumat-stone)" }}>
        {en ? deities[deity].homeBody.en : deities[deity].homeBody.hi}
      </p>
      <ul className="mt-8 space-y-3">
        {catalog.map((p) => (
          <li key={p.id}>
            <Link
              href={h(`/path/${p.slug}/`)}
              className="temple-card temple-card-frame flex items-center justify-between px-5 py-4"
            >
              <div>
                <p
                  className="text-xl"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "var(--hanumat-shadow)",
                    fontWeight: 600,
                  }}
                >
                  {en ? p.title.en : p.title.hi}
                </p>
                <p className="text-xs" style={{ color: "var(--hanumat-vermillion-deep)" }}>
                  {p.verseCount} {t("common.verses")} · {p.category}
                </p>
              </div>
              <span style={{ color: "var(--hanumat-gold-deep)" }}>→</span>
            </Link>
          </li>
        ))}
      </ul>
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
      </div>
      <PathStudioDynamic text={text} initialSectionId={section} />
    </SiteShell>
  );
}

export async function renderMandirListen(deity: DeityId, rawLocale: string) {
  const locale = await parseLocale(rawLocale);
  const catalog = listCatalogLite(undefined, deity);
  const h = (p: string) => deityHref(deity, locale, p);
  const en = locale === "en";

  return (
    <SiteShell>
      <h1 className="section-title text-4xl">{en ? "Listen / read" : "श्रवण / पाठ"}</h1>
      <p className="mt-2 max-w-xl text-sm" style={{ color: "var(--hanumat-stone)" }}>
        {en
          ? "Wave v1 for this dham is text-first (mula + IAST + meaning). Path-assist audio may be added later."
          : "इस धाम का Wave v1 पाठ-प्रथम है (मूल + IAST + अर्थ)। श्रवण बाद में जुड़ सकता है।"}
      </p>
      <ul className="mt-8 space-y-3">
        {catalog.map((p) => (
          <li key={p.id}>
            <Link
              href={h(`/path/${p.slug}/`)}
              className="temple-card flex items-center justify-between px-5 py-4"
            >
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>
                {en ? p.title.en : p.title.hi}
              </span>
              <span className="text-xs" style={{ color: "var(--hanumat-gold-deep)" }}>
                Path Studio →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </SiteShell>
  );
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

export async function renderMandirFaq(deity: DeityId, rawLocale: string) {
  const locale = await parseLocale(rawLocale);
  const en = locale === "en";
  const faqs = [
    {
      q: en ? "Are the shlokas verified?" : "क्या श्लोक जाँचे गए हैं?",
      a: en
        ? "Yes. Each path names its sources in Path Studio (edition pin). Core hymns were collated against at least two public recensions (Sanskrit Documents, Green Message, Vedic saṃhitā, Tulsidas Manas, Brahma Yamala / Adyapeath)."
        : "हाँ। प्रत्येक पाठ में स्रोत (edition pin) लिखा है। मूल स्तोत्र कम-से-कम दो सार्वजनिक पाठों से मिलाए गए।",
    },
    {
      q: en ? "Is this a tantric paddhati?" : "क्या यह तान्त्रिक पद्धति है?",
      a: en
        ? "No. Public stotra, mantra-nama, and aarti only. Longer bija-mantras of initiated sadhana are not published as household recitation."
        : "नहीं। सार्वजनिक स्तोत्र, नाम-मन्त्र और आरती मात्र। दीक्षित साधना के दीर्घ बीजमन्त्र घर-पाठ के रूप में नहीं दिए गए।",
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
