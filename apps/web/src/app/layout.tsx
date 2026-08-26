import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Source_Serif_4, Mukta } from "next/font/google";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const body = Source_Serif_4({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const devanagari = Mukta({
  variable: "--font-deva",
  subsets: ["devanagari", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#f6f1e7",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://hanumat.life"),
  title: {
    default: "Hanumat · Three sacred mandirs",
    template: "%s · Hanumat",
  },
  description:
    "Digital mandirs of Hanuman, Shiva and Maa Kali — Chalisa, Sundar Kand, Lingashtakam, Adya Stotram, japa. Hindi & English. No ads.",
  applicationName: "Hanumat",
  authors: [{ name: "Hanumat", url: "https://hanumat.life" }],
  creator: "Hanumat",
  publisher: "Hanumat",
  category: "religion",
  keywords: [
    "Hanuman Chalisa",
    "Sundar Kand",
    "Hanuman",
    "digital mandir",
    "bhakti",
    "Ramcharitmanas",
    "Valmiki Ramayana",
    "japa",
    "Hindu temples",
    "India",
    "हनुमान चालीसा",
    "सुंदरकांड",
  ],
  manifest: "/manifest.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Hanumat · Shri Hanuman Digital Mandir",
    description:
      "Sundar Kand, Hanuman Chalisa & multi-language Hanuman bhakti — free digital temple.",
    url: "https://hanumat.life",
    siteName: "Hanumat",
    locale: "hi_IN",
    alternateLocale: ["en_IN"],
    type: "website",
    images: [
      {
        url: "/images/hanuman-108/006.jpg",
        width: 1200,
        height: 630,
        alt: "Hanumat — sacred Hanuman art",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hanumat · Shri Hanuman Digital Mandir",
    description: "Free digital mandir — Chalisa, Sundar Kand, japa, temples.",
    images: ["/images/hanuman-108/006.jpg"],
  },
  other: {
    "geo.region": "IN",
    "geo.placename": "India",
    "geo.position": "20.5937;78.9629",
    ICBM: "20.5937, 78.9629",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="hi" suppressHydrationWarning suppressContentEditableWarning>
      <head>
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; media-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self'"
        />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM context" />
      </head>
      <body
        className={`${display.variable} ${body.variable} ${devanagari.variable} antialiased`}
        style={{
          minHeight: "100vh",
          fontFamily:
            "var(--font-deva), var(--font-body), ui-serif, Georgia, serif",
        }}
      >
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
