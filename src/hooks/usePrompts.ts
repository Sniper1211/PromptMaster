import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Prompt } from '../types';

export const usePrompts = () => {
    const { i18n } = useTranslation();
    const [prompts, setPrompts] = useState<Prompt[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let mounted = true;

        const loadPrompts = async () => {
            setLoading(true);
            try {
                const lang = i18n.language.startsWith('zh') ? 'zh' : 'en';
                let data: { PROMPTS_ZH?: Prompt[]; PROMPTS_EN?: Prompt[] };

                if (lang === 'zh') {
                    data = await import('../data/prompts-zh');
                    if (mounted) setPrompts(data.PROMPTS_ZH || []);
                } else {
                    data = await import('../data/prompts-en');
                    if (mounted) setPrompts(data.PROMPTS_EN || []);
                }
            } catch (err) {
                if (mounted) {
                    console.error('Failed to load prompts:', err);
                    setError(err instanceof Error ? err : new Error('Failed to load prompts'));
                }
            } finally {
                if (mounted) setLoading(false);
            }
        };

        loadPrompts();

        return () => {
            mounted = false;
        };
    }, [i18n.language]);

    return { prompts, loading, error };
};
