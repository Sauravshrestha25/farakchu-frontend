import type { Piece } from "@/features/apparel/data";

export type Order = {
  customer: { name: string; phone: string; email: string; address: string; note: string };
  method: "delivery" | "pickup";
  items: { pieceId: string; name: string; colourway: string; size: string; qty: number }[];
};

export const toItems = (lines: { piece: Piece; size: string; qty: number }[]): Order["items"] =>
  lines.map((l) => ({ pieceId: l.piece.id, name: l.piece.name, colourway: l.piece.colourway, size: l.size, qty: l.qty }));

// TODO(backend): confirm endpoint + payload shape. Until NEXT_PUBLIC_API_URL is set this rejects, and the UI says ordering isn't live.
export async function placeOrder(order: Order): Promise<void> {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) throw new Error("Online ordering isn't live yet.");
  const res = await fetch(`${base}/orders`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(order) });
  if (!res.ok) throw new Error("Couldn't place the order. Try again.");
}
