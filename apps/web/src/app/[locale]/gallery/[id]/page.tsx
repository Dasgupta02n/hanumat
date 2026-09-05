import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/i18n/config";
import { getGallery } from "@/lib/gallery";
import { renderMandirGalleryDetail } from "@/lib/mandir-pages";

export function generateStaticParams() {
  const params: { locale: string; id: string }[] = [];
  for (const locale of locales) {
    for (const img of getGallery("hanuman").images) {
      params.push({ locale, id: img.id });
    }
  }
  return params;
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  return renderMandirGalleryDetail("hanuman", locale, id);
}
