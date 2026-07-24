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
      <p className="text-xs text-[#6b5a80]">Wave 3</p>
      <h1 className="font-serif text-4xl text-[#fff8e7]">{t("title")}</h1>
      <p className="mt-2 max-w-xl text-sm text-[#a994c4]">{t("intro")}</p>

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
              className="rounded-2xl border border-white/12 bg-white/5 p-5"
            >
              <h2 className="font-serif text-xl text-[#fff8e7]">
                {locale === "en" ? tm.name.en : tm.name.hi}
              </h2>
              <p className="mt-1 text-xs uppercase tracking-wider text-[#f48c06]">
                {tm.region}
              </p>
              <p className="mt-2 text-sm text-[#cbb8e0]">{tm.note}</p>
            </li>
          ),
        )}
      </ul>
    </SiteShell>
  );
}
