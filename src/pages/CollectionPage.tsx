import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronRight, Globe } from 'lucide-react';
import SEOHead from '../components/seo/SEOHead';
import { Category } from '../types';
import { usePrompts } from '../hooks/usePrompts';
import PromptGrid from '../components/home/PromptGrid';
import SkeletonGrid from '../components/home/SkeletonGrid';
import { guideArticles } from '../data/guides.js';
import Footer from '../components/layout/Footer';

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
    const collectionContent = useMemo(
        () => ({
            'writing-prompts': {
                intro: [
                    {
                        en: 'Writing prompts are strongest when they define audience, angle, and structure. A good writing template should save time without flattening voice.',
                        zh: '写作提示词最有效的时候，通常会同时说明受众、角度和结构。好的写作模板应该帮你提速，而不是把内容写得都一个味道。'
                    },
                    {
                        en: 'Use this collection when you need drafts, rewrites, summaries, scripts, or editorial support. The prompts work best when you add examples and clear constraints before generating.',
                        zh: '当你需要初稿、改写、摘要、脚本或编辑辅助时，这个专题页最有用。想要结果更稳，最好在生成前补上示例和清晰限制。'
                    }
                ],
                bullets: {
                    en: ['Best for drafts, rewrites, and structured output.', 'Add audience and tone to reduce generic text.', 'Iterate section by section for long-form work.'],
                    zh: ['适合初稿、改写和结构化输出。', '补上读者与语气，能明显减少空泛内容。', '长文场景建议按章节逐段迭代。']
                }
            },
            'seo-prompts': {
                intro: [
                    {
                        en: 'SEO prompts are most useful when they support research, briefs, and optimization work. They are less useful when you expect them to replace editorial judgment entirely.',
                        zh: 'SEO 提示词在研究、brief 产出和页面优化场景里最有价值；如果拿它直接替代全部编辑判断，效果往往会很一般。'
                    },
                    {
                        en: 'This collection works best for keyword clustering, page angles, content briefs, meta descriptions, and content-gap checks. Treat the result as a draft you still need to verify.',
                        zh: '这个专题最适合用来做关键词聚类、内容角度、内容 brief、Meta 描述和内容缺口检查。更稳妥的用法是把结果当作草稿，再做人工核验。'
                    }
                ],
                bullets: {
                    en: ['Use prompts to structure research, not skip it.', 'Add search intent and audience context.', 'Review outputs against actual page goals.'],
                    zh: ['用提示词把研究结构化，而不是跳过研究。', '补充搜索意图与受众背景。', '让产出围绕真实页面目标来审核。']
                }
            },
            'marketing-prompts': {
                intro: [
                    {
                        en: 'Marketing prompts work best when the offer, audience, channel, and CTA are already clear. If the business context is weak, the copy will usually sound polished but shallow.',
                        zh: '营销提示词最适合在卖点、受众、渠道和 CTA 已经明确的前提下使用。业务背景过弱时，产出往往会显得流畅却很空。'
                    },
                    {
                        en: 'Use this collection for hooks, landing page blocks, positioning, email angles, and ad copy. Strong inputs create stronger differentiation.',
                        zh: '这个专题适合做钩子文案、落地页模块、定位表达、邮件角度和广告文案。输入越扎实，结果越容易拉开差异。'
                    }
                ],
                bullets: {
                    en: ['Mention audience, offer, and objection handling.', 'Ask for multiple variants before selecting a direction.', 'Use prompt outputs as material for brand review.'],
                    zh: ['尽量补充受众、卖点和异议处理。', '先要多个方向，再决定走哪条线。', '把 AI 结果当作品牌评审前的素材。']
                }
            },
            'coding-prompts': {
                intro: [
                    {
                        en: 'Coding prompts become more reliable when they include the real environment, stack, constraints, and expected output. Without that context, models tend to default to generic examples.',
                        zh: '编程提示词在给出真实环境、技术栈、约束和预期输出后，稳定性会明显更高。缺少这些背景时，模型很容易退回到泛化示例。'
                    },
                    {
                        en: 'This collection helps with debugging, refactoring, code reviews, and architecture thinking. The strongest prompts show the model what already failed and what “good” looks like.',
                        zh: '这个专题页适合调试、重构、代码评审和架构思考。最强的编程提示词，通常都会明确告诉模型：哪些方案已经失败、什么结果才算好。'
                    }
                ],
                bullets: {
                    en: ['Share the stack and the failing behavior.', 'Define expected output before asking for code.', 'Prefer iteration over one giant instruction block.'],
                    zh: ['先说明技术栈和失败现象。', '在让模型写代码前先定义期望结果。', '分轮迭代通常比一大段口令更稳定。']
                }
            },
            'video-prompts': {
                intro: [
                    {
                        en: 'Video prompts need stronger structure than plain text prompts because they often combine narrative, visual direction, pacing, and shot logic in one request.',
                        zh: '视频提示词比普通文本提示词更依赖结构，因为它经常同时包含叙事、视觉方向、节奏和镜头逻辑。'
                    },
                    {
                        en: 'Use this collection when you need scripts, storyboards, shot lists, or generator-ready video prompts. The more clearly you define scene progression, the cleaner the output becomes.',
                        zh: '如果你在做脚本、分镜、镜头表或可直接喂给生成器的视频提示词，这个专题会更合适。场景推进越清晰，结果通常越干净。'
                    }
                ],
                bullets: {
                    en: ['Break the task into scenes or beats.', 'Separate narrative intent from visual style.', 'Keep camera and pacing notes concise and useful.'],
                    zh: ['把任务拆成场景或节拍。', '把叙事目标和视觉风格分开写。', '镜头与节奏说明尽量简洁有效。']
                }
            }
        }),
        []
    );

    const faqItems = useMemo(() => {
        if (!config) return [];
        return config.faqKeys.map((item: { q: string; a: string }) => ({
            q: t(item.q),
            a: t(item.a)
        }));
    }, [config, t]);
    const relatedGuides = useMemo(() => {
        if (!slug) return [];
        return guideArticles.filter((guide: any) => guide.collectionSlug === slug).slice(0, 2);
    }, [slug]);

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
                "mainEntity": faqItems.map((item: { q: string; a: string }) => ({
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

                    {slug && collectionContent[slug as keyof typeof collectionContent] && (
                        <section className="mt-12 grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-6">
                            <div className="bg-white border-[3px] border-black p-6 md:p-7">
                                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-500">
                                    {i18n.language.startsWith('zh') ? 'HOW TO USE THIS COLLECTION' : 'HOW TO USE THIS COLLECTION'}
                                </p>
                                <div className="mt-4 space-y-4 text-sm md:text-base font-medium leading-relaxed text-slate-700">
                                    {collectionContent[slug as keyof typeof collectionContent].intro.map((paragraph: { en: string; zh: string }) => (
                                        <p key={paragraph.en}>{i18n.language.startsWith('zh') ? paragraph.zh : paragraph.en}</p>
                                    ))}
                                </div>
                                <ul className="mt-5 space-y-3 border-l-[3px] border-black pl-5 text-sm font-medium leading-relaxed">
                                    {collectionContent[slug as keyof typeof collectionContent].bullets[i18n.language.startsWith('zh') ? 'zh' : 'en'].map((bullet: string) => (
                                        <li key={bullet}>{bullet}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-white border-[3px] border-black p-6 md:p-7">
                                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-500">
                                    {i18n.language.startsWith('zh') ? 'RELATED GUIDES' : 'RELATED GUIDES'}
                                </p>
                                <h2 className="mt-2 text-xl font-black uppercase tracking-tight">
                                    {i18n.language.startsWith('zh') ? '先读一篇方法指南' : 'Read a guide first'}
                                </h2>
                                <div className="mt-5 space-y-4">
                                    {relatedGuides.map((guide: any) => (
                                        <article key={guide.slug} className="border-[2px] border-black bg-gray-50 p-4">
                                            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">
                                                {guide.readTime}
                                            </p>
                                            <h3 className="mt-2 text-base font-black uppercase tracking-tight leading-snug">
                                                {i18n.language.startsWith('zh') ? guide.title.zh : guide.title.en}
                                            </h3>
                                            <p className="mt-2 text-sm text-slate-700 font-medium leading-relaxed">
                                                {i18n.language.startsWith('zh') ? guide.description.zh : guide.description.en}
                                            </p>
                                            <Link to={`/guides/${guide.slug}`} className="mt-3 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:underline">
                                                {i18n.language.startsWith('zh') ? '阅读指南' : 'Read guide'}
                                                <ArrowRight size={14} strokeWidth={3} />
                                            </Link>
                                        </article>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

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
                                        onSelectPrompt={(p: { id: string }) => handleSelectPrompt(p.id)}
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
                            {faqItems.map((item: { q: string; a: string }, idx: number) => (
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

                    <Footer />
                </main>
            </div>
        </>
    );
};

export default CollectionPage;
