import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/SiteShell";
import { isLocale, type Locale } from "@/i18n/config";

const TERMS = [
  {
    term: "Sundar Kand",
    hi: "सुंदरकांड",
    body: "The beautiful canto of Ramcharitmanas centered on Hanuman’s leap, search for Sita, and Lanka.",
  },
  {
    term: "Chalisa",
    hi: "चालीसा",
    body: "Forty chaupai verses of praise to Hanuman by Tulsidas, with opening and closing dohas.",
  },
  {
    term: "Chaupai",
    hi: "चौपाई",
    body: "A quatrain metre used extensively in Ramcharitmanas.",
  },
  {
    term: "Doha",
    hi: "दोहा",
    body: "A couplet form framing many Manas episodes.",
  },
  {
    term: "Parayan",
    hi: "पारायण",
    body: "Scheduled complete reading of a text over days.",
  },
  {
    term: "Japa",
    hi: "जप",
    body: "Repetition of a mantra with count (mālā).",
  },
  {
    term: "Path-assist TTS",
    hi: "पाठ-सहायक श्रवण",
    body: "Neural speech for following the text — not classical pāṭh recitation.",
  },
  {
    term: "Twin-text",
    hi: "द्वि-पाठ",
    body: "Alignment of Manas Awadhi with Valmiki Sanskrit Sundarakanda passages.",
  },
];

export default async function GlossaryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  setRequestLocale(raw as Locale);

  return (
    <SiteShell>
      <p className="text-xs text-[#6b5a80]">Wave 1 · Knowledge</p>
      <h1 className="font-serif text-4xl text-[#fff8e7]">Glossary</h1>
      <p className="mt-2 text-sm text-[#a994c4]">
        Short terms for devotees — not a scholarly dictionary.
      </p>
      <ul className="mt-8 space-y-4">
        {TERMS.map((t) => (
          <li
            key={t.term}
            className="rounded-2xl border border-white/12 bg-white/5 p-5"
          >
            <h2 className="font-serif text-xl text-[#fff8e7]">
              {t.term}{" "}
              <span className="text-base text-[#f48c06]" lang="hi">
                {t.hi}
              </span>
            </h2>
            <p className="mt-2 text-sm text-[#cbb8e0]">{t.body}</p>
          </li>
        ))}
      </ul>
    </SiteShell>
  );
}
