import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/SiteShell";
import { allTexts } from "@/lib/content";
import { isLocale, type Locale } from "@/i18n/config";

export default async function LearnPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  setRequestLocale(raw as Locale);
  const t = await getTranslations("learn");

  return (
    <SiteShell>
      <h1 className="section-title text-4xl">{t("title")}</h1>
      <p className="mt-2 max-w-xl text-sm text-[var(--hanumat-stone)]">{t("intro")}</p>

      <section className="mt-8 space-y-4 text-sm leading-relaxed text-[var(--hanumat-stone)]">
        <div className="temple-card p-5">
          <h2 className="font-serif text-lg text-[var(--hanumat-vermillion-deep)]">Edition</h2>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>
              Sundar Kand pin{" "}
              <code className="text-[var(--hanumat-vermillion-deep)]">GP-MANAS-81-2025</code> (Gita
              Press code 81 · year 2025)
            </li>
            <li>
              Chalisa pin{" "}
              <code className="text-[var(--hanumat-vermillion-deep)]">GP-MANAS-81-2025-CHALISA</code>
            </li>
            <li>
              Mūla collated from Gita Press Hindi Manas OCR (archive source);
              dual-review process in{" "}
              <code>docs/editorial/dual-review.md</code>
            </li>
            <li>
              HI/EN meanings: original Hanumat plain language — no ṭīkā copy
            </li>
          </ul>
        </div>
        <div className="temple-card p-5">
          <h2 className="font-serif text-lg text-[var(--hanumat-vermillion-deep)]">Path Studio</h2>
          <p className="mt-2">
            Text only: mūla, IAST (Roman letters), and Hindi/English meaning.
            No recitation audio.
          </p>
        </div>
        <div className="temple-card p-5">
          <h2 className="font-serif text-lg text-[var(--hanumat-vermillion-deep)]">Waves shipped</h2>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>
              <strong className="text-[var(--hanumat-shadow)]">Wave 0:</strong> Chalisa + full
              Sundar Kand Manas (text, IAST, HI/EN, offline Chalisa)
            </li>
            <li>
              <strong className="text-[var(--hanumat-shadow)]">Wave 1:</strong> Baan, Ashtak,
              Aarti, 108 names · Japa · Calendar · Sankat · SK section packs ·
              Shravan
            </li>
            <li>
              <strong className="text-[var(--hanumat-shadow)]">Wave 2:</strong> Valmiki sample +
              twin-text · Bahuk/Kavach/Maruti · Katha arcs
            </li>
            <li>
              <strong className="text-[var(--hanumat-shadow)]">Wave 3:</strong> Parayan ·
              Temples · Kids · My Path export/import (local sync)
            </li>
          </ul>
          <p className="mt-3 text-xs text-[var(--hanumat-sacred-ash)]">
            {allTexts.length} path packages in catalog
          </p>
        </div>
        <div className="temple-card p-5">
          <h2 className="font-serif text-lg text-[var(--hanumat-vermillion-deep)]">Disclaimers (v1)</h2>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>
              <strong className="text-[var(--hanumat-shadow)]">Meanings:</strong> provisional /
              owner-responsible; regional locales are{" "}
              <em>HI-equivalent</em> (machine-translated from Hindi meanings) —
              not scholarly ṭīkā
            </li>
            <li>
              <strong className="text-[var(--hanumat-shadow)]">Mūla:</strong> OCR-collated under
              owner responsibility — not a Gita Press digital license claim
            </li>
          </ul>
        </div>
        <div className="temple-card p-5">
          <h2 className="font-serif text-lg text-[var(--hanumat-vermillion-deep)]">Principles</h2>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>No ads in Path Studio · no monetization Wave 0/v1</li>
            <li>Traditions may vary</li>
            <li>
              Report errors:{" "}
              <a
                className="text-[var(--hanumat-vermillion-deep)] hover:underline"
                href="mailto:hello@hanumat.life?subject=Hanumat%20text%20error"
              >
                hello@hanumat.life
              </a>
            </li>
          </ul>
        </div>
      </section>
    </SiteShell>
  );
}
