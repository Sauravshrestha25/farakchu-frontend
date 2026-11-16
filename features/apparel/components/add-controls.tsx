"use client";

import { useState } from "react";
import { sizes, type Piece } from "@/features/apparel/data";
import { useBag } from "./bag";

// Size chips + add button. No size picked: the row shakes instead of guessing for the customer.
export function AddControls({ piece, tone = "light" }: { piece: Piece; tone?: "light" | "ink" }) {
  const { add } = useBag();
  const [size, setSize] = useState("");
  const [shake, setShake] = useState(0);
  const [added, setAdded] = useState(0);

  const chip = tone === "light" ? "border-bone/50 text-bone hover:border-lime hover:text-lime" : "border-ink/40 text-ink hover:border-teal hover:text-teal";
  const on = tone === "light" ? "!border-lime !bg-lime !text-ink" : "!border-teal !bg-teal !text-lime";

  return (
    <div>
      <div key={shake} className={`flex gap-2 ${shake ? "ap-shake" : ""}`} role="radiogroup" aria-label="Size">
        {sizes.map((s) => (
          <button key={s} type="button" role="radio" aria-checked={size === s} onClick={() => setSize(s)} className={`grid size-12 place-items-center rounded-full border font-wide text-[0.7rem] leading-none transition-colors ${chip} ${size === s ? on : ""}`}>
            {s}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => {
          if (!size) return setShake((n) => n + 1);
          add(piece, size);
          setAdded((n) => n + 1);
        }}
        className={`mt-4 inline-flex min-h-12 items-center justify-center rounded-[50%] px-9 py-3 font-wide text-[0.625rem] leading-none transition-colors ${tone === "light" ? "bg-lime text-ink hover:bg-bone" : "bg-teal text-lime hover:bg-lime hover:text-ink"}`}
      >
        {size ? (added ? "Added. Add another" : "Add to bag") : "Pick a size"}
      </button>
    </div>
  );
}
