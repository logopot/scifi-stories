import React, { useEffect, useReducer, useRef } from 'react';
import OnImage from '../../../../components/OnImage';
import LogoLink from '../../../../components/LogoLink';
import Mirror from '../../../../components/Mirror';
import Scene from '../../../../components/Scene';
import SceneBackdrop from '../../../../components/SceneBackdrop';
import StartScreen from '../../../../components/StartScreen';
import LangSwitch from '../../../../components/LangSwitch';
import TextLink from '../../../../components/TextLink';
import { useTranslation } from 'react-i18next';
import { useStory } from '../../../../engine/StoryContext';
import useLocalePath from '../../../../i18n/useLocalePath';
import useScrollReset from '../../../../hooks/useScrollReset';
import { loadReaderPrefs, saveReaderPrefs } from '../../../../engine/storage';
import * as S from './ReaderSession.styled';

// Tok čitanja jedne priče: početni ekran -> scene -> kraj.
export default function ReaderSession() {
  const { engine, story, cover } = useStory();
  const { t } = useTranslation();
  const localePath = useLocalePath();
  const [state, dispatch] = useReducer(engine.reducer, null, () => {
    return engine.initialState; // uvek počinje početnim ekranom; sačuvan napredak nudi dugme „Nastavi“
  });
  // Sačuvan progres se čita svaki put kad se prikaže početni ekran (posle "Počni ispočetka" ga više nema).
  const saved = state.screen === 'start' ? engine.loadSaved() : null;

  useEffect(() => {
    engine.persist(state);
  }, [engine, state]);

  // Prelaz između ekrana (početni, priča, kraj) uvek počinje na vrhu.
  useScrollReset([state.screen]);

  const player = { gender: state.gender, name: state.name, lang: engine.lang };

  // Jedan trajni sloj pozadine služi početnom ekranu (naslovna slika), stranama priče (slika mesta scene; scena bez
  // slike zadržava prethodnu, pa naslovnu) i završnom ekranu (poslednja slika). Menja se samo `src`, pa se slike preliju.
  const lastScene = useRef(null);
  if (state.screen === 'start') lastScene.current = null;
  const nodeImage = state.screen === 'play' ? engine.getImage(story.nodes[state.node]?.img) : null;
  if (nodeImage && nodeImage.src) lastScene.current = nodeImage.src;
  const backdropSrc = state.screen === 'start' ? cover : lastScene.current || cover;
  // efekti (images[id].fx) slike koja je trenutno iza strane; naslovna slika ima svoj unos u images (id cover) ako je dobila efekte
  const backdropFx = Object.values(story.images || {}).find((im) => im.src === backdropSrc)?.fx;

  // Slike mogućih sledećih scena (na početnom ekranu: prve scene) učitavaju se unapred, van glavne niti.
  useEffect(() => {
    if (state.screen === 'mirror') return;
    const node = story.nodes[state.node];
    const ids =
      state.screen === 'start'
        ? [story.start]
        : [
            node.next,
            ...(node.branch || []).map((b) => b.next),
            ...(node.choices || []).map((c) => c.next),
            node.hidden?.next,
          ];
    ids
      .filter(Boolean)
      .map((id) => engine.getImage(story.nodes[id]?.img))
      .filter((img) => img && img.src)
      .forEach((img) => {
        const im = new Image();
        im.decoding = 'async';
        im.src = `${import.meta.env.BASE_URL}${img.src}`;
        im.decode?.().catch(() => {});
      });
  }, [state.screen, state.node, engine, story]);

  return (
    <>
      <SceneBackdrop src={backdropSrc} fx={backdropFx} />
      <OnImage>
        <S.BackBar>
          <LogoLink size="xs" variant="onImage" />
          <TextLink to={localePath()}>{t('site.allStories')}</TextLink>
          <LangSwitch />
        </S.BackBar>
      </OnImage>
      {state.screen === 'start' && (
        <StartScreen
          prefs={loadReaderPrefs()}
          hasSave={Boolean(saved)}
          onBegin={(gender, name) => {
            saveReaderPrefs({ gender, name });
            dispatch({ type: 'BEGIN', gender, name });
          }}
          onContinue={() => dispatch({ type: 'LOAD', saved })}
        />
      )}
      {state.screen === 'play' && (
        <Scene key={state.node} nodeId={state.node} picks={state.picks} player={player} dispatch={dispatch} />
      )}
      {state.screen === 'mirror' && (
        <Mirror
          picks={state.picks}
          ending={state.ending}
          player={player}
          onRestart={() => dispatch({ type: 'RESET' })}
        />
      )}
    </>
  );
}
