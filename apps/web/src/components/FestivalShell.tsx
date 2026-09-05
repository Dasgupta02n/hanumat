"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/config";
import { useDeity } from "./DeityProvider";
import { todayForDeity, type TodayCard } from "@/lib/today";
import { deityHref } from "@/lib/deities";

/**
 * Festival takeover on a mandir home — Tuesday / Jayanti / Monday /
 * Shivaratri / Amavasya / Kali puja. Empty until mounted (no hydration mismatch).
 */
export function FestivalShell() {
  const locale = useLocale() as Locale;
  const deity = useDeity();
  const [card, setCard] = useState<TodayCard | null>(null);

  useEffect(() => {
    const next = todayForDeity(deity.id, locale, new Date());
    setCard(next.highlight ? next : null);
  }, [deity.id, locale]);

  if (!card) return null;

  const en = locale === "en";
  const calendar = deityHref(deity.id, locale, "/calendar/");

  return (
    <aside
      role="region"
      aria-label={en ? card.badge.en : card.badge.hi}
      className="relative overflow-hidden border-b"
      style={{
        borderColor: "rgba(232,93,4,0.45)",
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
            {en ? card.badge.en : card.badge.hi}
          </p>
          <h2 className="mt-0.5 font-serif text-xl leading-snug text-[#1a0f2e] sm:text-2xl">
            {en ? card.title.en : card.title.hi}
          </h2>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-[#3d2914]/80">
            {en
              ? "Local panchang and family custom win."
              : "स्थानीय पंचांग और घर की रीति मान्य।"}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
          <div className="flex flex-wrap gap-2 sm:justify-end">
            <Link
              href={card.href}
              className="rounded-full bg-[#1a0f2e] px-3.5 py-1.5 text-xs font-semibold text-[#fff8e7] shadow-sm transition hover:bg-[#24143d] sm:text-sm"
            >
              {en ? "Open path" : "पाठ खोलें"}
            </Link>
            <Link
              href={deityHref(deity.id, locale, "/japa/")}
              className="rounded-full bg-[#1a0f2e] px-3.5 py-1.5 text-xs font-semibold text-[#fff8e7] shadow-sm transition hover:bg-[#24143d] sm:text-sm"
            >
              {en ? "Japa" : "जप"}
            </Link>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                `${en ? card.title.en : card.title.hi}\nhttps://hanumat.life${card.href}\nFree mandir · no ads · hanumat.life`,
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#1a0f2e] px-3.5 py-1.5 text-xs font-semibold text-[#fff8e7] shadow-sm transition hover:bg-[#24143d] sm:text-sm"
            >
              WhatsApp
            </a>
          </div>
          <Link
            href={calendar}
            className="text-[11px] font-medium text-[#1a0f2e]/75 underline-offset-2 hover:underline"
          >
            {en ? "Calendar" : "कैलेंडर"} →
          </Link>
        </div>
      </div>
    </aside>
  );
}
