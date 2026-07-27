import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, ChevronRight, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SEOHead from '../components/seo/SEOHead';
import Footer from '../components/layout/Footer';
import { guideArticles, guidesBySlug } from '../data/guides.js';

const GuideArticlePage: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const { i18n } = useTranslation();
    const isZh = i18n.language.startsWith('zh');
    const guide = slug ? guidesBySlug[slug] : null;

    const copy = useMemo(
        () => ({
            backToGuides: isZh ? '返回指南' : 'Back to Guides',
            browseCollection: isZh ? '查看相关专题' : 'Open Related Collection',
            browseLibrary: isZh ? '浏览提示词库' : 'Browse Prompt Library',
            takeaways: isZh ? '核心要点' : 'Key Takeaways',
            checklist: isZh ? '发布前自查' : 'Quick Checklist',
            faq: isZh ? '常见问题' : 'FAQ',
            relatedGuides: isZh ? '继续阅读' : 'Continue Reading',
            notFoundTitle: isZh ? '这篇指南不存在' : 'Guide Not Found',
            notFoundBody: isZh
                ? '当前链接没有对应的长内容页面。你可以先返回 Guides 总览或回到提示词库。'
                : 'This guide does not exist. You can return to the Guides index or browse the prompt library instead.'
        }),
        [isZh]
    );

    if (!guide) {
        return (
            <>
                <SEOHead
                    title={copy.notFoundTitle}
                    description={copy.notFoundBody}
                    url="https://pentaprompt.com/guides"
                    type="website"
                />
                <div className="min-h-screen bg-gray-50 text-slate-900 font-sans">
                    <main className="max-w-5xl mx-auto px-4 md:px-8 py-16">
                        <div className="bg-white border-[3px] border-black p-8">
                            <h1 className="text-4xl font-black uppercase tracking-tight">{copy.notFoundTitle}</h1>
                            <p className="mt-4 text-slate-700 font-medium leading-relaxed">{copy.notFoundBody}</p>
                            <div className="mt-8 flex gap-4">
                                <Link to="/guides" className="px-5 py-3 border-[3px] border-black bg-black text-white font-black uppercase tracking-widest text-xs">
                                    {copy.backToGuides}
                                </Link>
                                <Link to="/" className="px-5 py-3 border-[3px] border-black bg-white text-black font-black uppercase tracking-widest text-xs">
                                    {copy.browseLibrary}
                                </Link>
                            </div>
                        </div>
                    </main>
                </div>
            </>
        );
    }

    const relatedGuides = guideArticles.filter((item) => item.slug !== guide.slug).slice(0, 3);
    const faqSchema = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: guide.faqs.map((item) => ({
            '@type': 'Question',
            name: isZh ? item.q.zh : item.q.en,
            acceptedAnswer: {
                '@type': 'Answer',
                text: isZh ? item.a.zh : item.a.en
            }
        }))
    };

    const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: isZh ? guide.title.zh : guide.title.en,
        description: isZh ? guide.description.zh : guide.description.en,
        author: {
            '@type': 'Organization',
            name: 'PentaPrompt'
        },
        publisher: {
            '@type': 'Organization',
            name: 'PentaPrompt'
        },
        mainEntityOfPage: `https://pentaprompt.com/guides/${guide.slug}`
    };

    return (
        <>
            <SEOHead
                title={`${isZh ? guide.title.zh : guide.title.en} | PentaPrompt`}
                description={isZh ? guide.description.zh : guide.description.en}
                keywords={isZh ? 'AI提示词指南, Prompt教程, 内容策略' : 'ai prompt guide, prompt tutorial, content strategy'}
                url={`https://pentaprompt.com/guides/${guide.slug}`}
                type="article"
                structuredData={[articleSchema, faqSchema]}
            />

            <div className="min-h-screen bg-gray-50 text-slate-900 font-sans">
                <header className="bg-white border-b-[3px] border-black sticky top-0 z-40">
                    <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-500 overflow-hidden">
                            <Link to="/" className="hover:text-black shrink-0 transition-colors">
                                PentaPrompt
                            </Link>
                            <ChevronRight size={14} className="shrink-0 text-slate-300" />
                            <Link to="/guides" className="hover:text-black shrink-0 transition-colors">
                                Guides
                            </Link>
                            <ChevronRight size={14} className="shrink-0 text-slate-300" />
                            <span className="text-black truncate">{isZh ? guide.title.zh : guide.title.en}</span>
                        </div>

                        <button
                            onClick={() => i18n.changeLanguage(isZh ? 'en' : 'zh')}
                            className="flex items-center gap-2 px-3 py-2 bg-white border-[2.5px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                            aria-label="Switch language"
                        >
                            <Globe size={16} strokeWidth={2.5} />
                            <span className="font-black text-xs uppercase tracking-widest">{isZh ? 'EN' : '中文'}</span>
                        </button>
                    </div>
                </header>

                <main className="max-w-6xl mx-auto px-4 md:px-8 py-14">
                    <article className="bg-white border-[3px] border-black p-6 md:p-10 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-500">
                            {isZh ? guide.kicker.zh : guide.kicker.en} • {guide.readTime}
                        </p>
                        <h1 className="mt-3 text-4xl md:text-5xl font-black uppercase italic tracking-tighter leading-[1]">
                            {isZh ? guide.title.zh : guide.title.en}
                        </h1>
                        <p className="mt-5 max-w-4xl text-base text-slate-700 font-medium leading-relaxed">
                            {isZh ? guide.description.zh : guide.description.en}
                        </p>

                        <div className="mt-8 space-y-4 text-base leading-relaxed text-slate-800">
                            {guide.intro.map((paragraph) => (
                                <p key={paragraph.en}>{isZh ? paragraph.zh : paragraph.en}</p>
                            ))}
                        </div>

                        <section className="mt-10 border-[3px] border-black bg-[#F8FAFC] p-5 md:p-6">
                            <h2 className="text-xl font-black uppercase tracking-tight">{copy.takeaways}</h2>
                            <ul className="mt-4 space-y-3 text-sm md:text-base font-medium leading-relaxed">
                                {guide.takeaways.map((item) => (
                                    <li key={item.en} className="flex gap-3">
                                        <span className="mt-1 h-2.5 w-2.5 shrink-0 bg-black" />
                                        <span>{isZh ? item.zh : item.en}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <div className="mt-12 space-y-10">
                            {guide.sections.map((section) => (
                                <section key={section.heading.en}>
                                    <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
                                        {isZh ? section.heading.zh : section.heading.en}
                                    </h2>
                                    <div className="mt-4 space-y-4 text-base leading-relaxed text-slate-800">
                                        {section.paragraphs.map((paragraph) => (
                                            <p key={paragraph.en}>{isZh ? paragraph.zh : paragraph.en}</p>
                                        ))}
                                    </div>
                                    <ul className="mt-5 space-y-3 border-l-[3px] border-black pl-5 text-sm md:text-base font-medium leading-relaxed">
                                        {section.bullets.map((bullet) => (
                                            <li key={bullet.en}>{isZh ? bullet.zh : bullet.en}</li>
                                        ))}
                                    </ul>
                                </section>
                            ))}
                        </div>

                        <section className="mt-12 bg-gray-50 border-[3px] border-black p-5 md:p-6">
                            <h2 className="text-xl font-black uppercase tracking-tight">
                                {isZh ? guide.checklistTitle.zh : guide.checklistTitle.en}
                            </h2>
                            <ol className="mt-4 space-y-3 text-sm md:text-base font-medium leading-relaxed list-decimal pl-5">
                                {guide.checklist.map((item) => (
                                    <li key={item.en}>{isZh ? item.zh : item.en}</li>
                                ))}
                            </ol>
                        </section>

                        <section className="mt-12">
                            <h2 className="text-2xl font-black uppercase tracking-tight">{copy.faq}</h2>
                            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {guide.faqs.map((item) => (
                                    <div key={item.q.en} className="border-[3px] border-black bg-white p-5">
                                        <h3 className="text-base font-black uppercase tracking-tight">
                                            {isZh ? item.q.zh : item.q.en}
                                        </h3>
                                        <p className="mt-3 text-sm md:text-base text-slate-700 font-medium leading-relaxed">
                                            {isZh ? item.a.zh : item.a.en}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="mt-12 flex flex-col sm:flex-row gap-4">
                            <Link
                                to={`/collections/${guide.collectionSlug}`}
                                className="inline-flex items-center justify-center gap-2 bg-black text-white px-7 py-4 border-[3px] border-black font-black uppercase tracking-widest text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                            >
                                {copy.browseCollection}
                                <ArrowRight size={18} strokeWidth={3} />
                            </Link>
                            <Link
                                to={guide.libraryHref}
                                className="inline-flex items-center justify-center gap-2 bg-white text-black px-7 py-4 border-[3px] border-black font-black uppercase tracking-widest text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                            >
                                {copy.browseLibrary}
                            </Link>
                        </section>
                    </article>

                    <section className="mt-14">
                        <div className="flex items-center justify-between gap-4">
                            <h2 className="text-2xl font-black uppercase tracking-tight">{copy.relatedGuides}</h2>
                            <Link to="/guides" className="text-sm font-black uppercase tracking-widest hover:underline">
                                {copy.backToGuides}
                            </Link>
                        </div>
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                            {relatedGuides.map((item) => (
                                <article key={item.slug} className="bg-white border-[3px] border-black p-5">
                                    <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-500">
                                        {item.readTime}
                                    </p>
                                    <h3 className="mt-3 text-lg font-black uppercase tracking-tight leading-snug">
                                        {isZh ? item.title.zh : item.title.en}
                                    </h3>
                                    <p className="mt-3 text-sm text-slate-700 font-medium leading-relaxed">
                                        {isZh ? item.description.zh : item.description.en}
                                    </p>
                                    <Link
                                        to={`/guides/${item.slug}`}
                                        className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:underline"
                                    >
                                        {isZh ? '继续阅读' : 'Read next'}
                                        <ArrowRight size={14} strokeWidth={3} />
                                    </Link>
                                </article>
                            ))}
                        </div>
                    </section>

                    <Footer />
                </main>
            </div>
        </>
    );
};

export default GuideArticlePage;
