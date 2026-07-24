import { z } from "zod";

export const LocaleTitleSchema = z.object({
  hi: z.string().min(1),
  en: z.string().min(1),
});

export const EditionSchema = z.object({
  pin: z.string().min(1),
  publisher: z.string().optional(),
  notes: z.string().optional(),
});

export const AudioSegmentSchema = z.object({
  id: z.string(),
  sectionId: z.string(),
  src: z.string(),
  cueMapSrc: z.string(),
  durationMs: z.number().nonnegative(),
  order: z.number().int().optional(),
  lowDataSrc: z.string().optional(),
});

export const TextMetaSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  title: LocaleTitleSchema,
  subtitle: z
    .union([LocaleTitleSchema, z.string()])
    .optional(),
  description: z.union([LocaleTitleSchema, z.string()]).optional(),
  category: z.string(),
  wave: z.number().int().min(0).max(3).optional(),
  edition: EditionSchema,
  flags: z
    .object({
      hasAudio: z.boolean().optional(),
      hasOfflinePack: z.boolean().optional(),
      hasTwinText: z.boolean().optional(),
      ff_twin_text: z.boolean().optional(),
      placeholderAudio: z.boolean().optional(),
      ttsGenerated: z.boolean().optional(),
      needsDualReview: z.boolean().optional(),
      ocrSource: z.boolean().optional(),
      wave: z.number().optional(),
    })
    .passthrough(),
  audio: z
    .object({
      src: z.string().optional(),
      cueMapSrc: z.string().optional(),
      segments: z.array(AudioSegmentSchema).optional(),
      /**
       * Optional low-data alternate segments.
       * When present: must match `segments` length and sectionId per index (CI).
       */
      lowDataSegments: z.array(AudioSegmentSchema).optional(),
      credits: z.string().optional(),
      trackId: z.string().optional(),
      lowDataSrc: z.string().optional(),
    })
    .passthrough()
    .optional(),
  twinText: z.unknown().optional(),
  stats: z
    .object({
      sectionCount: z.number().optional(),
      verseCount: z.number().optional(),
    })
    .optional(),
});

export const SectionNodeSchema = z.object({
  id: z.string(),
  kind: z.string(),
  title: LocaleTitleSchema,
  verseIds: z.array(z.string()),
  order: z.number().int(),
});

export const StructureSchema = z.object({
  sections: z.array(SectionNodeSchema).min(1),
});

export const VerseUnitSchema = z.object({
  id: z.string(),
  kind: z.string(),
  text: z.string().min(1),
  sectionId: z.string(),
});

export const VersesMapSchema = z.record(VerseUnitSchema);

export const TranslationBundleSchema = z.record(z.string());
export const TransliterationBundleSchema = z.record(z.string());

/** Offline pack asset roles used in content/packs (design CI / T12). */
export const OFFLINE_PACK_ROLES = [
  "audio",
  "cues",
  "meta",
  "verses",
  "translation",
  "transliteration",
  "structure",
] as const;

export type OfflinePackRole = (typeof OFFLINE_PACK_ROLES)[number];

export const OfflinePackAssetSchema = z.object({
  path: z.string(),
  role: z.enum(OFFLINE_PACK_ROLES).or(z.string()),
  bytes: z.number().nonnegative().optional(),
  sha256: z.string().optional(),
  segmentId: z.string().optional(),
  locale: z.string().optional(),
  scheme: z.string().optional(),
});

export const OfflinePackManifestSchema = z.object({
  id: z.string(),
  textId: z.string(),
  version: z.number().int().positive(),
  maxBytes: z.number().positive(),
  title: LocaleTitleSchema.optional(),
  locales: z.array(z.string()).optional(),
  transliterationSchemes: z.array(z.string()).optional(),
  segmentIds: z.array(z.string()).optional(),
  cueMapIds: z.array(z.string()).optional(),
  trackId: z.string().optional(),
  sectionId: z.string().optional(),
  assets: z.array(OfflinePackAssetSchema).min(1),
  createdAt: z.string().optional(),
  notes: z.string().optional(),
});

export type TextMeta = z.infer<typeof TextMetaSchema>;
export type OfflinePackManifest = z.infer<typeof OfflinePackManifestSchema>;
export type AudioSegment = z.infer<typeof AudioSegmentSchema>;

/** Wave 0 required text ids for public matrix */
export const WAVE0_REQUIRED_TEXT_IDS = [
  "hanuman-chalisa",
  "sundar-kand-manas",
] as const;

export const REQUIRED_LOCALES_MEANING = ["hi", "en"] as const;
export const REQUIRED_TRANSLIT = ["iast"] as const;

/**
 * CI helper: lowDataSegments must match segments length + sectionId per index.
 * Returns list of human-readable error strings (empty if ok / not applicable).
 */
export function validateLowDataSegmentsParity(audio: {
  segments?: { sectionId?: string }[];
  lowDataSegments?: { sectionId?: string }[];
} | null | undefined): string[] {
  const out: string[] = [];
  if (!audio?.lowDataSegments) return out;
  const segs = audio.segments;
  const low = audio.lowDataSegments;
  if (!segs) {
    out.push("lowDataSegments present but segments missing");
    return out;
  }
  if (low.length !== segs.length) {
    out.push(
      `lowDataSegments length ${low.length} !== segments length ${segs.length}`,
    );
  }
  const n = Math.min(low.length, segs.length);
  for (let i = 0; i < n; i++) {
    if (segs[i]?.sectionId !== low[i]?.sectionId) {
      out.push(
        `lowDataSegments[${i}].sectionId (${low[i]?.sectionId}) !== segments[${i}].sectionId (${segs[i]?.sectionId})`,
      );
    }
  }
  return out;
}
