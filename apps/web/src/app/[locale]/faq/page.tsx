import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { JsonLd } from "@/components/JsonLd";
import { isLocale, type Locale } from "@/i18n/config";

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  setRequestLocale(locale);
  const en = locale === "en";

  const faqs = [
    {
      q: en ? "What is Hanumat?" : "हनुमत क्या है?",
      a: en
        ? "A free digital mandir for Hanuman, Shiva and Maa Kali — path, IAST, meaning, japa. No ads, no accounts."
        : "हनुमान, शिव और माँ काली का निःशुल्क डिजिटल मन्दिर — पाठ, IAST, अर्थ, जप। विज्ञापन नहीं, खाता नहीं।",
    },
    {
      q: en ? "Is the audio classical pāṭh?" : "क्या श्रवण शास्त्रीय पाठ है?",
      a: en
        ? "No. Neural TTS path-assist so you can follow the text. Not temple recitation."
        : "नहीं। Neural TTS पाठ-सहायक है ताकि पाठ साथ चल सके। मंदिर पाठी नहीं।",
    },
    {
      q: en ? "Can I read in Roman letters?" : "रोमन अक्षरों में पढ़ सकते हैं?",
      a: en
        ? "Yes. On English Path Studio tap IAST or “Roman letters.”"
        : "हाँ। अंग्रेज़ी पाठ स्टूडियो में IAST / Roman letters दबाएँ।",
    },
    {
      q: en ? "How do I keep the mandir on my phone?" : "फ़ोन पर मन्दिर कैसे रखें?",
      a: en
        ? "Add to Home Screen (install prompt after Chalisa). Then My Path → Chalisa offline pack."
        : "होम स्क्रीन पर जोड़ें। फिर मेरा पथ → चालीसा ऑफ़लाइन पैक।",
    },
    {
      q: en ? "Does Hanumat show ads?" : "क्या विज्ञापन हैं?",
      a: en ? "No. Pure seva — no ads, no paywall, no paid puja." : "नहीं। निःशुल्क सेवा — विज्ञापन, पेवॉल, सशुल्क पूजा नहीं।",
    },
    {
      q: en ? "Are shlokas verified?" : "क्या श्लोक जाँचे गए?",
      a: en
        ? "Each path names sources (edition pin). Two public recensions where we publish new hymns. No Karpuradi, no unverified Kali Chalisa."
        : "प्रत्येक पाठ पर स्रोत (edition pin)। नये स्तोत्र दो सार्वजनिक पाठों से। कर्पूरादि और असत्यापित काली चालीसा नहीं।",
    },
  ];

  return (
    <SiteShell>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
      <p className="section-kicker">{en ? "Quiet temple" : "शांत मन्दिर"}</p>
      <h1 className="section-title mt-2 text-4xl">FAQ</h1>
      <div className="mt-8 space-y-4">
        {faqs.map((f) => (
          <article key={f.q} className="temple-card p-5">
            <h2 className="font-serif text-lg">{f.q}</h2>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--hanumat-stone)" }}>
              {f.a}
            </p>
          </article>
        ))}
      </div>
      <p className="mt-8 text-sm">
        <Link href={`/${locale}/trust/`} className="hover:underline" style={{ color: "var(--hanumat-vermillion-deep)" }}>
          {en ? "Trust & sources" : "विश्वास व स्रोत"} →
        </Link>
      </p>
    </SiteShell>
  );
}
