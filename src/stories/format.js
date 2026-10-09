// Redak sa podacima o priči: "Naučna fantastika · oko 40 min · interaktivna".
export const metaLine = (entry) =>
  [entry.genre, entry.minutes ? `oko ${entry.minutes} min` : null, 'interaktivna'].filter(Boolean).join(' · ');
