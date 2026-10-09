import React, { useEffect, useReducer } from 'react';
import { initialState, loadSaved, persist, reducer } from './engine/engine';
import { Column, Page, Sky } from './components/ui';
import StartScreen from './components/StartScreen';
import Scene from './components/Scene';
import Mirror from './components/Mirror';

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  // Sačuvan progres se čita svaki put kad se prikaže početni ekran (posle "Počni ispočetka" ga više nema).
  const saved = state.screen === 'start' ? loadSaved() : null;

  useEffect(() => {
    persist(state);
  }, [state]);

  return (
    <>
      <Sky />
      <Page>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-9 col-xl-8">
              <Column>
                {state.screen === 'start' && (
                  <StartScreen
                    hasSave={Boolean(saved)}
                    onBegin={(gender, name) => dispatch({ type: 'BEGIN', gender, name })}
                    onContinue={() => dispatch({ type: 'LOAD', saved })}
                  />
                )}
                {state.screen === 'play' && (
                  <Scene
                    key={state.node}
                    nodeId={state.node}
                    picks={state.picks}
                    player={{ gender: state.gender, name: state.name }}
                    dispatch={dispatch}
                  />
                )}
                {state.screen === 'mirror' && (
                  <Mirror
                    picks={state.picks}
                    ending={state.ending}
                    player={{ gender: state.gender, name: state.name }}
                    onRestart={() => dispatch({ type: 'RESET' })}
                  />
                )}
              </Column>
            </div>
          </div>
        </div>
      </Page>
    </>
  );
}
