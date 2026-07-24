/** Server-safe JSON-LD injector for SEO / GEO / AI crawlers */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function siteJsonLd(locale: string) {
  const base = "https://hanumat.life";
  const url = `${base}/${locale}/`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${base}/#website`,
        url: base,
        name: "Hanumat",
        alternateName: ["Hanumat Digital Mandir", "Shri Hanuman Digital Dham", "हनुमत"],
        description:
          "Digital mandir for devotees of Hanuman Ji — Sundar Kand, Hanuman Chalisa, stotras, japa, katha, temples, and multi-language path study.",
        inLanguage: ["hi", "en"],
        publisher: { "@id": `${base}/#org` },
        potentialAction: {
          "@type": "SearchAction",
          target: `${base}/${locale}/path/`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${base}/#org`,
        name: "Hanumat",
        url: base,
        logo: `${base}/images/hanuman-108/108.jpg`,
        email: "hello@hanumat.life",
        sameAs: [],
        areaServed: {
          "@type": "Country",
          name: "India",
        },
        knowsAbout: [
          "Hanuman Chalisa",
          "Sundar Kand",
          "Ramcharitmanas",
          "Valmiki Ramayana Sundarakanda",
          "Hindu bhakti",
          "Japa mala",
          "Hindu temples of Hanuman",
        ],
      },
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: "Hanumat — Digital Mandir of Hanuman Bhakti",
        isPartOf: { "@id": `${base}/#website` },
        about: { "@id": `${base}/#org` },
        inLanguage: locale,
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${base}/images/hanuman-108/006.jpg`,
        },
      },
      {
        "@type": "Place",
        "@id": `${base}/#place-india`,
        name: "India — sacred geography of Hanuman bhakti",
        address: {
          "@type": "PostalAddress",
          addressCountry: "IN",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 20.5937,
          longitude: 78.9629,
        },
        description:
          "Hanumat serves devotees across India and the global diaspora with multi-language access to Hanuman paths, temples, and katha.",
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "What is Hanumat?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Hanumat is a digital mandir (spiritual app/site) for devotees of Hanuman Ji, offering Sundar Kand, Hanuman Chalisa, stotras, japa, katha, temples, and multi-language meanings with optional path-assist audio.",
            },
          },
          {
            "@type": "Question",
            name: "Which languages does Hanumat support?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Hanumat supports Hindi and English for UI and path meanings.",
            },
          },
          {
            "@type": "Question",
            name: "Is Hanumat free and without ads?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Hanumat is free to use with no ads and no accounts required. Progress stays local on your device with optional export/import.",
            },
          },
        ],
      },
    ],
  };
}
