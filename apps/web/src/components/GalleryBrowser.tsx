"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { deityHref, type DeityId } from "@/lib/deities";
import { getGallery, gallerySrc, type GalleryImage } from "@/lib/gallery";
import type { Locale } from "@/i18n/config";

export function GalleryBrowser({
  deity,
  locale,
}: {
  deity: DeityId;
  locale: Locale;
}) {
  const gallery = getGallery(deity);
  const h = (p: string) => deityHref(deity, locale, p);
  const en = locale === "en";
  const styles = useMemo(() => {
    const s = new Set(gallery.images.map((i) => i.style));
    return ["all", ...[...s].sort()];
  }, [gallery.images]);

  const [style, setStyle] = useState("all");
  const [slide, setSlide] = useState(false);
  const [idx, setIdx] = useState(0);

  const filtered = useMemo(
    () =>
      style === "all"
        ? gallery.images
        : gallery.images.filter((i) => i.style === style),
    [gallery.images, style],
  );

  useEffect(() => {
    setIdx(0);
  }, [style]);

  useEffect(() => {
    if (!slide || filtered.length < 2) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;
    const t = window.setInterval(() => {
      setIdx((i) => (i + 1) % filtered.length);
    }, 8000);
    return () => window.clearInterval(t);
  }, [slide, filtered.length]);

  const current: GalleryImage | undefined = filtered[idx];

  return (
    <>
      <div className="mt-8 flex flex-wrap items-center gap-2">
        <label className="text-xs" style={{ color: "var(--hanumat-stone)" }}>
          {en ? "Folk style" : "लोक शैली"}
        </label>
        <select
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          className="rounded-full border px-3 py-2 text-xs"
          style={{
            borderColor: "var(--hanumat-gold-line)",
            background: "var(--hanumat-cream)",
            color: "var(--hanumat-shadow)",
          }}
        >
          {styles.map((s) => (
            <option key={s} value={s}>
              {s === "all" ? (en ? "All styles" : "सभी शैलियाँ") : s}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setSlide((v) => !v)}
          className="rounded-full px-3 py-2 text-xs"
          style={{
            border: "1px solid var(--hanumat-gold-line)",
            background: slide ? "var(--hanumat-vermillion-deep)" : "transparent",
            color: slide ? "var(--hanumat-cream)" : "var(--hanumat-stone)",
          }}
        >
          {slide
            ? en
              ? "Stop slideshow"
              : "स्लाइड रोकें"
            : en
              ? "Slideshow · aarti pace"
              : "स्लाइड · आरती गति"}
        </button>
      </div>

      {slide && current && (
        <div className="relative mt-6 aspect-video overflow-hidden rounded-2xl border" style={{ borderColor: "var(--hanumat-gold-line)" }}>
          <Image
            src={gallerySrc(current.file, deity)}
            alt={en ? current.scene.en : current.scene.hi}
            fill
            className="object-contain bg-black"
            sizes="100vw"
            priority
          />
          <p className="absolute bottom-3 left-3 right-3 rounded-full bg-black/55 px-4 py-2 text-center text-sm text-white">
            {current.id} · {current.style} · {en ? current.scene.en : current.scene.hi}
          </p>
        </div>
      )}

      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((img) => {
          const src = gallerySrc(img.file, deity);
          const name = en ? img.scene.en : img.scene.hi;
          return (
            <li key={img.id}>
              <article className="temple-card overflow-hidden">
                <Link href={h(`/gallery/${img.id}/`)} className="relative block aspect-video">
                  <Image
                    src={src}
                    alt={name}
                    fill
                    className="object-cover motion-safe:transition motion-safe:duration-500 motion-safe:group-hover:scale-105"
                    sizes="33vw"
                  />
                </Link>
                <div
                  className="space-y-2 border-t p-4"
                  style={{ borderColor: "var(--hanumat-gold-line)" }}
                >
                  <p className="section-kicker text-[10px]">
                    {img.id} · {img.style}
                  </p>
                  <h2 className="font-serif text-lg">{name}</h2>
                  <Link
                    href={h(`/gallery/${img.id}/`)}
                    className="btn-gold inline-block !px-3 !py-1.5 text-xs"
                  >
                    {en ? "View" : "देखें"}
                  </Link>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </>
  );
}
