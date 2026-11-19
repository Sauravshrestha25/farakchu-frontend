import { readdirSync } from "node:fs";
import { PageTheme } from "@/components/page-theme";
import { join } from "node:path";
import { Nav } from "@/components/nav";
import { Preloader } from "@/components/preloader";
import { Reveals } from "@/components/reveals";
import { HeroStack } from "@/components/home/hero-stack";
// import { WhatsOn } from "@/components/home/whats-on";
import { Guests } from "@/components/home/guests";
import { ApparelDrop } from "@/components/home/apparel-drop";
import { Cafe } from "@/components/home/cafe";
import { Footer } from "@/components/home/footer";
import { Believe } from "@/components/home/believe";

export default function Home() {
  // The "What we believe" gallery uses every photo in public/images/people2; drop more in and they join automatically.
  const featured = readdirSync(join(process.cwd(), "public/images/people2"))
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
    .sort()
    .map((f) => `/images/people2/${f}`);

  return (
    <div className="theme-mono">
      <PageTheme name="mono" />
      <Preloader />
      <Nav />
        <main>
          <HeroStack />
          <Believe featured={featured} />
          {/* <WhatsOn /> */}
          <Guests />
          <ApparelDrop />
          <Cafe />
        </main>
        <Footer />
        <Reveals />
    </div>
  );
}
