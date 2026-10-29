// Svi parametri IZGLEDA efekata preko slika na jednom mestu (jačine, veličine, brzine, brojevi čestica).
// Logika je u fxEngine.js / fxLights.js / fxMatter.js; ovde se samo podešavaju brojevi. Boje se NE zadaju ovde:
// dolaze iz tokena teme (fxWarm, fxCold, fxSun, fxGreen, accent), a ovde su samo udeli mešanja sa belom / tamnom.
// Dužine su u % širine SLIKE (isto kao koordinate u `fx`), osim ako piše "px".
export const fxStyle = {
  intensity: 0.8, // ukupna jačina svih efekata (1 = punо); bolje da se oseti nego da se vidi
  lightScale: 0.5, // rezolucija sloja svetla u odnosu na CSS piksele (svetlo je mekano, pa polovina dovoljna)
  softScale: 0.6, // rezolucija sloja materije kad nema snega/kiše (samo dim i magla)
  maxDpr: 1.5, // gornja granica gustine piksela za sloj čestica
  maxFps: 60,
  caps: { desktop: 70, phone: 35 }, // najviše čestica (sneg + prašina + kiša + puffovi dima) po sceni

  // Zrnatost preko svetla: tileovana tekstura šuma, samo se pomera (ne računa se po kadru).
  grain: { strength: 0.2, tile: 96, shiftMs: 130 },

  // Treperenje: zbir tri sinusa + spora slučajna varijacija + povremeno kratko prigušenje.
  flicker: {
    hz: [0.7, 2.3, 5.1],
    weights: [0.45, 0.25, 0.12],
    hzSpread: 0.15, // svaka instanca ima ±15% drugačije učestalosti
    slowHz: 0.35,
    slowWeight: 0.3,
    amount: 0.45, // koliko flicker=1 menja jačinu (±)
    jitterPx: 1.4, // pomeraj položaja izvora (px)
    dipEvery: [6, 18], // sekunde između kratkih prigušenja
    dipLen: [0.2, 0.5],
    dipDepth: 0.55,
  },

  // Boje su mešavine boje tokena sa belom (jezgro) i tamnom (ivica); 0 = bez mešanja, 1 = potpuno.
  palette: {
    warm: { coreWhite: 0.6, edgeDark: 0.62, edgeTarget: [112, 42, 14], coreTarget: [255, 247, 226] },
    cold: { coreWhite: 0.45, edgeDark: 0.5, edgeTarget: [38, 58, 88], coreTarget: [236, 244, 250] },
  },

  glow: {
    coreRadius: 0.95, // poluprečnik jarkog jezgra (% širine slike): ~1–2% prečnika
    coreAlpha: 0.7,
    haloRadius: 1.45, // × r
    haloAlpha: 0.34,
    haloSquash: 0.9, // spljoštenost (visina/širina) — elipsa, ne krug
    haloTilt: 0.07, // nagib (rad), nasumičan znak po instanci
    bloomRadius: 3.4, // × r, veoma širok i slab
    bloomAlpha: 0.1,
    cone: { minFlicker: 0.15, length: 2.5, width: 1.1, alpha: 0.11 }, // zrak nadole samo kod lampi (flicker ≥ minFlicker)
    window: { maxFlicker: 0.15, coreAlpha: 0.32, haloAlpha: 0.3, bloomAlpha: 0.12, pulse: 0.06, pulseHz: 0.11 },
  },

  // "Bazen svetla" na podlozi ispod izvora (pod, zid, sneg): spljošten, nagnut, sporiji i slabiji od izvora.
  pool: { dy: 1.55, width: 5.2, height: 0.3, alpha: 0.08, tilt: 0.05, slow: 0.45 },

  fire: {
    tongues: 5,
    height: 2.0, // × r
    width: 1.25, // × r
    period: [0.75, 1.5], // sekunde života jednog jezička
    alpha: 0.5,
    haloAlpha: 0.3,
    bloomAlpha: 0.09,
    flicker: 0.55,
    breath: 0.2, // nepravilno "disanje" visine
    painted: {
      // animacija NAslikanog plamena (source: 'painted'): iseče se područje iz slike i talasa se red po red
      defaultW: 1.25, // podrazumevana širina područja (× r, % širine slike): otvor peći, ne cela peć
      defaultH: 1.3, // podrazumevana visina (× širina u pikselima, pa u % visine slike)
      feather: 0.18, // širina mekog ruba maske gore/dole (udeo visine)
      featherX: 0.26, // levo/desno (šire, da okvir peći ne talasa)
      featherPower: 1.15,
      waveAmp: 0.055, // najveći vodoravni pomak (× širina područja) pri vrhu
      baseWave: 0.12, // koliko talasanja ostaje pri dnu (udeo)
      topBias: 1.3,
      hz: [1.1, 2.7, 4.3], // vremenske učestalosti tri talasa
      stretch: 0.08, // ±8% visine, sidro na dnu
      stretchHz: [0.8, 1.9],
      rowHeight: 2, // visina reda u pikselima slike
      peakTint: 0.3, // jezgro belje na vrhuncu treperenja
      dipTint: 0.3, // toplije pri padu
      darkAmount: 0.6, // potamnjenje kopije ispod komada
      darkAlpha: 0.6,
      haloScale: 0.8, // blaži halo (slika već ima naslikan sjaj)
    },
    smoke: { alpha: 0.055, puffs: 2 }, // tanak tamni dim iznad vrha
    sparks: { max: 3, maxPhone: 1, every: [1.4, 5], life: [0.9, 1.8], rise: [1.1, 2.3], size: 0.2, alpha: 0.9, tail: 3, tailStep: 0.05 },
  },

  sun: {
    coreRadius: 0.55, // × r
    haloRadius: 1.7,
    bloomRadius: 3.4,
    coreAlpha: 0.42,
    haloAlpha: 0.3,
    bloomAlpha: 0.14,
    breathHz: [0.07, 0.19],
    breath: [0.05, 0.03],
    rays: { count: 9, length: [4.5, 7.5], width: 0.9, alpha: 0.06, breathHz: 0.05 },
    horizon: { alpha: 0.07, width: 11, height: 0.22 }, // toplo pojačanje dole
  },

  twinkle: { haloRadius: 2.3, coreRadius: 0.55, haloAlpha: 0.24, coreAlpha: 0.55, flicker: 0.4, hzScale: [0.5, 1.7] },

  smoke: {
    puffs: 8, // po izvoru (desktop); na telefonu manje
    life: [7, 11],
    rise: [0.9, 1.5], // % širine slike u sekundi (viši, tanji stubovi)
    grow: [1.3, 3.6], // × w (krajnja veličina; uži stub umesto širokog oblaka)
    alpha: 0.27,
    windPx: 0.5, // koliko vetar nosi dim (× w po sekundi)
    warmEnd: 0.4, // do kog dela života je dim topao
    spin: 0.08,
  },

  snow: {
    // sloj: udeo čestica, veličina (px), brzina (visina ekrana/s), providnost, ljuljanje, uticaj vetra
    layers: [
      { share: 0.45, kind: 'sharp', size: [1.2, 2.1], vy: [0.09, 0.13], alpha: [0.3, 0.55], sway: 0.012, wind: 0.5 },
      { share: 0.35, kind: 'soft', size: [3, 5], vy: [0.06, 0.09], alpha: [0.35, 0.6], sway: 0.02, wind: 1 },
      { share: 0.2, kind: 'bokeh', size: [11, 20], vy: [0.03, 0.05], alpha: [0.05, 0.11], sway: 0.028, wind: 1.5 },
    ],
    gust: { every: [9, 22], len: [1.2, 2.2], push: [0.12, 0.26] }, // nalet vetra (širina ekrana/s)
  },

  dust: { size: [0.9, 1.7], alpha: [0.25, 0.55], reach: 2.2, wander: 0.6, sharePerLight: true },

  rain: {
    layers: [
      { share: 0.6, len: [10, 18], vy: [0.9, 1.15], alpha: [0.1, 0.2], width: 1 },
      { share: 0.4, len: [20, 34], vy: [1.3, 1.7], alpha: [0.14, 0.28], width: 1.4 },
    ],
    tilt: 0.14,
    gust: { every: [7, 16], len: [1.5, 3], boost: 0.7 },
  },

  // Ekrani (screen/screens): tok podataka, skeniranje, pulsiranje, alarm + spill i scanline
  screen: {
    scale: 0.75, // rezolucija offscreen canvasa ekrana (× CSS px)
    bigFrac: 0.4, // ekran širi od 40% slike je veliki: niža rezolucija i bez scanline
    bigScale: 0.5,
    fps: 30, // ekrani se ažuriraju 30 puta u sekundi
    phoneFps: 30, // isto na telefonu
    inset: 0.04, // svetlo se skuplja ka sredini da ostane unutar stakla
    dataRows: 9, // koliko redova toka podataka stane na ekran
    dataSpeed: 1.2, // redova u sekundi (× speed)
    dataAlpha: 0.95,
    baseGlow: 0.28,
    scanPeriod: [4, 9], // sekunde po prolazu pojasa
    scanAlpha: 0.85,
    pulseAlpha: 0.6,
    alertAlpha: 1.1,
    alertEvery: [6, 14], // sekunde između alarmnih treperenja
    scanlineAlpha: 0.06,
    spillAlpha: 0.14,
    spillMaxW: 14, // najveća širina spill elipse (% širine slike), za duge tanke ekrane
    spillMinH: 1.2, // najmanja visina
  },

  // Voda: talasanje naslikane vode + odsjaji + stubovi odsjaja (region u % slike)
  water: {
    rippleMax: 1.0, // najveći vodoravni pomak = ripple × ovo (% širine slike); pri ripple 0.4 ≈ 0.4%
    rowHeight: 3, // visina reda (px slike)
    fps: 30, // talasanje se računa 30 puta u sekundi
    cycles: [7, 17, 33], // prostorni ciklusi tri talasa po regionu (gušće ka vrhu / horizontu zbog perspektive)
    hz: [0.32, 0.75, 1.5],
    weights: [0.5, 0.3, 0.2],
    featherX: 0.06, // meki rub regiona (udeo)
    featherY: 0.12,
    bigRegion: 0.4, // region širi od 40% slike crta se u nižoj rezoluciji (bigScale)
    bigScale: 0.6,
    glints: { max: 14, maxPhone: 7, size: [0.2, 0.6], aspect: 0.2, life: [0.4, 1.5], gap: [0.15, 2.2], alpha: 0.55, nearColumn: 0.6, colSigma: 3.5 },
    columns: { segments: 16, width: [0.5, 2.8], alpha: 0.34, breakHz: [0.22, 0.55], flicker: 0.25 },
  },

  mist: {
    bands: [
      { y: 0.72, h: 0.3, speed: 0.0042, alpha: 0.08, seed: 3 },
      { y: 0.8, h: 0.26, speed: -0.0026, alpha: 0.07, seed: 11 },
      { y: 0.66, h: 0.22, speed: 0.0016, alpha: 0.055, seed: 29 },
    ],
    texture: { w: 384, h: 96 },
    tint: [150, 160, 172], // primesa u boju magle (sa tokenom fxCold)
    tintMix: 0.5,
  },
};
