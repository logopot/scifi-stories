// Šema efekata preko slika mesta (polje `fx` u story.images[id], samo za kind "place"). Koriste je prikaz (components/SceneFx),
// razvojni alat (/dev/fx) i validator (scripts/check-story.mjs). Koordinate su procenti SLIKE (0–100), ne ekrana.
export const MAX_FX = 6;
export const FX_COLORS = ['accent', 'fxWarm', 'fxCold', 'fxSun', 'fxGreen']; // imena tokena teme (src/styles/themes.js)

// Po tipu: obavezna polja, opciona polja i opseg brojeva. `points` je niz [x,y] (najviše MAX_POINTS).
export const MAX_POINTS = 40;
export const FX_TYPES = {
  glow: { required: ['x', 'y', 'r'], optional: ['color', 'flicker'] },
  fire: { required: ['x', 'y', 'r'], optional: ['color', 'w', 'h', 'source'] },
  sun: { required: ['x', 'y', 'r'], optional: ['color', 'rays'] },
  smoke: { required: ['x', 'y', 'w'], optional: ['color'] },
  twinkle: { required: ['points'], optional: ['color', 'r'] },
  snow: { required: [], optional: ['color', 'density', 'speed'] },
  dust: { required: [], optional: ['color', 'density', 'speed'] },
  rain: { required: [], optional: ['color', 'density', 'speed'] },
  mist: { required: [], optional: ['color'] },
  water: { required: ['x', 'y', 'w', 'h'], optional: ['ripple', 'glints', 'columns', 'exclude', 'color'] },
};

export const FIRE_SOURCES = ['painted', 'drawn'];
const RANGES = { ripple: [0, 1], glints: [0, 14], x: [0, 100], y: [0, 100], r: [0.1, 60], w: [0.1, 100], h: [0.1, 100], flicker: [0, 1], density: [0, 1], speed: [0.1, 5] };

// Vraća niz poruka o greškama (prazan niz = ispravno).
export const validateFx = (fx) => {
  const errs = [];
  if (!Array.isArray(fx)) return ['fx mora biti niz'];
  if (fx.length > MAX_FX) errs.push(`najviše ${MAX_FX} efekata po slici (ima ${fx.length})`);
  fx.forEach((e, i) => {
    const where = `fx[${i}]`;
    if (!e || typeof e !== 'object') return errs.push(`${where}: mora biti objekat`);
    const spec = FX_TYPES[e.type];
    if (!spec) return errs.push(`${where}: nepoznat tip "${e.type}" (dozvoljeno: ${Object.keys(FX_TYPES).join(', ')})`);
    const allowed = new Set(['type', ...spec.required, ...spec.optional]);
    for (const k of Object.keys(e)) if (!allowed.has(k)) errs.push(`${where} (${e.type}): nepoznato polje "${k}"`);
    for (const k of spec.required) if (e[k] === undefined) errs.push(`${where} (${e.type}): nedostaje "${k}"`);
    for (const [k, [lo, hi]] of Object.entries(RANGES)) {
      if (e[k] === undefined) continue;
      if (typeof e[k] !== 'number' || !Number.isFinite(e[k]) || e[k] < lo || e[k] > hi) errs.push(`${where} (${e.type}): "${k}" mora biti broj ${lo}–${hi}`);
    }
    if (e.color !== undefined && !FX_COLORS.includes(e.color)) errs.push(`${where} (${e.type}): nepoznata boja "${e.color}" (dozvoljeno: ${FX_COLORS.join(', ')})`);
    if (e.source !== undefined && !FIRE_SOURCES.includes(e.source)) errs.push(`${where} (${e.type}): "source" mora biti ${FIRE_SOURCES.join(' ili ')}`);
    if (e.type === 'water') {
      const rect = (r, rx, ry, rw, rh) => Array.isArray(r) && r.length === 4 && r.every((v) => typeof v === 'number' && Number.isFinite(v)) && r[0] >= 0 && r[1] >= 0 && r[2] > 0 && r[3] > 0 && r[0] + r[2] <= 100 + 1e-6 && r[1] + r[3] <= 100 + 1e-6;
      if (!rect([e.x, e.y, e.w, e.h])) errs.push(`${where} (water): x, y, w, h moraju biti brojevi, w i h > 0, x+w i y+h najviše 100`);
      if (e.exclude !== undefined && !(Array.isArray(e.exclude) && e.exclude.every((r) => rect(r)))) errs.push(`${where} (water): "exclude" je niz pravougaonika [x,y,w,h] u opsegu 0–100`);
      if (e.columns !== undefined) {
        const okCol = (c) => Array.isArray(c) && c.length >= 2 && c.length <= 3 && typeof c[0] === 'number' && c[0] >= 0 && c[0] <= 100 && typeof c[1] === 'number' && c[1] >= 0 && c[1] <= 1 && (c[2] === undefined || FX_COLORS.includes(c[2]));
        if (!(Array.isArray(e.columns) && e.columns.length <= 8 && e.columns.every(okCol))) errs.push(`${where} (water): "columns" je niz [x (0–100), jačina (0–1), boja?] (najviše 8; boja iz: ${FX_COLORS.join(', ')})`);
      }
    }
    if (e.rays !== undefined && typeof e.rays !== 'boolean') errs.push(`${where} (${e.type}): "rays" mora biti true/false`);
    if (e.points !== undefined) {
      const ok = Array.isArray(e.points) && e.points.length > 0 && e.points.length <= MAX_POINTS &&
        e.points.every((p) => Array.isArray(p) && p.length === 2 && p.every((v) => typeof v === 'number' && v >= 0 && v <= 100));
      if (!ok) errs.push(`${where} (twinkle): "points" je niz od 1–${MAX_POINTS} parova [x,y], svaki 0–100`);
    }
  });
  return errs;
};
