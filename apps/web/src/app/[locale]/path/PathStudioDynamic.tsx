"use client";

import dynamic from "next/dynamic";
import type { TextPackage } from "@/lib/content";

/** Client-only lazy PathStudio — keeps heavy studio deps off the path page server graph. */
const PathStudio = dynamic(() => import("@/components/PathStudio"), {
  ssr: false,
  loading: () => <p className="text-sm text-[#a994c4]">…</p>,
});

export function PathStudioDynamic({
  text,
  initialSectionId,
}: {
  text: TextPackage;
  initialSectionId?: string;
}) {
  return <PathStudio text={text} initialSectionId={initialSectionId} />;
}
