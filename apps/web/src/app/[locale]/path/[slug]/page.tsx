import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { mandirPathMetadata } from "@/lib/mandir-pages";
import { SiteShell } from "@/components/SiteShell";
import { allTexts, getTextBySlug } from "@/lib/content";
import { TwinTextPanel } from "@/components/TwinTextPanel";
import { SafeSceneImage } from "@/components/SafeSceneImage";
import { imageForLeela } from "@/lib/gallery";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { PathStudioDynamic } from "../PathStudioDynamic";
import { PathLead } from "@/components/PathLead";

export function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    for (const p of allTexts.filter((t) => (t.deity || "hanuman") === "hanuman")) {
      params.push({ locale, slug: p.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  return mandirPathMetadata("hanuman", locale, slug);
}

export default async function PathPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  setRequestLocale(locale);
  const text = getTextBySlug(slug);
  if (!text || (text.deity || "hanuman") !== "hanuman") notFound();

  const desc =
    typeof text.description === "string"
      ? text.description
      : locale === "en"
        ? text.description.en
        : text.description.hi;

  return (
    <SiteShell>
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-[#f48c06]">
          {text.category} · wave {text.wave}
        </p>
        <h1 className="mt-1 font-serif text-4xl text-[#fff8e7]">
          {locale === "en" ? text.title.en : text.title.hi}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#cbb8e0]">
          {desc}
        </p>
        <p className="mt-2 text-[11px] text-[#6b5a80]">{text.edition.pin}</p>
        {text.sections.length > 1 && (
          <p className="mt-2 text-xs text-[#a994c4]">
            <Link
              href={`/${locale}/path/${text.slug}/${text.sections[0].id}/`}
              className="text-[#f48c06] hover:underline"
            >
              Open first section route →
            </Link>
          </p>
        )}
        <TwinTextPanel locale={locale} activeTextId={text.id} />
        <PathLead deity="hanuman" locale={locale} text={text} />
      </div>
      <div className="mb-8">
        <SafeSceneImage
          src={
            text.slug.includes("chalisa")
              ? imageForLeela("chalisa")
              : text.slug.includes("sundar") && !text.slug.includes("valmiki")
                ? imageForLeela("sk")
                : text.slug.includes("aarti")
                  ? imageForLeela("aarti")
                  : text.slug.includes("kavach")
                    ? imageForLeela("panchmukhi")
                    : imageForLeela("default")
          }
          alt={locale === "en" ? text.title.en : text.title.hi}
          aspect="wide"
          caption={
            locale === "en"
              ? "Leela scene · Gallery has 108 full-HD downloads"
              : "लीला दृश्य · गैलरी में १०८ पूर्ण-HD डाउनलोड"
          }
        />
      </div>
      <PathStudioDynamic text={text} />
    </SiteShell>
  );
}
