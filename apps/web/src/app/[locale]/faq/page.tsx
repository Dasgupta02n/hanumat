import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/SiteShell";
import { isLocale, type Locale } from "@/i18n/config";

const FAQS = [
  {
    q: "Is the audio classical pāṭh?",
    a: "No. Wave v1 uses neural TTS path-assist so you can follow the text. Studio recitation may replace it later; schema supports that.",
  },
  {
    q: "Are meanings official ṭīkā?",
    a: "No. Meanings are provisional plain language under owner responsibility. Non-hi/en locales use machine-assisted drafts with clear banners.",
  },
  {
    q: "Is this an official Gita Press digital edition?",
    a: "No. Mūla is OCR-collated toward GP-MANAS-81-2025 under owner responsibility. Not a licensed GP digital product.",
  },
  {
    q: "Does Hanumat show ads?",
    a: "No. Pure seva for v1 — no ads, no paywall, no paid packs.",
  },
  {
    q: "How do I go offline?",
    a: "My Path → download Chalisa pack. SK section packs are also available per episode.",
  },
  {
    q: "How do I report a text error?",
    a: "Use the report link in Path Studio or email hello@hanumat.life with verseId.",
  },
];

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  setRequestLocale(raw as Locale);

  return (
    <SiteShell>
      <p className="text-xs text-[#6b5a80]">Wave 3 · Knowledge</p>
      <h1 className="font-serif text-4xl text-[#fff8e7]">FAQ</h1>
      <div className="mt-8 space-y-4">
        {FAQS.map((f) => (
          <article
            key={f.q}
            className="rounded-2xl border border-white/12 bg-white/5 p-5"
          >
            <h2 className="font-serif text-lg text-[#ffd60a]">{f.q}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#cbb8e0]">{f.a}</p>
          </article>
        ))}
      </div>
    </SiteShell>
  );
}
