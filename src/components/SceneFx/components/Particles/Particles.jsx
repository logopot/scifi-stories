import React, { useEffect, useRef } from 'react';
import { useTheme } from 'styled-components';
import useMediaQuery from '../../../../hooks/useMediaQuery';
import * as S from './Particles.styled';

const CAP_DESKTOP = 70;
const CAP_PHONE = 35;
const MAX_DPR = 1.5;
const DEFAULT_DENSITY = { snow: 0.6, dust: 0.5, rain: 0.6 };
const DEFAULT_COLOR = { snow: 'fxCold', dust: 'fxWarm', rain: 'fxCold' };

const rand = (a, b) => a + Math.random() * (b - a);

// Počeci čestica po tipu; koordinate su 0–1 po canvasu, brzine u visinama canvasa po sekundi.
const spawn = (type, speed, scatter) => {
  const p = { type, x: Math.random(), y: scatter ? Math.random() : -0.02, phase: Math.random() * 6.28, speed };
  if (type === 'snow') Object.assign(p, { size: rand(1, 2.4), vy: rand(0.05, 0.12), sway: rand(0.01, 0.03), alpha: rand(0.5, 0.9) });
  else if (type === 'dust') Object.assign(p, { size: rand(0.8, 1.6), vy: rand(-0.01, 0.02), sway: rand(0.02, 0.05), alpha: rand(0.15, 0.4) });
  else Object.assign(p, { size: rand(10, 18), vy: rand(0.9, 1.3), sway: -0.12, alpha: rand(0.25, 0.4) });
  return p;
};

// Čestice: [{ type: 'snow'|'dust'|'rain', density?, speed?, color? }]. Najviše ~70 čestica na računaru, ~35 na telefonu;
// petlja stoji kad je tab skriven ili scena van ekrana; bez čestica uz prefers-reduced-motion.
export default function Particles({ items }) {
  const theme = useTheme();
  const phone = useMediaQuery('(max-width: 767px)');
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const ref = useRef(null);
  const key = JSON.stringify(items);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || reduced) return undefined;
    const ctx = canvas.getContext('2d');
    const cap = phone ? CAP_PHONE : CAP_DESKTOP;
    const wanted = items.map((it) => ({ ...it, n: Math.round(cap * (it.density ?? DEFAULT_DENSITY[it.type])) }));
    const total = wanted.reduce((s, w) => s + w.n, 0);
    const k = total > cap ? cap / total : 1;
    const groups = wanted.map((w) => ({
      type: w.type,
      color: theme[w.color || DEFAULT_COLOR[w.type]],
      list: Array.from({ length: Math.max(1, Math.round(w.n * k)) }, () => spawn(w.type, w.speed ?? 1, true)),
    }));

    let w = 0;
    let h = 0;
    let dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let raf = 0;
    let last = 0;
    let visible = true;
    const frame = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
      last = now;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      for (const g of groups) {
        ctx.fillStyle = g.color;
        ctx.strokeStyle = g.color;
        for (const p of g.list) {
          p.y += p.vy * p.speed * dt;
          p.phase += dt;
          p.x += (p.type === 'rain' ? p.sway : Math.sin(p.phase) * p.sway) * p.speed * dt;
          if (p.y > 1.03 || p.x < -0.05 || p.x > 1.05) Object.assign(p, spawn(g.type, p.speed, false), { x: Math.random() });
          ctx.globalAlpha = p.type === 'dust' ? p.alpha * (0.6 + 0.4 * Math.sin(p.phase * 1.7)) : p.alpha;
          const px = p.x * w;
          const py = p.y * h;
          if (p.type === 'rain') {
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(px - p.size * 0.12, py - p.size);
            ctx.stroke();
          } else {
            ctx.beginPath();
            ctx.arc(px, py, p.size, 0, 6.2832);
            ctx.fill();
          }
        }
      }
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (!raf && visible && !document.hidden) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
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
    io.observe(canvas);
    start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
    // items se poredi po sadržaju (key), a boje teme se čitaju pri pokretanju
  }, [key, phone, reduced, theme]); // eslint-disable-line react-hooks/exhaustive-deps

  if (reduced) return null;
  return <S.Canvas ref={ref} />;
}
