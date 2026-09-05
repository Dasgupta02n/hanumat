import { setRequestLocale } from "next-intl/server";
import { isLocale } from "@/i18n/config";
import { SevaPage } from "@/components/SevaPages";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (isLocale(locale)) setRequestLocale(locale);
  return <SevaPage deity="shiva" locale={isLocale(locale) ? locale : "en"} kind="trust" />;
}
