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
      <h1 className="font-serif text-4xl text-[#fff8e7]">{t("title")}</h1>
      <p className="mt-2 max-w-xl text-sm text-[#a994c4]">{t("intro")}</p>

      <section className="mt-8 space-y-4 text-sm leading-relaxed text-[#cbb8e0]">
        <div className="rounded-2xl border border-white/12 bg-white/5 p-5">
          <h2 className="font-serif text-lg text-[#ffd60a]">Edition</h2>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>
              Sundar Kand pin{" "}
              <code className="text-[#ffd60a]">GP-MANAS-81-2025</code> (Gita
              Press code 81 · year 2025)
            </li>
            <li>
              Chalisa pin{" "}
              <code className="text-[#ffd60a]">GP-MANAS-81-2025-CHALISA</code>
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
        <div className="rounded-2xl border border-white/12 bg-white/5 p-5">
          <h2 className="font-serif text-lg text-[#ffd60a]">Audio (P3)</h2>
          <p className="mt-2">
            <strong className="text-[#fff8e7]">Wave 0 production decision:</strong>{" "}
            neural Hindi TTS (Edge <code>hi-IN-MadhurNeural</code>) with verse
            cues — labeled path-assist, <em>not</em> classical pāṭh. Schema is
            replaceable when commissioned studio recitation is delivered.
          </p>
        </div>
        <div className="rounded-2xl border border-white/12 bg-white/5 p-5">
          <h2 className="font-serif text-lg text-[#ffd60a]">Waves shipped</h2>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>
              <strong className="text-[#fff8e7]">Wave 0:</strong> Chalisa + full
              Sundar Kand Manas (text, IAST, HI/EN, audio, offline Chalisa)
            </li>
            <li>
              <strong className="text-[#fff8e7]">Wave 1:</strong> Baan, Ashtak,
              Aarti, 108 names · Japa · Calendar · Sankat · SK section packs ·
              Shravan
            </li>
            <li>
              <strong className="text-[#fff8e7]">Wave 2:</strong> Valmiki sample +
              twin-text · Bahuk/Kavach/Maruti · Katha arcs
            </li>
            <li>
              <strong className="text-[#fff8e7]">Wave 3:</strong> Parayan ·
              Temples · Kids · My Path export/import (local sync)
            </li>
          </ul>
          <p className="mt-3 text-xs text-[#6b5a80]">
            {allTexts.length} path packages in catalog
          </p>
        </div>
        <div className="rounded-2xl border border-[#ffd60a]/30 bg-[#ffd60a]/10 p-5">
          <h2 className="font-serif text-lg text-[#ffd60a]">Disclaimers (v1)</h2>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>
              <strong className="text-[#fff8e7]">Audio:</strong> neural TTS
              path-assist — not classical pāṭh
            </li>
            <li>
              <strong className="text-[#fff8e7]">Meanings:</strong> provisional /
              owner-responsible; regional locales are{" "}
              <em>HI-equivalent</em> (machine-translated from Hindi meanings) —
              not scholarly ṭīkā
            </li>
            <li>
              <strong className="text-[#fff8e7]">Mūla:</strong> OCR-collated under
              owner responsibility — not a Gita Press digital license claim
            </li>
          </ul>
        </div>
        <div className="rounded-2xl border border-white/12 bg-white/5 p-5">
          <h2 className="font-serif text-lg text-[#ffd60a]">Principles</h2>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>No ads in Path Studio · no monetization Wave 0/v1</li>
            <li>Traditions may vary</li>
            <li>
              Report errors:{" "}
              <a
                className="text-[#f48c06] hover:underline"
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
