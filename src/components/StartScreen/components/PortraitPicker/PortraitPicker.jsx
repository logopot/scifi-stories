import React, { useRef } from 'react';
import * as S from './PortraitPicker.styled';

// Izbor portreta čitaoca: radio grupa malih kartica sa slikom. `options` su [{ value, src }]; label(n) daje aria-label
// kartice n (od 1). Tastatura: Tab ulazi u grupu (fokus na izabranoj kartici), strelice menjaju izbor, Enter/Space biraju.
export default function PortraitPicker({ options, value, onChange, labelledBy, label }) {
  const refs = useRef([]);

  const move = (from, delta) => {
    const next = (from + delta + options.length) % options.length;
    onChange(options[next].value);
    refs.current[next]?.focus();
  };

  const onKeyDown = (e, i) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      move(i, 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      move(i, -1);
    }
  };

  return (
    <S.Root role="radiogroup" aria-labelledby={labelledBy}>
      {options.map((o, i) => {
        const selected = o.value === value;
        return (
          <S.Card
            key={o.value}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={label(i + 1)}
            tabIndex={selected ? 0 : -1}
            $on={selected}
            onClick={() => onChange(o.value)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            <S.Image src={`${import.meta.env.BASE_URL}${o.src}`} alt="" draggable={false} />
          </S.Card>
        );
      })}
    </S.Root>
  );
}
