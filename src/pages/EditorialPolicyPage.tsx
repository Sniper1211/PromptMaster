import React from 'react';
import Link from '../components/common/LocalizedLink';
import { ArrowLeft, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SEOHead from '../components/seo/SEOHead';
import SiteHeader from '../components/layout/SiteHeader';
import Footer from '../components/layout/Footer';
import { CONTACT_EMAIL } from '../lib/site';

const EditorialPolicyPage: React.FC = () => {
    const { i18n } = useTranslation();
    const isZh = i18n.language.startsWith('zh');

    const sections = isZh
        ? [
            {
                title: '1. 这份编辑政策适用于什么',
                paragraphs: [
                    'PentaPrompt 是一个面向创作者、营销和开发者的提示词库与指南站点。我们整理、编辑并解释提示词的使用方法，而不是简单聚合链接。本页说明我们如何选择内容、如何标注来源，以及如何处理纠错与更新。'
                ]
            },
            {
                title: '2. 我们如何筛选和编辑提示词',
                paragraphs: [
                    '每条提示词在入库前都会经过基本检查：内容是否完整、是否能在主流模型上复现、描述和使用说明是否清晰、是否包含明显不合适的真人或侵权内容。对于导入的提示词，我们会保留原始来源链接，并把英文原文与中文说明分开呈现。',
                    '分类页和详情页的编辑说明由站长撰写，目的是解释这类提示词适合什么任务、应该关注哪些参数，以及如何做变量替换和迭代。'
                ]
            },
            {
                title: '3. 原创内容、导入内容与来源标注',
                paragraphs: [
                    '站内既有我们撰写的指南和编辑说明，也有从公开社交平台导入并重新整理的提示词。导入内容会尽量标注来源；原作者的署名和链接不会因为整理而被移除。如果你认为某条内容不应出现在这里，请通过下方邮箱联系我们。'
                ]
            },
            {
                title: '4. AI 辅助翻译说明',
                paragraphs: [
                    '部分中文内容由 AI 辅助翻译，再由编辑抽查和调整。机器翻译可能有语气或术语偏差，遇到不自然的表述，欢迎邮件指出，我们会修正。提示词正文中的模型名、参数和占位符会尽量保持原样。'
                ]
            },
            {
                title: '5. 审阅、更新与纠错',
                paragraphs: [
                    '提示词会随模型版本变化而失效。我们会对重点内容做定期复查，也欢迎用户反馈“这个提示词在某个模型上不工作”或“描述有误”。收到可复现的反馈后，我们会更新或标注内容。'
                ]
            },
            {
                title: '6. 广告与编辑独立性',
                paragraphs: [
                    '本站通过 Google AdSense 展示广告。广告位不影响编辑判断，我们不会因为广告合作而改变提示词评价或文章结论。广告相关政策见隐私政策与条款页面。'
                ]
            },
            {
                title: '7. 联系我们',
                paragraphs: ['对编辑流程、内容收录或纠错有疑问，请联系：']
            }
        ]
        : [
            {
                title: '1. What this policy covers',
                paragraphs: [
                    'PentaPrompt is a prompt library and guide site for creators, marketers and developers. We curate, edit and explain how prompts are used rather than merely aggregating links. This page explains how we select content, how we attribute sources, and how corrections and updates are handled.'
                ]
            },
            {
                title: '2. How prompts are selected and edited',
                paragraphs: [
                    'Every prompt gets a basic review before it is published: is the text complete, does it reproduce on mainstream models, are the description and usage notes clear, and does it contain obvious likeness or copyright problems? For imported prompts we keep the original source link and present the original text separately from our editorial notes.',
                    'Category and detail-page notes are written by the editor to explain what kinds of tasks a prompt suits, which parameters matter, and how to substitute variables and iterate.'
                ]
            },
            {
                title: '3. Original content, imported content and attribution',
                paragraphs: [
                    'The site contains both original guides and editorial notes and prompts imported from public social platforms and reorganised. Imported content keeps its source link where possible, and original creator attribution is not removed during editing. If you believe content should not appear here, contact us at the address below.'
                ]
            },
            {
                title: '4. AI-assisted translation',
                paragraphs: [
                    'Some Chinese copy is AI-assisted and then reviewed and adjusted by the editor. Machine translation can have tone or terminology errors; if something reads unnaturally, email us and we will fix it. Model names, parameters and placeholders in prompt bodies are kept as-is where possible.'
                ]
            },
            {
                title: '5. Review, updates and corrections',
                paragraphs: [
                    'Prompts can stop working when models change. We periodically review important entries and welcome reports that a prompt no longer works on a given model or that a description is wrong. When we can reproduce the issue, we update the content or add a note.'
                ]
            },
            {
                title: '6. Advertising and editorial independence',
                paragraphs: [
                    'The site displays ads through Google AdSense. Ad placements do not change editorial judgement, and we do not alter prompt reviews or article conclusions because of an advertising relationship. Advertising-related policies are described in the Privacy Policy and Terms pages.'
                ]
            },
            {
                title: '7. Contact',
                paragraphs: ['For questions about the editorial process, inclusion or corrections, contact:']
            }
        ];

    return (
        <>
            <SEOHead
                title={isZh ? '编辑政策 | PentaPrompt' : 'Editorial Policy | PentaPrompt'}
                description={isZh ? 'PentaPrompt 的内容筛选、编辑、来源标注、AI 翻译说明与纠错流程。' : 'How PentaPrompt selects, edits, attributes and corrects prompt content, including AI-assisted translation disclosures.'}
                url="https://pentaprompt.com/editorial-policy"
                type="website"
            />
            <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
                <SiteHeader />
                <main className="max-w-4xl mx-auto px-6 py-12">
                    <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-black">
                        <ArrowLeft size={16} /> {isZh ? '返回首页' : 'Back to home'}
                    </Link>
                    <h1 className="mt-6 text-4xl md:text-5xl font-black uppercase italic tracking-tighter">
                        {isZh ? '编辑政策' : 'Editorial Policy'}
                    </h1>
                    <p className="mt-4 text-slate-600 font-medium">
                        {isZh ? '最后更新：2026 年 11 月' : 'Last updated: November 2026'}
                    </p>
                    <div className="mt-8 space-y-8">
                        {sections.map((section) => (
                            <section key={section.title} className="bg-white border-[3px] border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                                <h2 className="text-xl font-black">{section.title}</h2>
                                {section.paragraphs.map((paragraph, index) => (
                                    <p key={index} className="mt-3 text-slate-700 font-medium leading-relaxed">
                                        {paragraph}
                                    </p>
                                ))}
                                {section.title.startsWith('7.') || section.title.startsWith('7') ? (
                                    <a href={`mailto:${CONTACT_EMAIL}`} className="mt-3 inline-flex items-center gap-2 font-black text-[#0f766e]">
                                        <Mail size={16} /> {CONTACT_EMAIL}
                                    </a>
                                ) : null}
                            </section>
                        ))}
                    </div>
                </main>
                <Footer />
            </div>
        </>
    );
};

export default EditorialPolicyPage;
