import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsOfService: React.FC = () => {
    return (
        <>
            <Helmet>
                <title>Terms of Service - PromptMaster</title>
            </Helmet>
            <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans">
                <div className="max-w-3xl mx-auto bg-white brutal-border brutal-shadow p-8">
                    <Link to="/" className="flex items-center gap-2 font-black uppercase tracking-tight hover:-translate-x-1 transition-transform mb-8 w-fit">
                        <ArrowLeft size={20} strokeWidth={3} />
                        <span>Back to Home</span>
                    </Link>

                    <h1 className="text-3xl font-black uppercase italic mb-6">Terms of Service</h1>

                    <div className="prose prose-slate max-w-none">
                        <h3>1. Agreement to Terms</h3>
                        <p>By accessing our website, you agree to be bound by these Terms of Service and to comply with all applicable laws and regulations.</p>

                        <h3>2. Intellectual Property</h3>
                        <p>The content, organization, graphics, design, and other matters related to the Site are protected under applicable copyrights and other proprietary laws.</p>

                        <h3>3. Use License</h3>
                        <p>Permission is granted to temporarily download one copy of the materials (information or software) on PromptMaster's website for personal, non-commercial transitory viewing only.</p>

                        <h3>4. Disclaimer</h3>
                        <p>The materials on PromptMaster's website are provided on an 'as is' basis. PromptMaster makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TermsOfService;
