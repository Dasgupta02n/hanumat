import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/SiteShell";
import { isLocale, type Locale } from "@/i18n/config";

export default async function SankatPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("sankat");

  const links = [
    {
      href: `/${locale}/path/hanuman-chalisa/`,
      labelHi: "हनुमान चालीसा",
      labelEn: "Hanuman Chalisa",
      primary: true,
    },
    {
      href: `/${locale}/path/bajrang-baan/`,
      labelHi: "बजरंग बाण",
      labelEn: "Bajrang Baan",
    },
    {
      href: `/${locale}/path/sankatmochan-ashtak/`,
      labelHi: "संकटमोचन अष्टक",
      labelEn: "Sankatmochan Ashtak",
    },
    {
      href: `/${locale}/japa/`,
      labelHi: "ॐ हनुमते नमः",
      labelEn: "Om Hanumate Namah",
    },
    {
      href: `/${locale}/path/sundar-kand/`,
      labelHi: "सुंदरकांड",
      labelEn: "Sundar Kand",
    },
  ];

  return (
    <SiteShell>
      <div className="mx-auto max-w-lg text-center">
        <p className="section-kicker">शरण · Wave 1</p>
        <h1 className="section-title mt-3 text-4xl">{t("title")}</h1>
        <p className="mt-4 text-sm leading-relaxed text-[var(--hanumat-stone)]">{t("body")}</p>
        <p className="mt-8 font-serif text-2xl text-[var(--hanumat-vermillion-deep)]" lang="hi">
          ॐ हनुमते नमः
        </p>
        <div className="mt-10 flex flex-col gap-3">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={
                l.primary
                  ? "btn-primary py-3"
                  : "temple-card py-3 text-[var(--hanumat-shadow)]"
              }
            >
              {locale === "en" ? l.labelEn : l.labelHi}
            </Link>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
