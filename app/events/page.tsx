import type { Metadata } from "next";
import { EventsPage } from "@/features/events/components/events-page";

export const metadata: Metadata = {
  title: "Events — Farakchu",
  description: "Live nights, watch parties and tournaments at Farakchu, Samakhusi, Kathmandu.",
};

export default function EventsRoute() {
  return <EventsPage />;
}
