import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import SceneFx from '../../components/SceneFx';
import { FX_COLORS, FX_TYPES, MAX_FX, MAX_POINTS, SCREEN_STYLES, validateFx } from '../../stories/fx';
import { stories } from '../../stories';
import * as S from './DevFx.styled';

// SAMO ZA RAZVOJ (ruta postoji samo uz import.meta.env.DEV, vidi App.jsx; /dev/* je noindex i van sitemap-a).
// /dev/fx?story=<slug>&image=<id>: klik na sliku dodaje efekat izabranog tipa, prevlačenje pomera tačku, polja menjaju
// parametre, "Kopiraj JSON" kopira niz `fx` za tu sliku (zalepi ga u images[id].fx u story.json i story.en.json).
const COORD_TYPES = ['glow', 'fire', 'sun', 'smoke', 'twinkle'];
const GLOBAL_TYPES = ['snow', 'dust', 'rain', 'mist'];
const NUMBER_FIELDS = { glow: ['r', 'flicker'], fire: ['r', 'w', 'h'], sun: ['r'], smoke: ['w'], twinkle: ['r'], snow: ['density', 'speed'], dust: ['density', 'speed'], rain: ['density', 'speed'], mist: [], water: ['ripple', 'glints'], screen: ['intensity', 'speed', 'spill'], screens: [] };
const STEP = { intensity: 0.05, spill: 0.05, ripple: 0.05, glints: 1, r: 0.1, w: 0.1, flicker: 0.05, density: 0.05, speed: 0.1 };
const DEFAULTS = { glow: { r: 4 }, fire: { r: 5 }, sun: { r: 12 }, smoke: { w: 4 }, twinkle: { r: 1.4 } };
const round = (v) => Math.round(v * 10) / 10;

export default function DevFx() {
  const params = new URLSearchParams(window.location.search);
  const ready = stories.filter((s) => s.status === 'ready');
  const [slug, setSlug] = useState(params.get('story') || 'zimska-ostava');
  const [story, setStory] = useState(null);
  const [imageId, setImageId] = useState(params.get('image') || '');
  const [fx, setFx] = useState([]);
  const [sel, setSel] = useState(-1);
  const [tool, setTool] = useState('glow');
  const [color, setColor] = useState('fxWarm');
  const [size, setSize] = useState(null);
  const [copied, setCopied] = useState(false);
  const [look, setLook] = useState(params.get('look') === 'old' ? 'old' : 'new');
  const [black, setBlack] = useState(params.get('black') === '1');
  const [sheet, setSheet] = useState(null);
  const [capturing, setCapturing] = useState(false);
  const [mode, setMode] = useState(null); // 'exclude' (povuci pravougaonik) | 'column' (klik) za izabranu vodu
  const [preview, setPreview] = useState(null);
  const [quadPts, setQuadPts] = useState([]); // klik na 4 ugla ekrana (gore-levo, gore-desno, dole-desno, dole-levo)
  const rectStart = useRef(null);
  const previewRef = useRef(null);
  const stage = useRef(null);
  const drag = useRef(null);

  useEffect(() => {
    const entry = ready.find((s) => s.slug === slug);
    if (!entry) return undefined;
    let live = true;
    entry.load().then((mod) => live && setStory(mod.default || mod));
    return () => {
      live = false;
    };
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  const places = useMemo(() => Object.entries((story && story.images) || {}).filter(([, im]) => im.kind === 'place'), [story]);
  const image = story && story.images && story.images[imageId];

  useEffect(() => {
    if (places.length && !places.some(([id]) => id === imageId)) setImageId(places[0][0]);
  }, [places, imageId]);
  useEffect(() => {
    setFx(image && image.fx ? JSON.parse(JSON.stringify(image.fx)) : []);
    setSel(-1);
    setSize(null);
  }, [image]);

  const json = JSON.stringify(fx);
  const errors = validateFx(fx);
  const pct = (e) => {
    const r = stage.current.getBoundingClientRect();
    return [round(Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100))), round(Math.min(100, Math.max(0, ((e.clientY - r.top) / r.height) * 100)))];
  };
  const update = (i, patch) => setFx((list) => list.map((f, j) => (j === i ? { ...f, ...patch } : f)));
  const withColor = (e) => ({ ...e, ...(color !== 'fxWarm' ? { color } : {}) });

  const onStageDown = (e) => {
    if (drag.current || !size) return;
    const water = fx[sel] && fx[sel].type === 'water' ? fx[sel] : null;
    if (mode === 'column' && water) {
      const [cx] = pct(e);
      update(sel, { columns: [...(water.columns || []), [cx, 0.6, 'fxWarm']] });
      return setMode(null);
    }
    if (tool === 'quad') {
      const [qx, qy] = pct(e);
      const next = [...quadPts, [qx, qy]];
      if (next.length === 4 && fx.length < MAX_FX) {
        setFx((list) => [...list, withColor({ type: 'screen', quad: next, style: 'data' })]);
        setSel(fx.length);
        return setQuadPts([]);
      }
      return setQuadPts(next.length === 4 ? [] : next);
    }
    if ((mode === 'exclude' && water) || tool === 'water' || tool === 'screen') {
      const [rx, ry] = pct(e);
      rectStart.current = [rx, ry];
      previewRef.current = { x: rx, y: ry, w: 0, h: 0 };
      return setPreview(previewRef.current);
    }
    if (!COORD_TYPES.includes(tool)) return;
    const [x, y] = pct(e);
    if (tool === 'twinkle') {
      const at = fx[sel] && fx[sel].type === 'twinkle' ? sel : fx.findIndex((f) => f.type === 'twinkle');
      if (at >= 0) {
        if (fx[at].points.length >= MAX_POINTS) return;
        update(at, { points: [...fx[at].points, [x, y]] });
        return setSel(at);
      }
    }
    if (fx.length >= MAX_FX) return;
    const base = tool === 'twinkle' ? { type: 'twinkle', points: [[x, y]], ...DEFAULTS.twinkle } : { type: tool, x, y, ...DEFAULTS[tool] };
    setFx((list) => [...list, withColor(base)]);
    setSel(fx.length);
  };
  const startDrag = (e, i, pi) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { i, pi };
    setSel(i);
  };
  const onMove = (e) => {
    if (rectStart.current) {
      const [mx, my] = pct(e);
      const [x0, y0] = rectStart.current;
      previewRef.current = { x: Math.min(x0, mx), y: Math.min(y0, my), w: Math.abs(mx - x0), h: Math.abs(my - y0) };
      return setPreview(previewRef.current);
    }
    if (!drag.current) return;
    const { i, pi } = drag.current;
    const [x, y] = pct(e);
    if (pi === undefined) update(i, { x, y });
    else setFx((list) => list.map((f, j) => (j === i ? { ...f, points: f.points.map((p, k) => (k === pi ? [x, y] : p)) } : f)));
  };
  const endDrag = () => {
    if (rectStart.current) {
      const p = previewRef.current;
      rectStart.current = null;
      previewRef.current = null;
      setPreview(null);
      if (p && p.w >= 0.5 && p.h >= 0.5) {
        const r = [round(p.x), round(p.y), round(p.w), round(p.h)];
        if (mode === 'exclude' && fx[sel] && fx[sel].type === 'water') {
          update(sel, { exclude: [...(fx[sel].exclude || []), r] });
          setMode(null);
        } else if (tool === 'screen' && fx.length < MAX_FX) {
          setFx((list) => [...list, withColor({ type: 'screen', x: r[0], y: r[1], w: r[2], h: r[3], style: 'data' })]);
          setSel(fx.length);
        } else if (tool === 'water' && fx.length < MAX_FX) {
          setFx((list) => [...list, withColor({ type: 'water', x: r[0], y: r[1], w: r[2], h: r[3] })]);
          setSel(fx.length);
        }
      }
      return;
    }
    setTimeout(() => {
      drag.current = null;
    }, 0);
  };
  const addGlobal = (type) => {
    if (fx.length >= MAX_FX || fx.some((f) => f.type === type)) return;
    setFx((list) => [...list, withColor({ type })]);
    setSel(fx.length);
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(json);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ostaje tekstualno polje ispod, može se ručno kopirati */
    }
  };

  // 6 kadrova u razmaku od pola sekunde u jednu mrežu (3 × 2); radi za novi izgled (canvas). Slika se prikazuje ispod, može se sačuvati.
  const capture = async () => {
    const root = stage.current;
    const canvases = Array.from(root.querySelectorAll('canvas'));
    const light = canvases.find((c) => !c.style.position);
    const waters = canvases.filter((c) => c.style.position === 'absolute');
    const matter = canvases[canvases.length - 1] === light ? null : canvases.filter((c) => !c.style.position)[1];
    const sr = root.getBoundingClientRect();
    const img = root.querySelector('img');
    if (!light || !size) return;
    setCapturing(true);
    const W = 640;
    const H = Math.round((W * size.h) / size.w);
    const out = document.createElement('canvas');
    out.width = W * 3;
    out.height = H * 2;
    const ctx = out.getContext('2d');
    for (let i = 0; i < 6; i++) {
      const x = (i % 3) * W;
      const y = Math.floor(i / 3) * H;
      ctx.globalCompositeOperation = 'source-over';
      if (black) {
        ctx.fillStyle = 'black';
        ctx.fillRect(x, y, W, H);
      } else ctx.drawImage(img, x, y, W, H);
      for (const wc of waters) {
        const r = wc.getBoundingClientRect();
        ctx.drawImage(wc, x + ((r.left - sr.left) / sr.width) * W, y + ((r.top - sr.top) / sr.height) * H, (r.width / sr.width) * W, (r.height / sr.height) * H);
      }
      ctx.globalCompositeOperation = 'screen';
      ctx.drawImage(light, x, y, W, H);
      ctx.globalCompositeOperation = 'source-over';
      if (matter) ctx.drawImage(matter, x, y, W, H);
      ctx.globalAlpha = 0.7;
      ctx.fillStyle = 'white';
      ctx.font = '14px sans-serif';
      ctx.fillText(((i * 500) / 1000).toFixed(1) + ' s', x + 8, y + 18);
      ctx.globalAlpha = 1;
      await new Promise((r) => setTimeout(r, 500));
    }
    setSheet(out.toDataURL('image/png'));
    setCapturing(false);
  };

  const cur = fx[sel];
  return (
    <S.Wrap>
      <S.Bar>
        <Link to="/">← sajt</Link>
        <select value={slug} onChange={(e) => setSlug(e.target.value)} aria-label="Priča">
          {ready.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.slug}
            </option>
          ))}
        </select>
        <select value={imageId} onChange={(e) => setImageId(e.target.value)} aria-label="Slika">
          {places.map(([id]) => (
            <option key={id} value={id}>
              {id}
            </option>
          ))}
        </select>
        <button type="button" onClick={copy}>
          {copied ? 'Kopirano' : 'Kopiraj JSON'}
        </button>
        <button type="button" aria-pressed={look === 'new'} onClick={() => setLook(look === 'new' ? 'old' : 'new')}>
          izgled: {look === 'new' ? 'novi' : 'stari'}
        </button>
        <button type="button" aria-pressed={black} onClick={() => setBlack(!black)}>
          samo efekti na crnom
        </button>
        <button type="button" onClick={capture} disabled={capturing || look === 'old'}>
          {capturing ? 'snimam…' : 'snimi sličice'}
        </button>
      </S.Bar>
      <S.Bar>
        {[...COORD_TYPES, 'water', 'screen', 'quad', ...GLOBAL_TYPES].map((t) => (
          <button key={t} type="button" aria-pressed={tool === t} onClick={() => (COORD_TYPES.includes(t) || ['water', 'screen', 'quad'].includes(t) ? (setTool(t), setQuadPts([])) : addGlobal(t))}>
            {t === 'water' ? 'water (povuci)' : t === 'screen' ? 'screen (povuci)' : t === 'quad' ? 'screen (4 ugla klikom)' : COORD_TYPES.includes(t) ? t : `+ ${t}`}
          </button>
        ))}
        <select value={color} onChange={(e) => setColor(e.target.value)} aria-label="Boja novog efekta">
          {FX_COLORS.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </S.Bar>
      {cur && (
        <S.Bar>
          <strong>
            {sel + 1}. {cur.type}
          </strong>
          {NUMBER_FIELDS[cur.type].map((k) => (
            <label key={k}>
              {k}{' '}
              <input type="number" step={STEP[k]} value={cur[k] ?? ''} onChange={(e) => update(sel, { [k]: e.target.value === '' ? undefined : Number(e.target.value) })} />
            </label>
          ))}
          {cur.type === 'screen' && (
            <select value={cur.style || 'data'} onChange={(e) => update(sel, { style: e.target.value === 'data' ? undefined : e.target.value })} aria-label="Stil ekrana">
              {SCREEN_STYLES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          )}
          {FX_TYPES[cur.type].optional.includes('rays') && (
            <label>
              <input type="checkbox" checked={Boolean(cur.rays)} onChange={(e) => update(sel, { rays: e.target.checked || undefined })} /> rays
            </label>
          )}
          {cur.type === 'fire' && (
            <select value={cur.source || 'painted'} onChange={(e) => update(sel, { source: e.target.value === 'painted' ? undefined : e.target.value })} aria-label="Izvor plamena">
              <option value="painted">painted (naslikan)</option>
              <option value="drawn">drawn (nacrtan)</option>
            </select>
          )}
          <select value={cur.color || ''} onChange={(e) => update(sel, { color: e.target.value || undefined })} aria-label="Boja">
            <option value="">(podrazumevana)</option>
            {FX_COLORS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <button type="button" onClick={() => (setFx((list) => list.filter((_, j) => j !== sel)), setSel(-1))}>
            Obriši
          </button>
        </S.Bar>
      )}
      {fx.filter((f) => f.type === 'screen').length > 1 && (
        <S.Bar>
          <button
            type="button"
            onClick={() => {
              const group = fx.filter((f) => f.type === 'screen').map(({ type, ...d }) => d);
              setFx((list) => [...list.filter((f) => f.type !== 'screen'), { type: 'screens', screens: group.slice(0, 12) }]);
              setSel(-1);
            }}
          >
            Spoji sve screen u jedan grupni unos (screens)
          </button>
        </S.Bar>
      )}
      {cur && cur.type === 'water' && (
        <S.Bar>
          <button type="button" aria-pressed={mode === 'exclude'} onClick={() => setMode(mode === 'exclude' ? null : 'exclude')}>
            + exclude (povuci)
          </button>
          <button type="button" aria-pressed={mode === 'column'} onClick={() => setMode(mode === 'column' ? null : 'column')}>
            + stub odsjaja (klik)
          </button>
          {(cur.exclude || []).map((r, i) => (
            <span key={`e${i}`}>
              excl {i + 1}: {r.join(', ')}{' '}
              <button type="button" onClick={() => update(sel, { exclude: cur.exclude.length > 1 ? cur.exclude.filter((_, j) => j !== i) : undefined })}>
                ×
              </button>
            </span>
          ))}
          {(cur.columns || []).map((c, i) => (
            <span key={`c${i}`}>
              stub x={c[0]}{' '}
              <input type="number" step="0.05" min="0" max="1" value={c[1]} onChange={(e) => update(sel, { columns: cur.columns.map((q, j) => (j === i ? [q[0], Number(e.target.value), q[2]] : q)) })} />
              <select value={c[2] || 'fxWarm'} onChange={(e) => update(sel, { columns: cur.columns.map((q, j) => (j === i ? [q[0], q[1], e.target.value] : q)) })} aria-label="Boja stuba">
                {FX_COLORS.map((k) => (
                  <option key={k}>{k}</option>
                ))}
              </select>
              <button type="button" onClick={() => update(sel, { columns: cur.columns.length > 1 ? cur.columns.filter((_, j) => j !== i) : undefined })}>
                ×
              </button>
            </span>
          ))}
        </S.Bar>
      )}
      {image && (
        <S.Stage ref={stage} $black={black} $ratio={size ? `${size.w} / ${size.h}` : '16 / 9'} onPointerDown={onStageDown} onPointerMove={onMove} onPointerUp={endDrag}>
          <img src={`/${image.src}`} alt="" style={black ? { opacity: 0 } : undefined} onLoad={(e) => setSize({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })} />
          {size && <SceneFx fx={fx} imgSize={size} focus="center center" still look={look} />}
          {fx.map((f, i) =>
            f.points ? (
              f.points.map(([x, y], pi) => <S.Marker key={`${i}-${pi}`} $selected={i === sel} style={{ left: `${x}%`, top: `${y}%` }} onPointerDown={(e) => startDrag(e, i, pi)} aria-label={`${f.type} ${pi + 1}`} />)
            ) : f.type === 'screen' || f.type === 'screens' ? (
              <React.Fragment key={i}>
                <S.Overlay viewBox="0 0 100 100" preserveAspectRatio="none">
                  {(f.type === 'screens' ? f.screens : [f]).map((d, k) => {
                    const q = d.quad || [[d.x, d.y], [d.x + d.w, d.y], [d.x + d.w, d.y + d.h], [d.x, d.y + d.h]];
                    return <polygon key={k} points={q.map((p) => p.join(',')).join(' ')} vectorEffect="non-scaling-stroke" />;
                  })}
                </S.Overlay>
                {f.type === 'screen' && (
                  <S.Marker $selected={i === sel} style={{ left: `${(f.quad ? f.quad[0][0] : f.x)}%`, top: `${(f.quad ? f.quad[0][1] : f.y)}%` }} onPointerDown={(e) => { e.stopPropagation(); setSel(i); }} aria-label="screen" />
                )}
              </React.Fragment>
            ) : f.type === 'water' ? (
              <React.Fragment key={i}>
                <S.Box $selected={i === sel} style={{ left: `${f.x}%`, top: `${f.y}%`, width: `${f.w}%`, height: `${f.h}%` }} />
                {(f.exclude || []).map((r, k) => (
                  <S.Box key={`x${k}`} $exclude style={{ left: `${r[0]}%`, top: `${r[1]}%`, width: `${r[2]}%`, height: `${r[3]}%` }} />
                ))}
                {(f.columns || []).map((c, k) => (
                  <S.Line key={`c${k}`} style={{ left: `${c[0]}%`, top: `${f.y}%`, height: `${f.h}%` }} />
                ))}
                <S.Marker $selected={i === sel} style={{ left: `${f.x}%`, top: `${f.y}%` }} onPointerDown={(e) => startDrag(e, i)} aria-label="water" />
              </React.Fragment>
            ) : f.x !== undefined ? (
              <React.Fragment key={i}>
                {(f.r || f.w) && <S.Ring style={{ left: `${f.x}%`, top: `${f.y}%`, width: `${(f.r || f.w) * 2}%`, aspectRatio: '1' }} />}
                <S.Marker $selected={i === sel} style={{ left: `${f.x}%`, top: `${f.y}%` }} onPointerDown={(e) => startDrag(e, i)} aria-label={f.type} />
              </React.Fragment>
            ) : null
          )}
          {quadPts.map(([x, y], k) => (
            <S.Marker key={`q${k}`} $selected style={{ left: `${x}%`, top: `${y}%` }} aria-label={`ugao ${k + 1}`} />
          ))}
          {preview && <S.Box $exclude={mode === 'exclude'} style={{ left: `${preview.x}%`, top: `${preview.y}%`, width: `${preview.w}%`, height: `${preview.h}%` }} />}
        </S.Stage>
      )}
      {errors.length > 0 && <pre>{errors.join('\n')}</pre>}
      {sheet && (
        <p>
          <a href={sheet} download={`fx-${slug}-${imageId}.png`}>Sačuvaj mrežu kadrova</a>
          <br />
          <img src={sheet} alt="mreža od 6 kadrova" style={{ maxWidth: '100%' }} />
        </p>
      )}
      <S.Json readOnly value={json} onFocus={(e) => e.target.select()} aria-label="fx JSON" />
    </S.Wrap>
  );
}
