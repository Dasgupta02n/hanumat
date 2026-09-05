import type { DeityId } from "@/lib/deities";
import { deities, deityHref } from "@/lib/deities";

export type ExtraKind =
  | "calendar"
  | "parayan"
  | "katha"
  | "temples"
  | "glossary"
  | "kids"
  | "radio"
  | "sankat"
  | "search";

export type BiText = { hi: string; en: string };

export type TempleItem = { id: string; name: BiText; region: string; note: BiText };
export type GlossaryItem = { term: string; hi: string; body: BiText };
export type KathaItem = { id: string; title: BiText; body: BiText; galleryIndex: number };
export type KidsItem = { id: string; title: BiText; body: BiText };
export type CalendarCard = { id: string; title: BiText; body: BiText; href: string; links: { href: string; label: BiText }[] };

export function extrasFor(deity: DeityId, locale: string) {
  const h = (p: string) => deityHref(deity, locale, p);
  const d = deities[deity];

  const calendar: CalendarCard[] =
    deity === "hanuman"
      ? [
          {
            id: "tue",
            title: { hi: "मंगलवार", en: "Tuesday" },
            body: { hi: "चालीसा · जप · आरती · प्रसाद", en: "Chalisa · japa · aarti · prasad" },
            href: h("/path/hanuman-chalisa/"),
            links: [
              { href: h("/path/hanuman-chalisa/"), label: { hi: "चालीसा", en: "Chalisa" } },
              { href: h("/japa/"), label: { hi: "जप", en: "Japa" } },
              { href: h("/path/hanuman-aarti/"), label: { hi: "आरती", en: "Aarti" } },
            ],
          },
          {
            id: "sat",
            title: { hi: "शनिवार", en: "Saturday" },
            body: { hi: "सुंदरकांड · संकटमोचन · आरती", en: "Sundar Kand · Sankatmochan · aarti" },
            href: h("/path/sundar-kand/"),
            links: [
              { href: h("/path/sundar-kand/"), label: { hi: "सुंदरकांड", en: "Sundar Kand" } },
              { href: h("/path/sankatmochan-ashtak/"), label: { hi: "अष्टक", en: "Ashtak" } },
            ],
          },
        ]
      : deity === "shiva"
        ? [
            {
              id: "mon",
              title: { hi: "सोमवार", en: "Monday" },
              body: { hi: "ॐ नमः शिवाय · बिल्व · अभिषेक भाव", en: "Om Namah Shivaya · bel · abhisheka mood" },
              href: h("/path/om-namah-shivaya/"),
              links: [
                { href: h("/path/om-namah-shivaya/"), label: { hi: "पञ्चाक्षर", en: "Panchakshara" } },
                { href: h("/japa/"), label: { hi: "जप", en: "Japa" } },
                { href: h("/path/lingashtakam/"), label: { hi: "लिङ्गाष्टकम्", en: "Lingashtakam" } },
              ],
            },
            {
              id: "pradosh",
              title: { hi: "प्रदोष", en: "Pradosha" },
              body: { hi: "त्रयोदशी संध्या · रुद्राष्टक · आरती", en: "Trayodashi dusk · Rudrashtakam · aarti" },
              href: h("/path/rudrashtakam/"),
              links: [
                { href: h("/path/rudrashtakam/"), label: { hi: "रुद्राष्टकम्", en: "Rudrashtakam" } },
                { href: h("/path/shiv-aarti/"), label: { hi: "आरती", en: "Aarti" } },
              ],
            },
            {
              id: "ratri",
              title: { hi: "महाशिवरात्रि", en: "Maha Shivaratri" },
              body: { hi: "जागरण · मृत्युंजय · लिङ्गाष्टकम्", en: "Night vigil · Mrityunjaya · Lingashtakam" },
              href: h("/path/maha-mrityunjaya/"),
              links: [
                { href: h("/path/maha-mrityunjaya/"), label: { hi: "मृत्युंजय", en: "Mrityunjaya" } },
                { href: h("/path/lingashtakam/"), label: { hi: "लिङ्गाष्टकम्", en: "Lingashtakam" } },
              ],
            },
          ]
        : [
            {
              id: "amavasya",
              title: { hi: "अमावस्या", en: "Amavasya" },
              body: { hi: "माँ का जप · आद्या स्तोत्र · दीप", en: "Mother’s japa · Adya Stotram · lamps" },
              href: h("/japa/"),
              links: [
                { href: h("/japa/"), label: { hi: "जप", en: "Japa" } },
                { href: h("/path/adya-stotram/"), label: { hi: "आद्या", en: "Adya" } },
              ],
            },
            {
              id: "kalipuja",
              title: { hi: "काली पूजा / दीपावली", en: "Kali puja / Deepavali" },
              body: { hi: "कालिकाष्टकम् · आरती · जवा पुष्प", en: "Kalika Ashtakam · aarti · hibiscus" },
              href: h("/path/kalika-ashtakam/"),
              links: [
                { href: h("/path/kalika-ashtakam/"), label: { hi: "कालिकाष्टकम्", en: "Kalika Ashtakam" } },
                { href: h("/path/kali-aarti/"), label: { hi: "आरती", en: "Aarti" } },
              ],
            },
          ];

  const temples: TempleItem[] =
    deity === "hanuman"
      ? []
      : deity === "shiva"
        ? [
            { id: "somnath", name: { hi: "सोमनाथ", en: "Somnath" }, region: "Gujarat", note: { hi: "प्रथम ज्योतिर्लिङ्ग।", en: "First of the jyotirlingas." } },
            { id: "kedar", name: { hi: "केदारनाथ", en: "Kedarnath" }, region: "Uttarakhand", note: { hi: "हिमालय का केदार।", en: "Himalayan Kedar." } },
            { id: "mahakal", name: { hi: "महाकालेश्वर", en: "Mahakaleshwar" }, region: "Ujjain", note: { hi: "दक्षिणाभिमुख महाकाल।", en: "South-facing Mahakal." } },
            { id: "vishwanath", name: { hi: "काशी विश्वनाथ", en: "Kashi Vishwanath" }, region: "Varanasi", note: { hi: "आनन्दवन काशी।", en: "Kashi, forest of bliss." } },
            { id: "rameshwar", name: { hi: "रामेश्वरम्", en: "Rameshwaram" }, region: "Tamil Nadu", note: { hi: "सेतु पर ज्योतिर्लिङ्ग।", en: "Jyotirlinga on the setu." } },
            { id: "pashupati", name: { hi: "पशुपतिनाथ", en: "Pashupatinath" }, region: "Nepal", note: { hi: "नेपाल का पशुपति।", en: "Pashupati of Nepal." } },
            { id: "amarnath", name: { hi: "अमरनाथ", en: "Amarnath" }, region: "Kashmir", note: { hi: "हिम लिङ्ग यात्रा।", en: "Ice-lingam yatra." } },
            { id: "srisailam", name: { hi: "श्रीशैलम् मल्लिकार्जुन", en: "Srisailam Mallikarjuna" }, region: "Andhra", note: { hi: "मल्लिकार्जुन ज्योतिर्लिङ्ग।", en: "Mallikarjuna jyotirlinga." } },
          ]
        : [
            { id: "kalighat", name: { hi: "कालीघाट", en: "Kalighat" }, region: "Kolkata", note: { hi: "बंगाल का प्रधान पीठ।", en: "Principal Bengal pith." } },
            { id: "dakshineswar", name: { hi: "दक्षिणेश्वर", en: "Dakshineswar" }, region: "Hooghly", note: { hi: "रामकृष्ण का काली मंदिर।", en: "Ramakrishna’s Kali temple." } },
            { id: "kamakhya", name: { hi: "कामाख्या", en: "Kamakhya" }, region: "Assam", note: { hi: "नीलाचल का शक्तिपीठ।", en: "Shakti pith on Nilachal." } },
            { id: "tarapith", name: { hi: "तारापीठ", en: "Tarapith" }, region: "Birbhum", note: { hi: "तारा माँ का क्षेत्र।", en: "Kshetra of Tara Ma." } },
            { id: "adyapeeth", name: { hi: "आद्यापीठ", en: "Adyapeeth" }, region: "Kolkata", note: { hi: "आद्या काली का पीठ।", en: "Pith of Adya Kali." } },
          ];

  const glossary: GlossaryItem[] =
    deity === "shiva"
      ? [
          { term: "Jyotirlinga", hi: "ज्योतिर्लिङ्ग", body: { hi: "शिव के द्वादश ज्योति-रूप लिङ्ग।", en: "Twelve light-form lingas of Shiva." } },
          { term: "Panchakshara", hi: "पञ्चाक्षर", body: { hi: "न-मः-शि-वा-य — पाँच अक्षर का जप।", en: "Na-mah-shi-va-ya — five-syllable japa." } },
          { term: "Pradosha", hi: "प्रदोष", body: { hi: "त्रयोदशी की संध्या का शिव व्रत।", en: "Shiva vrata on the trayodashi dusk." } },
          { term: "Rudraksha", hi: "रुद्राक्ष", body: { hi: "शिव-प्रिय बीज माला।", en: "Seed-bead mala dear to Shiva." } },
          { term: "Abhisheka", hi: "अभिषेक", body: { hi: "जल, दूध, पञ्चामृत से लिङ्ग स्नान।", en: "Bathing the lingam with water, milk, panchamrita." } },
          { term: "Mrityunjaya", hi: "मृत्युंजय", body: { hi: "त्र्यम्बकम् यजामहे — मृत्युंजय मन्त्र।", en: "Tryambakam yajamahe — the death-conquering mantra." } },
        ]
      : deity === "kali"
        ? [
            { term: "Adya", hi: "आद्या", body: { hi: "आदि शक्ति — काली का आदि रूप।", en: "Primordial Shakti — Kali as the first." } },
            { term: "Dakshina Kali", hi: "दक्षिण काली", body: { hi: "दाहिने पैर आगे, करुणा-प्रधान रूप।", en: "Right foot forward, the compassionate form." } },
            { term: "Krim", hi: "क्रीं", body: { hi: "काली बीज मन्त्र।", en: "The Kali bija mantra." } },
            { term: "Amavasya", hi: "अमावस्या", body: { hi: "कृष्ण पक्ष की अमावस्या — काली पूजा का दिन।", en: "New moon — a day of Kali worship." } },
            { term: "Mahavidya", hi: "महाविद्या", body: { hi: "दस महाविद्याओं में काली प्रथम।", en: "Kali is first among the ten Mahavidyas." } },
            { term: "Pith", hi: "पीठ", body: { hi: "शक्ति का निवास क्षेत्र।", en: "A seat / kshetra of Shakti." } },
          ]
        : [];

  const katha: KathaItem[] =
    deity === "shiva"
      ? [
          { id: "ganga", title: { hi: "गङ्गा अवतरण", en: "Ganga’s descent" }, body: { hi: "भगीरथ की तपस्या से गङ्गा आईं; शिव ने उन्हें जटा में धारण किया ताकि पृथ्वी सह सके।", en: "From Bhagiratha’s tapas Ganga came; Shiva held her in the jata so the earth could bear her." }, galleryIndex: 16 },
          { id: "neelkanth", title: { hi: "नीलकण्ठ", en: "Neelkanth" }, body: { hi: "समुद्र मन्थन का विष शिव ने कंठ में धारण किया — करुणा से जगत् की रक्षा।", en: "Shiva held the churning’s poison in the throat — the world kept by compassion." }, galleryIndex: 18 },
          { id: "girija", title: { hi: "गिरिजा कल्याण", en: "Wedding of Girija" }, body: { hi: "पार्वती की तपस्या के बाद कैलास पर शिव-पार्वती विवाह — गृहस्थ योग का आदर्श।", en: "After Parvati’s tapas, the wedding on Kailash — household yoga." }, galleryIndex: 11 },
        ]
      : deity === "kali"
        ? [
            { id: "adya", title: { hi: "आद्या का प्रादुर्भाव", en: "Adya appears" }, body: { hi: "जब असुर-भार बढ़ा, आदि शक्ति काली रूप में प्रकट हुईं — जगत् की रक्षा के लिए।", en: "When the burden of asuras grew, Adya Shakti appeared as Kali to protect the world." }, galleryIndex: 0 },
            { id: "dakshina", title: { hi: "दक्षिण काली की करुणा", en: "Compassion of Dakshina Kali" }, body: { hi: "शिव शव पर पैर रखकर माँ रुकती हैं — जिह्वा लज्जा, भक्त पर दया।", en: "The Mother pauses upon Shiva — the tongue of humility, mercy on the devotee." }, galleryIndex: 9 },
            { id: "ramakrishna", title: { hi: "दक्षिणेश्वर का दर्शन", en: "Darshan at Dakshineswar" }, body: { hi: "रामकृष्ण माँ काली को जीवन्त देखा — भक्ति का घर-आँगन रूप।", en: "Ramakrishna saw Ma Kali as living — household bhakti." }, galleryIndex: 19 },
          ]
        : [];

  const kids: KidsItem[] =
    deity === "shiva"
      ? [
          { id: "nandi", title: { hi: "नन्दी द्वारपाल", en: "Nandi at the gate" }, body: { hi: "सफेद नन्दी मंदिर के द्वार पर बैठे हैं। जो शांत मन से आता है, नन्दी उसे अंदर बुलाते हैं।", en: "White Nandi sits at the temple gate. Whoever comes with a quiet heart, Nandi welcomes in." } },
          { id: "ganga-hair", title: { hi: "जटा में नदी", en: "A river in the hair" }, body: { hi: "एक बड़ी नदी बहुत तेज आ रही थी। शिव ने उसे अपनी जटा में धीरे से रोका, ताकि सब सुरक्षित रहें।", en: "A great river came too fast. Shiva held her gently in his hair so everyone stayed safe." } },
          { id: "bel", title: { hi: "बिल्व पत्र", en: "Bel leaves" }, body: { hi: "तीन पत्तों वाला बिल्व शिव को प्रिय है। एक छोटा बच्चा भी प्रेम से पत्र चढ़ा सकता है।", en: "The three-leaved bel is dear to Shiva. Even a small child may offer a leaf with love." } },
        ]
      : deity === "kali"
        ? [
            { id: "hibiscus", title: { hi: "लाल जवा फूल", en: "Red hibiscus" }, body: { hi: "माँ काली को लाल जवा फूल बहुत भाता है। बच्चे प्रेम से फूल चढ़ाते हैं, माँ मुस्कुराती हैं।", en: "Ma Kali loves the red hibiscus. Children offer flowers with love; the Mother smiles." } },
            { id: "lamp", title: { hi: "माँ का दीया", en: "Mother’s lamp" }, body: { hi: "अँधेरे में एक छोटा दीया जलता है। माँ कहती हैं — डर मत, मैं पास हूँ।", en: "A small lamp burns in the dark. The Mother says — do not fear, I am near." } },
            { id: "lap", title: { hi: "गोद में जगह", en: "Room in her lap" }, body: { hi: "माँ की गोद बहुत बड़ी है। जो भी थककर आता है, उसके लिए जगह है।", en: "The Mother’s lap is very wide. Whoever comes tired finds a place." } },
          ]
        : [];

  const sankat = {
    title: { hi: "सङ्कट में पाठ", en: "Paths in distress" },
    intro: {
      hi: "शांत बैठकर एक छोटा पाठ — फिर जप। परम्पराएँ घर-घर भिन्न हैं।",
      en: "Sit quietly, read a short path, then japa. Household customs vary.",
    },
    links:
      deity === "shiva"
        ? [
            { href: h("/path/maha-mrityunjaya/"), label: { hi: "महामृत्युंजय", en: "Mahamrityunjaya" } },
            { href: h("/path/om-namah-shivaya/"), label: { hi: "ॐ नमः शिवाय", en: "Om Namah Shivaya" } },
            { href: h("/path/rudrashtakam/"), label: { hi: "रुद्राष्टकम्", en: "Rudrashtakam" } },
            { href: h("/japa/"), label: { hi: "जप माला", en: "Japa mala" } },
          ]
        : [
            { href: h("/path/kalika-ashtakam/"), label: { hi: "कालिकाष्टकम्", en: "Kalika Ashtakam" } },
            { href: h("/path/adya-stotram/"), label: { hi: "आद्या स्तोत्र", en: "Adya Stotram" } },
            { href: h("/japa/"), label: { hi: "ॐ क्रीं कालिकायै नमः", en: "Om Krim Kalikayai Namah" } },
            { href: h("/path/kali-aarti/"), label: { hi: "आरती", en: "Aarti" } },
          ],
  };

  const radioNote = {
    hi: `${d.brand.hi} पर Wave v1 पाठ-प्रथम है। जब सत्यापित पाठ-सहायक श्रवण जुड़ेगा, वह यहीं सूचीबद्ध होगा — कोई बाहरी स्ट्रीम नहीं।`,
    en: `${d.brand.en} Wave v1 is text-first. When verified path-assist audio is added, it will list here — no external streams.`,
  };

  const parayanSlugs =
    deity === "shiva"
      ? ["lingashtakam", "rudrashtakam", "om-namah-shivaya", "bilvashtakam", "jyotirlinga-stotra"]
      : deity === "kali"
        ? ["kalika-ashtakam", "adya-stotram", "mahakali-stotra"]
        : ["hanuman-chalisa", "sundar-kand"];

  return { calendar, temples, glossary, katha, kids, sankat, radioNote, parayanSlugs, h, d };
}
