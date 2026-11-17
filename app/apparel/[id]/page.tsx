import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pieces } from "@/features/apparel/data";
import { ProductPage } from "@/features/apparel/components/product-page";

export const generateStaticParams = () => pieces.map((p) => ({ id: p.id }));

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const piece = pieces.find((p) => p.id === id);
  return piece ? { title: `${piece.name} — Farakchu Apparel`, description: piece.desc } : {};
}

export default async function ProductRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const piece = pieces.find((p) => p.id === id);
  if (!piece) notFound();
  return <ProductPage piece={piece} />;
}
