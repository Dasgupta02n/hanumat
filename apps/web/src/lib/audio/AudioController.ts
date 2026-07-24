/**
 * AudioController — thin wrapper over HTMLAudioElement + pure segment playlist helpers.
 * Playlist advance logic is pure (no DOM) so unit tests need no jsdom.
 */

export type PlaylistSegment = {
  id: string;
  sectionId: string;
  src: string;
  cueMapSrc?: string;
  durationMs?: number;
  lowDataSrc?: string;
};

/** Next index after `currentIndex`, or `null` when at / past the end. */
export function nextSegmentIndex(
  currentIndex: number,
  segmentCount: number,
): number | null {
  if (segmentCount <= 0) return null;
  if (currentIndex < 0 || currentIndex >= segmentCount - 1) return null;
  return currentIndex + 1;
}

/** Index of segment matching `sectionId`, or `-1` if missing. */
export function segmentIndexForSection(
  segments: readonly Pick<PlaylistSegment, "sectionId">[],
  sectionId: string,
): number {
  return segments.findIndex((s) => s.sectionId === sectionId);
}

/**
 * Next segment after the one for `sectionId` (Path Studio full/listen auto-advance).
 * Returns `null` when there is no next segment or the section is unknown.
 */
export function nextSegmentAfterSection<T extends Pick<PlaylistSegment, "sectionId">>(
  segments: readonly T[],
  sectionId: string,
): T | null {
  if (!segments.length) return null;
  const idx = segmentIndexForSection(segments, sectionId);
  if (idx < 0) return null;
  const next = nextSegmentIndex(idx, segments.length);
  if (next === null) return null;
  return segments[next] ?? null;
}

/** Whether full/listen mode should auto-advance on `ended`. */
export function shouldAutoAdvanceOnEnded(
  mode: "full" | "section" | "listen",
): boolean {
  return mode === "full" || mode === "listen";
}

/** Pick playback URL given low-data preference and segment/track fallbacks. */
export function resolveAudioSrc(opts: {
  lowData: boolean;
  segment?: Pick<PlaylistSegment, "src" | "lowDataSrc"> | null;
  trackSrc?: string;
  trackLowDataSrc?: string;
}): string | undefined {
  const { lowData, segment, trackSrc, trackLowDataSrc } = opts;
  if (lowData) {
    return (
      segment?.lowDataSrc ||
      trackLowDataSrc ||
      segment?.src ||
      trackSrc
    );
  }
  return segment?.src || trackSrc;
}

export type AudioControllerEvents = {
  play?: () => void;
  pause?: () => void;
  ended?: () => void;
  timeupdate?: () => void;
};

/**
 * Thin façade over a native `HTMLAudioElement`.
 * Prefer injecting a mock element in tests.
 */
export class AudioController {
  private audio: HTMLAudioElement;
  private unbind: (() => void) | null = null;

  constructor(audio: HTMLAudioElement) {
    this.audio = audio;
  }

  get element(): HTMLAudioElement {
    return this.audio;
  }

  get currentTime(): number {
    return this.audio.currentTime;
  }

  get duration(): number {
    const d = this.audio.duration;
    return Number.isFinite(d) ? d : 0;
  }

  get paused(): boolean {
    return this.audio.paused;
  }

  get playbackRate(): number {
    return this.audio.playbackRate;
  }

  get src(): string {
    return this.audio.src;
  }

  loadSrc(src: string): void {
    if (this.audio.src !== src && this.audio.getAttribute("src") !== src) {
      this.audio.src = src;
    }
  }

  async play(): Promise<void> {
    await this.audio.play();
  }

  pause(): void {
    this.audio.pause();
  }

  /** Seek to absolute seconds (clamped ≥ 0). */
  seek(seconds: number): void {
    const t = Math.max(0, seconds);
    this.audio.currentTime = t;
  }

  /** Seek using cue milliseconds (adds a small lead-in, matching Path Studio). */
  seekMs(ms: number, leadInSec = 0.02): void {
    this.seek(ms / 1000 + leadInSec);
  }

  setRate(rate: number): void {
    this.audio.playbackRate = rate;
  }

  /** Wire play/pause/ended/timeupdate; returns disposer. Replaces any prior bind. */
  bind(events: AudioControllerEvents): () => void {
    this.unbind?.();
    const a = this.audio;
    const onPlay = () => events.play?.();
    const onPause = () => events.pause?.();
    const onEnded = () => events.ended?.();
    const onTime = () => events.timeupdate?.();
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("ended", onEnded);
    a.addEventListener("timeupdate", onTime);
    this.unbind = () => {
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("ended", onEnded);
      a.removeEventListener("timeupdate", onTime);
      this.unbind = null;
    };
    return this.unbind;
  }

  dispose(): void {
    this.unbind?.();
    this.unbind = null;
  }
}
