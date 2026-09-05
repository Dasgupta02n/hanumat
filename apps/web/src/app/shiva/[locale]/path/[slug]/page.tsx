import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { isLocale } from "@/i18n/config";
import {
  deityPathParams,
  mandirPathMetadata,
  renderMandirPath,
} from "@/lib/mandir-pages";

export function generateStaticParams() {
  return deityPathParams("shiva");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  return mandirPathMetadata("shiva", locale, slug);
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
