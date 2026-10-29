// Signali koji pokreću efekte: nepravilno treperenje (tri sinusa + spora varijacija + prigušenja), vetar sa naletima
// i geometrija slike (cover pravougaonik). Sve slučajno se bira jednom po instanci.
import { fxStyle } from './fxStyle';
import { smoothstep } from './fxSprites';

const TAU = Math.PI * 2;
export const rand = (a, b) => a + Math.random() * (b - a);
export const pick = ([a, b]) => rand(a, b);

// 'center 55%' → [0.5, 0.55] (object-position kao razlomci)
export const parseFocus = (value) => {
  const [x = 'center', y = 'center'] = String(value).trim().split(/\s+/);
  const f = (v) => (v === 'center' ? 0.5 : v === 'left' || v === 'top' ? 0 : v === 'right' || v === 'bottom' ? 1 : parseFloat(v) / 100);
  return [f(x), f(y)];
};

// Pravougaonik koji slika (iw × ih) zauzima u kontejneru (cw × ch) uz cover i object-position.
export const coverRect = (cw, ch, iw, ih, [px, py]) => {
  const scale = Math.max(cw / iw, ch / ih);
  const w = iw * scale;
  const h = ih * scale;
  return { left: (cw - w) * px, top: (ch - h) * py, width: w, height: h };
};

const NEUTRAL = { v: 0, slow: 0, dip: 0, dx: 0, dy: 0, peak: 0.5 };

// Treperenje jedne instance. hzScale pomera učestalosti da dve instance nikad nisu sinhrone.
export const makeFlicker = (hzScale = 1) => {
  const f = fxStyle.flicker;
  const freq = f.hz.map((h) => h * hzScale * (1 + rand(-f.hzSpread, f.hzSpread)));
  const phase = f.hz.map(() => rand(0, TAU));
  const table = Array.from({ length: 32 }, () => rand(-1, 1));
  const slowHz = f.slowHz * rand(0.8, 1.25);
  const offset = rand(0, 32);
  const norm = f.weights.reduce((s, w) => s + w, 0) + f.slowWeight;
  let dipAt = rand(2, f.dipEvery[1]);
  let dipLen = pick(f.dipLen);
  const out = { v: 0, slow: 0, dip: 0, dx: 0, dy: 0, peak: 0.5 };
  return (t, still) => {
    if (still) return NEUTRAL;
    let s = 0;
    for (let i = 0; i < freq.length; i++) s += f.weights[i] * Math.sin(TAU * freq[i] * t + phase[i]);
    const k = t * slowHz + offset;
    const i0 = Math.floor(k);
    const a = table[i0 % 32];
    const b = table[(i0 + 1) % 32];
    const slow = a + (b - a) * smoothstep(0, 1, k - i0);
    out.v = (s + f.slowWeight * slow) / norm;
    out.slow = slow;
    out.dip = 0;
    if (t > dipAt) {
      const u = (t - dipAt) / dipLen;
      if (u < 1) out.dip = Math.sin(Math.PI * u);
      else {
        dipAt = t + pick(f.dipEvery);
        dipLen = pick(f.dipLen);
      }
    }
    out.dx = Math.sin(TAU * freq[1] * 0.6 * t + phase[0] * 1.7) * f.jitterPx;
    out.dy = Math.sin(TAU * freq[2] * 0.4 * t + phase[1] * 1.3) * f.jitterPx * 0.7 + slow * 0.4;
    out.peak = Math.min(1, Math.max(0, 0.5 + 0.5 * out.v));
    return out;
  };
};

// Jačina izvora: 1 ± amount·v, sa povremenim prigušenjem.
export const intensity = (sig, amount) => 1 + fxStyle.flicker.amount * amount * sig.v - fxStyle.flicker.dipDepth * amount * sig.dip;

// Vetar: spor, malo promenljiv pravac [-1, 1] + povremeni nalet (kratko, jače). gust(): 0–1 jačina naleta.
export const makeWind = (gustCfg) => {
  const p = [rand(0, TAU), rand(0, TAU), rand(0, TAU)];
  let nextGust = rand(2, gustCfg.every[1]);
  let len = 1.5;
  let push = 0;
  let start = -1e9;
  const out = { base: 0, gust: 0, push: 0 };
  return (t, still) => {
    if (still) return NEUTRAL_WIND;
    out.base = 0.5 * Math.sin(0.05 * t + p[0]) + 0.3 * Math.sin(0.13 * t + p[1]) + 0.2 * Math.sin(0.31 * t + p[2]);
    if (t > nextGust) {
      start = t;
      len = pick(gustCfg.len);
      push = (Math.random() < 0.5 ? -1 : 1) * pick(gustCfg.push || [0.5, 1]);
      nextGust = t + len + pick(gustCfg.every);
    }
    const u = (t - start) / len;
    out.gust = u >= 0 && u < 1 ? Math.sin(Math.PI * u) : 0;
    out.push = push * out.gust;
    return out;
  };
};
const NEUTRAL_WIND = { base: 0, gust: 0, push: 0 };
