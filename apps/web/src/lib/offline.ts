/**
 * Offline pack contract — design §6.2 OfflinePackManifest + getOfflinePack.
 * Build-time embed of pack JSON; SW caches under pack:{id}:v{version}.
 */
import chalisaPack from "@/data/pack-chalisa-v1.json";
import { skOfflinePacks } from "@/data/sk-packs";

export type OfflinePackAsset = {
  path: string;
  role?: string;
  bytes?: number;
  sha256?: string;
  segmentId?: string;
  locale?: string;
  scheme?: string;
};

export type OfflinePackManifest = {
  id: string;
  textId: string;
  version: number;
  maxBytes: number;
  title?: { hi?: string; en?: string; [k: string]: string | undefined };
  locales?: string[];
  transliterationSchemes?: string[];
  segmentIds?: string[];
  cueMapIds?: string[];
  trackId?: string;
  sectionId?: string;
  assets: OfflinePackAsset[];
  createdAt?: string;
  notes?: string;
};

/** Cache Storage name per design Appendix F: pack:{id}:v{version} */
export function packCacheName(packId: string, version: number): string {
  return `pack:${packId}:v${version}`;
}

export function packCacheKeyPrefix(packId: string): string {
  return `pack:${packId}:v`;
}

/** Sum of known asset byte sizes (approx download size for CTA). */
export function sumPackBytes(
  pack: Pick<OfflinePackManifest, "assets"> | OfflinePackAsset[],
): number {
  const assets = Array.isArray(pack) ? pack : pack.assets;
  return assets.reduce(
    (n, a) => n + (typeof a.bytes === "number" ? a.bytes : 0),
    0,
  );
}

/** Human-readable approx size for download CTA. */
export function formatApproxSize(bytes: number): string {
  if (bytes <= 0) return "";
  if (bytes < 1024) return `~${bytes} B`;
  if (bytes < 1024 * 1024) return `~${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `~${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function asManifest(raw: unknown): OfflinePackManifest | null {
  if (!raw || typeof raw !== "object") return null;
  const p = raw as Record<string, unknown>;
  if (typeof p.id !== "string" || !Array.isArray(p.assets)) return null;
  return {
    id: p.id,
    textId: typeof p.textId === "string" ? p.textId : "",
    version: typeof p.version === "number" ? p.version : 1,
    maxBytes: typeof p.maxBytes === "number" ? p.maxBytes : 0,
    title: p.title as OfflinePackManifest["title"],
    locales: p.locales as string[] | undefined,
    transliterationSchemes: p.transliterationSchemes as string[] | undefined,
    segmentIds: p.segmentIds as string[] | undefined,
    cueMapIds: p.cueMapIds as string[] | undefined,
    trackId: p.trackId as string | undefined,
    sectionId: p.sectionId as string | undefined,
    assets: (p.assets as OfflinePackAsset[]).map((a) => ({
      path: a.path,
      role: a.role,
      bytes: a.bytes,
      sha256: a.sha256,
      segmentId: a.segmentId,
      locale: a.locale,
      scheme: a.scheme,
    })),
    createdAt: p.createdAt as string | undefined,
    notes: p.notes as string | undefined,
  };
}

const CHALISA = asManifest(chalisaPack);
const SK_PACKS = (skOfflinePacks as unknown[])
  .map(asManifest)
  .filter((p): p is OfflinePackManifest => p != null);

const DHAM_PACKS: OfflinePackManifest[] = [
  {
    id: "pack-shiva-v1",
    textId: "lingashtakam",
    version: 1,
    maxBytes: 2_000_000,
    title: { hi: "शिवायतन पाठ", en: "Shivayatan texts" },
    assets: [
      { path: "/shiva/en/path/lingashtakam/", role: "html" },
      { path: "/shiva/en/path/rudrashtakam/", role: "html" },
      { path: "/shiva/en/path/om-namah-shivaya/", role: "html" },
      { path: "/shiva/en/path/shiv-aarti/", role: "html" },
      { path: "/shiva/hi/path/lingashtakam/", role: "html" },
    ],
    notes: "Dham text pack. Recitation audio later uses the same sha256 verify as Chalisa.",
  },
  {
    id: "pack-kali-v1",
    textId: "kalika-ashtakam",
    version: 1,
    maxBytes: 2_000_000,
    title: { hi: "कालिका धाम पाठ", en: "Kalika Dham texts" },
    assets: [
      { path: "/kali/en/path/kalika-ashtakam/", role: "html" },
      { path: "/kali/en/path/adya-stotram/", role: "html" },
      { path: "/kali/en/path/kali-aarti/", role: "html" },
      { path: "/kali/hi/path/kalika-ashtakam/", role: "html" },
    ],
    notes: "Dham text pack. Recitation audio later uses the same sha256 verify as Chalisa.",
  },
];

export function listDhamPacks() {
  return DHAM_PACKS;
}

/** Resolve OfflinePackManifest by id (build-time embed). */
export function getOfflinePack(packId: string): OfflinePackManifest | null {
  if (!packId) return null;
  // Legacy alias used by older OfflinePackButton default
  if (packId === "chalisa-v1" && CHALISA) return CHALISA;
  if (CHALISA && CHALISA.id === packId) return CHALISA;
  const sk = SK_PACKS.find((p) => p.id === packId);
  if (sk) return sk;
  return DHAM_PACKS.find((p) => p.id === packId) ?? null;
}

/** True if any versioned (or legacy) cache exists for this pack id. */
export async function hasPackCache(packId: string): Promise<boolean> {
  if (typeof caches === "undefined") return false;
  const keys = await caches.keys();
  const prefix = packCacheKeyPrefix(packId);
  return keys.some(
    (k) => k.startsWith(prefix) || k === `hanumat-pack:${packId}`,
  );
}
