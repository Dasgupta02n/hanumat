"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { SiteShell } from "@/components/SiteShell";
import { useDeity } from "@/components/DeityProvider";
import { loadJapa, saveJapa, type JapaSession } from "@/lib/my-path";

const TARGETS = [11, 21, 54, 108, 1008];
const BEADS = 108;

const AUDIO: Record<string, string> = {
  hanuman: "/audio/mantra/om_hanumate_namah.m4a",
};

export function MandirJapa() {
  const locale = useLocale();
  const t = useTranslations("japa");
  const deity = useDeity();
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(108);
  const [sessions, setSessions] = useState(0);
  const [history, setHistory] = useState<JapaSession[]>([]);
  const [done, setDone] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioSrc = AUDIO[deity.id];

  useEffect(() => {
    const s = loadJapa(deity.id);
    setCount(s.count || 0);
    setTarget(s.target || 108);
    setSessions(s.sessions || 0);
    setHistory(s.history || []);
  }, [deity.id]);

  useEffect(() => {
    saveJapa({ count, target, sessions, history }, deity.id);
  }, [count, target, sessions, history, deity.id]);

  useEffect(() => {
    if (count >= target && target > 0) setDone(true);
  }, [count, target]);

  const pct = Math.min(100, Math.round((count / target) * 100));
  const bead = count % BEADS;

  const beads = useMemo(
    () =>
      Array.from({ length: BEADS }, (_, i) => {
        const angle = (i / BEADS) * Math.PI * 2 - Math.PI / 2;
        return { i, x: 50 + Math.cos(angle) * 46, y: 50 + Math.sin(angle) * 46 };
      }),
    [],
  );

  function tap() {
    setCount((c) => {
      const next = c + 1;
      if (next === target) {
        setSessions((s) => s + 1);
        setHistory((h) =>
          [{ at: new Date().toISOString(), count: next, target }, ...h].slice(0, 12),
        );
        setDone(true);
      }
      return next;
    });
    if (navigator.vibrate) navigator.vibrate(12);
  }

  return (
    <SiteShell>
      <p className="section-kicker">{locale === "en" ? deity.brand.en : deity.brand.hi}</p>
      <h1 className="section-title text-4xl">{t("title")}</h1>
      <p
        className="mt-2 font-serif text-2xl"
        lang="hi"
        style={{ color: "var(--hanumat-vermillion-deep)" }}
      >
        {deity.mantra.hi}
      </p>
      <p className="mt-1 text-sm" style={{ color: "var(--hanumat-stone)" }}>
        {deity.mantra.iast}
      </p>
      {sessions > 0 && (
        <p className="mt-2 text-xs" style={{ color: "var(--hanumat-stone)" }}>
          {t("session")}: {sessions}
        </p>
      )}
      <div className="mt-8 flex flex-wrap gap-2">
        {TARGETS.map((tg) => (
          <button
            key={tg}
            type="button"
            onClick={() => {
              setTarget(tg);
              setDone(false);
            }}
            className="rounded-full px-3 py-2 text-sm"
            style={
              target === tg
                ? {
                    background: "var(--hanumat-vermillion-deep)",
                    color: "var(--hanumat-cream)",
                  }
                : {
                    border: "1px solid var(--hanumat-gold-line)",
                    color: "var(--hanumat-stone)",
                  }
            }
          >
            {tg}
          </button>
        ))}
      </div>
      <div className="mt-10 flex flex-col items-center">
        <div className="relative h-72 w-72">
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
            {beads.map((b) => (
              <circle
                key={b.i}
                cx={b.x}
                cy={b.y}
                r={b.i === bead ? 1.8 : 0.9}
                fill={
                  b.i === bead
                    ? "var(--hanumat-vermillion-deep)"
                    : b.i < bead || (count > 0 && b.i === 0 && bead === 0)
                      ? "var(--hanumat-gold)"
                      : "var(--hanumat-gold-line)"
                }
              />
            ))}
          </svg>
          <button
            type="button"
            onClick={tap}
            className="absolute inset-[18%] flex flex-col items-center justify-center rounded-full border-4 active:scale-95"
            style={{
              borderColor: "var(--hanumat-gold)",
              background:
                "linear-gradient(to bottom, var(--hanumat-gold-wash), transparent)",
              color: "var(--hanumat-shadow)",
              minHeight: 160,
              minWidth: 160,
            }}
            aria-label={locale === "en" ? "Count one bead" : "एक मनका"}
          >
            <span className="font-serif text-5xl tabular-nums">{count}</span>
            <span className="mt-1 text-xs">/ {target}</span>
            <span className="mt-1 text-[10px]" style={{ color: "var(--hanumat-stone)" }}>
              {bead || (count ? 108 : 0)} / 108
            </span>
          </button>
        </div>
        {done && (
          <p className="mt-4 text-sm" style={{ color: "var(--hanumat-gold-deep)" }}>
            {t("session")} 🙏
          </p>
        )}
        <div
          className="mt-6 h-2 w-full max-w-xs overflow-hidden rounded-full"
          style={{ background: "var(--hanumat-gold-wash)" }}
        >
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${pct}%`,
              background: "var(--hanumat-vermillion-deep)",
            }}
          />
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          {audioSrc && (
            <button
              type="button"
              className="text-sm"
              style={{ color: "var(--hanumat-stone)" }}
              onClick={() => {
                const a = audioRef.current;
                if (!a) return;
                if (playing) {
                  a.pause();
                  setPlaying(false);
                } else {
                  a.loop = true;
                  void a.play();
                  setPlaying(true);
                }
              }}
            >
              {playing ? t("stop") : t("loop")}
            </button>
          )}
          <button
            type="button"
            className="text-sm"
            style={{ color: "var(--hanumat-vermillion-deep)" }}
            onClick={() => {
              setCount(0);
              setDone(false);
            }}
          >
            {t("reset")}
          </button>
        </div>
        {audioSrc && (
          <audio ref={audioRef} src={audioSrc} preload="none" />
        )}
      </div>
      {history.length > 0 && (
        <section className="mt-12">
          <h2 className="section-kicker">{locale === "en" ? "Session history" : "सत्र इतिहास"}</h2>
          <ul className="mt-3 space-y-2">
            {history.map((s) => (
              <li key={s.at} className="temple-card px-4 py-2 text-sm">
                {new Date(s.at).toLocaleString(locale === "en" ? "en-IN" : "hi-IN")} · {s.count}/{s.target}
              </li>
            ))}
          </ul>
        </section>
      )}
    </SiteShell>
  );
}
