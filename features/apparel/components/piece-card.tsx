import Image from "next/image";
import Link from "next/link";
import { price, type Piece } from "@/features/apparel/data";

// Browse card used on the homepage and the product page: hover swaps to the second shot, links to the product.
export function PieceCard({ piece: p, sizes = "(min-width:1024px) 26vw, 46vw" }: { piece: Piece; sizes?: string }) {
  return (
    <Link href={`/apparel/${p.id}`} aria-label={`${p.name}, ${p.colourway}. View product`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden" style={{ background: p.hex }}>
        <Image src={p.views[0].src} alt={p.views[0].alt} fill sizes={sizes} className="object-cover transition-opacity duration-700 group-hover:opacity-0" />
        <Image src={p.views[1].src} alt="" fill sizes={sizes} className="object-cover opacity-0 transition-[opacity,transform] duration-700 group-hover:scale-105 group-hover:opacity-100" />
        <span className="absolute right-3 top-3 font-wide text-3xl leading-none text-bone mix-blend-difference">{String(p.chapter).padStart(2, "0")}</span>
        {p.tag && <span className="absolute left-3 top-3 rounded-full bg-lime px-3 py-1.5 font-wide text-[0.55rem] leading-none text-ink">{p.tag}</span>}
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-3">
        <h3 className="font-wide text-sm leading-tight text-teal">{p.name}</h3>
        <span className="font-mono text-[0.65rem] uppercase text-ink/60">{price(p)}</span>
      </div>
      <p className="mt-1 flex items-center gap-2 font-mono text-[0.65rem] uppercase text-ink/70">
        <span className="inline-block size-2.5 rounded-full" style={{ background: p.hex }} />
        {p.colourway}
      </p>
    </Link>
  );
}
