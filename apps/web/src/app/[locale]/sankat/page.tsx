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
        <p className="text-xs tracking-[0.3em] text-[#f48c06]">शरण · Wave 1</p>
        <h1 className="mt-3 font-serif text-4xl text-[#fff8e7]">{t("title")}</h1>
        <p className="mt-4 text-sm leading-relaxed text-[#cbb8e0]">{t("body")}</p>
        <p className="mt-8 font-serif text-2xl text-[#ffd60a]" lang="hi">
          ॐ हनुमते नमः
        </p>
        <div className="mt-10 flex flex-col gap-3">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={
                l.primary
                  ? "rounded-2xl bg-[#f48c06] py-3 font-semibold text-[#1a0f2e]"
                  : "rounded-2xl border border-white/20 bg-white/5 py-3 text-[#fff8e7]"
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
