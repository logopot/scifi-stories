import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';
import LangSwitch from '../../components/LangSwitch';
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
import useLocalePath from '../../i18n/useLocalePath';
import { getStoryEntry, localizeEntry } from '../../stories';
import * as S from '../Reader/components/ReaderSession/ReaderSession.styled';

// SAMO ZA RAZVOJ (ruta postoji samo uz import.meta.env.DEV, vidi App.jsx): jedna strana jedne scene, bez početnog ekrana.
// /dev/scene/:slug/:node/:page?g=m|f&name=Ime&picks=id1,id2   (page je od 1; picks su id-evi izbora koji su "napravljeni")
// Koristi ga scripts/check-layout.mjs da bi stigao do svake strane svake priče.
// Za probu engleske verzije šablona: /dev/scene/_template/pocetak/1?lang=en (učitava _template/story.en.json; šablon nije u registru).
export default function DevScene() {
  const { slug, node, page } = useParams();
  const [params] = useSearchParams();
  const { t } = useTranslation();
  const localePath = useLocalePath();
  const lang = params.get('lang') === 'en' ? 'en' : 'sr';
  const entry = useMemo(() => {
    if (slug === '_template') return { slug, load: lang === 'en' ? () => import('../../stories/_template/story.en.json') : () => import('../../stories/_template/story.json') };
    const e = getStoryEntry(slug);
    return e ? localizeEntry(e, lang) : null;
  }, [slug, lang]);
  const { story, status } = useStoryData(entry, lang);
  const engine = useMemo(() => (story ? createEngine(story, slug, lang) : null), [story, slug, lang]);
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
  const player = { gender: params.get('g') === 'f' ? 'f' : 'm', name: params.get('name') || '', lang };

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
              <TextLink to={localePath()}>{t('site.allStories')}</TextLink>
              <LangSwitch />
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
