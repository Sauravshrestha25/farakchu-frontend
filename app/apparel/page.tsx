import type { Metadata } from "next";
import { ApparelPage } from "@/features/apparel/components/apparel-page";

export const metadata: Metadata = {
  title: "Apparel — Farakchu",
  description: "Limited Farakchu apparel chapters, made in Kathmandu.",
};

export default function ApparelRoute() {
  return <ApparelPage />;
}
