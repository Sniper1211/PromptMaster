import { useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppLanguage, getLanguageFromPath, localizePath } from '../lib/locale';

/**
 * Single source of truth for language: the URL path (/ vs /zh).
 * Switching language navigates to the same route with the other prefix.
 */
export function useLanguage() {
    const { i18n } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();

    const currentLanguage: AppLanguage = getLanguageFromPath(location.pathname);

    // Keep i18next in sync when the user navigates between / and /zh paths.
    useEffect(() => {
        document.documentElement.lang = currentLanguage;
        if (!i18n.language.startsWith(currentLanguage)) {
            i18n.changeLanguage(currentLanguage);
        }
    }, [currentLanguage, i18n]);

    const setLanguage = useCallback(
        (lang: AppLanguage) => {
            const params = new URLSearchParams(location.search);
            params.delete('lng');
            const query = params.toString();
            const target = `${localizePath(location.pathname, lang)}${query ? `?${query}` : ''}${location.hash}`;
            i18n.changeLanguage(lang);
            try {
                window.localStorage.setItem('i18nextLng', lang);
            } catch {
                /* localStorage can be unavailable in private mode */
            }
            navigate(target, { replace: true });
        },
        [i18n, location.pathname, location.search, location.hash, navigate]
    );

    const toggleLanguage = useCallback(() => {
        setLanguage(currentLanguage === 'zh' ? 'en' : 'zh');
    }, [currentLanguage, setLanguage]);

    /** Prefix an internal path with the current language ("/prompt/1" -> "/zh/prompt/1"). */
    const localize = useCallback((path: string) => localizePath(path, currentLanguage), [currentLanguage]);

    return { currentLanguage, setLanguage, toggleLanguage, localize };
}

export default useLanguage;
