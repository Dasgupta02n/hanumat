"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { SiteShell } from "@/components/SiteShell";
import { useDeity } from "@/components/DeityProvider";
import { loadJapa, saveJapa } from "@/lib/my-path";

const TARGETS = [11, 21, 54, 108, 1008];

export function MandirJapa() {
  const locale = useLocale();
  const t = useTranslations("japa");
  const deity = useDeity();
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(108);
  const [sessions, setSessions] = useState(0);
  const [done, setDone] = useState(false);

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
    if (count >= target && target > 0) setDone(true);
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
      <p className="section-kicker">{locale}</p>
      <h1 className="section-title text-4xl">{t("title")}</h1>
      <p className="mt-2 font-serif text-2xl" lang="hi" style={{ color: "var(--hanumat-vermillion-deep)" }}>
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
            className="rounded-full px-3 py-1.5 text-sm"
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
        <button
          type="button"
          onClick={tap}
          className="flex h-48 w-48 flex-col items-center justify-center rounded-full border-4 active:scale-95"
          style={{
            borderColor: "var(--hanumat-gold)",
            background:
              "linear-gradient(to bottom, var(--hanumat-gold-wash), transparent)",
            color: "var(--hanumat-shadow)",
          }}
        >
          <span className="font-serif text-5xl tabular-nums">{count}</span>
          <span className="mt-1 text-xs">/ {target}</span>
        </button>
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
        <button
          type="button"
          className="mt-6 text-sm"
          style={{ color: "var(--hanumat-vermillion-deep)" }}
          onClick={() => {
            setCount(0);
            setDone(false);
          }}
        >
          {t("reset")}
        </button>
      </div>
    </SiteShell>
  );
}
