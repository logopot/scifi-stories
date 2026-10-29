// Izvori svetla (glow, fire, sun, twinkle) i prašina u njihovoj blizini. Svaka fabrika vraća instancu sa draw(env).
// env: { L, M, t, dt, u, still, px(x), py(y), intensity } — L je sloj svetla (screen), M sloj materije; oba su već u koordinatama slike.
// Dužine u fxStyle su u % širine slike; ovde se množe sa env.u (px po 1%).
import { fxStyle } from './fxStyle';
import * as sprites from './fxSprites';
import { intensity, makeFlicker, pick, rand } from './fxSignals';
import { makePainted } from './fxPainted';

const S = fxStyle;
const TAU = Math.PI * 2;

// Sprajt centriran u (x, y); half = poluprečnik, squash = visina/širina (elipsa), rot = nagib (rad).
const blob = (ctx, img, x, y, half, alpha, squash = 1, rot = 0) => {
  if (alpha <= 0.002) return;
  ctx.globalAlpha = alpha;
  if (rot) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.drawImage(img, -half, -half * squash, half * 2, half * 2 * squash);
    ctx.restore();
  } else ctx.drawImage(img, x - half, y - half * squash, half * 2, half * 2 * squash);
};

// Bazen svetla na podlozi ispod izvora: spljošten, blago nagnut, sporiji i slabiji od izvora.
const pool = (env, pal, x, y, r, alpha, level, tilt) => {
  const p = S.pool;
  blob(env.L, sprites.deep(pal), x, y + r * p.dy * env.u, r * p.width * env.u * 0.5, alpha * p.alpha * level * S.intensity, p.height, tilt);
};

// --- glow: lampa, fenjer, prozor, farovi ---
export const makeGlow = (e, pal) => {
  const g = S.glow;
  const flicker = e.flicker ?? 0.3;
  const isWindow = pal.cold && flicker <= g.window.maxFlicker;
  const sig = makeFlicker(isWindow ? 0.3 : 1);
  const tilt = (Math.random() < 0.5 ? -1 : 1) * rand(0.3, 1) * g.haloTilt;
  const ph = rand(0, TAU);
  const hasCone = !isWindow && !pal.cold && flicker >= g.cone.minFlicker;
  const inst = {
    kind: 'glow', x: e.x, y: e.y, r: e.r, level: 1, pal,
    draw(env) {
      const s = sig(env.t, env.still);
      let I;
      if (isWindow) I = 1 + g.window.pulse * Math.sin(TAU * g.window.pulseHz * env.t + ph) + g.window.pulse * 0.5 * Math.sin(TAU * g.window.pulseHz * 0.37 * env.t + ph * 2);
      else I = intensity(s, flicker) * (flicker === 0 ? 1 + 0.02 * Math.sin(TAU * 0.13 * env.t + ph) : 1);
      if (env.still) I = 1;
      inst.level = I;
      const x = env.px(e.x) + s.dx;
      const y = env.py(e.y) + s.dy;
      const R = e.r * env.u;
      const k = S.intensity;
      const L = env.L;
      blob(L, sprites.soft(pal), x, y, R * g.bloomRadius, (isWindow ? g.window.bloomAlpha : g.bloomAlpha) * I * k, 0.86, tilt * 0.5);
      const haloA = (isWindow ? g.window.haloAlpha : g.haloAlpha) * I * k;
      // boja: jezgro belje na vrhuncu, toplije (dublje) na dnu treperenja
      blob(L, sprites.soft(pal), x, y, R * g.haloRadius, haloA * (0.45 + 0.55 * s.peak), g.haloSquash, tilt);
      blob(L, sprites.deep(pal), x, y, R * g.haloRadius * 1.05, haloA * (0.25 + 0.55 * (1 - s.peak)), g.haloSquash, tilt);
      if (hasCone) blob2(L, sprites.cone(pal), x, y, R * g.cone.width, R * g.cone.length, g.cone.alpha * I * k);
      const coreR = Math.min(g.coreRadius * (0.75 + 0.25 * Math.sqrt(e.r / 4)), e.r * 0.5) * env.u;
      blob(L, sprites.dot(pal), x, y, coreR * 2.1, (isWindow ? g.window.coreAlpha : g.coreAlpha) * (0.55 + 0.45 * s.peak) * I * k);
      pool(env, pal, x, y, e.r * (isWindow ? 0.6 : 0.5), (isWindow ? 0.9 : 1), 1 + (I - 1) * S.pool.slow, tilt);
    },
  };
  return inst;
};

// Vertikalni sprajt (vrh je izvor): w širina, len dužina.
const blob2 = (ctx, img, x, y, halfW, len, alpha) => {
  ctx.globalAlpha = alpha;
  ctx.drawImage(img, x - halfW, y, halfW * 2, len);
};

// --- fire: peć / vatra od izduženih mekih jezička ---
export const makeFire = (e, pal) => {
  const f = S.fire;
  const painted = (e.source || 'painted') === 'painted';
  const flame = painted ? makePainted(e, pal) : null;
  const sig = makeFlicker(1);
  const breathPh = rand(0, TAU);
  const tongues = Array.from({ length: f.tongues }, (_, i) => ({
    ph: i / f.tongues + rand(-0.08, 0.08),
    period: pick(f.period),
    variant: i % sprites.TONGUE_VARIANTS,
    wm: rand(0.75, 1.15),
    hm: rand(0.7, 1.1),
    side: rand(-0.35, 0.35),
    rot: rand(0.6, 1.3) * (Math.random() < 0.5 ? -1 : 1),
  }));
  const sparkList = [];
  let nextSpark = rand(0.5, f.sparks.every[1]);
  const puffs = Array.from({ length: f.smoke.puffs }, (_, i) => ({ ph: i / f.smoke.puffs, life: rand(2.6, 3.6), variant: i % sprites.SMOKE_VARIANTS, off: rand(-0.3, 0.3) }));
  const inst = {
    kind: 'fire', x: e.x, y: e.y, r: e.r, level: 1, pal,
    draw(env) {
      const s = sig(env.t, env.still);
      const I = env.still ? 1 : intensity(s, f.flicker);
      inst.level = I;
      const u = env.u;
      const R = e.r * u;
      const x = env.px(e.x) + s.dx;
      const y = env.py(e.y) + s.dy;
      const breath = env.still ? 1 : 1 + f.breath * (0.5 * Math.sin(TAU * 0.31 * env.t + breathPh) + 0.5 * s.v);
      const L = env.L;
      const k = S.intensity;
      const hs = painted ? f.painted.haloScale : 1;
      inst.sig = s;
      blob(L, sprites.soft(pal), x, y - R * 0.5, R * 3.4, f.bloomAlpha * I * k * hs, 0.9);
      blob(L, sprites.soft(pal), x, y - R * 0.4, R * 1.5, f.haloAlpha * I * k * hs * (0.55 + 0.45 * s.peak), 1.05);
      blob(L, sprites.deep(pal), x, y - R * 0.3, R * 1.6, f.haloAlpha * 0.8 * I * k * hs * (0.5 + 0.5 * (1 - s.peak)), 1.05);
      // nacrtani jezičci (samo source: 'drawn'): dižu se, uvijaju i nestaju
      for (const tg of painted ? [] : tongues) {
        const a = env.still ? 0.45 : (env.t / tg.period + tg.ph) % 1;
        const rise = a * f.height * R * 0.62 * tg.hm * breath;
        const h = f.height * R * tg.hm * breath * (1 - 0.45 * a);
        const w = f.width * R * tg.wm * (1 - 0.5 * a);
        const alpha = Math.pow(Math.sin(Math.PI * a), 0.9) * f.alpha * I * k;
        const sway = Math.sin(a * 5.2 + tg.ph * 9) * R * 0.28 * a + tg.side * R * (1 - a);
        L.globalAlpha = alpha;
        L.save();
        L.translate(x + sway, y + R * 0.25 - rise);
        L.rotate(Math.sin(a * 4.4 + tg.ph * 7) * 0.32 * tg.rot * a);
        L.drawImage(sprites.tongue(pal, tg.variant), -w / 2, -h, w, h);
        L.restore();
      }
      pool(env, pal, x, y, e.r * 0.9, 1.5, 1 + (I - 1) * S.pool.slow, 0.04);
      inst.at = { x, y, R };
      if (env.still) return;
      // povremene iskre sa kratkim repom
      const sp = f.sparks;
      if (env.t > nextSpark) {
        nextSpark = env.t + pick(sp.every) * (env.phone ? 1.6 : 1);
        if (sparkList.length < (env.phone ? sp.maxPhone : sp.max))
          sparkList.push({ t0: env.t, life: pick(sp.life), x0: (Math.random() - 0.5) * R * 0.6, vx: rand(-0.5, 0.5) * R * 0.5, vy: -pick(sp.rise) * R, amp: rand(0.15, 0.45) * R, fr: rand(2, 4.2), ph: rand(0, TAU), size: rand(0.7, 1.2) });
      }
      for (let i = sparkList.length - 1; i >= 0; i--) {
        const p = sparkList[i];
        const age = env.t - p.t0;
        if (age > p.life) {
          sparkList.splice(i, 1);
          continue;
        }
        for (let tail = 0; tail < sp.tail; tail++) {
          const tt = Math.max(0, age - tail * sp.tailStep);
          const q = tt / p.life;
          const px = x + p.x0 + p.vx * tt + Math.sin(p.fr * tt + p.ph) * p.amp * q;
          const py = y + R * 0.2 + p.vy * tt * (1 - 0.25 * q);
          const fade = Math.pow(1 - age / p.life, 1.3) * (1 - tail / (sp.tail + 0.6));
          blob(L, sprites.spark(pal), px, py, sp.size * u * p.size * (1 - tail * 0.2) * 1.4, sp.alpha * fade * k);
        }
      }
      inst.at = { x, y, R };
    },
    // naslikani plamen: talasanje izrezanog područja slike (sloj materije)
    drawPainted(env) {
      if (flame && inst.sig) flame.draw(env, inst.sig);
    },
    // tanak tamni dim iznad vrha plamena (crta se u sloju materije)
    drawSmoke(env) {
      if (env.still || !inst.at) return;
      const { x, y, R } = inst.at;
      const M = env.M;
      for (const pf of puffs) {
        const a = (env.t / pf.life + pf.ph) % 1;
        const size = R * (0.9 + 1.5 * a);
        const yy = y - f.height * R * 0.85 - a * R * 2.2;
        const xx = x + pf.off * R + env.wind.base * a * R * 0.8;
        M.globalAlpha = f.smoke.alpha * Math.sin(Math.PI * a) * S.intensity;
        M.drawImage(sprites.smokeSprite('dark', pal.mid, pf.variant), xx - size, yy - size, size * 2, size * 2);
      }
    },
  };
  return inst;
};

// --- sun: veliki mek sjaj sa slabim zracima koji vrlo sporo dišu ---
export const makeSun = (e, pal) => {
  const c = S.sun;
  const ph = [rand(0, TAU), rand(0, TAU), rand(0, TAU)];
  const rays = Array.from({ length: c.rays.count }, (_, i) => ({ ang: (i / c.rays.count) * TAU + rand(-0.2, 0.2), len: pick(c.rays.length), w: rand(0.7, 1.3), ph: rand(0, TAU) }));
  const inst = {
    kind: 'sun', x: e.x, y: e.y, r: e.r, level: 1, pal,
    draw(env) {
      const I = env.still ? 1 : 1 + c.breath[0] * Math.sin(TAU * c.breathHz[0] * env.t + ph[0]) + c.breath[1] * Math.sin(TAU * c.breathHz[1] * env.t + ph[1]);
      inst.level = I;
      const x = env.px(e.x);
      const y = env.py(e.y);
      const R = e.r * env.u;
      const k = S.intensity;
      const L = env.L;
      blob(L, sprites.soft(pal), x, y, R * c.bloomRadius, c.bloomAlpha * I * k, 0.92);
      blob(L, sprites.soft(pal), x, y, R * c.haloRadius, c.haloAlpha * I * k);
      blob(L, sprites.dot(pal), x, y, R * c.coreRadius * 2, c.coreAlpha * I * k);
      if (e.rays) {
        for (const ry of rays) {
          const breathe = env.still ? 1 : 1 + 0.12 * Math.sin(TAU * c.rays.breathHz * env.t + ry.ph);
          const len = ry.len * R * breathe;
          L.globalAlpha = c.rays.alpha * I * k * (0.7 + 0.3 * breathe);
          L.save();
          L.translate(x, y);
          L.rotate(ry.ang);
          L.drawImage(sprites.ray(pal), (-c.rays.width * R * ry.w) / 2, 0, c.rays.width * R * ry.w, len);
          L.restore();
        }
      }
      // toplo pojačanje horizonta ispod sunca
      blob(L, sprites.deep(pal), x, y + R * 1.8, c.horizon.width * env.u * 0.5, c.horizon.alpha * I * k, c.horizon.height);
    },
  };
  return inst;
};

// --- twinkle: niz fenjera/prozora, svako sa svojim ritmom ---
export const makeTwinkle = (e, pal) => {
  const t = S.twinkle;
  const r = e.r ?? 1.4;
  const lamps = e.points.map(([x, y]) => ({ x, y, sig: makeFlicker(rand(t.hzScale[0], t.hzScale[1])), base: rand(0.7, 1) }));
  return {
    kind: 'twinkle', level: 1, pal, points: e.points, r,
    draw(env) {
      const k = S.intensity;
      for (const lp of lamps) {
        const s = lp.sig(env.t, env.still);
        const I = env.still ? 1 : intensity(s, t.flicker) * lp.base;
        const x = env.px(lp.x) + s.dx * 0.5;
        const y = env.py(lp.y) + s.dy * 0.5;
        const R = r * env.u;
        blob(env.L, sprites.soft(pal), x, y, R * t.haloRadius, t.haloAlpha * I * k * (0.5 + 0.5 * s.peak));
        blob(env.L, sprites.dot(pal), x, y, R * t.coreRadius * 2, t.coreAlpha * I * k * (0.6 + 0.4 * s.peak));
      }
    },
  };
};

// --- dust: sitna prašina vidljiva samo u zonama koje svetle, sa sporim Braunovim lutanjem ---
export const makeDust = (count, sources) => {
  const d = S.dust;
  if (!sources.length || count <= 0) return null;
  const motes = Array.from({ length: count }, (_, i) => {
    const src = sources[i % sources.length];
    const ang = rand(0, TAU);
    const rad = Math.sqrt(Math.random());
    return { src, ox: Math.cos(ang) * rad, oy: Math.sin(ang) * rad * 0.8 + 0.25, vx: 0, vy: 0, ph: rand(0, TAU), size: pick(d.size), alpha: pick(d.alpha) };
  });
  return {
    kind: 'dust', level: 1, motes,
    draw(env) {
      if (env.still) return;
      const L = env.L;
      const sprite = (m) => sprites.dot(m.src.pal);
      for (const m of motes) {
        const reach = m.src.r * d.reach;
        m.vx += (Math.random() - 0.5) * d.wander * env.dt * 0.9 - m.vx * 1.4 * env.dt;
        m.vy += (Math.random() - 0.5) * d.wander * env.dt * 0.9 - m.vy * 1.4 * env.dt;
        m.ox += m.vx * env.dt;
        m.oy += m.vy * env.dt;
        const dist = Math.hypot(m.ox, m.oy);
        if (dist > 1) {
          m.ox *= 0.96 / dist;
          m.oy *= 0.96 / dist;
        }
        const lit = Math.pow(Math.max(0, 1 - dist), 1.4) * m.src.level;
        const twinkle = 0.65 + 0.35 * Math.sin(env.t * 0.9 + m.ph);
        const x = env.px(m.src.x) + m.ox * reach * env.u;
        const y = env.py(m.src.y) + m.oy * reach * env.u;
        blob(L, sprite(m), x, y, m.size * 1.5, m.alpha * lit * twinkle * S.intensity);
      }
    },
  };
};
