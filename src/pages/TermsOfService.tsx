import React from 'react';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEOHead from '../components/seo/SEOHead';

const TermsOfService: React.FC = () => {
    const { t } = useTranslation();

    return (
        <>
            <SEOHead
                title={t('seo.termsOfService.title')}
                description={t('seo.termsOfService.description')}
                url="https://pentaprompt.com/terms"
                type="website"
            />
            <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
                {/* Header with Close Button */}
                <header className="bg-white border-b-[3px] border-black sticky top-0 z-40">
                    <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                        <h1 className="text-lg font-black uppercase italic tracking-tighter">PentaPrompt Terms</h1>
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
                        <h1 className="text-4xl md:text-5xl font-black uppercase italic mb-8 tracking-tighter">Terms of Service</h1>

                        <div className="prose prose-lg prose-slate max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-wide prose-p:font-medium prose-p:leading-relaxed">
                            <h3>1. Agreement to Terms</h3>
                            <p>By accessing our website, you agree to be bound by these Terms of Service and to comply with all applicable laws and regulations.</p>

                            <h3>2. Intellectual Property</h3>
                            <p>The content, organization, graphics, design, and other matters related to the Site are protected under applicable copyrights and other proprietary laws.</p>

                            <h3>3. Use License</h3>
                            <p>Permission is granted to temporarily download one copy of the materials (information or software) on PentaPrompt's website for personal, non-commercial transitory viewing only.</p>

                            <h3>4. Disclaimer</h3>
                            <p>The materials on PentaPrompt's website are provided on an 'as is' basis. PentaPrompt makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TermsOfService;
