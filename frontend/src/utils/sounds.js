import { SETTINGS_STORAGE_KEY } from "@/config";

const QUIET_GAP_MS = 1500;

const players = {};
const lastHeardAt = {};

const playerFor = (name) => {
  players[name] ??= Object.assign(new Audio(`${process.env.PUBLIC_URL}/sounds/${name}.mp3`), { preload: "auto" });
  return players[name];
};

const soundsOn = () => {
  try {
    return JSON.parse(localStorage.getItem(SETTINGS_STORAGE_KEY))?.sounds !== false;
  } catch {
    return true;
  }
};

// a browser refuses to play before the person has interacted with the page, and that is fine to skip
const play = (name) => {
  const player = playerFor(name);
  player.currentTime = 0;
  player.play().catch(() => {});
};

// each kind sounds once per burst, so a busy chat stays quiet until it pauses, without one kind silencing another
export const playSound = (name) => {
  const isBurst = Date.now() - (lastHeardAt[name] ?? 0) < QUIET_GAP_MS;
  lastHeardAt[name] = Date.now();
  if (soundsOn() && !isBurst) play(name);
};

export const previewSound = () => play("elsewhere");

// a send is deliberate, so unlike the others this one is never held back when they come quickly
export const playQueuedSound = () => {
  if (soundsOn()) play("queued");
};

const TONE_FROM = 330;
const TONE_TO = 880;
const TONE_LEVEL = 0.09;
const FADE_S = 0.08;

// a tone that climbs while something is held, since a growing emoji on its own is easy to miss
export const startRisingTone = (overMs) => {
  if (!soundsOn()) return () => {};
  const context = new AudioContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const startedAt = context.currentTime;

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(TONE_FROM, startedAt);
  oscillator.frequency.linearRampToValueAtTime(TONE_TO, startedAt + overMs / 1000);
  gain.gain.setValueAtTime(0, startedAt);
  gain.gain.linearRampToValueAtTime(TONE_LEVEL, startedAt + FADE_S / 2);
  oscillator.connect(gain).connect(context.destination);
  oscillator.onended = () => context.close();
  oscillator.start();

  // faded out rather than cut, so letting go does not click
  return () => {
    const endsAt = context.currentTime + FADE_S;
    gain.gain.cancelScheduledValues(context.currentTime);
    gain.gain.setValueAtTime(gain.gain.value, context.currentTime);
    gain.gain.linearRampToValueAtTime(0, endsAt);
    oscillator.stop(endsAt);
  };
};
