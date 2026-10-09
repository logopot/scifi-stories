import { createContext, useContext } from 'react';

// Priča koja se trenutno čita: { slug, story, engine }.
export const StoryContext = createContext(null);

export const useStory = () => {
  const ctx = useContext(StoryContext);
  if (!ctx) throw new Error('useStory se koristi samo unutar StoryContext.Provider');
  return ctx;
};
