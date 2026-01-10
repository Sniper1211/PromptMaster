import React from 'react';
import { useTranslation } from 'react-i18next';
import { Layers } from 'lucide-react';

const Footer: React.FC = () => {
    const { t } = useTranslation();

    return (
        <footer className="mt-24 border-t-[3px] border-black bg-white">
            <div className="flex flex-col md:flex-row">
                {/* Stats Section */}
                <div className="flex-1 flex border-b-[3px] md:border-b-0 md:border-r-[3px] border-black divide-x-[3px] divide-black">
                    <div className="flex-1 p-8 flex flex-col items-center justify-center hover:bg-[#FACC15] transition-colors group">
                        <p className="text-4xl font-black text-black mb-1 group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-transform">2.4k+</p>
                        <p className="text-xs font-black uppercase tracking-widest">{t('footer.curatedPrompts')}</p>
                    </div>
                    <div className="flex-1 p-8 flex flex-col items-center justify-center hover:bg-[#2DD4BF] transition-colors group">
                        <p className="text-4xl font-black text-black mb-1 group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-transform">15k+</p>
                        <p className="text-xs font-black uppercase tracking-widest">{t('footer.communityUses')}</p>
                    </div>
                </div>

                {/* Call to Action Section */}
                <div className="flex-1 p-8 flex items-center justify-center bg-gray-50 hover:bg-[#FF4D4D] transition-colors group cursor-pointer">
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
            <div className="border-t-[3px] border-black p-4 bg-black text-white text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em]">PromptMaster © 2026 • DESIGNED FOR BUILDERS</p>
            </div>
        </footer>
    );
};

export default Footer;
