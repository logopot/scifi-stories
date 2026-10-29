// Animacija NAslikanog plamena (fire, source: 'painted'): iz same slike se iseče pravougaonik oko plamena i svaki kadar crta
// red po red sa horizontalnim talasanjem (jače pri vrhu), nepravilnim vertikalnim razvlačenjem uz sidro na dnu i treperenjem
// svetline/boje; ivice su feather-ovane, a ispod komada je potamnjena kopija istog područja da se plamen ne udvostruči.
// Original ispod ostaje netaknut: komad se crta u sloju materije (normalan alfa) preko slike.
import { fxStyle } from './fxStyle';
import { css, mix, smoothstep } from './fxSprites';
import { rand } from './fxSignals';

const S = fxStyle;
const TAU = Math.PI * 2;

const canvas = (w, h) => {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
};

// Pravougaonik plamena u pikselima slike. w/h su % širine/visine slike; podrazumevano iz r.
export const flameRegion = (e, iw, ih) => {
  const P = S.fire.painted;
  const wPct = e.w ?? e.r * P.defaultW;
  const hPct = e.h ?? wPct * (iw / ih) * P.defaultH;
  const W = Math.max(8, Math.min(iw, Math.round((iw * wPct) / 100)));
  const H = Math.max(8, Math.min(ih, Math.round((ih * hPct) / 100)));
  const sx = Math.max(0, Math.min(iw - W, Math.round((iw * e.x) / 100 - W / 2)));
  const sy = Math.max(0, Math.min(ih - H, Math.round((ih * e.y) / 100 - H / 2)));
  return { W, H, sx, sy, wPct: (W / iw) * 100, hPct: (H / ih) * 100, left: (sx / iw) * 100, top: (sy / ih) * 100 };
};

export const makePainted = (e, pal) => {
  const P = S.fire.painted;
  let st = null;
  const ph = Array.from({ length: 6 }, () => rand(0, TAU));
  const hz = P.hz.map((h) => h * rand(0.85, 1.15));
  const stretchHz = P.stretchHz.map((h) => h * rand(0.85, 1.15));

  const build = (env) => {
    const reg = flameRegion(e, env.imgSize.w, env.imgSize.h);
    const { W, H } = reg;
    // maska: meki feather po sve četiri ivice
    const mask = canvas(W, H);
    const mctx = mask.getContext('2d');
    const md = mctx.createImageData(W, H);
    const fy = P.feather;
    const fxx = P.featherX;
    for (let y = 0; y < H; y++) {
      const my = smoothstep(0, fy, (y + 0.5) / H) * smoothstep(0, fy, 1 - (y + 0.5) / H);
      for (let x = 0; x < W; x++) {
        const a = smoothstep(0, fxx, (x + 0.5) / W) * smoothstep(0, fxx, 1 - (x + 0.5) / W) * my;
        const i = (y * W + x) * 4;
        md.data[i] = md.data[i + 1] = md.data[i + 2] = 255;
        md.data[i + 3] = Math.round(Math.pow(a, P.featherPower) * 255);
      }
    }
    mctx.putImageData(md, 0, 0);
    // potamnjena kopija istog područja (statična), sa istom maskom
    const dark = canvas(W, H);
    const dctx = dark.getContext('2d');
    dctx.drawImage(env.img, reg.sx, reg.sy, W, H, 0, 0, W, H);
    dctx.globalCompositeOperation = 'source-atop';
    dctx.fillStyle = css(mix(pal.edge, [0, 0, 0], 0.7), P.darkAmount);
    dctx.fillRect(0, 0, W, H);
    dctx.globalCompositeOperation = 'destination-in';
    dctx.drawImage(mask, 0, 0);
    const piece = canvas(W, H);
    st = { ...reg, mask, dark, piece, pctx: piece.getContext('2d') };
  };

  return {
    // sig: treperenje izvora (iz makeFlicker), I: jačina. Crta se u sloju materije (koordinate slike).
    draw(env, sig) {
      if (env.still || !env.img || !env.imgSize) return;
      if (!st) {
        if (!env.img.complete || !env.img.naturalWidth) return;
        build(env);
      }
      const { W, H, sx, sy, pctx: pc, piece } = st;
      const t = env.t;
      const iw = env.imgSize.w;
      const ih = env.imgSize.h;
      const M = env.M;
      const dx0 = env.rect.left + (st.left / 100) * env.rect.width;
      const dy0 = env.rect.top + (st.top / 100) * env.rect.height;
      const dw = (st.wPct / 100) * env.rect.width;
      const dh = (st.hPct / 100) * env.rect.height;

      // ispod: potamnjena kopija, da se plamen ne udvostručuje kad se komad pomeri
      M.globalAlpha = P.darkAlpha;
      M.drawImage(st.dark, dx0, dy0, dw, dh);

      // vertikalno razvlačenje oko ±8% sa sidrom na dnu (nepravilno)
      const sv = 0.5 * Math.sin(TAU * stretchHz[0] * t + ph[3]) + 0.3 * Math.sin(TAU * stretchHz[1] * t + ph[4]) + 0.2 * sig.slow;
      const stretch = 1 + P.stretch * sv;
      // amplituda talasanja se sporo i nepravilno menja
      const amp = P.waveAmp * W * (0.75 + 0.35 * sig.slow + 0.2 * Math.sin(TAU * 0.13 * t + ph[5]));
      const rh = P.rowHeight;
      pc.setTransform(1, 0, 0, 1, 0, 0);
      pc.globalCompositeOperation = 'source-over';
      pc.globalAlpha = 1;
      pc.clearRect(0, 0, W, H);
      for (let y = 0; y < H; y += rh) {
        const yy = y + rh / 2;
        const weight = P.baseWave + (1 - P.baseWave) * Math.pow(1 - yy / H, P.topBias);
        const ky = [TAU / (H * 0.55), TAU / (H * 0.23), TAU / (H * 0.11)];
        const wave =
          0.5 * Math.sin(ky[0] * yy - TAU * hz[0] * t + ph[0]) +
          0.3 * Math.sin(ky[1] * yy - TAU * hz[1] * t + ph[1]) +
          0.2 * Math.sin(ky[2] * yy - TAU * hz[2] * t + ph[2]);
        const dx = amp * weight * (wave + 0.35 * sig.v);
        const srcH = rh / stretch;
        let srcY = sy + H - (H - yy) / stretch - srcH / 2;
        srcY = Math.max(0, Math.min(ih - srcH, srcY));
        const srcX = Math.max(0, Math.min(iw - W, sx - dx));
        pc.drawImage(env.img, srcX, srcY, W, srcH, 0, y, W, rh);
      }
      // svetlina i boja: jezgro belje na vrhuncu, toplije pri padu
      const k = (sig.peak - 0.5) * 2;
      pc.globalCompositeOperation = 'source-atop';
      if (k > 0) {
        pc.fillStyle = css(pal.core, P.peakTint * k);
      } else {
        pc.fillStyle = css(mix(pal.mid, pal.edge, 0.4), P.dipTint * -k);
      }
      pc.fillRect(0, 0, W, H);
      pc.globalCompositeOperation = 'destination-in';
      pc.drawImage(st.mask, 0, 0);
      M.globalAlpha = 1;
      M.drawImage(piece, dx0, dy0, dw, dh);
    },
  };
};
