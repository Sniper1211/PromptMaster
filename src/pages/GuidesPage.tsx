import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SEOHead from '../components/seo/SEOHead';
import Footer from '../components/layout/Footer';
import { guideArticles } from '../data/guides.js';

const GuidesPage: React.FC = () => {
    const { i18n } = useTranslation();
    const isZh = i18n.language.startsWith('zh');

    const copy = useMemo(
        () => ({
            pageTitle: isZh ? 'AI Prompt 指南 | PentaPrompt' : 'AI Prompt Guides | PentaPrompt',
            pageDescription: isZh
                ? '围绕提示词写作、SEO、商业视觉与团队工作流的实战指南，帮助 PentaPrompt 从模板库延伸为真正可阅读的内容站。'
                : 'Practical guides on prompt writing, SEO, commercial visuals, and team workflows to complement the PentaPrompt library.',
            kicker: isZh ? 'GUIDES' : 'GUIDES',
            heroTitle: isZh ? '不止是提示词模板，我们也把方法讲清楚。' : 'Not just prompt templates. Real methods, too.',
            heroBody: isZh
                ? '这一组长内容页面用来解释提示词为什么有效、该怎么改、怎么在真实工作里复用。对用户来说，它们能补足背景；对 AdSense 来说，它们也比单纯的目录页更像持续维护的内容资产。'
                : 'These long-form guides explain why prompts work, how to refine them, and how to apply them in real workflows. They add user value and make the site feel like a maintained content resource, not only a directory.',
            heroPrimary: isZh ? '浏览提示词库' : 'Browse Library',
            heroSecondary: isZh ? '查看首页' : 'Visit Home',
            sectionTitle: isZh ? '当前已上线的指南' : 'Published Guides',
            sectionBody: isZh
                ? '我们先上线第一批 5 篇，优先覆盖最适合沉淀原创内容的主题。后续可以继续沿着 SEO、视频、写作和商业视觉扩展。'
                : 'This first batch focuses on topics where editorial depth matters most. More SEO, video, writing, and commercial guides can build on this foundation.',
            readGuide: isZh ? '阅读指南' : 'Read Guide',
            browseCollection: isZh ? '查看相关专题' : 'Related Collection',
            whyTitle: isZh ? '为什么要单独做 Guides？' : 'Why add a Guides section?',
            whyItems: isZh
                ? [
                      '它让站点不只是“模板聚合”，而是补上方法论、案例与判断标准。',
                      '它可以给首页、专题页和详情页提供更自然的内链来源。',
                      '它更接近 AdSense 喜欢看到的“有编辑痕迹、持续更新的内容页”。'
                  ]
                : [
                      'It turns the site from a template dump into an editorial resource with method, examples, and judgment.',
                      'It creates natural internal links back to the homepage, collections, and prompt detail pages.',
                      'It looks much closer to the kind of maintained content pages AdSense expects to see.'
                  ]
        }),
        [isZh]
    );

    const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        itemListElement: guideArticles.map((guide, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: `https://pentaprompt.com/guides/${guide.slug}`,
            name: isZh ? guide.title.zh : guide.title.en
        }))
    };

    return (
        <>
            <SEOHead
                title={copy.pageTitle}
                description={copy.pageDescription}
                keywords={isZh ? 'AI提示词指南, Prompt教程, SEO提示词, Prompt Engineering' : 'ai prompt guides, prompt tutorial, seo prompts, prompt engineering'}
                url="https://pentaprompt.com/guides"
                type="website"
                structuredData={articleSchema}
            />

            <div className="min-h-screen bg-gray-50 text-slate-900 font-sans">
                <header className="bg-white border-b-[3px] border-black sticky top-0 z-40">
                    <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
                        <Link to="/" className="text-xl font-black uppercase tracking-tight">
                            PentaPrompt
                        </Link>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => i18n.changeLanguage(isZh ? 'en' : 'zh')}
                                className="flex items-center gap-2 px-3 py-2 bg-white border-[2.5px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                                aria-label="Switch language"
                            >
                                <Globe size={16} strokeWidth={2.5} />
                                <span className="font-black text-xs uppercase tracking-widest">
                                    {isZh ? 'EN' : '中文'}
                                </span>
                            </button>
                            <Link
                                to="/"
                                className="hidden sm:inline-flex items-center gap-2 bg-[#FACC15] text-black px-4 py-2 border-[2.5px] border-black font-black uppercase tracking-widest text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                            >
                                {copy.heroPrimary}
                                <ArrowRight size={16} strokeWidth={3} />
                            </Link>
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-4 md:px-8 py-14">
                    <section className="bg-white border-[3px] border-black p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-500">{copy.kicker}</p>
                        <h1 className="mt-3 text-4xl md:text-5xl font-black uppercase italic tracking-tighter leading-[0.95]">
                            {copy.heroTitle}
                        </h1>
                        <p className="mt-5 max-w-4xl text-sm md:text-base text-slate-700 font-medium leading-relaxed">
                            {copy.heroBody}
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row gap-4">
                            <Link
                                to="/"
                                className="inline-flex items-center justify-center gap-2 bg-black text-white px-7 py-4 border-[3px] border-black font-black uppercase tracking-widest text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                            >
                                {copy.heroPrimary}
                                <ArrowRight size={18} strokeWidth={3} />
                            </Link>
                            <Link
                                to="/discover"
                                className="inline-flex items-center justify-center gap-2 bg-white text-black px-7 py-4 border-[3px] border-black font-black uppercase tracking-widest text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                            >
                                {copy.heroSecondary}
                            </Link>
                        </div>
                    </section>

                    <section className="mt-14">
                        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">{copy.sectionTitle}</h2>
                        <p className="mt-3 max-w-3xl text-sm md:text-base text-slate-600 font-medium leading-relaxed">
                            {copy.sectionBody}
                        </p>

                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                            {guideArticles.map((guide: any) => (
                                <article
                                    key={guide.slug}
                                    className="bg-white border-[3px] border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col"
                                >
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">
                                        <BookOpen size={14} strokeWidth={2.5} />
                                        <span>{isZh ? guide.kicker.zh : guide.kicker.en}</span>
                                        <span className="text-slate-300">•</span>
                                        <span>{guide.readTime}</span>
                                    </div>
                                    <h3 className="mt-4 text-xl font-black uppercase tracking-tight leading-snug">
                                        {isZh ? guide.title.zh : guide.title.en}
                                    </h3>
                                    <p className="mt-3 text-sm text-slate-700 font-medium leading-relaxed flex-1">
                                        {isZh ? guide.description.zh : guide.description.en}
                                    </p>
                                    <div className="mt-6 flex flex-wrap gap-3">
                                        <Link
                                            to={`/guides/${guide.slug}`}
                                            className="inline-flex items-center gap-2 bg-black text-white px-4 py-3 border-[2.5px] border-black font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-colors"
                                        >
                                            {copy.readGuide}
                                            <ArrowRight size={14} strokeWidth={3} />
                                        </Link>
                                        <Link
                                            to={`/collections/${guide.collectionSlug}`}
                                            className="inline-flex items-center gap-2 bg-gray-50 text-black px-4 py-3 border-[2.5px] border-black font-black uppercase tracking-widest text-xs hover:bg-[#FACC15] transition-colors"
                                        >
                                            {copy.browseCollection}
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>

                    <section className="mt-16 bg-white border-[3px] border-black p-6 md:p-8">
                        <h2 className="text-2xl font-black uppercase tracking-tight">{copy.whyTitle}</h2>
                        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                            {copy.whyItems.map((item: string) => (
                                <div key={item} className="border-[2px] border-black bg-gray-50 p-4 text-sm font-medium leading-relaxed">
                                    {item}
                                </div>
                            ))}
                        </div>
                    </section>

                    <Footer />
                </main>
            </div>
        </>
    );
};

export default GuidesPage;
