import React, { useEffect, useReducer } from 'react';
import Mirror from '../../../../components/Mirror';
import Scene from '../../../../components/Scene';
import StartScreen from '../../../../components/StartScreen';
import { useStory } from '../../../../engine/StoryContext';
import useScrollReset from '../../../../hooks/useScrollReset';
import { loadReaderPrefs, saveReaderPrefs } from '../../../../engine/storage';
import * as S from './ReaderSession.styled';

// Tok čitanja jedne priče: početni ekran -> scene -> kraj.
export default function ReaderSession({ resume }) {
  const { engine } = useStory();
  const [state, dispatch] = useReducer(engine.reducer, null, () => {
    const saved = resume ? engine.loadSaved() : null;
    return saved ? { ...engine.initialState, ...saved, screen: 'play' } : engine.initialState;
  });
  // Sačuvan progres se čita svaki put kad se prikaže početni ekran (posle "Počni ispočetka" ga više nema).
  const saved = state.screen === 'start' ? engine.loadSaved() : null;

  useEffect(() => {
    engine.persist(state);
  }, [engine, state]);

  // Prelaz između ekrana (početni, priča, kraj) uvek počinje na vrhu.
  useScrollReset([state.screen]);

  const player = { gender: state.gender, name: state.name };

  return (
    <>
      <S.BackLink to="/">← Sve priče</S.BackLink>
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
        <Mirror picks={state.picks} ending={state.ending} player={player} onRestart={() => dispatch({ type: 'RESET' })} />
      )}
    </>
  );
}
