import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../components/Button';
import Cover from '../../components/Cover';
import Heading from '../../components/Heading';
import Page from '../../components/Page';
import Paragraph from '../../components/Paragraph';
import Subtitle from '../../components/Subtitle';
import TextLink from '../../components/TextLink';
import { clearSave, hasSave } from '../../engine/storage';
import { SITE_NAME } from '../../config';
import useDocumentMeta from '../../hooks/useDocumentMeta';
import useStoryData from '../../hooks/useStoryData';
import { getStoryEntry } from '../../stories';
import NotFound from '../NotFound';
import RestartControl from './components/RestartControl';
import * as S from './StoryPage.styled';

export default function StoryPage() {
  const { slug } = useParams();
  const entry = getStoryEntry(slug);
  if (!entry) return <NotFound />;
  return <StoryPageContent entry={entry} />;
}

function StoryPageContent({ entry }) {
  const navigate = useNavigate();
  const soon = entry.status === 'soon';
  const { story } = useStoryData(soon ? null : entry);
  const [saved, setSaved] = useState(() => !soon && hasSave(entry.slug));
  const description = soon ? entry.description || [] : story?.meta?.description || [];
  const readPath = `/${entry.slug}/citaj`;

  useDocumentMeta(`${entry.title} · ${SITE_NAME}`, entry.tagline);

  const details = [entry.genre, entry.minutes ? `oko ${entry.minutes} min` : null, soon ? 'Uskoro' : 'Priča se sama čuva']
    .filter(Boolean)
    .join(' · ');

  const restart = () => {
    clearSave(entry.slug);
    setSaved(false);
    navigate(readPath);
  };

  return (
    <Page variant="narrow">
      <S.Back>
        <TextLink to="/">← Sve priče</TextLink>
      </S.Back>
      <Cover src={entry.cover} alt={entry.coverAlt} rounded />
      <S.Body>
        <Heading variant="title">{entry.title}</Heading>
        <Subtitle>{entry.tagline}</Subtitle>
        <S.Description>
          {description.map((text, i) => (
            <Paragraph key={i}>{text}</Paragraph>
          ))}
        </S.Description>
        <S.Details>{details}</S.Details>
        <S.Actions>
          {soon ? (
            <Button disabled>Uskoro</Button>
          ) : (
            <Button to={readPath} state={saved ? { resume: true } : null}>
              {saved ? 'Nastavi priču' : 'Počni priču'}
            </Button>
          )}
          {saved && <RestartControl onConfirm={restart} />}
        </S.Actions>
      </S.Body>
    </Page>
  );
}
