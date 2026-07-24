import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/SiteShell";
import { listCatalogLite as listCatalog } from "@/lib/catalog";
import { isLocale, type Locale } from "@/i18n/config";

export default async function PathIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  setRequestLocale(locale);
  const t = await getTranslations();
  const catalog = listCatalog();
  const waves = [0, 1, 2] as const;

  return (
    <SiteShell>
      <h1 className="font-serif text-4xl text-[#fff8e7]">{t("path.title")}</h1>
      <p className="mt-2 max-w-xl text-sm text-[#a994c4]">{t("path.intro")}</p>

      {waves.map((w) => {
        const items = catalog.filter((p) => p.wave === w);
        if (!items.length) return null;
        return (
          <section key={w} className="mt-10" id={`wave-${w}`}>
            <h2 className="text-xs uppercase tracking-[0.2em] text-[#f48c06]">
              Wave {w}
            </h2>
            <ul className="mt-4 space-y-3">
              {items.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/${locale}/path/${p.slug}/`}
                    className="flex items-center justify-between rounded-2xl border border-white/12 bg-white/5 px-5 py-4 transition hover:border-[#f48c06]/40"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-serif text-xl text-[#fff8e7]">
                          {locale === "en" ? p.title.en : p.title.hi}
                        </p>
                        {p.badge && (
                          <span className="rounded-full bg-[#f48c06]/20 px-2 py-0.5 text-[10px] text-[#ffd60a]">
                            {p.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#f48c06]">
                        {p.sectionCount} {t("common.episodes")} · {p.verseCount}{" "}
                        {t("common.verses")}
                      </p>
                    </div>
                    <span className="text-[#f48c06]">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
      <p className="mt-8 text-xs text-[#6b5a80]">{t("path.wave1note")}</p>
    </SiteShell>
  );
}
