export type ResumePoint = {
  textId: string;
  slug: string;
  trackId?: string;
  sectionId?: string;
  segmentId?: string;
  verseId?: string;
  positionMs?: number;
  cueMapVersion?: number;
  rate?: number;
  lowData?: boolean;
  updatedAt: string;
};

export type Bookmark = {
  key?: string;
  textId: string;
  slug: string;
  verseId: string;
  label?: string;
  note?: string;
  updatedAt: string;
};

export type JapaState = {
  count: number;
  target: number;
  sessions?: number;
  updatedAt?: string;
};

export type MyPathExport = {
  version: number;
  exportedAt: string;
  resume: ResumePoint[];
  bookmarks: Bookmark[];
  japa: JapaState;
  offlinePacks: string[];
};
