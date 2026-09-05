import type { DeityId } from "@/lib/deities";
import { deities, deityHref } from "@/lib/deities";
import { galleryPick } from "@/lib/gallery";

function ymd(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function inWindow(today: string, start: string, end: string) {
  return today >= start && today <= end;
}

const SHIVARATRI = [
  ["2026-02-14", "2026-02-16"],
  ["2027-03-05", "2027-03-07"],
  ["2028-02-22", "2028-02-24"],
  ["2029-02-11", "2029-02-13"],
  ["2030-03-03", "2030-03-05"],
];

const KALI_PUJA = [
  ["2026-11-07", "2026-11-09"],
  ["2027-10-28", "2027-10-30"],
  ["2028-10-16", "2028-10-18"],
];

/** Approximate Amavasya ±1 day (IST civil). Confirm local panchang. */
const AMAVASYA = [
  ["2026-01-17", "2026-01-19"],
  ["2026-02-16", "2026-02-18"],
  ["2026-03-18", "2026-03-20"],
  ["2026-04-16", "2026-04-18"],
  ["2026-05-15", "2026-05-17"],
  ["2026-06-14", "2026-06-16"],
  ["2026-07-13", "2026-07-15"],
  ["2026-08-11", "2026-08-13"],
  ["2026-09-09", "2026-09-11"],
  ["2026-10-09", "2026-10-11"],
  ["2026-11-08", "2026-11-10"],
  ["2026-12-08", "2026-12-10"],
  ["2027-01-06", "2027-01-08"],
];

/** Approximate Śrāvaṇa windows — Mondays in this range are Shravan Somvar. */
const SHRAVAN = [
  ["2026-07-14", "2026-08-12"],
  ["2027-07-04", "2027-08-02"],
  ["2028-07-22", "2028-08-20"],
];

const HANUMAN_JAYANTI = [
  ["2026-04-01", "2026-04-03"],
  ["2027-03-21", "2027-03-23"],
  ["2028-04-08", "2028-04-10"],
  ["2029-03-29", "2029-03-31"],
  ["2030-04-17", "2030-04-19"],
];

export type TodayCard = {
  deity: DeityId;
  badge: { hi: string; en: string };
  title: { hi: string; en: string };
  href: string;
  leelaSrc: string;
  /** True on vrata / festival days — drives the home festival banner. */
  highlight: boolean;
};

export function todayForDeity(deity: DeityId, locale: string, now = new Date()): TodayCard {
  const h = (p: string) => deityHref(deity, locale, p);
  const day = now.getDay(); // 0 sun
  const today = ymd(now);
  const d = deities[deity];

  if (deity === "hanuman") {
    if (HANUMAN_JAYANTI.some(([a, b]) => inWindow(today, a, b))) {
      return {
        deity,
        badge: { hi: "जयन्ती", en: "Jayanti" },
        title: { hi: "हनुमान जयन्ती · चालीसा", en: "Hanuman Jayanti · Chalisa" },
        href: h("/path/hanuman-chalisa/"),
        leelaSrc: galleryPick("hanuman", now.getDate()),
        highlight: true,
      };
    }
    if (day === 2) {
      return {
        deity,
        badge: { hi: "मंगलवार", en: "Tuesday" },
        title: { hi: "मंगलवार · चालीसा", en: "Tuesday · Chalisa" },
        href: h("/path/hanuman-chalisa/"),
        leelaSrc: galleryPick("hanuman", now.getDate()),
        highlight: true,
      };
    }
    return {
      deity,
      badge: { hi: d.brand.hi, en: d.brand.en },
      title: { hi: "आज का पाठ · चालीसा", en: "Today’s path · Chalisa" },
      href: h("/path/hanuman-chalisa/"),
      leelaSrc: galleryPick("hanuman", now.getDate()),
      highlight: false,
    };
  }

  if (deity === "shiva") {
    if (SHIVARATRI.some(([a, b]) => inWindow(today, a, b))) {
      return {
        deity,
        badge: { hi: "शिवरात्रि", en: "Shivaratri" },
        title: { hi: "महाशिवरात्रि · मृत्युंजय", en: "Maha Shivaratri · Mrityunjaya" },
        href: h("/path/maha-mrityunjaya/"),
        leelaSrc: galleryPick("shiva", now.getDate()),
        highlight: true,
      };
    }
    if (day === 1) {
      const shravan = SHRAVAN.some(([a, b]) => inWindow(today, a, b));
      return {
        deity,
        badge: shravan
          ? { hi: "श्रावण सोमवार", en: "Shravan Monday" }
          : { hi: "सोमवार", en: "Monday" },
        title: { hi: "सोमवार · ॐ नमः शिवाय", en: "Monday · Om Namah Shivaya" },
        href: h("/path/om-namah-shivaya/"),
        leelaSrc: galleryPick("shiva", now.getDate()),
        highlight: true,
      };
    }
    return {
      deity,
      badge: { hi: "प्रदोष भाव", en: "Pradosha mood" },
      title: { hi: "आज · लिङ्गाष्टकम्", en: "Today · Lingashtakam" },
      href: h("/path/lingashtakam/"),
      leelaSrc: galleryPick("shiva", now.getDate()),
      highlight: false,
    };
  }

  if (KALI_PUJA.some(([a, b]) => inWindow(today, a, b))) {
    return {
      deity,
      badge: { hi: "काली पूजा", en: "Kali puja" },
      title: { hi: "काली पूजा · कालिकाष्टकम्", en: "Kali puja · Kalika Ashtakam" },
      href: h("/path/kalika-ashtakam/"),
      leelaSrc: galleryPick("kali", now.getDate()),
      highlight: true,
    };
  }
  if (AMAVASYA.some(([a, b]) => inWindow(today, a, b))) {
    return {
      deity,
      badge: { hi: "अमावस्या", en: "Amavasya" },
      title: { hi: "अमावस्या · काली जप", en: "Amavasya · Kali japa" },
      href: h("/japa/"),
      leelaSrc: galleryPick("kali", now.getDate()),
      highlight: true,
    };
  }
  return {
    deity,
    badge: { hi: "माँ का दिन", en: "Mother’s day" },
    title: { hi: "आज · आद्या स्तोत्र / जप", en: "Today · Adya Stotram / japa" },
    href: h("/japa/"),
    leelaSrc: galleryPick("kali", now.getDate()),
    highlight: false,
  };
}

export function leelaOfDay(deity: DeityId, now = new Date()) {
  const dayOfYear = Math.floor(
    (now.getTime() - Date.UTC(now.getUTCFullYear(), 0, 0)) / 86400000,
  );
  return galleryPick(deity, dayOfYear);
}
