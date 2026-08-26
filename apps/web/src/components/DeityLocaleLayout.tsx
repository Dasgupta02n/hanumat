import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { DeityProvider } from "@/components/DeityProvider";
import type { DeityId } from "@/lib/deities";

export async function DeityLocaleLayout({
  deity,
  children,
  params,
}: {
  deity: DeityId;
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <DeityProvider deity={deity}>{children}</DeityProvider>
    </NextIntlClientProvider>
  );
}
