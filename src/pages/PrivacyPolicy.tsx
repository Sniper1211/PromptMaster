import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
    return (
        <>
            <Helmet>
                <title>Privacy Policy - PromptMaster</title>
            </Helmet>
            <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans">
                <div className="max-w-3xl mx-auto bg-white brutal-border brutal-shadow p-8">
                    <Link to="/" className="flex items-center gap-2 font-black uppercase tracking-tight hover:-translate-x-1 transition-transform mb-8 w-fit">
                        <ArrowLeft size={20} strokeWidth={3} />
                        <span>Back to Home</span>
                    </Link>

                    <h1 className="text-3xl font-black uppercase italic mb-6">Privacy Policy</h1>

                    <div className="prose prose-slate max-w-none">
                        <p>Last updated: January 11, 2024</p>

                        <h3>1. Introduction</h3>
                        <p>Welcome to PromptMaster. We respect your privacy and are committed to protecting your personal data.</p>

                        <h3>2. Data We Collect</h3>
                        <p>We do not collect personal data directly. However, we use third-party services like Google AdSense that may use cookies to serve ads based on prior visits to our website.</p>

                        <h3>3. Cookies</h3>
                        <p>Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to your website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to your users based on their visit to your sites and/or other sites on the Internet.</p>
                        <p>Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="nofollow">Ads Settings</a>.</p>

                        <h3>4. Contact Us</h3>
                        <p>If you have any questions about this Privacy Policy, please contact us.</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PrivacyPolicy;
