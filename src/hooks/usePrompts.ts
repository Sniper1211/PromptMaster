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
            // STRATEGY: Hybrid Loading
            // 1. Load local static data IMMEDIATELY for instant render (SEO & UX friendly)
            // 2. Fetch fresh data from API in background and update silently

            const lang = i18n.language.startsWith('zh') ? 'zh' : 'en';
            
            // Step 1: Load local data first
            try {
                let localData: { PROMPTS_ZH?: Prompt[]; PROMPTS_EN?: Prompt[] };
                if (lang === 'zh') {
                    localData = await import('../data/prompts-zh');
                    if (mounted) {
                        setPrompts(localData.PROMPTS_ZH || []);
                        setLoading(false); // Show content immediately!
                    }
                } else {
                    localData = await import('../data/prompts-en');
                    if (mounted) {
                        setPrompts(localData.PROMPTS_EN || []);
                        setLoading(false); // Show content immediately!
                    }
                }
            } catch (err) {
                console.error('Failed to load local prompts:', err);
                // If local load fails, keep loading true and wait for API
            }

            // Step 2: Fetch from API (Background Update)
            try {
                // Pass current language preference to API
                const res = await fetch(`/api/prompts?lang=${lang}`);
                
                if (res.ok) {
                    const dbPrompts: Prompt[] = await res.json();
                    if (mounted) {
                        // Update with fresh data from DB
                        // Note: This might cause a UI shift if data differs significantly.
                        // Ideally, we should merge or check for differences, but for now, replacing is fine.
                        setPrompts(dbPrompts);
                    }
                }
            } catch (apiErr) {
                console.warn('API fetch failed, staying with local data:', apiErr);
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
