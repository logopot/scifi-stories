// Živi ekrani (screen / screens): naslikani ekran "radi" — nečitljiv tok podataka, spor pojas skeniranja, mirno pulsiranje
// ili retko alarmno treperenje, uz blag "spill" na okolinu i jedva primetan scanline. Svaki ekran se crta u svoj mali
// offscreen canvas (maskiran oblikom ekrana: pravougaonik ili quad; u canvas ulazi i spill), koji se onda blituje na sloj
// svetla (screen). Nema slova ni brojeva. Područja su u % slike.
// exclude: oblasti u kojima se ništa ne crta (glave i ramena ispred ekrana); lumaGate: efekat se množi svetlinom originalne
// slike (tamne siluete gase efekat). Obe maske se pre-računaju jednom (po veličini/položaju) i primenjuju jednim crtanjem.
import { fxStyle } from './fxStyle';
import * as sprites from './fxSprites';
import { paletteFor, smoothstep } from './fxSprites';
import { intensity, makeFlicker, rand } from './fxSignals';

const S = fxStyle;
const C = S.screen;

// deskriptor → 4 tačke u %: [[x,y] gore-levo, gore-desno, dole-desno, dole-levo]
export const screenQuad = (d) => (d.quad && d.quad.length === 4 ? d.quad : [[d.x, d.y], [d.x + d.w, d.y], [d.x + d.w, d.y + d.h], [d.x, d.y + d.h]]);

// Crta jednu izuzetu oblast (u px kontejnera) u mask canvas (destination-out) sa mekom ivicom.
const cutArea = (o, area, env, feather) => {
  const path = () => {
    o.beginPath();
    if (Array.isArray(area)) {
      const [x, y, w, h] = area;
      o.rect(env.px(x), env.py(y), (w * env.rect.width) / 100, (h * env.rect.height) / 100);
    } else if (area.points) {
      area.points.forEach(([x, y], i) => (i ? o.lineTo(env.px(x), env.py(y)) : o.moveTo(env.px(x), env.py(y))));
      o.closePath();
    } else {
      o.ellipse(env.px(area.cx), env.py(area.cy), (area.rx * env.rect.width) / 100, (area.ry * env.rect.height) / 100, ((area.rot || 0) * Math.PI) / 180, 0, Math.PI * 2);
    }
  };
  o.fillStyle = 'black';
  o.strokeStyle = 'black';
  o.lineJoin = 'round';
  o.globalAlpha = 1;
  path();
  o.fill();
  // mekana ivica: tri sve šira poluprovidna oboda
  for (let j = 3; j >= 1; j--) {
    o.globalAlpha = 0.3;
    o.lineWidth = (2 * j * feather) / 3;
    path();
    o.stroke();
  }
  o.globalAlpha = 1;
};

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
      exclude: d.exclude || [],
      luma: d.lumaGate ?? 0,
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
      keep: null,
      keepKey: '',
      lastDraw: -1,
    };
  });
  let pattern = null;

  // maska "zadrži": luma kapija (svetli pikseli ostaju) minus izuzete oblasti; jedan canvas, jedno crtanje po kadru
  const buildKeep = (s, env, x0, y0, bw, bh, sc, w, h) => {
    const keep = document.createElement('canvas');
    keep.width = w;
    keep.height = h;
    const o = keep.getContext('2d');
    o.fillStyle = 'white';
    o.fillRect(0, 0, w, h);
    const img = env.img;
    if (s.luma > 0 && img && img.complete && img.naturalWidth) {
      // uzorkuje se original u nižoj rezoluciji (mekša maska), pa se razvlači na veličinu ekrana
      const sw = Math.max(4, Math.round(w / 2));
      const sh = Math.max(4, Math.round(h / 2));
      const t = document.createElement('canvas');
      t.width = sw;
      t.height = sh;
      const tc = t.getContext('2d');
      const iw = env.imgSize.w;
      const ih = env.imgSize.h;
      const fx0 = ((x0 - env.rect.left) / env.rect.width) * iw;
      const fy0 = ((y0 - env.rect.top) / env.rect.height) * ih;
      const fw = (bw / env.rect.width) * iw;
      const fh = (bh / env.rect.height) * ih;
      tc.drawImage(img, fx0, fy0, fw, fh, 0, 0, sw, sh);
      const data = tc.getImageData(0, 0, sw, sh);
      const d = data.data;
      for (let i = 0; i < d.length; i += 4) {
        const l = (0.3 * d[i] + 0.59 * d[i + 1] + 0.11 * d[i + 2]) / 255;
        const gate = smoothstep(C.lumaLo, C.lumaHi, l);
        d[i] = d[i + 1] = d[i + 2] = 255;
        d[i + 3] = Math.round((1 - s.luma + s.luma * gate) * 255);
      }
      tc.putImageData(data, 0, 0);
      o.globalCompositeOperation = 'source-over';
      o.clearRect(0, 0, w, h);
      o.imageSmoothingEnabled = true;
      o.drawImage(t, 0, 0, w, h);
    }
    if (s.exclude.length) {
      o.globalCompositeOperation = 'destination-out';
      o.setTransform(sc, 0, 0, sc, -x0 * sc, -y0 * sc);
      const feather = C.excludeFeather * env.u;
      for (const area of s.exclude) cutArea(o, area, env, feather);
    }
    return keep;
  };

  return {
    drawLight(env) {
      const L = env.L;
      const k = S.intensity;
      const fps = phone ? C.phoneFps : C.fps;
      const pts = scr.map((s) => s.quad.map(([x, y]) => [env.px(x), env.py(y)]));
      scr.forEach((s, i) => {
        const q = pts[i];
        let gx0 = 1e9, gy0 = 1e9, gx1 = -1e9, gy1 = -1e9;
        for (const [x, y] of q) { gx0 = Math.min(gx0, x); gy0 = Math.min(gy0, y); gx1 = Math.max(gx1, x); gy1 = Math.max(gy1, y); }
        const cx = (q[0][0] + q[1][0] + q[2][0] + q[3][0]) / 4;
        const cy = (q[0][1] + q[1][1] + q[2][1] + q[3][1]) / 4;
        const sw0 = Math.min(Math.hypot(q[1][0] - q[0][0], q[1][1] - q[0][1]), C.spillMaxW * env.u);
        const sh0 = Math.max(Math.hypot(q[3][0] - q[0][0], q[3][1] - q[0][1]), C.spillMinH * env.u);
        // ograda: ekran + spill elipsa
        const spillOn = s.spill > 0;
        const x0 = spillOn ? Math.min(gx0, cx - 1.15 * sw0) : gx0;
        const x1 = spillOn ? Math.max(gx1, cx + 1.15 * sw0) : gx1;
        const y0 = spillOn ? Math.min(gy0, cy - sh0) : gy0;
        const y1 = spillOn ? Math.max(gy1, cy + sh0) : gy1;
        const bw = Math.max(2, x1 - x0);
        const bh = Math.max(2, y1 - y0);
        const big = gx1 - gx0 > env.rect.width * C.bigFrac;
        const sc = big ? C.scale * C.bigScale : C.scale; // veliki ekrani u nižoj rezoluciji
        const ready = env.img && env.img.complete && env.img.naturalWidth ? 1 : 0;
        const key = `${Math.round(bw)}x${Math.round(bh)}@${sc}`;
        if (!s.off || key !== s.offKey) {
          s.offKey = key;
          s.off = document.createElement('canvas');
          s.off.width = Math.max(2, Math.ceil(bw * sc));
          s.off.height = Math.max(2, Math.ceil(bh * sc));
          s.lastDraw = -1;
        }
        const keepKey = `${key}:${Math.round(env.rect.left)},${Math.round(env.rect.top)}:${ready}`;
        if (s.keepKey !== keepKey && (s.exclude.length || s.luma > 0)) {
          s.keepKey = keepKey;
          s.keep = buildKeep(s, env, x0, y0, bw, bh, sc, s.off.width, s.off.height);
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
          // spill: spljošten eliptični sjaj oko ekrana, vrlo nizak (u istom canvasu, pa važe iste maske)
          if (spillOn) {
            o.globalCompositeOperation = 'lighter';
            o.globalAlpha = C.spillAlpha * s.spill * s.I * (0.6 + 0.7 * level) * k;
            o.drawImage(sprites.deep(s.pal), cx - sw0 * 1.15, cy - sh0, sw0 * 2.3, sh0 * 2.0);
          }
          // maska: izuzete oblasti i luma kapija
          if (s.keep) {
            o.setTransform(1, 0, 0, 1, 0, 0);
            o.globalCompositeOperation = 'destination-in';
            o.globalAlpha = 1;
            o.drawImage(s.keep, 0, 0);
          }
        }
        L.globalAlpha = 1;
        L.drawImage(s.off, x0, y0, bw, bh);
      });
    },
  };
};
