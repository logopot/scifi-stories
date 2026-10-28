import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../components/Button';
import Heading from '../../components/Heading';
import Page from '../../components/Page';
import Paragraph from '../../components/Paragraph';
import useDocumentMeta from '../../hooks/useDocumentMeta';
import useLocalePath from '../../i18n/useLocalePath';
import * as S from './NotFound.styled';

export default function NotFound() {
  const { t } = useTranslation();
  const localePath = useLocalePath();
  useDocumentMeta(t('notFound.metaTitle', { name: t('site.name') }), t('notFound.metaDescription'));

  return (
    <Page variant="narrow">
      <S.Box>
        <Heading variant="title">{t('notFound.title')}</Heading>
        <Paragraph>{t('notFound.text')}</Paragraph>
        <Button to={localePath()}>{t('site.allStories')}</Button>
      </S.Box>
    </Page>
  );
}
