import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, ArrowDown } from 'lucide-react';
import { Category, Prompt } from '../types';
import PromptGrid from '../components/home/PromptGrid';
import SkeletonGrid from '../components/home/SkeletonGrid';
import Sidebar from '../components/layout/Sidebar';
import Footer from '../components/layout/Footer';
import AddPromptModal from '../components/admin/AddPromptModal';
import ComingSoonModal from '../components/common/ComingSoonModal';
import { usePrompts } from '../hooks/usePrompts';
import SEOHead from '../components/seo/SEOHead';
import { useSearchParams } from 'react-router-dom';

const HomePage: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();
    const initialVideoOnly = searchParams.get('type') === 'video';
    const initialSearch = searchParams.get('search') || '';
    
    // State: Category
    const [activeCategory, setActiveCategory] = useState<Category>(() => {
        if (initialVideoOnly) return Category.ALL;
        const catParam = searchParams.get('category');
        if (catParam) {
            // First try to match enum key (e.g., 'VIDEO')
            const keyMatch = Object.keys(Category).find(k => k.toUpperCase() === catParam.toUpperCase());
            if (keyMatch) return Category[keyMatch as keyof typeof Category];
            
            // Then try to match enum value (e.g., 'Video Generation')
            const valueMatch = Object.values(Category).find(v => v === catParam);
            if (valueMatch) return valueMatch;
        }
        return Category.ALL;
    });
    const [videoOnly, setVideoOnly] = useState<boolean>(initialVideoOnly);

    // State: Sort
    const [sortOrder, setSortOrder] = useState<'recent' | 'random'>('random');
    
    // Data Fetching with Pagination
    // Note: We map activeCategory (Value) to Key if needed, but Hook expects Value (or handles normalization).
    // Actually, backend expects "ART" (Key) or "Art & Design" (Value) if we normalize there.
    // Our updated backend normalizes. So passing Value is fine.
    const { prompts, loading, loadingMore, hasMore, loadMore, nextId } = usePrompts(
        videoOnly ? undefined : (activeCategory === Category.ALL ? undefined : activeCategory),
        sortOrder,
        24,
        videoOnly ? 'video' : undefined
    );

    const [searchQuery, setSearchQuery] = useState(initialSearch);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isComingSoonOpen, setIsComingSoonOpen] = useState(false);
    const [categoryCounts, setCategoryCounts] = useState<Record<string, number> | null>(null);
    
    // Intersection Observer for Infinite Scroll
    const loaderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchCategoryCounts = async () => {
            try {
                const res = await fetch(`/api/prompts?summary=categories&lang=${i18n.language.startsWith('zh') ? 'zh' : 'en'}`);
                if (!res.ok) return;
                const data = await res.json();
                const counts = data?.counts && typeof data.counts === 'object' ? data.counts : data;
                if (counts && typeof counts === 'object') {
                    const normalizeCategoryKey = (rawKey: string) => {
                        const raw = String(rawKey);
                        const keyMatch = Object.keys(Category).find(k => k.toLowerCase() === raw.toLowerCase());
                        if (keyMatch) return keyMatch;
                        const valueMatch = Object.keys(Category).find(
                            k => String(Category[k as keyof typeof Category]).toLowerCase() === raw.toLowerCase()
                        );
                        if (valueMatch) return valueMatch;
                        return raw
                            .toUpperCase()
                            .replace(/[^A-Z0-9]+/g, '_')
                            .replace(/^_+|_+$/g, '');
                    };

                    const normalizedCounts: Record<string, number> = {};
                    for (const [rawKey, rawVal] of Object.entries(counts)) {
                        const key = normalizeCategoryKey(rawKey);
                        const parsed =
                            typeof rawVal === 'number'
                                ? rawVal
                                : (typeof rawVal === 'string' ? parseInt(rawVal, 10) : 0);
                        const safe = Number.isFinite(parsed) ? parsed : 0;
                        normalizedCounts[key] = (normalizedCounts[key] ?? 0) + safe;
                    }
                    const rawVideoPromptCount = data?.videoPromptCount;
                    const videoPromptCount = typeof rawVideoPromptCount === 'number'
                        ? rawVideoPromptCount
                        : (typeof rawVideoPromptCount === 'string' ? parseInt(rawVideoPromptCount, 10) : 0);
                    normalizedCounts.VIDEO_PROMPTS = Number.isFinite(videoPromptCount) ? videoPromptCount : 0;
                    setCategoryCounts(normalizedCounts);
                }
            } catch {
                return;
            }
        };

        fetchCategoryCounts();
    }, [i18n.language]);

    useEffect(() => {
        if (!categoryCounts) return;
        if (videoOnly) return;
        if (activeCategory === Category.ALL) return;

        const activeKey = Object.keys(Category).find(
            key => Category[key as keyof typeof Category] === activeCategory
        );

        if (!activeKey) return;
        if ((categoryCounts[activeKey] ?? 0) > 0) return;

        setActiveCategory(Category.ALL);
        const nextParams = new URLSearchParams(searchParams);
        nextParams.delete('category');
        setSearchParams(nextParams);
    }, [activeCategory, categoryCounts, searchParams, setSearchParams]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const target = entries[0];
                if (target.isIntersecting && hasMore && !loading && !loadingMore) {
                    loadMore();
                }
            },
            {
                root: null,
                rootMargin: '200px', // Preload before reaching bottom
                threshold: 0.1,
            }
        );

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => {
            if (loaderRef.current) {
                observer.unobserve(loaderRef.current);
            }
        };
    }, [hasMore, loading, loadingMore, loadMore]);

    const toggleLanguage = () => {
        const currentLang = i18n.language;
        const isEnglish = currentLang.startsWith('en');
        const newLang = isEnglish ? 'zh' : 'en';
        i18n.changeLanguage(newLang);
    };

    const handleSetSortOrder = (order: 'recent' | 'random') => {
        setSortOrder(order);
        // Hook will auto-refetch when sortOrder changes
    };

    // Client-side search (Optional: Filter currently loaded prompts)
    // Ideally search should be backend-side, but for now client-side filter on loaded data is acceptable UX for small datasets
    // OR we disable search if we want strict consistency.
    // Let's keep client-side filter for UX, acknowledging it only searches loaded items.
    const displayPrompts = useMemo(() => {
        if (!searchQuery) return prompts;
        return prompts.filter(prompt => 
            prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (Array.isArray(prompt.tags) ? prompt.tags : []).some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [prompts, searchQuery]);

    const handleSetActiveCategory = (category: Category) => {
        setVideoOnly(false);
        setActiveCategory(category);
        const nextParams = new URLSearchParams(searchParams);
        nextParams.delete('type');
        if (category === Category.ALL) {
            nextParams.delete('category');
        } else {
            // Convert enum value to enum key for URL parameter
            // e.g., 'Video Generation' -> 'VIDEO'
            const categoryKey = Object.keys(Category).find(
                key => Category[key as keyof typeof Category] === category
            );
            nextParams.set('category', categoryKey || category);
        }
        setSearchParams(nextParams);
    };

    const handleSetVideoOnly = () => {
        setVideoOnly(true);
        setActiveCategory(Category.ALL);
        const nextParams = new URLSearchParams(searchParams);
        nextParams.delete('category');
        nextParams.set('type', 'video');
        setSearchParams(nextParams);
    };

    const clearFilters = () => {
        setVideoOnly(false);
        setActiveCategory(Category.ALL);
        setSearchQuery('');
        const nextParams = new URLSearchParams(searchParams);
        nextParams.delete('type');
        nextParams.delete('category');
        nextParams.delete('search');
        setSearchParams(nextParams);
    };

    const handleSelectPrompt = (prompt: Prompt) => {
        console.log('Selected prompt:', prompt.id);
    };

    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "PentaPrompt",
        "url": "https://pentaprompt.com",
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://pentaprompt.com/prompts?search={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    };

    return (
        <>
            <SEOHead
                title={t('seo.library.title')}
                description={t('seo.library.description')}
                keywords={t('seo.library.keywords')}
                url="https://pentaprompt.com/prompts"
                type="website"
                structuredData={websiteSchema}
            />
            <div className="flex h-screen bg-gray-50 text-slate-900 overflow-hidden font-sans">
                <Sidebar
                    activeCategory={activeCategory}
                    setActiveCategory={handleSetActiveCategory}
                    videoOnly={videoOnly}
                    onVideoOnlyClick={handleSetVideoOnly}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    sortOrder={sortOrder}
                    setSortOrder={handleSetSortOrder}
                    toggleLanguage={toggleLanguage}
                    currentLanguage={i18n.language}
                    onTutorialClick={() => setIsComingSoonOpen(true)}
                    onLogoClick={clearFilters}
                    categoryCounts={categoryCounts}
                />

                <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden border-l-[2.5px] border-black">
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10">
                        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-2">{t('home.exploreTitle')}</h2>
                                <p className="text-slate-500 font-medium">{t('home.exploreSubtitle')}</p>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setIsAddModalOpen(true)}
                                    className="flex items-center gap-2 bg-[#66D9E8] text-black px-6 py-3 border-[2.5px] border-black rounded-2xl font-black uppercase italic shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                                >
                                    <Plus size={20} strokeWidth={3} />
                                    <span>{t('nav.addPrompt')}</span>
                                </button>
                            </div>
                        </header>

                        {loading && prompts.length === 0 ? (
                            <SkeletonGrid />
                        ) : (
                            <>
                                <PromptGrid
                                    prompts={displayPrompts}
                                    onSelectPrompt={handleSelectPrompt}
                                    onClearFilters={clearFilters}
                                />
                                
                                {/* Load More Trigger / Button */}
                                {hasMore && (
                                    <div ref={loaderRef} className="mt-12 flex justify-center pb-10">
                                        <button 
                                            onClick={loadMore}
                                            disabled={loadingMore}
                                            className="group flex items-center gap-3 bg-black text-white px-8 py-4 font-black uppercase tracking-widest text-sm border-4 border-transparent hover:bg-white hover:text-black hover:border-black transition-all disabled:opacity-50"
                                        >
                                            {loadingMore ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin group-hover:border-black/30 group-hover:border-t-black"></div>
                                                    Loading More...
                                                </>
                                            ) : (
                                                <>
                                                    Load More Prompts
                                                    <ArrowDown size={18} className="group-hover:translate-y-1 transition-transform" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                )}
                                
                                {!hasMore && prompts.length > 0 && (
                                    <div className="mt-16 text-center pb-10">
                                        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">
                                            — End of Result —
                                        </p>
                                    </div>
                                )}
                            </>
                        )}

                        <Footer onContribute={() => setIsAddModalOpen(true)} />
                    </div>
                </main>

                {isAddModalOpen && (
                    <AddPromptModal
                        onClose={() => setIsAddModalOpen(false)}
                        nextId={nextId}
                    />
                )}

                {isComingSoonOpen && (
                    <ComingSoonModal
                        onClose={() => setIsComingSoonOpen(false)}
                    />
                )}
            </div>
        </>
    );
};

export default HomePage;
