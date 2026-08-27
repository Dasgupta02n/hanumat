import Image from "next/image";
import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { deityHref, type DeityId } from "@/lib/deities";
import { getGallery, gallerySrc, getGalleryImage } from "@/lib/gallery";
import type { Locale } from "@/i18n/config";
import { notFound } from "next/navigation";

export function MandirGalleryIndex({
  deity,
  locale,
}: {
  deity: DeityId;
  locale: Locale;
}) {
  const gallery = getGallery(deity);
  const h = (p: string) => deityHref(deity, locale, p);
  const en = locale === "en";
  const title = en ? gallery.title.en : gallery.title.hi;

  return (
    <SiteShell wide>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <p className="section-kicker">१०८ · Leela Gallery</p>
        <h1 className="section-title mt-2 text-4xl sm:text-5xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed" style={{ color: "var(--hanumat-stone)" }}>
          {en
            ? "108 folk-style leela paintings, each in a different Indian painting tradition. Tap a card for the full image. Art sits in frames — text never covers it."
            : "१०८ लोक-शैली लीला चित्र — प्रत्येक अलग भारतीय चित्र परंपरा में। पूर्ण देखने के लिए कार्ड चुनें। चित्रों पर पाठ नहीं चढ़ता।"}
        </p>
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {gallery.images.map((img) => {
            const src = gallerySrc(img.file, deity);
            const name = en ? img.scene.en : img.scene.hi;
            return (
              <li key={img.id}>
                <article className="temple-card overflow-hidden">
                  <Link href={h(`/gallery/${img.id}/`)} className="relative block aspect-video">
                    <Image src={src} alt={name} fill className="object-cover" sizes="33vw" />
                  </Link>
                  <div
                    className="space-y-2 border-t p-4"
                    style={{ borderColor: "var(--hanumat-gold-line)" }}
                  >
                    <p className="section-kicker text-[10px]">
                      {img.id} · {img.style}
                    </p>
                    <h2 className="font-serif text-lg">{name}</h2>
                    <Link
                      href={h(`/gallery/${img.id}/`)}
                      className="btn-gold inline-block !px-3 !py-1.5 text-xs"
                    >
                      {en ? "View" : "देखें"}
                    </Link>
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

export function MandirGalleryDetail({
  deity,
  locale,
  id,
}: {
  deity: DeityId;
  locale: Locale;
  id: string;
}) {
  const gallery = getGallery(deity);
  const img = getGalleryImage(id, deity);
  if (!img) notFound();
  const h = (p: string) => deityHref(deity, locale, p);
  const en = locale === "en";
  const src = gallerySrc(img.file, deity);
  const name = en ? img.scene.en : img.scene.hi;
  const idx = gallery.images.findIndex((i) => i.id === img.id);
  const prev = gallery.images[idx - 1];
  const next = gallery.images[idx + 1];

  return (
    <SiteShell wide>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <Link
          href={h("/gallery/")}
          className="text-xs hover:underline"
          style={{ color: "var(--hanumat-vermillion-deep)" }}
        >
          ← {en ? "All 108 images" : "सभी १०८ चित्र"}
        </Link>
        <div className="relative mt-4 aspect-video w-full overflow-hidden rounded-2xl border bg-black" style={{ borderColor: "var(--hanumat-gold-line)" }}>
          <Image src={src} alt={name} fill priority className="object-contain" sizes="100vw" />
        </div>
        <div className="temple-card mt-5 p-5">
          <p className="section-kicker">
            {img.id} / 108 · {img.style}
          </p>
          <h1 className="section-title mt-1 text-3xl">{name}</h1>
          <div className="mt-6 flex justify-between text-sm">
            {prev ? (
              <Link href={h(`/gallery/${prev.id}/`)} className="hover:underline" style={{ color: "var(--hanumat-vermillion-deep)" }}>
                ← {prev.id}
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={h(`/gallery/${next.id}/`)} className="hover:underline" style={{ color: "var(--hanumat-vermillion-deep)" }}>
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
