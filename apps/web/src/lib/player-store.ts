"use client";

import { create } from "zustand";

export type PlayerMode = "full" | "section" | "listen";

type PlayerState = {
  textId: string | null;
  sectionId: string | null;
  segmentId: string | null;
  mode: PlayerMode;
  playing: boolean;
  activeVerseId: string | null;
  rate: number;
  lowData: boolean;
  setText: (textId: string) => void;
  setSection: (sectionId: string) => void;
  setSegment: (segmentId: string | null) => void;
  setMode: (mode: PlayerMode) => void;
  setPlaying: (playing: boolean) => void;
  setActiveVerse: (id: string | null) => void;
  setRate: (rate: number) => void;
  setLowData: (lowData: boolean) => void;
};

export const usePlayerStore = create<PlayerState>((set) => ({
  textId: null,
  sectionId: null,
  segmentId: null,
  mode: "section",
  playing: false,
  activeVerseId: null,
  rate: 1,
  lowData: false,
  setText: (textId) => set({ textId }),
  setSection: (sectionId) => set({ sectionId }),
  setSegment: (segmentId) => set({ segmentId }),
  setMode: (mode) => set({ mode }),
  setPlaying: (playing) => set({ playing }),
  setActiveVerse: (activeVerseId) => set({ activeVerseId }),
  setRate: (rate) => set({ rate }),
  setLowData: (lowData) => set({ lowData }),
}));
