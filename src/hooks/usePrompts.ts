import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Prompt } from '../types';

export const usePrompts = (category?: string, sortOrder: 'recent' | 'random' = 'random') => {
    const { i18n } = useTranslation();
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [nextId, setNextId] = useState<string>('');
    
    // Reset state when category, language, or sortOrder changes
    useEffect(() => {
        setPage(1);
        setPrompts([]);
        setHasMore(true);
        setLoading(true);
        fetchPrompts(1, true);
    }, [category, sortOrder, i18n.language]);

    const fetchPrompts = async (pageNum: number, isReset: boolean) => {
        try {
            const lang = i18n.language.startsWith('zh') ? 'zh' : 'en';
            let url = `/api/prompts?page=${pageNum}&limit=24&lang=${lang}&sort=${sortOrder}`;
            if (category && category !== 'ALL') {
                url += `&category=${encodeURIComponent(category)}`;
            }

            const res = await fetch(url);
            if (!res.ok) throw new Error('Failed to fetch');
            
            const data = await res.json();
            
            const newPrompts = data.prompts || [];
            
            if (isReset) {
                setPrompts(newPrompts);
                if (data.nextId) setNextId(String(data.nextId));
            } else {
                setPrompts(prev => [...prev, ...newPrompts]);
            }
            
            setHasMore(data.hasMore);
        } catch (err) {
            console.error('Fetch error:', err);
            setError(err instanceof Error ? err : new Error('Fetch failed'));
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const loadMore = () => {
        if (!hasMore || loading || loadingMore) return;
        setLoadingMore(true);
        const nextPage = page + 1;
        setPage(nextPage);
        fetchPrompts(nextPage, false);
    };

    return { prompts, loading, loadingMore, hasMore, loadMore, error, nextId };
};
