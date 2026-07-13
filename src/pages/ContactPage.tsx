import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Mail, Clock3, FileText } from 'lucide-react';
import SEOHead from '../components/seo/SEOHead';
import { CONTACT_EMAIL, SITE_NAME } from '../lib/site';

const ContactPage: React.FC = () => {
    const { t } = useTranslation();

    return (
        <>
            <SEOHead
                title={t('seo.contact.title')}
                description={t('seo.contact.description')}
                url="https://pentaprompt.com/contact"
                type="website"
            />

            <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
                <header className="bg-white border-b-[3px] border-black sticky top-0 z-40">
                    <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest hover:text-[#FF4D4D] transition-colors"
                        >
                            <ArrowLeft size={16} strokeWidth={3} />
                            {t('contact.backToLibrary')}
                        </Link>
                        <span className="text-sm font-black uppercase tracking-widest">{SITE_NAME}</span>
                    </div>
                </header>

                <main className="max-w-4xl mx-auto px-6 py-12 space-y-8">
                    <section className="bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 md:p-10">
                        <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">{t('contact.kicker')}</p>
                        <h1 className="mt-4 text-4xl md:text-5xl font-black uppercase italic tracking-tighter">
                            {t('contact.title')}
                        </h1>
                        <p className="mt-6 text-lg text-slate-700 leading-relaxed font-medium">
                            {t('contact.intro')}
                        </p>
                    </section>

                    <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="bg-white border-[3px] border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                            <Mail size={22} strokeWidth={2.5} />
                            <h2 className="mt-4 text-lg font-black uppercase tracking-tight">{t('contact.cards.email.title')}</h2>
                            <a href={`mailto:${CONTACT_EMAIL}`} className="mt-3 block text-sm font-bold underline break-all">
                                {CONTACT_EMAIL}
                            </a>
                        </div>
                        <div className="bg-[#FACC15] border-[3px] border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                            <Clock3 size={22} strokeWidth={2.5} />
                            <h2 className="mt-4 text-lg font-black uppercase tracking-tight">{t('contact.cards.response.title')}</h2>
                            <p className="mt-3 text-sm font-medium leading-relaxed">{t('contact.cards.response.desc')}</p>
                        </div>
                        <div className="bg-[#E0F2FE] border-[3px] border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                            <FileText size={22} strokeWidth={2.5} />
                            <h2 className="mt-4 text-lg font-black uppercase tracking-tight">{t('contact.cards.scope.title')}</h2>
                            <p className="mt-3 text-sm font-medium leading-relaxed">{t('contact.cards.scope.desc')}</p>
                        </div>
                    </section>

                    <section className="bg-white border-[3px] border-black p-8 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                        <h2 className="text-2xl font-black uppercase tracking-tight">{t('contact.bestWay.title')}</h2>
                        <div className="mt-6 space-y-4 text-slate-700 font-medium leading-relaxed">
                            <p>{t('contact.bestWay.p1')}</p>
                            <p>{t('contact.bestWay.p2')}</p>
                            <p>{t('contact.bestWay.p3')}</p>
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
};

export default ContactPage;
