import { locales } from "@/i18n/config";
import { DeityLocaleLayout } from "@/components/DeityLocaleLayout";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  return (
    <DeityLocaleLayout deity="shiva" params={params}>
      {children}
    </DeityLocaleLayout>
  );
}
