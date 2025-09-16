import React, { createContext, useContext, useMemo, useState } from 'react';
import { pt } from './locales/pt';
import { en } from './locales/en';

type Lang = 'pt' | 'en';
type Dict = typeof en;

const dictionaries: Record<Lang, Dict> = { pt, en };

type I18nContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (path: string) => string;
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

function get(obj: any, path: string): any {
  return path.split('.').reduce((acc, key) => (acc && acc[key] != null ? acc[key] : undefined), obj);
}

export const I18nProvider: React.FC<{ initialLang?: Lang; children: React.ReactNode }> = ({ initialLang = 'pt', children }) => {
  const [lang, setLang] = useState<Lang>(initialLang);
  const dict = dictionaries[lang] || dictionaries.pt;

  const value = useMemo<I18nContextValue>(() => ({
    lang,
    setLang,
    t: (path: string) => get(dict, path) ?? path,
  }), [lang, dict]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}

