import Image from "next/image";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/SiteShell";
import {
  galleryImages,
  gallerySrc,
  getGalleryImage,
} from "@/lib/gallery";
import { isLocale, locales, type Locale } from "@/i18n/config";

export function generateStaticParams() {
  const params: { locale: string; id: string }[] = [];
  for (const locale of locales) {
    for (const img of galleryImages) {
      params.push({ locale, id: img.id });
    }
  }
  return params;
}

export default async function GalleryDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale: raw, id } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  setRequestLocale(locale);
  const img = getGalleryImage(id);
  if (!img) notFound();

  const src = gallerySrc(img.file);
  const name = locale === "en" ? img.scene.en : img.scene.hi;
  const idx = galleryImages.findIndex((i) => i.id === img.id);
  const prev = galleryImages[idx - 1];
  const next = galleryImages[idx + 1];

  return (
    <SiteShell wide>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <Link
          href={`/${locale}/gallery/`}
          className="text-xs text-[#f48c06] hover:underline"
        >
          ← {locale === "en" ? "All 108 images" : "सभी १०८ चित्र"}
        </Link>

        {/* Full image — no text overlay */}
        <div className="relative mt-4 aspect-video w-full overflow-hidden rounded-2xl border border-white/15 bg-black">
          <Image
            src={src}
            alt={name}
            fill
            priority
            className="object-contain"
            sizes="100vw"
          />
        </div>

        {/* Controls BELOW the image */}
        <div className="mt-5 rounded-2xl border border-white/12 bg-white/5 p-5">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#f48c06]">
            {img.id} / 108 · {img.style}
          </p>
          <h1 className="mt-1 font-serif text-3xl text-[#fff8e7]">{name}</h1>
          <p className="mt-2 text-sm text-[#a994c4]">
            {locale === "en"
              ? "Full-resolution download for personal bhakti use. Devotional digital art."
              : "व्यक्तिगत भक्ति हेतु पूर्ण-रिजॉल्यूशन डाउनलोड। भक्ति डिजिटल कला।"}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href={src}
              download={img.file}
              className="rounded-full bg-[#f48c06] px-5 py-2.5 text-sm font-semibold text-[#1a0f2e]"
            >
              {locale === "en" ? "Download full HD" : "पूर्ण HD डाउनलोड"}
            </a>
            <a
              href={src}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/20 px-5 py-2.5 text-sm text-[#d4c4e8]"
            >
              {locale === "en" ? "Open full size" : "पूर्ण आकार खोलें"}
            </a>
          </div>
          <div className="mt-6 flex justify-between text-sm">
            {prev ? (
              <Link
                href={`/${locale}/gallery/${prev.id}/`}
                className="text-[#f48c06] hover:underline"
              >
                ← {prev.id}
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/${locale}/gallery/${next.id}/`}
                className="text-[#f48c06] hover:underline"
              >
                {next.id} →
              </Link>
            ) : (
              <span />
            )}
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
