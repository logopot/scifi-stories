// Engine efekata jedne scene: JEDNA rAF petlja, dva canvasa (svetlo = screen mešanje preko slike, materija = normalno).
// Pomeranje (drift) slike se čita iz stvarne <img> matrice, pa efekti prate sliku tačno. Koordinate u fx su % SLIKE.
import { fxStyle } from './fxStyle';
import * as sprites from './fxSprites';
import { coverRect, makeWind, parseFocus } from './fxSignals';
import { makeDust, makeFire, makeGlow, makeSun, makeTwinkle } from './fxLights';
import { makeMist, makeRain, makeSmoke, makeSnow } from './fxMatter';

const S = fxStyle;
const PARTICLE_TYPES = ['snow', 'dust', 'rain'];
const DEFAULT_COLOR = { glow: 'fxWarm', fire: 'fxWarm', sun: 'fxSun', twinkle: 'fxWarm', smoke: 'fxCold', snow: 'fxCold', dust: 'fxWarm', rain: 'fxCold', mist: 'fxCold' };

// Pravi engine. opts: { light, matter, root, fx, theme, phone, reduced, imgSize, focus }
export function createFxEngine(opts) {
  const { light, matter, root, fx, theme, phone, reduced, imgSize, focus } = opts;
  const lctx = light.getContext('2d');
  const mctx = matter.getContext('2d');
  const palFor = (e) => {
    const token = e.color || DEFAULT_COLOR[e.type];
    return sprites.paletteFor(token, theme[token]);
  };
  const cap = phone ? S.caps.phone : S.caps.desktop;

  // --- instance efekata ---
  const lights = [];
  const matterItems = []; // u koordinatama slike (dim, magla)
  const screenItems = []; // u koordinatama ekrana (sneg, kiša)
  const sources = [];
  let hasPainted = false;
  for (const e of fx) {
    const pal = palFor(e);
    if (e.type === 'glow') sources.push(lights[lights.push(makeGlow(e, pal)) - 1]);
    else if (e.type === 'fire') {
      const fire = makeFire(e, pal);
      sources.push(lights[lights.push(fire) - 1]);
      if (fire.drawPainted && (e.source || 'painted') === 'painted') {
        matterItems.push({ draw: fire.drawPainted });
        hasPainted = true;
      }
      matterItems.push({ draw: fire.drawSmoke });
    }
    else if (e.type === 'sun') sources.push(lights[lights.push(makeSun(e, pal)) - 1]);
    else if (e.type === 'twinkle') lights.push(makeTwinkle(e, pal));
  }
  // Budžet čestica: puffovi dima imaju prednost, ostatak ide na sneg / prašinu / kišu srazmerno gustini.
  const smokes = fx.filter((e) => e.type === 'smoke');
  const perSmoke = smokes.length ? Math.max(2, Math.min(S.smoke.puffs, Math.floor((cap * 0.45) / smokes.length), phone ? 3 : 99)) : 0;
  for (const e of smokes) {
    const pal = palFor(e);
    const warm = sprites.paletteFor('fxWarm', theme.fxWarm);
    matterItems.push(makeSmoke(e, warm.mid, pal.mid, perSmoke));
  }
  const budget = cap - perSmoke * smokes.length;
  const dens = (e) => e.density ?? { snow: 0.6, dust: 0.5, rain: 0.6 }[e.type];
  const particleDefs = fx.filter((e) => PARTICLE_TYPES.includes(e.type));
  const sum = particleDefs.reduce((s, e) => s + dens(e), 0) || 1;
  const snowCfg = fx.find((e) => e.type === 'snow');
  const rainCfg = fx.find((e) => e.type === 'rain');
  for (const e of particleDefs) {
    const n = Math.max(1, Math.floor((budget * dens(e)) / Math.max(sum, 1)));
    const pal = palFor(e);
    if (e.type === 'snow') screenItems.push(makeSnow(n, pal, e.speed ?? 1));
    else if (e.type === 'rain') screenItems.push(makeRain(n, pal, e.speed ?? 1));
    else if (e.type === 'dust') {
      const dust = makeDust(Math.round(n * 0.8), sources);
      if (dust) lights.push(dust);
    }
  }
  if (fx.some((e) => e.type === 'mist')) matterItems.push(makeMist(sprites.parseColor(theme.fxCold)));
  const wind = makeWind((snowCfg && S.snow.gust) || (rainCfg && S.rain.gust) || S.snow.gust);

  const counts = {
    lights: lights.length,
    smokePuffs: perSmoke * smokes.length,
    particles: screenItems.reduce((s, i) => s + i.count, 0) + lights.filter((l) => l.kind === 'dust').reduce((s, l) => s + l.motes.length, 0),
  };

  // --- razmera i geometrija ---
  let cw = 0;
  let ch = 0;
  let rect = { left: 0, top: 0, width: 1, height: 1 };
  let dpr = 1;
  let mScale = 1;
  const ls = S.lightScale;
  const resize = () => {
    cw = root.clientWidth;
    ch = root.clientHeight;
    dpr = Math.min(window.devicePixelRatio || 1, S.maxDpr);
    light.width = Math.max(1, Math.round(cw * ls));
    light.height = Math.max(1, Math.round(ch * ls));
    // dim i magla su mekani: bez snega/kiše (oštre čestice) sloj materije ide u nižoj rezoluciji
    mScale = screenItems.length || hasPainted ? dpr : S.softScale;
    matter.width = Math.max(1, Math.round(cw * mScale));
    matter.height = Math.max(1, Math.round(ch * mScale));
    if (imgSize && cw && ch) rect = coverRect(cw, ch, imgSize.w, imgSize.h, parseFocus(focus));
    if (reduced) frame(performance.now(), true);
  };

  const img = root.parentElement && root.parentElement.querySelector('img');
  const identity = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };
  const driftMatrix = () => {
    if (!img) return identity;
    const tr = getComputedStyle(img).transform;
    if (!tr || tr === 'none') return identity;
    const m = new DOMMatrixReadOnly(tr);
    // transform-origin: sredina; kompozicija T(c)·M·T(−c)
    const x = cw / 2;
    const y = ch / 2;
    return { a: m.a, b: m.b, c: m.c, d: m.d, e: x - m.a * x - m.c * y + m.e, f: y - m.b * x - m.d * y + m.f };
  };

  const grain = sprites.grainTile();
  let grainPattern = null;
  let grainShift = 0;
  let grainAt = 0;

  const env = {
    L: lctx, M: mctx, img, imgSize, phone, t: 0, dt: 0.016, u: 1, still: false, w: 0, h: 0, rect, wind: { base: 0, gust: 0, push: 0 },
    px: (x) => rect.left + (x / 100) * rect.width,
    py: (y) => rect.top + (y / 100) * rect.height,
  };

  const stats = { frames: 0, ms: 0, worst: 0 };
  let t0 = performance.now();
  let last = t0;
  let raf = 0;
  let visible = true;
  let destroyed = false;

  function frame(now, once) {
    if (destroyed || !cw || !ch) return;
    const started = performance.now();
    const t = (now - t0) / 1000;
    env.dt = once ? 0 : Math.min(0.05, (now - last) / 1000 || 0.016);
    last = now;
    env.t = once ? 8 : t;
    env.still = Boolean(once || reduced);
    env.u = rect.width / 100;
    env.rect = rect;
    env.w = cw;
    env.h = ch;
    env.wind = wind(env.t, env.still);

    // svetlo (u koordinatama slike, sa pomeranjem)
    const T = driftMatrix();
    lctx.setTransform(1, 0, 0, 1, 0, 0);
    lctx.globalCompositeOperation = 'source-over';
    lctx.globalAlpha = 1;
    lctx.clearRect(0, 0, light.width, light.height);
    lctx.globalCompositeOperation = 'lighter';
    lctx.setTransform(ls * T.a, ls * T.b, ls * T.c, ls * T.d, ls * T.e, ls * T.f);
    for (const item of lights) item.draw(env);

    // zrnatost preko svetla: tekstura se samo pomera
    if (S.grain.strength > 0 && lights.length) {
      if (!grainPattern) grainPattern = lctx.createPattern(grain, 'repeat');
      if (now - grainAt > S.grain.shiftMs) {
        grainAt = now;
        grainShift = Math.floor(Math.random() * 1000);
      }
      lctx.setTransform(1, 0, 0, 1, 0, 0);
      lctx.globalAlpha = 1;
      lctx.globalCompositeOperation = 'destination-in';
      lctx.fillStyle = grainPattern;
      lctx.translate(grainShift % 97, (grainShift * 7) % 89);
      lctx.fillRect(-100, -100, light.width + 200, light.height + 200);
    }

    // materija
    mctx.setTransform(1, 0, 0, 1, 0, 0);
    mctx.globalAlpha = 1;
    mctx.clearRect(0, 0, matter.width, matter.height);
    mctx.setTransform(mScale * T.a, mScale * T.b, mScale * T.c, mScale * T.d, mScale * T.e, mScale * T.f);
    for (const item of matterItems) item.draw(env);
    if (!env.still) {
      mctx.setTransform(mScale, 0, 0, mScale, 0, 0);
      for (const item of screenItems) item.draw(env);
    }

    const ms = performance.now() - started;
    stats.frames += 1;
    stats.ms += ms;
    if (ms > stats.worst) stats.worst = ms;
  }

  const minGap = 1000 / S.maxFps - 1;
  const loop = (now) => {
    raf = requestAnimationFrame(loop);
    if (now - last < minGap) return;
    frame(now);
  };
  const start = () => {
    if (reduced || raf || !visible || document.hidden || destroyed) return;
    last = performance.now();
    raf = requestAnimationFrame(loop);
  };
  const stop = () => {
    cancelAnimationFrame(raf);
    raf = 0;
  };
  const onVisibility = () => (document.hidden ? stop() : start());
  document.addEventListener('visibilitychange', onVisibility);
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) start();
    else stop();
  });
  io.observe(root);
  const ro = new ResizeObserver(resize);
  ro.observe(root);
  resize();
  if (reduced) frame(performance.now(), true);
  else start();

  return {
    counts,
    stats,
    canvases: { light, matter },
    destroy() {
      destroyed = true;
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    },
  };
}
