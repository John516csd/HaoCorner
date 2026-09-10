'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { isMusicLocale, MUSIC_LOCALE_KEY, translate, type MusicLocale, type MusicTranslator } from './messages';

type LanguageContext = {
  locale: MusicLocale;
  setLocale: (locale: MusicLocale) => void;
  t: MusicTranslator;
};
const Context = createContext<LanguageContext | null>(null);

export function MusicLanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, updateLocale] = useState<MusicLocale>('zh');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(MUSIC_LOCALE_KEY);
      if (isMusicLocale(saved)) updateLocale(saved);
    } catch { /* The switch still works when storage is unavailable. */ }

    const sync = (event: StorageEvent) => {
      if (event.key === MUSIC_LOCALE_KEY) {
        updateLocale(isMusicLocale(event.newValue) ? event.newValue : 'zh');
      }
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  useEffect(() => {
    const previous = document.documentElement.lang;
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en';
    return () => { document.documentElement.lang = previous; };
  }, [locale]);
  const value = useMemo<LanguageContext>(() => ({
    locale,
    t: (key, values) => translate(locale, key, values),
    setLocale: next => {
      updateLocale(next);
      try { localStorage.setItem(MUSIC_LOCALE_KEY, next); } catch { /* In-memory preference is sufficient for this visit. */ }
    },
  }), [locale]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useMusicLanguage() {
  const value = useContext(Context);
  if (!value) throw new Error('MusicLanguageProvider is missing');
  return value;
}
