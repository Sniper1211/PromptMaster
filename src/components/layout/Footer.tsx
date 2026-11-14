import React, { useEffect, useState } from 'react';
import Link from '../common/LocalizedLink';

import { useTranslation } from 'react-i18next';
import { Layers } from 'lucide-react';

interface FooterProps {
    onContribute?: () => void;
}

// Cached library stats: the footer appears on several pages, so fetch once per session.
let libraryStatsPromise: Promise<{ total: number } | null> | null = null;
const fetchLibraryStats = () => {
    if (!libraryStatsPromise) {
        libraryStatsPromise = fetch('/api/prompts?summary=categories')
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                const counts = data?.counts ?? data;
                if (!counts || typeof counts !== 'object') return null;
                const total = Object.values(counts).reduce(
                    (sum: number, value) => sum + (typeof value === 'number' ? value : 0),
                    0
                );
                return total > 0 ? { total } : null;
            })
            .catch(() => null);
    }
    return libraryStatsPromise;
};

const Footer: React.FC<FooterProps> = ({ onContribute }) => {
    const { t, i18n } = useTranslation();
    const guidesLabel = i18n.language.startsWith('zh') ? '指南' : 'Guides';
    const [stats, setStats] = useState<{ total: number } | null>(null);

    useEffect(() => {
        let mounted = true;
        fetchLibraryStats().then((result) => {
            if (mounted && result) setStats(result);
        });
        return () => {
            mounted = false;
        };
    }, []);

    return (
        <footer className="mt-24 border-t-[3px] border-black bg-white">
            <div className="flex flex-col md:flex-row">
                {/* Stats Section — real numbers only, no invented social proof */}
                <div className="flex-1 flex border-b-[3px] md:border-b-0 md:border-r-[3px] border-black divide-x-[3px] divide-black">
                    <div className="flex-1 p-8 flex flex-col items-center justify-center hover:bg-[#FACC15] transition-colors group">
                        <p className="text-4xl font-black text-black mb-1 group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-transform">
                            {stats ? stats.total : '—'}
                        </p>
                        <p className="text-xs font-black uppercase tracking-widest">{t('footer.curatedPrompts')}</p>
                    </div>
                    <div className="flex-1 p-8 flex flex-col items-center justify-center hover:bg-[#2DD4BF] transition-colors group">
                        <p className="text-4xl font-black text-black mb-1 group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-transform">2</p>
                        <p className="text-xs font-black uppercase tracking-widest">{t('footer.languages')}</p>
                    </div>
                </div>

                {/* Call to Action Section */}
                <div
                    onClick={onContribute}
                    className="flex-1 p-8 flex items-center justify-center bg-gray-50 hover:bg-[#FF4D4D] transition-colors group cursor-pointer"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white border-[2.5px] border-black rounded-none brutal-shadow group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-none transition-all">
                            <Layers className="text-black" size={24} strokeWidth={2.5} />
                        </div>
                        <div className="text-black">
                            <p className="text-lg font-black uppercase tracking-tight">{t('footer.openLibrary')}</p>
                            <p className="text-xs font-bold opacity-60 group-hover:opacity-100">{t('footer.contribute')}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright / Brand */}
            <div className="border-t-[3px] border-black p-4 bg-black text-white flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em]">PentaPrompt © 2026 • DESIGNED FOR BUILDERS</p>
                <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    <Link to="/guides" className="hover:text-white transition-colors">{guidesLabel}</Link>
                    <Link to="/about" className="hover:text-white transition-colors">{t('footer.about')}</Link>
                    <Link to="/contact" className="hover:text-white transition-colors">{t('footer.contact')}</Link>
                    <Link to="/privacy" className="hover:text-white transition-colors">{t('footer.privacyPolicy')}</Link>
                    <Link to="/terms" className="hover:text-white transition-colors">{t('footer.termsOfService')}</Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
