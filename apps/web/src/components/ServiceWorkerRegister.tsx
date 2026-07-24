"use client";

import { useEffect } from "react";
import { hydrateMyPath } from "@/lib/my-path";

/**
 * Hydrate My Path memory cache from IndexedDB on app boot so thin sync
 * wrappers (PathStudio, OfflinePackButton, japa) see IDB data immediately.
 */
export function useMyPathHydrate() {
  useEffect(() => {
    void hydrateMyPath();
  }, []);
}

/**
 * Registers PWA service worker (Workbox-compatible custom SW with pack integrity).
 * Design calls for Serwist/Workbox; static export uses public/sw.js + workbox-window when available.
 */
export function ServiceWorkerRegister() {
  useMyPathHydrate();

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    const run = async () => {
      try {
        // Prefer workbox-window if bundled
        try {
          const { Workbox } = await import("workbox-window");
          const wb = new Workbox("/sw.js");
          wb.addEventListener("waiting", () => {
            wb.messageSkipWaiting();
          });
          await wb.register();
          return;
        } catch {
          /* fall through */
        }
        await navigator.serviceWorker.register("/sw.js");
      } catch {
        /* ignore offline register errors */
      }
    };
    void run();
  }, []);
  return null;
}
