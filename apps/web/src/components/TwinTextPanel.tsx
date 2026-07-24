import Link from "next/link";
import { getTextBySlug, twinTextAlign, type Section, type VerseUnit } from "@/lib/content";
import { flags } from "@/lib/flags";

type AlignPair = {
  manasHint: string;
  valmikiVerseIds: string[];
};

/** Editorial map: align-file manasHint → Manas section ids */
const MANAS_HINT_SECTIONS: Record<string, string[]> = {
  "leap resolve / ocean": ["sk-s03", "sk-s04"],
  "Mainaka Surasa Simhika": ["sk-s05", "sk-s06", "sk-s07"],
  "Lanka search": ["sk-s08", "sk-s09"],
  "Sita ring": ["sk-s11", "sk-s13"],
  "return report": ["sk-s21", "sk-s22"],
};

function resolveManasSections(hint: string, sections: Section[]): Section[] {
  const ids = MANAS_HINT_SECTIONS[hint];
  if (ids?.length) {
    return ids
      .map((id) => sections.find((s) => s.id === id))
      .filter((s): s is Section => Boolean(s));
  }
  // Fallback: token overlap against section EN titles
  const tokens = hint
    .toLowerCase()
    .split(/[\s/,]+/)
    .filter((t) => t.length > 2);
  if (!tokens.length) return [];
  return sections.filter((s) => {
    const en = s.title.en.toLowerCase();
    return tokens.some((t) => en.includes(t));
  });
}

function sectionTitle(s: Section, locale: string) {
  return locale === "en" ? s.title.en : s.title.hi;
}

function clip(text: string, n = 96) {
  if (text.length <= n) return text;
  return `${text.slice(0, n)}…`;
}

export function TwinTextPanel({
  locale,
  activeTextId,
}: {
  locale: string;
  activeTextId: string;
}) {
  if (!flags.ff_twin_text) return null;
  if (
    activeTextId !== "sundar-kand-manas" &&
    activeTextId !== "valmiki-sundarakanda"
  ) {
    return null;
  }

  const manas = getTextBySlug("sundar-kand");
  const val = getTextBySlug("valmiki-sundarakanda");
  if (!manas || !val) return null;

  const pairs = twinTextAlign.pairs as AlignPair[];
  const verseById = new Map(val.verses.map((v) => [v.id, v]));

  return (
    <div className="mt-4 rounded-2xl border border-[#f48c06]/30 bg-[#f48c06]/10 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-xs uppercase tracking-widest text-[#ffd60a]">
          Twin-text · Manas ‖ Valmiki
        </p>
        <div className="flex flex-wrap gap-3 text-[11px]">
          <Link
            href={`/${locale}/path/sundar-kand/`}
            className="text-[#a994c4] hover:text-[#ffd60a]"
          >
            {locale === "en" ? manas.title.en : manas.title.hi}
          </Link>
          <span className="text-[#6b5a80]">·</span>
          <Link
            href={`/${locale}/path/valmiki-sundarakanda/`}
            className="text-[#a994c4] hover:text-[#ffd60a]"
          >
            {locale === "en" ? val.title.en : val.title.hi}
          </Link>
        </div>
      </div>
      <p className="mt-1 text-sm text-[#efe6ff]">
        {locale === "en"
          ? "Paired Manas sections with aligned Valmiki verses — open either pane."
          : "मानस खंड और संरेखित वाल्मीकि पद — किसी भी ओर से खोलें।"}
      </p>

      <ul className="mt-3 max-h-[28rem] space-y-2 overflow-y-auto pr-1">
        {pairs.map((pair) => {
          const manasSecs = resolveManasSections(pair.manasHint, manas.sections);
          const valVerses = pair.valmikiVerseIds
            .map((id) => verseById.get(id))
            .filter((v): v is VerseUnit => Boolean(v));

          return (
            <li
              key={pair.manasHint}
              className="rounded-xl border border-white/10 bg-[#1a0f2e]/60 p-2.5"
            >
              <p className="mb-2 text-[10px] uppercase tracking-wide text-[#f48c06]/90">
                {pair.manasHint}
              </p>
              <div className="grid gap-2 md:grid-cols-2">
                {/* Manas pane */}
                <div className="min-w-0 rounded-lg border border-white/5 bg-black/20 px-2.5 py-2">
                  <p className="text-[9px] uppercase tracking-wider text-[#a994c4]">
                    Manas
                  </p>
                  {manasSecs.length ? (
                    <ul className="mt-1 space-y-1">
                      {manasSecs.map((s) => {
                        const firstVerse = s.verseIds[0];
                        const href = firstVerse
                          ? `/${locale}/path/sundar-kand/${s.id}/?verse=${encodeURIComponent(firstVerse)}`
                          : `/${locale}/path/sundar-kand/${s.id}/`;
                        return (
                          <li key={s.id}>
                            <Link
                              href={href}
                              className="font-serif text-sm text-[#fff8e7] hover:text-[#ffd60a]"
                            >
                              {sectionTitle(s, locale)}
                            </Link>
                            <span className="ml-1.5 text-[10px] text-[#6b5a80]">
                              {s.id}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="mt-1 text-xs text-[#cbb8e0]">{pair.manasHint}</p>
                  )}
                </div>

                {/* Valmiki pane */}
                <div className="min-w-0 rounded-lg border border-white/5 bg-black/20 px-2.5 py-2">
                  <p className="text-[9px] uppercase tracking-wider text-[#a994c4]">
                    Valmiki
                  </p>
                  {valVerses.length ? (
                    <ul className="mt-1 space-y-1.5">
                      {valVerses.map((v) => (
                        <li key={v.id}>
                          <Link
                            href={`/${locale}/path/valmiki-sundarakanda/?verse=${encodeURIComponent(v.id)}`}
                            className="block font-serif text-xs leading-snug text-[#efe6ff] hover:text-[#ffd60a]"
                            lang="sa"
                          >
                            <span className="mr-1.5 text-[10px] text-[#f48c06]">
                              {v.id}
                            </span>
                            {clip(v.text)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-1 text-xs text-[#6b5a80]">—</p>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
