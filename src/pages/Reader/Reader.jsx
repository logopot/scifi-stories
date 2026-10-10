import React, { useMemo } from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import Layout from '../../components/Layout';
import Page from '../../components/Page';
import Sky from '../../components/Sky';
import TextLink from '../../components/TextLink';
import { createEngine } from '../../engine/engine';
import { StoryContext } from '../../engine/StoryContext';
import { SITE_NAME } from '../../config';
import useDocumentMeta from '../../hooks/useDocumentMeta';
import useStoryData from '../../hooks/useStoryData';
import { getStoryEntry } from '../../stories';
import NotFound from '../NotFound';
import ReaderSession from './components/ReaderSession';
import * as S from './Reader.styled';

export default function Reader() {
  const { slug } = useParams();
  const entry = getStoryEntry(slug);
  if (!entry) {
    return (
      <Layout>
        <NotFound />
      </Layout>
    );
  }
  if (entry.status === 'soon') return <Navigate to={`/${slug}`} replace />;
  return <ReaderLoader entry={entry} />;
}

function ReaderLoader({ entry }) {
  const location = useLocation();
  const { story, status } = useStoryData(entry);
  const engine = useMemo(() => (story ? createEngine(story, entry.slug) : null), [story, entry.slug]);
  const context = useMemo(() => (engine ? { slug: entry.slug, story, engine } : null), [engine, story, entry.slug]);

  useDocumentMeta(`${entry.title} · ${SITE_NAME}`, entry.tagline);

  return (
    <>
      <Sky />
      <Page variant="reader">
        {status === 'ready' && context && (
          <StoryContext.Provider value={context}>
            <ReaderSession key={entry.slug} resume={Boolean(location.state?.resume)} />
          </StoryContext.Provider>
        )}
        {status === 'loading' && <S.Status>Učitavam priču…</S.Status>}
        {status === 'error' && (
          <>
            <S.Status>Priča se nije učitala. Proveri vezu i pokušaj ponovo.</S.Status>
            <TextLink to="/">← Sve priče</TextLink>
          </>
        )}
      </Page>
    </>
  );
}
