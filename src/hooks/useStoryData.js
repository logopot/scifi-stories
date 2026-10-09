import { useEffect, useState } from 'react';

const cache = new Map();

// Lenjo učitava JSON priče iz registra. Vraća { story, status: 'loading' | 'ready' | 'error' }.
export default function useStoryData(entry) {
  const slug = entry?.slug;
  const [state, setState] = useState(() =>
    cache.has(slug) ? { story: cache.get(slug), status: 'ready' } : { story: null, status: entry?.load ? 'loading' : 'error' }
  );

  useEffect(() => {
    if (!entry || !entry.load) {
      setState({ story: null, status: 'error' });
      return undefined;
    }
    if (cache.has(slug)) {
      setState({ story: cache.get(slug), status: 'ready' });
      return undefined;
    }
    let cancelled = false;
    setState({ story: null, status: 'loading' });
    entry
      .load()
      .then((mod) => {
        cache.set(slug, mod.default);
        if (!cancelled) setState({ story: mod.default, status: 'ready' });
      })
      .catch(() => {
        if (!cancelled) setState({ story: null, status: 'error' });
      });
    return () => {
      cancelled = true;
    };
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  return state;
}
