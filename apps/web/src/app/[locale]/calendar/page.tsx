import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/SiteShell";
import { jayantiTraditions } from "@/lib/content";
import { isLocale, type Locale } from "@/i18n/config";

const familyMangalwarChecklist = {
  en: [
    "Light a diya together — one small flame for the whole home.",
    "Read a few lines of the Chalisa as a family.",
    "Offer a simple prasad — fruit, tulsi, or whatever you share at home.",
    "Sit quietly for a short japa — even five soft rounds counts.",
    "Invite the little ones to the Kids path for gentle stories.",
  ],
  hi: [
    "एक साथ दीया जलाएँ — घर के लिए एक छोटी ज्योति।",
    "परिवार के साथ चालीसा की कुछ पंक्तियाँ पढ़ें।",
    "सरल प्रसाद चढ़ाएँ — फल, तुलसी, या घर का साझा भोजन।",
    "थोड़ी देर शांत बैठकर जप करें — पाँच मृदु माला भी काफी है।",
    "छोटे बच्चों को सरल कथाओं के लिए बाल मार्ग पर बुलाएँ।",
  ],
} as const;

export default async function CalendarPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("calendar");
  const isHi = locale === "hi";
  const checklist = isHi
    ? familyMangalwarChecklist.hi
    : familyMangalwarChecklist.en;

  return (
    <SiteShell>
      <p className="section-kicker">Wave 1 · Family W3</p>
      <h1 className="section-title mt-2 text-4xl">{t("title")}</h1>
      <p className="mt-2 max-w-xl text-sm" style={{ color: "var(--hanumat-stone)" }}>{t("intro")}</p>

      <p className="mt-6">
        <Link href="/panchang/" className="btn-ghost !px-4 !py-2 text-sm">
          {isHi ? "आंगन पञ्चाङ्ग · मुहूर्त · त्यौहार →" : "Courtyard panchang · muhurat · festivals →"}
        </Link>
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="temple-card temple-card-frame p-6">
          <h2 className="section-title text-2xl">{t("tue")}</h2>
          <p className="mt-2 text-sm" style={{ color: "var(--hanumat-stone)" }}>
            Chalisa · japa · aarti · prasad
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <Link href={`/${locale}/path/hanuman-chalisa/`} className="btn-ghost !px-3 !py-1.5 text-xs">
              Chalisa
            </Link>
            <Link href={`/${locale}/japa/`} className="btn-ghost !px-3 !py-1.5 text-xs">
              Japa
            </Link>
            <Link href={`/${locale}/path/hanuman-aarti/`} className="btn-ghost !px-3 !py-1.5 text-xs">
              Aarti
            </Link>
          </div>
        </div>
        <div className="temple-card temple-card-frame p-6">
          <h2 className="section-title text-2xl">{t("sat")}</h2>
          <p className="mt-2 text-sm" style={{ color: "var(--hanumat-stone)" }}>
            Sundar Kand · Sankatmochan · aarti
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <Link href={`/${locale}/path/sundar-kand/`} className="btn-ghost !px-3 !py-1.5 text-xs">
              Sundar Kand
            </Link>
            <Link href={`/${locale}/path/sankatmochan-ashtak/`} className="btn-ghost !px-3 !py-1.5 text-xs">
              Ashtak
            </Link>
            <Link href={`/${locale}/parayan/`} className="btn-ghost !px-3 !py-1.5 text-xs">
              Parayan
            </Link>
          </div>
        </div>
      </div>

      {/* Family · Mangalwar checklist + kids-safe links (W3) */}
      <section className="temple-card temple-card-frame mt-10 p-6">
        <h2 className="section-title text-2xl">
          {isHi ? "परिवार · मंगलवार सूची" : "Family · Mangalwar checklist"}
        </h2>
        <p className="mt-2 max-w-2xl text-sm" style={{ color: "var(--hanumat-stone)" }}>
          {isHi
            ? "मंगलवार को घर का छोटा मंदिर — जल्दबाजी नहीं, केवल साझा भक्ति। परंपराएँ भिन्न हो सकती हैं।"
            : "A small home mandir on Tuesday — no rush, only shared devotion. Traditions may vary."}
        </p>
        <ol className="mt-5 list-decimal space-y-3 pl-5 text-sm" style={{ color: "var(--hanumat-charcoal)" }}>
          {checklist.map((item) => (
            <li key={item} className="pl-1 leading-relaxed">
              {item}
            </li>
          ))}
        </ol>

        <div className="mt-6">
          <p className="section-kicker">
            {isHi ? "बाल-सुरक्षित कड़ियाँ" : "Kids-safe links"}
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <Link href={`/${locale}/kids/`} className="btn-ghost !px-3 !py-1.5 text-xs">
              {isHi ? "बाल मार्ग" : "Kids path"}
            </Link>
            <Link href={`/${locale}/path/hanuman-chalisa/`} className="btn-ghost !px-3 !py-1.5 text-xs">
              {isHi ? "कोमल चालीसा" : "Gentle Chalisa"}
            </Link>
            <Link href={`/${locale}/japa/`} className="btn-ghost !px-3 !py-1.5 text-xs">
              {isHi ? "मंत्र जप" : "Mantra japa"}
            </Link>
            <Link href={`/${locale}/katha/`} className="btn-ghost !px-3 !py-1.5 text-xs">
              {isHi ? "सरल कथा" : "Gentle katha"}
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="section-title text-xl">{t("jayanti")}</h2>
        <p className="mt-2 text-xs" style={{ color: "var(--hanumat-stone)" }}>{t("traditionsVary")}</p>
        <ul className="mt-4 space-y-3">
          {jayantiTraditions.map(
            (tr: { region: string; rule: string; note: string }) => (
              <li
                key={tr.region}
                className="temple-card px-4 py-3"
              >
                <p className="font-medium" style={{ color: "var(--hanumat-shadow)" }}>{tr.region}</p>
                <p className="text-sm" style={{ color: "var(--hanumat-vermillion-deep)" }}>{tr.rule}</p>
                <p className="text-xs" style={{ color: "var(--hanumat-stone)" }}>{tr.note}</p>
              </li>
            ),
          )}
        </ul>
      </section>
    </SiteShell>
  );
}
