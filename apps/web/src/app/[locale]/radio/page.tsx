"use client";

import { useLocale } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { SiteShell } from "@/components/SiteShell";

/** Owned local TTS only — paths under public/audio. No external streams. */
const PLAYLIST = [
  {
    id: "chalisa",
    src: "/audio/chalisa/hanuman_chalisa.m4a",
    titleHi: "हनुमान चालीसा",
    titleEn: "Hanuman Chalisa",
  },
  {
    id: "mantra",
    src: "/audio/mantra/om_hanumate_namah.m4a",
    titleHi: "ॐ हनुमते नमः",
    titleEn: "Om Hanumate Namah",
  },
  {
    id: "baan",
    src: "/audio/bajrang-baan/bajrang_baan.m4a",
    titleHi: "बजरंग बाण",
    titleEn: "Bajrang Baan",
  },
  {
    id: "ashtak",
    src: "/audio/ashtak/sankatmochan_ashtak.m4a",
    titleHi: "संकटमोचन अष्टक",
    titleEn: "Sankatmochan Ashtak",
  },
  {
    id: "aarti",
    src: "/audio/aarti/hanuman_aarti.m4a",
    titleHi: "हनुमान आरती",
    titleEn: "Hanuman Aarti",
  },
  {
    id: "names",
    src: "/audio/names/hanuman_108_names.m4a",
    titleHi: "हनुमान १०८ नाम",
    titleEn: "Hanuman 108 Names",
  },
  {
    id: "kavach",
    src: "/audio/kavach/panchmukhi_kavach.m4a",
    titleHi: "पंचमुखी कवच",
    titleEn: "Panchmukhi Kavach",
  },
  {
    id: "maruti",
    src: "/audio/maruti/maruti_stotra.m4a",
    titleHi: "मारुति स्तोत्र",
    titleEn: "Maruti Stotra",
  },
  {
    id: "bahuk",
    src: "/audio/bahuk/hanuman_bahuk.m4a",
    titleHi: "हनुमान बाहुक",
    titleEn: "Hanuman Bahuk",
  },
  {
    id: "valmiki",
    src: "/audio/valmiki/valmiki_sundarakanda.m4a",
    titleHi: "वाल्मीकि सुंदरकांड (नमूना)",
    titleEn: "Valmiki Sundarakanda (sample)",
  },
  {
    id: "sk-sample",
    src: "/audio/sundar-kand/sundar_kand_sample_s01.m4a",
    titleHi: "सुंदरकांड · खंड १ (नमूना)",
    titleEn: "Sundar Kand · Section 1 (sample)",
  },
] as const;

export default function RadioPage() {
  const locale = useLocale();
  const isHi = locale === "hi";
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [loopAll, setLoopAll] = useState(true);

  const track = PLAYLIST[index]!;
  const title = isHi ? track.titleHi : track.titleEn;

  const copy = {
    wave: isHi ? "तरंग ३ · रेडियो" : "Wave 3 · Radio",
    heading: isHi ? "रेडियो" : "Radio",
    intro: isHi
      ? "स्थानीय स्वामित्व वाले TTS पाठ — क्रम से चलाएँ। कोई बाहरी स्ट्रीम नहीं।"
      : "Local owned TTS pāṭh — play in sequence. No external streams.",
    now: isHi ? "अभी चल रहा" : "Now playing",
    playlist: isHi ? "प्लेलिस्ट" : "Playlist",
    prev: isHi ? "पिछला" : "Previous",
    next: isHi ? "अगला" : "Next",
    loopOn: isHi ? "लूप चालू" : "Loop on",
    loopOff: isHi ? "लूप बंद" : "Loop off",
    note: isHi
      ? "TTS path-assist · classical pāṭh नहीं · केवल /audio/*"
      : "TTS path-assist · not classical pāṭh · /audio/* only",
    of: isHi ? "का" : "of",
  };

  const goTo = useCallback(
    (next: number, autoPlay: boolean) => {
      const n = PLAYLIST.length;
      let i = next;
      if (i >= n) i = loopAll ? 0 : n - 1;
      if (i < 0) i = loopAll ? n - 1 : 0;
      setIndex(i);
      if (autoPlay) setPlaying(true);
    },
    [loopAll],
  );

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.load();
    if (playing) {
      void a.play().catch(() => setPlaying(false));
    }
  }, [index]); // eslint-disable-line react-hooks/exhaustive-deps -- load only on track change

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      void a.play().catch(() => setPlaying(false));
    } else {
      a.pause();
    }
  }, [playing]);

  function onEnded() {
    if (index >= PLAYLIST.length - 1 && !loopAll) {
      setPlaying(false);
      return;
    }
    goTo(index + 1, true);
  }

  return (
    <SiteShell>
      <p className="text-xs text-[#6b5a80]">{copy.wave}</p>
      <h1 className="font-serif text-4xl text-[#fff8e7]">{copy.heading}</h1>
      <p className="mt-2 max-w-xl text-sm text-[#a994c4]">{copy.intro}</p>

      <div className="mt-8 rounded-2xl border border-white/12 bg-white/5 p-5">
        <p className="text-[10px] uppercase tracking-widest text-[#f48c06]">
          {copy.now}
        </p>
        <h2 className="mt-1 font-serif text-2xl text-[#fff8e7]" lang={isHi ? "hi" : "en"}>
          {title}
        </h2>
        <p className="mt-1 text-xs text-[#6b5a80]">
          {index + 1} {copy.of} {PLAYLIST.length}
        </p>

        <audio
          ref={audioRef}
          className="mt-4 w-full"
          controls
          preload="metadata"
          src={track.src}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={onEnded}
        />

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-full border border-white/15 px-3 py-1.5 text-sm text-[#d4c4e8] hover:bg-white/10"
            onClick={() => goTo(index - 1, playing)}
          >
            {copy.prev}
          </button>
          <button
            type="button"
            className="rounded-full border border-white/15 px-3 py-1.5 text-sm text-[#d4c4e8] hover:bg-white/10"
            onClick={() => goTo(index + 1, playing)}
          >
            {copy.next}
          </button>
          <button
            type="button"
            className={`rounded-full px-3 py-1.5 text-sm ${
              loopAll
                ? "bg-[#f48c06] text-[#1a0f2e]"
                : "border border-white/15 text-[#d4c4e8]"
            }`}
            onClick={() => setLoopAll((v) => !v)}
          >
            {loopAll ? copy.loopOn : copy.loopOff}
          </button>
        </div>
      </div>

      <h3 className="mt-10 text-xs uppercase tracking-widest text-[#a994c4]">
        {copy.playlist}
      </h3>
      <ol className="mt-3 space-y-2">
        {PLAYLIST.map((item, i) => {
          const active = i === index;
          const label = isHi ? item.titleHi : item.titleEn;
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => {
                  setIndex(i);
                  setPlaying(true);
                }}
                className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${
                  active
                    ? "border-[#f48c06]/60 bg-[#f48c06]/15"
                    : "border-white/10 bg-white/5 hover:bg-white/8"
                }`}
              >
                <span
                  className={`w-6 shrink-0 text-center text-xs tabular-nums ${
                    active ? "text-[#f48c06]" : "text-[#6b5a80]"
                  }`}
                >
                  {i + 1}
                </span>
                <span
                  className={`font-serif text-base ${
                    active ? "text-[#fff8e7]" : "text-[#d4c4e8]"
                  }`}
                  lang={isHi ? "hi" : "en"}
                >
                  {label}
                </span>
                {active && playing && (
                  <span className="ml-auto text-[10px] uppercase tracking-wide text-[#ffd60a]">
                    ●
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ol>

      <p className="mt-8 text-[11px] text-[#6b5a80]">{copy.note}</p>
    </SiteShell>
  );
}
