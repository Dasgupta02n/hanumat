import hanumanData from "../../../../content/gallery/hanuman-108.json";
import shivaData from "../../../../content/gallery/shiva-108.json";
import kaliData from "../../../../content/gallery/kali-108.json";
import type { DeityId } from "@/lib/deities";

export type GalleryImage = {
  id: string;
  file: string;
  style: string;
  scene: { hi: string; en: string };
  leela: string;
};

export const galleryTitle = hanumanData.title;
export const galleryImages = hanumanData.images as GalleryImage[];

const PACKS: Record<DeityId, { title: { hi: string; en: string }; images: GalleryImage[] }> = {
  hanuman: {
    title: hanumanData.title,
    images: hanumanData.images as GalleryImage[],
  },
  shiva: {
    title: shivaData.title,
    images: shivaData.images as GalleryImage[],
  },
  kali: {
    title: kaliData.title,
    images: kaliData.images as GalleryImage[],
  },
};

const FOLDERS: Record<DeityId, string> = {
  hanuman: "/images/hanuman-108",
  shiva: "/images/shiva-108",
  kali: "/images/kali-108",
};

export function getGallery(deity: DeityId = "hanuman") {
  return PACKS[deity];
}

export function gallerySrc(file: string, deity: DeityId = "hanuman") {
  return `${FOLDERS[deity]}/${file}`;
}

export function gallerySrcFor(deity: DeityId, file: string) {
  return gallerySrc(file, deity);
}

/** Stable pick from a deity's 108 pack (wraps). */
export function galleryPick(deity: DeityId, index: number) {
  const imgs = PACKS[deity].images;
  const img = imgs[((index % imgs.length) + imgs.length) % imgs.length];
  return gallerySrc(img.file, deity);
}

/** Map leela tags to a preferred gallery id for site placement */
export const leelaImageMap: Record<string, string> = {
  home: "006.jpg",
  ocean: "006.jpg",
  sagar: "006.jpg",
  chalisa: "036.jpg",
  sk: "013.jpg",
  sita: "014.jpg",
  sanjeevani: "017.jpg",
  aarti: "027.jpg",
  japa: "023.jpg",
  panchmukhi: "022.jpg",
  temple: "059.jpg",
  kids: "074.jpg",
  sankat: "041.jpg",
  katha: "064.jpg",
  jayanti: "049.jpg",
  valmiki: "006.jpg",
  dawn: "026.jpg",
  fire: "016.jpg",
  default: "108.jpg",
  any: "001.jpg",
};

export function imageForLeela(tag: string, deity: DeityId = "hanuman") {
  const file = leelaImageMap[tag] || leelaImageMap.default;
  return gallerySrc(file, deity);
}

export function getGalleryImage(id: string, deity: DeityId = "hanuman") {
  return PACKS[deity].images.find((i) => i.id === id || i.file === id);
}

export function carouselSlides(deity: DeityId) {
  return PACKS[deity].images.map((img) => ({
    src: gallerySrc(img.file, deity),
    alt: img.scene.en,
  }));
}
