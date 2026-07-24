"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ReactNode, useMemo } from "react";
import { locales, type Locale } from "@/i18n/config";

export function SiteShell({
  children,
  wide,
}: {
  children: ReactNode;
  wide?: boolean;
}) {
  const t = useTranslations();
  const locale = useLocale() as Locale;

  const primaryNav = useMemo(
    () => [
      { href: `/${locale}/`, label: t("nav.home") },
      { href: `/${locale}/path/`, label: t("nav.path") },
      { href: `/${locale}/listen/`, label: t("nav.listen") },
      { href: `/${locale}/japa/`, label: t("nav.japa") },
      { href: `/${locale}/katha/`, label: t("nav.katha") },
      { href: `/${locale}/my-path/`, label: t("nav.myPath") },
    ],
    [locale, t],
  );

  const moreNav = useMemo(
    () => [
      { href: `/${locale}/gallery/`, label: t("nav.gallery") },
      { href: `/${locale}/calendar/`, label: t("nav.calendar") },
      { href: `/${locale}/parayan/`, label: t("nav.parayan") },
      { href: `/${locale}/radio/`, label: t("nav.radio") },
      { href: `/${locale}/temples/`, label: t("nav.temples") },
      { href: `/${locale}/kids/`, label: t("nav.kids") },
      { href: `/${locale}/sankat/`, label: t("nav.sankat") },
      { href: `/${locale}/glossary/`, label: t("nav.glossary") },
      { href: `/${locale}/faq/`, label: t("nav.faq") },
      { href: `/${locale}/learn/`, label: t("nav.learn") },
    ],
    [locale, t],
  );

  const footerCols = useMemo(
    () => [
      {
        title: locale === "en" ? "Paths" : "Path",
        links: [
          { href: `/${locale}/path/`, label: t("nav.path") },
          { href: `/${locale}/path/sundar-kand/`, label: "Sundar Kand" },
          { href: `/${locale}/path/hanuman-chalisa/`, label: t("nav.chalisa") },
          { href: `/${locale}/path/valmiki-sundarakanda/`, label: "Valmiki SK" },
        ],
      },
      {
        title: locale === "en" ? "Practice" : "Sadhana",
        links: [
          { href: `/${locale}/listen/`, label: t("nav.listen") },
          { href: `/${locale}/japa/`, label: t("nav.japa") },
          { href: `/${locale}/parayan/`, label: t("nav.parayan") },
          { href: `/${locale}/radio/`, label: t("nav.radio") },
        ],
      },
      {
        title: locale === "en" ? "Mandir" : "Mandir",
        links: [
          { href: `/${locale}/temples/`, label: t("nav.temples") },
          { href: `/${locale}/gallery/`, label: t("nav.gallery") },
          { href: `/${locale}/katha/`, label: t("nav.katha") },
          { href: `/${locale}/learn/`, label: t("nav.learn") },
        ],
      },
      {
        title: locale === "en" ? "Help" : "Sahayata",
        links: [
          { href: `/${locale}/faq/`, label: t("nav.faq") },
          { href: `/${locale}/glossary/`, label: t("nav.glossary") },
          { href: `/${locale}/my-path/`, label: t("nav.myPath") },
          { href: `/${locale}/sankat/`, label: t("nav.sankat") },
        ],
      },
    ],
    [locale, t],
  );

  return (
    <div className="min-h-screen" style={{ color: "var(--foreground)" }}>
      {/* Temple gold top filament */}
      <div
        aria-hidden
        className="h-[2px] w-full"
        style={{ background: "var(--temple-frame)" }}
      />

      <header
        className="sticky top-0 z-50 border-b backdrop-blur-xl"
        style={{
          background: "rgba(251, 247, 240, 0.9)",
          borderColor: "var(--hanumat-gold-line)",
        }}
      >
        <div className="shell flex items-center justify-between gap-4 py-3">
          <Link href={`/${locale}/`} className="flex items-center gap-3">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-full text-lg"
              style={{
                border: "1.5px solid var(--hanumat-gold)",
                color: "var(--hanumat-gold-deep)",
                boxShadow: "0 0 0 3px rgba(196,163,90,0.08)",
                fontFamily: "var(--font-display)",
              }}
              aria-hidden
            >
              ॐ
            </span>
            <span className="flex flex-col">
              <span
                className="text-xl leading-none tracking-wide"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--hanumat-shadow)",
                  fontWeight: 600,
                }}
              >
                {t("brand")}
              </span>
              <span
                className="mt-0.5 text-[10px] tracking-[0.14em] uppercase"
                style={{ color: "var(--hanumat-stone)" }}
              >
                {t("tagline")}
              </span>
            </span>
          </Link>

          <nav
            className="hidden items-center gap-0.5 lg:flex"
            aria-label="Primary"
          >
            {primaryNav.map((n) => (
              <Link key={n.href} href={n.href} className="nav-link">
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-0.5 rounded-full border p-0.5"
              style={{ borderColor: "var(--hanumat-gold-line)" }}
              aria-label="Language"
            >
              {locales.map((l) => (
                <Link
                  key={l}
                  href={`/${l}/`}
                  className="rounded-full px-2.5 py-1 text-[11px] uppercase tracking-wide font-semibold"
                  style={
                    l === locale
                      ? {
                          background: "var(--hanumat-vermillion-deep)",
                          color: "var(--hanumat-cream)",
                        }
                      : { color: "var(--hanumat-stone)" }
                  }
                  hrefLang={l}
                >
                  {l}
                </Link>
              ))}
            </div>
            <Link
              href={`/${locale}/path/hanuman-chalisa/`}
              className="btn-primary !px-3 !py-2 text-xs sm:text-sm"
            >
              {t("nav.chalisa")}
            </Link>
          </div>
        </div>

        {/* Mobile primary strip */}
        <nav
          className="shell flex gap-1 overflow-x-auto pb-2 lg:hidden"
          aria-label="Primary mobile"
        >
          {primaryNav.map((n) => (
            <Link
              key={`m-${n.href}`}
              href={n.href}
              className="shrink-0 rounded-full px-3 py-1 text-xs"
              style={{
                background: "var(--hanumat-gold-wash)",
                color: "var(--hanumat-stone)",
                border: "1px solid var(--hanumat-gold-line)",
              }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        {/* Secondary symmetric row */}
        <nav
          className="hidden border-t lg:block"
          style={{ borderColor: "rgba(196,163,90,0.12)" }}
          aria-label="Secondary"
        >
          <div className="shell flex flex-wrap items-center justify-center gap-1 py-1.5">
            {moreNav.map((n) => (
              <Link
                key={`more-${n.href}`}
                href={n.href}
                className="rounded-full px-2.5 py-1 text-[11px] font-medium transition hover:bg-white/70"
                style={{ color: "var(--hanumat-stone)" }}
              >
                {n.label}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      <main className={wide ? "" : "shell section-pad"}>{children}</main>

      <footer
        className="mt-4 border-t"
        style={{
          borderColor: "var(--hanumat-gold-line)",
          background:
            "linear-gradient(180deg, rgba(251,247,240,0.4) 0%, rgba(239,232,219,0.85) 100%)",
        }}
      >
        <div
          aria-hidden
          className="h-px w-full opacity-80"
          style={{ background: "var(--temple-frame)" }}
        />
        <div className="shell py-12">
          <div className="text-center">
            <p
              className="text-2xl"
              style={{
                fontFamily: "var(--font-display)",
                color: "var(--hanumat-shadow)",
                fontWeight: 600,
              }}
            >
              {t("brand")}
            </p>
            <hr className="temple-rule mt-3" />
            <p className="seo-summary mt-4">{t("footer.blurb")}</p>
          </div>

          <div className="pillar-grid pillar-grid-4 mt-10 text-left text-sm">
            {footerCols.map((col) => (
              <div key={col.title} className="px-2">
                <p
                  className="section-kicker mb-3 text-[10px]"
                  style={{ letterSpacing: "0.2em" }}
                >
                  {col.title}
                </p>
                <ul className="space-y-2">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="hover:underline"
                        style={{ color: "var(--hanumat-stone)" }}
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div
            className="mt-10 space-y-2 text-center text-[11px] leading-relaxed"
            style={{ color: "var(--hanumat-stone)" }}
          >
            <p>{t("footer.ttsNote")}</p>
            <p style={{ color: "var(--hanumat-stone-light)" }}>
              Meanings provisional / owner-responsible. Mūla OCR-collated — not a
              Gita Press digital license. TTS is path-assist, not classical pāṭh.
            </p>
            <p className="pt-2" style={{ color: "var(--hanumat-charcoal)" }}>
              Hanumat.life · Shri Hanuman Digital Dham · India ·{" "}
              <a href="mailto:hello@hanumat.life" className="hover:underline">
                hello@hanumat.life
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
