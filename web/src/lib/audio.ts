"use client";
// One audio brain for the whole story:
//  - narration: pre-generated ElevenLabs mp3s in /public/audio/<id>.mp3
//  - music: generative Web Audio score (pads + music box + bass) that plays where nobody is talking
//    and ducks under the narrator
//  - sfx: tiny synthesized pass/fail/click sounds for the puzzles
// Everything is created lazily after the first user gesture (browsers block audio before that).

export type Mood = "night" | "blossom" | "forest" | "bridge" | "tower" | "joy";
export type Sfx = "pass" | "fail" | "click" | "tick" | "whoosh" | "chime";

let ctx: AudioContext | null = null;
let master: GainNode, musicBus: GainNode, sfxBus: GainNode, echo: DelayNode;
let muted = false;
const listeners = new Set<(m: boolean) => void>();

const MUSIC_LEVEL = 0.55;
const DUCK_LEVEL = 0.12;

function ensure() {
  if (ctx) return ctx;
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  ctx = new AC();
  const comp = ctx.createDynamicsCompressor();
  comp.connect(ctx.destination);
  master = ctx.createGain();
  master.gain.value = muted ? 0 : 0.9;
  master.connect(comp);
  musicBus = ctx.createGain();
  musicBus.gain.value = MUSIC_LEVEL;
  musicBus.connect(master);
  sfxBus = ctx.createGain();
  sfxBus.gain.value = 0.5;
  sfxBus.connect(master);
  // Soft echo for the music box, so notes bloom like Kaizen's dreamy score
  echo = ctx.createDelay(1);
  echo.delayTime.value = 0.36;
  const fb = ctx.createGain();
  fb.gain.value = 0.38;
  const tone = ctx.createBiquadFilter();
  tone.type = "lowpass";
  tone.frequency.value = 2200;
  echo.connect(tone).connect(fb).connect(echo);
  tone.connect(musicBus);
  return ctx;
}

/** Call from a click/tap handler before anything should make sound. */
export async function unlockAudio() {
  const c = ensure();
  if (c.state === "suspended") await c.resume();
}

export function isMuted() { return muted; }
export function setMuted(m: boolean) {
  muted = m;
  try { localStorage.setItem("taral.muted", m ? "1" : "0"); } catch {}
  if (ctx) master.gain.setTargetAtTime(m ? 0 : 0.9, ctx.currentTime, 0.08);
  if (voice) voice.muted = m;
  listeners.forEach((f) => f(m));
}
export function onMuted(f: (m: boolean) => void) { listeners.add(f); return () => { listeners.delete(f); }; }
export function loadMutedPref() {
  try { muted = localStorage.getItem("taral.muted") === "1"; } catch {}
  return muted;
}

/* ---------------- music ---------------- */

const A4 = 440;
const hz = (midi: number) => A4 * Math.pow(2, (midi - 69) / 12);

// Each mood: tempo, a chord loop (MIDI roots + voicing), and the scale the music box wanders on.
const MOODS: Record<Mood, { bpm: number; chords: number[][]; scale: number[]; density: number; wave: OscillatorType }> = {
  night:   { bpm: 64, chords: [[57, 60, 64], [53, 57, 60], [55, 59, 62], [52, 55, 59]], scale: [69, 71, 72, 74, 76, 79, 81], density: 0.35, wave: "sine" },
  blossom: { bpm: 76, chords: [[53, 57, 60, 64], [55, 59, 62, 65], [57, 60, 64, 67], [50, 53, 57, 60]], scale: [72, 74, 76, 77, 79, 81, 84], density: 0.55, wave: "triangle" },
  forest:  { bpm: 84, chords: [[50, 57, 62, 65], [48, 55, 60, 64], [53, 57, 60, 65], [55, 59, 62, 67]], scale: [74, 76, 77, 79, 81, 83, 86], density: 0.5, wave: "triangle" },
  bridge:  { bpm: 96, chords: [[55, 59, 62, 65], [53, 57, 60, 64], [48, 52, 55, 60], [55, 59, 62, 67]], scale: [67, 69, 71, 72, 74, 76, 79], density: 0.6, wave: "triangle" },
  tower:   { bpm: 70, chords: [[48, 51, 55, 58], [44, 48, 51, 55], [46, 50, 53, 58], [43, 47, 50, 55]], scale: [72, 74, 75, 77, 79, 80, 82], density: 0.3, wave: "sine" },
  joy:     { bpm: 92, chords: [[48, 52, 55, 60], [53, 57, 60, 65], [57, 60, 64, 69], [55, 59, 62, 67]], scale: [72, 74, 76, 79, 81, 84, 86], density: 0.7, wave: "triangle" },
};

let mood: Mood = "night";
let timer: ReturnType<typeof setInterval> | null = null;
let nextBeat = 0;
let beat = 0;

function pad(freqs: number[], t: number, dur: number) {
  const c = ctx!;
  const g = c.createGain();
  const lp = c.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 900;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.05, t + dur * 0.35);
  g.gain.linearRampToValueAtTime(0, t + dur * 1.05);
  lp.connect(g).connect(musicBus);
  for (const f of freqs) for (const det of [-7, 7]) {
    const o = c.createOscillator();
    o.type = "sawtooth";
    o.frequency.value = f;
    o.detune.value = det;
    o.connect(lp);
    o.start(t);
    o.stop(t + dur * 1.1);
  }
}

function bell(f: number, t: number, wave: OscillatorType, vol = 0.07) {
  const c = ctx!;
  const o = c.createOscillator();
  const o2 = c.createOscillator();
  const g = c.createGain();
  o.type = wave;
  o.frequency.value = f;
  o2.type = "sine";
  o2.frequency.value = f * 2.01;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);
  o.connect(g);
  o2.connect(g);
  g.connect(musicBus);
  g.connect(echo);
  o.start(t); o2.start(t);
  o.stop(t + 1.7); o2.stop(t + 1.7);
}

function bass(f: number, t: number, dur: number) {
  const c = ctx!;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = "sine";
  o.frequency.value = f;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(0.09, t + 0.05);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(musicBus);
  o.start(t);
  o.stop(t + dur + 0.05);
}

function schedule() {
  const c = ctx!;
  const m = MOODS[mood];
  const spb = 60 / m.bpm;
  while (nextBeat < c.currentTime + 0.25) {
    const bar = Math.floor(beat / 4) % m.chords.length;
    const chord = m.chords[bar];
    if (beat % 4 === 0) {
      pad(chord.map(hz), nextBeat, spb * 4);
      bass(hz(chord[0] - 12), nextBeat, spb * 3);
    }
    // music box: a gentle walk over the scale, denser on the off-beats
    for (const sub of [0, 0.5]) {
      if (Math.random() < m.density * (sub ? 0.6 : 1)) {
        const n = m.scale[Math.floor(Math.random() * m.scale.length)];
        bell(hz(n), nextBeat + sub * spb, m.wave);
      }
    }
    nextBeat += spb;
    beat++;
  }
}

export const music = {
  start(m: Mood = mood) {
    const c = ensure();
    mood = m;
    if (timer) return;
    nextBeat = c.currentTime + 0.1;
    beat = 0;
    timer = setInterval(schedule, 90);
  },
  setMood(m: Mood) {
    if (m === mood) return;
    mood = m;
    beat = Math.ceil(beat / 4) * 4; // land the change on a bar line
  },
  stop() {
    if (timer) clearInterval(timer);
    timer = null;
  },
  get mood() { return mood; },
};

function duck(on: boolean) {
  if (!ctx) return;
  musicBus.gain.setTargetAtTime(on ? DUCK_LEVEL : MUSIC_LEVEL, ctx.currentTime, on ? 0.15 : 0.6);
}

/* ---------------- narration ---------------- */

let voice: HTMLAudioElement | null = null;

export type Narration = { done: Promise<void>; cancel: () => void };

/**
 * Plays /audio/<id>.mp3 and resolves when it ends. `onProgress` gets 0..1 for word-by-word captions.
 * If audio is muted, blocked or missing it falls back to a reading-speed timer so the story still flows.
 */
export function narrate(id: string, text: string, onProgress?: (p: number) => void): Narration {
  const words = text.split(/\s+/).length;
  const fallbackMs = Math.max(2600, words * 340 + 900);
  let cancelled = false;
  let raf = 0;
  let to: ReturnType<typeof setTimeout> | undefined;
  let resolveFn: () => void = () => {};

  const done = new Promise<void>((resolve) => {
    resolveFn = resolve;
    const finish = () => {
      cancelAnimationFrame(raf);
      if (to) clearTimeout(to);
      duck(false);
      onProgress?.(1);
      resolve();
    };
    let fellBack = false;
    const timed = () => {
      // A missing mp3 fires both `error` and a rejected play(); only fall back once.
      if (fellBack) return;
      fellBack = true;
      const t0 = performance.now();
      const tick = () => {
        if (cancelled) return;
        const p = Math.min(1, (performance.now() - t0) / (fallbackMs - 600));
        onProgress?.(p);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      tick();
      to = setTimeout(finish, fallbackMs);
    };

    if (muted || typeof window === "undefined") return timed();
    if (!voice) voice = new Audio();
    const a = voice;
    a.pause();
    a.src = `/audio/${id}.mp3`;
    a.muted = muted;
    a.currentTime = 0;
    a.onended = () => { if (!cancelled) setTimeout(finish, 450); };
    a.onerror = () => { if (!cancelled) timed(); };
    const follow = () => {
      if (cancelled) return;
      if (a.duration) onProgress?.(Math.min(1, a.currentTime / (a.duration * 0.92)));
      raf = requestAnimationFrame(follow);
    };
    duck(true);
    a.play().then(follow).catch(() => { duck(false); if (!cancelled) timed(); });
  });

  return {
    done,
    cancel: () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      if (to) clearTimeout(to);
      if (voice) { voice.onended = null; voice.onerror = null; voice.pause(); }
      duck(false);
      resolveFn();
    },
  };
}

export function stopNarration() {
  if (voice) { voice.onended = null; voice.onerror = null; voice.pause(); }
  duck(false);
}

/* ---------------- sfx ---------------- */

export function sfx(kind: Sfx) {
  if (!ctx || muted) return;
  const c = ctx;
  const t = c.currentTime;
  const note = (f: number, at: number, len: number, type: OscillatorType = "triangle", vol = 0.25) => {
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f, at);
    g.gain.setValueAtTime(0, at);
    g.gain.linearRampToValueAtTime(vol, at + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, at + len);
    o.connect(g).connect(sfxBus);
    o.start(at);
    o.stop(at + len + 0.05);
    return o;
  };
  switch (kind) {
    case "pass": [72, 76, 79, 84].forEach((n, i) => note(hz(n), t + i * 0.07, 0.5)); break;
    case "chime": [79, 84, 88, 91].forEach((n, i) => note(hz(n), t + i * 0.12, 1.4, "sine", 0.18)); break;
    case "fail": {
      const o = note(hz(55), t, 0.55, "sawtooth", 0.12);
      o.frequency.exponentialRampToValueAtTime(hz(43), t + 0.5);
      break;
    }
    case "click": note(hz(91), t, 0.06, "sine", 0.12); break;
    case "tick": note(hz(96), t, 0.04, "square", 0.04); break;
    case "whoosh": {
      const len = 0.7;
      const buf = c.createBuffer(1, c.sampleRate * len, c.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
      const s = c.createBufferSource();
      const bp = c.createBiquadFilter();
      const g = c.createGain();
      bp.type = "bandpass";
      bp.Q.value = 0.8;
      bp.frequency.setValueAtTime(300, t);
      bp.frequency.exponentialRampToValueAtTime(3000, t + len);
      g.gain.value = 0.18;
      s.buffer = buf;
      s.connect(bp).connect(g).connect(sfxBus);
      s.start(t);
      break;
    }
  }
}
