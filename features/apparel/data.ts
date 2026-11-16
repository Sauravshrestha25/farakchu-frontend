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


// ---- Shop ----------------------------------------------------------------
// No prices supplied by the client: pieces show "DM for price". Sizes are the standard run; availability is confirmed in DM.
// TODO(client): real prices, sizes in stock, colourways per piece.
const ap = (n: string) => `/images/apparel/${n}.jpg`;

export type Piece = {
  id: string;
  name: string;
  chapter: 1 | 2 | 3;
  colourway: string;
  hex: string; // scene colour
  tag: string;
  desc: string;
  views: { src: string; alt: string; label: string }[];
};

export const sizes = ["S", "M", "L", "XL"];

export const pieces: Piece[] = [
  {
    id: "diamond",
    name: "Diamond Hoodie",
    chapter: 1,
    colourway: "Navy",
    hex: "#1b2b57",
    tag: "Limited",
    desc: "The diamond on the chest, the graffiti mark on the back. Chapter 01, the one that started it.",
    views: [
      { src: ap("ch01-navy"), alt: "Model in the navy Farakchu diamond hoodie, front", label: "Front" },
      { src: ap("ch01-navy-alt"), alt: "Navy Farakchu hoodie from behind with the graffiti print", label: "Back" },
    ],
  },
  {
    id: "graffiti",
    name: "Graffiti Hoodie",
    chapter: 2,
    colourway: "Dark Grey",
    hex: "#4a4c58",
    tag: "New",
    desc: "The hand-drawn Farak Chu mark, loud across the chest, in dark grey.",
    views: [
      { src: ap("ch03-light-alt"), alt: "Model in the dark grey Farakchu graffiti hoodie, hood up", label: "On body" },
      { src: ap("ch02-grey-alt"), alt: "Close up of the graffiti print on a grey Farakchu hoodie", label: "Print" },
    ],
  },
  {
    id: "script",
    name: "Script Hoodie",
    chapter: 2,
    colourway: "Grey",
    hex: "#6b6c76",
    tag: "",
    desc: "Looped script on the front, the graffiti mark on the back. Grey that goes with everything.",
    views: [
      { src: ap("ch02-grey"), alt: "Model in the grey Farakchu script hoodie, front", label: "Front" },
      { src: ap("ch03-light"), alt: "Grey Farakchu hoodie from behind with the graffiti print", label: "Back" },
    ],
  },
  {
    id: "signature",
    name: "Signature Hoodie",
    chapter: 3,
    colourway: "Grey / Charcoal",
    hex: "#2b2e3b",
    tag: "",
    desc: "Two colourways, one hoodie: the diamond in charcoal, the graffiti mark in grey.",
    views: [
      { src: ap("ch03-grey-alt"), alt: "Model in the charcoal Farakchu diamond hoodie with jeans", label: "Charcoal" },
      { src: ap("ch03-grey"), alt: "Model in the grey Farakchu graffiti hoodie, hood up", label: "Grey" },
    ],
  },
];

export const steps = [
  { n: "01", title: "Pick your piece", body: "Choose a hoodie and a size. Add as many as you like to the bag." },
  { n: "02", title: "Copy your order", body: "The bag writes the message for you. One tap copies it and opens the DM." },
  { n: "03", title: "Send it to us", body: "Paste it into @farakchu.apparel. We confirm size, colour, price and pickup." },
];
