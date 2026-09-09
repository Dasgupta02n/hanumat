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
    <div className="temple-card mt-4 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-xs uppercase tracking-widest text-[var(--hanumat-vermillion-deep)]">
          Twin-text · Manas ‖ Valmiki
        </p>
        <div className="flex flex-wrap gap-3 text-[11px]">
          <Link
            href={`/${locale}/path/sundar-kand/`}
            className="text-[var(--hanumat-stone)] hover:text-[var(--hanumat-vermillion)]"
          >
            {locale === "en" ? manas.title.en : manas.title.hi}
          </Link>
          <span className="text-[var(--hanumat-sacred-ash)]">·</span>
          <Link
            href={`/${locale}/path/valmiki-sundarakanda/`}
            className="text-[var(--hanumat-stone)] hover:text-[var(--hanumat-vermillion)]"
          >
            {locale === "en" ? val.title.en : val.title.hi}
          </Link>
        </div>
      </div>
      <p className="mt-1 text-sm text-[var(--hanumat-charcoal)]">
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
              className="rounded-xl border border-[var(--hanumat-gold-line)] bg-[var(--hanumat-gold-wash)] p-2.5"
            >
              <p className="mb-2 text-[10px] uppercase tracking-wide text-[var(--hanumat-vermillion-deep)]/90">
                {pair.manasHint}
              </p>
              <div className="grid gap-2 md:grid-cols-2">
                {/* Manas pane */}
                <div className="min-w-0 rounded-lg border border-[var(--hanumat-gold-line)] bg-[rgba(255,252,247,0.95)] px-2.5 py-2">
                  <p className="text-[9px] uppercase tracking-wider text-[var(--hanumat-vermillion-deep)]">
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
                              className="font-serif text-sm text-[var(--hanumat-shadow)] hover:text-[var(--hanumat-vermillion)]"
                            >
                              {sectionTitle(s, locale)}
                            </Link>
                            <span className="ml-1.5 text-[10px] text-[var(--hanumat-sacred-ash)]">
                              {s.id}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="mt-1 text-xs text-[var(--hanumat-stone)]">{pair.manasHint}</p>
                  )}
                </div>

                {/* Valmiki pane */}
                <div className="min-w-0 rounded-lg border border-[var(--hanumat-gold-line)] bg-[rgba(255,252,247,0.95)] px-2.5 py-2">
                  <p className="text-[9px] uppercase tracking-wider text-[var(--hanumat-vermillion-deep)]">
                    Valmiki
                  </p>
                  {valVerses.length ? (
                    <ul className="mt-1 space-y-1.5">
                      {valVerses.map((v) => (
                        <li key={v.id}>
                          <Link
                            href={`/${locale}/path/valmiki-sundarakanda/?verse=${encodeURIComponent(v.id)}`}
                            className="block font-serif text-xs leading-snug text-[var(--hanumat-charcoal)] hover:text-[var(--hanumat-vermillion)]"
                            lang="sa"
                          >
                            <span className="mr-1.5 text-[10px] text-[var(--hanumat-vermillion-deep)]">
                              {v.id}
                            </span>
                            {clip(v.text)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-1 text-xs text-[var(--hanumat-sacred-ash)]">—</p>
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
