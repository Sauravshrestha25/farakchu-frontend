// Site soundtrack: /public/music/shree3.mp3, looped. One shared player so the "Enter site" gate and the nav toggle control the same sound.
// TODO(client): confirm the band has cleared the track for the website.
const SRC = "/music/shree3.mp3";
const VOLUME = 0.7;

let audio: HTMLAudioElement | null = null;
let isOn = false;
let fadeId = 0;
const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());

// Linear volume ramp, so on/off never pops.
function fadeTo(v: number, ms: number, done?: () => void) {
  if (!audio) return;
  const a = audio;
  const from = a.volume;
  const t0 = performance.now();
  cancelAnimationFrame(fadeId);
  const tick = (t: number) => {
    const k = Math.min(1, (t - t0) / ms);
    a.volume = from + (v - from) * k;
    if (k < 1) fadeId = requestAnimationFrame(tick);
    else done?.();
  };
  fadeId = requestAnimationFrame(tick);
}

// Don't play to a hidden tab.
if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (!audio || !isOn) return;
    if (document.hidden) audio.pause();
    else audio.play().catch(() => {});
  });
}

export const sound = {
  get on() {
    return isOn;
  },
  subscribe(fn: () => void) {
    subs.add(fn);
    return () => void subs.delete(fn);
  },
  // Must run inside a user gesture: browsers block audio until then.
  start() {
    if (isOn) return;
    if (!audio) {
      audio = new Audio(SRC);
      audio.loop = true;
      audio.volume = 0;
    }
    isOn = true;
    emit();
    audio.play().then(
      () => fadeTo(VOLUME, 900),
      () => {
        isOn = false;
        emit();
      },
    );
  },
  stop() {
    if (!isOn) return;
    isOn = false;
    emit();
    fadeTo(0, 400, () => audio?.pause());
  },
  toggle() {
    if (isOn) this.stop();
    else this.start();
  },
};
