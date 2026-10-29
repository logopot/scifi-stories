// Živi ekrani (screen / screens): naslikani ekran "radi" — nečitljiv tok podataka, spor pojas skeniranja, mirno pulsiranje
// ili retko alarmno treperenje, uz blag "spill" na okolinu i jedva primetan scanline. Svaki ekran se crta u svoj mali
// offscreen canvas (maskiran oblikom ekrana: pravougaonik ili quad), koji se onda blituje na sloj svetla (screen).
// Nema slova ni brojeva. Područja su u % slike.
import { fxStyle } from './fxStyle';
import * as sprites from './fxSprites';
import { paletteFor, smoothstep } from './fxSprites';
import { intensity, makeFlicker, rand } from './fxSignals';

const S = fxStyle;
const C = S.screen;

// deskriptor → 4 tačke u %: [[x,y] gore-levo, gore-desno, dole-desno, dole-levo]
export const screenQuad = (d) => (d.quad && d.quad.length === 4 ? d.quad : [[d.x, d.y], [d.x + d.w, d.y], [d.x + d.w, d.y + d.h], [d.x, d.y + d.h]]);

export const makeScreens = (descs, theme, phone) => {
  const scr = descs.map((d) => {
    const color = d.color || 'fxCold';
    const pal = paletteFor(color, theme[color]);
    return {
      style: d.style || 'data',
      pal,
      I: d.intensity ?? 0.5,
      speed: d.speed ?? 1,
      spill: d.spill ?? 0.3,
      quad: screenQuad(d),
      ph: rand(0, 1),
      variant: Math.floor(Math.random() * sprites.DATA_VARIANTS),
      sig: makeFlicker(rand(0.3, 0.9)),
      scroll: rand(0, 100),
      pauseUntil: 0,
      nextPause: rand(0.6, 2.4),
      period: rand(C.scanPeriod[0], C.scanPeriod[1]),
      nextAlert: rand(1, C.alertEvery[1]),
      alertAt: -10,
      level: 0,
      off: null,
      offKey: '',
      lastDraw: -1,
    };
  });
  let pattern = null;

  return {
    drawLight(env) {
      const L = env.L;
      const k = S.intensity;
      const fps = phone ? C.phoneFps : C.fps;
      const pts = scr.map((s) => s.quad.map(([x, y]) => [env.px(x), env.py(y)]));
      scr.forEach((s, i) => {
        const q = pts[i];
        let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
        for (const [x, y] of q) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
        const bw = Math.max(2, x1 - x0);
        const bh = Math.max(2, y1 - y0);
        const big = bw > env.rect.width * C.bigFrac;
        const sc = big ? C.scale * C.bigScale : C.scale; // veliki ekrani u nižoj rezoluciji
        const key = `${Math.round(bw)}x${Math.round(bh)}@${sc}`;
        if (!s.off || key !== s.offKey) {
          s.offKey = key;
          s.off = document.createElement('canvas');
          s.off.width = Math.max(2, Math.ceil(bw * sc));
          s.off.height = Math.max(2, Math.ceil(bh * sc));
          s.lastDraw = -1;
        }
        if (s.lastDraw < 0 || env.still || env.t - s.lastDraw >= 1 / fps - 0.001) {
          const dt = s.lastDraw < 0 ? env.dt : Math.min(0.1, env.t - s.lastDraw);
          s.lastDraw = env.t;
          const o = s.off.getContext('2d');
          o.setTransform(1, 0, 0, 1, 0, 0);
          o.globalCompositeOperation = 'source-over';
          o.globalAlpha = 1;
          o.clearRect(0, 0, s.off.width, s.off.height);
          o.setTransform(sc, 0, 0, sc, -x0 * sc, -y0 * sc);
          if (!pattern) pattern = o.createPattern(sprites.scanlines(), 'repeat');
          // blago skupljanje ka sredini da svetlo ostane unutar stakla
          const cx = (q[0][0] + q[1][0] + q[2][0] + q[3][0]) / 4;
          const cy = (q[0][1] + q[1][1] + q[2][1] + q[3][1]) / 4;
          const qq = q.map(([x, y]) => [cx + (x - cx) * (1 - C.inset), cy + (y - cy) * (1 - C.inset)]);
          let qx0 = 1e9, qy0 = 1e9, qx1 = -1e9, qy1 = -1e9;
          for (const [x, y] of qq) { qx0 = Math.min(qx0, x); qy0 = Math.min(qy0, y); qx1 = Math.max(qx1, x); qy1 = Math.max(qy1, y); }
          const qw = qx1 - qx0;
          const qh = qy1 - qy0;
          const still = env.still;
          o.save();
          o.beginPath();
          o.moveTo(qq[0][0], qq[0][1]);
          for (let j = 1; j < 4; j++) o.lineTo(qq[j][0], qq[j][1]);
          o.closePath();
          o.clip();
          o.globalCompositeOperation = 'lighter';
          let level = 0.5;
          if (s.style === 'data') {
            const rh = qh / C.dataRows;
            const th = sprites.DATA_ROWS * rh;
            if (!still) {
              if (env.t > s.pauseUntil) {
                s.scroll += dt * rh * C.dataSpeed * s.speed * (0.7 + 0.5 * Math.sin(env.t * 0.9 + s.ph * 9));
                if (env.t > s.nextPause) {
                  s.pauseUntil = env.t + rand(0.08, 0.3);
                  s.nextPause = s.pauseUntil + rand(0.6, 2.6);
                }
              }
            } else s.scroll = th * 0.3;
            const off0 = s.scroll % th;
            o.globalAlpha = C.dataAlpha * s.I * k;
            for (let yy = qy0 - off0; yy < qy1; yy += th) o.drawImage(sprites.dataTexture(s.pal, s.variant), qx0, yy, qw, th);
            o.globalAlpha = C.baseGlow * s.I * k;
            o.drawImage(sprites.soft(s.pal), qx0, qy0, qw, qh);
          } else if (s.style === 'scan') {
            const p = still ? 0.45 : ((((env.t * s.speed) / s.period + s.ph) % 1) + 1) % 1;
            const fade = smoothstep(0, 0.1, p) * (1 - smoothstep(0.84, 1, p));
            const by = qy0 + (p * 1.3 - 0.15) * qh;
            o.globalAlpha = C.scanAlpha * s.I * k * fade;
            o.drawImage(sprites.band(s.pal), qx0, by - qh * 0.22, qw, qh * 0.44);
            o.globalAlpha = C.scanAlpha * 0.35 * s.I * k * fade;
            o.drawImage(sprites.band(s.pal), qx0, by - qh * 0.2 - qh * 0.3, qw, qh * 0.6);
            o.globalAlpha = C.baseGlow * 1.4 * s.I * k;
            o.drawImage(sprites.soft(s.pal), qx0, qy0, qw, qh);
            level = 0.45 + 0.4 * fade;
          } else if (s.style === 'pulse') {
            const sg = s.sig(env.t, still);
            const I = still ? 1 : intensity(sg, 0.9);
            o.globalAlpha = C.pulseAlpha * s.I * I * k;
            o.drawImage(sprites.soft(s.pal), qx0 - qw * 0.05, qy0 - qh * 0.05, qw * 1.1, qh * 1.1);
            level = I;
          } else {
            // alert: dug miran period, pa kratko dvostruko treperenje
            let flash = 0;
            if (!still) {
              if (env.t > s.nextAlert) {
                s.alertAt = env.t;
                s.nextAlert = env.t + rand(C.alertEvery[0], C.alertEvery[1]) / s.speed;
              }
              const uu = env.t - s.alertAt;
              if (uu >= 0 && uu < 0.14) flash = Math.sin((Math.PI * uu) / 0.14);
              else if (uu >= 0.24 && uu < 0.42) flash = Math.sin((Math.PI * (uu - 0.24)) / 0.18);
            }
            const calm = 0.18 + 0.05 * Math.sin(env.t * 0.7 + s.ph * 9);
            o.globalAlpha = C.alertAlpha * s.I * (calm + flash * 0.9) * k;
            o.drawImage(sprites.soft(s.pal), qx0 - qw * 0.05, qy0 - qh * 0.05, qw * 1.1, qh * 1.1);
            level = calm + flash;
          }
          // scanline šum, jedva primetan (samo na manjim ekranima)
          if (!still && !big) {
            o.globalAlpha = C.scanlineAlpha * s.I * k;
            o.fillStyle = pattern;
            o.save();
            o.translate(0, (env.t * 5) % 4);
            o.fillRect(qx0, qy0 - 4, qw, qh + 8);
            o.restore();
          }
          o.restore();
          s.level = level;
        }
        L.globalAlpha = 1;
        L.drawImage(s.off, x0, y0, bw, bh);
        // spill: spljošten eliptični sjaj oko ekrana, vrlo nizak
        if (s.spill > 0) {
          const cx = (q[0][0] + q[1][0] + q[2][0] + q[3][0]) / 4;
          const cy = (q[0][1] + q[1][1] + q[2][1] + q[3][1]) / 4;
          const w = Math.min(Math.hypot(q[1][0] - q[0][0], q[1][1] - q[0][1]), C.spillMaxW * env.u);
          const h = Math.max(Math.hypot(q[3][0] - q[0][0], q[3][1] - q[0][1]), C.spillMinH * env.u);
          L.globalAlpha = C.spillAlpha * s.spill * s.I * (0.6 + 0.7 * s.level) * k;
          L.drawImage(sprites.deep(s.pal), cx - w * 1.15, cy - h * 1.0, w * 2.3, h * 2.0);
        }
      });
    },
  };
};
