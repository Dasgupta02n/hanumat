import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/SiteShell";
import { SafeSceneImage } from "@/components/SafeSceneImage";
import { kathaStories } from "@/lib/content";
import { gallerySrc, imageForLeela } from "@/lib/gallery";
import { isLocale, type Locale } from "@/i18n/config";

const kathaArt: Record<string, string> = {
  janm: "001.jpg",
  "sagar-langhan": "006.jpg",
  "ashok-vatika": "013.jpg",
  "lanka-dahan": "016.jpg",
  sanjeevani: "017.jpg",
  "bhima-darshan": "021.jpg",
};

export default async function KathaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("katha");

  return (
    <SiteShell>
      <p className="text-xs text-[#6b5a80]">Wave 2</p>
      <h1 className="font-serif text-4xl text-[#fff8e7]">{t("title")}</h1>
      <p className="mt-2 max-w-xl text-sm text-[#a994c4]">{t("intro")}</p>
      <div className="mt-6">
        <SafeSceneImage
          src={imageForLeela("katha")}
          alt=""
          aspect="wide"
          caption={
            locale === "en"
              ? "Leela art · open 108 gallery for full set"
              : "लीला कला · पूर्ण सेट १०८ गैलरी में"
          }
        />
      </div>
      <p className="mt-3 text-xs">
        <Link href={`/${locale}/gallery/`} className="text-[#f48c06] hover:underline">
          {locale === "en" ? "108 Images gallery →" : "१०८ चित्र गैलरी →"}
        </Link>
      </p>

      <div className="mt-8 space-y-6">
        {kathaStories.map(
          (s: {
            slug: string;
            wave: number;
            title: { hi: string; en: string };
            minutes: number;
            body: { hi: string; en: string };
          }) => (
            <article
              key={s.slug}
              id={s.slug}
              className="overflow-hidden rounded-2xl border border-white/12 bg-white/5"
            >
              <div className="relative">
                <SafeSceneImage
                  src={gallerySrc(kathaArt[s.slug] || "064.jpg")}
                  alt={locale === "en" ? s.title.en : s.title.hi}
                  aspect="video"
                />
              </div>
              <div className="p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-serif text-2xl text-[#fff8e7]">
                  {locale === "en" ? s.title.en : s.title.hi}
                </h2>
                <span className="text-xs text-[#f48c06]">
                  ~{s.minutes} {t("minutes")}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[#cbb8e0]">
                {locale === "en" ? s.body.en : s.body.hi}
              </p>
              </div>
            </article>
          ),
        )}
      </div>
    </SiteShell>
  );
}
