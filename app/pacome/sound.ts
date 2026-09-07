export type UiSound = "entry" | "hover" | "open" | "back" | "menu" | "toggle";

const AUDIO_ROOT = "/portfolio/audio";
const SOUND_STORAGE_KEY = "pp-sound-enabled";
const AMBIENT_TIME_STORAGE_KEY = "pp-ambient-time";
const AMBIENT_VOLUME = 0.07;
const AMBIENT_DETAIL_VOLUME = 0.022;
const MOBILE_AMBIENT_MULTIPLIER = 0.62;
const MOBILE_UI_MULTIPLIER = 0.72;
const SOUND_PATHS: Record<UiSound | "ambient", string> = {
  entry: `${AUDIO_ROOT}/entry.mp3`,
  hover: `${AUDIO_ROOT}/hover.mp3`,
  open: `${AUDIO_ROOT}/open.mp3`,
  back: `${AUDIO_ROOT}/back.mp3`,
  menu: `${AUDIO_ROOT}/menu.mp3`,
  toggle: `${AUDIO_ROOT}/toggle.mp3`,
  ambient: `${AUDIO_ROOT}/ambient.mp3`,
};
const SOUND_VOLUMES: Record<UiSound, number> = {
  entry: 0.5,
  hover: 0.16,
  open: 0.4,
  back: 0.36,
  menu: 0.28,
  toggle: 0.32,
};

const clips = new Map<UiSound, HTMLAudioElement>();
let ambient: HTMLAudioElement | null = null;
let ambientFrame = 0;
let ambientFadeGeneration = 0;
let visibilityListenerInstalled = false;
let lastHoverAt = 0;
let ambientContext: "gallery" | "detail" = "gallery";
let mobileAudioContext: AudioContext | null = null;
const mobileAudioGains = new WeakMap<HTMLAudioElement, GainNode>();

function usesMobileAudioProfile() {
  return audioAvailable()
    && window.matchMedia("(max-width: 900px) and (pointer: coarse)").matches;
}

function audioContextConstructor() {
  const audioWindow = window as typeof window & { webkitAudioContext?: typeof AudioContext };
  return audioWindow.AudioContext ?? audioWindow.webkitAudioContext;
}

function audioAvailable() {
  return typeof window !== "undefined" && typeof Audio !== "undefined";
}

export function getSoundEnabled() {
  if (!audioAvailable()) return false;
  try {
    return window.sessionStorage.getItem(SOUND_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function storeSoundEnabled(enabled: boolean) {
  try {
    window.sessionStorage.setItem(SOUND_STORAGE_KEY, enabled ? "1" : "0");
  } catch {
    // Sound remains usable even when storage is unavailable.
  }
  window.dispatchEvent(new CustomEvent("pp-sound-change", { detail: { enabled } }));
}

function getClip(name: UiSound) {
  const cached = clips.get(name);
  if (cached) return cached;
  const clip = new Audio(SOUND_PATHS[name]);
  clip.preload = "auto";
  clip.volume = SOUND_VOLUMES[name] * (usesMobileAudioProfile() ? MOBILE_UI_MULTIPLIER : 1);
  clips.set(name, clip);
  return clip;
}

function getAmbient() {
  if (ambient) return ambient;
  ambient = new Audio(SOUND_PATHS.ambient);
  ambient.loop = true;
  ambient.preload = "none";
  ambient.volume = 0;
  try {
    const savedTime = Number(window.sessionStorage.getItem(AMBIENT_TIME_STORAGE_KEY));
    if (Number.isFinite(savedTime) && savedTime > 0) ambient.currentTime = savedTime;
  } catch {
    // Continue from the beginning when storage is unavailable.
  }
  ambient.addEventListener("timeupdate", persistAmbientTime);
  return ambient;
}

function persistAmbientTime() {
  if (!ambient || !Number.isFinite(ambient.currentTime)) return;
  try {
    window.sessionStorage.setItem(AMBIENT_TIME_STORAGE_KEY, String(ambient.currentTime));
  } catch {
    // In-memory playback still remains continuous across client-side routes.
  }
}

function ambientTargetVolume() {
  const baseVolume = ambientContext === "detail" ? AMBIENT_DETAIL_VOLUME : AMBIENT_VOLUME;
  return baseVolume * (usesMobileAudioProfile() ? MOBILE_AMBIENT_MULTIPLIER : 1);
}

function clampVolume(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

function readOutputVolume(audio: HTMLAudioElement) {
  return mobileAudioGains.get(audio)?.gain.value ?? audio.volume;
}

function setOutputVolume(audio: HTMLAudioElement, value: number) {
  const level = clampVolume(value);
  if (!usesMobileAudioProfile()) {
    audio.volume = level;
    return;
  }

  const AudioContextClass = audioContextConstructor();
  if (!AudioContextClass) {
    audio.volume = level;
    return;
  }

  try {
    mobileAudioContext ??= new AudioContextClass();
    let gain = mobileAudioGains.get(audio);
    if (!gain) {
      const source = mobileAudioContext.createMediaElementSource(audio);
      gain = mobileAudioContext.createGain();
      source.connect(gain);
      gain.connect(mobileAudioContext.destination);
      mobileAudioGains.set(audio, gain);
    }
    audio.volume = 1;
    gain.gain.value = level;
    if (mobileAudioContext.state === "suspended") {
      void mobileAudioContext.resume().catch(() => undefined);
    }
  } catch {
    audio.volume = level;
  }
}

function cancelAmbientFade() {
  ambientFadeGeneration += 1;
  if (ambientFrame) window.cancelAnimationFrame(ambientFrame);
  ambientFrame = 0;
}

function fadeAmbient(target: number, duration: number, pauseWhenDone = false) {
  if (!ambient) return;
  cancelAmbientFade();
  const generation = ambientFadeGeneration;
  const audio = ambient;
  const startVolume = clampVolume(readOutputVolume(audio));
  const endVolume = clampVolume(target);
  const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 0;
  const startedAt = performance.now();

  const tick = (now: number) => {
    if (generation !== ambientFadeGeneration) return;
    const progress = safeDuration === 0
      ? 1
      : Math.min(1, Math.max(0, (now - startedAt) / safeDuration));
    setOutputVolume(audio, startVolume + (endVolume - startVolume) * progress);
    if (progress < 1) {
      ambientFrame = window.requestAnimationFrame(tick);
    } else {
      ambientFrame = 0;
      if (pauseWhenDone) audio.pause();
    }
  };
  ambientFrame = window.requestAnimationFrame(tick);
}

function startAmbient() {
  if (!audioAvailable() || document.hidden || !getSoundEnabled()) return;
  const audio = getAmbient();
  audio.muted = false;
  setOutputVolume(audio, readOutputVolume(audio));
  const playback = audio.play();
  if (playback) {
    void playback.then(() => {
      if (!getSoundEnabled() || document.hidden) {
        cancelAmbientFade();
        setOutputVolume(audio, 0);
        audio.pause();
        return;
      }
      fadeAmbient(ambientTargetVolume(), 700);
    }).catch(() => undefined);
  } else {
    fadeAmbient(ambientTargetVolume(), 700);
  }
}

function stopAmbient() {
  if (!ambient || ambient.paused) return;
  fadeAmbient(0, 180, true);
}

function installVisibilityListener() {
  if (visibilityListenerInstalled || !audioAvailable()) return;
  visibilityListenerInstalled = true;
  window.addEventListener("pagehide", persistAmbientTime);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAmbientFade();
      ambient?.pause();
    } else if (getSoundEnabled()) {
      startAmbient();
    }
  });
}

export function prepareSoundAssets() {
  if (!audioAvailable()) return;
  installVisibilityListener();
  (["entry", "hover", "open", "back", "menu", "toggle"] as UiSound[]).forEach((name) => {
    getClip(name).load();
  });
}

export function playUiSound(name: UiSound, options: { force?: boolean } = {}) {
  if (!audioAvailable() || (!options.force && !getSoundEnabled())) return;
  if (name !== "entry" && getSoundEnabled() && (!ambient || ambient.paused)) startAmbient();
  if (name === "hover") {
    const now = performance.now();
    if (now - lastHoverAt < 90) return;
    lastHoverAt = now;
  }
  const clip = getClip(name);
  clip.pause();
  clip.currentTime = 0;
  setOutputVolume(clip, SOUND_VOLUMES[name] * (usesMobileAudioProfile() ? MOBILE_UI_MULTIPLIER : 1));
  void clip.play().catch(() => undefined);
}

export function beginSoundExperience() {
  if (!audioAvailable()) return;
  ambientContext = "gallery";
  storeSoundEnabled(true);
  playUiSound("entry", { force: true });
  installVisibilityListener();
  startAmbient();
}

export function setSoundEnabled(enabled: boolean, withToggleFeedback = false) {
  if (!audioAvailable()) return;
  if (withToggleFeedback) playUiSound("toggle", { force: true });
  storeSoundEnabled(enabled);
  installVisibilityListener();
  if (enabled) startAmbient();
  else stopAmbient();
}

export function resumeSoundExperience() {
  if (!audioAvailable()) return false;
  installVisibilityListener();
  const enabled = getSoundEnabled();
  if (enabled) startAmbient();
  return enabled;
}

export function setAmbientContext(context: "gallery" | "detail") {
  if (!audioAvailable()) return;
  ambientContext = context;
  if (!getSoundEnabled()) return;
  if (!ambient || ambient.paused) return;
  fadeAmbient(ambientTargetVolume(), context === "detail" ? 420 : 650);
}
