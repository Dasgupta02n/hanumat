"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { PanchangCard } from "@/components/PanchangCard";
import { PanchangMonth } from "@/components/PanchangMonth";
import { householdMuhurat } from "@/lib/muhurat";
import { panchangFor } from "@/lib/panchang";
import {
  PANJIKA,
  isPanjikaId,
  panjikaById,
  yearFestivals,
  type PanjikaId,
} from "@/lib/panchang-regions";
import { HUB_TILES, YEAR_RITUALS } from "@/lib/year-rituals";
import type { Locale } from "@/i18n/config";

const STORE = "hanumat-panjika";

export function PanchangHub() {
  const [ui, setUi] = useState<Locale>("en");
  const [panjika, setPanjika] = useState<PanjikaId>("hindi");
  const [weekday, setWeekday] = useState(0);
  const [iso, setIso] = useState("");
  const en = ui === "en";

  useEffect(() => {
    const saved = window.localStorage.getItem(STORE);
    if (saved && isPanjikaId(saved)) setPanjika(saved);
    const p = panchangFor(new Date());
    setWeekday(p.weekday);
    setIso(p.iso);
  }, []);

  const def = panjikaById(panjika);
  const year = iso ? Number(iso.slice(0, 4)) : 2026;
  const fests = useMemo(() => yearFestivals(year, panjika), [year, panjika]);
  const muhurat = iso ? householdMuhurat(iso, weekday) : [];

  return (
    <div>
      <p className="section-kicker">{en ? "Courtyard · year calendar" : "आंगन · वर्ष पञ्चाङ्ग"}</p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
        <h1 className="section-title text-4xl">{en ? "Panchang, muhurat, festivals" : "पञ्चाङ्ग, मुहूर्त, त्यौहार"}</h1>
        <div className="flex gap-1 rounded-full border p-0.5" style={{ borderColor: "var(--hanumat-gold-line)" }}>
          {(["en", "hi"] as const).map((l) => (
            <button
              key={l}
              type="button"
              className="rounded-full px-3 py-1 text-xs font-semibold uppercase"
              style={
                l === ui
                  ? { background: "var(--hanumat-vermillion-deep)", color: "var(--hanumat-cream)" }
                  : { color: "var(--hanumat-stone)" }
              }
              onClick={() => setUi(l)}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-3 max-w-2xl text-sm" style={{ color: "var(--hanumat-stone)" }}>
        {en
          ? "Standalone courtyard calendar — not repeated inside the three mandirs. Household tithi (IST). Choose a panjika lens. Local printed panchang wins. No kundali, no paid muhurat."
          : "आंगन का स्वतन्त्र पञ्चाङ्ग — तीन धाम के भीतर दोहराया नहीं। गृह तिथि (IST)। पञ्जिका चुनें। मुद्रित पञ्चाङ्ग मान्य। कुंडली व सशुल्क मुहूर्त नहीं।"}
      </p>

      <div className="courtyard-panchang-tiles mt-8">
        {HUB_TILES.map((tile) => (
          <a key={tile.id} href={tile.href} className="temple-card temple-card-frame p-5">
            <p className="section-kicker">{tile.id}</p>
            <h2 className="section-title mt-2 text-2xl">{en ? tile.en : tile.hi}</h2>
            <p className="mt-2 text-sm" style={{ color: "var(--hanumat-stone)" }}>
              {en ? tile.enSub : tile.hiSub}
            </p>
          </a>
        ))}
      </div>

      <section id="panchang" className="mt-12 scroll-mt-28">
        <h2 className="section-title text-3xl">{en ? "Panchang" : "पञ्चाङ्ग"}</h2>
        <p className="mt-2 text-sm" style={{ color: "var(--hanumat-stone)" }}>
          {en ? def.en : def.native} · {def.region} · {def.newYear}
        </p>
        <label className="mt-4 block text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--hanumat-vermillion-deep)" }}>
          {en ? "Panjika / regional panchang" : "पञ्जिका / क्षेत्रीय पञ्चाङ्ग"}
          <select
            className="mt-2 block w-full max-w-md rounded-full border px-4 py-2 text-sm font-semibold normal-case tracking-normal"
            style={{
              borderColor: "var(--hanumat-gold-line)",
              color: "var(--hanumat-charcoal)",
              background: "var(--hanumat-cream)",
            }}
            value={panjika}
            onChange={(e) => {
              const next = e.target.value;
              if (!isPanjikaId(next)) return;
              setPanjika(next);
              window.localStorage.setItem(STORE, next);
            }}
          >
            {PANJIKA.map((p) => (
              <option key={p.id} value={p.id}>
                {p.native} · {p.en}
              </option>
            ))}
          </select>
        </label>
        <div className="mt-6 space-y-6">
          <PanchangCard locale={ui} panjika={panjika} monthLink={false} />
          <PanchangMonth locale={ui} panjika={panjika} />
        </div>
      </section>

      <section id="muhurat" className="mt-12 scroll-mt-28">
        <h2 className="section-title text-3xl">{en ? "Muhurat" : "मुहूर्त"}</h2>
        <p className="mt-2 max-w-2xl text-sm" style={{ color: "var(--hanumat-stone)" }}>
          {en
            ? "Household windows from approximate sunrise–sunset (IST). Not a kundali, not a priest booking, not a paid muhurat. Confirm a printed panjika."
            : "प्रभात–सायं का गृह अनुमान (IST)। कुंडली नहीं, पुरोहित बुकिंग नहीं, सशुल्क मुहूर्त नहीं। मुद्रित पञ्जिका देखें।"}
        </p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {muhurat.map((w) => (
            <li key={w.id} className="temple-card p-5">
              <p className="section-kicker">{w.kind === "avoid" ? (en ? "Often paused" : "अक्सर छोड़ें") : (en ? "Quiet window" : "शांत काल")}</p>
              <h3 className="section-title mt-1 text-xl">{en ? w.en : w.hi}</h3>
              <p className="mt-2 font-serif text-lg" style={{ color: "var(--hanumat-charcoal)" }}>
                {w.start} – {w.end} IST
              </p>
              <p className="mt-2 text-sm" style={{ color: "var(--hanumat-stone)" }}>
                {en ? w.noteEn : w.noteHi}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section id="festivals" className="mt-12 scroll-mt-28">
        <h2 className="section-title text-3xl">{en ? `${year} festivals` : `${year} त्यौहार`}</h2>
        <p className="mt-2 max-w-2xl text-sm" style={{ color: "var(--hanumat-stone)" }}>
          {en
            ? "Named days for this panjika lens. Tithi-overlap is a window. Paths open the matching mandir."
            : "इस पञ्जिका के नामित दिन। तिथि-अतिव्याप्ति एक खिड़की है। पाठ उसी धाम में खुलते हैं।"}
        </p>
        <ul className="mt-6 space-y-3">
          {fests.map((f) => (
            <li key={`${f.start}-${f.en}`} className="temple-card flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <div>
                <p className="text-xs" style={{ color: "var(--hanumat-vermillion-deep)" }}>
                  {f.start === f.end ? f.start : `${f.start} → ${f.end}`}
                  {f.deity && f.deity !== "sarva" ? ` · ${f.deity}` : ""}
                </p>
                <p className="font-serif text-lg">{en ? f.en : f.hi}</p>
              </div>
              {f.href && (
                <Link href={f.href} className="btn-ghost !px-3 !py-1.5 text-xs">
                  {en ? "Open path" : "पाठ खोलें"}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section id="rituals" className="mt-12 scroll-mt-28">
        <h2 className="section-title text-3xl">{en ? "Rituals of the three dhams" : "तीन धाम के अनुष्ठान"}</h2>
        <p className="mt-2 max-w-2xl text-sm" style={{ color: "var(--hanumat-stone)" }}>
          {en
            ? "Each rite opens the matching Hanumat page — Hanuman, Shiva, or Kali. No paid puja."
            : "प्रत्येक अनुष्ठान उसी धाम के पृष्ठ पर खुलता है। सशुल्क पूजा नहीं।"}
        </p>
        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {(["hanuman", "shiva", "kali"] as const).map((deity) => (
            <div key={deity}>
              <h3 className="section-title text-2xl">
                {deity === "hanuman" ? (en ? "Hanuman" : "हनुमान") : deity === "shiva" ? (en ? "Shiva" : "शिव") : en ? "Kali" : "काली"}
              </h3>
              <ul className="mt-4 space-y-3">
                {YEAR_RITUALS.filter((r) => r.deity === deity).map((r) => (
                  <li key={r.id}>
                    <Link href={r.href} className="temple-card block p-4">
                      <p className="font-serif text-lg">{en ? r.en : r.hi}</p>
                      <p className="mt-1 text-xs" style={{ color: "var(--hanumat-stone)" }}>
                        {en ? r.whenEn : r.whenHi}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function CourtyardPanchangTiles({ locale = "en" }: { locale?: Locale }) {
  const en = locale === "en";
  return (
    <div className="courtyard-panchang-tiles">
      {HUB_TILES.map((tile) => (
        <Link key={tile.id} href={tile.href} className="temple-card temple-card-frame p-5">
          <p className="section-kicker">{tile.id}</p>
          <h2 className="section-title mt-2 text-xl sm:text-2xl">{en ? tile.en : tile.hi}</h2>
          <p className="mt-2 text-sm" style={{ color: "var(--hanumat-stone)" }}>
            {en ? tile.enSub : tile.hiSub}
          </p>
          <span className="mt-3 inline-block text-xs" style={{ color: "var(--hanumat-vermillion-deep)" }}>
            {en ? "Open →" : "खोलें →"}
          </span>
        </Link>
      ))}
    </div>
  );
}
