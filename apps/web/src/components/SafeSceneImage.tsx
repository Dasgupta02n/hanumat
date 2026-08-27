import Image from "next/image";
import type { ReactNode } from "react";
import { HeroCarousel } from "@/components/HeroCarousel";
import { carouselSlides } from "@/lib/gallery";
import type { DeityId } from "@/lib/deities";

/**
 * Scene image that never sits under opaque text/controls.
 */
export function SafeSceneImage({
  src,
  alt,
  priority,
  className = "",
  aspect = "video",
  caption,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  aspect?: "video" | "square" | "wide";
  caption?: string;
}) {
  const aspectClass =
    aspect === "square"
      ? "aspect-square"
      : aspect === "wide"
        ? "aspect-[21/9]"
        : "aspect-video";

  return (
    <figure className={`temple-card temple-card-frame ${className}`}>
      <div className={`relative w-full ${aspectClass}`}>
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      {caption ? (
        <figcaption
          className="border-t px-3 py-2 text-xs"
          style={{
            borderColor: "var(--hanumat-gold-line)",
            color: "var(--hanumat-stone)",
          }}
        >
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

/** Full-bleed hero: slow 108-image carousel + symmetric marble card */
export function HeroWithSafeText({
  src,
  children,
  imageAlt = "Sacred scene — digital mandir",
  deity = "hanuman",
}: {
  src: string;
  children: ReactNode;
  imageAlt?: string;
  deity?: DeityId;
}) {
  return (
    <section className="relative min-h-[88vh] overflow-hidden" aria-label="Hero">
      <HeroCarousel
        fallbackSrc={src}
        imageAlt={imageAlt}
        slides={carouselSlides(deity)}
      />

      <div className="shell relative z-10 flex min-h-[88vh] flex-col justify-end pb-12 pt-[48vh]">
        <div className="glass-card temple-card-frame p-6 sm:p-9">
          <div
            className="mb-4 text-center text-2xl om-mark"
            aria-hidden
            style={{ opacity: 0.2 }}
          >
            ॐ
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}
