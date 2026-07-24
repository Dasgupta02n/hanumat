"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { galleryImages, gallerySrc } from "@/lib/gallery";

const INTERVAL_MS = 7000;
const FADE_MS = 1600;

/**
 * Slow fade carousel of all 108 Hanuman gallery images for the landing hero.
 * Visual tuning for cream/gold mandir landing: soft crossfade, gentle zoom, warm scrim.
 */
export function HeroCarousel({
  fallbackSrc,
  imageAlt = "Hanuman sacred scene — Hanumat digital mandir",
}: {
  fallbackSrc?: string;
  imageAlt?: string;
}) {
  const slides =
    galleryImages.length > 0
      ? galleryImages.map((img) => ({
          src: gallerySrc(img.file),
          alt: img.scene?.en || imageAlt,
        }))
      : [{ src: fallbackSrc || "/images/hanuman-108/006.jpg", alt: imageAlt }];

  const [index, setIndex] = useState(0);
  const [prev, setPrev] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduceMotion || slides.length < 2) return;
    const id = window.setInterval(() => {
      setIndex((i) => {
        setPrev(i);
        return (i + 1) % slides.length;
      });
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion, slides.length]);

  useEffect(() => {
    if (slides.length < 2) return;
    const next = slides[(index + 1) % slides.length];
    const img = new window.Image();
    img.src = next.src;
  }, [index, slides]);

  const layers = prev === index ? [index] : [prev, index];

  return (
    <div className="absolute inset-x-0 top-0 h-[56%] overflow-hidden">
      {layers.map((i) => {
        const slide = slides[i];
        const active = i === index;
        return (
          <div
            key={`${slide.src}-${i}`}
            className="absolute inset-0"
            style={{
              opacity: active ? 1 : 0,
              transition: reduceMotion
                ? "none"
                : `opacity ${FADE_MS}ms ease-in-out`,
              zIndex: active ? 2 : 1,
              willChange: "opacity",
            }}
            aria-hidden={!active}
          >
            <Image
              src={slide.src}
              alt={active ? slide.alt : ""}
              fill
              priority={i === 0 || active}
              className="object-cover object-[center_28%]"
              sizes="100vw"
              style={{
                transform:
                  active && !reduceMotion ? "scale(1.06)" : "scale(1.02)",
                transition: reduceMotion
                  ? "none"
                  : `transform ${INTERVAL_MS + FADE_MS}ms ease-out`,
                filter:
                  "saturate(0.92) brightness(0.88) contrast(1.05) sepia(0.08)",
              }}
            />
          </div>
        );
      })}

      {/* Landing-tuned overlays: warm gold + readable cream falloff */}
      <div
        className="pointer-events-none absolute inset-0 z-[3]"
        style={{
          background: `
            linear-gradient(180deg,
              rgba(28,24,20,0.42) 0%,
              rgba(28,24,20,0.12) 38%,
              rgba(246,241,231,0.55) 78%,
              rgba(246,241,231,0.97) 100%
            )
          `,
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[3]"
        style={{
          background:
            "radial-gradient(ellipse 85% 70% at 50% 35%, transparent 30%, rgba(28,24,20,0.28) 100%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-[3] w-16 sm:w-28"
        style={{
          background:
            "linear-gradient(90deg, rgba(28,24,20,0.35), transparent)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-[3] w-16 sm:w-28"
        style={{
          background:
            "linear-gradient(270deg, rgba(28,24,20,0.35), transparent)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[3]"
        style={{
          background:
            "linear-gradient(135deg, rgba(196,163,90,0.12) 0%, transparent 45%, rgba(196,163,90,0.08) 100%)",
          mixBlendMode: "soft-light",
        }}
        aria-hidden
      />

      <span className="sr-only" aria-live="polite">
        {slides[index]?.alt}
      </span>
    </div>
  );
}
