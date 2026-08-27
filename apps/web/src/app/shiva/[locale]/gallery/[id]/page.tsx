import { setRequestLocale } from "next-intl/server";
import { isLocale } from "@/i18n/config";
import { deityGalleryParams, renderMandirGalleryDetail } from "@/lib/mandir-pages";

export function generateStaticParams() {
  return deityGalleryParams("shiva");
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  if (isLocale(locale)) setRequestLocale(locale);
  return renderMandirGalleryDetail("shiva", locale, id);
}
