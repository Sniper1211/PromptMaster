import React from 'react';
import { ArrowLeft, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEOHead from '../components/seo/SEOHead';
import { CONTACT_EMAIL, SITE_NAME } from '../lib/site';

const TermsOfService: React.FC = () => {
    const { t, i18n } = useTranslation();
    const isZh = i18n.language.startsWith('zh');

    const sections = isZh
        ? [
            {
                title: '1. 接受条款',
                paragraphs: [
                    '当你访问或使用 PentaPrompt，即表示你同意遵守本页面列出的服务条款以及适用法律法规。如果你不同意这些条款，请停止使用本站。',
                    '本站面向公开网络用户提供提示词浏览、检索、详情查看和相关信息页面，不承诺适用于所有业务、地区或专业场景。'
                ]
            },
            {
                title: '2. 内容用途与使用方式',
                paragraphs: [
                    'PentaPrompt 提供的提示词、说明文字、分类结构和专题页面，主要用于信息参考、工作启发和模板复用。你可以将其作为起点进行修改，但应自行判断是否适合你的具体场景。',
                    '如果你把站点内容用于客户项目、商业流程、自动化决策或公开发布，请自行完成必要的事实核验、合规审查和人工复核。'
                ]
            },
            {
                title: '3. 知识产权与站点素材',
                paragraphs: [
                    '除非另有说明，本站的页面设计、品牌标识、站点结构、原创说明文案与整理方式，均属于 PentaPrompt 或其合法权利人。',
                    '你可以合理引用公开页面内容，但不得以误导方式暗示与本站存在官方合作、授权或背书关系。'
                ]
            },
            {
                title: '4. 禁止行为',
                paragraphs: [
                    '你不得利用本站进行违法活动、恶意抓取、破坏站点稳定性、绕过访问限制、批量滥用接口，或将站点内容用于明显欺诈、侵权、骚扰或违规用途。',
                    '如果我们发现影响站点安全、合规或正常运营的行为，有权采取限制访问、记录证据或配合法律义务的措施。'
                ]
            },
            {
                title: '5. 免责声明',
                paragraphs: [
                    '本站内容按“现状”提供。我们会尽量保持信息清晰、页面可用，但不保证所有提示词都适用于你的模型、行业、市场、法律环境或业务结果。',
                    'AI 输出本身具有不确定性，提示词也无法替代专业建议。你应对使用本站内容后的实际结果自行负责。'
                ]
            },
            {
                title: '6. 第三方服务与广告',
                paragraphs: [
                    '本站可能接入第三方托管、统计、广告和其他基础设施服务。这些服务有各自的条款与政策，我们无法对第三方行为作出完全控制。',
                    '站内出现的广告或外部链接，并不当然代表我们对相关产品、服务或观点作出保证或背书。'
                ]
            },
            {
                title: '7. 条款更新与联系',
                paragraphs: [
                    '我们可能根据站点运营、合规要求或产品变化更新本条款。更新后的版本会发布在本页面，并以页面标注日期为准。',
                    `如需就条款、授权、纠错或合作问题联系本站，请发送邮件至 ${CONTACT_EMAIL}。`
                ]
            }
        ]
        : [
            {
                title: '1. Acceptance of Terms',
                paragraphs: [
                    'By accessing or using PentaPrompt, you agree to comply with these Terms of Service and all applicable laws. If you do not agree, please stop using the site.',
                    'PentaPrompt is a public website for browsing prompts, reading detail pages, and discovering categorized prompt resources. We do not guarantee that the site is suitable for every jurisdiction, industry, or professional use case.'
                ]
            },
            {
                title: '2. Content Use',
                paragraphs: [
                    'The prompts, editorial notes, category pages, and collections on PentaPrompt are provided for informational use, workflow inspiration, and template adaptation. You are responsible for deciding whether a given prompt is appropriate for your own project.',
                    'If you use site content in client work, commercial operations, automation flows, or public outputs, you are responsible for verifying facts, checking compliance requirements, and performing human review.'
                ]
            },
            {
                title: '3. Intellectual Property',
                paragraphs: [
                    'Unless otherwise stated, the site design, branding, original editorial text, information architecture, and related materials belong to PentaPrompt or its lawful rights holders.',
                    'You may reasonably reference public content from the site, but you may not imply a false partnership, endorsement, or official affiliation with PentaPrompt.'
                ]
            },
            {
                title: '4. Prohibited Conduct',
                paragraphs: [
                    'You may not use the site for unlawful activity, abusive scraping, attempts to disrupt service stability, bypassing restrictions, or using site content in clearly fraudulent, infringing, harassing, or policy-violating ways.',
                    'If we detect behavior that threatens site safety, compliance, or normal operations, we may restrict access, preserve records, or take other actions required by law or platform obligations.'
                ]
            },
            {
                title: '5. Disclaimer',
                paragraphs: [
                    'The site is provided on an "as is" basis. We aim to keep content useful and pages accessible, but we do not guarantee that every prompt will fit your model, market, industry, legal environment, or intended outcome.',
                    'AI outputs are inherently variable, and prompts do not replace professional advice. You are responsible for how you use any content from the site.'
                ]
            },
            {
                title: '6. Third-Party Services and Ads',
                paragraphs: [
                    'PentaPrompt may rely on third-party hosting, analytics, advertising, and infrastructure providers. Those services operate under their own policies and terms, and we cannot fully control their behavior.',
                    'The presence of an ad or external link on the site does not automatically mean that we endorse the related product, service, or opinion.'
                ]
            },
            {
                title: '7. Updates and Contact',
                paragraphs: [
                    'We may update these Terms of Service to reflect changes in site operations, policy requirements, or product scope. The current version will always be the version published on this page.',
                    `For questions about terms, permissions, corrections, or partnerships, contact us at ${CONTACT_EMAIL}.`
                ]
            }
        ];

    return (
        <>
            <SEOHead
                title={t('seo.termsOfService.title')}
                description={t('seo.termsOfService.description')}
                url="https://pentaprompt.com/terms"
                type="website"
            />
            <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
                <header className="bg-white border-b-[3px] border-black sticky top-0 z-40">
                    <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest hover:text-[#FF4D4D] transition-colors"
                        >
                            <ArrowLeft size={16} strokeWidth={3} />
                            {isZh ? '返回提示词库' : 'Back to Library'}
                        </Link>
                        <h1 className="text-lg font-black uppercase italic tracking-tighter">{SITE_NAME} Terms</h1>
                        <Link
                            to="/contact"
                            className="hidden sm:inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest hover:text-[#FF4D4D] transition-colors"
                        >
                            <Mail size={16} strokeWidth={2.5} />
                            {isZh ? '联系' : 'Contact'}
                        </Link>
                    </div>
                </header>

                <div className="max-w-4xl mx-auto p-6 md:p-12">
                    <div className="bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 md:p-12">
                        <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">
                            {isZh ? '使用规则与法律说明' : 'Usage Rules and Legal Terms'}
                        </p>
                        <h1 className="mt-4 text-4xl md:text-5xl font-black uppercase italic mb-6 tracking-tighter">
                            {isZh ? '服务条款' : 'Terms of Service'}
                        </h1>
                        <p className="text-base md:text-lg text-slate-700 leading-relaxed font-medium">
                            {isZh
                                ? '本页面说明你在使用 PentaPrompt 公开站点内容时需要了解的基本规则、权利边界和免责声明。'
                                : 'This page outlines the basic rules, usage boundaries, and disclaimers that apply when you use PentaPrompt and its public content.'}
                        </p>

                        <p className="mt-6 text-sm font-bold uppercase tracking-widest text-slate-500">
                            {isZh ? '最后更新：2026-07-14' : 'Last updated: 2026-07-14'}
                        </p>

                        <div className="mt-10 space-y-8">
                            {sections.map(section => (
                                <section key={section.title} className="border-t-[3px] border-black pt-6 first:border-t-0 first:pt-0">
                                    <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight">{section.title}</h2>
                                    <div className="mt-4 space-y-4 text-slate-700 font-medium leading-relaxed">
                                        {section.paragraphs.map((paragraph, index) => (
                                            <p key={index}>{paragraph}</p>
                                        ))}
                                    </div>
                                </section>
                            ))}
                        </div>

                        <div className="mt-10 bg-black text-white border-[3px] border-black p-6">
                            <p className="text-xs font-black uppercase tracking-[0.3em] text-white/60">
                                {isZh ? '联系与授权咨询' : 'Contact and Permissions'}
                            </p>
                            <a
                                href={`mailto:${CONTACT_EMAIL}`}
                                className="mt-3 inline-flex items-center gap-2 text-sm md:text-base font-black underline break-all"
                            >
                                <Mail size={16} strokeWidth={2.5} />
                                {CONTACT_EMAIL}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TermsOfService;
