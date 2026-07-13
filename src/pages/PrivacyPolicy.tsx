import React from 'react';
import { ArrowLeft, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEOHead from '../components/seo/SEOHead';
import { CONTACT_EMAIL, SITE_NAME } from '../lib/site';

const PrivacyPolicy: React.FC = () => {
    const { t, i18n } = useTranslation();
    const isZh = i18n.language.startsWith('zh');

    const sections = isZh
        ? [
            {
                title: '1. 适用范围',
                paragraphs: [
                    '本隐私政策适用于 PentaPrompt（以下简称“本站”）在你访问公开网页、浏览提示词内容、点击站内链接，以及与我们联系时涉及的信息处理方式。',
                    '本站目前不提供普通用户注册账户，因此不会像传统 SaaS 一样主动收集大量账号资料。我们更关注基础访问、安全运营、站点优化和必要的广告合规说明。'
                ]
            },
            {
                title: '2. 我们可能接触到哪些信息',
                paragraphs: [
                    '当你访问本站时，服务器、托管平台或第三方分析与广告服务可能会处理一些基础技术信息，例如设备类型、浏览器信息、访问页面、来源地址、IP 地址的近似区域、访问时间和交互行为。',
                    '如果你通过公开邮箱联系我们，我们会收到你在邮件中主动提供的姓名、邮箱地址、正文内容及附件。这些信息仅用于处理你的咨询、纠错、合作或合规请求。'
                ]
            },
            {
                title: '3. 我们如何使用这些信息',
                paragraphs: [
                    '这些信息主要用于站点运行、故障排查、内容改进、流量分析、反滥用处理，以及在符合政策要求的前提下展示广告。',
                    '如果你发送邮件给我们，我们会使用你的联系方式来回复问题、核实请求、处理更正，或跟进与你的邮件主题直接相关的事项。'
                ]
            },
            {
                title: '4. Cookie 与第三方服务',
                paragraphs: [
                    '本站可能使用由第三方服务提供的 Cookie 或类似技术，以支持流量分析、性能测量和广告投放。第三方供应商（包括 Google）可能基于你此前访问本站或其他网站的记录展示相关广告。',
                    '你可以访问 Google 的 Ads Settings 管理个性化广告偏好，也可以通过浏览器设置限制或清除 Cookie。某些调整可能影响站点的部分体验或广告相关功能。'
                ]
            },
            {
                title: '5. 广告与 AdSense',
                paragraphs: [
                    'PentaPrompt 使用 Google AdSense 作为广告服务提供方。Google 及其合作伙伴可能出于广告投放、频次控制、效果统计等目的处理部分设备或交互数据。',
                    '本站的 AdSense 发布商标识为 ca-pub-9245714228354292。关于 Google 如何使用合作网站信息，可参考 Google 的 partner sites 说明。'
                ]
            },
            {
                title: '6. 数据保留与安全',
                paragraphs: [
                    '我们会在实现前述目的所必需的范围内保留相关信息。例如，商务沟通、纠错记录或合规请求邮件，可能在合理期限内保留，以便后续核验和继续处理。',
                    '我们会尽力采用合理措施保护站点和通信信息，但互联网传输与第三方服务本身并不能保证绝对安全，因此请避免在邮件中发送不必要的敏感信息。'
                ]
            },
            {
                title: '7. 你的选择与联系我们',
                paragraphs: [
                    '如果你对本隐私政策、站点数据处理方式、广告说明，或你通过邮件提交的请求有疑问，可以通过下方邮箱联系我们。',
                    `联系邮箱：${CONTACT_EMAIL}`
                ]
            }
        ]
        : [
            {
                title: '1. Scope',
                paragraphs: [
                    'This Privacy Policy applies to PentaPrompt when you visit our public pages, browse prompt content, click internal links, or contact us directly.',
                    'PentaPrompt does not currently offer standard user account registration, so we do not collect the same volume of account data that a typical SaaS product would. Our data handling is mainly related to site operations, analytics, safety, and advertising compliance.'
                ]
            },
            {
                title: '2. Information We May Receive',
                paragraphs: [
                    'When you visit the site, our hosting providers, server logs, analytics tools, or advertising partners may process basic technical information such as browser type, device type, page views, referral source, approximate region derived from IP, timestamps, and interaction signals.',
                    'If you email us, we receive the information you choose to include, such as your name, email address, message body, and any attachments. We use that information only to respond to the issue you raised.'
                ]
            },
            {
                title: '3. How We Use Information',
                paragraphs: [
                    'We use information to keep the site running, diagnose technical issues, improve prompt pages, understand aggregate traffic patterns, prevent abuse, and operate advertising in line with platform policies.',
                    'If you contact us by email, we use your message and contact details to respond, verify requests, address corrections, or continue the conversation that you initiated.'
                ]
            },
            {
                title: '4. Cookies and Third-Party Services',
                paragraphs: [
                    'The site may use cookies or similar technologies provided by third-party services for analytics, performance measurement, and advertising. Third-party vendors, including Google, may use cookies to show ads based on prior visits to this site or other websites.',
                    'You can manage personalized advertising preferences through Google Ads Settings, and you can also control cookies through your browser. Limiting cookies may affect some functionality or ad-related behavior.'
                ]
            },
            {
                title: '5. Advertising and AdSense',
                paragraphs: [
                    'PentaPrompt uses Google AdSense as an advertising provider. Google and its partners may process limited device or interaction data for ad delivery, frequency management, and reporting.',
                    'Our AdSense publisher identifier is ca-pub-9245714228354292. You can learn more about how Google uses information from partner sites in Google’s partner sites policy.'
                ]
            },
            {
                title: '6. Retention and Security',
                paragraphs: [
                    'We keep information only for as long as it is reasonably necessary for the purposes described above. For example, business inquiries, correction requests, or compliance-related emails may be retained for a reasonable period so we can continue handling them.',
                    'We take reasonable measures to protect the site and the information we receive, but no internet transmission or third-party service can guarantee absolute security. Please do not send unnecessary sensitive information by email.'
                ]
            },
            {
                title: '7. Contact',
                paragraphs: [
                    'If you have questions about this Privacy Policy, how the site handles data, or how we respond to email requests, contact us at the address below.',
                    `Contact email: ${CONTACT_EMAIL}`
                ]
            }
        ];

    return (
        <>
            <SEOHead
                title={t('seo.privacyPolicy.title')}
                description={t('seo.privacyPolicy.description')}
                url="https://pentaprompt.com/privacy"
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
                        <h1 className="text-lg font-black uppercase italic tracking-tighter">{SITE_NAME} Privacy</h1>
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
                            {isZh ? '隐私与数据说明' : 'Privacy and Data Notice'}
                        </p>
                        <h1 className="mt-4 text-4xl md:text-5xl font-black uppercase italic mb-6 tracking-tighter">
                            {isZh ? '隐私政策' : 'Privacy Policy'}
                        </h1>
                        <p className="text-base md:text-lg text-slate-700 leading-relaxed font-medium">
                            {isZh
                                ? '本页面说明 PentaPrompt 在公开站点运营中如何处理访问数据、联系信息、Cookie 与广告相关信息。'
                                : 'This page explains how PentaPrompt handles site access data, email communications, cookies, and advertising-related information on our public website.'}
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
                                {isZh ? '公开联系邮箱' : 'Public Contact Email'}
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

export default PrivacyPolicy;
