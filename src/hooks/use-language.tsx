import { createContext, useContext, type ReactNode } from 'react';
import type { LanguageCode } from '@/types';
import { DEFAULT_LANGUAGE, LANGUAGES } from '@/data/constants';

// ============================================================
// Language context — maintains selected language across the app
// Phase 2 will add full UI translations and multilingual AI
// ============================================================

interface LanguageContextValue {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  languages: typeof LANGUAGES;
}

export const LanguageContext = createContext<LanguageContextValue>({
  language: DEFAULT_LANGUAGE,
  setLanguage: () => {},
  languages: LANGUAGES,
});

export function useLanguage() {
  return useContext(LanguageContext);
}

export function LanguageProvider({
  language,
  setLanguage,
  children,
}: {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  children: ReactNode;
}) {
  return (
    <LanguageContext.Provider value={{ language, setLanguage, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}
