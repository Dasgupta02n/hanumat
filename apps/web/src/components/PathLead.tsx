import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { OfflinePackButton } from "@/components/OfflinePackButton";
import chalisaOfflinePack from "@/data/pack-chalisa-v1.json";
import { deityHref, type DeityId } from "@/lib/deities";
import { seoFor, pathJsonLd } from "@/lib/seo-paths";
import { galleryPick } from "@/lib/gallery";
import type { TextPackage } from "@/lib/content";
import type { Locale } from "@/i18n/config";

export function PathLead({
  deity,
  locale,
  text,
}: {
  deity: DeityId;
  locale: Locale;
  text: TextPackage;
}) {
  const en = locale === "en";
  const seo = seoFor(text.slug);
  const h = (p: string) => deityHref(deity, locale, p);
  const url = `https://hanumat.life${h(`/path/${text.slug}/`)}`;
  const img = `https://hanumat.life${galleryPick(deity, text.slug.length * 7)}`;
  const shortVerses = text.verses.length <= 48 ? text.verses.slice(0, 16) : [];

  return (
    <div className="mb-8">
      <JsonLd
        data={pathJsonLd({
          deity,
          slug: text.slug,
          locale,
          name: en ? text.title.en : text.title.hi,
          description: en ? seo.description.en : seo.description.hi,
          url,
          image: img,
        })}
      />
      <p className="max-w-2xl text-sm leading-relaxed" style={{ color: "var(--hanumat-stone)" }}>
        {en ? seo.how.en : seo.how.hi}
      </p>
      {en && (
        <p className="mt-2 text-sm" style={{ color: "var(--hanumat-vermillion-deep)" }}>
          Read in Roman letters: tap <strong>IAST</strong> in Path Studio.
        </p>
      )}
      <ul className="mt-4 flex flex-wrap gap-2 text-xs">
        <li>
          <Link href={h("/parayan/")} className="btn-ghost !px-3 !py-1.5">
            {en ? "Parayan / print" : "पारायण / छाप"}
          </Link>
        </li>
        <li>
          <Link href={h("/japa/")} className="btn-ghost !px-3 !py-1.5">
            {en ? "Japa mala" : "जप माला"}
          </Link>
        </li>
        <li>
          <Link href={h("/trust/")} className="btn-ghost !px-3 !py-1.5">
            {en ? "No ads · sources" : "विज्ञापन नहीं · स्रोत"}
          </Link>
        </li>
      </ul>
      {text.slug === "hanuman-chalisa" && (
        <div className="temple-card mt-4 p-4">
          <p className="text-sm" style={{ color: "var(--hanumat-stone)" }}>
            {en
              ? "Tuesday gift: download the Chalisa pack (sha256-verified) and recite offline."
              : "मंगलवार दान: चालीसा पैक डाउनलोड करें (sha256 जाँच) — ऑफ़लाइन पाठ।"}
          </p>
          <OfflinePackButton
            packId={chalisaOfflinePack.id || "pack-chalisa-v1"}
            assets={
              (chalisaOfflinePack.assets as { path: string; sha256?: string }[]) || []
            }
            label={en ? "Offline Chalisa pack" : "चालीसा ऑफ़लाइन पैक"}
            readyLabel={en ? "Pack ready on this phone" : "पैक तैयार"}
          />
        </div>
      )}
      {shortVerses.length > 0 && (
        <nav className="mt-6" aria-label={en ? "Verses" : "श्लोक"}>
          <p className="section-kicker">{en ? "Jump to a verse" : "श्लोक पर जाएँ"}</p>
          <ol className="mt-2 columns-1 gap-x-6 text-sm sm:columns-2">
            {shortVerses.map((v, i) => (
              <li key={v.id} className="mb-1 break-inside-avoid">
                <Link
                  href={`${h(`/path/${text.slug}/`)}?verse=${v.id}`}
                  className="hover:underline"
                  style={{ color: "var(--hanumat-charcoal)" }}
                >
                  {i + 1}. {v.text.replace(/\n/g, " ").slice(0, 52)}
                  {v.text.length > 52 ? "…" : ""}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
      )}
    </div>
  );
}
