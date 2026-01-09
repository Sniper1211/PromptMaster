import React from 'react';
import { useTranslation } from 'react-i18next';
import { Layers } from 'lucide-react';

const Footer: React.FC = () => {
    const { t } = useTranslation();

    return (
        <footer className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-12">
                <div className="text-center md:text-left min-w-[160px]">
                    <p className="text-3xl font-bold text-white mb-1">2.4k+</p>
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">{t('footer.curatedPrompts')}</p>
                </div>
                <div className="text-center md:text-left min-w-[160px]">
                    <p className="text-3xl font-bold text-white mb-1">15k+</p>
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">{t('footer.communityUses')}</p>
                </div>
            </div>
            <div className="flex gap-4">
                <div className="glass px-6 py-4 rounded-2xl flex items-center gap-3 min-w-[280px]">
                    <Layers className="text-indigo-400" size={20} />
                    <div>
                        <p className="text-sm font-bold">{t('footer.openLibrary')}</p>
                        <p className="text-xs text-slate-500">{t('footer.contribute')}</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
