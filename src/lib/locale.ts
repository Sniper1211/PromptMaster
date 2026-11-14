export type AppLanguage = 'zh' | 'en';

export const ZH_PREFIX = '/zh';

/** Language is encoded in the URL path: English at the root, Chinese under /zh. */
export function getLanguageFromPath(pathname: string = '/'): AppLanguage {
    return pathname === ZH_PREFIX || pathname.startsWith(`${ZH_PREFIX}/`) ? 'zh' : 'en';
}

export function stripLanguagePrefix(pathname: string): string {
    if (pathname === ZH_PREFIX) return '/';
    if (pathname.startsWith(`${ZH_PREFIX}/`)) return pathname.slice(ZH_PREFIX.length) || '/';
    return pathname;
}

/**
 * Prefix a path for the given language while preserving its query string.
 * localizePath('/', 'zh')        -> '/zh'
 * localizePath('/prompt/1', 'zh') -> '/zh/prompt/1'
 * localizePath('/?category=X','en')-> '/?category=X'
 */
export function localizePath(path: string, lang: AppLanguage): string {
    const [rawPath, ...queryParts] = path.split('?');
    const query = queryParts.length > 0 ? `?${queryParts.join('?')}` : '';
    const base = stripLanguagePrefix(rawPath || '/');
    if (lang === 'en') return `${base}${query}`;
    return `${base === '/' ? ZH_PREFIX : `${ZH_PREFIX}${base}`}${query}`;
}
