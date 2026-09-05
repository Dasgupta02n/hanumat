/**
 * My Path facade — IndexedDB primary.
 * Sync wrappers read an in-memory cache hydrated from IDB on app boot.
 * localStorage is migrate-only (one-time → IDB), not the source of truth.
 */
import type {
  Bookmark,
  JapaByDeity,
  JapaSession,
  JapaState,
  MyPathExport,
  ResumePoint,
} from "./my-path-types";
import * as idb from "./db";
import type { DeityId } from "./deities";

export type { Bookmark, JapaSession, JapaState, MyPathExport, ResumePoint };

const RESUME_KEY = "hanumat:resume:v1";
const BOOKMARKS_KEY = "hanumat:bookmarks:v1";
const JAPA_KEY = "hanumat:japa:v1";
const OFFLINE_PACKS_KEY = "hanumat:offline-packs:v1";
const LEGACY_JAPA_KEY = "hanumat-japa";

type PathCache = {
  resume: ResumePoint[];
  bookmarks: Bookmark[];
  japa: JapaState;
  japaByDeity: JapaByDeity;
  offlinePacks: string[];
  hydrated: boolean;
};

const EMPTY_JAPA: JapaState = { count: 0, target: 108 };

const cache: PathCache = {
  resume: [],
  bookmarks: [],
  japa: { ...EMPTY_JAPA },
  japaByDeity: {},
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
      const [resume, bookmarks, japaByDeity, offlinePacks] = await Promise.all([
        idb.idbLoadResume(),
        idb.idbLoadBookmarks(),
        idb.idbLoadAllJapa(),
        idb.idbLoadOfflinePacks(),
      ]);
      cache.resume = resume;
      cache.bookmarks = bookmarks;
      cache.japaByDeity = japaByDeity;
      cache.japa = japaByDeity.hanuman || { ...EMPTY_JAPA };
      cache.offlinePacks = offlinePacks;
      cache.hydrated = true;
    } catch {
      // IDB unavailable — seed cache from any leftover LS for this session
      cache.resume = lsLoadResume();
      cache.bookmarks = lsLoadBookmarks();
      cache.japa = lsLoadJapa();
      cache.japaByDeity = { hanuman: cache.japa };
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

export function loadJapa(deity: DeityId = "hanuman"): JapaState {
  return cache.japaByDeity[deity] || cache.japa || { ...EMPTY_JAPA };
}

export async function loadJapaAsync(deity: DeityId = "hanuman"): Promise<JapaState> {
  try {
    await hydrateMyPath();
    const j = await idb.idbLoadJapa(deity);
    cache.japaByDeity[deity] = j;
    if (deity === "hanuman") cache.japa = j;
    return j;
  } catch {
    return loadJapa(deity);
  }
}

export function saveJapa(state: JapaState, deity: DeityId = "hanuman") {
  const next = { ...state, updatedAt: new Date().toISOString() };
  cache.japaByDeity[deity] = next;
  if (deity === "hanuman") cache.japa = next;
  void idb.idbSaveJapa(next, deity).catch(() => undefined);
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
    version: 3,
    exportedAt: new Date().toISOString(),
    resume: loadResume(),
    bookmarks: loadBookmarks(),
    japa: loadJapa("hanuman"),
    japaByDeity: cache.japaByDeity,
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
    cache.japaByDeity = data.japaByDeity || { hanuman: data.japa };
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
    if (d.japaByDeity && typeof d.japaByDeity === "object") {
      cache.japaByDeity = d.japaByDeity;
      cache.japa = d.japaByDeity.hanuman || cache.japa;
    } else if (d.japa && typeof d.japa === "object") {
      cache.japa = { ...(d.japa as JapaState) };
      cache.japaByDeity = { ...cache.japaByDeity, hanuman: cache.japa };
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
    if (d.japaByDeity && typeof d.japaByDeity === "object") {
      cache.japaByDeity = d.japaByDeity;
      cache.japa = d.japaByDeity.hanuman || cache.japa;
    } else if (d.japa && typeof d.japa === "object") {
      cache.japa = d.japa as JapaState;
      cache.japaByDeity = { ...cache.japaByDeity, hanuman: cache.japa };
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
  cache.japa = { ...EMPTY_JAPA };
  cache.japaByDeity = {};
  cache.offlinePacks = [];
  clearLocalStorageKeys();
  void idb.idbClearAll().catch(() => undefined);
}

export async function clearMyPathAsync(): Promise<void> {
  cache.resume = [];
  cache.bookmarks = [];
  cache.japa = { ...EMPTY_JAPA };
  cache.japaByDeity = {};
  cache.offlinePacks = [];
  clearLocalStorageKeys();
  try {
    await idb.idbClearAll();
  } catch {
    /* ignore */
  }
}
