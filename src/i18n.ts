import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import zh from './locales/zh.json';
import { getLanguageFromPath } from './lib/locale';

// Language lives in the URL (/ = English, /zh/* = Chinese) so pages stay crawlable
// and shareable. localStorage/navigator are intentionally not used as a source of
// truth here; the switcher changes the URL instead.
const pathLanguageDetector = {
  type: 'languageDetector' as const,
  name: 'pathLanguage',
  init: () => {},
  cacheUserLanguage: () => {},
  detect: () => getLanguageFromPath(window.location.pathname)
};

i18n
  .use(pathLanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      zh: { translation: zh }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes values
    },
    detection: {
      order: ['pathLanguage'],
      caches: []
    }
  });

export default i18n;
