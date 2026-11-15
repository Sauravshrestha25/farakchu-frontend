import { apparelDrop, site } from "@/content/site";

export const apparelPage = {
  eyebrow: "Farakchu apparel / chapter 03",
  title: ["Wear the", "difference."],
  intro:
    "Clothes for the people who make a place feel like theirs. Small runs, familiar symbols, and a little Farakchu wherever you go.",
  story: {
    label: "The point",
    heading: "A piece of the place, outside the place.",
    body: "Farakchu is coffee, music, games, late tables, and the people who keep showing up. The apparel carries that feeling beyond Samakhusi, one small run at a time.",
    image: "/images/apparel/ch02-grey.jpg",
    alt: "Grey Farakchu hoodie, front and back",
  },
  manifesto: [
    {
      title: ["Small but", "mighty."],
      kicker: "The drop",
      body: "A few pieces, a familiar mark, and enough room for you to make it yours.",
      image: "/images/apparel/ch01-navy.jpg",
      alt: "Navy Farakchu diamond hoodie",
      pos: "center 35%",
    },
    {
      title: ["Wear the", "difference."],
      kicker: "The place",
      body: "Farakchu starts in Samakhusi, but the feeling is made to leave with you.",
      image: "/images/apparel/ch02-grey-alt.jpg",
      alt: "Close up of the Farakchu graffiti print on a grey hoodie",
      pos: "center 45%",
    },
    {
      title: ["Made for", "the room."],
      kicker: "The people",
      body: "Coffee, music, games, late tables. Clothes for the people who keep showing up.",
      image: "/images/apparel/ch03-light-alt.jpg",
      alt: "Model in a grey Farakchu hoodie with the hood up",
      pos: "center 35%",
    },
    {
      title: ["Come as", "you are."],
      kicker: "The point",
      body: "Different is not a distance between us. It is what brings us together.",
      image: "/images/apparel/ch03-grey-alt.jpg",
      alt: "Charcoal Farakchu diamond hoodie styled with jeans",
      pos: "center 38%",
    },
  ],
  principles: [
    { title: "Small runs", body: "Made in limited chapters, so each drop stays close to the people who found it." },
    { title: "Built to live in", body: "Soft brushed fleece, familiar graphics, and pieces made for actual days out." },
    { title: "Made in Kathmandu", body: "Rooted in Samakhusi, shaped by the room, and worn wherever the day goes." },
  ],
  cta: {
    heading: "Find your chapter.",
    body: "See something you want? Send a DM and we’ll sort the size, colour, and pickup details.",
    href: apparelDrop.dm,
  },
  contact: site.instagram,
};

