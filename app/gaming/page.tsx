import type { Metadata } from "next";
import { EntertainmentPage } from "@/components/entertainment/entertainment-page";

export const metadata: Metadata = {
  title: "Gaming Zone — Farakchu",
  description: "PS5s, FC 26 tournaments and squad nights at Farakchu, Samakhusi, Kathmandu.",
};

export default function GamingRoute() {
  return <EntertainmentPage page="gaming" />;
}
