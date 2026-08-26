"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { TextPackage, VerseUnit } from "@/lib/content";
import { meaningFor } from "@/lib/content";
import { saveResume, toggleBookmark, loadBookmarks } from "@/lib/my-path";
import { usePlayerStore } from "@/lib/player-store";
import { flags } from "@/lib/flags";
import { machineAssistedLocales, type Locale } from "@/i18n/config";

type Cue = { verseId: string; startMs: number; endMs: number };
type Mode = "full" | "section" | "listen";

export function PathStudio({
  text,
  initialSectionId,
}: {
  text: TextPackage;
  initialSectionId?: string;
}) {
  const t = useTranslations("studio");
  const uiLocale = useLocale() as Locale;
  const searchParams = useSearchParams();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const parentRef = useRef<HTMLDivElement | null>(null);

  const [mode, setMode] = useState<Mode>("section");
  const [sectionId, setSectionId] = useState(
    initialSectionId || text.sections[0]?.id || "",
  );
  const [cues, setCues] = useState<Cue[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showMeaning, setShowMeaning] = useState(true);
  const [lang, setLang] = useState<string>(uiLocale);
  const [showIast, setShowIast] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [mapOpen, setMapOpen] = useState(false);
  const [rate, setRate] = useState(1);
  const [lowData, setLowData] = useState(false);
  const [karaoke, setKaraoke] = useState(
    flags.ff_karaoke_chalisa && text.id === "hanuman-chalisa",
  );

  const setStoreSection = usePlayerStore((s) => s.setSection);
  const setStoreMode = usePlayerStore((s) => s.setMode);
  const setStorePlaying = usePlayerStore((s) => s.setPlaying);
  const setStoreVerse = usePlayerStore((s) => s.setActiveVerse);
  const setStoreText = usePlayerStore((s) => s.setText);
  const setStoreLowData = usePlayerStore((s) => s.setLowData);

  useEffect(() => {
    setStoreText(text.id);
  }, [text.id, setStoreText]);
  useEffect(() => {
    setStoreSection(sectionId);
  }, [sectionId, setStoreSection]);
  useEffect(() => {
    setStoreMode(mode);
  }, [mode, setStoreMode]);
  useEffect(() => {
    setLang(uiLocale);
  }, [uiLocale]);
  useEffect(() => {
    setStoreLowData(lowData);
  }, [lowData, setStoreLowData]);

  useEffect(() => {
    const vid = searchParams.get("verse");
    if (!vid) return;
    const v = text.verses.find((x) => x.id === vid);
    if (v) {
      setSectionId(v.sectionId);
      setActiveId(v.id);
    }
  }, [searchParams, text.verses]);

  const segments = useMemo(
    () => text.audio?.segments || [],
    [text.audio?.segments],
  );

  const lowDataSegments = useMemo(
    () => text.audio?.lowDataSegments || [],
    [text.audio?.lowDataSegments],
  );

  const segment = useMemo(() => {
    if (segments.length) {
      return segments.find((s) => s.sectionId === sectionId) || segments[0];
    }
    return null;
  }, [segments, sectionId]);

  /** Prefer lowDataSegments[i] matching current section (index parity with segments). */
  const lowDataSegment = useMemo(() => {
    if (!lowDataSegments.length) return null;
    const idx = segments.findIndex((s) => s.sectionId === sectionId);
    if (
      idx >= 0 &&
      lowDataSegments[idx] &&
      lowDataSegments[idx].sectionId === sectionId
    ) {
      return lowDataSegments[idx];
    }
    return (
      lowDataSegments.find((s) => s.sectionId === sectionId) ||
      lowDataSegments[0] ||
      null
    );
  }, [lowDataSegments, segments, sectionId]);

  const audioSrc = useMemo(() => {
    if (lowData && flags.ff_low_data) {
      return (
        lowDataSegment?.src ||
        segment?.lowDataSrc ||
        text.audio?.lowDataSrc ||
        segment?.src ||
        text.audio?.src
      );
    }
    return segment?.src || text.audio?.src;
  }, [lowData, lowDataSegment, segment, text.audio]);

  const cueSrc =
    (lowData && flags.ff_low_data && lowDataSegment?.cueMapSrc) ||
    segment?.cueMapSrc ||
    text.audio?.cueMapSrc;

  const visibleVerses: VerseUnit[] = useMemo(() => {
    if (mode === "full" && flags.ff_verse_virtualization) {
      // full mode: all verses virtualized
      return text.verses;
    }
    return text.verses.filter((v) => v.sectionId === sectionId);
  }, [mode, sectionId, text.verses]);

  const rowVirtualizer = useVirtualizer({
    count: visibleVerses.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => (showMeaning ? 140 : 88),
    overscan: 8,
    enabled: flags.ff_verse_virtualization && mode !== "listen",
  });

  useEffect(() => {
    setBookmarks(
      loadBookmarks()
        .filter((b) => b.textId === text.id)
        .map((b) => b.verseId),
    );
  }, [text.id]);

  useEffect(() => {
    if (!cueSrc) {
      setCues([]);
      return;
    }
    fetch(cueSrc)
      .then((r) => r.json())
      .then((j) => setCues(j.cues || []))
      .catch(() => setCues([]));
  }, [cueSrc]);

  const cueById = useMemo(() => {
    const m = new Map<string, Cue>();
    cues.forEach((c) => m.set(c.verseId, c));
    return m;
  }, [cues]);

  const advanceToNextSegment = useCallback(() => {
    if (!segments.length) return;
    const idx = segments.findIndex((s) => s.sectionId === sectionId);
    const next = segments[idx + 1];
    if (next) {
      setSectionId(next.sectionId);
      setTimeout(() => {
        void audioRef.current?.play();
      }, 150);
    }
  }, [segments, sectionId]);

  const onTime = useCallback(() => {
    const a = audioRef.current;
    if (!a || !cues.length) return;
    const ms = a.currentTime * 1000;
    const hit = cues.find((c) => ms >= c.startMs && ms < c.endMs);
    if (hit && hit.verseId !== activeId) {
      setActiveId(hit.verseId);
      setStoreVerse(hit.verseId);
      const idx = visibleVerses.findIndex((v) => v.id === hit.verseId);
      if (idx >= 0 && flags.ff_verse_virtualization) {
        rowVirtualizer.scrollToIndex(idx, { align: "center" });
      } else {
        document
          .getElementById(`verse-${hit.verseId}`)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      saveResume({
        textId: text.id,
        slug: text.slug,
        sectionId,
        segmentId: segment?.id,
        verseId: hit.verseId,
        positionMs: ms,
        rate,
        lowData,
        updatedAt: new Date().toISOString(),
      });
    }
  }, [
    cues,
    activeId,
    text.id,
    text.slug,
    sectionId,
    segment?.id,
    rate,
    lowData,
    setStoreVerse,
    visibleVerses,
    rowVirtualizer,
  ]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.playbackRate = rate;
    a.addEventListener("timeupdate", onTime);
    const onPlay = () => {
      setPlaying(true);
      setStorePlaying(true);
    };
    const onPause = () => {
      setPlaying(false);
      setStorePlaying(false);
    };
    const onEnded = () => {
      if (mode === "full" || mode === "listen") advanceToNextSegment();
    };
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("ended", onEnded);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("ended", onEnded);
    };
  }, [onTime, mode, advanceToNextSegment, setStorePlaying, rate]);

  function seekVerse(v: VerseUnit) {
    if (v.sectionId !== sectionId) setSectionId(v.sectionId);
    const c = cueById.get(v.id);
    const a = audioRef.current;
    setActiveId(v.id);
    setStoreVerse(v.id);
    if (c && a && audioSrc) {
      const play = () => {
        a.currentTime = c.startMs / 1000 + 0.02;
        void a.play();
      };
      if (a.readyState >= 1) play();
      else a.addEventListener("loadeddata", play, { once: true });
    }
    saveResume({
      textId: text.id,
      slug: text.slug,
      sectionId: v.sectionId,
      segmentId: segment?.id,
      verseId: v.id,
      positionMs: c?.startMs,
      rate,
      lowData,
      updatedAt: new Date().toISOString(),
    });
    if (typeof window !== "undefined") {
      const u = new URL(window.location.href);
      u.searchParams.set("verse", v.id);
      window.history.replaceState({}, "", u.toString());
    }
  }

  function onBookmark(v: VerseUnit) {
    const all = toggleBookmark({
      textId: text.id,
      slug: text.slug,
      verseId: v.id,
      label: v.text.slice(0, 40),
    });
    setBookmarks(
      all.filter((b) => b.textId === text.id).map((b) => b.verseId),
    );
  }

  const listenOnly = mode === "listen";
  const provisional =
    Boolean(text.flags?.needsDualReview) ||
    text.id === "sundar-kand-manas" ||
    text.wave >= 1 ||
    machineAssistedLocales.includes(lang as Locale);

  const isChalisaKaraoke =
    karaoke && flags.ff_karaoke_chalisa && text.id === "hanuman-chalisa";

  function renderVerseCard(v: VerseUnit, i: number) {
    const on = activeId === v.id;
    const bookmarked = bookmarks.includes(v.id);
    return (
      <div
        key={v.id}
        id={`verse-${v.id}`}
        className={`rounded-2xl border p-4 transition ${
          on
            ? isChalisaKaraoke
              ? "border-[#ffd60a] bg-gradient-to-r from-[#f48c06]/30 to-[#ffd60a]/15 shadow-[0_0_48px_rgba(255,214,10,0.25)] scale-[1.01]"
              : "border-[#f48c06] bg-[var(--hanumat-vermillion-deep)]/15 shadow-[0_0_40px_rgba(244,140,6,0.12)]"
            : "border-white/10 bg-[var(--hanumat-gold-wash)]"
        }`}
      >
        <div className="mb-1 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => seekVerse(v)}
            className="text-left text-[10px] uppercase tracking-wider text-[var(--hanumat-vermillion-deep)]"
          >
            {v.kind} · {i + 1}
          </button>
          <button
            type="button"
            onClick={() => onBookmark(v)}
            className="text-xs text-[var(--hanumat-gold-deep)]"
            aria-label="Bookmark"
          >
            {bookmarked ? "★" : "☆"}
          </button>
        </div>
        <button
          type="button"
          onClick={() => seekVerse(v)}
          className="w-full text-left"
        >
          <p
            className={`font-serif leading-relaxed ${
              on
                ? isChalisaKaraoke
                  ? "text-2xl font-semibold text-[var(--hanumat-shadow)]"
                  : "text-xl text-[var(--hanumat-shadow)]"
                : "text-lg text-[var(--hanumat-charcoal)]"
            }`}
            lang="hi"
          >
            {v.text}
          </p>
          {showIast && v.iast && (
            <p className="mt-1 text-xs italic text-[var(--hanumat-stone-light)]">{v.iast}</p>
          )}
          {showMeaning && (
            <p className="mt-2 text-sm leading-relaxed text-[var(--hanumat-stone)]">
              {meaningFor(v, lang)}
            </p>
          )}
        </button>
      </div>
    );
  }

  return (
    <div>
      {provisional && (
        <div
          className="mb-4 rounded-xl border border-[var(--hanumat-gold-line)] bg-[var(--hanumat-gold-wash)] px-4 py-3 text-xs leading-relaxed text-[var(--hanumat-charcoal)]"
          role="status"
        >
          <strong className="text-[var(--hanumat-gold-deep)]">{t("provisionalTitle")}</strong>{" "}
          {t("provisionalBody")}
        </div>
      )}

      <div
        className={
          listenOnly
            ? "mx-auto max-w-lg"
            : "grid gap-6 lg:grid-cols-[240px_1fr_min(100%,320px)]"
        }
      >
        {!listenOnly && (
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-[var(--hanumat-gold-line)] bg-[var(--hanumat-gold-wash)] p-3">
              <p className="mb-2 text-[10px] uppercase tracking-widest text-[var(--hanumat-vermillion-deep)]">
                {t("episodes")}
              </p>
              <ul className="max-h-[60vh] space-y-1 overflow-y-auto text-sm">
                {text.sections.map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => setSectionId(s.id)}
                      className={`w-full rounded-xl px-3 py-2 text-left transition ${
                        sectionId === s.id
                          ? "bg-[var(--hanumat-gold-wash)] text-[var(--hanumat-shadow)]"
                          : "text-[var(--hanumat-stone)] hover:bg-[var(--hanumat-gold-wash)]"
                      }`}
                    >
                      <span className="text-[10px] text-[var(--hanumat-vermillion-deep)]">
                        {s.order}.
                      </span>{" "}
                      {s.title.hi}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        )}

        <div>
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {(["section", "full", "listen"] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`rounded-full px-3 py-1.5 text-xs ${
                  mode === m
                    ? "bg-[var(--hanumat-vermillion-deep)] text-[var(--hanumat-cream)]"
                    : "border border-[var(--hanumat-gold-line)] text-[var(--hanumat-stone)]"
                }`}
              >
                {m === "section"
                  ? t("section")
                  : m === "full"
                    ? t("full")
                    : t("listen")}
              </button>
            ))}
            <button
              type="button"
              className="rounded-full border border-[var(--hanumat-gold-line)] px-3 py-1.5 text-xs text-[var(--hanumat-stone)] lg:hidden"
              onClick={() => setMapOpen((o) => !o)}
            >
              {t("episodes")}
            </button>
            {!listenOnly && (
              <>
                <button
                  type="button"
                  onClick={() => setShowMeaning((s) => !s)}
                  className="rounded-full border border-[var(--hanumat-gold-line)] px-3 py-1.5 text-xs text-[var(--hanumat-stone)]"
                >
                  {showMeaning ? t("hideMeaning") : t("meaning")}
                </button>
                <select
                  className="rounded-full border px-2 py-1 text-xs uppercase font-semibold"
                  style={{
                    borderColor: "var(--hanumat-gold-line)",
                    color: "var(--hanumat-charcoal)",
                    background: "var(--hanumat-cream)",
                  }}
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  aria-label="Meaning locale"
                >
                  {(["hi", "en"] as const).map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowIast((s) => !s)}
                  className="rounded-full border border-[var(--hanumat-gold-line)] px-3 py-1.5 text-xs text-[var(--hanumat-stone)]"
                >
                  {t("iast")}
                </button>
              </>
            )}
            {text.id === "hanuman-chalisa" && flags.ff_karaoke_chalisa && (
              <button
                type="button"
                onClick={() => setKaraoke((k) => !k)}
                className={`rounded-full px-3 py-1.5 text-xs ${
                  karaoke
                    ? "bg-[var(--hanumat-gold)] text-[var(--hanumat-cream)]"
                    : "border border-[var(--hanumat-gold-line)] text-[var(--hanumat-stone)]"
                }`}
              >
                Karaoke
              </button>
            )}
            {flags.ff_low_data && (
              <button
                type="button"
                onClick={() => setLowData((v) => !v)}
                className={`rounded-full px-3 py-1.5 text-xs ${
                  lowData
                    ? "bg-[var(--hanumat-vermillion-deep)] text-[var(--hanumat-cream)]"
                    : "border border-[var(--hanumat-gold-line)] text-[var(--hanumat-stone)]"
                }`}
              >
                Low data
              </button>
            )}
            <select
              className="rounded-full border border-[var(--hanumat-gold-line)] bg-transparent px-2 py-1 text-xs text-[var(--hanumat-stone)]"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              aria-label="Playback rate"
            >
              {[0.75, 1, 1.25, 1.5].map((r) => (
                <option key={r} value={r}>
                  {r}×
                </option>
              ))}
            </select>
            {playing && (
              <span className="text-xs text-[var(--hanumat-gold-deep)]">▶ {t("live")}</span>
            )}
          </div>

          {mapOpen && (
            <div className="mb-4 rounded-2xl border border-[var(--hanumat-gold-line)] bg-[#24143d] p-3 lg:hidden">
              <ul className="grid max-h-48 gap-1 overflow-y-auto text-sm">
                {text.sections.map((s) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      className="w-full rounded-lg px-2 py-1.5 text-left text-[var(--hanumat-charcoal)]"
                      onClick={() => {
                        setSectionId(s.id);
                        setMode("section");
                        setMapOpen(false);
                      }}
                    >
                      {s.order}. {s.title.hi}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!listenOnly && flags.ff_verse_virtualization && (
            <div
              ref={parentRef}
              className="max-h-[min(65vh,720px)] overflow-y-auto pr-1"
            >
              <div
                style={{
                  height: `${rowVirtualizer.getTotalSize()}px`,
                  width: "100%",
                  position: "relative",
                }}
              >
                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                  const v = visibleVerses[virtualRow.index];
                  return (
                    <div
                      key={v.id}
                      data-index={virtualRow.index}
                      ref={rowVirtualizer.measureElement}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        transform: `translateY(${virtualRow.start}px)`,
                        paddingBottom: 12,
                      }}
                    >
                      {renderVerseCard(v, virtualRow.index)}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {!listenOnly && !flags.ff_verse_virtualization && (
            <div className="max-h-[min(65vh,720px)] space-y-3 overflow-y-auto pr-1">
              {visibleVerses.map((v, i) => renderVerseCard(v, i))}
            </div>
          )}

          {listenOnly && (
            <div className="rounded-3xl border border-[var(--hanumat-gold-line)] bg-[var(--hanumat-gold-wash)] p-8 text-center">
              <p className="text-xs tracking-[0.3em] text-[var(--hanumat-vermillion-deep)]">श्रवण</p>
              <h3 className="mt-2 font-serif text-2xl text-[var(--hanumat-shadow)]">
                {text.title.hi}
              </h3>
              <p className="mt-2 text-sm text-[var(--hanumat-stone)]">
                {text.sections.find((s) => s.id === sectionId)?.title.hi}
              </p>
              <p
                className={`mt-6 font-serif text-[var(--hanumat-charcoal)] ${
                  isChalisaKaraoke ? "text-2xl text-[var(--hanumat-gold-deep)]" : "text-lg"
                }`}
                lang="hi"
              >
                {visibleVerses.find((v) => v.id === activeId)?.text ||
                  visibleVerses[0]?.text}
              </p>
              <p className="mt-4 text-[11px] text-[var(--hanumat-stone-light)]">
                Auto-advances to next section when audio ends (full/listen)
              </p>
            </div>
          )}
        </div>

        <aside
          className={listenOnly ? "mt-6" : "lg:sticky lg:top-24 lg:self-start"}
        >
          <div className="rounded-2xl border border-[var(--hanumat-gold-line)] bg-[#24143d]/95 p-4 backdrop-blur">
            <p className="text-xs uppercase tracking-widest text-[var(--hanumat-vermillion-deep)]">
              {t("audio")}
              {lowData ? " · low data" : ""}
            </p>
            <h3 className="mt-1 font-serif text-xl text-[var(--hanumat-shadow)]">
              {text.title.hi}
            </h3>
            <p className="text-xs text-[var(--hanumat-stone)]">
              {typeof text.subtitle === "string"
                ? text.subtitle
                : text.subtitle?.hi}
            </p>
            <p className="mt-1 text-[10px] text-[var(--hanumat-stone-light)]">
              edition: {text.edition.pin}
            </p>
            {audioSrc ? (
              <audio
                key={audioSrc}
                ref={audioRef}
                className="mt-4 w-full"
                controls
                preload="metadata"
                src={audioSrc}
              />
            ) : (
              <p className="mt-4 text-sm text-[var(--hanumat-stone)]">
                Text + meaning · path-assist audio later
              </p>
            )}
            <p className="mt-3 text-[11px] leading-relaxed text-[var(--hanumat-stone)]">
              {text.audio?.credits ||
                "Neural path-assist (TTS). Not classical pāṭh."}
            </p>
            <a
              href={`mailto:hello@hanumat.life?subject=Text%20error%20${text.slug}&body=verseId%3A%20`}
              className="mt-3 inline-block text-[11px] text-[var(--hanumat-vermillion-deep)] hover:underline"
            >
              {t("reportError")}
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default PathStudio;
