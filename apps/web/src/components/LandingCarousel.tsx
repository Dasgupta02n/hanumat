"use client";

import { useEffect, useState } from "react";

const INTERVAL_MS = 7000;
const FADE_MS = 1600;

const SLIDES = [
  { src: "/images/deities/landing-courtyard.jpg", alt: "Temple courtyard" },
  { src: "/images/deities/hanuman-portal.jpg", alt: "Hanuman" },
  { src: "/images/deities/shiva-hero.jpg", alt: "Shiva" },
  { src: "/images/deities/kali-hero.jpg", alt: "Kali" },
  { src: "/images/shiva-108/002.jpg", alt: "Shiva in Phad samadhi" },
  { src: "/images/kali-108/001.jpg", alt: "Kali Phad scroll" },
  { src: "/images/shiva-108/010.jpg", alt: "Burning of Kama, Gond" },
  { src: "/images/kali-108/033.jpg", alt: "Hibiscus offering, Madhubani" },
];

export function LandingCarousel() {
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
    if (reduceMotion) return;
    const id = window.setInterval(() => {
      setIndex((i) => {
        setPrev(i);
        return (i + 1) % SLIDES.length;
      });
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  const layers = prev === index ? [index] : [prev, index];

  return (
    <div className="landing-bg-carousel" aria-hidden>
      {layers.map((i) => {
        const slide = SLIDES[i];
        const active = i === index;
        return (
          <div
            key={`${slide.src}-${i}`}
            className="landing-bg-slide"
            style={{
              backgroundImage: `url(${slide.src})`,
              opacity: active ? 1 : 0,
              transform: active && !reduceMotion ? "scale(1.06)" : "scale(1.02)",
              transition: reduceMotion
                ? "none"
                : `opacity ${FADE_MS}ms ease-in-out, transform ${INTERVAL_MS + FADE_MS}ms ease-out`,
              zIndex: active ? 1 : 0,
            }}
          />
        );
      })}
    </div>
  );
}
