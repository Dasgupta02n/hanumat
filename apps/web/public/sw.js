/* Hanumat SW — pack caches with sha256 verify (Workbox-class integrity)
 * Pack cache keys: pack:{id}:v{version} (design Appendix F)
 */
const SHELL = "hanumat-shell-v6";
const PACK_PREFIX = "pack:";
const LEGACY_PACK_PREFIX = "hanumat-pack:";

const SHELL_URLS = ["/", "/en/", "/hi/", "/manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL)
      .then((c) => c.addAll(SHELL_URLS).catch(() => undefined))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter(
              (k) =>
                k !== SHELL &&
                !k.startsWith(PACK_PREFIX) &&
                !k.startsWith(LEGACY_PACK_PREFIX),
            )
            .map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

function packCacheName(packId, version) {
  return `pack:${packId}:v${version}`;
}

function packKeyPrefix(packId) {
  return `pack:${packId}:v`;
}

async function sha256Hex(buffer) {
  const hash = await crypto.subtle.digest("SHA-256", buffer);
  return [...new Uint8Array(hash)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Delete prior pack:{id}:v* caches (and legacy hanumat-pack:id), keeping current version. */
async function deletePriorPackCaches(packId, keepVersion) {
  const prefix = packKeyPrefix(packId);
  const keep =
    keepVersion != null && keepVersion !== undefined
      ? packCacheName(packId, keepVersion)
      : null;
  const legacy = LEGACY_PACK_PREFIX + packId;
  const keys = await caches.keys();
  await Promise.all(
    keys
      .filter((k) => {
        if (k === keep) return false;
        if (k.startsWith(prefix)) return true;
        if (k === legacy) return true;
        return false;
      })
      .map((k) => caches.delete(k)),
  );
}

/** Purge all versions of a pack. */
async function purgePack(packId) {
  const prefix = packKeyPrefix(packId);
  const legacy = LEGACY_PACK_PREFIX + packId;
  const keys = await caches.keys();
  await Promise.all(
    keys
      .filter((k) => k.startsWith(prefix) || k === legacy)
      .map((k) => caches.delete(k)),
  );
}

async function cachePack(packId, assets, version) {
  const cacheName =
    version != null && version !== undefined
      ? packCacheName(packId, version)
      : LEGACY_PACK_PREFIX + packId;
  const cache = await caches.open(cacheName);
  for (const asset of assets) {
    const res = await fetch(asset.path, { cache: "no-store" });
    if (!res.ok) throw new Error("fetch failed " + asset.path);
    const buf = await res.arrayBuffer();
    if (asset.sha256) {
      const hex = await sha256Hex(buf);
      if (hex !== asset.sha256) {
        throw new Error("sha256 mismatch " + asset.path);
      }
    }
    await cache.put(asset.path, new Response(buf, { headers: res.headers }));
  }
  // On success with version: drop prior pack:{id}:v* (version bump / re-download)
  if (version != null && version !== undefined) {
    await deletePriorPackCaches(packId, version);
  }
}

function broadcast(msg) {
  return self.clients.matchAll().then((clients) => {
    clients.forEach((c) => c.postMessage(msg));
  });
}

self.addEventListener("message", (event) => {
  const data = event.data || {};

  if (data.type === "CACHE_PACK" && data.packId && Array.isArray(data.assets)) {
    event.waitUntil(
      cachePack(data.packId, data.assets, data.version)
        .then(() =>
          broadcast({
            type: "PACK_READY",
            packId: data.packId,
            version: data.version,
          }),
        )
        .catch((err) =>
          broadcast({
            type: "PACK_ERROR",
            packId: data.packId,
            error: String(err),
          }),
        ),
    );
  }

  if (data.type === "PURGE_PACK" && data.packId) {
    event.waitUntil(
      purgePack(data.packId)
        .then(() =>
          broadcast({ type: "PACK_PURGED", packId: data.packId }),
        )
        .catch((err) =>
          broadcast({
            type: "PACK_ERROR",
            packId: data.packId,
            error: String(err),
          }),
        ),
    );
  }

  // Back-compat
  if (data.type === "CACHE_CHALISA_PACK") {
    event.waitUntil(
      cachePack(
        "pack-chalisa-v1",
        Array.isArray(data.assets)
          ? data.assets
          : [
              { path: "/audio/chalisa/hanuman_chalisa.m4a" },
              { path: "/audio/chalisa/hanuman_chalisa_cues.json" },
            ],
        data.version ?? 2,
      ).then(async () => {
        const clients = await self.clients.matchAll();
        clients.forEach((c) =>
          c.postMessage({
            type: "CHALISA_PACK_READY",
            packId: "pack-chalisa-v1",
          }),
        );
      }),
    );
  }
  if (data.type === "CACHE_SK_PACK" && data.packId && Array.isArray(data.urls)) {
    event.waitUntil(
      cachePack(
        data.packId,
        data.urls.map((path) => ({ path })),
        data.version,
      ).then(async () => {
        const clients = await self.clients.matchAll();
        clients.forEach((c) =>
          c.postMessage({ type: "SK_PACK_READY", packId: data.packId }),
        );
      }),
    );
  }
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(SHELL).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((hit) => hit || caches.match("/") || caches.match("/en/") || caches.match("/hi/"))),
    );
    return;
  }
  event.respondWith(
    caches.match(req).then((hit) => {
      if (hit) return hit;
      return fetch(req);
    }),
  );
});
