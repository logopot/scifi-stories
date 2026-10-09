import React, { useMemo, useState } from 'react';
import story from '../engine/engine';
import { cleanName, detectGender, MAX_NAME } from '../engine/player';
import { Choice, ChoiceRow, MenuLabel, NameInput, Paragraph, Primary, Quiet, Subtitle, Title } from './ui';

export default function StartScreen({ hasSave, onBegin, onContinue }) {
  const { meta, ui } = story;
  const s = ui.start;
  const [raw, setRaw] = useState('');
  const [picked, setPicked] = useState(null); // rod koji je čitalac sam izabrao
  const name = useMemo(() => cleanName(raw), [raw]);
  const guessed = useMemo(() => detectGender(name), [name]);
  const gender = picked || guessed; // izbor čitaoca ima prednost nad spiskom imena
  const shownName = name || (gender ? s.defaults[gender] : '');

  let hint = s.hintNeed;
  if (name && guessed && !picked) hint = s.hintFound;
  else if (name && !guessed && !picked) hint = s.hintUnknown;
  else if (gender) hint = '';

  return (
    <section>
      <Title>{meta.title}</Title>
      <Subtitle>{meta.subtitle}</Subtitle>

      {s.intro.map((text, i) => (
        <Paragraph key={i}>{text}</Paragraph>
      ))}

      <MenuLabel as="label" htmlFor="player-name" className="mt-4 d-block">{s.nameLabel}</MenuLabel>
      <NameInput
        id="player-name"
        type="text"
        value={raw}
        maxLength={MAX_NAME + 4}
        placeholder={s.namePlaceholder}
        autoComplete="off"
        onChange={(e) => {
          setRaw(e.target.value);
          setPicked(null); // novo ime: rod se ponovo pogađa sa spiska
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && gender) onBegin(gender, name);
        }}
      />

      <MenuLabel as="p" id="gender-label" className="mt-4">{s.genderLabel}</MenuLabel>
      <ChoiceRow role="radiogroup" aria-labelledby="gender-label">
        {Object.entries(s.genders).map(([key, label]) => (
          <Choice
            key={key}
            type="button"
            role="radio"
            aria-checked={gender === key}
            $on={gender === key}
            onClick={() => setPicked(key)}
          >
            {label}
          </Choice>
        ))}
      </ChoiceRow>

      <p className="mt-2" style={{ fontSize: '0.9rem', minHeight: '1.4em' }}>
        {gender ? (
          <>
            {s.chosen} <strong>{shownName}</strong>
            {hint && <span style={{ opacity: 0.7 }}> · {hint}</span>}
          </>
        ) : (
          <span style={{ opacity: 0.8 }}>{hint}</span>
        )}
      </p>

      <p className="mt-4" style={{ fontStyle: 'italic', opacity: 0.8 }}>{s.note}</p>

      <div className="d-flex flex-wrap gap-3 mt-4">
        <Primary type="button" disabled={!gender} onClick={() => onBegin(gender, name)}>{s.begin}</Primary>
        {hasSave && <Quiet type="button" onClick={onContinue}>{s.continue}</Quiet>}
      </div>

      <p className="mt-5" style={{ fontSize: '0.85rem', opacity: 0.7 }}>{s.tip}</p>
    </section>
  );
}
