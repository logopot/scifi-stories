import { useMemo } from 'react';

// Slučajni brojevi se biraju jednom pri montiranju efekta (ne pri svakom renderu), pa lampe nisu sinhrone.
export const between = (min, max) => min + Math.random() * (max - min);

export const useRandom = (make) => useMemo(make, []); // eslint-disable-line react-hooks/exhaustive-deps

// Pozicija (centar) i prečnik u procentima pravougaonika koji slika zauzima.
export const spot = (x, y, diameter) => ({ left: `${x}%`, top: `${y}%`, width: `${diameter}%` });

// Promenljive treperenja: lo/mid su najniže neprozirnosti ciklusa (flicker 0 = bez treperenja).
export const flickerVars = (flicker, dur) => ({
  '--lo': 1 - flicker * 0.9,
  '--mid': 1 - flicker * 0.45,
  '--dur': `${dur}s`,
  '--delay': `-${between(0, dur)}s`,
});
