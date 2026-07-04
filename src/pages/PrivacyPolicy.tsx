import React from 'react';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEOHead from '../components/seo/SEOHead';

const PrivacyPolicy: React.FC = () => {
    const { t } = useTranslation();

    return (
        <>
            <SEOHead
                title={t('seo.privacyPolicy.title')}
                description={t('seo.privacyPolicy.description')}
                url="https://pentaprompt.com/privacy"
                type="website"
            />
            <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
                {/* Header with Close Button */}
                <header className="bg-white border-b-[3px] border-black sticky top-0 z-40">
                    <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                        <h1 className="text-lg font-black uppercase italic tracking-tighter">PentaPrompt Privacy</h1>
                        <Link
                            to="/"
                            className="flex items-center justify-center w-9 h-9 bg-white border-[2.5px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex-shrink-0"
                            aria-label="Close"
                        >
                            <X size={20} strokeWidth={3} />
                        </Link>
                    </div>
                </header>

                <div className="max-w-4xl mx-auto p-6 md:p-12">
                    <div className="bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 md:p-12">
                        <h1 className="text-4xl md:text-5xl font-black uppercase italic mb-8 tracking-tighter">Privacy Policy</h1>
                        
                        <div className="prose prose-lg prose-slate max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-wide prose-p:font-medium prose-p:leading-relaxed prose-a:font-bold prose-a:text-black prose-a:decoration-[3px] prose-a:decoration-[#FACC15] hover:prose-a:bg-[#FACC15] prose-a:transition-colors">
                            <p className="text-xl font-bold mb-8">Last updated: July 5, 2026</p>

                            <h3>1. Introduction</h3>
                            <p>Welcome to PentaPrompt. We respect your privacy and are committed to protecting your personal data.</p>

                            <h3>2. Data We Collect</h3>
                            <p>We do not collect personal data directly through account registration. However, we use third-party services such as Google Analytics and Google AdSense, which may collect device, browser, referral, and interaction data to measure traffic and serve ads.</p>

                            <h3>3. Cookies</h3>
                            <p>Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to your website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to your users based on their visit to your sites and/or other sites on the Internet.</p>
                            <p>Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="nofollow">Ads Settings</a>.</p>

                            <h3>4. Advertising</h3>
                            <p>PentaPrompt displays advertising provided by Google AdSense. These ads may be personalized based on your browsing behavior, general location, and device information. Google may also work with partner networks to improve ad relevance and measure performance.</p>
                            <p>Our advertising publisher identifier is <strong>ca-pub-9245714228354292</strong>. You can learn more about how Google uses information from partner sites in the <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="nofollow">Google partner sites policy</a>.</p>

                            <h3>5. Contact Us</h3>
                            <p>If you have any questions about this Privacy Policy, please contact us.</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PrivacyPolicy;
