import { events, guests, site } from "@/content/site";

// Rows show a dd.mm.yyyy date when the post carried one ("Aug 28"), else the post tag.
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const toDate = (tag: string) => {
  const m = tag.match(/^([A-Z][a-z]{2}) (\d{1,2})$/);
  return m ? `${m[2].padStart(2, "0")}.${String(MONTHS.indexOf(m[1]) + 1).padStart(2, "0")}.2026` : tag;
};

export const eventsPage = {
  hero: { src: "/images/home/band.jpg", alt: "Band posing at Farakchu" },
  title: "Farakchu Events",
  menu: [
    { label: "Home", href: "/", image: "/images/home/storefront-night.jpg" },
    { label: "Posters", href: "#posters", image: events[1].image.src },
    { label: "Guests", href: "#guests", image: guests[0].image.src },
    { label: "Nights", href: "#nights", image: events[0].image.src },
    { label: "Apparel", href: "/apparel", image: "/images/home/apparel-storefront.jpg" },
  ],
  statement: { before: "Farakchu turns nights into memories,", after: "crafting experiences under one diamond" },
  about:
    "Live sessions, watch parties, premieres and brackets that get loud. If the city is watching, it is watching here, under the diamond in Samakhusi. Farak Chu. I am different.",
  photos: [
    { src: "/images/home/domain-entertainment.jpg", alt: "Live night at Farakchu" },
    { src: "/images/home/crowd-watch.jpg", alt: "Crowd reacting during a watch party" },
  ],
  posters: events.map((e) => ({ title: e.title, image: e.image })),
  guests: guests.map((g) => ({ title: g.name, note: g.note, image: g.image })),
  nights: events.map((e) => ({ date: toDate(e.tag), title: e.title, desc: e.meta, image: e.image })),
  book: {
    title: "Got a night in mind?",
    body: "Private events, premieres, screenings and tournaments. Send a message and we will sort the room.",
  },
  dm: "https://ig.me/m/farakchu.entertaiment",
  instagram: "https://www.instagram.com/farakchu.entertaiment/",
  links: [
    { label: "Instagram", href: "https://www.instagram.com/farakchu.entertaiment/" },
    { label: "Apparel", href: "/apparel" },
    { label: "Gaming", href: "https://www.instagram.com/farakchu.gamezone/" },
    { label: "Cafe", href: "https://www.instagram.com/farakchu.cafe/" },
    { label: "Call", href: site.phoneHref },
  ],
  phone: site.phone,
  footerImage: { src: "/images/home/cafe-crowd.jpg", alt: "" },
};
