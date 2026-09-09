import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/SiteShell";
import { getTextBySlug } from "@/lib/content";
import { isLocale, type Locale } from "@/i18n/config";

function chunkSections<T>(items: T[], days: number): T[][] {
  if (days <= 1) return [items];
  const size = Math.ceil(items.length / days);
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    out.push(items.slice(i, i + size));
  }
  return out;
}

export default async function ParayanPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("parayan");
  const sk = getTextBySlug("sundar-kand");
  const sections = sk?.sections || [];

  const plans = [
    { days: 1, label: t("days1") },
    { days: 7, label: t("days7") },
    { days: 40, label: t("days40") },
  ];

  return (
    <SiteShell>
      <p className="section-kicker">Wave 3</p>
      <h1 className="section-title mt-2 text-4xl">{t("title")}</h1>
      <p className="mt-2 max-w-xl text-sm text-[var(--hanumat-stone)]">{t("intro")}</p>

      <div className="mt-8 space-y-10">
        {plans.map((plan) => {
          const chunks = chunkSections(sections, plan.days);
          return (
            <section key={plan.days}>
              <h2 className="font-serif text-2xl text-[var(--hanumat-vermillion-deep)]">{plan.label}</h2>
              <ol className="mt-4 space-y-2">
                {chunks.map((chunk, i) => {
                  const first = chunk[0];
                  const last = chunk[chunk.length - 1];
                  const href = first
                    ? `/${locale}/path/sundar-kand/`
                    : `/${locale}/path/sundar-kand/`;
                  return (
                    <li
                      key={i}
                      className="temple-card flex flex-wrap items-center justify-between gap-2 px-4 py-3"
                    >
                      <div>
                        <p className="text-sm text-[var(--hanumat-shadow)]">
                          {t("day")} {i + 1}
                        </p>
                        <p className="text-xs text-[var(--hanumat-stone)]">
                          {first
                            ? locale === "en"
                              ? first.title.en
                              : first.title.hi
                            : "—"}
                          {chunk.length > 1 && last
                            ? ` → ${locale === "en" ? last.title.en : last.title.hi}`
                            : ""}
                          {` · ${chunk.length} sections`}
                        </p>
                      </div>
                      <Link
                        href={href}
                        className="btn-ghost !px-3 !py-1 text-xs"
                      >
                        {t("start")}
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </section>
          );
        })}
      </div>
    </SiteShell>
  );
}
