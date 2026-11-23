import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Prompt } from '../types';
import { fetchStaticDetail, mapStaticToDetailPrompt } from '../lib/staticData';

export const usePromptDetail = (id: string | undefined) => {
    const { i18n } = useTranslation();
    const [prompt, setPrompt] = useState<Prompt | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!id) return;

        let mounted = true;
        setLoading(true);
        setError(null);

        const fetchPrompt = async () => {
            // Prefer the build-time static JSON (no database round-trip).
            const staticDetail = await fetchStaticDetail(id);
            if (mounted && staticDetail) {
                setPrompt(mapStaticToDetailPrompt(staticDetail, i18n.language));
                setLoading(false);
                return;
            }

            // Fallback: newly added prompts may not be in the static export yet.
            try {
                const lang = i18n.language.startsWith('zh') ? 'zh' : 'en';
                const res = await fetch(`/api/prompts?id=${encodeURIComponent(id)}&lang=${lang}`);

                if (res.ok) {
                    const data = await res.json();
                    if (mounted) {
                        setPrompt(data);
                        setLoading(false);
                    }
                } else if (mounted) {
                    setPrompt(null);
                    setLoading(false);
                }
            } catch (err) {
                if (mounted) {
                    console.error('Failed to load prompt detail:', err);
                    setError(err instanceof Error ? err : new Error('Failed to load prompt'));
                    setLoading(false);
                }
            }
        };

        fetchPrompt();

        return () => {
            mounted = false;
        };
    }, [id, i18n.language]);

    return { prompt, loading, error };
};
