import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { localizePath } from '../../lib/locale';

/**
 * One-time URL normalisation on app boot:
 * - legacy `?lng=zh|en` links are rewritten to path-based language URLs
 * - visitors whose last explicit choice was Chinese are sent to /zh from the root
 */
const LocaleNormalizer = () => {
    const { i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const lng = params.get('lng');
        if (lng === 'zh' || lng === 'en') {
            params.delete('lng');
            const query = params.toString();
            const target = `${localizePath(location.pathname, lng)}${query ? `?${query}` : ''}${location.hash}`;
            i18n.changeLanguage(lng);
            navigate(target, { replace: true });
            return;
        }

        if (location.pathname === '/' && location.search === '') {
            const stored = (localStorage.getItem('i18nextLng') || '').toLowerCase();
            if (stored.startsWith('zh')) {
                navigate('/zh', { replace: true });
            }
        }
        // Only run for the initial URL; later navigation is handled by the switcher.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
};

export default LocaleNormalizer;
