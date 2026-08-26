import { setRequestLocale } from "next-intl/server";
import { isLocale } from "@/i18n/config";
import { deityPathParams, renderMandirPath } from "@/lib/mandir-pages";

export function generateStaticParams() {
  return deityPathParams("shiva");
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (isLocale(locale)) setRequestLocale(locale);
  return renderMandirPath("shiva", locale, slug);
}
