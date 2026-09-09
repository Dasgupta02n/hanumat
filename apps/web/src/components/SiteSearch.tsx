"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { DeityId } from "@/lib/deities";
import { deities } from "@/lib/deities";
import { searchSite } from "@/lib/search-index";
import type { Locale } from "@/i18n/config";

export function SiteSearch({
  deity,
  locale,
  compact,
}: {
  deity?: DeityId;
  locale: Locale;
  compact?: boolean;
}) {
  const en = locale === "en";
  const [q, setQ] = useState("");
  const hits = useMemo(
    () => searchSite(q, { deity, locale, limit: compact ? 8 : 24 }),
    [q, deity, locale, compact],
  );

  const kindLabel: Record<string, string> = en
    ? { path: "Path", verse: "Verse", temple: "Temple", glossary: "Term", leela: "Leela" }
    : { path: "पाठ", verse: "श्लोक", temple: "क्षेत्र", glossary: "शब्द", leela: "लीला" };

  return (
    <div>
      <label className="sr-only" htmlFor={compact ? "courtyard-search" : "site-search"}>
        {en ? "Search verses, paths, temples" : "श्लोक, पाठ, मंदिर खोजें"}
      </label>
      <input
        id={compact ? "courtyard-search" : "site-search"}
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={
          en
            ? "Search verse, path, temple, leela (hi · en · IAST)"
            : "श्लोक, पाठ, क्षेत्र, लीला खोजें (हि · en · IAST)"
        }
        className="w-full rounded-full border px-4 py-3 text-sm"
        style={{
          borderColor: "var(--hanumat-gold-line)",
          background: "var(--hanumat-cream)",
          color: "var(--hanumat-shadow)",
        }}
      />
      {q.trim().length >= 2 && (
        <ul className="mt-4 space-y-2">
          {hits.length === 0 && (
            <li className="text-sm" style={{ color: "var(--hanumat-stone)" }}>
              {en ? "No matches." : "कोई मेल नहीं।"}
            </li>
          )}
          {hits.map((h) => (
            <li key={h.id}>
              <Link
                href={h.href}
                className="temple-card block px-4 py-3"
              >
                <p className="text-[10px] uppercase tracking-wider" style={{ color: "var(--hanumat-gold-deep)" }}>
                  {kindLabel[h.kind]} · {en ? deities[h.deity].brand.en : deities[h.deity].brand.hi}
                </p>
                <p className="font-serif text-base" lang={en ? undefined : "hi"}>
                  {en ? h.title : h.titleHi}
                </p>
                <p className="mt-0.5 text-xs" style={{ color: "var(--hanumat-stone)" }}>
                  {h.snippet}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
