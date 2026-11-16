import { divisions, events, site } from "@/content/site";

// Copy for the two division pages, kept in code like the home page. Entertainment = live nights + watch parties. Gaming = the PS5 zone.
const ent = divisions[0];
const game = divisions[1];
const p = (name: string, alt: string) => ({ src: `/images/home/${name}.jpg`, alt });

type Card = {
  name: string;
  kind: string;
  body: string;
  cta: string;
  href: string;
  tags: string[];
  img: { src: string; alt: string };
  poster?: boolean;
  panel: string;
  chip: string;
};
const L = { panel: "bg-lime text-ink", chip: "bg-ink/10" };
const B = { panel: "bg-bone text-ink", chip: "bg-ink/10" };
const I = { panel: "bg-ink text-bone", chip: "bg-bone/15" };

export type DivisionPage = {
  hero: { src: string; alt: string };
  sub: [string, string]; // plain + highlighted
  blurb: string;
  statement: [string, string, string]; // before, highlighted, after
  words: { t: string; hl?: boolean }[][];
  nights: [string, string];
  cards: Card[];
  offers: { title: string; line: string; tag: string; img: { src: string; alt: string }; cls: string }[];
  stats: { pre?: string; to: number; post?: string; label: string; bar: number }[];
  footerPhotos: { src: string; alt: string }[];
  cta: [string, string];
  ctaBody: string;
  handle: { label: string; href: string };
};

export const pages: Record<"gaming", DivisionPage> = {
  gaming: {
    hero: game.image,
    sub: ["The Gaming Zone", "& brackets."],
    blurb: "PS5s, big screens and knockouts that get loud. Ek game matrai, three hours later.",
    statement: ["Walk in with friends. ", "PS5 tournaments", " that get loud and squad nights that never end on time."],
    words: [
      [{ t: "PS5", hl: true }, { t: "FC 26" }, { t: "Brackets", hl: true }],
      [{ t: "Tournaments" }, { t: "Squad nights", hl: true }, { t: "Big screens" }],
      [{ t: "Ek game matrai", hl: true }, { t: "Champions" }, { t: "Walk-ins", hl: true }],
    ],
    nights: ["Games we've ", "played."],
    cards: [
      { name: "FC 26 Knockout", kind: "Tournament", body: "48 players, no second chances, one champion. The bracket that had the whole zone screaming.", cta: "Join the next one", href: game.href, tags: ["PS5", "Bracket", "48 players", "Prizes"], img: events[0].image, poster: true, ...L },
      { name: "Squad Nights", kind: "Play", body: "“Ek game matrai” turns into three hours. Big screens, loud friends, zero mercy.", cta: "Book the zone", href: site.contactHref, tags: ["PS5", "Big screens", "Walk-ins"], img: p("gaming-player", "Player mid-celebration with a controller"), ...B },
      { name: "Winners' Circle", kind: "Tournament", body: "Trophies, screams and a very proud champion. Win here and the whole room knows.", cta: "Enter the next bracket", href: game.href, tags: ["Tournaments", "Trophies", "FC 26"], img: p("gaming-winners", "FC 26 tournament winners with trophy"), ...I },
      { name: "Neon Room", kind: "Play", body: "Screens everywhere, football on every one. The room where the squad settles it.", cta: "Pull up", href: game.href, tags: ["Screens", "Football", "Squad"], img: p("gaming-neon", "Neon-lit gaming room with screens showing football"), ...L },
    ],
    offers: [
      { title: "PS5 stations", line: "Controllers charged, screens huge, seats comfy. Just pick a game.", tag: "Play", img: { src: "/images/ig/gamezone/09.jpg", alt: "Football match on a big screen with a PS5 controller in the foreground" }, cls: "lg:col-span-2 lg:row-span-2" },
      { title: "Big screens", line: "Every match, every angle.", tag: "Watch", img: { src: "/images/ig/gamezone/12.jpg", alt: "Players watching a football match on a screen" }, cls: "" },
      { title: "Squad nights", line: "Come as five, leave as legends.", tag: "Together", img: { src: "/images/ig/gamezone/15.jpg", alt: "Friends laughing together in the Farakchu gaming zone" }, cls: "lg:row-span-2" },
      { title: "Neon room", line: "Red light, loud laughs.", tag: "Vibe", img: { src: "/images/ig/gamezone/16.jpg", alt: "Red neon gaming room with screens and players" }, cls: "" },
      { title: "FC 26 tournaments", line: "48 players. One crown.", tag: "Compete", img: { src: "/images/ig/gamezone/07.jpg", alt: "FC 26 Knockout Tournament poster" }, cls: "lg:row-span-2" },
      { title: "Prizes", line: "Win cash, win trophies, win bragging rights.", tag: "Win", img: { src: "/images/ig/gamezone/01.jpg", alt: "Friends holding prize cash in front of the Farakchu sign" }, cls: "lg:col-span-2" },
      { title: "Walk-ins welcome", line: "No booking, no stress. Just play.", tag: "Anytime", img: { src: "/images/ig/gamezone/17.jpg", alt: "Girl smiling with a PS5 controller" }, cls: "lg:row-span-2" },
      { title: "Games and drinks", line: "Matcha, coffee or cold beer between rounds.", tag: "Chill", img: { src: "/images/ig/gamezone/19.jpg", alt: "Friends gaming with drinks under the Farakchu sign" }, cls: "lg:col-span-2" },
    ],
    stats: [
      { to: 48, label: "Players in every knockout bracket", bar: 100 },
      { pre: "Rs ", to: 33, post: "K", label: "First prize, plus the trophy", bar: 82 },
      { to: 3, post: " hrs", label: "From “ek game matrai” to closing time", bar: 60 },
      { pre: "Rs ", to: 900, label: "Entry fee. Everyone gets a shot", bar: 35 },
    ],
    footerPhotos: [{ src: "/images/ig/gamezone/17.jpg", alt: "Girl smiling with a PS5 controller" }, { src: "/images/ig/gamezone/08.jpg", alt: "Player celebrating a goal" }, { src: "/images/ig/gamezone/16.jpg", alt: "Red neon gaming room" }, { src: "/images/ig/gamezone/01.jpg", alt: "Friends in front of the Farakchu sign" }],
    cta: ["Ready, ", "player one?"],
    ctaBody: "Book a bracket, a squad night or the whole zone. Tell us the plan, we'll bring the controllers.",
    handle: { label: game.handle.replace(/^@/, ""), href: game.href },
  },
};
