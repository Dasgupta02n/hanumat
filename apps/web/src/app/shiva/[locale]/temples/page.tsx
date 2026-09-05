import { setRequestLocale } from "next-intl/server";
import { isLocale } from "@/i18n/config";
import { renderMandirExtra } from "@/lib/mandir-pages";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (isLocale(locale)) setRequestLocale(locale);
  return renderMandirExtra("shiva", locale, "temples");
}
