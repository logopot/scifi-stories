import React from 'react';
import Button from '../../components/Button';
import Heading from '../../components/Heading';
import Page from '../../components/Page';
import Paragraph from '../../components/Paragraph';
import { SITE_NAME } from '../../config';
import useDocumentMeta from '../../hooks/useDocumentMeta';
import * as S from './NotFound.styled';

export default function NotFound() {
  useDocumentMeta(`Nema takve priče · ${SITE_NAME}`, 'Tražena stranica ne postoji.');

  return (
    <Page variant="narrow">
      <S.Box>
        <Heading variant="title">Nema takve priče</Heading>
        <Paragraph>Ova adresa ne vodi nigde. Možda je priča premeštena, ili je link pogrešno ukucan.</Paragraph>
        <Button to="/">← Sve priče</Button>
      </S.Box>
    </Page>
  );
}
