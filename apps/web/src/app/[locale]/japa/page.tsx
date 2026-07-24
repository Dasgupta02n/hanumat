"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { SiteShell } from "@/components/SiteShell";
import { loadJapa, saveJapa } from "@/lib/my-path";

const TARGETS = [11, 21, 54, 108, 1008];

export default function JapaPage() {
  const locale = useLocale();
  const t = useTranslations("japa");
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(108);
  const [sessions, setSessions] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [done, setDone] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const s = loadJapa();
    setCount(s.count || 0);
    setTarget(s.target || 108);
    setSessions(s.sessions || 0);
  }, []);

  useEffect(() => {
    saveJapa({ count, target, sessions });
  }, [count, target, sessions]);

  useEffect(() => {
    if (count >= target && target > 0) {
      setDone(true);
    }
  }, [count, target]);

  const pct = Math.min(100, Math.round((count / target) * 100));

  function tap() {
    setCount((c) => {
      const next = c + 1;
      if (next === target) {
        setSessions((s) => s + 1);
        setDone(true);
      }
      return next;
    });
    if (navigator.vibrate) navigator.vibrate(12);
  }

  return (
    <SiteShell>
      <p className="text-xs text-[#6b5a80]">Wave 1 · {locale}</p>
      <h1 className="font-serif text-4xl text-[#fff8e7]">{t("title")}</h1>
      <p className="mt-2 font-serif text-2xl text-[#f48c06]" lang="hi">
        {t("mantra")}
      </p>
      {sessions > 0 && (
        <p className="mt-2 text-xs text-[#a994c4]">
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
            className={`rounded-full px-3 py-1.5 text-sm ${
              target === tg
                ? "bg-[#f48c06] text-[#1a0f2e]"
                : "border border-white/15 text-[#d4c4e8]"
            }`}
          >
            {tg}
          </button>
        ))}
      </div>
      <div className="mt-10 flex flex-col items-center">
        <button
          type="button"
          onClick={tap}
          className="flex h-48 w-48 flex-col items-center justify-center rounded-full border-4 border-[#f48c06] bg-gradient-to-b from-[#f48c06]/30 to-transparent text-[#fff8e7] active:scale-95"
        >
          <span className="font-serif text-5xl tabular-nums">{count}</span>
          <span className="mt-1 text-xs text-[#d4c4e8]">/ {target}</span>
        </button>
        {done && (
          <p className="mt-4 text-sm text-[#ffd60a]">{t("session")} 🙏</p>
        )}
        <div className="mt-6 h-2 w-full max-w-xs overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-[#f48c06] transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <button
            type="button"
            className="text-sm text-[#d4c4e8]"
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
          <button
            type="button"
            className="text-sm text-[#f48c06]"
            onClick={() => {
              setCount(0);
              setDone(false);
            }}
          >
            {t("reset")}
          </button>
        </div>
        <audio
          ref={audioRef}
          src="/audio/mantra/om_hanumate_namah.m4a"
          preload="none"
        />
      </div>
    </SiteShell>
  );
}
