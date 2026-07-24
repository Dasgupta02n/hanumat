import Image from "next/image";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/SiteShell";
import { galleryImages, gallerySrc, galleryTitle } from "@/lib/gallery";
import { isLocale, type Locale } from "@/i18n/config";

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  setRequestLocale(locale);

  const title = locale === "en" ? galleryTitle.en : galleryTitle.hi;

  return (
    <SiteShell wide>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <p className="text-xs uppercase tracking-[0.25em] text-[#f48c06]">
          १०८ · Leela Gallery
        </p>
        <h1 className="mt-2 font-serif text-4xl text-[#fff8e7] sm:text-5xl">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#cbb8e0]">
          {locale === "en"
            ? "108 cinematic sacred scenes of Hanuman ji’s leelas in varied traditional art styles. Tap a card for full-resolution view and download. Images sit in frames — text never covers the art."
            : "हनुमान जी की १०८ सिनेमाई लीला चित्र — विविध पारंपरिक शैलियों में। पूर्ण रिजॉल्यूशन देखने और डाउनलोड के लिए कार्ड चुनें। चित्रों पर पाठ नहीं चढ़ता।"}
        </p>
        <p className="mt-2 text-[11px] text-[#6b5a80]">
          Devotional digital art for Hanumat · not classical murti photography ·
          seva use
        </p>

        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {galleryImages.map((img) => {
            const src = gallerySrc(img.file);
            const name = locale === "en" ? img.scene.en : img.scene.hi;
            return (
              <li key={img.id}>
                <article className="overflow-hidden rounded-2xl border border-white/12 bg-white/5">
                  {/* Image first — no overlay text on the picture */}
                  <Link
                    href={`/${locale}/gallery/${img.id}/`}
                    className="relative block aspect-video bg-[#120a22]"
                  >
                    <Image
                      src={src}
                      alt={name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  </Link>
                  {/* Caption BELOW image */}
                  <div className="space-y-2 border-t border-white/10 p-4">
                    <p className="text-[10px] uppercase tracking-wider text-[#f48c06]">
                      {img.id} · {img.style}
                    </p>
                    <h2 className="font-serif text-lg text-[#fff8e7]">{name}</h2>
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/${locale}/gallery/${img.id}/`}
                        className="rounded-full bg-[#f48c06] px-3 py-1.5 text-xs font-semibold text-[#1a0f2e]"
                      >
                        {locale === "en" ? "View full HD" : "पूर्ण देखें"}
                      </Link>
                      <a
                        href={src}
                        download={img.file}
                        className="rounded-full border border-white/20 px-3 py-1.5 text-xs text-[#d4c4e8]"
                      >
                        {locale === "en" ? "Download" : "डाउनलोड"}
                      </a>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </SiteShell>
  );
}
