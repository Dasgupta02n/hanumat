import { describe, expect, it, vi } from "vitest";
import {
  AudioController,
  nextSegmentAfterSection,
  nextSegmentIndex,
  resolveAudioSrc,
  segmentIndexForSection,
  shouldAutoAdvanceOnEnded,
  type PlaylistSegment,
} from "./AudioController";

const segs: PlaylistSegment[] = [
  { id: "a", sectionId: "s1", src: "/a.m4a" },
  { id: "b", sectionId: "s2", src: "/b.m4a" },
  { id: "c", sectionId: "s3", src: "/c.m4a" },
];

describe("nextSegmentIndex", () => {
  it("returns next index within bounds", () => {
    expect(nextSegmentIndex(0, 3)).toBe(1);
    expect(nextSegmentIndex(1, 3)).toBe(2);
  });

  it("returns null at last segment or empty playlist", () => {
    expect(nextSegmentIndex(2, 3)).toBeNull();
    expect(nextSegmentIndex(0, 1)).toBeNull();
    expect(nextSegmentIndex(0, 0)).toBeNull();
    expect(nextSegmentIndex(-1, 3)).toBeNull();
  });
});

describe("segment playlist advance", () => {
  it("finds segment by sectionId", () => {
    expect(segmentIndexForSection(segs, "s2")).toBe(1);
    expect(segmentIndexForSection(segs, "missing")).toBe(-1);
  });

  it("advances to next segment after section (Path Studio full/listen)", () => {
    expect(nextSegmentAfterSection(segs, "s1")?.id).toBe("b");
    expect(nextSegmentAfterSection(segs, "s2")?.sectionId).toBe("s3");
    expect(nextSegmentAfterSection(segs, "s3")).toBeNull();
    expect(nextSegmentAfterSection(segs, "unknown")).toBeNull();
    expect(nextSegmentAfterSection([], "s1")).toBeNull();
  });

  it("only auto-advances in full or listen mode", () => {
    expect(shouldAutoAdvanceOnEnded("full")).toBe(true);
    expect(shouldAutoAdvanceOnEnded("listen")).toBe(true);
    expect(shouldAutoAdvanceOnEnded("section")).toBe(false);
  });
});

describe("resolveAudioSrc", () => {
  it("prefers low-data when enabled", () => {
    expect(
      resolveAudioSrc({
        lowData: true,
        segment: { src: "/full.m4a", lowDataSrc: "/low.m4a" },
        trackSrc: "/track.m4a",
      }),
    ).toBe("/low.m4a");
  });

  it("falls back to full src when low-data missing", () => {
    expect(
      resolveAudioSrc({
        lowData: true,
        segment: { src: "/full.m4a" },
        trackLowDataSrc: "/track-low.m4a",
      }),
    ).toBe("/track-low.m4a");
    expect(
      resolveAudioSrc({
        lowData: false,
        segment: { src: "/full.m4a", lowDataSrc: "/low.m4a" },
      }),
    ).toBe("/full.m4a");
  });
});

describe("AudioController", () => {
  function mockAudio(): HTMLAudioElement {
    const listeners = new Map<string, Set<EventListener>>();
    const el = {
      currentTime: 0,
      duration: 120,
      paused: true,
      playbackRate: 1,
      src: "",
      play: vi.fn(async () => {
        el.paused = false;
      }),
      pause: vi.fn(() => {
        el.paused = true;
      }),
      getAttribute: vi.fn(() => null),
      addEventListener: vi.fn((type: string, fn: EventListener) => {
        if (!listeners.has(type)) listeners.set(type, new Set());
        listeners.get(type)!.add(fn);
      }),
      removeEventListener: vi.fn((type: string, fn: EventListener) => {
        listeners.get(type)?.delete(fn);
      }),
      _emit(type: string) {
        listeners.get(type)?.forEach((fn) => fn(new Event(type)));
      },
    };
    return el as unknown as HTMLAudioElement & { _emit: (t: string) => void };
  }

  it("play/pause/seek/setRate delegate to the element", async () => {
    const audio = mockAudio();
    const ctrl = new AudioController(audio);
    await ctrl.play();
    expect(audio.play).toHaveBeenCalled();
    ctrl.setRate(1.25);
    expect(ctrl.playbackRate).toBe(1.25);
    ctrl.seek(12.5);
    expect(ctrl.currentTime).toBe(12.5);
    ctrl.seekMs(3000);
    expect(ctrl.currentTime).toBeCloseTo(3.02);
    ctrl.pause();
    expect(audio.pause).toHaveBeenCalled();
  });
});
