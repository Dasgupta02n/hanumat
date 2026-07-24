import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type { Bookmark, JapaState, ResumePoint } from "./my-path-types";

interface HanumatDB extends DBSchema {
  resume: {
    key: string;
    value: ResumePoint;
  };
  bookmarks: {
    key: string;
    value: Bookmark;
  };
  meta: {
    key: string;
    value: unknown;
  };
}

const DB_NAME = "hanumat-v1";
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<HanumatDB>> | null = null;

export function getDb() {
  if (typeof window === "undefined") {
    throw new Error("IndexedDB only in browser");
  }
  if (!dbPromise) {
    dbPromise = openDB<HanumatDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("resume")) {
          db.createObjectStore("resume", { keyPath: "textId" });
        }
        if (!db.objectStoreNames.contains("bookmarks")) {
          db.createObjectStore("bookmarks", { keyPath: "key" });
        }
        if (!db.objectStoreNames.contains("meta")) {
          db.createObjectStore("meta");
        }
      },
    });
  }
  return dbPromise;
}

export async function idbLoadResume(): Promise<ResumePoint[]> {
  const db = await getDb();
  const all = await db.getAll("resume");
  return all.sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}

export async function idbSaveResume(point: ResumePoint) {
  const db = await getDb();
  await db.put("resume", point);
}

export async function idbLoadBookmarks(): Promise<Bookmark[]> {
  const db = await getDb();
  return db.getAll("bookmarks");
}

export async function idbToggleBookmark(
  b: Omit<Bookmark, "updatedAt" | "key"> & { key?: string },
): Promise<Bookmark[]> {
  const db = await getDb();
  const key = `${b.textId}::${b.verseId}`;
  const existing = await db.get("bookmarks", key);
  if (existing) {
    await db.delete("bookmarks", key);
  } else {
    await db.put("bookmarks", {
      ...b,
      key,
      updatedAt: new Date().toISOString(),
    });
  }
  return db.getAll("bookmarks");
}

export async function idbLoadJapa(): Promise<JapaState> {
  const db = await getDb();
  const v = (await db.get("meta", "japa")) as JapaState | undefined;
  return v || { count: 0, target: 108 };
}

export async function idbSaveJapa(state: JapaState) {
  const db = await getDb();
  await db.put("meta", { ...state, updatedAt: new Date().toISOString() }, "japa");
}

export async function idbLoadOfflinePacks(): Promise<string[]> {
  const db = await getDb();
  const v = (await db.get("meta", "offlinePacks")) as string[] | undefined;
  return v || [];
}

export async function idbMarkOfflinePack(id: string) {
  const db = await getDb();
  const cur = new Set(await idbLoadOfflinePacks());
  cur.add(id);
  await db.put("meta", [...cur], "offlinePacks");
}

export async function idbExportAll() {
  return {
    version: 2,
    exportedAt: new Date().toISOString(),
    resume: await idbLoadResume(),
    bookmarks: await idbLoadBookmarks(),
    japa: await idbLoadJapa(),
    offlinePacks: await idbLoadOfflinePacks(),
  };
}

export async function idbImportAll(data: {
  resume?: ResumePoint[];
  bookmarks?: Bookmark[];
  japa?: JapaState;
  offlinePacks?: string[];
}) {
  const db = await getDb();
  if (Array.isArray(data.resume)) {
    const tx = db.transaction("resume", "readwrite");
    await tx.store.clear();
    for (const r of data.resume.slice(0, 20)) await tx.store.put(r);
    await tx.done;
  }
  if (Array.isArray(data.bookmarks)) {
    const tx = db.transaction("bookmarks", "readwrite");
    await tx.store.clear();
    for (const b of data.bookmarks.slice(0, 100)) {
      const key = b.key || `${b.textId}::${b.verseId}`;
      await tx.store.put({ ...b, key });
    }
    await tx.done;
  }
  if (data.japa) await idbSaveJapa(data.japa);
  if (Array.isArray(data.offlinePacks)) {
    await db.put("meta", data.offlinePacks, "offlinePacks");
  }
}

const MIGRATE_META_KEY = "lsMigratedV1";

export async function idbIsMigrated(): Promise<boolean> {
  const db = await getDb();
  return Boolean(await db.get("meta", MIGRATE_META_KEY));
}

export async function idbSetMigrated(): Promise<void> {
  const db = await getDb();
  await db.put("meta", true, MIGRATE_META_KEY);
}

export async function idbClearAll() {
  const db = await getDb();
  await db.clear("resume");
  await db.clear("bookmarks");
  await db.clear("meta");
  // Keep migrate flag so empty localStorage is not re-scanned next boot
  await db.put("meta", true, MIGRATE_META_KEY);
}
