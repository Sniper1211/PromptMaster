import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Prompt, Category } from '../types';
import { fetchStaticIndex, mapStaticToListPrompt } from '../lib/staticData';

type UsePromptsOptions = {
    /** Admin screens need live data from the API instead of the build-time static index. */
    live?: boolean;
};

const DB_CATEGORY_BY_VALUE: Record<string, string> = {
    [Category.CODING]: 'CODING',
    [Category.WRITING]: 'WRITING',
    [Category.BUSINESS]: 'BUSINESS',
    [Category.PHOTOGRAPHY]: 'PHOTOGRAPHY',
    [Category.ART]: 'ART',
    [Category.COMMERCIAL]: 'COMMERCIAL',
    [Category.PRODUCTIVITY]: 'PRODUCTIVITY',
    [Category.MARKETING]: 'MARKETING',
    [Category.FUN]: 'FUN',
    [Category.SEO]: 'SEO',
    [Category.LEARNING]: 'LEARNING',
    [Category.VIDEO]: 'VIDEO'
};

const normalizeRequestedCategory = (category?: string): string | null => {
    if (!category) return null;
    const raw = String(category).trim();
    if (!raw || raw.toUpperCase() === 'ALL') return null;
    if (DB_CATEGORY_BY_VALUE[raw]) return DB_CATEGORY_BY_VALUE[raw];
    return raw.toUpperCase().replace(/[^A-Z0-9]+/g, '_').replace(/^_+|_+$/g, '');
};

const currentHourKey = () => new Date().toISOString().slice(0, 13);

const stableHash = (value: string): number => {
    let hash = 2166136261;
    for (let i = 0; i < value.length; i++) {
        hash ^= value.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
};

export const usePrompts = (
    category?: string,
    sortOrder: 'recent' | 'random' = 'random',
    customLimit: number = 24,
    promptType?: 'text' | 'video',
    options: UsePromptsOptions = {}
) => {
    const live = options.live === true;
    const { i18n } = useTranslation();
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [nextId, setNextId] = useState<string>('');

    // Static branch state: the full filtered list lives in a ref, pages are slices of it.
    const staticListRef = useRef<Prompt[]>([]);

    const fetchFromApi = async (pageNum: number, isReset: boolean) => {
        try {
            const lang = i18n.language.startsWith('zh') ? 'zh' : 'en';
            let url = `/api/prompts?page=${pageNum}&limit=${customLimit}&lang=${lang}&sort=${sortOrder}`;
            if (category && category !== 'ALL') url += `&category=${encodeURIComponent(category)}`;
            if (promptType) url += `&promptType=${encodeURIComponent(promptType)}`;

            const res = await fetch(url);
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            const newPrompts = data.prompts || [];
            if (isReset) {
                setPrompts(newPrompts);
                if (data.nextId) setNextId(String(data.nextId));
            } else {
                setPrompts((prev) => [...prev, ...newPrompts]);
            }
            setHasMore(Boolean(data.hasMore));
        } catch (err) {
            console.error('Fetch error:', err);
            setError(err instanceof Error ? err : new Error('Fetch failed'));
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const loadStatic = async () => {
        setLoading(true);
        setError(null);
        const index = await fetchStaticIndex();
        if (!index) {
            // Dev server / missing build artifact: fall back to the API.
            await fetchFromApi(1, true);
            return;
        }
        const wantedCategory = normalizeRequestedCategory(category);
        const filtered = index.filter((entry) => {
            if (wantedCategory && entry.category !== wantedCategory) return false;
            if (promptType && (entry.promptType || 'text') !== promptType) return false;
            return true;
        });
        if (sortOrder === 'recent') {
            filtered.sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
        } else {
            const hourKey = currentHourKey();
            filtered.sort((a, b) => stableHash(String(a.id) + hourKey) - stableHash(String(b.id) + hourKey));
        }
        const list = filtered.map((entry) => mapStaticToListPrompt(entry, i18n.language));
        staticListRef.current = list;
        const numericIds = list.map((item) => parseInt(item.id, 10)).filter((n) => Number.isFinite(n));
        setNextId(numericIds.length ? String(Math.max(...numericIds) + 1) : '');
        setPrompts(list.slice(0, customLimit));
        setHasMore(list.length > customLimit);
        setPage(1);
        setLoading(false);
    };

    useEffect(() => {
        setPrompts([]);
        setPage(1);
        setHasMore(true);
        setLoading(true);
        setError(null);
        if (live) {
            fetchFromApi(1, true);
        } else {
            loadStatic();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category, sortOrder, i18n.language, customLimit, promptType, live]);

    const loadMore = () => {
        if (!hasMore || loading || loadingMore) return;
        if (live) {
            setLoadingMore(true);
            const nextPage = page + 1;
            setPage(nextPage);
            fetchFromApi(nextPage, false);
            return;
        }
        const nextPage = page + 1;
        const all = staticListRef.current;
        setPrompts(all.slice(0, nextPage * customLimit));
        setPage(nextPage);
        setHasMore(all.length > nextPage * customLimit);
    };

    return { prompts, loading, loadingMore, hasMore, loadMore, error, nextId };
};
