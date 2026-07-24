import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/SiteShell";
import { allTexts } from "@/lib/content";
import { isLocale, type Locale } from "@/i18n/config";

export default async function ListenPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("listen");

  const withAudio = allTexts.filter(
    (text) => text.audio?.src || (text.audio?.segments?.length ?? 0) > 0,
  );

  return (
    <SiteShell>
      <h1 className="font-serif text-4xl text-[#fff8e7]">{t("title")}</h1>
      <p className="mt-2 max-w-xl text-sm text-[#a994c4]">{t("intro")}</p>
      <ul className="mt-8 space-y-5">
        {withAudio.map((text) => {
          const segs = text.audio?.segments || [];
          const src = segs[0]?.src || text.audio?.src;
          if (!src) return null;
          return (
            <li
              key={text.id}
              className="rounded-2xl border border-white/12 bg-white/5 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#f48c06]">
                    Wave {text.wave}
                  </p>
                  <h3 className="font-serif text-lg text-[#fff8e7]">
                    {locale === "en" ? text.title.en : text.title.hi}
                  </h3>
                </div>
                <Link
                  href={`/${locale}/path/${text.slug}/`}
                  className="text-xs text-[#f48c06]"
                >
                  Path Studio →
                </Link>
              </div>
              <audio className="mt-3 w-full" controls preload="none" src={src} />
              {segs.length > 1 && (
                <p className="mt-2 text-[11px] text-[#6b5a80]">
                  {segs.length} segments · open Path Studio for full map
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </SiteShell>
  );
}
