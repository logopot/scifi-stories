// "Materija" koja nije svetlo: dim, magla (u koordinatama slike, sloj M) te sneg i kiša (u koordinatama ekrana).
// Fabrike vraćaju instance sa draw(env); env je isti kao u fxLights.js, plus env.w/env.h (veličina ekrana u px) i env.wind.
import { fxStyle } from './fxStyle';
import * as sprites from './fxSprites';
import { pick, rand } from './fxSignals';

const S = fxStyle;
const TAU = Math.PI * 2;

// --- smoke: veliki meki puffovi koji se šire, vrte i nestaju; vetar ih nosi, blizu izvora su topli, gore hladni ---
export const makeSmoke = (e, warmColor, coolColor, puffCount) => {
  const c = S.smoke;
  const spawn = (age) => ({
    age, life: pick(c.life), rise: pick(c.rise), grow: pick(c.grow), variant: Math.floor(Math.random() * sprites.SMOKE_VARIANTS),
    rot: rand(0, TAU), spin: rand(-c.spin, c.spin), ox: rand(-0.5, 0.5), dx: 0, ph: rand(0, TAU), peak: rand(0.7, 1.15),
  });
  const puffs = Array.from({ length: puffCount }, (_, i) => spawn((i / puffCount) * pick(c.life)));
  return {
    kind: 'smoke', level: 1, count: puffCount,
    draw(env) {
      const M = env.M;
      const u = env.u;
      const x0 = env.px(e.x);
      const y0 = env.py(e.y);
      for (const p of puffs) {
        if (!env.still) p.age += env.dt;
        if (p.age > p.life) Object.assign(p, spawn(0));
        const a = env.still ? 0.3 + (p.ph / TAU) * 0.3 : p.age / p.life;
        p.dx += (env.wind.base * c.windPx + env.wind.push * 2 + Math.sin(env.t * 0.4 + p.ph) * 0.15) * e.w * u * env.dt * (0.3 + a);
        const size = e.w * u * (0.7 + (p.grow - 0.7) * a);
        const x = x0 + p.ox * e.w * u + p.dx;
        const y = y0 - p.rise * a * p.life * u;
        const alpha = c.alpha * p.peak * Math.pow(Math.sin(Math.PI * Math.min(1, a)), 1.3) * S.intensity;
        if (alpha <= 0.001) continue;
        const warm = Math.max(0, 1 - a / c.warmEnd);
        M.save();
        M.translate(x, y);
        M.rotate(p.rot + p.spin * (env.still ? 0 : p.age));
        if (warm > 0.02) {
          M.globalAlpha = alpha * warm;
          M.drawImage(sprites.smokeSprite('warm', warmColor, p.variant), -size, -size, size * 2, size * 2);
        }
        M.globalAlpha = alpha * (1 - warm * 0.75);
        M.drawImage(sprites.smokeSprite('cool', coolColor, p.variant), -size, -size, size * 2, size * 2);
        M.restore();
      }
    },
  };
};

// --- mist: 2–3 pre-renderovane teksture šuma, različite brzine (paralaksa), više u donjoj trećini ---
export const makeMist = (coolColor) => {
  const m = S.mist;
  const bands = m.bands.map((b, i) => ({ ...b, tex: sprites.mistTexture(b.seed, coolColor), off: rand(0, 1), idx: i }));
  return {
    kind: 'mist', level: 1,
    draw(env) {
      const M = env.M;
      const { rect } = env;
      for (const b of bands) {
        if (!env.still) b.off = (b.off + b.speed * env.dt + 1) % 1;
        const h = rect.height * b.h;
        const y = rect.top + rect.height * b.y - h / 2;
        const w = rect.width * 1.1; // jedna ploča; ponavlja se vodoravno
        M.globalAlpha = b.alpha * S.intensity * (0.85 + 0.15 * Math.sin(env.t * 0.07 + b.idx * 2));
        const sx = rect.left - b.off * w;
        for (let k = 0; k < 3; k++) {
          const x = sx + k * w;
          if (x > rect.left + rect.width || x + w < rect.left) continue;
          M.drawImage(b.tex, x, y, w, h);
        }
      }
    },
  };
};

const SPRITE_PX = { sharp: 1, soft: 1, bokeh: 1 };

// --- snow: tri sloja dubine, mekani sprajtovi, nepravilan pad, nalet vetra ---
export const makeSnow = (count, pal, speed = 1) => {
  const c = S.snow;
  const flakes = [];
  c.layers.forEach((layer, li) => {
    const n = Math.max(1, Math.round(count * layer.share));
    for (let i = 0; i < n; i++) {
      flakes.push({
        li, x: Math.random(), y: Math.random(), size: pick(layer.size), vy: pick(layer.vy) * speed, alpha: pick(layer.alpha),
        ph: rand(0, TAU), ph2: rand(0, TAU), f: rand(0.4, 1.1), f2: rand(1.1, 2.7), sway: layer.sway * rand(0.6, 1.3), wind: layer.wind * rand(0.8, 1.2),
      });
    }
  });
  return {
    kind: 'snow', level: 1, count: flakes.length,
    draw(env) {
      const M = env.M;
      const w = env.wind;
      const dt = env.dt;
      for (const p of flakes) {
        p.y += p.vy * dt;
        p.x += (Math.cos(p.ph + p.f * env.t) * p.sway + Math.cos(p.ph2 + p.f2 * env.t) * p.sway * 0.4 + (w.base * 0.012 + w.push) * p.wind) * dt;
        if (p.y > 1.04) {
          p.y = -rand(0.01, 0.12);
          p.x = Math.random();
        }
        if (p.x > 1.05) p.x -= 1.1;
        else if (p.x < -0.05) p.x += 1.1;
        const layer = c.layers[p.li];
        const sz = p.size * SPRITE_PX[layer.kind];
        M.globalAlpha = p.alpha * S.intensity;
        M.drawImage(sprites.flake(layer.kind, pal), p.x * env.w - sz, p.y * env.h - sz, sz * 2, sz * 2);
      }
    },
  };
};

// --- rain: tanke blago nagnute crte, dva sloja dubine, povremeni jači naleti ---
export const makeRain = (count, pal, speed = 1) => {
  const c = S.rain;
  const drops = [];
  c.layers.forEach((layer, li) => {
    const n = Math.max(1, Math.round(count * layer.share));
    for (let i = 0; i < n; i++) drops.push({ li, x: Math.random(), y: Math.random(), len: pick(layer.len), vy: pick(layer.vy) * speed, alpha: pick(layer.alpha) });
  });
  return {
    kind: 'rain', level: 1, count: drops.length,
    draw(env) {
      const M = env.M;
      const g = env.wind.gust;
      const tilt = c.tilt * (1 + g * 0.8) + env.wind.base * 0.03;
      for (const d of drops) {
        d.y += d.vy * env.dt;
        d.x += Math.tan(tilt) * d.vy * env.dt * (env.h / env.w);
        if (d.y > 1.05) {
          d.y = -rand(0, 0.15);
          d.x = Math.random();
        } else if (d.x > 1.05) d.x -= 1.1;
        else if (d.x < -0.05) d.x += 1.1;
        const layer = c.layers[d.li];
        M.globalAlpha = Math.min(1, d.alpha * (1 + g * c.gust.boost)) * S.intensity;
        M.save();
        M.translate(d.x * env.w, d.y * env.h);
        M.rotate(tilt);
        M.drawImage(sprites.streak(pal), -layer.width, -d.len, layer.width * 2, d.len);
        M.restore();
      }
    },
  };
};
