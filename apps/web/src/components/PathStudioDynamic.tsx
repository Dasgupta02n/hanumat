"use client";

import dynamic from "next/dynamic";
import type { TextPackage } from "@/lib/content";

const PathStudio = dynamic(() => import("@/components/PathStudio"), {
  ssr: false,
  loading: () => <p className="text-sm" style={{ color: "var(--hanumat-stone)" }}>…</p>,
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
