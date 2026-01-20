import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Prompt } from '../types';

export const usePromptDetail = (id: string | undefined) => {
    const { i18n } = useTranslation();
    const [prompt, setPrompt] = useState<Prompt | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!id) return;

        let mounted = true;
        setLoading(true);

        const fetchPrompt = async () => {
            try {
                // STRATEGY: Try API first, fallback to local (if we keep local file logic, but we are moving to pure API)
                // For Detail, we stick to pure API.
                
                const lang = i18n.language.startsWith('zh') ? 'zh' : 'en';
                const res = await fetch(`/api/prompts?id=${id}&lang=${lang}`);
                
                if (res.ok) {
                    const data = await res.json();
                    if (mounted) {
                        setPrompt(data);
                        setLoading(false);
                    }
                } else {
                    // Handle 404
                    if (mounted) {
                        setPrompt(null);
                        setLoading(false);
                    }
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
