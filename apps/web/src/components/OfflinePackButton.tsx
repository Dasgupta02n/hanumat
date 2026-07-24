"use client";

import { useEffect, useMemo, useState } from "react";
import { markOfflinePack, loadOfflinePackIds } from "@/lib/my-path";
import {
  formatApproxSize,
  getOfflinePack,
  hasPackCache,
  packCacheName,
  sumPackBytes,
  type OfflinePackAsset,
} from "@/lib/offline";

type Asset = OfflinePackAsset;

type Props = {
  label: string;
  readyLabel: string;
  packId?: string;
  assets?: Asset[];
  /** @deprecated prefer assets / getOfflinePack */
  urls?: string[];
  messageType?: "CACHE_CHALISA_PACK" | "CACHE_SK_PACK" | "CACHE_PACK";
};

export function OfflinePackButton({
  label,
  readyLabel,
  packId = "pack-chalisa-v1",
  assets,
  urls,
  messageType = "CACHE_PACK",
}: Props) {
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const pack = useMemo(() => getOfflinePack(packId), [packId]);

  // Prefer manifest from getOfflinePack (sha256 + bytes); fall back to props
  const resolvedAssets: Asset[] = useMemo(() => {
    if (pack?.assets?.length) {
      return pack.assets.map((a) => ({
        path: a.path,
        role: a.role,
        bytes: a.bytes,
        sha256: a.sha256,
        locale: a.locale,
        scheme: a.scheme,
        segmentId: a.segmentId,
      }));
    }
    if (assets?.length) return assets;
    if (urls?.length) return urls.map((path) => ({ path }));
    return [];
  }, [pack, assets, urls]);

  const version = pack?.version ?? 1;
  const approxBytes = useMemo(
    () => (pack ? sumPackBytes(pack) : sumPackBytes(resolvedAssets)),
    [pack, resolvedAssets],
  );
  const sizeLabel = formatApproxSize(approxBytes);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      setReady(loadOfflinePackIds().includes(packId));
      return;
    }
    const onMsg = (e: MessageEvent) => {
      if (
        (e.data?.type === "PACK_READY" ||
          e.data?.type === "CHALISA_PACK_READY" ||
          e.data?.type === "SK_PACK_READY") &&
        (!e.data.packId ||
          e.data.packId === packId ||
          packId === "chalisa-v1" ||
          packId === "pack-chalisa-v1")
      ) {
        setReady(true);
        markOfflinePack(packId);
      }
      if (e.data?.type === "PACK_PURGED" && e.data.packId === packId) {
        setReady(false);
      }
      if (e.data?.type === "PACK_ERROR" && e.data.packId === packId) {
        setError(e.data.error || "pack error");
      }
    };
    navigator.serviceWorker.addEventListener("message", onMsg);

    void (async () => {
      if (await hasPackCache(packId)) {
        setReady(true);
        return;
      }
      // legacy flat cache name
      if (await caches.has("hanumat-pack:" + packId)) {
        setReady(true);
        return;
      }
      if (loadOfflinePackIds().includes(packId)) setReady(true);
    })();

    return () => navigator.serviceWorker.removeEventListener("message", onMsg);
  }, [packId]);

  async function download() {
    setBusy(true);
    setError("");
    try {
      if (!resolvedAssets.length) {
        throw new Error("no pack assets for " + packId);
      }

      if ("serviceWorker" in navigator) {
        const reg = await navigator.serviceWorker.ready;
        reg.active?.postMessage({
          type: messageType === "CACHE_PACK" ? "CACHE_PACK" : messageType,
          packId,
          version,
          assets: resolvedAssets.map((a) => ({
            path: a.path,
            sha256: a.sha256,
            bytes: a.bytes,
            role: a.role,
          })),
          urls: resolvedAssets.map((a) => a.path),
        });
      }

      // Direct cache + client-side hash check (design: verify sha256 before put)
      const cache = await caches.open(packCacheName(packId, version));
      for (const asset of resolvedAssets) {
        const res = await fetch(asset.path, { cache: "no-store" });
        if (!res.ok) throw new Error("fetch " + asset.path);
        const buf = await res.arrayBuffer();
        if (asset.sha256 && crypto.subtle) {
          const hash = await crypto.subtle.digest("SHA-256", buf);
          const hex = [...new Uint8Array(hash)]
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
          if (hex !== asset.sha256) {
            throw new Error("sha256 mismatch " + asset.path);
          }
        }
        await cache.put(asset.path, new Response(buf, { headers: res.headers }));
      }

      // Drop prior pack:{id}:v* after successful put of new version
      if (typeof caches !== "undefined") {
        const prefix = `pack:${packId}:v`;
        const keep = packCacheName(packId, version);
        const keys = await caches.keys();
        await Promise.all(
          keys
            .filter(
              (k) =>
                (k.startsWith(prefix) && k !== keep) ||
                k === "hanumat-pack:" + packId,
            )
            .map((k) => caches.delete(k)),
        );
      }

      markOfflinePack(packId);
      setReady(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "download failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={download}
        disabled={busy || ready}
        className="mt-3 rounded-full bg-[#f48c06] px-4 py-2 text-sm font-semibold text-[#1a0f2e] disabled:opacity-60"
      >
        {ready
          ? readyLabel
          : busy
            ? "…"
            : sizeLabel
              ? `${label} (${sizeLabel})`
              : label}
      </button>
      {error && <p className="mt-1 text-[11px] text-[#ff6b6b]">{error}</p>}
    </div>
  );
}
