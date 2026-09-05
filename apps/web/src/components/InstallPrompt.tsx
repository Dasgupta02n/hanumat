"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { defaultLocale, type Locale } from "@/i18n/config";

type BeforeInstall = Event & { prompt: () => Promise<void> };

export function InstallPrompt({ locale = defaultLocale }: { locale?: Locale }) {
  const pathname = usePathname() || "";
  const en = locale === "en";
  const [deferred, setDeferred] = useState<BeforeInstall | null>(null);
  const [ios, setIos] = useState(false);
  const [open, setOpen] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in navigator && Boolean((navigator as { standalone?: boolean }).standalone));
    if (standalone) {
      setInstalled(true);
      return;
    }
    const dismissed = localStorage.getItem("hanumat:install-dismiss") === "1";
    const onChalisa = pathname.includes("hanuman-chalisa") || pathname.includes("lingashtakam") || pathname.includes("kalika-ashtakam");
    const ua = navigator.userAgent;
    const isIos = /iPhone|iPad|iPod/i.test(ua) && !standalone;
    setIos(isIos);

    const onBip = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstall);
      if (onChalisa && !dismissed) setOpen(true);
    };
    window.addEventListener("beforeinstallprompt", onBip);
    if (onChalisa && !dismissed) setOpen(true);
    return () => window.removeEventListener("beforeinstallprompt", onBip);
  }, [pathname]);

  if (installed || !open) return null;

  function dismiss() {
    setOpen(false);
    try {
      localStorage.setItem("hanumat:install-dismiss", "1");
    } catch {
      /* ignore */
    }
  }

  return (
    <aside
      className="fixed bottom-4 left-1/2 z-[60] w-[min(92vw,28rem)] -translate-x-1/2 rounded-2xl border p-4 shadow-lg"
      style={{
        background: "var(--hanumat-cream)",
        borderColor: "var(--hanumat-gold-line)",
        color: "var(--hanumat-shadow)",
      }}
      role="dialog"
      aria-label={en ? "Keep this mandir on your phone" : "मन्दिर फ़ोन पर रखें"}
    >
      <p className="font-serif text-lg">
        {en ? "Keep this mandir on your phone" : "यह मन्दिर फ़ोन पर रखें"}
      </p>
      <p className="mt-1 text-xs" style={{ color: "var(--hanumat-stone)" }}>
        {en
          ? "Add to Home Screen. Works offline after the Chalisa pack. No app store, no account."
          : "होम स्क्रीन पर जोड़ें। चालीसा पैक के बाद ऑफ़लाइन। ऐप स्टोर नहीं, खाता नहीं।"}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {deferred && (
          <button
            type="button"
            className="btn-primary !px-3 !py-1.5 text-xs"
            onClick={() => {
              void deferred.prompt();
              dismiss();
            }}
          >
            {en ? "Install" : "स्थापित करें"}
          </button>
        )}
        {ios && (
          <p className="text-xs" style={{ color: "var(--hanumat-stone)" }}>
            {en
              ? "iPhone: Share → Add to Home Screen."
              : "iPhone: शेयर → होम स्क्रीन पर जोड़ें।"}
          </p>
        )}
        <button type="button" className="btn-ghost !px-3 !py-1.5 text-xs" onClick={dismiss}>
          {en ? "Not now" : "अभी नहीं"}
        </button>
      </div>
    </aside>
  );
}
