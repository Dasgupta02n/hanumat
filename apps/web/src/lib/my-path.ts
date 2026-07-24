/**
 * My Path facade — IndexedDB primary.
 * Sync wrappers read an in-memory cache hydrated from IDB on app boot.
 * localStorage is migrate-only (one-time → IDB), not the source of truth.
 */
import type {
  Bookmark,
  JapaState,
  MyPathExport,
  ResumePoint,
} from "./my-path-types";
import * as idb from "./db";

export type { Bookmark, JapaState, MyPathExport, ResumePoint };

const RESUME_KEY = "hanumat:resume:v1";
const BOOKMARKS_KEY = "hanumat:bookmarks:v1";
const JAPA_KEY = "hanumat:japa:v1";
const OFFLINE_PACKS_KEY = "hanumat:offline-packs:v1";
const LEGACY_JAPA_KEY = "hanumat-japa";

type PathCache = {
  resume: ResumePoint[];
  bookmarks: Bookmark[];
  japa: JapaState;
  offlinePacks: string[];
  hydrated: boolean;
};

const cache: PathCache = {
  resume: [],
  bookmarks: [],
  japa: { count: 0, target: 108 },
  offlinePacks: [],
  hydrated: false,
};

let hydratePromise: Promise<void> | null = null;

function lsLoadResume(): ResumePoint[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(RESUME_KEY) || "[]");
  } catch {
    return [];
  }
}

function lsLoadBookmarks(): Bookmark[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || "[]");
  } catch {
    return [];
  }
}

function lsLoadJapa(): JapaState {
  if (typeof window === "undefined") return { count: 0, target: 108 };
  try {
    const raw = localStorage.getItem(JAPA_KEY);
    if (raw) return JSON.parse(raw) as JapaState;
    const legacy = localStorage.getItem(LEGACY_JAPA_KEY);
    if (legacy) return { count: Number(legacy) || 0, target: 108 };
  } catch {
    /* ignore */
  }
  return { count: 0, target: 108 };
}

function lsLoadOfflinePackIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(OFFLINE_PACKS_KEY) || "[]");
  } catch {
    return [];
  }
}

function clearLocalStorageKeys() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(RESUME_KEY);
  localStorage.removeItem(BOOKMARKS_KEY);
  localStorage.removeItem(JAPA_KEY);
  localStorage.removeItem(OFFLINE_PACKS_KEY);
  localStorage.removeItem(LEGACY_JAPA_KEY);
}

/** One-time migrate localStorage → IDB (empty stores only). */
export async function migrateLocalToIdb() {
  try {
    if (await idb.idbIsMigrated()) return;

    const lsResume = lsLoadResume();
    const lsBookmarks = lsLoadBookmarks();
    const lsJapa = lsLoadJapa();
    const lsPacks = lsLoadOfflinePackIds();

    const [idbResume, idbBookmarks, idbJapa, idbPacks] = await Promise.all([
      idb.idbLoadResume(),
      idb.idbLoadBookmarks(),
      idb.idbLoadJapa(),
      idb.idbLoadOfflinePacks(),
    ]);

    const payload: Parameters<typeof idb.idbImportAll>[0] = {};
    if (!idbResume.length && lsResume.length) payload.resume = lsResume;
    if (!idbBookmarks.length && lsBookmarks.length) {
      payload.bookmarks = lsBookmarks;
    }
    if (
      !idbJapa.updatedAt &&
      (lsJapa.count || lsJapa.target !== 108 || lsJapa.sessions)
    ) {
      payload.japa = lsJapa;
    }
    if (!idbPacks.length && lsPacks.length) payload.offlinePacks = lsPacks;

    if (Object.keys(payload).length) await idb.idbImportAll(payload);
    await idb.idbSetMigrated();
    clearLocalStorageKeys();
  } catch {
    /* ignore */
  }
}

/**
 * Boot hydrate: migrate LS → IDB once, then load IDB into memory cache
 * for thin sync wrappers (PathStudio, OfflinePackButton, japa).
 */
export async function hydrateMyPath(): Promise<void> {
  if (typeof window === "undefined") return;
  if (cache.hydrated) return;
  if (hydratePromise) return hydratePromise;

  hydratePromise = (async () => {
    try {
      await migrateLocalToIdb();
      const [resume, bookmarks, japa, offlinePacks] = await Promise.all([
        idb.idbLoadResume(),
        idb.idbLoadBookmarks(),
        idb.idbLoadJapa(),
        idb.idbLoadOfflinePacks(),
      ]);
      cache.resume = resume;
      cache.bookmarks = bookmarks;
      cache.japa = japa;
      cache.offlinePacks = offlinePacks;
      cache.hydrated = true;
    } catch {
      // IDB unavailable — seed cache from any leftover LS for this session
      cache.resume = lsLoadResume();
      cache.bookmarks = lsLoadBookmarks();
      cache.japa = lsLoadJapa();
      cache.offlinePacks = lsLoadOfflinePackIds();
      cache.hydrated = true;
    }
  })();

  return hydratePromise;
}

/** Prefer memory cache after hydrate; empty until boot hydrate runs. */
export function loadResume(): ResumePoint[] {
  return cache.resume;
}

/** Async IDB-first read. */
export async function loadResumeAsync(): Promise<ResumePoint[]> {
  try {
    await hydrateMyPath();
    const rows = await idb.idbLoadResume();
    cache.resume = rows;
    return rows;
  } catch {
    return cache.resume.length ? cache.resume : lsLoadResume();
  }
}

export async function loadBookmarksAsync(): Promise<Bookmark[]> {
  try {
    await hydrateMyPath();
    const rows = await idb.idbLoadBookmarks();
    cache.bookmarks = rows;
    return rows;
  } catch {
    return cache.bookmarks.length ? cache.bookmarks : lsLoadBookmarks();
  }
}

export function saveResume(point: ResumePoint) {
  const all = cache.resume.filter((r) => r.textId !== point.textId);
  all.unshift(point);
  cache.resume = all.slice(0, 20);
  void idb.idbSaveResume(point).catch(() => undefined);
}

export function loadBookmarks(): Bookmark[] {
  return cache.bookmarks;
}

export function toggleBookmark(b: Omit<Bookmark, "updatedAt">) {
  const all = [...cache.bookmarks];
  const idx = all.findIndex(
    (x) => x.textId === b.textId && x.verseId === b.verseId,
  );
  if (idx >= 0) all.splice(idx, 1);
  else all.unshift({ ...b, updatedAt: new Date().toISOString() });
  cache.bookmarks = all.slice(0, 100);
  void idb
    .idbToggleBookmark(b)
    .then((rows) => {
      cache.bookmarks = rows.slice(0, 100);
    })
    .catch(() => undefined);
  return cache.bookmarks;
}

export function loadJapa(): JapaState {
  return cache.japa;
}

export async function loadJapaAsync(): Promise<JapaState> {
  try {
    await hydrateMyPath();
    const j = await idb.idbLoadJapa();
    cache.japa = j;
    return j;
  } catch {
    return cache.japa;
  }
}

export function saveJapa(state: JapaState) {
  const next = { ...state, updatedAt: new Date().toISOString() };
  cache.japa = next;
  void idb.idbSaveJapa(next).catch(() => undefined);
}

export function loadOfflinePackIds(): string[] {
  return cache.offlinePacks;
}

export async function loadOfflinePackIdsAsync(): Promise<string[]> {
  try {
    await hydrateMyPath();
    const packs = await idb.idbLoadOfflinePacks();
    cache.offlinePacks = packs;
    return packs;
  } catch {
    return cache.offlinePacks;
  }
}

export function markOfflinePack(id: string) {
  const all = new Set(cache.offlinePacks);
  all.add(id);
  cache.offlinePacks = [...all];
  void idb.idbMarkOfflinePack(id).catch(() => undefined);
}

/** Sync export from memory cache (prefer exportMyPathAsync). */
export function exportMyPath(): MyPathExport {
  return {
    version: 2,
    exportedAt: new Date().toISOString(),
    resume: loadResume(),
    bookmarks: loadBookmarks(),
    japa: loadJapa(),
    offlinePacks: loadOfflinePackIds(),
  };
}

export async function exportMyPathAsync(): Promise<MyPathExport> {
  try {
    await hydrateMyPath();
    const data = (await idb.idbExportAll()) as MyPathExport;
    cache.resume = data.resume;
    cache.bookmarks = data.bookmarks;
    cache.japa = data.japa;
    cache.offlinePacks = data.offlinePacks;
    return data;
  } catch {
    return exportMyPath();
  }
}

export function importMyPath(data: MyPathExport | unknown): boolean {
  try {
    const d = data as MyPathExport;
    if (!d || typeof d !== "object") return false;
    if (Array.isArray(d.resume)) cache.resume = d.resume.slice(0, 20);
    if (Array.isArray(d.bookmarks)) {
      cache.bookmarks = d.bookmarks.slice(0, 100);
    }
    if (d.japa && typeof d.japa === "object") {
      cache.japa = { ...(d.japa as JapaState) };
    }
    if (Array.isArray(d.offlinePacks)) cache.offlinePacks = d.offlinePacks;
    void idb.idbImportAll(d).catch(() => undefined);
    return true;
  } catch {
    return false;
  }
}

export async function importMyPathAsync(
  data: MyPathExport | unknown,
): Promise<boolean> {
  try {
    const d = data as MyPathExport;
    if (!d || typeof d !== "object") return false;
    await hydrateMyPath();
    await idb.idbImportAll(d);
    cache.resume = Array.isArray(d.resume) ? d.resume.slice(0, 20) : cache.resume;
    cache.bookmarks = Array.isArray(d.bookmarks)
      ? d.bookmarks.slice(0, 100)
      : cache.bookmarks;
    if (d.japa && typeof d.japa === "object") {
      cache.japa = d.japa as JapaState;
    }
    if (Array.isArray(d.offlinePacks)) cache.offlinePacks = d.offlinePacks;
    return true;
  } catch {
    return importMyPath(data);
  }
}

export function clearMyPath() {
  cache.resume = [];
  cache.bookmarks = [];
  cache.japa = { count: 0, target: 108 };
  cache.offlinePacks = [];
  clearLocalStorageKeys();
  void idb.idbClearAll().catch(() => undefined);
}

export async function clearMyPathAsync(): Promise<void> {
  cache.resume = [];
  cache.bookmarks = [];
  cache.japa = { count: 0, target: 108 };
  cache.offlinePacks = [];
  clearLocalStorageKeys();
  try {
    await idb.idbClearAll();
  } catch {
    /* ignore */
  }
}
