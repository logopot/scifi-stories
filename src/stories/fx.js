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
  screen: { required: [], optional: ['x', 'y', 'w', 'h', 'quad', 'style', 'color', 'intensity', 'speed', 'spill', 'exclude', 'lumaGate'] },
  screens: { required: ['screens'], optional: ['exclude', 'lumaGate'] },
  water: { required: ['x', 'y', 'w', 'h'], optional: ['ripple', 'glints', 'columns', 'exclude', 'color'] },
};

export const FIRE_SOURCES = ['painted', 'drawn'];
export const SCREEN_STYLES = ['data', 'scan', 'pulse', 'alert'];
export const MAX_SCREENS = 12;
const RANGES = { ripple: [0, 1], glints: [0, 14], intensity: [0, 1], spill: [0, 1], x: [0, 100], y: [0, 100], r: [0.1, 60], w: [0.1, 100], h: [0.1, 100], flicker: [0, 1], density: [0, 1], speed: [0.1, 5] };

// Jedan ekran: pravougaonik (x,y,w,h) ILI quad (4 tačke [x,y]); style, color, intensity, speed, spill.
const SCREEN_KEYS = ['x', 'y', 'w', 'h', 'quad', 'style', 'color', 'intensity', 'speed', 'spill', 'exclude', 'lumaGate'];

// Izuzete oblasti: [x,y,w,h] | {cx,cy,rx,ry,rot?} | {points: [[x,y],...≥3]} (sve u % slike)
const checkExclude = (list, where, errs) => {
  const num = (v, lo, hi) => typeof v === 'number' && Number.isFinite(v) && v >= lo && v <= hi;
  if (!Array.isArray(list)) return errs.push(`${where}: "exclude" mora biti niz oblasti`);
  list.forEach((a, i) => {
    const w2 = `${where}.exclude[${i}]`;
    if (Array.isArray(a)) {
      if (!(a.length === 4 && num(a[0], 0, 100) && num(a[1], 0, 100) && num(a[2], 0.01, 100) && num(a[3], 0.01, 100) && a[0] + a[2] <= 100 + 1e-6 && a[1] + a[3] <= 100 + 1e-6)) errs.push(`${w2}: pravougaonik je [x, y, w, h] u opsegu 0–100 (w, h > 0, x+w i y+h najviše 100)`);
    } else if (a && typeof a === 'object' && a.points !== undefined) {
      const ok = Array.isArray(a.points) && a.points.length >= 3 && a.points.length <= 40 && a.points.every((p) => Array.isArray(p) && p.length === 2 && num(p[0], 0, 100) && num(p[1], 0, 100));
      if (!ok || Object.keys(a).some((k) => k !== 'points')) errs.push(`${w2}: poligon je { "points": [[x,y], ...] } sa 3–40 tačaka u opsegu 0–100`);
    } else if (a && typeof a === 'object') {
      const ok = num(a.cx, 0, 100) && num(a.cy, 0, 100) && num(a.rx, 0.01, 100) && num(a.ry, 0.01, 100) && (a.rot === undefined || num(a.rot, -360, 360));
      if (!ok || Object.keys(a).some((k) => !['cx', 'cy', 'rx', 'ry', 'rot'].includes(k))) errs.push(`${w2}: elipsa je { "cx", "cy", "rx", "ry", "rot"? } (cx, cy 0–100, rx, ry > 0, rot u stepenima)`);
    } else errs.push(`${w2}: oblast mora biti [x,y,w,h], elipsa ili poligon`);
  });
  return undefined;
};
const checkScreen = (d, where, errs, typed = false) => {
  if (!d || typeof d !== 'object' || Array.isArray(d)) return errs.push(`${where}: ekran mora biti objekat`);
  for (const k of Object.keys(d)) if (!SCREEN_KEYS.includes(k) && !(typed && k === 'type')) errs.push(`${where}: nepoznato polje "${k}"`);
  const num = (v, lo, hi) => typeof v === 'number' && Number.isFinite(v) && v >= lo && v <= hi;
  if (d.quad !== undefined) {
    const ok = Array.isArray(d.quad) && d.quad.length === 4 && d.quad.every((p) => Array.isArray(p) && p.length === 2 && num(p[0], 0, 100) && num(p[1], 0, 100));
    if (!ok) errs.push(`${where}: "quad" mora imati tačno 4 tačke [x,y] (0–100): gore-levo, gore-desno, dole-desno, dole-levo`);
  } else {
    const ok = num(d.x, 0, 100) && num(d.y, 0, 100) && num(d.w, 0.1, 100) && num(d.h, 0.1, 100) && d.x + d.w <= 100 + 1e-6 && d.y + d.h <= 100 + 1e-6;
    if (!ok) errs.push(`${where}: ekran traži "quad" ili x, y, w, h (w, h > 0; x+w i y+h najviše 100)`);
  }
  if (d.style !== undefined && !SCREEN_STYLES.includes(d.style)) errs.push(`${where}: nepoznat style "${d.style}" (dozvoljeno: ${SCREEN_STYLES.join(', ')})`);
  if (d.color !== undefined && !FX_COLORS.includes(d.color)) errs.push(`${where}: nepoznata boja "${d.color}"`);
  if (d.intensity !== undefined && !num(d.intensity, 0, 1)) errs.push(`${where}: "intensity" mora biti 0–1`);
  if (d.speed !== undefined && !num(d.speed, 0.2, 2)) errs.push(`${where}: "speed" mora biti 0.2–2`);
  if (d.spill !== undefined && !num(d.spill, 0, 1)) errs.push(`${where}: "spill" mora biti 0–1`);
  if (d.lumaGate !== undefined && !num(d.lumaGate, 0, 1)) errs.push(`${where}: "lumaGate" mora biti 0–1`);
  if (d.exclude !== undefined) checkExclude(d.exclude, where, errs);
  return undefined;
};

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
    if (e.type === 'screens') {
      if (!Array.isArray(e.screens) || e.screens.length < 1 || e.screens.length > MAX_SCREENS) errs.push(`${where} (screens): "screens" je niz od 1–${MAX_SCREENS} ekrana`);
      else e.screens.forEach((d, j) => checkScreen(d, `${where}.screens[${j}]`, errs));
      if (e.lumaGate !== undefined && !(typeof e.lumaGate === 'number' && e.lumaGate >= 0 && e.lumaGate <= 1)) errs.push(`${where} (screens): "lumaGate" mora biti 0–1`);
      if (e.exclude !== undefined) checkExclude(e.exclude, `${where} (screens)`, errs);
      return;
    }
    if (e.type === 'screen') checkScreen(e, where, errs, true);
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
