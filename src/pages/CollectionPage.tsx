import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronRight, Globe } from 'lucide-react';
import SEOHead from '../components/seo/SEOHead';
import { Category } from '../types';
import { usePrompts } from '../hooks/usePrompts';
import PromptGrid from '../components/home/PromptGrid';
import SkeletonGrid from '../components/home/SkeletonGrid';

type CollectionConfig = {
    titleKey: string;
    descriptionKey: string;
    keywordsKey: string;
    filterHref: string;
    category?: Category;
    promptType?: 'text' | 'video';
    faqKeys: Array<{ q: string; a: string }>;
};

const CollectionPage: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();

    const toggleLanguage = () => {
        const currentLang = i18n.language;
        const isEnglish = currentLang.startsWith('en');
        const newLang = isEnglish ? 'zh' : 'en';
        i18n.changeLanguage(newLang);
    };

    const configs = useMemo<Record<string, CollectionConfig>>(
        () => ({
            'writing-prompts': {
                titleKey: 'seo.collections.writing.title',
                descriptionKey: 'seo.collections.writing.description',
                keywordsKey: 'seo.collections.writing.keywords',
                filterHref: '/prompts?category=WRITING',
                category: Category.WRITING,
                faqKeys: [
                    { q: 'collectionsFaq.writing.q1.q', a: 'collectionsFaq.writing.q1.a' },
                    { q: 'collectionsFaq.writing.q2.q', a: 'collectionsFaq.writing.q2.a' },
                    { q: 'collectionsFaq.writing.q3.q', a: 'collectionsFaq.writing.q3.a' }
                ]
            },
            'seo-prompts': {
                titleKey: 'seo.collections.seo.title',
                descriptionKey: 'seo.collections.seo.description',
                keywordsKey: 'seo.collections.seo.keywords',
                filterHref: '/prompts?category=SEO',
                category: Category.SEO,
                faqKeys: [
                    { q: 'collectionsFaq.seo.q1.q', a: 'collectionsFaq.seo.q1.a' },
                    { q: 'collectionsFaq.seo.q2.q', a: 'collectionsFaq.seo.q2.a' },
                    { q: 'collectionsFaq.seo.q3.q', a: 'collectionsFaq.seo.q3.a' }
                ]
            },
            'marketing-prompts': {
                titleKey: 'seo.collections.marketing.title',
                descriptionKey: 'seo.collections.marketing.description',
                keywordsKey: 'seo.collections.marketing.keywords',
                filterHref: '/prompts?category=MARKETING',
                category: Category.MARKETING,
                faqKeys: [
                    { q: 'collectionsFaq.marketing.q1.q', a: 'collectionsFaq.marketing.q1.a' },
                    { q: 'collectionsFaq.marketing.q2.q', a: 'collectionsFaq.marketing.q2.a' },
                    { q: 'collectionsFaq.marketing.q3.q', a: 'collectionsFaq.marketing.q3.a' }
                ]
            },
            'coding-prompts': {
                titleKey: 'seo.collections.coding.title',
                descriptionKey: 'seo.collections.coding.description',
                keywordsKey: 'seo.collections.coding.keywords',
                filterHref: '/prompts?category=CODING',
                category: Category.CODING,
                faqKeys: [
                    { q: 'collectionsFaq.coding.q1.q', a: 'collectionsFaq.coding.q1.a' },
                    { q: 'collectionsFaq.coding.q2.q', a: 'collectionsFaq.coding.q2.a' },
                    { q: 'collectionsFaq.coding.q3.q', a: 'collectionsFaq.coding.q3.a' }
                ]
            },
            'video-prompts': {
                titleKey: 'seo.collections.video.title',
                descriptionKey: 'seo.collections.video.description',
                keywordsKey: 'seo.collections.video.keywords',
                filterHref: '/prompts?type=video',
                promptType: 'video',
                faqKeys: [
                    { q: 'collectionsFaq.video.q1.q', a: 'collectionsFaq.video.q1.a' },
                    { q: 'collectionsFaq.video.q2.q', a: 'collectionsFaq.video.q2.a' },
                    { q: 'collectionsFaq.video.q3.q', a: 'collectionsFaq.video.q3.a' }
                ]
            }
        }),
        []
    );

    const config = (slug && configs[slug]) || null;

    const faqItems = useMemo(() => {
        if (!config) return [];
        return config.faqKeys.map(item => ({
            q: t(item.q),
            a: t(item.a)
        }));
    }, [config, t]);

    const collectionTitle = config ? t(config.titleKey) : t('seo.collections.fallback.title');
    const collectionDescription = config ? t(config.descriptionKey) : t('seo.collections.fallback.description');
    const collectionKeywords = config ? t(config.keywordsKey) : t('seo.collections.fallback.keywords');

    const canonicalUrl = config
        ? `https://pentaprompt.com/collections/${slug}`
        : 'https://pentaprompt.com/collections';

    const faqSchema = config
        ? {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": faqItems.map(item => ({
                  "@type": "Question",
                  "name": item.q,
                  "acceptedAnswer": {
                      "@type": "Answer",
                      "text": item.a
                  }
              }))
          }
        : undefined;

    const { prompts, loading } = usePrompts(
        config?.promptType ? undefined : config?.category,
        'recent',
        12,
        config?.promptType
    );

    const handleSelectPrompt = (promptId: string) => {
        navigate(`/prompt/${promptId}`);
    };

    if (!config) {
        return (
            <>
                <SEOHead
                    title={collectionTitle}
                    description={collectionDescription}
                    keywords={collectionKeywords}
                    url={canonicalUrl}
                    type="website"
                />
                <div className="min-h-screen bg-gray-50 text-slate-900 font-sans">
                    <header className="bg-white border-b-[3px] border-black sticky top-0 z-40">
                        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
                            <Link to="/" className="text-xl font-black uppercase tracking-tight">
                                PentaPrompt
                            </Link>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={toggleLanguage}
                                    className="flex items-center gap-2 px-3 py-2 bg-white border-[2.5px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                                >
                                    <Globe size={16} strokeWidth={2.5} />
                                    <span className="font-black text-xs uppercase tracking-widest">
                                        {i18n.language.startsWith('zh') ? 'EN' : '中文'}
                                    </span>
                                </button>
                                <Link
                                    to="/prompts"
                                    className="hidden sm:inline-flex items-center gap-2 bg-[#FACC15] text-black px-4 py-2 border-[2.5px] border-black font-black uppercase tracking-widest text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                                >
                                    {t('collections.browseLibrary')}
                                    <ArrowRight size={16} strokeWidth={3} />
                                </Link>
                            </div>
                        </div>
                    </header>
                    <main className="max-w-7xl mx-auto px-4 md:px-8 py-14">
                        <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter leading-[0.95]">
                            {collectionTitle}
                        </h1>
                        <p className="mt-6 text-slate-600 font-medium max-w-3xl">
                            {collectionDescription}
                        </p>
                        <div className="mt-10">
                            <Link
                                to="/prompts"
                                className="inline-flex items-center justify-center gap-2 bg-black text-white px-7 py-4 border-[3px] border-black font-black uppercase tracking-widest text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                            >
                                {t('collections.browseLibrary')}
                                <ArrowRight size={18} strokeWidth={3} />
                            </Link>
                        </div>
                    </main>
                </div>
            </>
        );
    }

    return (
        <>
            <SEOHead
                title={collectionTitle}
                description={collectionDescription}
                keywords={collectionKeywords}
                url={canonicalUrl}
                type="website"
                structuredData={faqSchema}
            />

            <div className="min-h-screen bg-gray-50 text-slate-900 font-sans">
                <header className="bg-white border-b-[3px] border-black sticky top-0 z-40">
                    <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-500 overflow-hidden">
                            <Link to="/" className="hover:text-black shrink-0 transition-colors">
                                PentaPrompt
                            </Link>
                            <ChevronRight size={14} className="shrink-0 text-slate-300" />
                            <Link to="/prompts" className="hover:text-black shrink-0 transition-colors">
                                {t('collections.library')}
                            </Link>
                            <ChevronRight size={14} className="shrink-0 text-slate-300" />
                            <span className="text-black truncate">
                                {collectionTitle}
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={toggleLanguage}
                                className="flex items-center gap-2 px-3 py-2 bg-white border-[2.5px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                                aria-label="Switch language"
                            >
                                <Globe size={16} strokeWidth={2.5} />
                                <span className="font-black text-xs uppercase tracking-widest">
                                    {i18n.language.startsWith('zh') ? 'EN' : '中文'}
                                </span>
                            </button>
                            <Link
                                to={config.filterHref}
                                className="hidden sm:inline-flex items-center gap-2 bg-[#FACC15] text-black px-4 py-2 border-[2.5px] border-black font-black uppercase tracking-widest text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                            >
                                {t('collections.openInLibrary')}
                                <ArrowRight size={16} strokeWidth={3} />
                            </Link>
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-4 md:px-8 py-14">
                    <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter leading-[0.95]">
                        {collectionTitle}
                    </h1>
                    <p className="mt-6 text-slate-600 font-medium max-w-3xl leading-relaxed">
                        {collectionDescription}
                    </p>

                    <div className="mt-8 flex flex-col sm:flex-row gap-4">
                        <Link
                            to={config.filterHref}
                            className="inline-flex items-center justify-center gap-2 bg-black text-white px-7 py-4 border-[3px] border-black font-black uppercase tracking-widest text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                        >
                            {t('collections.openInLibrary')}
                            <ArrowRight size={18} strokeWidth={3} />
                        </Link>
                        <Link
                            to="/prompts"
                            className="inline-flex items-center justify-center gap-2 bg-white text-black px-7 py-4 border-[3px] border-black font-black uppercase tracking-widest text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                        >
                            {t('collections.browseLibrary')}
                            <ArrowRight size={18} strokeWidth={3} />
                        </Link>
                    </div>

                    <section className="mt-12">
                        <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight">
                            {t('collections.featured')}
                        </h2>
                        <div className="mt-6">
                            {loading ? (
                                <SkeletonGrid />
                            ) : (
                                <PromptGrid
                                    prompts={prompts}
                                    onSelectPrompt={(p) => handleSelectPrompt(p.id)}
                                    onClearFilters={() => navigate(config.filterHref)}
                                />
                            )}
                        </div>
                    </section>

                    <section className="mt-16 border-t-[3px] border-black pt-10">
                        <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight">
                            {t('landing.faq.title')}
                        </h2>
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {faqItems.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="border-[3px] border-black bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                                >
                                    <h3 className="text-base font-black uppercase tracking-tight">
                                        {item.q}
                                    </h3>
                                    <p className="mt-2 text-sm text-slate-700 font-medium leading-relaxed">
                                        {item.a}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
};

export default CollectionPage;

