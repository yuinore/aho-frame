const COOKIE_NAME = 'ahoframe_settings';
const MAX_AGE_DAYS = 30;

export interface StoredSettings {
  lang: 'ja' | 'en';
  beatInterval: number;
  beatOffset: number;
  fps: number;
  bpm: number;
  frameOffset: number;
}

const DEFAULT_FORM: StoredSettings = {
  lang: 'ja',
  beatInterval: 1,
  beatOffset: 0,
  fps: 30,
  bpm: 176,
  frameOffset: 0,
};

function getCookie(name: string): string | null {
  try {
    const parts = document.cookie.split(';');
    for (const part of parts) {
      const [key, ...rest] = part.split('=');
      if (key?.trim() === name) {
        return decodeURIComponent(rest.join('=').trim()) || null;
      }
    }
  } catch {
    // ignore
  }
  return null;
}

function setCookie(name: string, value: string, maxAgeDays: number): void {
  try {
    const encoded = encodeURIComponent(value);
    const maxAge = maxAgeDays * 24 * 60 * 60;
    document.cookie = `${name}=${encoded}; path=/; max-age=${maxAge}; samesite=lax`;
  } catch {
    // ignore
  }
}

function isFiniteNumber(x: unknown): x is number {
  return typeof x === 'number' && Number.isFinite(x);
}

function isValidLang(x: unknown): x is 'ja' | 'en' {
  return x === 'ja' || x === 'en';
}

function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === 'object' && x !== null && !Array.isArray(x);
}

export function readSettings(): StoredSettings | null {
  try {
    const raw = getCookie(COOKIE_NAME);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) return null;
    const beatInterval = parsed.beatInterval;
    const beatOffset = parsed.beatOffset;
    const fps = parsed.fps;
    const bpm = parsed.bpm;
    const frameOffset = parsed.frameOffset;
    const lang = parsed.lang;
    if (
      !isFiniteNumber(beatInterval) ||
      !isFiniteNumber(beatOffset) ||
      !isFiniteNumber(fps) ||
      !isFiniteNumber(bpm) ||
      !isFiniteNumber(frameOffset) ||
      !isValidLang(lang)
    ) {
      return null;
    }
    return {
      beatInterval,
      beatOffset,
      fps,
      bpm,
      frameOffset,
      lang,
    };
  } catch {
    return null;
  }
}

export function writeSettings(settings: StoredSettings): void {
  try {
    const value = JSON.stringify(settings);
    setCookie(COOKIE_NAME, value, MAX_AGE_DAYS);
  } catch {
    // ignore
  }
}

export function getDefaultForm(): StoredSettings {
  return { ...DEFAULT_FORM };
}
