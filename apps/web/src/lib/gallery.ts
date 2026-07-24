import galleryData from "../../../../content/gallery/hanuman-108.json";

export type GalleryImage = {
  id: string;
  file: string;
  style: string;
  scene: { hi: string; en: string };
  leela: string;
};

export const galleryTitle = galleryData.title;
export const galleryImages = galleryData.images as GalleryImage[];

export function gallerySrc(file: string) {
  return `/images/hanuman-108/${file}`;
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
  // fallbacks if specific id missing still use a real file
  any: "001.jpg",
};

export function imageForLeela(tag: string) {
  const file = leelaImageMap[tag] || leelaImageMap.default;
  return gallerySrc(file);
}

export function getGalleryImage(id: string) {
  return galleryImages.find((i) => i.id === id || i.file === id);
}
