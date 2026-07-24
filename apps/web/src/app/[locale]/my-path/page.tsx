"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { SiteShell } from "@/components/SiteShell";
import { OfflinePackButton } from "@/components/OfflinePackButton";
import { skOfflinePacks } from "@/data/sk-packs";
import chalisaOfflinePack from "@/data/pack-chalisa-v1.json";
import {
  clearMyPathAsync,
  exportMyPathAsync,
  importMyPathAsync,
  loadBookmarksAsync,
  loadResumeAsync,
  type Bookmark,
  type ResumePoint,
} from "@/lib/my-path";

export default function MyPathPage() {
  const t = useTranslations("myPath");
  const locale = useLocale();
  const [resume, setResume] = useState<ResumePoint[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [importMsg, setImportMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [showSk, setShowSk] = useState(false);

  async function refresh() {
    setResume(await loadResumeAsync());
    setBookmarks(await loadBookmarksAsync());
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function doExport() {
    const data = await exportMyPathAsync();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hanumat-my-path-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function doImport(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      void (async () => {
        try {
          const data = JSON.parse(String(reader.result));
          const ok = await importMyPathAsync(data);
          setImportMsg(ok ? t("importOk") : t("importFail"));
          if (ok) await refresh();
        } catch {
          setImportMsg(t("importFail"));
        }
      })();
    };
    reader.readAsText(file);
  }

  const packs = skOfflinePacks as {
    id: string;
    sectionId: string;
    assets: { path: string }[];
  }[];

  return (
    <SiteShell>
      <h1 className="font-serif text-4xl text-[#fff8e7]">{t("title")}</h1>
      <p className="mt-2 text-sm text-[#a994c4]">{t("intro")}</p>

      <section className="mt-8">
        <h2 className="font-serif text-xl text-[#ffd60a]">{t("continue")}</h2>
        {resume.length === 0 ? (
          <p className="mt-2 text-sm text-[#6b5a80]">{t("empty")}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {resume.map((r) => (
              <li key={r.textId + r.updatedAt}>
                <Link
                  href={`/${locale}/path/${r.slug}/`}
                  className="block rounded-xl border border-white/12 bg-white/5 px-4 py-3 text-sm text-[#efe6ff]"
                >
                  {r.slug}
                  {r.verseId ? ` · ${r.verseId}` : ""}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10">
        <h2 className="font-serif text-xl text-[#ffd60a]">{t("bookmarks")}</h2>
        {bookmarks.length === 0 ? (
          <p className="mt-2 text-sm text-[#6b5a80]">{t("empty")}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {bookmarks.map((b) => (
              <li key={b.textId + b.verseId}>
                <Link
                  href={`/${locale}/path/${b.slug}/`}
                  className="block rounded-xl border border-white/12 bg-white/5 px-4 py-3 text-sm text-[#efe6ff]"
                >
                  {b.label || b.verseId}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-5">
        <h2 className="font-serif text-lg text-[#fff8e7]">{t("offline")}</h2>
        <p className="mt-2 text-sm text-[#a994c4]">{t("offlineBody")}</p>
        <OfflinePackButton
          packId={chalisaOfflinePack.id || "pack-chalisa-v1"}
          assets={
            (chalisaOfflinePack.assets as { path: string; sha256?: string }[]) ||
            []
          }
          label={t("downloadPack")}
          readyLabel={t("packReady")}
        />
      </section>

      <section className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
        <h2 className="font-serif text-lg text-[#fff8e7]">{t("skPacks")}</h2>
        <p className="mt-2 text-sm text-[#a994c4]">{t("skPacksBody")}</p>
        <button
          type="button"
          className="mt-3 text-xs text-[#f48c06]"
          onClick={() => setShowSk((s) => !s)}
        >
          {showSk ? "Hide sections" : `Show ${packs.length} section packs`}
        </button>
        {showSk && (
          <ul className="mt-4 max-h-80 space-y-3 overflow-y-auto">
            {packs.map((p) => (
              <li
                key={p.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/10 px-3 py-2"
              >
                <span className="text-sm text-[#efe6ff]">{p.sectionId}</span>
                <OfflinePackButton
                  packId={p.id}
                  urls={p.assets.map((a) => a.path)}
                  messageType="CACHE_SK_PACK"
                  label={t("downloadPack")}
                  readyLabel={t("packReady")}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => void doExport()}
          className="rounded-full border border-white/20 px-4 py-2 text-sm text-[#fff8e7]"
        >
          {t("export")}
        </button>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="rounded-full border border-white/20 px-4 py-2 text-sm text-[#fff8e7]"
        >
          {t("import")}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) doImport(f);
          }}
        />
      </section>
      {importMsg && (
        <p className="mt-2 text-xs text-[#ffd60a]">{importMsg}</p>
      )}

      <button
        type="button"
        className="mt-8 text-xs text-[#d00000]"
        onClick={() => {
          void (async () => {
            await clearMyPathAsync();
            setResume([]);
            setBookmarks([]);
          })();
        }}
      >
        {t("clear")}
      </button>
    </SiteShell>
  );
}
