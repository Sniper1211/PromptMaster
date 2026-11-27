import React from 'react';
import Link from '../components/common/LocalizedLink';
import { ArrowLeft, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import SEOHead from '../components/seo/SEOHead';
import SiteHeader from '../components/layout/SiteHeader';
import Footer from '../components/layout/Footer';
import { CONTACT_EMAIL } from '../lib/site';

const CopyrightPage: React.FC = () => {
    const { i18n } = useTranslation();
    const isZh = i18n.language.startsWith('zh');

    const sections = isZh
        ? [
            {
                title: '1. 提示词的权利归属',
                paragraphs: [
                    '提示词文本可能由不同来源创作。PentaPrompt 自己撰写的指南、编辑说明和页面文案由本站编辑创作；从公开平台导入的提示词，其原始权利仍归原作者。我们会尽量标注来源链接和作者信息，不会因为重新整理而声称拥有原作者的权利。'
                ]
            },
            {
                title: '2. 关于真人、品牌与受版权保护的角色',
                paragraphs: [
                    '生图/生视频模型通常限制生成真实人物、受版权保护的角色或品牌标识。本站的提示词库用于教学和创作参考，不鼓励也不提供绕过平台安全机制的方法。若你发现某条提示词主要目的是复制受保护的影视角色或真实人物，请告知我们，我们会复核并改写或下架。'
                ]
            },
            {
                title: '3. 用户提交内容',
                paragraphs: [
                    '如果你通过站内入口提交提示词，视为你确认自己有权分享该内容，并授权本站以展示、编辑和翻译的方式使用它。请勿提交他人的付费内容、未授权转载内容或包含个人隐私的材料。'
                ]
            },
            {
                title: '4. 版权投诉与下架流程',
                paragraphs: [
                    '如果你认为本站内容侵犯了你的版权，请通过下方邮箱发送通知，并尽量包含：(a) 你的姓名与联系方式；(b) 你主张权利的原创作品及链接；(c) 涉嫌侵权内容在本站的 URL；(d) 你的权利声明与善意陈述；(e) 签名（电子签名可）。我们会在核实后移除或调整内容。'
                ]
            },
            {
                title: '5. 反通知',
                paragraphs: [
                    '如果你认为内容被误删，可以发送反通知，说明你有权使用该内容及理由。我们会在符合适用法律的前提下处理，并可能将通知转交对方。'
                ]
            },
            {
                title: '6. 联系方式',
                paragraphs: ['版权、署名或下架相关请求，请联系：']
            }
        ]
        : [
            {
                title: '1. Ownership of prompt text',
                paragraphs: [
                    'Prompt text can come from different sources. Guides, editorial notes and page copy written by PentaPrompt belong to this site’s editor; prompts imported from public platforms remain the property of their original authors. We keep source links and attribution where possible and do not claim ownership of the original author’s work because we reorganised it.'
                ]
            },
            {
                title: '2. Real people, brands and copyrighted characters',
                paragraphs: [
                    'Image and video models commonly restrict real people, copyrighted characters and brand logos. This prompt library is for learning and creative reference and does not encourage or provide methods to bypass platform safety systems. If you believe a prompt mainly exists to replicate a protected film character or a real person, tell us and we will review, rewrite or remove it.'
                ]
            },
            {
                title: '3. User submissions',
                paragraphs: [
                    'If you submit a prompt through the site, you confirm that you have the right to share it and grant the site permission to display, edit and translate it. Do not submit other people’s paid content, unauthorised reposts, or material containing personal or private information.'
                ]
            },
            {
                title: '4. Copyright complaints and takedowns',
                paragraphs: [
                    'If you believe content on this site infringes your copyright, email us a notice that includes: (a) your name and contact details; (b) the original work you claim and a link to it; (c) the URL of the allegedly infringing content; (d) a statement of your rights and good-faith belief; (e) a signature (electronic is acceptable). We will review and remove or adjust the content.'
                ]
            },
            {
                title: '5. Counter-notice',
                paragraphs: [
                    'If you believe content was removed by mistake, you may send a counter-notice explaining why you have the right to use it. We will handle it as required by applicable law and may share the notice with the other party.'
                ]
            },
            {
                title: '6. Contact',
                paragraphs: ['For copyright, attribution or takedown requests, contact:']
            }
        ];

    return (
        <>
            <SEOHead
                title={isZh ? '版权与 DMCA | PentaPrompt' : 'Copyright & DMCA | PentaPrompt'}
                description={isZh ? 'PentaPrompt 的提示词权利说明、真人/品牌/角色政策、用户提交授权与版权下架流程。' : 'Ownership of prompt text, rules for real people and copyrighted characters, user submissions, and the copyright takedown process.'}
                url="https://pentaprompt.com/copyright"
                type="website"
            />
            <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
                <SiteHeader />
                <main className="max-w-4xl mx-auto px-6 py-12">
                    <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-black">
                        <ArrowLeft size={16} /> {isZh ? '返回首页' : 'Back to home'}
                    </Link>
                    <h1 className="mt-6 text-4xl md:text-5xl font-black uppercase italic tracking-tighter">
                        {isZh ? '版权与 DMCA' : 'Copyright & DMCA'}
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
                                {section.title.startsWith('6.') ? (
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

export default CopyrightPage;
