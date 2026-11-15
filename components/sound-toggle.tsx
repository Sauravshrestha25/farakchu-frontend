"use client";

import { useEffect, useRef, useState } from "react";

// Original ambient loop, synthesised live with Web Audio: no samples or recordings, so there is nothing to license.
// Am9 - Fmaj7 - Cmaj7 - G6, one chord per 8s bar, soft pad + bass + sparse pentatonic plucks through a feedback delay.
const CHORDS = [
  [57, 60, 64, 67, 71],
  [53, 57, 60, 64, 67],
  [48, 55, 60, 64, 67],
  [55, 59, 62, 64, 69],
];
const PLUCKS = [69, 72, 74, 76, 79, 81];
const BAR = 8;
const hz = (m: number) => 440 * 2 ** ((m - 69) / 12);

function createEngine() {
  const ctx = new AudioContext();
  const master = ctx.createGain();
  master.gain.value = 0;
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 1100;
  const bus = ctx.createGain();
  const delay = ctx.createDelay(1);
  delay.delayTime.value = 0.45;
  const feedback = ctx.createGain();
  feedback.gain.value = 0.38;
  const wet = ctx.createGain();
  wet.gain.value = 0.35;
  bus.connect(lp).connect(master).connect(ctx.destination);
  bus.connect(delay);
  delay.connect(feedback).connect(delay);
  delay.connect(wet).connect(master);

  const tone = (type: OscillatorType, freq: number, t: number, attack: number, len: number, peak: number, detune = 0) => {
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.value = freq;
    o.detune.value = detune;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(peak, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    o.connect(g).connect(bus);
    o.start(t);
    o.stop(t + len + 0.1);
  };

  let bar = 0;
  let nextBar = ctx.currentTime + 0.1;
  const schedule = () => {
    while (nextBar < ctx.currentTime + 2) {
      const chord = CHORDS[bar % CHORDS.length];
      chord.forEach((n) => [-7, 7].forEach((d) => tone("triangle", hz(n), nextBar, BAR * 0.35, BAR + 1.5, 0.03, d)));
      tone("sine", hz(chord[0] - 12), nextBar, 0.4, BAR, 0.08);
      for (let k = 0; k < BAR; k++)
        if (Math.random() < 0.55) tone("sine", hz(PLUCKS[Math.floor(Math.random() * PLUCKS.length)]), nextBar + k + Math.random() * 0.25, 0.01, 2.4, 0.07);
      nextBar += BAR;
      bar++;
    }
  };
  let timer = 0;

  return {
    start() {
      ctx.resume();
      schedule();
      timer = window.setInterval(schedule, 500);
      master.gain.setTargetAtTime(0.8, ctx.currentTime, 0.8);
    },
    stop() {
      master.gain.setTargetAtTime(0, ctx.currentTime, 0.3);
      window.setTimeout(() => {
        clearInterval(timer);
        ctx.suspend();
        // Drop already-scheduled notes so resuming starts clean.
        nextBar = ctx.currentTime + 0.1;
      }, 1500);
    },
    dispose() {
      clearInterval(timer);
      ctx.close();
    },
  };
}

export function SoundToggle() {
  const engine = useRef<ReturnType<typeof createEngine> | null>(null);
  const [on, setOn] = useState(false);

  useEffect(() => () => engine.current?.dispose(), []);

  const toggle = () => {
    // Created on first click: browsers block audio until a user gesture.
    engine.current ??= createEngine();
    if (on) engine.current.stop();
    else engine.current.start();
    setOn(!on);
  };

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
