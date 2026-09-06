import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { isLocale, type Locale } from "@/i18n/config";
import { listCatalogLite } from "@/lib/catalog";
import { deityHref } from "@/lib/deities";

export default async function ScripturePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  setRequestLocale(locale);
  const en = locale === "en";
  const items = listCatalogLite(undefined, "all");
  const groups: { id: string; hi: string; en: string; rows: typeof items }[] = [
    { id: "sarva", hi: "सार्व · गीता व गृह स्तोत्र", en: "Household · Gita and stotras", rows: [] },
    { id: "hanuman", hi: "हनुमत", en: "Hanumat", rows: [] },
    { id: "shiva", hi: "शिवायतन", en: "Shivayatan", rows: [] },
    { id: "kali", hi: "कालिका धाम", en: "Kalika Dham", rows: [] },
  ];
  for (const it of items) {
    const g = groups.find((x) => x.id === (it.deity === "sarva" ? "sarva" : it.deity)) || groups[1];
    g.rows.push(it);
  }

  return (
    <SiteShell>
      <p className="section-kicker">{en ? "Scripture shelf" : "शास्त्र पंक्ति"}</p>
      <h1 className="section-title mt-2 text-4xl">
        {en ? "All paths" : "सभी पाठ"}
      </h1>
      <p className="mt-3 max-w-2xl text-sm" style={{ color: "var(--hanumat-stone)" }}>
        {en
          ? "Bhagavad Gita (18 chapters), Gayatri, Vishnu names, Lakshmi, Saraswati, Ganesha, Krishna — plus the three dhams. Mula, IAST, meaning. No ads."
          : "भगवद्गीता (१८ अध्याय), गायत्री, विष्णु नाम, लक्ष्मी, सरस्वती, गणेश, कृष्ण — और तीन धाम। मूल, IAST, अर्थ। विज्ञापन नहीं।"}
      </p>
      {groups.map((g) => (
        <section key={g.id} className="mt-10">
          <h2 className="section-title text-2xl">{en ? g.en : g.hi}</h2>
          <ul className="mt-4 space-y-2">
            {g.rows.map((r) => {
              const d = r.deity === "sarva" ? "hanuman" : r.deity;
              const href = deityHref(d as "hanuman" | "shiva" | "kali", locale, `/path/${r.slug}/`);
              return (
                <li key={r.id}>
                  <Link
                    href={href}
                    className="temple-card flex items-center justify-between px-4 py-3"
                  >
                    <span className="font-serif text-lg">
                      {en ? r.title.en : r.title.hi}
                    </span>
                    <span className="text-xs" style={{ color: "var(--hanumat-stone)" }}>
                      {r.verseCount} {en ? "verses" : "श्लोक"}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </SiteShell>
  );
}
