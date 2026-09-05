import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { JsonLd } from "@/components/JsonLd";
import { deityHref, deities, type DeityId } from "@/lib/deities";
import type { Locale } from "@/i18n/config";

export type SevaKind = "trust" | "for-temples" | "media-kit";

export function SevaPage({
  deity,
  locale,
  kind,
}: {
  deity: DeityId;
  locale: Locale;
  kind: SevaKind;
}) {
  const en = locale === "en";
  const d = deities[deity];
  const h = (p: string) => deityHref(deity, locale, p);
  const home = "https://hanumat.life";
  const gate = `${home}${h("/")}`;
  const chalisa = `${home}/en/path/hanuman-chalisa/`;

  const titles: Record<SevaKind, { hi: string; en: string }> = {
    trust: { hi: "विश्वास · शांत मन्दिर", en: "Trust · a quiet temple" },
    "for-temples": { hi: "मन्दिरों व बाल विहार के लिए", en: "For temples, Bal Vihar & HSAs" },
    "media-kit": { hi: "मीडिया किट · यूट्यूब पाठ", en: "Media kit · YouTube path" },
  };

  const emailTemple = en
    ? `Subject: Free Path Studio for your mandir (hanumat.life)

Namaste,

Hanumat is a free digital mandir (no ads, no accounts) for Hanuman, Shiva and Maa Kali — mula, IAST, English/Hindi meaning.

A QR to ${gate} in the courtyard or prasad hall lets devotees read along after aarti, including children who need Roman letters (IAST).

We do not sell puja. Printable A4 parayan sheets are on the site.

With respects,
hanumat.life · hello@hanumat.life`
    : `विषय: आपके मन्दिर के लिए निःशुल्क पाठ स्टूडियो (hanumat.life)

नमस्ते,

हनुमत निःशुल्क डिजिटल मन्दिर है (विज्ञापन नहीं, खाता नहीं) — हनुमान, शिव, माँ काली। मूल, IAST, अर्थ।

आंगन/प्रसाद कक्ष में QR (${gate}) से आरती के बाद पाठ हो सकता है।

पूजा नहीं बेचते। A4 पारायण शीट साइट पर है।

सादर,
hanumat.life · hello@hanumat.life`;

  const ytScripts = [
    {
      title: en ? "Tuesday 60s — Chalisa" : "मंगलवार ६० सेकंड — चालीसा",
      body: en
        ? "On screen: one chaupai (mula). Cut to IAST. One-line English meaning. End card: Open Path Studio — hanumat.life/en/path/hanuman-chalisa/ — TTS is path-assist, not temple path. Folk-leela thumbnail from the 108 gallery."
        : "स्क्रीन: एक चौपाई (मूल) → IAST → एक पंक्ति अर्थ। अंत: पाठ स्टूडियो खोलें। TTS पाठ-सहायक है, मंदिर पाठी नहीं।",
    },
    {
      title: en ? "Monday — Lingashtakam line" : "सोमवार — लिङ्गाष्टकम्",
      body: en
        ? "One verse of Lingashtakam + IAST + meaning. End: /shiva/en/path/lingashtakam/. No miracle claims."
        : "एक श्लोक + IAST + अर्थ। लिंक शिवायतन। चमत्कार दावा नहीं।",
    },
    {
      title: en ? "Amavasya — Kalika Ashtakam (reverent)" : "अमावस्या — कालिकाष्टकम्",
      body: en
        ? "Reverent still, no sensational Kali. One verse + meaning. End: /kali/en/path/kalika-ashtakam/. Never Karpuradi, never unverified Kali Chalisa."
        : "गंभीर चित्र, सनसनी नहीं। एक श्लोक। कर्पूरादि/काली चालीसा नहीं।",
    },
  ];

  return (
    <SiteShell>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: en ? titles[kind].en : titles[kind].hi,
          url: `https://hanumat.life${h(`/${kind}/`)}`,
          isPartOf: { "@type": "WebSite", name: "Hanumat", url: home },
        }}
      />
      <p className="section-kicker">{en ? d.eyebrow.en : d.eyebrow.hi}</p>
      <h1 className="section-title mt-2 text-4xl">{en ? titles[kind].en : titles[kind].hi}</h1>

      {kind === "trust" && (
        <div className="mt-8 max-w-2xl space-y-6 text-sm leading-relaxed" style={{ color: "var(--hanumat-stone)" }}>
          <p>
            {en
              ? "Hanumat is a quiet digital temple for Bharat and the world. Read, listen, japa. No ads, no accounts, no trackers."
              : "हनुमत भारत और विश्व के लिए शांत डिजिटल मन्दिर है। पाठ, श्रवण, जप। विज्ञापन, खाता, ट्रैकर नहीं।"}
          </p>
          <ul className="list-inside list-disc space-y-2">
            <li>
              {en
                ? "Two public recensions named on each path (edition pin). Meanings are plain language, not scholarly ṭīkā."
                : "प्रत्येक पाठ पर दो सार्वजनिक स्रोत (edition pin)। अर्थ साधारण भाषा — शास्त्रीय टीका नहीं।"}
            </li>
            <li>
              {en
                ? "Audio is neural path-assist, not classical temple pāṭh — unless a studio recitation is later added."
                : "श्रवण neural पाठ-सहायक है, मंदिर पाठी नहीं — जब तक स्टूडियो पाठ न जुड़े।"}
            </li>
            <li>
              {en
                ? "No Karpuradi paddhati. No unverified Kali Chalisa. Kali depictions stay reverent."
                : "कर्पूरादि पद्धति नहीं। असत्यापित काली चालीसा नहीं। काली चित्र श्रद्धापूर्ण।"}
            </li>
            <li>
              {en
                ? "We do not sell puja, astrology, or “remove sade sati” packs."
                : "पूजा, ज्योतिष या साढ़े साती पैक नहीं बेचते।"}
            </li>
          </ul>
          <p>
            <Link href={h("/faq/")} className="hover:underline" style={{ color: "var(--hanumat-vermillion-deep)" }}>
              FAQ →
            </Link>
            {" · "}
            <Link href={h("/learn/")} className="hover:underline" style={{ color: "var(--hanumat-vermillion-deep)" }}>
              {en ? "Sources" : "स्रोत"} →
            </Link>
          </p>
        </div>
      )}

      {kind === "for-temples" && (
        <div className="mt-8 max-w-2xl space-y-6 text-sm leading-relaxed" style={{ color: "var(--hanumat-stone)" }}>
          <p>
            {en
              ? "Print this for a notice board. We cannot email your mandir for you — copy the letter below."
              : "सूचना पट के लिए छापें। हम आपके मन्दिर को ईमेल नहीं भेज सकते — पत्र कॉपी करें।"}
          </p>
          <div className="temple-card p-6 text-center">
            <p className="section-kicker">QR / URL</p>
            <p className="mt-2 font-serif text-2xl">{home}</p>
            <p className="mt-1 text-xs">
              {en ? "Courtyard · English default · Hindi one tap" : "आंगन · अंग्रेज़ी मूल · हिन्दी एक टैप"}
            </p>
            <p className="mt-4 font-mono text-sm">{chalisa}</p>
            <p className="mt-2 text-xs">
              {en
                ? "Make a QR of this URL in any generator and paste it on the printout."
                : "इस URL का QR किसी जनरेटर से बनाकर प्रिंट पर चिपकाएँ।"}
            </p>
          </div>
          <pre className="temple-card overflow-x-auto whitespace-pre-wrap p-4 text-xs">{emailTemple}</pre>
          <p>
            <a
              className="btn-gold inline-flex"
              href={`mailto:hello@hanumat.life?subject=${encodeURIComponent("Temple / Bal Vihar — hanumat.life")}`}
            >
              {en ? "Send us a temple contact" : "मन्दिर संपर्क हमें लिखें"}
            </a>
          </p>
        </div>
      )}

      {kind === "media-kit" && (
        <div className="mt-8 max-w-2xl space-y-6 text-sm leading-relaxed" style={{ color: "var(--hanumat-stone)" }}>
          <p>
            {en
              ? "Scripts you can film. We cannot upload to YouTube or run a channel from here."
              : "फिल्माने योग्य पटकथा। यहाँ से यूट्यूब अपलोड नहीं हो सकता।"}
          </p>
          {ytScripts.map((s) => (
            <article key={s.title} className="temple-card p-5">
              <h2 className="font-serif text-lg">{s.title}</h2>
              <p className="mt-2">{s.body}</p>
            </article>
          ))}
          <p className="text-xs">
            {en
              ? "End card every time: Free seva · no ads · TTS is not classical pāṭh · hanumat.life"
              : "हर अंत कार्ड: निःशुल्क सेवा · विज्ञापन नहीं · TTS पाठी नहीं · hanumat.life"}
          </p>
        </div>
      )}
    </SiteShell>
  );
}
