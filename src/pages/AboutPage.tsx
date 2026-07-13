import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Mail, ShieldCheck, Sparkles } from 'lucide-react';
import SEOHead from '../components/seo/SEOHead';
import { CONTACT_EMAIL, SITE_NAME } from '../lib/site';

const AboutPage: React.FC = () => {
    const { t } = useTranslation();

    return (
        <>
            <SEOHead
                title={t('seo.about.title')}
                description={t('seo.about.description')}
                url="https://pentaprompt.com/about"
                type="website"
            />

            <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
                <header className="bg-white border-b-[3px] border-black sticky top-0 z-40">
                    <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest hover:text-[#FF4D4D] transition-colors"
                        >
                            <ArrowLeft size={16} strokeWidth={3} />
                            {t('about.backToLibrary')}
                        </Link>
                        <span className="text-sm font-black uppercase tracking-widest">{SITE_NAME}</span>
                    </div>
                </header>

                <main className="max-w-5xl mx-auto px-6 py-12 space-y-8">
                    <section className="bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 md:p-10">
                        <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">{t('about.kicker')}</p>
                        <h1 className="mt-4 text-4xl md:text-5xl font-black uppercase italic tracking-tighter">
                            {t('about.title')}
                        </h1>
                        <p className="mt-6 text-lg text-slate-700 leading-relaxed font-medium">
                            {t('about.intro')}
                        </p>
                    </section>

                    <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="bg-[#FACC15] border-[3px] border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                            <Sparkles size={22} strokeWidth={2.5} />
                            <h2 className="mt-4 text-lg font-black uppercase tracking-tight">{t('about.cards.curated.title')}</h2>
                            <p className="mt-3 text-sm font-medium leading-relaxed">{t('about.cards.curated.desc')}</p>
                        </div>
                        <div className="bg-white border-[3px] border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                            <ShieldCheck size={22} strokeWidth={2.5} />
                            <h2 className="mt-4 text-lg font-black uppercase tracking-tight">{t('about.cards.trust.title')}</h2>
                            <p className="mt-3 text-sm font-medium leading-relaxed">{t('about.cards.trust.desc')}</p>
                        </div>
                        <div className="bg-[#E0F2FE] border-[3px] border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                            <Mail size={22} strokeWidth={2.5} />
                            <h2 className="mt-4 text-lg font-black uppercase tracking-tight">{t('about.cards.contact.title')}</h2>
                            <p className="mt-3 text-sm font-medium leading-relaxed">{t('about.cards.contact.desc')}</p>
                        </div>
                    </section>

                    <section className="bg-white border-[3px] border-black p-8 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                        <h2 className="text-2xl font-black uppercase tracking-tight">{t('about.howWeWork.title')}</h2>
                        <div className="mt-6 space-y-5 text-slate-700 font-medium leading-relaxed">
                            <p>{t('about.howWeWork.p1')}</p>
                            <p>{t('about.howWeWork.p2')}</p>
                            <p>{t('about.howWeWork.p3')}</p>
                        </div>
                    </section>

                    <section className="bg-black text-white border-[3px] border-black p-8 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                        <h2 className="text-2xl font-black uppercase tracking-tight">{t('about.contactBlock.title')}</h2>
                        <p className="mt-4 text-white/80 font-medium leading-relaxed">{t('about.contactBlock.desc')}</p>
                        <a
                            href={`mailto:${CONTACT_EMAIL}`}
                            className="mt-6 inline-flex items-center gap-2 bg-white text-black px-5 py-3 border-[3px] border-white font-black uppercase tracking-widest text-sm hover:bg-[#FACC15] hover:border-[#FACC15] transition-colors"
                        >
                            <Mail size={16} strokeWidth={2.5} />
                            {CONTACT_EMAIL}
                        </a>
                    </section>
                </main>
            </div>
        </>
    );
};

export default AboutPage;
