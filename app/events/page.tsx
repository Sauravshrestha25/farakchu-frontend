import { redirect } from "next/navigation";

// Events and Entertainment are the same page now.
export default function EventsRoute() {
  redirect("/entertainment");
}
