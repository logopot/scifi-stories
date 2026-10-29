// Unapred nacrtani sprajtovi za efekte (offscreen canvas), keširani po paleti. Crtaju se jednom; u kadru se samo
// skaliraju i slažu. Svaki piksel dobija sitan dither po alfa kanalu da u tamnim delovima ne bude bandinga.
import { fxStyle } from './fxStyle';

const cache = new Map();
const once = (key, build) => {
  if (!cache.has(key)) cache.set(key, build());
  return cache.get(key);
};

export const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const smoothstep = (a, b, v) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const lerp = (a, b, t) => a + (b - a) * t;

// --- boje (tokeni teme su hex stringovi) ---
export const parseColor = (value) => {
  const s = String(value).trim();
  if (s[0] === '#') {
    const h = s.length === 4 ? [...s.slice(1)].map((c) => c + c).join('') : s.slice(1, 7);
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }
  const m = s.match(/[\d.]+/g);
  return m ? [Number(m[0]), Number(m[1]), Number(m[2])] : [255, 220, 160];
};
export const mix = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
export const css = (c, a = 1) => `rgba(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])},${a})`;

// Paleta izvora: jezgro (belo-žuto / bledo plavo), sredina (boja tokena), ivica (duboka narandžasto-smeđa / plavo-siva).
export const paletteFor = (token, hex) => {
  const cold = token === 'fxCold' || token === 'fxGreen';
  const p = cold ? fxStyle.palette.cold : fxStyle.palette.warm;
  const mid = parseColor(hex);
  return { key: `${token}:${hex}`, cold, mid, core: mix(mid, p.coreTarget, p.coreWhite), edge: mix(mid, p.edgeTarget, p.edgeDark) };
};

// --- crtanje piksel po piksel ---
const paint = (w, h, fn, dither = 2.2) => {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');
  const img = ctx.createImageData(w, h);
  const d = img.data;
  const o = [0, 0, 0, 0];
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      o[3] = 0;
      fn((x + 0.5) / w, (y + 0.5) / h, o);
      const i = (y * w + x) * 4;
      d[i] = o[0];
      d[i + 1] = o[1];
      d[i + 2] = o[2];
      const a = o[3] * 255;
      d[i + 3] = a <= 0 ? 0 : a + (Math.random() - 0.5) * dither;
    }
  }
  ctx.putImageData(img, 0, 0);
  return c;
};

const colorAt = (pal, d, coreEnd, midAt) => {
  if (d < coreEnd) return mix(pal.core, pal.mid, d / coreEnd);
  return mix(pal.mid, pal.edge, clamp01((d - coreEnd) / (1 - midAt)));
};

// Mek radijalni sjaj: jezgro → sredina → ivica, pad providnosti ~ (1-d)^power.
export const soft = (pal) =>
  once(`soft:${pal.key}`, () =>
    paint(160, 160, (u, v, o) => {
      const d = Math.hypot(u - 0.5, v - 0.5) * 2;
      if (d >= 1) return;
      const c = colorAt(pal, d, 0.3, 0.3);
      o[0] = c[0]; o[1] = c[1]; o[2] = c[2];
      o[3] = Math.pow(1 - d, 2.3);
    })
  );

// Isto, ali bez belog jezgra (sredina → ivica): za "topliji" sloj pri dnu treperenja i za bazen svetla.
export const deep = (pal) =>
  once(`deep:${pal.key}`, () =>
    paint(160, 160, (u, v, o) => {
      const d = Math.hypot(u - 0.5, v - 0.5) * 2;
      if (d >= 1) return;
      const c = mix(pal.mid, pal.edge, clamp01(d * 1.1));
      o[0] = c[0]; o[1] = c[1]; o[2] = c[2];
      o[3] = Math.pow(1 - d, 2.1);
    })
  );

// Sitno jarko jezgro (gausov pad).
export const dot = (pal) =>
  once(`dot:${pal.key}`, () =>
    paint(64, 64, (u, v, o) => {
      const d = Math.hypot(u - 0.5, v - 0.5) * 2;
      if (d >= 1) return;
      const c = mix(pal.core, pal.mid, smoothstep(0, 0.9, d));
      o[0] = c[0]; o[1] = c[1]; o[2] = c[2];
      o[3] = Math.exp(-7 * d * d) * (1 - d);
    })
  );

// Zrak svetla nadole (konus): uzak pri izvoru, širi se i bledi. Vrh sprajta je izvor.
export const cone = (pal) =>
  once(`cone:${pal.key}`, () =>
    paint(64, 128, (u, v, o) => {
      const nx = (u - 0.5) * 2;
      const hw = 0.22 + 0.78 * v;
      const across = Math.exp(-3.4 * (nx / hw) * (nx / hw));
      const along = Math.pow(1 - v, 1.5) * smoothstep(0, 0.06, v);
      const c = mix(pal.mid, pal.edge, v * 0.8);
      o[0] = c[0]; o[1] = c[1]; o[2] = c[2];
      o[3] = across * along;
    })
  );

// Jezičak plamena u obliku suze (dno je na dnu sprajta): belo-žuto jezgro, ćilibarska ivica, crvenkast providan vrh.
export const TONGUE_VARIANTS = 3;
export const tongue = (pal, variant) =>
  once(`tongue:${pal.key}:${variant}`, () => {
    const bend = [-0.22, 0.02, 0.28][variant % TONGUE_VARIANTS];
    const tip = mix(pal.edge, [150, 36, 16], 0.5);
    return paint(64, 128, (u, v, o) => {
      const ny = 1 - v;
      const nx = (u - 0.5) * 2 - bend * ny * ny;
      const hw = Math.max(0.001, Math.pow(1 - ny, 0.9) * (0.55 + 0.45 * Math.sin(Math.min(1, ny * 4) * Math.PI * 0.5)));
      const q = Math.abs(nx) / hw;
      const across = Math.exp(-2.6 * q * q);
      if (across < 0.004) return;
      const body = mix(pal.edge, pal.mid, Math.pow(across, 1.2));
      const core = Math.pow(across, 3) * Math.pow(1 - ny, 0.7);
      const c = mix(mix(body, pal.core, core), tip, Math.pow(ny, 1.8));
      o[0] = c[0]; o[1] = c[1]; o[2] = c[2];
      o[3] = across * Math.pow(1 - ny, 0.35) * smoothstep(0, 0.07, ny) * (1 - 0.35 * ny * ny);
    });
  });

// Iskra: mali žareći sprajt.
export const spark = (pal) =>
  once(`spark:${pal.key}`, () =>
    paint(24, 24, (u, v, o) => {
      const d = Math.hypot(u - 0.5, v - 0.5) * 2;
      if (d >= 1) return;
      const c = mix(pal.core, pal.mid, smoothstep(0, 0.7, d));
      o[0] = c[0]; o[1] = c[1]; o[2] = c[2];
      o[3] = Math.exp(-5 * d * d) * (1 - d);
    })
  );

// Mekan trouglasti zrak sunca (vrh pri izvoru), bez oštrih ivica.
export const ray = (pal) =>
  once(`ray:${pal.key}`, () =>
    paint(48, 192, (u, v, o) => {
      const nx = (u - 0.5) * 2;
      const hw = 0.1 + 0.9 * v;
      const q = Math.abs(nx) / hw;
      const across = 1 - smoothstep(0.1, 1, q);
      const along = Math.pow(1 - v, 1.25) * smoothstep(0, 0.05, v);
      const c = mix(pal.core, pal.mid, v);
      o[0] = c[0]; o[1] = c[1]; o[2] = c[2];
      o[3] = across * along;
    })
  );

// --- šum ---
const hash = (ix, iy, seed) => {
  let h = Math.imul(ix, 374761393) + Math.imul(iy, 668265263) + Math.imul(seed, 1274126177);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};
const vnoise = (x, y, seed, period) => {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const fx = smoothstep(0, 1, x - x0);
  const fy = smoothstep(0, 1, y - y0);
  const wrap = (i) => (period ? ((i % period) + period) % period : i);
  const a = hash(wrap(x0), y0, seed);
  const b = hash(wrap(x0 + 1), y0, seed);
  const c = hash(wrap(x0), y0 + 1, seed);
  const d = hash(wrap(x0 + 1), y0 + 1, seed);
  return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
};
export const fbm = (x, y, seed, octaves, period = 0) => {
  let sum = 0;
  let amp = 0.5;
  let freq = 1;
  let norm = 0;
  for (let o = 0; o < octaves; o++) {
    sum += amp * vnoise(x * freq, y * freq, seed + o * 17, period ? period * freq : 0);
    norm += amp;
    amp *= 0.5;
    freq *= 2;
  }
  return sum / norm;
};

// Veliki mek sprajt dima (tekstura sa šumom, ne glatki krug). tint: 'warm' | 'cool' | 'dark'.
export const SMOKE_VARIANTS = 3;
export const smokeSprite = (tint, color, variant) =>
  once(`smoke:${tint}:${color.join(',')}:${variant}`, () => {
    const rgb = tint === 'dark' ? [34, 33, 38] : tint === 'warm' ? mix(color, [150, 140, 132], 0.45) : mix(color, [84, 94, 112], 0.6);
    return paint(128, 128, (u, v, o) => {
      const d = Math.hypot(u - 0.5, v - 0.5) * 2;
      if (d >= 1) return;
      const n = fbm(u * 3.2, v * 3.2, 100 + variant * 31, 4);
      o[0] = rgb[0]; o[1] = rgb[1]; o[2] = rgb[2];
      o[3] = Math.pow(1 - d, 1.4) * (0.15 + 0.85 * smoothstep(0.25, 0.8, n));
    });
  });

// Pahulje: 'sharp' (daleke, oštre), 'soft' (srednje), 'bokeh' (bliske, zamućene sa tananim obodom).
export const flake = (kind, pal) =>
  once(`flake:${kind}:${pal.key}`, () => {
    const size = kind === 'bokeh' ? 64 : 24;
    const core = mix(pal.mid, [244, 248, 252], 0.72);
    return paint(size, size, (u, v, o) => {
      const d = Math.hypot(u - 0.5, v - 0.5) * 2;
      if (d >= 1) return;
      let a;
      let c;
      if (kind === 'sharp') {
        a = 1 - smoothstep(0.35, 0.95, d);
        c = mix(core, pal.mid, smoothstep(0, 0.9, d));
      } else if (kind === 'soft') {
        a = Math.exp(-3.4 * d * d) * (1 - d);
        c = mix(core, pal.mid, smoothstep(0, 1, d));
      } else {
        a = (0.7 + 0.3 * smoothstep(0.55, 0.85, d)) * (1 - smoothstep(0.6, 1, d));
        c = mix(core, pal.mid, 0.5 + 0.4 * d);
      }
      o[0] = c[0]; o[1] = c[1]; o[2] = c[2];
      o[3] = a;
    });
  });

// Kapljica kiše: tanka crta, providna pri vrhu.
export const streak = (pal) =>
  once(`streak:${pal.key}`, () =>
    paint(4, 48, (u, v, o) => {
      const across = Math.exp(-14 * (u - 0.5) * (u - 0.5) * 4);
      const c = mix(pal.mid, pal.core, v);
      o[0] = c[0]; o[1] = c[1]; o[2] = c[2];
      o[3] = across * smoothstep(0, 0.9, v) * 0.9;
    }, 1)
  );

// Pramen magle: horizontalno ponovljiv fraktalni šum, izbledi pri vrhu i dnu.
export const MIST_TEXTURES = 3;
export const mistTexture = (seed, color) =>
  once(`mist:${seed}:${color.join(',')}`, () => {
    const { w, h } = fxStyle.mist.texture;
    const rgb = mix(color, fxStyle.mist.tint, fxStyle.mist.tintMix);
    return paint(w, h, (u, v, o) => {
      const n = fbm(u * 4, v * 2.4, seed, 5, 4);
      const band = Math.pow(Math.sin(Math.PI * v), 1.3);
      o[0] = rgb[0]; o[1] = rgb[1]; o[2] = rgb[2];
      o[3] = Math.pow(smoothstep(0.3, 0.85, n), 1.2) * band;
    }, 3);
  });

// Zrno: tileovana tekstura šuma (alfa 1 − strength…1) koja se množi preko svetla (destination-in) i samo se pomera.
export const grainTile = () =>
  once('grain', () => {
    const { tile, strength } = fxStyle.grain;
    return paint(tile, tile, (u, v, o) => {
      o[0] = o[1] = o[2] = 255;
      o[3] = 1 - strength * Math.random();
    }, 0);
  });
