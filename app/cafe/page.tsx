import type { Metadata } from "next";
import { CafePage } from "@/features/cafe/components/cafe-page";

export const metadata: Metadata = {
  title: "Cafe — Farakchu",
  description: "Coffee, matcha, cold drinks and bakes at Farakchu, Samakhusi, Kathmandu. See the full menu.",
};

export default function CafeRoute() {
  return <CafePage />;
}
