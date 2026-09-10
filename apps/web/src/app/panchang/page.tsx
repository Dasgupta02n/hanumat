import type { Metadata } from "next";
import { CourtyardShell } from "@/components/CourtyardShell";
import { PanchangHub } from "@/components/PanchangHub";

export const metadata: Metadata = {
  title: "Panchang · Muhurat · Festivals",
  description:
    "Household panchang for the Hanumat courtyard — Hindi, Bengali panjika, Gujarati, Marathi, Tamil, and more. Muhurat windows, 2026 festivals, and rituals linked to Hanuman, Shiva, and Kali. No ads, no kundali, no paid muhurat.",
  alternates: { canonical: "https://hanumat.life/panchang/" },
  openGraph: {
    title: "Hanumat panchang",
    description: "Regional panjika, household muhurat, festivals and three-dham rituals. Free, no ads.",
    url: "https://hanumat.life/panchang/",
  },
};

export default function PanchangPage() {
  return (
    <CourtyardShell>
      <PanchangHub />
    </CourtyardShell>
  );
}
