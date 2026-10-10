import { useLayoutEffect } from 'react';

// Trenutni skok na vrh (bez glatkog skrolovanja); radi i kad je skrolujući element body ili html.
export const resetScroll = () => {
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  const root = document.scrollingElement;
  if (root) {
    root.scrollTop = 0;
    root.scrollLeft = 0;
  }
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
};

// Skok na vrh pre iscrtavanja kad se promene `deps`, i još jednom posle prvog frejma
// (adresna traka na telefonu i kasno učitane slike ne smeju da vrate pogled naniže).
export default function useScrollReset(deps) {
  useLayoutEffect(() => {
    resetScroll();
    const id = requestAnimationFrame(resetScroll);
    return () => cancelAnimationFrame(id);
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
}
