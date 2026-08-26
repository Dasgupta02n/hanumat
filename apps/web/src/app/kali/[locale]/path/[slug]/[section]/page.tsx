import { setRequestLocale } from "next-intl/server";
import { isLocale } from "@/i18n/config";
import { deitySectionParams, renderMandirPath } from "@/lib/mandir-pages";

export function generateStaticParams() {
  return deitySectionParams("kali");
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; slug: string; section: string }>;
}) {
  const { locale, slug, section } = await params;
  if (isLocale(locale)) setRequestLocale(locale);
  return renderMandirPath("kali", locale, slug, section);
}
