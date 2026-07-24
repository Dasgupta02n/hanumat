import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/SiteShell";
import { isLocale, type Locale } from "@/i18n/config";

/** Three short kid-safe leela blurbs — original, no fear language. */
const leelas = [
  {
    id: "sunny-fruit",
    titleEn: "The bright fruit in the sky",
    titleHi: "आकाश का चमकता फल",
    bodyEn:
      "Little Hanuman saw a big golden light and thought it was a ripe fruit. With a happy heart he jumped high to share it. The sky smiled, and friends later taught him gentle ways to use his great strength.",
    bodyHi:
      "छोटे हनुमान ने एक बड़ा सुनहरा प्रकाश देखा और सोचा — यह पका फल है। खुश मन से वे ऊँचे कूद पड़े, बाँटने के लिए। आकाश मुस्कुराया; फिर मित्रों ने सिखाया कि बड़ी शक्ति को कोमल ढंग से कैसे प्रयोग करें।",
  },
  {
    id: "kind-helper",
    titleEn: "The kind helper who crossed the sea",
    titleHi: "समुद्र पार करने वाला दयालु सहायक",
    bodyEn:
      "Hanuman loved his friends very much. When someone far away needed care, he took a long leap over blue water to bring good news and warm hope. Helping others made his heart light and strong.",
    bodyHi:
      "हनुमान अपने मित्रों से बहुत प्रेम करते थे। जब दूर किसी को सहारे की ज़रूरत पड़ी, वे नीले जल के ऊपर लंबी छलांग भरकर शुभ समाचार और आशा ले गए। दूसरों की सहायता से उनका मन हल्का और बलवान बना।",
  },
  {
    id: "healing-hill",
    titleEn: "The mountain of healing plants",
    titleHi: "औषधि वाले पहाड़ की कहानी",
    bodyEn:
      "A dear friend felt very tired and needed special green plants. Hanuman looked carefully, then lifted a whole hill of herbs so help would arrive in time. Love and care can move mountains — even for a child who tries with a pure heart.",
    bodyHi:
      "एक प्रिय मित्र थक गए थे और उन्हें विशेष हरे पौधे चाहिए थे। हनुमान ने ध्यान से देखा, फिर औषधियों वाला पूरा पहाड़ उठा लाए ताकि समय पर सहायता पहुँचे। प्रेम और देखभाल पहाड़ भी हिला सकती है — शुद्ध मन से कोशिश करने वाले बच्चे के लिए भी।",
  },
] as const;

export default async function KidsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("kids");
  const isHi = locale === "hi";

  return (
    <SiteShell>
      <p className="text-xs text-[#6b5a80]">Wave 3 · kids-safe</p>
      <h1 className="font-serif text-5xl text-[#fff8e7] sm:text-6xl">
        {t("title")}
      </h1>
      <p className="mt-3 max-w-xl text-lg text-[#cbb8e0] sm:text-xl">
        {t("intro")}
      </p>

      {/* Three kid-safe leela blurbs — large type */}
      <section className="mt-10">
        <h2 className="font-serif text-3xl text-[#ffd60a] sm:text-4xl">
          {isHi ? "तीन छोटी लीलाएँ" : "Three short leelas"}
        </h2>
        <p className="mt-2 text-base text-[#a994c4] sm:text-lg">
          {isHi
            ? "सरल शब्द · कोमल भाव · कोई भय की भाषा नहीं।"
            : "Simple words · gentle feelings · no fear language."}
        </p>
        <ul className="mt-6 grid gap-5">
          {leelas.map((leela, i) => (
            <li
              key={leela.id}
              className="rounded-3xl border border-white/15 bg-white/5 p-6 sm:p-8"
            >
              <p className="text-sm font-medium uppercase tracking-wide text-[#f48c06]">
                {isHi ? `लीला ${i + 1}` : `Leela ${i + 1}`}
              </p>
              <h3 className="mt-2 font-serif text-2xl text-[#fff8e7] sm:text-3xl">
                {isHi ? leela.titleHi : leela.titleEn}
              </h3>
              <p
                className="mt-4 text-xl leading-relaxed text-[#e8dcf5] sm:text-2xl"
                lang={isHi ? "hi" : "en"}
              >
                {isHi ? leela.bodyHi : leela.bodyEn}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* Safe path links — large type */}
      <section className="mt-12">
        <h2 className="font-serif text-3xl text-[#ffd60a] sm:text-4xl">
          {isHi ? "आगे बढ़ें" : "Soft next steps"}
        </h2>
        <div className="mt-6 grid gap-5">
          <Link
            href={`/${locale}/path/hanuman-chalisa/`}
            className="rounded-3xl border-2 border-[#f48c06]/50 bg-[#f48c06]/15 p-8 text-center sm:p-10"
          >
            <p className="font-serif text-3xl text-[#fff8e7] sm:text-4xl">
              {t("chalisa")}
            </p>
            <p className="mt-2 text-xl text-[#ffd60a] sm:text-2xl" lang="hi">
              जय हनुमान ज्ञान गुन सागर
            </p>
            <p className="mt-3 text-base text-[#cbb8e0] sm:text-lg">
              {isHi
                ? "धीरे-धीरे पढ़ें या सुनें — जल्दबाजी नहीं।"
                : "Read or listen slowly — no hurry."}
            </p>
          </Link>
          <Link
            href={`/${locale}/japa/`}
            className="rounded-3xl border-2 border-white/20 bg-white/5 p-8 text-center sm:p-10"
          >
            <p className="font-serif text-3xl text-[#fff8e7] sm:text-4xl">
              {t("mantra")}
            </p>
            <p className="mt-2 text-3xl text-[#f48c06] sm:text-4xl" lang="hi">
              ॐ हनुमते नमः
            </p>
            <p className="mt-3 text-base text-[#cbb8e0] sm:text-lg">
              {isHi
                ? "एक नाम, शांत साँस — घर पर अभ्यास करें।"
                : "One name, quiet breath — practice at home."}
            </p>
          </Link>
          <Link
            href={`/${locale}/katha/`}
            className="rounded-3xl border-2 border-white/20 bg-white/5 p-8 text-center sm:p-10"
          >
            <p className="font-serif text-3xl text-[#fff8e7] sm:text-4xl">
              {t("katha")}
            </p>
            <p className="mt-2 text-lg text-[#cbb8e0] sm:text-xl">
              {isHi
                ? "बल और भक्ति की सरल कथाएँ"
                : "Stories of strength and kindness"}
            </p>
            <p className="mt-3 text-base text-[#a994c4] sm:text-lg">
              {isHi
                ? "और कोमल कथाएँ यहाँ मिलेंगी।"
                : "More gentle stories live here."}
            </p>
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}
