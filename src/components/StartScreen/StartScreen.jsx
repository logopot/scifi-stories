import React, { useMemo, useState } from 'react';
import { useStory } from '../../engine/StoryContext';
import { cleanName, detectGender, MAX_NAME } from '../../engine/player';
import Button from '../Button';
import ChoiceButton from '../ChoiceButton';
import ChoiceGroup from '../ChoiceGroup';
import Heading from '../Heading';
import Paragraph from '../Paragraph';
import Subtitle from '../Subtitle';
import TextInput from '../TextInput';
import * as S from './StartScreen.styled';

// `prefs` ({ name, gender } ili null) unapred popunjava ime i rod koje je čitalac ranije upisao.
export default function StartScreen({ prefs, hasSave, onBegin, onContinue }) {
  const { story } = useStory();
  const { meta, ui } = story;
  const s = ui.start;
  const [raw, setRaw] = useState(prefs?.name || '');
  const [picked, setPicked] = useState(prefs?.gender || null); // rod koji je čitalac sam izabrao
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
      <Heading variant="title">{meta.title}</Heading>
      <Subtitle>{meta.subtitle}</Subtitle>

      {s.intro.map((text, i) => (
        <Paragraph key={i}>{text}</Paragraph>
      ))}

      <S.FieldLabel tag="label" htmlFor="player-name">
        {s.nameLabel}
      </S.FieldLabel>
      <TextInput
        id="player-name"
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

      <S.FieldLabel tag="p" id="gender-label">
        {s.genderLabel}
      </S.FieldLabel>
      <ChoiceGroup labelledBy="gender-label">
        {Object.entries(s.genders).map(([key, label]) => (
          <ChoiceButton key={key} selected={gender === key} onClick={() => setPicked(key)}>
            {label}
          </ChoiceButton>
        ))}
      </ChoiceGroup>

      <S.Status>
        {gender ? (
          <>
            {s.chosen} <strong>{shownName}</strong>
            {hint && <S.Muted> · {hint}</S.Muted>}
          </>
        ) : (
          <S.Soft>{hint}</S.Soft>
        )}
      </S.Status>

      <S.Note>{s.note}</S.Note>

      <S.Actions>
        <Button disabled={!gender} onClick={() => onBegin(gender, name)}>
          {s.begin}
        </Button>
        {hasSave && (
          <Button variant="quiet" onClick={onContinue}>
            {s.continue}
          </Button>
        )}
      </S.Actions>

      <S.Tip>{s.tip}</S.Tip>
    </section>
  );
}
