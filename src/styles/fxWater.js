// Voda (water): blago talasanje NAslikane vode (iseče se region iz same slike i crta red po red sa sitnim vodoravnim
// pomerajem), sitni odsjaji koji se pale i gase, i stubovi odsjaja ispod izvora svetla. Region i exclude su u % slike.
// Komad vode se crta u sloju materije (preko slike), odsjaji i stubovi u sloju svetla (screen).
import { fxStyle } from './fxStyle';
import * as sprites from './fxSprites';
import { clamp01, paletteFor, smoothstep } from './fxSprites';
import { intensity, makeFlicker, pick, rand } from './fxSignals';

const S = fxStyle;
const TAU = Math.PI * 2;
const lerp = (a, b, t) => a + (b - a) * t;
const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 0.75;

const canvas = (w, h) => {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
};

const drawSprite = (ctx, img, x, y, halfW, halfH, alpha) => {
  if (alpha <= 0.002) return;
  ctx.globalAlpha = alpha;
  ctx.drawImage(img, x - halfW, y - halfH, halfW * 2, halfH * 2);
};

// e: { x, y, w, h, ripple?, glints?, columns?, exclude?, color? } (x, y = gornji levi ugao regiona)
export const makeWater = (e, theme, phone) => {
  const C = S.water;
  const ripple = e.ripple ?? 0.4;
  const colorToken = e.color || 'fxCold';
  const pal = paletteFor(colorToken, theme[colorToken]);
  const nGlints = Math.min(e.glints ?? C.glints.max, phone ? C.glints.maxPhone : C.glints.max);
  const exclude = e.exclude || [];
  const cols = (e.columns || []).map(([x, strength, token]) => {
    const t = token || colorToken;
    return { x, strength, pal: paletteFor(t, theme[t]), ph: [rand(0, TAU), rand(0, TAU), rand(0, TAU)], bh: rand(C.columns.breakHz[0], C.columns.breakHz[1]), sig: makeFlicker(0.5) };
  });
  const ph = Array.from({ length: 6 }, () => rand(0, TAU));
  const hz = C.hz.map((h) => h * rand(0.85, 1.15));
  let st = null;
  let lastBuild = -1;

  const inExclude = (x, y) => exclude.some(([ex, ey, ew, eh]) => x >= ex && x <= ex + ew && y >= ey && y <= ey + eh);

  const build = (env) => {
    const iw = env.imgSize.w;
    const ih = env.imgSize.h;
    const sx = Math.max(0, Math.round((iw * e.x) / 100));
    const sy = Math.max(0, Math.round((ih * e.y) / 100));
    const W = Math.max(8, Math.min(iw - sx, Math.round((iw * e.w) / 100)));
    const H = Math.max(8, Math.min(ih - sy, Math.round((ih * e.h) / 100)));
    const ps = W > iw * C.bigRegion ? C.bigScale : 1;
    const pw = Math.max(8, Math.round(W * ps));
    const ph2 = Math.max(8, Math.round(H * ps));
    // maska: feather po ivicama regiona, a delovi iz exclude se izrezuju (tu se vidi original)
    const mask = canvas(pw, ph2);
    const mctx = mask.getContext('2d');
    const md = mctx.createImageData(pw, ph2);
    const fy = C.featherY;
    const fx = C.featherX;
    const ex = exclude.map(([x, y, w, h]) => {
      const lx = ((iw * x) / 100 - sx) * ps;
      const ly = ((ih * y) / 100 - sy) * ps;
      const lw = ((iw * w) / 100) * ps;
      const lh = ((ih * h) / 100) * ps;
      return { lx, ly, lw, lh, f: Math.max(3, 0.18 * Math.min(lw, lh)) };
    });
    for (let y = 0; y < ph2; y++) {
      const my = smoothstep(0, fy, (y + 0.5) / ph2) * smoothstep(0, fy * 0.6, 1 - (y + 0.5) / ph2);
      for (let x = 0; x < pw; x++) {
        let a = smoothstep(0, fx, (x + 0.5) / pw) * smoothstep(0, fx, 1 - (x + 0.5) / pw) * my;
        for (const r of ex) {
          const d = Math.min(x - r.lx, r.lx + r.lw - x, y - r.ly, r.ly + r.lh - y);
          a *= 1 - smoothstep(-r.f * 0.4, r.f, d);
        }
        const i = (y * pw + x) * 4;
        md.data[i] = md.data[i + 1] = md.data[i + 2] = 255;
        md.data[i + 3] = Math.round(a * 255);
      }
    }
    mctx.putImageData(md, 0, 0);
    const piece = canvas(pw, ph2);
    st = { iw, ih, sx, sy, W, H, ps, pw, ph: ph2, mask, piece, pctx: piece.getContext('2d'), glints: [] };
  };

  const spawnGlint = (env, g, t) => {
    const u = Math.sqrt(Math.random());
    let x;
    if (cols.length && Math.random() < C.glints.nearColumn) x = cols[Math.floor(Math.random() * cols.length)].x + gauss() * C.glints.colSigma;
    else x = e.x + Math.random() * e.w;
    x = Math.min(e.x + e.w - 0.5, Math.max(e.x + 0.5, x));
    const y = e.y + (0.04 + 0.92 * u) * e.h;
    g.ok = !inExclude(x, y);
    g.x = x;
    g.y = y;
    g.u = u;
    g.t0 = t + rand(...C.glints.gap) * (g.first ? Math.random() : 1);
    g.life = pick(C.glints.life);
    g.size = pick(C.glints.size) * (0.55 + 0.9 * u);
    g.first = false;
  };
  const glints = Array.from({ length: nGlints }, () => ({ first: true, ok: false, t0: 0, life: 1, x: 0, y: 0, u: 0, size: 0.3 }));
  let glintsInit = false;

  return {
    // Komad vode je SOPSTVENI mali canvas (veličine regiona) koji se CSS-om pomera zajedno sa slikom (drift), pa se pri
    // svakom kadru ne preslikava ceo ekran. Talasanje se računa 30 puta u sekundi.
    drawWater(env) {
      if (env.still || !env.img || !env.imgSize || ripple <= 0) {
        if (st && st.piece.style.display !== 'none') st.piece.style.display = 'none';
        return;
      }
      if (!st) {
        if (!env.img.complete || !env.img.naturalWidth) return;
        build(env);
        const el = st.piece;
        el.style.cssText = 'position:absolute;left:0;top:0;transform-origin:0 0;pointer-events:none';
        env.root.insertBefore(el, env.firstEl);
      }
      st.piece.style.display = '';
      const { sx, sy, W, ps, pw, ph: H2, pctx: pc } = st;
      const t = env.t;
      if (lastBuild < 0 || t - lastBuild >= 1 / C.fps - 0.001) {
        lastBuild = t;
        const iw = st.iw;
        const amp = ripple * C.rippleMax * (iw / 100) * (0.7 + 0.3 * Math.sin(TAU * 0.07 * t + ph[5]) + 0.15 * Math.sin(TAU * 0.19 * t + ph[4]));
        const rh = C.rowHeight;
        pc.setTransform(1, 0, 0, 1, 0, 0);
        pc.globalCompositeOperation = 'source-over';
        pc.globalAlpha = 1;
        pc.clearRect(0, 0, pw, H2);
        for (let y = 0; y < H2; y += rh) {
          const u = (y + rh / 2) / H2;
          const depth = Math.pow(u + 0.12, 0.6);
          const wave =
            C.weights[0] * Math.sin(TAU * C.cycles[0] * depth - TAU * hz[0] * t + ph[0]) +
            C.weights[1] * Math.sin(TAU * C.cycles[1] * depth - TAU * hz[1] * t + ph[1]) +
            C.weights[2] * Math.sin(TAU * C.cycles[2] * depth - TAU * hz[2] * t + ph[2]);
          const edge = smoothstep(0, 0.3, u) * (0.35 + 0.65 * u);
          const dx = amp * edge * wave;
          const srcX = Math.max(0, Math.min(st.iw - W, sx - dx));
          pc.drawImage(env.img, srcX, sy + y / ps, W, rh / ps, 0, y, pw, rh);
        }
        pc.globalCompositeOperation = 'destination-in';
        pc.drawImage(st.mask, 0, 0);
      }
      const kx = env.rect.width / st.iw;
      const ky = env.rect.height / st.ih;
      const el = st.piece;
      el.style.width = `${W * kx}px`;
      el.style.height = `${st.H * ky}px`;
      const T = env.T;
      el.style.transform = `matrix(${T.a},${T.b},${T.c},${T.d},${T.e},${T.f}) translate(${env.rect.left + sx * kx}px,${env.rect.top + sy * ky}px)`;
    },
    destroy() {
      if (st) st.piece.remove();
    },

    // odsjaji i stubovi odsjaja (sloj svetla, screen)
    drawLight(env) {
      const L = env.L;
      const u = env.u;
      const t = env.t;
      const rw = e.w * u;
      const rh = (e.h * env.rect.height) / 100;
      const top = env.py(e.y);
      // stubovi odsjaja: uzak mek trag koji se širi ka dnu, razbijen vodoravnim prekidima koji klize
      const CC = C.columns;
      for (const c of cols) {
        const s = c.sig(t, env.still);
        const I = env.still ? 1 : intensity(s, CC.flicker);
        const N = CC.segments;
        const cx = env.px(c.x);
        for (let i = 0; i < N; i++) {
          const v = (i + 0.5) / N;
          const y = top + v * rh;
          const width = lerp(CC.width[0], CC.width[1], Math.pow(v, 0.8)) * u;
          const segH = (rh / N) * 1.7;
          let brk = 0.8;
          if (!env.still) {
            brk = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(TAU * c.bh * t - i * 0.95 + c.ph[0])) * (0.65 + 0.35 * Math.sin(TAU * c.bh * 0.43 * t - i * 0.5 + c.ph[1]));
            brk = clamp01(brk);
          }
          const wob = env.still ? 0 : Math.sin(TAU * 0.3 * t + i * 0.8 + c.ph[2]) * 0.25 * width * v;
          const a = c.strength * CC.alpha * (1 - 0.5 * v) * brk * I * S.intensity;
          drawSprite(L, sprites.soft(c.pal), cx + wob, y, width / 2, segH / 2, a);
        }
      }
      if (env.still) return;
      // sitni odsjaji: svaki svojim nepravilnim ritmom
      if (!glintsInit) {
        glintsInit = true;
        for (const g of glints) spawnGlint(env, g, t);
      }
      const G = C.glints;
      for (const g of glints) {
        if (t < g.t0) continue;
        const a = (t - g.t0) / g.life;
        if (a >= 1) {
          spawnGlint(env, g, t);
          continue;
        }
        if (!g.ok) continue;
        const env2 = Math.pow(Math.sin(Math.PI * a), 2);
        const hw = (g.size * u) / 2;
        drawSprite(L, sprites.dot(pal), env.px(g.x), env.py(g.y), hw, hw * G.aspect, G.alpha * (0.4 + 0.6 * g.u) * env2 * S.intensity);
      }
    },
  };
};
