import type { Metadata } from "next";
import { ContactPage } from "@/components/contact/contact-page";

export const metadata: Metadata = {
  title: "Contact — Farakchu",
  description: "Book an event, ask about a drop, or just say hi. Farakchu, Samakhusi, Kathmandu.",
};

export default function ContactRoute() {
  return <ContactPage />;
}
