import React from 'react';
import { useTranslation } from 'react-i18next';
import Heading from '../../components/Heading';
import Page from '../../components/Page';
import Paragraph from '../../components/Paragraph';
import TextLink from '../../components/TextLink';
import { LEGAL } from '../../config';
import useDocumentMeta from '../../hooks/useDocumentMeta';
import contentEn from '../../i18n/legal/en';
import contentSr from '../../i18n/legal/sr';
import useLocalePath, { useLang } from '../../i18n/useLocalePath';
import * as S from './Legal.styled';

const CONTENT = { sr: contentSr, en: contentEn };
const TOKEN = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)|\{(site|year)\}/g;

// Tekst sa tokenima: {site} (naziv sajta) i {year} (iz LEGAL u src/config.js); [tekst](adresa) je link.
const inline = (text, values) => {
  const out = [];
  let last = 0;
  let i = 0;
  for (const m of text.matchAll(TOKEN)) {
    out.push(text.slice(last, m.index));
    if (m[2]) {
      out.push(
        <a key={i++} href={m[2]} rel="noopener noreferrer">
          {m[1]}
        </a>
      );
    } else {
      out.push(values[m[3]]);
    }
    last = m.index + m[0].length;
  }
  out.push(text.slice(last));
  return out;
};

const formatDate = (iso, lang) => {
  try {
    return new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : 'sr-Latn-RS', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(iso));
  } catch {
    return iso;
  }
};

// Pravna stranica (politika privatnosti, odricanje odgovornosti): tekst iz src/i18n/legal/<jezik>.js, podaci iz LEGAL.
export default function Legal({ pageKey }) {
  const { t } = useTranslation();
  const lang = useLang();
  const localePath = useLocalePath();
  const page = CONTENT[lang][pageKey];
  const values = { site: t('site.name'), year: String(LEGAL.year) };
  useDocumentMeta(`${page.title} · ${t('site.name')}`, page.description);

  return (
    <Page variant="narrow">
      <S.Article>
        <S.Back>
          <TextLink to={localePath()}>{t('site.allStories')}</TextLink>
        </S.Back>
        <Heading as="h1">{page.title}</Heading>
        <S.Updated>{t('legal.updated', { date: formatDate(LEGAL.updated, lang) })}</S.Updated>
        {page.sections.map((section) => (
          <section key={section.h}>
            <S.H2>{section.h}</S.H2>
            {section.blocks.map((b, i) =>
              b.ul ? (
                <S.List key={i}>
                  {b.ul.map((item) => (
                    <li key={item}>{inline(item, values)}</li>
                  ))}
                </S.List>
              ) : (
                <Paragraph key={i}>{inline(b.p, values)}</Paragraph>
              )
            )}
          </section>
        ))}
      </S.Article>
    </Page>
  );
}
