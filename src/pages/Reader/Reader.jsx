import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, useParams } from 'react-router-dom';
import Layout from '../../components/Layout';
import Page from '../../components/Page';
import Sky from '../../components/Sky';
import TextLink from '../../components/TextLink';
import { createEngine } from '../../engine/engine';
import { StoryContext } from '../../engine/StoryContext';
import useDocumentMeta from '../../hooks/useDocumentMeta';
import useStoryData from '../../hooks/useStoryData';
import useLocalePath, { useLang } from '../../i18n/useLocalePath';
import { findByPath, hasLang, localizeEntry, storyPath } from '../../stories';
import NotFound from '../NotFound';
import ReaderSession from './components/ReaderSession';
import * as S from './Reader.styled';

// Čitač traži priču po javnoj adresi jezika; interno radi sa ključem (slug). Adresa drugog jezika vodi na ispravnu
// adresu ovog jezika (replace), ako priča na njemu postoji; inače je 404 na jeziku adrese.
export default function Reader() {
  const { path } = useParams();
  const lang = useLang();
  const found = findByPath(lang, path);
  if (!found || found.status === 'soon') {
    const other = findByPath(lang === 'en' ? 'sr' : 'en', path);
    if (other && other.status !== 'soon' && hasLang(other, lang)) {
      return <Navigate to={storyPath(lang, other)} replace />;
    }
    return (
      <Layout>
        <NotFound />
      </Layout>
    );
  }
  return <ReaderLoader entry={localizeEntry(found, lang)} lang={lang} />;
}

function ReaderLoader({ entry, lang }) {
  const { t } = useTranslation();
  const localePath = useLocalePath();
  const { story, status } = useStoryData(entry, lang);
  const engine = useMemo(() => (story ? createEngine(story, entry.slug, lang) : null), [story, entry.slug, lang]);
  const context = useMemo(
    () => (engine ? { slug: entry.slug, story, engine, cover: entry.cover || null } : null),
    [engine, story, entry.slug, entry.cover]
  );

  useDocumentMeta(`${entry.title} · ${t('site.name')}`, entry.tagline);

  return (
    <>
      <Sky />
      <Page variant="reader">
        {status === 'ready' && context && (
          <StoryContext.Provider value={context}>
            <ReaderSession key={`${entry.slug}-${lang}`} />
          </StoryContext.Provider>
        )}
        {status === 'loading' && <S.Status>{t('reader.loading')}</S.Status>}
        {status === 'error' && (
          <>
            <S.Status>{t('reader.error')}</S.Status>
            <TextLink to={localePath()}>{t('site.allStories')}</TextLink>
          </>
        )}
      </Page>
    </>
  );
}
