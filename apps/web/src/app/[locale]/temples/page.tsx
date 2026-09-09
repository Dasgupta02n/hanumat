import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/SiteShell";
import { temples } from "@/lib/content";
import { isLocale, type Locale } from "@/i18n/config";

export default async function TemplesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("temples");

  return (
    <SiteShell>
      <p className="section-kicker">Wave 3</p>
      <h1 className="section-title mt-2 text-4xl">{t("title")}</h1>
      <p className="mt-2 max-w-xl text-sm text-[var(--hanumat-stone)]">{t("intro")}</p>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {temples.map(
          (tm: {
            id: string;
            name: { hi: string; en: string };
            region: string;
            note: string;
          }) => (
            <li
              key={tm.id}
              className="temple-card p-5"
            >
              <h2 className="font-serif text-xl text-[var(--hanumat-shadow)]">
                {locale === "en" ? tm.name.en : tm.name.hi}
              </h2>
              <p className="mt-1 text-xs uppercase tracking-wider text-[var(--hanumat-vermillion-deep)]">
                {tm.region}
              </p>
              <p className="mt-2 text-sm text-[var(--hanumat-stone)]">{tm.note}</p>
            </li>
          ),
        )}
      </ul>
    </SiteShell>
  );
}
