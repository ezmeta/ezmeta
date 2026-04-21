'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type Lang = 'bm' | 'en';

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
};

const STORAGE_KEY = 'ezmeta.lang';
const COOKIE_KEY = 'ez_lang';

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('bm');

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'bm' || saved === 'en') {
      setLangState(saved);
    }
  }, []);

  const setLang = (value: Lang) => {
    setLangState(value);
    window.localStorage.setItem(STORAGE_KEY, value);
    document.cookie = `${COOKIE_KEY}=${value}; path=/; max-age=31536000; samesite=lax`;
  };

  const contextValue = useMemo(() => ({ lang, setLang }), [lang]);

  return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}

