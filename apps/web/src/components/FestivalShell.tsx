"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/config";

/**
 * Approximate Chaitra-Purnima windows (center ±1 day).
 * Not panchang-accurate — no astrology API; confirm local mandir/panchang.
 */
const JAYANTI_WINDOWS: { start: string; end: string }[] = [
  { start: "2025-04-11", end: "2025-04-13" },
  { start: "2026-04-01", end: "2026-04-03" },
  { start: "2027-03-21", end: "2027-03-23" },
  { start: "2028-04-08", end: "2028-04-10" },
  { start: "2029-03-29", end: "2029-03-31" },
  { start: "2030-04-17", end: "2030-04-19" },
];

type FestivalKind = "mangalwar" | "jayanti" | "both";

type Copy = {
  badge: string;
  title: string;
  body: string;
  chalisa: string;
  japa: string;
  aarti: string;
  sk: string;
  calendar: string;
  note: string;
};

const COPY: Record<"en" | "hi", Record<FestivalKind, Copy>> = {
  en: {
    mangalwar: {
      badge: "Mangalwar",
      title: "Tuesday · Hanuman day",
      body: "Chalisa, japa, aarti, and Sundar Kand — a simple Tuesday path.",
      chalisa: "Chalisa",
      japa: "Japa",
      aarti: "Aarti",
      sk: "Sundar Kand",
      calendar: "Calendar",
      note: "Local customs vary.",
    },
    jayanti: {
      badge: "Jayanti",
      title: "Hanuman Jayanti window",
      body: "Approximate Chaitra Purnima range — confirm with your local panchang.",
      chalisa: "Chalisa",
      japa: "Japa",
      aarti: "Aarti",
      sk: "Sundar Kand",
      calendar: "Traditions",
      note: "Traditions vary by region.",
    },
    both: {
      badge: "Mangalwar · Jayanti",
      title: "Auspicious Tuesday in Jayanti season",
      body: "Chalisa, japa, aarti, and Sundar Kand — double grace today.",
      chalisa: "Chalisa",
      japa: "Japa",
      aarti: "Aarti",
      sk: "Sundar Kand",
      calendar: "Calendar",
      note: "Approximate window · local panchang wins.",
    },
  },
  hi: {
    mangalwar: {
      badge: "मंगलवार",
      title: "मंगलवार · हनुमान दिवस",
      body: "चालीसा, जप, आरती और सुंदरकांड — सरल मंगलवार साधना।",
      chalisa: "चालीसा",
      japa: "जप",
      aarti: "आरती",
      sk: "सुंदरकांड",
      calendar: "कैलेंडर",
      note: "स्थानीय रीति भिन्न हो सकती है।",
    },
    jayanti: {
      badge: "जयन्ती",
      title: "हनुमान जयन्ती अवधि",
      body: "लगभग चैत्र पूर्णिमा — स्थानीय पंचांग से पुष्टि करें।",
      chalisa: "चालीसा",
      japa: "जप",
      aarti: "आरती",
      sk: "सुंदरकांड",
      calendar: "परंपराएँ",
      note: "परंपराएँ क्षेत्र अनुसार भिन्न।",
    },
    both: {
      badge: "मंगलवार · जयन्ती",
      title: "जयन्ती काल में मंगलवार",
      body: "चालीसा, जप, आरती और सुंदरकांड — आज द्विगुण शुभ।",
      chalisa: "चालीसा",
      japa: "जप",
      aarti: "आरती",
      sk: "सुंदरकांड",
      calendar: "कैलेंडर",
      note: "अनुमानित अवधि · स्थानीय पंचांग प्रधान।",
    },
  },
};

function localYmd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function isTuesdayLocal(d: Date): boolean {
  return d.getDay() === 2;
}

function inJayantiWindow(d: Date): boolean {
  const ymd = localYmd(d);
  return JAYANTI_WINDOWS.some((w) => ymd >= w.start && ymd <= w.end);
}

function resolveKind(d: Date): FestivalKind | null {
  const tue = isTuesdayLocal(d);
  const jay = inJayantiWindow(d);
  if (tue && jay) return "both";
  if (tue) return "mangalwar";
  if (jay) return "jayanti";
  return null;
}

/**
 * Signature festival takeover — saffron banner on home when Mangalwar
 * (local Tuesday) or a simple approximate Jayanti window is active.
 */
export function FestivalShell() {
  const locale = useLocale() as Locale;
  /** null until mounted — server + first client paint both empty (no hydration mismatch) */
  const [kind, setKind] = useState<FestivalKind | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setKind(resolveKind(new Date()));
  }, []);

  if (!mounted || !kind) return null;

  const lang = locale === "hi" ? "hi" : "en";
  const c = COPY[lang][kind];
  const base = `/${locale}`;

  const ctas = [
    { href: `${base}/path/hanuman-chalisa/`, label: c.chalisa },
    { href: `${base}/japa/`, label: c.japa },
    { href: `${base}/path/hanuman-aarti/`, label: c.aarti },
    { href: `${base}/path/sundar-kand/`, label: c.sk },
  ] as const;

  return (
    <aside
      role="region"
      aria-label={c.badge}
      className="relative overflow-hidden border-b border-[#e85d04]/50"
      style={{
        background:
          "linear-gradient(105deg, #e85d04 0%, #f48c06 42%, #ffba08 78%, #ffd60a 100%)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 12% 50%, rgba(255,248,231,0.55) 0%, transparent 42%), radial-gradient(circle at 88% 20%, rgba(255,214,10,0.45) 0%, transparent 36%)",
        }}
      />
      <div className="relative mx-auto flex max-w-5xl flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between sm:py-5">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1a0f2e]/80">
            {c.badge}
          </p>
          <h2 className="mt-0.5 font-serif text-xl leading-snug text-[#1a0f2e] sm:text-2xl">
            {c.title}
          </h2>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-[#3d2914]/90">
            {c.body}{" "}
            <span className="text-[#3d2914]/65">{c.note}</span>
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
          <div className="flex flex-wrap gap-2 sm:justify-end">
            {ctas.map((cta) => (
              <Link
                key={cta.href}
                href={cta.href}
                className="rounded-full bg-[#1a0f2e] px-3.5 py-1.5 text-xs font-semibold text-[#fff8e7] shadow-sm transition hover:bg-[#24143d] sm:text-sm"
              >
                {cta.label}
              </Link>
            ))}
          </div>
          <Link
            href={`${base}/calendar/`}
            className="text-[11px] font-medium text-[#1a0f2e]/75 underline-offset-2 hover:underline"
          >
            {c.calendar} →
          </Link>
        </div>
      </div>
    </aside>
  );
}
