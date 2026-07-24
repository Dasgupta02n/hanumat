import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/SiteShell";
import { jayantiTraditions } from "@/lib/content";
import { isLocale, type Locale } from "@/i18n/config";

const familyMangalwarChecklist = {
  en: [
    "Light a diya together — one small flame for the whole home.",
    "Read or listen to a few lines of the Chalisa as a family.",
    "Offer a simple prasad — fruit, tulsi, or whatever you share at home.",
    "Sit quietly for a short japa — even five soft rounds counts.",
    "Invite the little ones to the Kids path for gentle stories.",
  ],
  hi: [
    "एक साथ दीया जलाएँ — घर के लिए एक छोटी ज्योति।",
    "परिवार के साथ चालीसा की कुछ पंक्तियाँ पढ़ें या सुनें।",
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
      <p className="text-xs text-[#6b5a80]">Wave 1 · Family W3</p>
      <h1 className="font-serif text-4xl text-[#fff8e7]">{t("title")}</h1>
      <p className="mt-2 max-w-xl text-sm text-[#a994c4]">{t("intro")}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-[#f48c06]/40 bg-[#f48c06]/10 p-6">
          <h2 className="font-serif text-2xl text-[#ffd60a]">{t("tue")}</h2>
          <p className="mt-2 text-sm text-[#e8dcf5]">
            Chalisa · japa · aarti · prasad
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <Link
              href={`/${locale}/path/hanuman-chalisa/`}
              className="rounded-full bg-white/10 px-3 py-1 text-[#fff8e7]"
            >
              Chalisa
            </Link>
            <Link
              href={`/${locale}/japa/`}
              className="rounded-full bg-white/10 px-3 py-1 text-[#fff8e7]"
            >
              Japa
            </Link>
            <Link
              href={`/${locale}/path/hanuman-aarti/`}
              className="rounded-full bg-white/10 px-3 py-1 text-[#fff8e7]"
            >
              Aarti
            </Link>
          </div>
        </div>
        <div className="rounded-2xl border border-white/15 bg-white/5 p-6">
          <h2 className="font-serif text-2xl text-[#fff8e7]">{t("sat")}</h2>
          <p className="mt-2 text-sm text-[#cbb8e0]">
            Sundar Kand · Sankatmochan · aarti
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <Link
              href={`/${locale}/path/sundar-kand/`}
              className="rounded-full bg-white/10 px-3 py-1 text-[#fff8e7]"
            >
              Sundar Kand
            </Link>
            <Link
              href={`/${locale}/path/sankatmochan-ashtak/`}
              className="rounded-full bg-white/10 px-3 py-1 text-[#fff8e7]"
            >
              Ashtak
            </Link>
            <Link
              href={`/${locale}/parayan/`}
              className="rounded-full bg-white/10 px-3 py-1 text-[#fff8e7]"
            >
              Parayan
            </Link>
          </div>
        </div>
      </div>

      {/* Family · Mangalwar checklist + kids-safe links (W3) */}
      <section className="mt-10 rounded-2xl border border-[#ffd60a]/25 bg-[#ffd60a]/5 p-6">
        <h2 className="font-serif text-2xl text-[#ffd60a]">
          {isHi ? "परिवार · मंगलवार सूची" : "Family · Mangalwar checklist"}
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-[#cbb8e0]">
          {isHi
            ? "मंगलवार को घर का छोटा मंदिर — जल्दबाजी नहीं, केवल साझा भक्ति। परंपराएँ भिन्न हो सकती हैं।"
            : "A small home mandir on Tuesday — no rush, only shared devotion. Traditions may vary."}
        </p>
        <ol className="mt-5 list-decimal space-y-3 pl-5 text-sm text-[#e8dcf5]">
          {checklist.map((item) => (
            <li key={item} className="pl-1 leading-relaxed">
              {item}
            </li>
          ))}
        </ol>

        <div className="mt-6">
          <p className="text-xs font-medium uppercase tracking-wide text-[#6b5a80]">
            {isHi ? "बाल-सुरक्षित कड़ियाँ" : "Kids-safe links"}
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <Link
              href={`/${locale}/kids/`}
              className="rounded-full border border-[#f48c06]/40 bg-[#f48c06]/15 px-3 py-1.5 text-[#fff8e7]"
            >
              {isHi ? "बाल मार्ग" : "Kids path"}
            </Link>
            <Link
              href={`/${locale}/path/hanuman-chalisa/`}
              className="rounded-full bg-white/10 px-3 py-1.5 text-[#fff8e7]"
            >
              {isHi ? "कोमल चालीसा" : "Gentle Chalisa"}
            </Link>
            <Link
              href={`/${locale}/japa/`}
              className="rounded-full bg-white/10 px-3 py-1.5 text-[#fff8e7]"
            >
              {isHi ? "मंत्र जप" : "Mantra japa"}
            </Link>
            <Link
              href={`/${locale}/katha/`}
              className="rounded-full bg-white/10 px-3 py-1.5 text-[#fff8e7]"
            >
              {isHi ? "सरल कथा" : "Gentle katha"}
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-serif text-xl text-[#ffd60a]">{t("jayanti")}</h2>
        <p className="mt-2 text-xs text-[#6b5a80]">{t("traditionsVary")}</p>
        <ul className="mt-4 space-y-3">
          {jayantiTraditions.map(
            (tr: { region: string; rule: string; note: string }) => (
              <li
                key={tr.region}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3"
              >
                <p className="font-medium text-[#fff8e7]">{tr.region}</p>
                <p className="text-sm text-[#f48c06]">{tr.rule}</p>
                <p className="text-xs text-[#a994c4]">{tr.note}</p>
              </li>
            ),
          )}
        </ul>
      </section>
    </SiteShell>
  );
}
