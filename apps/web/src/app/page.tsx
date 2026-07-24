import { defaultLocale } from "@/i18n/config";

/**
 * Instant client redirect to default locale.
 * Avoids hanging server redirect while locale page compiles on first hit.
 */
export default function RootPage() {
  const target = `/${defaultLocale}/`;
  return (
    <html lang={defaultLocale}>
      <head>
        <meta httpEquiv="refresh" content={`0;url=${target}`} />
        <link rel="canonical" href={target} />
        <title>Hanumat</title>
      </head>
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#f6f1e7",
          color: "#2a241e",
          fontFamily: "Georgia, serif",
        }}
      >
        <p>
          Opening mandir…{" "}
          <a href={target} style={{ color: "#7d2b21" }}>
            Continue to Hanumat
          </a>
        </p>
        <script
          dangerouslySetInnerHTML={{
            __html: `location.replace(${JSON.stringify(target)});`,
          }}
        />
      </body>
    </html>
  );
}
