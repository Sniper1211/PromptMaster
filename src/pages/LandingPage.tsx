import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, Globe, PlayCircle, Search } from 'lucide-react';
import SEOHead from '../components/seo/SEOHead';
import Footer from '../components/layout/Footer';

const LandingPage: React.FC = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const toggleLanguage = () => {
        const currentLang = i18n.language;
        const isEnglish = currentLang.startsWith('en');
        const newLang = isEnglish ? 'zh' : 'en';
        i18n.changeLanguage(newLang);
    };

    useEffect(() => {
        const hasLegacyFilters =
            searchParams.has('category') || searchParams.has('type') || searchParams.has('search');
        if (!hasLegacyFilters) return;
        const params = new URLSearchParams(searchParams);
        navigate(`/prompts?${params.toString()}`, { replace: true });
    }, [navigate, searchParams]);

    const scenarios = useMemo(
        () => [
            { key: 'writing', href: '/collections/writing-prompts' },
            { key: 'marketing', href: '/collections/marketing-prompts' },
            { key: 'seo', href: '/collections/seo-prompts' },
            { key: 'coding', href: '/collections/coding-prompts' },
            { key: 'email', href: '/prompts?search=email' },
            { key: 'learning', href: '/prompts?category=LEARNING' },
            { key: 'product', href: '/prompts?search=product' },
            { key: 'video', href: '/collections/video-prompts' }
        ],
        []
    );

    const featuredCategories = useMemo(
        () => [
            'WRITING',
            'CODING',
            'MARKETING',
            'SEO',
            'BUSINESS',
            'PRODUCTIVITY',
            'LEARNING',
            'VIDEO'
        ] as const,
        []
    );

    const collections = useMemo(
        () => [
            { slug: 'writing-prompts', key: 'writing' },
            { slug: 'seo-prompts', key: 'seo' },
            { slug: 'marketing-prompts', key: 'marketing' },
            { slug: 'coding-prompts', key: 'coding' },
            { slug: 'video-prompts', key: 'video' }
        ],
        []
    );

    const faqItems = useMemo(
        () => [
            { q: t('landing.faq.q1.q'), a: t('landing.faq.q1.a') },
            { q: t('landing.faq.q2.q'), a: t('landing.faq.q2.a') },
            { q: t('landing.faq.q3.q'), a: t('landing.faq.q3.a') },
            { q: t('landing.faq.q4.q'), a: t('landing.faq.q4.a') },
            { q: t('landing.faq.q5.q'), a: t('landing.faq.q5.a') },
            { q: t('landing.faq.q6.q'), a: t('landing.faq.q6.a') }
        ],
        [t]
    );

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

    const faqSchema = {
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
    };

    return (
        <>
            <SEOHead
                title={t('seo.home.title')}
                description={t('seo.home.description')}
                keywords={t('seo.home.keywords')}
                url="https://pentaprompt.com"
                type="website"
                structuredData={[websiteSchema, faqSchema]}
            />

            <div className="min-h-screen bg-gray-50 text-slate-900 font-sans">
                <header className="bg-white border-b-[3px] border-black sticky top-0 z-40">
                    <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
                        <Link to="/" className="flex items-center gap-2 shrink-0">
                            <span className="text-xl font-black uppercase tracking-tight">PentaPrompt</span>
                        </Link>

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
                                to="/prompts"
                                className="hidden sm:flex items-center gap-2 bg-[#FACC15] text-black px-4 py-2 border-[2.5px] border-black font-black uppercase tracking-widest text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                            >
                                <Search size={16} strokeWidth={2.5} />
                                {t('landing.header.browse')}
                            </Link>
                        </div>
                    </div>
                </header>

                <main>
                    <section className="bg-white border-b-[3px] border-black">
                        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
                            <div className="max-w-4xl">
                                <h1 className="text-5xl md:text-6xl font-black uppercase italic tracking-tighter leading-[0.95] text-black">
                                    {t('landing.hero.title')}
                                </h1>
                                <p className="mt-6 text-lg md:text-xl text-slate-600 font-medium leading-relaxed">
                                    {t('landing.hero.subtitle')}
                                </p>

                                <div className="mt-10 flex flex-col sm:flex-row gap-4">
                                    <Link
                                        to="/prompts"
                                        className="inline-flex items-center justify-center gap-2 bg-black text-white px-7 py-4 border-[3px] border-black font-black uppercase tracking-widest text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                                    >
                                        {t('landing.hero.ctaPrimary')}
                                        <ArrowRight size={18} strokeWidth={3} />
                                    </Link>
                                    <Link
                                        to="/prompts?type=video"
                                        className="inline-flex items-center justify-center gap-2 bg-[#FF4D4D] text-white px-7 py-4 border-[3px] border-black font-black uppercase tracking-widest text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                                    >
                                        <PlayCircle size={18} strokeWidth={3} />
                                        {t('landing.hero.ctaVideo')}
                                    </Link>
                                </div>

                                <p className="mt-6 text-xs font-bold uppercase tracking-widest text-slate-500">
                                    {t('landing.hero.note')}
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="max-w-7xl mx-auto px-4 md:px-8 py-14">
                        <div className="flex items-end justify-between gap-6">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
                                    {t('landing.scenarios.title')}
                                </h2>
                                <p className="mt-2 text-slate-600 font-medium">
                                    {t('landing.scenarios.subtitle')}
                                </p>
                            </div>
                            <Link
                                to="/prompts"
                                className="hidden md:inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest hover:underline decoration-4 underline-offset-4"
                            >
                                {t('landing.scenarios.more')}
                                <ArrowRight size={16} strokeWidth={3} />
                            </Link>
                        </div>

                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {scenarios.map(item => (
                                <Link
                                    key={item.key}
                                    to={item.href}
                                    className="group bg-white border-[3px] border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                                >
                                    <h3 className="text-lg font-black uppercase tracking-tight group-hover:text-[#FF4D4D] transition-colors">
                                        {t(`landing.scenarios.items.${item.key}.title`)}
                                    </h3>
                                    <p className="mt-2 text-sm text-slate-600 font-medium leading-relaxed">
                                        {t(`landing.scenarios.items.${item.key}.desc`)}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </section>

                    <section className="bg-white border-y-[3px] border-black">
                        <div className="max-w-7xl mx-auto px-4 md:px-8 py-14">
                            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
                                {t('landing.categories.title')}
                            </h2>
                            <p className="mt-2 text-slate-600 font-medium">
                                {t('landing.categories.subtitle')}
                            </p>

                            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {featuredCategories.map(key => (
                                    <Link
                                        key={key}
                                        to={key === 'VIDEO' ? '/prompts?type=video' : `/prompts?category=${key}`}
                                        className="group border-[3px] border-black bg-gray-50 p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-white hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                                    >
                                        <div className="flex items-center justify-between gap-4">
                                            <div>
                                                <h3 className="text-lg font-black uppercase tracking-tight group-hover:text-[#FF4D4D] transition-colors">
                                                    {t(`categories.${key}`)}
                                                </h3>
                                                <p className="mt-1 text-sm text-slate-600 font-medium">
                                                    {t(`landing.categoryDescriptions.${key}`)}
                                                </p>
                                            </div>
                                            <ArrowRight size={18} strokeWidth={3} className="shrink-0" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="max-w-7xl mx-auto px-4 md:px-8 py-14">
                        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
                            {t('landing.collections.title')}
                        </h2>
                        <p className="mt-2 text-slate-600 font-medium">
                            {t('landing.collections.subtitle')}
                        </p>

                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {collections.map(c => (
                                <Link
                                    key={c.slug}
                                    to={`/collections/${c.slug}`}
                                    className="group bg-white border-[3px] border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                                >
                                    <h3 className="text-lg font-black uppercase tracking-tight group-hover:text-[#FF4D4D] transition-colors">
                                        {t(`collections.${c.key}.title`)}
                                    </h3>
                                    <p className="mt-2 text-sm text-slate-600 font-medium leading-relaxed">
                                        {t(`collections.${c.key}.desc`)}
                                    </p>
                                    <div className="mt-4 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest">
                                        {t('landing.collections.open')}
                                        <ArrowRight size={14} strokeWidth={3} />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>

                    <section className="bg-white border-y-[3px] border-black">
                        <div className="max-w-7xl mx-auto px-4 md:px-8 py-14">
                            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
                                {t('landing.faq.title')}
                            </h2>
                            <p className="mt-2 text-slate-600 font-medium">
                                {t('landing.faq.subtitle')}
                            </p>

                            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {faqItems.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="border-[3px] border-black bg-gray-50 p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
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

                            <div className="mt-10 flex flex-col sm:flex-row gap-4">
                                <Link
                                    to="/prompts"
                                    className="inline-flex items-center justify-center gap-2 bg-[#FACC15] text-black px-7 py-4 border-[3px] border-black font-black uppercase tracking-widest text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                                >
                                    {t('landing.faq.ctaBrowse')}
                                    <ArrowRight size={18} strokeWidth={3} />
                                </Link>
                                <Link
                                    to="/prompts?category=SEO"
                                    className="inline-flex items-center justify-center gap-2 bg-white text-black px-7 py-4 border-[3px] border-black font-black uppercase tracking-widest text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                                >
                                    {t('landing.faq.ctaSeo')}
                                    <ArrowRight size={18} strokeWidth={3} />
                                </Link>
                            </div>
                        </div>
                    </section>

                    <section className="max-w-7xl mx-auto px-4 md:px-8 py-6">
                        <Footer />
                    </section>
                </main>
            </div>
        </>
    );
};

export default LandingPage;
