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
    
    // State: Category
    const [activeCategory, setActiveCategory] = useState<Category>(() => {
        const catParam = searchParams.get('category');
        if (catParam) {
            const valueMatch = Object.values(Category).find(v => v === catParam);
            if (valueMatch) return valueMatch;
            const keyMatch = Object.keys(Category).find(k => k.toUpperCase() === catParam.toUpperCase());
            if (keyMatch) return Category[keyMatch as keyof typeof Category];
        }
        return Category.ALL;
    });

    // State: Sort
    const [sortOrder, setSortOrder] = useState<'recent' | 'random'>('random');
    
    // Data Fetching with Pagination
    // Note: We map activeCategory (Value) to Key if needed, but Hook expects Value (or handles normalization).
    // Actually, backend expects "ART" (Key) or "Art & Design" (Value) if we normalize there.
    // Our updated backend normalizes. So passing Value is fine.
    const { prompts, loading, loadingMore, hasMore, loadMore } = usePrompts(
        activeCategory === Category.ALL ? undefined : activeCategory, 
        sortOrder
    );

    const [searchQuery, setSearchQuery] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isComingSoonOpen, setIsComingSoonOpen] = useState(false);
    
    // Intersection Observer for Infinite Scroll
    const loaderRef = useRef<HTMLDivElement>(null);

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
            prompt.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [prompts, searchQuery]);

    const nextId = useMemo(() => {
        if (prompts.length === 0) return '1';
        const ids = prompts.map(p => parseInt(p.id)).filter(id => !isNaN(id));
        return ids.length > 0 ? (Math.max(...ids) + 1).toString() : (prompts.length + 1).toString();
    }, [prompts]);

    const handleSetActiveCategory = (category: Category) => {
        setActiveCategory(category);
        if (category === Category.ALL) {
            searchParams.delete('category');
        } else {
            searchParams.set('category', category);
        }
        setSearchParams(searchParams);
    };

    const clearFilters = () => {
        handleSetActiveCategory(Category.ALL);
        setSearchQuery('');
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
            "target": "https://pentaprompt.com/?search={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    };

    return (
        <>
            <SEOHead
                title={t('seo.home.title')}
                description={t('seo.home.description')}
                keywords={t('seo.home.keywords')}
                url="https://pentaprompt.com"
                type="website"
                structuredData={websiteSchema}
            />
            <div className="flex h-screen bg-gray-50 text-slate-900 overflow-hidden font-sans">
                <Sidebar
                    activeCategory={activeCategory}
                    setActiveCategory={handleSetActiveCategory}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    sortOrder={sortOrder}
                    setSortOrder={handleSetSortOrder}
                    toggleLanguage={toggleLanguage}
                    currentLanguage={i18n.language}
                    onTutorialClick={() => setIsComingSoonOpen(true)}
                    onLogoClick={clearFilters}
                    prompts={prompts} // For count badges? Sidebar might calculate counts based on loaded prompts which is inaccurate now.
                    // Ideally Sidebar should get counts from API, but for now it might show smaller numbers.
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
