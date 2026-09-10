import Link from "next/link";
import type { ReactNode } from "react";

export function CourtyardShell({
  children,
  title = "Hanumat",
}: {
  children: ReactNode;
  title?: string;
}) {
  return (
    <div className="min-h-screen" style={{ color: "var(--foreground)" }}>
      <a href="#panchang" className="skip-link">
        Skip to panchang
      </a>
      <div aria-hidden className="h-[2px] w-full" style={{ background: "var(--temple-frame)" }} />
      <header
        className="sticky top-0 z-50 border-b backdrop-blur-xl"
        style={{
          background: "rgba(251, 247, 240, 0.9)",
          borderColor: "var(--hanumat-gold-line)",
        }}
      >
        <div className="shell flex items-center justify-between gap-4 py-3">
          <Link href="/" className="flex items-center gap-3">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-full text-lg"
              style={{
                border: "1.5px solid var(--hanumat-gold)",
                color: "var(--hanumat-gold-deep)",
                fontFamily: "var(--font-display)",
              }}
              aria-hidden
            >
              ॐ
            </span>
            <span className="flex flex-col">
              <span
                className="text-xl leading-none"
                style={{ fontFamily: "var(--font-display)", color: "var(--hanumat-shadow)", fontWeight: 600 }}
              >
                {title}
              </span>
              <span className="mt-0.5 text-[10px] uppercase tracking-[0.14em]" style={{ color: "var(--hanumat-stone)" }}>
                Courtyard · panchang
              </span>
            </span>
          </Link>
          <nav className="flex items-center gap-1 overflow-x-auto" aria-label="Mandirs">
            <Link href="/" className="nav-link">
              Courtyard
            </Link>
            <Link href="/en/" className="nav-link">
              Hanuman
            </Link>
            <Link href="/shiva/en/" className="nav-link">
              Shiva
            </Link>
            <Link href="/kali/en/" className="nav-link">
              Kali
            </Link>
            <Link href="/panchang/" className="nav-link" style={{ color: "var(--hanumat-shadow)" }}>
              Panchang
            </Link>
          </nav>
        </div>
      </header>
      <main className="shell section-pad">{children}</main>
      <footer
        className="mt-4 border-t"
        style={{
          borderColor: "var(--hanumat-gold-line)",
          background: "linear-gradient(180deg, rgba(251,247,240,0.4) 0%, rgba(239,232,219,0.85) 100%)",
        }}
      >
        <div className="shell py-10 text-center text-sm" style={{ color: "var(--hanumat-stone)" }}>
          <p style={{ fontFamily: "var(--font-display)", color: "var(--hanumat-shadow)", fontSize: "1.4rem", fontWeight: 600 }}>
            Hanumat
          </p>
          <p className="mt-3">Household panchang · no ads · no kundali · no paid muhurat.</p>
          <p className="mt-2">
            <Link href="/" className="hover:underline" style={{ color: "var(--hanumat-vermillion-deep)" }}>
              Three mandirs
            </Link>
            {" · "}
            <a href="mailto:hello@hanumat.life" className="hover:underline">
              hello@hanumat.life
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
