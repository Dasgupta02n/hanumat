"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { deities, deityHref, DEITY_IDS, type DeityId } from "@/lib/deities";
import { loadLastMandir } from "@/lib/last-mandir";
import { loadResume } from "@/lib/my-path";
import { hydrateMyPath } from "@/lib/my-path";
import { getTextBySlug } from "@/lib/content";
import { todayForDeity, leelaOfDay } from "@/lib/today";
import { getGallery, gallerySrc } from "@/lib/gallery";
import { SiteSearch } from "@/components/SiteSearch";
import { isDeityId } from "@/lib/deities";
import { defaultLocale } from "@/i18n/config";

export function CourtyardGate() {
  const locale = defaultLocale;
  const [last, setLast] = useState<DeityId | null>(null);
  const [recent, setRecent] = useState<{ href: string; label: string }[]>([]);
  const [today, setToday] = useState(() =>
    DEITY_IDS.map((id) => todayForDeity(id, locale)),
  );

  useEffect(() => {
    setLast(loadLastMandir());
    setToday(DEITY_IDS.map((id) => todayForDeity(id, locale, new Date())));
    void hydrateMyPath().then(() => {
      const resume = loadResume().slice(0, 4);
      setRecent(
        resume.map((r) => {
          const pack = getTextBySlug(r.slug);
          const deity = (pack?.deity && isDeityId(pack.deity) ? pack.deity : "hanuman") as DeityId;
          return {
            href: `${deityHref(deity, locale, `/path/${r.slug}/`)}${r.verseId ? `?verse=${r.verseId}` : ""}`,
            label: pack ? pack.title.en : r.slug,
          };
        }),
      );
    });
  }, [locale]);

  return (
    <section className="courtyard-gate" aria-label="Today in the three dhams">
      <div className="courtyard-gate-inner">
        {last && (
          <p className="courtyard-last">
            <Link href={deityHref(last, locale, "/")} className="landing-enter">
              Open last mandir · {deities[last].brand.en} →
            </Link>
          </p>
        )}

        <h2 className="landing-sub" style={{ marginTop: "2.5rem" }}>
          Today in the three dhams
        </h2>
        <p className="landing-card-copy" style={{ textAlign: "center", marginBottom: "1.25rem" }} lang="hi">
          आज तीन धाम में
        </p>

        <div className="landing-grid courtyard-today">
          {today.map((c) => (
            <article key={c.deity} className={`landing-card landing-card-${c.deity}`}>
              <Link href={c.href} className="landing-card-link">
                <div className="landing-card-img" style={{ minHeight: 140 }}>
                  <Image src={c.leelaSrc} alt="" fill sizes="33vw" />
                  <div className="landing-card-veil" />
                </div>
                <div className="landing-card-body">
                  <p className="landing-card-kicker">{c.badge.en}</p>
                  <h3>{c.title.en}</h3>
                  <p className="landing-card-copy" lang="hi">
                    {c.title.hi}
                  </p>
                  <span className="landing-enter">Open path →</span>
                </div>
              </Link>
            </article>
          ))}
        </div>

        <h2 className="landing-sub" style={{ marginTop: "2.75rem" }}>
          Leela of the day
        </h2>
        <div className="landing-grid courtyard-today">
          {DEITY_IDS.map((id) => {
            const gallery = getGallery(id);
            const src = leelaOfDay(id);
            const img = gallery.images.find((i) => gallerySrc(i.file, id) === src) || gallery.images[0];
            return (
              <article key={id} className="landing-card">
                <Link href={deityHref(id, locale, `/gallery/${img.id}/`)} className="landing-card-link">
                  <div className="landing-card-img" style={{ minHeight: 160 }}>
                    <Image src={src} alt={img.scene.en} fill sizes="33vw" />
                    <div className="landing-card-veil" />
                  </div>
                  <div className="landing-card-body">
                    <p className="landing-card-kicker">{img.style}</p>
                    <h3>{img.scene.en}</h3>
                    <p className="landing-card-copy" lang="hi">
                      {img.scene.hi}
                    </p>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>

        <div className="courtyard-search">
          <h2 className="landing-sub">Search the courtyard</h2>
          <SiteSearch locale={locale} compact />
          {recent.length > 0 && (
            <div className="mt-6">
              <p className="landing-card-kicker">Recent paths</p>
              <ul className="mt-2 space-y-2">
                {recent.map((r) => (
                  <li key={r.href}>
                    <Link href={r.href} className="landing-enter">
                      {r.label} →
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
