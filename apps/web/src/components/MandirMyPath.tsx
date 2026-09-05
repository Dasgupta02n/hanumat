"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { SiteShell } from "@/components/SiteShell";
import { OfflinePackButton } from "@/components/OfflinePackButton";
import { skOfflinePacks } from "@/data/sk-packs";
import chalisaOfflinePack from "@/data/pack-chalisa-v1.json";
import { useDeity } from "@/components/DeityProvider";
import { deityHref, isDeityId, type DeityId } from "@/lib/deities";
import { getTextBySlug } from "@/lib/content";
import { listDhamPacks } from "@/lib/offline";
import {
  clearMyPathAsync,
  exportMyPathAsync,
  importMyPathAsync,
  loadBookmarksAsync,
  loadResumeAsync,
  loadJapa,
  type Bookmark,
  type ResumePoint,
} from "@/lib/my-path";

function hrefForSlug(slug: string, locale: string, verseId?: string) {
  const pack = getTextBySlug(slug);
  const deity = (pack?.deity && isDeityId(pack.deity) ? pack.deity : "hanuman") as DeityId;
  const base = deityHref(deity, locale, `/path/${slug}/`);
  return verseId ? `${base}?verse=${encodeURIComponent(verseId)}` : base;
}

export function MandirMyPath() {
  const t = useTranslations("myPath");
  const locale = useLocale();
  const deity = useDeity();
  const [resume, setResume] = useState<ResumePoint[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [importMsg, setImportMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [showSk, setShowSk] = useState(false);
  const japa = loadJapa(deity.id);

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
  const dhamPacks = listDhamPacks().filter((p) =>
    deity.id === "shiva" ? p.id.includes("shiva") : deity.id === "kali" ? p.id.includes("kali") : false,
  );

  return (
    <SiteShell>
      <h1 className="section-title text-4xl">{t("title")}</h1>
      <p className="mt-2 text-sm" style={{ color: "var(--hanumat-stone)" }}>
        {t("intro")} {locale === "en" ? "One notebook across the three dhams. No accounts." : "तीन धाम का एक स्थानीय पंजी। बिना खाता।"}
      </p>

      <section className="mt-8 temple-card p-5">
        <h2 className="font-serif text-xl">{locale === "en" ? "This mala" : "यह माला"}</h2>
        <p className="mt-2 text-sm" style={{ color: "var(--hanumat-stone)" }}>
          {deity.mantra.hi} · {japa.count}/{japa.target}
          {japa.sessions ? ` · ${japa.sessions}` : ""}
        </p>
        <Link href={deityHref(deity.id, locale, "/japa/")} className="btn-ghost mt-3 inline-flex !px-3 !py-1.5 text-xs">
          {locale === "en" ? "Open japa" : "जप खोलें"}
        </Link>
      </section>

      <section className="mt-8">
        <h2 className="section-title text-xl">{t("continue")}</h2>
        {resume.length === 0 ? (
          <p className="mt-2 text-sm" style={{ color: "var(--hanumat-stone)" }}>{t("empty")}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {resume.map((r) => (
              <li key={r.textId + r.updatedAt}>
                <Link
                  href={hrefForSlug(r.slug, locale, r.verseId)}
                  className="temple-card block px-4 py-3 text-sm"
                >
                  {getTextBySlug(r.slug)?.title.hi || r.slug}
                  {r.verseId ? ` · ${r.verseId}` : ""}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10">
        <h2 className="section-title text-xl">{t("bookmarks")}</h2>
        {bookmarks.length === 0 ? (
          <p className="mt-2 text-sm" style={{ color: "var(--hanumat-stone)" }}>{t("empty")}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {bookmarks.map((b) => (
              <li key={b.textId + b.verseId}>
                <Link
                  href={hrefForSlug(b.slug, locale, b.verseId)}
                  className="temple-card block px-4 py-3 text-sm"
                >
                  {b.label || b.verseId}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {deity.id === "hanuman" && (
        <>
          <section className="mt-10 temple-card p-5">
            <h2 className="font-serif text-lg">{t("offline")}</h2>
            <p className="mt-2 text-sm" style={{ color: "var(--hanumat-stone)" }}>{t("offlineBody")}</p>
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
          <section className="mt-6 temple-card p-5">
            <h2 className="font-serif text-lg">{t("skPacks")}</h2>
            <p className="mt-2 text-sm" style={{ color: "var(--hanumat-stone)" }}>{t("skPacksBody")}</p>
            <button
              type="button"
              className="mt-3 text-xs"
              style={{ color: "var(--hanumat-vermillion-deep)" }}
              onClick={() => setShowSk((s) => !s)}
            >
              {showSk ? "Hide sections" : `Show ${packs.length} section packs`}
            </button>
            {showSk && (
              <ul className="mt-4 max-h-80 space-y-3 overflow-y-auto">
                {packs.map((p) => (
                  <li
                    key={p.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl border px-3 py-2"
                    style={{ borderColor: "var(--hanumat-gold-line)" }}
                  >
                    <span className="text-sm">{p.sectionId}</span>
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
        </>
      )}

      {dhamPacks.map((p) => (
        <section key={p.id} className="mt-6 temple-card p-5">
          <h2 className="font-serif text-lg">
            {locale === "en" ? p.title?.en : p.title?.hi}
          </h2>
          <p className="mt-2 text-sm" style={{ color: "var(--hanumat-stone)" }}>
            {p.notes}
          </p>
          <OfflinePackButton
            packId={p.id}
            assets={p.assets}
            label={t("downloadPack")}
            readyLabel={t("packReady")}
          />
        </section>
      ))}

      <section className="mt-8 flex flex-wrap gap-3">
        <button type="button" onClick={() => void doExport()} className="btn-ghost text-sm">
          {t("export")}
        </button>
        <button type="button" onClick={() => fileRef.current?.click()} className="btn-ghost text-sm">
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
        <p className="mt-2 text-xs" style={{ color: "var(--hanumat-gold-deep)" }}>
          {importMsg}
        </p>
      )}

      <button
        type="button"
        className="mt-8 text-xs"
        style={{ color: "var(--hanumat-vermillion-deep)" }}
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
