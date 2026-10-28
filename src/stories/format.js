// Redak sa podacima o priči: "Naučna fantastika · oko 40 min · interaktivna". t je i18n funkcija jezika strane.
export const metaLine = (entry, t) =>
  [entry.genre, entry.minutes ? t('card.minutes', { minutes: entry.minutes }) : null, t('card.interactive')]
    .filter(Boolean)
    .join(' · ');
