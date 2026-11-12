import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export type AppLanguage = 'zh' | 'en';

/**
 * Single source of truth for language switching.
 * - changes i18next language (which also caches to localStorage)
 * - keeps the `lng` query param in the URL so links are shareable and refresh-safe
 */
export function useLanguage() {
    const { i18n } = useTranslation();
    const currentLanguage: AppLanguage = i18n.language.startsWith('zh') ? 'zh' : 'en';

    const setLanguage = useCallback(
        (lang: AppLanguage) => {
            i18n.changeLanguage(lang);
            try {
                const url = new URL(window.location.href);
                url.searchParams.set('lng', lang);
                window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
            } catch {
                /* no-op: URL sync is best-effort */
            }
        },
        [i18n]
    );

    const toggleLanguage = useCallback(() => {
        setLanguage(currentLanguage === 'zh' ? 'en' : 'zh');
    }, [currentLanguage, setLanguage]);

    return { currentLanguage, setLanguage, toggleLanguage };
}

export default useLanguage;
