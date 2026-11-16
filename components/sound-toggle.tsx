"use client";

import { useSyncExternalStore } from "react";
import { sound } from "./sound-engine";

export function SoundToggle() {
  const on = useSyncExternalStore(sound.subscribe, () => sound.on, () => false);
  const toggle = () => sound.toggle();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? "Turn sound off" : "Turn sound on"}
      className="nav-sound flex min-h-11 w-fit items-center gap-3 justify-self-start rounded-[50%] border border-bone/50 bg-teal-deep/30 px-6 py-3 font-wide text-[0.625rem] leading-none text-bone backdrop-blur-sm transition-colors hover:bg-bone/15 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime"
    >
      <span aria-hidden className="flex h-3 items-end gap-[2px]">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={`h-full w-[2px] origin-bottom bg-current ${on ? "fc-eq" : "scale-y-[0.25]"}`}
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </span>
      <span>Sound {on ? "on" : "off"}</span>
    </button>
  );
}
