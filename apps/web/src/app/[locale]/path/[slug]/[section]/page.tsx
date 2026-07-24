import Link from "next/link";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { SiteShell } from "@/components/SiteShell";
import { allTexts, getTextBySlug } from "@/lib/content";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { PathStudioDynamic } from "../../PathStudioDynamic";

export function generateStaticParams() {
  const params: { locale: string; slug: string; section: string }[] = [];
  for (const locale of locales) {
    for (const p of allTexts) {
      for (const s of p.sections) {
        params.push({ locale, slug: p.slug, section: s.id });
      }
    }
  }
  return params;
}

export default async function PathSectionPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string; section: string }>;
}) {
  const { locale: raw, slug, section } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  setRequestLocale(locale);
  const text = getTextBySlug(slug);
  if (!text) notFound();
  const sec = text.sections.find((s) => s.id === section);
  if (!sec) notFound();

  return (
    <SiteShell>
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-[#f48c06]">
          {text.category} · section route
        </p>
        <h1 className="mt-1 font-serif text-3xl text-[#fff8e7]">
          {locale === "en" ? text.title.en : text.title.hi}
        </h1>
        <p className="mt-2 text-sm text-[#f48c06]">
          {locale === "en" ? sec.title.en : sec.title.hi}
        </p>
        <Link
          href={`/${locale}/path/${text.slug}/`}
          className="mt-3 inline-block text-xs text-[#a994c4] hover:text-[#f48c06]"
        >
          ← full path
        </Link>
      </div>
      <PathStudioDynamic text={text} initialSectionId={section} />
    </SiteShell>
  );
}
