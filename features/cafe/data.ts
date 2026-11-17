// Menu transcribed from /public/pdfs/menu.pdf. Prices are as printed (no currency on the PDF; shown as Rs).
// Spellings follow the printed menu. TODO(client): confirm "Iced Macha", "Machha Frappe", "Oero", "Pooted Plant Matcha Latte".
export type MenuItem = { name: string; price: number; note?: string };
export type MenuGroup = { title: string; items: MenuItem[] };

const g = (title: string, rows: [string, number, string?][]): MenuGroup => ({
  title,
  items: rows.map(([name, price, note]) => ({ name, price, note })),
});

// Three columns, balanced by row count.
export const menuColumns: MenuGroup[][] = [
  [
    g("Hot Coffee", [
      ["Espresso", 150],
      ["Lungo", 170],
      ["Doppio", 170],
      ["Americano Single", 150],
      ["Americano Double", 170],
      ["Cappuccino / Latte", 230],
      ["Latte Macchiato", 230],
      ["Flavour Coffee", 300, "caramel, honey, chocolate"],
      ["Espresso Affogato", 230],
      ["Cappuccino D/S", 300],
    ]),
    g("Alternative", [
      ["Hot Chocolate", 250],
      ["Hot Lemon", 150],
      ["Hot Lemon with Honey", 180],
      ["Hot Lem with H & G", 200],
      ["Black Tea", 50],
      ["Green Tea", 150],
      ["Lemon Tea", 100],
      ["Lemon Iced Tea", 180],
    ]),
    g("Cold Drink", [
      ["Peach Iced Tea", 180],
      ["Coke / Sprite", 120],
      ["Lemonade", 200],
      ["Mint Lemonade", 250],
      ["Virgin Mojito", 250],
    ]),
  ],
  [
    g("Cold Coffee", [
      ["Iced Americano", 200],
      ["Iced Latte / Cappuccino", 250],
      ["Iced Macha", 300],
      ["Iced Caramel Macchiato", 300],
    ]),
    g("Frappe", [
      ["Machha Frappe", 350],
      ["Oreo Frappe", 350],
    ]),
    g("Milkshake", [
      ["Strawberry", 300],
      ["Ice Cream", 300],
      ["Oero", 300],
    ]),
    g("Smoothie", [
      ["Vanilla", 300],
      ["Strawberry", 300],
    ]),
    g("Matcha", [
      ["Matcha Latte", 250],
      ["Iced Matcha Latte", 270],
      ["Strawberry Matcha Latte", 300],
      ["Mango Matcha Latte", 300],
      ["Pooted Plant Matcha Latte", 300],
    ]),
  ],
  [
    g("Fresh Juice", [
      ["Watermelon", 280],
      ["Apple", 350],
      ["Orange", 280],
      ["Mixed", 400],
      ["Seasonal Juice", 300],
      ["ABC", 400],
    ]),
    g("Bakery (Croissant)", [
      ["Plain Croissant", 130],
      ["Chocolate", 150],
      ["Cheese", 150],
    ]),
    g("Cookies", [
      ["Almond Cookies", 60],
      ["Oats", 60],
      ["Chocolate", 60],
    ]),
    g("Cake", [
      ["Blueberry Cheese Cake", 270],
      ["Classic Cheese Cake", 280],
      ["Walnut Brownie", 200],
    ]),
    g("Lassi", [
      ["Plain", 150],
      ["Sweet", 150],
      ["Banana", 200],
    ]),
  ],
];

const img = (n: string) => `/images/cafe/${n}.jpg`;

export const cafePage = {
  // w: width in vw (desktop), lift: how far the card sits above the wordmark (vh), rot: resting tilt, front: overlaps the letters.
  heroCards: [
    { src: img("cold-brew-poster"), alt: "Cold brew, warm soul: poster of caramel cold brew being poured", name: "Cold brew", w: 13, lift: 9, rot: -6, front: false },
    { src: img("blue-mojito"), alt: "Blue mocktail with lime, mint and ice", name: "Virgin Mojito", price: 250, w: 17, lift: 4, rot: 4, front: true },
    // Centre card opens full-bleed on scroll: needs a high-res photo; px = source size, used to match the card crop exactly.
    // affogato-bar: the affogato outpainted to 16:9 (Codex image gen) with a wine glass + pint added at the edges,
    // outside the card's crop, so "and a bar, too" only shows on the reveal. keep = source px width that must stay on screen.
    { src: img("affogato-bar"), alt: "Espresso affogato on the Farakchu bar between a glass of red wine and a pint of lager", name: "Espresso Affogato", price: 230, w: 24, lift: 0, rot: 0, front: false, px: [1672, 941], keep: 1400 },
    { src: img("iced-caramel"), alt: "Iced caramel macchiato with a black straw", name: "Iced Caramel Macchiato", price: 300, w: 17, lift: 5, rot: -4, front: false },
    { src: img("iced-tea"), alt: "Iced tea with a lime wheel and mint", name: "Lemon Iced Tea", price: 180, w: 13, lift: 11, rot: 6, front: false },
  ] as { src: string; alt: string; name: string; price?: number; w: number; lift: number; rot: number; front: boolean; px?: [number, number]; keep?: number }[],
  // Pour sequence: 102 frames cut from a free Mixkit clip ("A barista preparing coffee with milk and ice", Mixkit Stock Video Free License).
  pour: { frames: 102, lines: ["Cold brew.", "Warm soul.", "Stay a while."] },
  headline: "A cafe. And a bar, too.",
  intro:
    "Espresso, strawberry matcha, cold beer and long tables. The room where everything else at Farakchu starts and ends. Come as you are.",
  menuIntro: "Coffee, matcha, juices and bakes. Pour something, stay a while.",
  menuImage: { src: img("affogato"), alt: "Espresso affogato in a coupe glass, topped with vanilla ice cream and mint" },
  pdf: "/pdfs/menu.pdf",
  banner: {
    src: "/images/home/cafe-crowd.jpg",
    alt: "Friends raising drinks at a packed Farakchu night",
    title: "Coffee by day. Pours by night.",
    kicker: "Espresso and matcha first. Then the neon comes on, the beer comes out and the big screen takes over.",
    body: "Farakchu is a cafe, a bar and a game zone under one diamond. Watch parties, live sessions and brackets all run through this room.",
  },
  // Hover a flavour, the photo swaps. TODO(client): no photos yet for Mango and Pooted Plant (stand-ins used).
  matcha: {
    title: "Matcha, five ways.",
    body: "Hot, iced, strawberry, mango or the Pooted Plant. Ceremonial-green, cold and creamy, and a reason to stay for one more.",
    list: [
      { name: "Matcha Latte", image: { src: img("matcha-latte"), alt: "Matcha latte in a white cup at the Farakchu bar" } },
      { name: "Iced Matcha Latte", image: { src: img("iced-matcha"), alt: "Iced matcha latte on a felt coaster" } },
      { name: "Strawberry Matcha Latte", image: { src: img("strawberry-matcha"), alt: "Strawberry matcha held up to the camera" } },
      { name: "Mango Matcha Latte", image: { src: img("iced-matcha"), alt: "Iced matcha latte on a felt coaster" } },
      { name: "Pooted Plant Matcha Latte", image: { src: img("farak-swad-poster"), alt: "Farak Swad poster: the green Farakchu cup on a mossy rock" } },
    ],
  },
  pours: [
    { name: "Iced Caramel Macchiato", price: 300, image: { src: img("iced-caramel"), alt: "Iced caramel macchiato with a black straw" } },
    { name: "Espresso Affogato", price: 230, image: { src: img("affogato"), alt: "Espresso affogato in a coupe glass" } },
    { name: "Iced Tea", price: 180, image: { src: img("iced-tea"), alt: "Iced tea with a lime wheel and mint" } },
    { name: "Virgin Mojito", price: 250, image: { src: img("blue-mojito"), alt: "Blue mocktail with lime, mint and ice" } },
  ],
  feed: {
    title: "Fresh on the feed",
    body: "New pours, small events and the odd poster, first on @farakchu.cafe.",
    posts: [
      { src: img("cold-brew-poster"), alt: "Cold brew, warm soul: poster of caramel cold brew being poured" },
      { src: img("farak-swad-poster"), alt: "Farak Swad. Farak Chu. Poster with the green Farakchu cup" },
    ],
  },
  instagram: "https://www.instagram.com/farakchu.cafe/",
};
