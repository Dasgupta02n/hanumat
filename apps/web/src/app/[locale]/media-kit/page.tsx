import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { SevaPage } from "@/components/SevaPages";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  return <SevaPage deity="hanuman" locale={locale} kind="media-kit" />;
}
