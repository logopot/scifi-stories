import React, { useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import LogoLink from '../../components/LogoLink';
import OnImage from '../../components/OnImage';
import Page from '../../components/Page';
import Scene from '../../components/Scene';
import SceneBackdrop from '../../components/SceneBackdrop';
import Sky from '../../components/Sky';
import TextLink from '../../components/TextLink';
import { createEngine } from '../../engine/engine';
import { StoryContext } from '../../engine/StoryContext';
import useStoryData from '../../hooks/useStoryData';
import { getStoryEntry } from '../../stories';
import * as S from '../Reader/components/ReaderSession/ReaderSession.styled';

// SAMO ZA RAZVOJ (ruta postoji samo uz import.meta.env.DEV, vidi App.jsx): jedna strana jedne scene, bez početnog ekrana.
// /dev/scene/:slug/:node/:page?g=m|f&name=Ime&picks=id1,id2   (page je od 1; picks su id-evi izbora koji su "napravljeni")
// Koristi ga scripts/check-layout.mjs da bi stigao do svake strane svake priče.
export default function DevScene() {
  const { slug, node, page } = useParams();
  const [params] = useSearchParams();
  const entry = getStoryEntry(slug);
  const { story, status } = useStoryData(entry);
  const engine = useMemo(() => (story ? createEngine(story, slug) : null), [story, slug]);
  const context = useMemo(
    () => (engine ? { slug, story, engine, cover: (entry && entry.cover) || null } : null),
    [engine, story, slug, entry]
  );
  const picks = useMemo(
    () =>
      (params.get('picks') || '')
        .split(',')
        .filter(Boolean)
        .map((id) => ({ id, node: '', w: {}, hidden: false })),
    [params]
  );
  const player = { gender: params.get('g') === 'f' ? 'f' : 'm', name: params.get('name') || '' };

  if (status !== 'ready' || !context || !story.nodes[node]) return <p data-dev-status={status}>…</p>;
  const nodeImage = engine.getImage(story.nodes[node].img);
  const backdropSrc = (nodeImage && nodeImage.src) || context.cover;

  return (
    <>
      <Sky />
      <Page variant="reader">
        <StoryContext.Provider value={context}>
          <SceneBackdrop src={backdropSrc} />
          <OnImage>
            <S.BackBar>
              <LogoLink size="xs" variant="onImage" />
              <TextLink to="/">← Sve priče</TextLink>
            </S.BackBar>
          </OnImage>
          <Scene
            key={`${node}-${page}`}
            nodeId={node}
            picks={picks}
            player={player}
            dispatch={() => {}}
            initialPage={Math.max(0, Number(page) - 1)}
          />
        </StoryContext.Provider>
      </Page>
    </>
  );
}
