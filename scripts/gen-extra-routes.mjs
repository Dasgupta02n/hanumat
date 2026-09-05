import fs from "node:fs";
import path from "node:path";

const kinds = [
  "calendar",
  "parayan",
  "katha",
  "temples",
  "glossary",
  "kids",
  "radio",
  "sankat",
  "search",
];
const deities = ["shiva", "kali"];
const root = "apps/web/src/app";

for (const d of deities) {
  for (const k of kinds) {
    const dir = path.join(root, d, "[locale]", k);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(
      path.join(dir, "page.tsx"),
      `import { setRequestLocale } from "next-intl/server";
import { isLocale } from "@/i18n/config";
import { renderMandirExtra } from "@/lib/mandir-pages";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (isLocale(locale)) setRequestLocale(locale);
  return renderMandirExtra("${d}", locale, "${k}");
}
`,
    );
  }
}
console.log("extra routes written");
