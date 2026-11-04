// Pomoćni alat: traži izvore svetla na slici mesta i ispisuje centre u % slike.
// Upotreba: node scripts/find-lights.mjs <slug> <id> [--warm] [--min 200] [--max 12]
//   (bez --warm: najsvetlije tačke po luminansi; sa --warm: samo tople (amber) tačke)
// Za ekrane: node scripts/find-lights.mjs <slug> <id> --boxes [--min 150]  (povezane svetle pravougaone zone, bbox u %)
import path from 'node:path';
import sharp from 'sharp';

const [slug, id, ...rest] = process.argv.slice(2);
const flag = (n) => rest.includes(n);
const opt = (n, d) => (rest.includes(n) ? Number(rest[rest.indexOf(n) + 1]) : d);
const WARM = flag('--warm');
const BOXES = flag('--boxes');
const MIN = opt('--min', WARM ? 150 : 200);
const MAX = opt('--max', 12);
const file = path.resolve('public/img', slug, `${id}.webp`);

const W = 840;
const { data, info } = await sharp(file).resize({ width: W }).raw().toBuffer({ resolveWithObject: true });
const H = info.height;
const ch = info.channels;
const px = (x, y) => {
  const i = (y * W + x) * ch;
  return [data[i], data[i + 1], data[i + 2]];
};
const lum = (x, y) => {
  const [r, g, b] = px(x, y);
  return 0.299 * r + 0.587 * g + 0.114 * b;
};
const warm = (x, y) => {
  const [r, g, b] = px(x, y);
  return r > g && g > b && r - b > 60;
};
const score = (x, y) => (WARM ? (warm(x, y) ? lum(x, y) : 0) : lum(x, y));

if (BOXES) {
  const seen = new Uint8Array(W * H);
  const boxes = [];
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (seen[y * W + x] || lum(x, y) < MIN) continue;
      let minx = x, maxx = x, miny = y, maxy = y, n = 0;
      const st = [[x, y]];
      seen[y * W + x] = 1;
      while (st.length) {
        const [cx, cy] = st.pop();
        n++;
        if (cx < minx) minx = cx;
        if (cx > maxx) maxx = cx;
        if (cy < miny) miny = cy;
        if (cy > maxy) maxy = cy;
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nx = cx + dx, ny = cy + dy;
          if (nx < 0 || ny < 0 || nx >= W || ny >= H || seen[ny * W + nx] || lum(nx, ny) < MIN) continue;
          seen[ny * W + nx] = 1;
          st.push([nx, ny]);
        }
      }
      if (n > 800) boxes.push({ minx, maxx, miny, maxy, n });
    }
  }
  const pct = (v, t) => +((v / t) * 100).toFixed(1);
  for (const b of boxes) console.log(`x ${pct(b.minx, W)}–${pct(b.maxx, W)}  y ${pct(b.miny, H)}–${pct(b.maxy, H)}  (px ${b.n})`);
  process.exit(0);
}

// lokalni maksimumi (zagladeni 5x5), potiskivanje u radijusu 3% širine
const R = Math.round(W * 0.03);
const cand = [];
for (let y = 2; y < H - 2; y += 2) {
  for (let x = 2; x < W - 2; x += 2) {
    let s = 0;
    for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) s += score(x + dx, y + dy);
    s /= 25;
    if (s >= MIN) cand.push({ x, y, s });
  }
}
cand.sort((a, b) => b.s - a.s);
const picked = [];
for (const c of cand) {
  if (picked.length >= MAX) break;
  if (picked.some((p) => Math.hypot(p.x - c.x, p.y - c.y) < R)) continue;
  // težište svetle okoline radi preciznijeg centra
  let sx = 0, sy = 0, sw = 0;
  for (let dy = -R; dy <= R; dy++) {
    for (let dx = -R; dx <= R; dx++) {
      const x = c.x + dx, y = c.y + dy;
      if (x < 0 || y < 0 || x >= W || y >= H) continue;
      const v = score(x, y);
      if (v >= c.s * 0.8) { sx += x * v; sy += y * v; sw += v; }
    }
  }
  const cx = sx / sw, cy = sy / sw;
  // poluprečnik: gde luminansa padne ispod polovine vrha
  let rad = 1;
  while (rad < W * 0.2 && score(Math.min(W - 1, Math.round(cx + rad)), Math.round(cy)) > c.s * 0.5) rad++;
  picked.push({ x: cx, y: cy, s: c.s, r: rad });
}
for (const p of picked) {
  console.log(`x ${((p.x / W) * 100).toFixed(1)}  y ${((p.y / H) * 100).toFixed(1)}  jačina ${p.s.toFixed(0)}  r≈${((p.r / W) * 100).toFixed(1)}% širine`);
}
