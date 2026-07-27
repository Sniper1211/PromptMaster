import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, ArrowDown, ArrowRight, Globe, ShieldCheck, Sparkles, ChevronDown, ChevronUp, type LucideIcon } from 'lucide-react';
import { Category, Prompt } from '../types';
import PromptGrid from '../components/home/PromptGrid';
import SkeletonGrid from '../components/home/SkeletonGrid';
import Sidebar from '../components/layout/Sidebar';
import Footer from '../components/layout/Footer';
import AddPromptModal from '../components/admin/AddPromptModal';
import ComingSoonModal from '../components/common/ComingSoonModal';
import { usePrompts } from '../hooks/usePrompts';
import SEOHead from '../components/seo/SEOHead';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { featuredGuideSlugs, guideArticles } from '../data/guides.js';

interface TrustCard {
    key: 'curated' | 'bilingual' | 'transparent';
    icon: LucideIcon;
    bgClass: string;
}

interface FaqItem {
    q: string;
    a: string;
}

const HomePage: React.FC = () => {
    const { t, i18n } = useTranslation();
    const location = useLocation();
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
    const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);
    
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
        return prompts.filter((prompt: Prompt) => 
            prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (Array.isArray(prompt.tags) ? prompt.tags : []).some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
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
            "target": "https://pentaprompt.com/?search={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    };

    const isCanonicalHome = location.pathname === '/';
    const canonicalUrl = isCanonicalHome ? 'https://pentaprompt.com' : 'https://pentaprompt.com/prompts';
    const trustCards = useMemo(
        (): TrustCard[] => [
            { key: 'curated', icon: Sparkles, bgClass: 'bg-[#FACC15]' },
            { key: 'bilingual', icon: Globe, bgClass: 'bg-white' },
            { key: 'transparent', icon: ShieldCheck, bgClass: 'bg-[#E0F2FE]' }
        ],
        []
    );
    const faqItems = useMemo(
        (): FaqItem[] => [
            { q: t('home.faq.items.q1.q'), a: t('home.faq.items.q1.a') },
            { q: t('home.faq.items.q2.q'), a: t('home.faq.items.q2.a') },
            { q: t('home.faq.items.q3.q'), a: t('home.faq.items.q3.a') }
        ],
        [t]
    );
    const featuredGuides = useMemo(
        () => guideArticles.filter((guide: any) => featuredGuideSlugs.includes(guide.slug)),
        []
    );
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqItems.map((item: FaqItem) => ({
            "@type": "Question",
            "name": item.q,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.a
            }
        }))
    };

    return (
        <>
            <SEOHead
                title={t('seo.library.title')}
                description={t('seo.library.description')}
                keywords={t('seo.library.keywords')}
                url={canonicalUrl}
                type="website"
                noindex={!isCanonicalHome}
                structuredData={isCanonicalHome ? [websiteSchema, faqSchema] : websiteSchema}
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

                        {isCanonicalHome && (
                            <section className="mb-8">
                                <div className="bg-white border-[3px] border-black px-6 py-5 md:px-7 md:py-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                                    <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-500">{t('home.intro.kicker')}</p>
                                    <h3 className="mt-3 text-2xl md:text-3xl font-black uppercase italic tracking-tighter leading-tight">
                                        {t('home.intro.title')}
                                    </h3>
                                    <p className="mt-3 max-w-4xl text-sm md:text-base text-slate-700 leading-relaxed font-medium">
                                        {t('home.intro.description')}
                                    </p>
                                </div>
                            </section>
                        )}

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

                                {isCanonicalHome && (
                                    <section className="mt-16 space-y-6">
                                        <div className="bg-white border-[3px] border-black p-6 md:p-7">
                                            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-500">
                                                        {i18n.language.startsWith('zh') ? 'GUIDES' : 'GUIDES'}
                                                    </p>
                                                    <h3 className="mt-2 text-2xl font-black uppercase tracking-tight">
                                                        {i18n.language.startsWith('zh') ? '实战指南：把提示词写得更稳' : 'Guides: write better prompts'}
                                                    </h3>
                                                    <p className="mt-2 max-w-3xl text-sm md:text-base text-slate-700 font-medium leading-relaxed">
                                                        {i18n.language.startsWith('zh')
                                                            ? '用写法框架、案例和检查清单，把提示词从模板变成可复用的方法，帮助你在真实工作里得到更稳定的输出。'
                                                            : 'Frameworks, examples, and checklists that turn templates into reusable methods—and help you get more reliable outputs in real work.'}
                                                    </p>
                                                </div>
                                                <Link
                                                    to="/guides"
                                                    className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:underline"
                                                >
                                                    {i18n.language.startsWith('zh') ? '查看全部指南' : 'View all guides'}
                                                    <ArrowRight size={14} strokeWidth={3} />
                                                </Link>
                                            </div>

                                            <div className="mt-5 grid grid-cols-1 xl:grid-cols-3 gap-4">
                                                {featuredGuides.map((guide: any) => (
                                                    <article key={guide.slug} className="border-[2px] border-black bg-gray-50 p-4">
                                                        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">
                                                            {guide.readTime}
                                                        </p>
                                                        <h4 className="mt-2 text-base font-black uppercase tracking-tight leading-snug">
                                                            {i18n.language.startsWith('zh') ? guide.title.zh : guide.title.en}
                                                        </h4>
                                                        <p className="mt-3 text-sm text-slate-700 font-medium leading-relaxed">
                                                            {i18n.language.startsWith('zh') ? guide.description.zh : guide.description.en}
                                                        </p>
                                                        <div className="mt-4 flex flex-wrap gap-3 text-[11px] font-black uppercase tracking-widest">
                                                            <Link to={`/guides/${guide.slug}`} className="hover:underline">
                                                                {i18n.language.startsWith('zh') ? '阅读指南' : 'Read guide'}
                                                            </Link>
                                                            <Link to={`/collections/${guide.collectionSlug}`} className="text-slate-500 hover:text-black">
                                                                {i18n.language.startsWith('zh') ? '相关专题' : 'Related collection'}
                                                            </Link>
                                                        </div>
                                                    </article>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="bg-white border-[3px] border-black p-6 md:p-7">
                                            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-500">
                                                        {t('home.whyTrust.title')}
                                                    </p>
                                                    <p className="mt-2 text-sm md:text-base text-slate-700 font-medium">
                                                        {i18n.language.startsWith('zh')
                                                            ? '站点信息与政策：关于我们 / 联系方式 / 隐私 / 条款。'
                                                            : 'Site info & policies: About / Contact / Privacy / Terms.'}
                                                    </p>
                                                </div>
                                                <div className="flex flex-wrap gap-3 text-[11px] font-black uppercase tracking-widest">
                                                    <Link to="/about" className="px-3 py-2 border-[2px] border-black bg-gray-50 hover:bg-[#FACC15] transition-colors">
                                                        {t('footer.about')}
                                                    </Link>
                                                    <Link to="/contact" className="px-3 py-2 border-[2px] border-black bg-gray-50 hover:bg-[#E0F2FE] transition-colors">
                                                        {t('footer.contact')}
                                                    </Link>
                                                    <Link to="/privacy" className="px-3 py-2 border-[2px] border-black bg-gray-50 hover:bg-white transition-colors">
                                                        {t('footer.privacyPolicy')}
                                                    </Link>
                                                    <Link to="/terms" className="px-3 py-2 border-[2px] border-black bg-gray-50 hover:bg-white transition-colors">
                                                        {t('footer.termsOfService')}
                                                    </Link>
                                                </div>
                                            </div>

                                            <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                                                {trustCards.map((card: TrustCard) => {
                                                    const Icon = card.icon;
                                                    return (
                                                        <article key={card.key} className={`${card.bgClass} border-[2px] border-black px-4 py-4`}>
                                                            <div className="flex items-center gap-3">
                                                                <Icon size={18} strokeWidth={2.5} />
                                                                <h3 className="text-sm font-black uppercase tracking-tight">
                                                                    {t(`home.whyTrust.cards.${card.key}.title`)}
                                                                </h3>
                                                            </div>
                                                            <p className="mt-3 text-xs md:text-sm font-medium leading-relaxed text-slate-800">
                                                                {t(`home.whyTrust.cards.${card.key}.desc`)}
                                                            </p>
                                                        </article>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className="bg-white border-[3px] border-black p-6 md:p-7">
                                            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-500">
                                                {i18n.language.startsWith('zh') ? '常见问题' : 'FAQ'}
                                            </p>
                                            <h3 className="mt-2 text-2xl font-black uppercase tracking-tight">
                                                {t('home.faq.title')}
                                            </h3>

                                            <div className="mt-5 space-y-3">
                                                {faqItems.map((item: FaqItem, index: number) => {
                                                    const isOpen = expandedFaqIndex === index;
                                                    return (
                                                        <article key={index} className="border-[2px] border-black bg-gray-50">
                                                            <button
                                                                onClick={() => setExpandedFaqIndex(isOpen ? null : index)}
                                                                className="w-full flex items-center justify-between gap-4 px-4 py-4 text-left"
                                                            >
                                                                <span className="text-sm md:text-base font-black leading-snug">{item.q}</span>
                                                                {isOpen ? (
                                                                    <ChevronUp size={18} strokeWidth={2.5} className="shrink-0" />
                                                                ) : (
                                                                    <ChevronDown size={18} strokeWidth={2.5} className="shrink-0" />
                                                                )}
                                                            </button>
                                                            {isOpen && (
                                                                <div className="px-4 pb-4 text-sm leading-relaxed text-slate-700 font-medium">
                                                                    {item.a}
                                                                </div>
                                                            )}
                                                        </article>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </section>
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
