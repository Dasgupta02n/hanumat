import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { deities } from "@/lib/deities";
import { LandingCarousel } from "@/components/LandingCarousel";
import { CourtyardGate } from "@/components/CourtyardGate";

export const metadata: Metadata = {
  title: "Hanumat · Three sacred mandirs",
  description:
    "Digital mandirs of Hanuman, Shiva and Maa Kali — path, meaning, japa. Free, no ads.",
  alternates: { canonical: "https://hanumat.life/" },
  openGraph: {
    title: "Hanumat · Three sacred mandirs",
    description:
      "Choose a dham: Hanuman, Shiva, or Maa Kali. Text, IAST, meaning.",
    url: "https://hanumat.life/",
    images: [{ url: "/images/deities/landing-courtyard.jpg", width: 1200, height: 675 }],
  },
};

const PORTALS = [
  {
    ...deities.hanuman,
    hrefHi: "/hi/",
    hrefEn: "/en/",
  },
  {
    ...deities.shiva,
    hrefHi: "/shiva/hi/",
    hrefEn: "/shiva/en/",
  },
  {
    ...deities.kali,
    hrefHi: "/kali/hi/",
    hrefEn: "/kali/en/",
  },
];

export default function LandingPage() {
  return (
    <div className="landing-root">
      <LandingCarousel />
      <div className="landing-scrim" aria-hidden />

      <header className="landing-head">
        <p className="landing-kicker">hanumat.life</p>
        <p className="landing-om" aria-hidden>
          ॐ
        </p>
        <h1 className="landing-title">Three sacred mandirs</h1>
        <p className="landing-sub" lang="hi">
          तीन धाम · one courtyard
        </p>
        <p className="landing-lead">
          Choose a gate. Hanuman, Shiva, or Maa Kali — path, meaning, and japa.
          No ads.
        </p>
      </header>

      <main className="landing-grid">
        {PORTALS.map((p) => (
          <article key={p.id} className={`landing-card landing-card-${p.id}`}>
            <Link href={p.hrefEn} className="landing-card-link">
              <div className="landing-card-img">
                <Image src={p.portalImg} alt={p.brand.en} fill sizes="(max-width: 900px) 100vw, 33vw" />
                <div className="landing-card-veil" />
              </div>
              <div className="landing-card-body">
                <p className="landing-card-kicker">{p.eyebrow.en}</p>
                <h2>
                  <span lang="hi">{p.brand.hi}</span>
                  <small>{p.brand.en}</small>
                </h2>
                <p lang="hi" className="landing-mantra">
                  {p.mantra.hi}
                </p>
                <p className="landing-card-copy">{p.homeBody.en}</p>
                <span className="landing-enter">
                  {p.id === "hanuman"
                    ? "Enter Hanumat →"
                    : p.id === "shiva"
                      ? "Enter Shivayatan →"
                      : "Enter Kalika Dham →"}
                </span>
              </div>
            </Link>
            <div className="landing-lang">
              <Link href={p.hrefEn}>English</Link>
              <Link href={p.hrefHi}>हिन्दी</Link>
            </div>
          </article>
        ))}
      </main>

      <CourtyardGate />

      <footer className="landing-foot">
        <p>
          Free seva · no accounts · no trackers ·{" "}
          <a href="mailto:hello@hanumat.life">hello@hanumat.life</a>
        </p>
      </footer>
    </div>
  );
}
