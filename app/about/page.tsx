import type { Metadata } from "next";
import { AboutPage } from "@/features/about/about-page";

export const metadata: Metadata = {
  title: "About — Farakchu",
  description: "Four rooms under one neon diamond in Samakhusi, Kathmandu.",
};

export default function AboutRoute() {
  return <AboutPage />;
}
