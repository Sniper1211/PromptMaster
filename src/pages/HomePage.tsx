import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Category, Prompt } from '../types';
import PromptGrid from '../components/home/PromptGrid';
import Sidebar from '../components/layout/Sidebar';
import Footer from '../components/layout/Footer';
import AddPromptModal from '../components/admin/AddPromptModal';
import ComingSoonModal from '../components/common/ComingSoonModal';
import { usePrompts } from '../hooks/usePrompts';
import SEOHead from '../components/seo/SEOHead';
import { useSearchParams } from 'react-router-dom';

const HomePage: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { prompts, loading } = usePrompts();
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Initialize activeCategory from URL param if present, otherwise ALL
    const [activeCategory, setActiveCategory] = useState<Category>(() => {
        const catParam = searchParams.get('category');
        if (catParam) {
            // Try to match the param to a Category Value
            // e.g. param "Art & Design" -> Category.ART
            // Or param "ART" -> Category.ART (if passed as key)
            
            // Try exact value match
            const valueMatch = Object.values(Category).find(v => v === catParam);
            if (valueMatch) return valueMatch;

            // Try key match (case-insensitive)
            const keyMatch = Object.keys(Category).find(k => k.toUpperCase() === catParam.toUpperCase());
            if (keyMatch) return Category[keyMatch as keyof typeof Category];
        }
        return Category.ALL;
    });

    const [searchQuery, setSearchQuery] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isComingSoonOpen, setIsComingSoonOpen] = useState(false);
    const [sortOrder, setSortOrder] = useState<'recent' | 'random'>('random');
    const [shuffleSeed, setShuffleSeed] = useState(0);

    const toggleLanguage = () => {
        const currentLang = i18n.language;
        const isEnglish = currentLang.startsWith('en');
        const newLang = isEnglish ? 'zh' : 'en';
        i18n.changeLanguage(newLang);
    };

    const handleSetSortOrder = (order: 'recent' | 'random') => {
        if (order === 'random' && sortOrder === 'random') {
            setShuffleSeed(prev => prev + 1);
        }
        setSortOrder(order);
    };

    const randomWeights = useMemo(() => {
        const weights: Record<string, number> = {};
        prompts.forEach(p => {
            weights[p.id] = Math.random();
        });
        return weights;
    }, [prompts, shuffleSeed]);

    const filteredPrompts = useMemo(() => {
        let result = prompts.filter(prompt => {
            // Case-insensitive comparison for category
            // Handle Category.ALL (value 'All') and prompt.category (value 'Art & Design')
            let activeCategoryValue = activeCategory;
            let promptCategoryValue = prompt.category;

            // Normalize activeCategory: if it's a value "Art & Design", we might want to compare it properly
            // Actually, prompts now have "ART" (Key) in DB.
            // But activeCategory is set from Sidebar using Value ("Art & Design").
            // So we need to normalize prompt.category (Key) to Value OR activeCategory (Value) to Key.
            
            // Let's normalize BOTH to Keys for comparison if possible, or try to match Values.
            // Simpler approach: Check if one matches the other's Key or Value mapping.
            
            if (activeCategory === Category.ALL) return true;

            // Try to find the Key for the activeCategory Value
            const activeKeyEntry = Object.entries(Category).find(([k, v]) => v === activeCategory);
            const activeKey = activeKeyEntry ? activeKeyEntry[0] : activeCategory.toUpperCase(); // "ART"

            // Prompt category from DB is now "ART" (Key)
            const promptKey = prompt.category.toUpperCase(); // "ART"

            // Also handle if prompt category is still old Value "Art & Design" -> map to "ART"
            const promptValueEntry = Object.entries(Category).find(([k, v]) => v.toUpperCase() === prompt.category.toUpperCase());
            const normalizedPromptKey = promptValueEntry ? promptValueEntry[0] : promptKey;

            const matchesCategory = normalizedPromptKey === activeKey;
            
            const matchesSearch = prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                prompt.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
            return matchesCategory && matchesSearch;
        });

        if (sortOrder === 'recent') {
            result.sort((a, b) => {
                const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                return dateB - dateA;
            });
        } else {
            result.sort((a, b) => (randomWeights[a.id] || 0) - (randomWeights[b.id] || 0));
        }

        return result;
    }, [activeCategory, searchQuery, prompts, sortOrder, randomWeights]);

    const nextId = useMemo(() => {
        if (prompts.length === 0) return '1';
        const ids = prompts.map(p => parseInt(p.id)).filter(id => !isNaN(id));
        return ids.length > 0 ? (Math.max(...ids) + 1).toString() : (prompts.length + 1).toString();
    }, [prompts]);

    // Sync activeCategory changes to URL
    const handleSetActiveCategory = (category: Category) => {
        setActiveCategory(category);
        if (category === Category.ALL) {
            searchParams.delete('category');
        } else {
            // We store the VALUE in the URL (e.g. "Art & Design") to be user-friendly
            // But we could also store the KEY if we prefer. 
            // Current existing links (e.g. from breadcrumbs) seem to use the Value (prompt.category which was Value before normalization, or we constructed it).
            // Let's stick to using the Value as the param for consistency with how state is initialized.
            searchParams.set('category', category);
        }
        setSearchParams(searchParams);
    };

    const clearFilters = () => {
        handleSetActiveCategory(Category.ALL);
        setSearchQuery('');
    };

    // Placeholder for selecting a prompt from the grid - now it will just be a prop passed down
    // But PromptGrid will likely handle the Link internally.
    // However, PromptGrid props expect onSelectPrompt. We can pass a dummy or refactor PromptGrid.
    // Let's keep it simple for now and refactor PromptGrid next.

    const handleSelectPrompt = (prompt: Prompt) => {
        // This won't be used for navigation anymore, but maybe for logging?
        console.log('Selected prompt:', prompt.id);
    };

    // Structured data for homepage
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
                    prompts={prompts}
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
                                {/* <button 
                                    onClick={() => setIsComingSoonOpen(true)}
                                    className="flex items-center gap-2 bg-[#FF4D4D] text-white px-6 py-3 border-[2.5px] border-black rounded-2xl font-black uppercase italic shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                                >
                                    <Plus size={20} strokeWidth={3} />
                                    <span>{t('nav.proUpgrade')}</span>
                                </button> */}
                            </div>

                        </header>


                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <div className="w-10 h-10 border-4 border-black/10 border-t-black rounded-full animate-spin mb-4"></div>
                                <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-xs">Loading prompts...</p>
                            </div>
                        ) : (
                            <PromptGrid
                                prompts={filteredPrompts}
                                onSelectPrompt={handleSelectPrompt}
                                onClearFilters={clearFilters}
                            />
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
