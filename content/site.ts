// Data shared across pages (site info, divisions, events, guests, apparel, cafe, visit).
// Copy that belongs to one section lives in that section's component, not here.
// Photos: client's own posts from @farakchu, curated into /public/images/home.
// TODO(client): anything marked TODO needs real info from Farakchu.

const img = (name: string) => `/images/home/${name}.jpg`;

export const site = {
  name: "Farakchu",
  tagline: "Farak Chu. I am different.",
  devanagari: "फरक छु",
  instagram: "https://www.instagram.com/farakchu/",
  // ponytail: Instagram DM until a WhatsApp number is supplied. Swap to `https://wa.me/977XXXXXXXXXX`.
  contactHref: "https://ig.me/m/farakchu",
  address: {
    line1: "Samakhusi",
    line2: "Kathmandu, Nepal 44600",
    mapQuery: "Farakchu Samakhusi Kathmandu",
  },
  hours: "TODO(client): opening hours",
  phone: "976 878 6818", // from @farakchu event posts
  phoneHref: "tel:+9779768786818",
  email: "hello@farakchu.com", // TODO(client): placeholder, confirm the real inbox
  emailHref: "mailto:hello@farakchu.com",
  hero: { src: img("storefront-night"), alt: "Farakchu storefront in Samakhusi at night, neon diamond sign lit" },
  visit: { src: img("sign-night"), alt: "The Farakchu neon sign at night" },
};

type Photo = { src: string; alt: string };

export type Division = {
  id: string;
  no: string;
  name: string;
  short: string;
  handle: string;
  href: string;
  logo: string;
  line: string;
  body: string;
  tags: string[];
  image: Photo;
  inset: Photo;
};

export const divisions: Division[] = [
  {
    id: "entertainment",
    no: "01",
    name: "Entertainment",
    short: "Live + watch",
    handle: "@farakchu.entertaiment",
    href: "https://www.instagram.com/farakchu.entertaiment/",
    logo: "/images/logo/logo-entertainment.jpg",
    line: "Nights people talk about the morning after.",
    body: "Live sessions, watch parties, premieres and the kind of crowd that makes a big fight feel bigger. From Road to UFC to the World Cup, if the city's watching, it's watching here.",
    tags: ["Live music", "Watch parties", "Private events"],
    image: { src: img("domain-entertainment"), alt: "Guitarist playing a double-neck guitar under red stage light at Farakchu" },
    inset: { src: img("crowd-watch"), alt: "Crowd reacting during a watch party" },
  },
  {
    id: "gamingzone",
    no: "02",
    name: "Gaming Zone",
    short: "Play + compete",
    handle: "@farakchu.gamezone",
    href: "https://www.instagram.com/farakchu.gamezone/",
    logo: "/images/logo/logo-gamezone.jpg",
    line: "“Ek game matrai” turns into three hours.",
    body: "PS5s, big screens and brackets that get loud. We run knockouts like the FC 26 tournament: 48 players, no second chances, one champion.",
    tags: ["PS5", "Tournaments", "Squad nights"],
    image: { src: img("domain-gaming"), alt: "Two players on a sofa in the neon-lit Farakchu gaming room, football on the big screen" },
    inset: { src: img("gaming-player"), alt: "Player mid-celebration with a controller" },
  },
  {
    id: "apparel",
    no: "03",
    name: "Apparel",
    short: "Wear + rep",
    handle: "@farakchu.apparel",
    href: "https://www.instagram.com/farakchu.apparel/",
    logo: "/images/logo/logo-apparel.jpg",
    line: "Wear the difference.",
    body: "Limited drops, printed in small runs and gone when they're gone. Including the official Nepal merch we made to back Rabindra Dhant on his Road to UFC.",
    tags: ["Limited drops", "Merch", "Collabs"],
    image: { src: img("domain-apparel"), alt: "Two models in grey Farakchu hoodies with the graffiti and script prints" },
    inset: { src: img("apparel-kid"), alt: "Kid in a Farakchu graphic tee at the bar" },
  },
  {
    id: "cafe",
    no: "04",
    name: "Cafe",
    short: "Pour + stay",
    handle: "@farakchu.cafe",
    href: "https://www.instagram.com/farakchu.cafe/",
    logo: "/images/logo/logo-cafe.jpg",
    line: "Good coffee is an art. Sharing it is a lifestyle.",
    body: "Espresso, strawberry matcha, cold beer and long tables. The room where everything else at Farakchu starts and ends.",
    tags: ["Coffee", "Matcha", "Beer"],
    image: { src: img("domain-cafe"), alt: "Guest with a blue cocktail at the Farakchu bar, brick wall and diamond sign behind" },
    inset: { src: img("cafe-matcha"), alt: "Strawberry matcha held up to the camera" },
  },
];

// Inline photos that sit inside the intro sentence.
export const introPhotos = {
  nights: { src: img("live-singer"), alt: "" },
  brackets: { src: img("gaming-winners"), alt: "" },
  threads: { src: img("apparel-merch"), alt: "" },
  coffee: { src: img("cafe-matcha"), alt: "" },
};

// From recent @farakchu posts.
export const lately: { title: string; meta: string; division: string; image: Photo }[] = [
  { title: "FC 26 Knockout", meta: "48 players. One champion.", division: "Gaming", image: { src: img("gaming-winners"), alt: "FC 26 tournament winners with trophy" } },
  { title: "Road to UFC", meta: "Watch party for Rabindra Dhant", division: "Entertainment", image: { src: img("bar-ufc"), alt: "UFC on the big screen at the bar" } },
  { title: "World Cup Nights", meta: "Reservation-only screenings", division: "Entertainment", image: { src: img("crowd-watch"), alt: "Crowd watching football" } },
  { title: "Live Sessions", meta: "Acoustic under the diamond", division: "Entertainment", image: { src: img("acoustic"), alt: "Acoustic duo performing at Farakchu" } },
  { title: "One Year of Farakchu", meta: "Shree 3 on the anniversary", division: "Entertainment", image: { src: img("band"), alt: "Band posing at Farakchu" } },
  { title: "Nepal Merch Drop", meta: "Limited stock", division: "Apparel", image: { src: img("apparel-merch"), alt: "Official Nepal merch tees" } },
];

// Recent nights, from @farakchu posts (dates as posted). Shown as "recently", not as upcoming.
const ev = (name: string) => `/images/events/${name}.jpg`;
export const events: { title: string; meta: string; tag: string; image: Photo }[] = [
  { title: "FC 26 Knockout", meta: "48 players, one crown. Doors 8:45 AM sharp.", tag: "Bracket", image: { src: ev("fc26-knockout"), alt: "FC 26 Knockout tournament bracket poster" } },
  { title: "Road to UFC", meta: "Dhant vs Murdoch watch party. Rs 1000 with a Tuborg.", tag: "Aug 28", image: { src: ev("road-to-ufc"), alt: "Road to UFC semi-final watch party poster" } },
  { title: "France vs Spain", meta: "World Cup on the big screen. Tables only.", tag: "Jul 15", image: { src: ev("france-spain"), alt: "France vs Spain watch party poster" } },
  { title: "Argentina vs England", meta: "12:45 AM kick-off. Reservation only.", tag: "Jul 16", image: { src: ev("argentina-england"), alt: "Argentina vs England watch party poster" } },
  { title: "Argentina vs Switzerland", meta: "Early-morning football hits different.", tag: "Jul 12", image: { src: ev("argentina-switzerland"), alt: "Argentina vs Switzerland watch party poster" } },
  { title: "Nepal Premier League", meta: "Cricket, cold drinks, match-day noise.", tag: "Live", image: { src: ev("npl-live"), alt: "Nepal Premier League live screening poster" } },
  { title: "Nepal Merch Drop", meta: "Back Rabindra Dhant. Limited stock.", tag: "Drop", image: { src: ev("nepal-merch"), alt: "Official Nepal merch drop poster" } },
];

// "Who's been through": names and moments as tagged in @farakchu posts.
const gi = (n: string) => `/images/guests/${n}.jpg`;
export const guests: { name: string; note: string; href: string; image: Photo }[] = [
  { name: "Shree 3", note: "Hung out at the cafe. Destroyed Voltage Valley.", href: "https://www.instagram.com/shree3band/", image: { src: gi("shree3"), alt: "Shree 3 outside Farakchu" } },
  { name: "Chumbak", note: "Premiered “Nepali Vyapari” here.", href: "https://www.instagram.com/chum_bak/", image: { src: gi("chumbak"), alt: "Chumbak band under the Farakchu sign" } },
  { name: "Rabindra Dhant", note: "Road to UFC. Bajhang Ko Bagh.", href: "https://www.instagram.com/rabindra_dhant1/", image: { src: gi("rabindra-dhant"), alt: "Rabindra Dhant at Farakchu" } },
  { name: "Sarad Shrestha", note: "One and only living legend.", href: "https://www.instagram.com/sarad_shrestha_/", image: { src: gi("sarad-shrestha"), alt: "Sarad Shrestha on stage with a double-neck guitar" } },
  { name: "Saurab Bhattarai", note: "Lights low, sound loud.", href: "https://www.instagram.com/farakchu.entertaiment/", image: { src: gi("saurab-bhattarai"), alt: "Saurab Bhattarai on stage at a Farakchu show" } },
  { name: "Rachana Dahal", note: "Sang “Aagya” with us.", href: "https://www.instagram.com/rachana_dahal/", image: { src: gi("rachana-dahal"), alt: "Rachana Dahal singing in the Farakchu cafe" } },
  { name: "Santosh Sen", note: "Film director. Repped the Dhant tee.", href: "https://www.instagram.com/santoshsenofficial/", image: { src: gi("santosh-sen"), alt: "Santosh Sen outside Farakchu" } },
];

// Apparel lookbook. Names from @farakchu.apparel captions.
const ap = (n: string) => `/images/apparel/${n}.jpg`;
export const apparelDrop = {
  dm: "https://ig.me/m/farakchu.apparel",
  merch: "https://www.locknrollshop.com", // official Nepal merch, per @farakchu.cafe post
  items: [
    { name: "Diamond Hoodie", chapter: "Chapter 01 · Navy", tag: "Limited", image: ap("ch01-navy"), alt: ap("ch01-navy-alt"), desc: "Navy Farakchu diamond hoodie, front and back" },
    { name: "Graffiti Hoodie", chapter: "Chapter 02 · Dark Grey", tag: "New", image: ap("ch03-light-alt"), alt: ap("ch02-grey-alt"), desc: "Dark grey Farakchu graffiti hoodie" },
    { name: "Script Hoodie", chapter: "Chapter 02 · Grey", tag: "", image: ap("ch02-grey"), alt: ap("ch03-light"), desc: "Grey Farakchu script hoodie, front and back" },
    { name: "Signature Hoodie", chapter: "Chapter 03 · Grey / Charcoal", tag: "", image: ap("ch03-grey"), alt: ap("ch03-grey-alt"), desc: "Farakchu signature hoodie in two colourways" },
  ],
};

// Cafe section. Items named after what @farakchu.cafe posts about; no prices (menu TBC with client).
const cf = (n: string) => `/images/cafe/${n}.jpg`;
export const cafe = {
  // Receipt lines. Thumbs pop up on hover. "price" is a joke column, not real pricing.
  items: [
    { name: "Blue mojito", price: "✓", image: { src: cf("blue-mojito"), alt: "Blue mojito with ice, lime and mint" } },
    { name: "Iced caramel", price: "✓", image: { src: cf("iced-caramel"), alt: "Iced caramel coffee with a black straw" } },
    { name: "Iced matcha", price: "✓", image: { src: cf("iced-matcha"), alt: "Iced matcha latte on a felt coaster" } },
    { name: "Iced tea", price: "✓", image: { src: cf("iced-tea"), alt: "Iced tea topped with foam and a lime wheel" } },
    { name: "Affogato", price: "✓", image: { src: cf("affogato"), alt: "Affogato in a coupe glass on the Farakchu bar" } },
  ],
};

export const visit = {
  lines: ["Samakhusi Chowk", "Opposite City Square Mall", "Kathmandu, Nepal 44600"],
  directions: "https://www.google.com/maps/search/?api=1&query=Farak+Chu+Samakhusi+Kathmandu",
  map: "https://www.google.com/maps?q=Farak+Chu+Samakhusi+Kathmandu&z=16&output=embed",
  image: { src: img("storefront-night"), alt: "Farakchu storefront at night" },
};

export const gallery: Photo[] = [
  "storefront-day",
  "gaming-neon",
  "acoustic",
  "cafe-matcha",
  "crowd-watch",
  "band",
  "brick-wall",
  "gaming-player",
  "apparel-kid",
  "live-singer",
].map((n) => ({ src: img(n), alt: "" }));
