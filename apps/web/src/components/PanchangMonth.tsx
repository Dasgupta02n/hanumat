"use client";

import { useEffect, useMemo, useState } from "react";
import {
  panchangFor,
  panchangMonth,
  type PanchangDay,
} from "@/lib/panchang";
import { monthLabel, tithiLabel, type PanjikaId } from "@/lib/panchang-regions";
import type { Locale } from "@/i18n/config";

const WD_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WD_HI = ["रवि", "सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"];
const MONTH_EN = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const MONTH_HI = [
  "जनवरी",
  "फरवरी",
  "मार्च",
  "अप्रैल",
  "मई",
  "जून",
  "जुलाई",
  "अगस्त",
  "सितम्बर",
  "अक्टूबर",
  "नवम्बर",
  "दिसम्बर",
];

export function PanchangMonth({
  locale,
  panjika = "hindi",
}: {
  locale: Locale;
  panjika?: PanjikaId;
}) {
  const [today, setToday] = useState<PanchangDay | null>(null);
  const [cursor, setCursor] = useState<{ y: number; m: number } | null>(null);
  const [picked, setPicked] = useState<PanchangDay | null>(null);
  const en = locale === "en";

  useEffect(() => {
    const p = panchangFor(new Date());
    setToday(p);
    const [y, m] = p.iso.split("-").map(Number);
    setCursor({ y, m });
  }, []);

  const days = useMemo(
    () => (cursor ? panchangMonth(cursor.y, cursor.m) : []),
    [cursor],
  );
  const lead = days[0]?.weekday ?? 0;
  const cells: (PanchangDay | null)[] = [
    ...Array.from({ length: lead }, () => null),
    ...days,
  ];
  while (cells.length % 7) cells.push(null);

  if (!cursor || !today) {
    return (
      <div className="temple-card p-5 text-sm" style={{ color: "var(--hanumat-stone)" }}>
        …
      </div>
    );
  }

  const shift = (delta: number) => {
    let m = cursor.m + delta;
    let y = cursor.y;
    if (m < 1) {
      m = 12;
      y -= 1;
    }
    if (m > 12) {
      m = 1;
      y += 1;
    }
    setCursor({ y, m });
    setPicked(null);
  };

  const shown = picked || today;
  const shukla = shown.paksha.en.startsWith("Shukla");

  return (
    <article className="temple-card temple-card-frame p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <button type="button" className="btn-ghost !px-3 !py-1.5 text-xs" onClick={() => shift(-1)}>
          ←
        </button>
        <h2 className="section-title text-xl sm:text-2xl">
          {en ? MONTH_EN[cursor.m - 1] : MONTH_HI[cursor.m - 1]} {cursor.y}
        </h2>
        <button type="button" className="btn-ghost !px-3 !py-1.5 text-xs" onClick={() => shift(1)}>
          →
        </button>
      </div>
      <p className="mt-1 text-xs" style={{ color: "var(--hanumat-stone)" }}>
        {en
          ? "Household month (IST, approximate tithi). Tap a day. Local printed panjika wins."
          : "गृह मास (IST, तिथि अनुमानित)। दिन चुनें। स्थानीय मुद्रित पञ्जिका मान्य।"}
      </p>
      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[10px] sm:text-xs" style={{ color: "var(--hanumat-charcoal)" }}>
        {(en ? WD_EN : WD_HI).map((w) => (
          <div key={w} className="py-1 font-medium">
            {w}
          </div>
        ))}
        {cells.map((d, i) => {
          if (!d) return <div key={`e-${i}`} />;
          const isToday = d.iso === today.iso;
          const isPicked = picked?.iso === d.iso;
          const mark = d.festivals.length > 0 || d.flags.ekadashi || d.flags.purnima || d.flags.amavasya;
          return (
            <button
              type="button"
              key={d.iso}
              title={`${d.iso} · ${en ? d.tithi.en : d.tithi.hi}${d.festivals[0] ? " · " + (en ? d.festivals[0].en : d.festivals[0].hi) : ""}`}
              className="rounded-lg px-0.5 py-1.5 leading-tight"
              style={{
                background: isToday || isPicked
                  ? "color-mix(in srgb, var(--hanumat-vermillion) 18%, transparent)"
                  : mark
                    ? "color-mix(in srgb, var(--hanumat-gold, #c9a227) 12%, transparent)"
                    : "transparent",
                color: "var(--hanumat-charcoal)",
                outline: isToday || isPicked ? "1px solid var(--hanumat-vermillion-deep)" : undefined,
              }}
              onClick={() => setPicked(d)}
            >
              <span className="block text-sm font-serif">{Number(d.iso.slice(-2))}</span>
              <span className="block truncate" style={{ color: "var(--hanumat-charcoal)" }}>
                {tithiLabel(d.tithiNum, d.paksha.en.startsWith("Shukla"), panjika, en ? "en" : "hi").slice(0, 4)}
              </span>
            </button>
          );
        })}
      </div>
      <p className="mt-4 text-sm" style={{ color: "var(--hanumat-charcoal)" }}>
        <strong>{shown.iso}</strong>
        {" · "}
        {monthLabel(shown.iso, panjika, en ? "en" : "hi")}
        {" · "}
        {tithiLabel(shown.tithiNum, shukla, panjika, en ? "en" : "hi")}
        {shown.festivals[0] ? ` · ${en ? shown.festivals[0].en : shown.festivals[0].hi}` : ""}
      </p>
    </article>
  );
}
