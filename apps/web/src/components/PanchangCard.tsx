"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { panchangFor, sadhanaForPanchang, type PanchangDay } from "@/lib/panchang";
import type { Locale } from "@/i18n/config";

export function PanchangCard({
  locale,
  monthLink = true,
}: {
  locale: Locale;
  monthLink?: boolean;
}) {
  const [p, setP] = useState<PanchangDay | null>(null);
  useEffect(() => {
    setP(panchangFor(new Date()));
  }, []);
  if (!p) {
    return (
      <div className="temple-card p-5 text-sm" style={{ color: "var(--hanumat-stone)" }}>
        …
      </div>
    );
  }
  const en = locale === "en";
  const sadhana = sadhanaForPanchang(p, locale);
  return (
    <article className="temple-card temple-card-frame p-6">
      <p className="section-kicker">{en ? "Today’s panchang" : "आज का पञ्चाङ्ग"}</p>
      <h2 className="section-title mt-1 text-2xl">
        {en ? p.vara.en : p.vara.hi}
        <span className="mx-2 text-sm font-sans" style={{ color: "var(--hanumat-stone)" }}>
          · {p.iso}
        </span>
      </h2>
      <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2" style={{ color: "var(--hanumat-charcoal)" }}>
        <li>
          <span className="section-kicker text-[10px]">{en ? "Tithi" : "तिथि"}</span>
          <p className="font-serif text-lg">
            {en ? p.paksha.en : p.paksha.hi} · {en ? p.tithi.en : p.tithi.hi}
          </p>
        </li>
        <li>
          <span className="section-kicker text-[10px]">{en ? "Nakshatra" : "नक्षत्र"}</span>
          <p className="font-serif text-lg">{en ? p.nakshatra.en : p.nakshatra.hi}</p>
        </li>
      </ul>
      {p.festivals.length > 0 && (
        <p className="mt-3 text-sm" style={{ color: "var(--hanumat-vermillion-deep)" }}>
          {p.festivals.map((f) => (en ? f.en : f.hi)).join(" · ")}
        </p>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        {sadhana.map((s) => (
          <Link key={s.href} href={s.href} className="btn-ghost !px-3 !py-1.5 text-xs">
            {en ? s.label.en : s.label.hi}
          </Link>
        ))}
      </div>
      {monthLink && (
        <p className="mt-4">
          <Link href={`/${locale}/calendar/#panchang`} className="text-xs hover:underline" style={{ color: "var(--hanumat-vermillion-deep)" }}>
            {en ? "Open the month →" : "मास खोलें →"}
          </Link>
        </p>
      )}
      <p className="mt-4 text-[11px]" style={{ color: "var(--hanumat-stone-light)" }}>
        {en
          ? "Household panchang (IST, approximate tithi). Local printed panchang wins. No kundali, no ads, no paid muhurat."
          : "गृह पञ्चाङ्ग (IST, तिथि अनुमानित)। स्थानीय मुद्रित पञ्चाङ्ग मान्य। कुंडली, विज्ञापन, सशुल्क मुहूर्त नहीं।"}
      </p>
    </article>
  );
}
