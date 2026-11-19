import { Nav } from "@/components/nav";
import { Preloader } from "@/components/preloader";
import { Footer } from "@/components/second/footer";
import { Hero, IndexStrip, Columns } from "@/components/third/third";

// Concept: Il Capo intro wordmark → Obys index strip with a diamond lens → ViV drifting domain columns.
export default function Third() {
  return (
    <>
      <Preloader />
      <Nav />
        <main>
          <Hero />
          <IndexStrip />
          <Columns />
        </main>
        <Footer />
    </>
  );
}
