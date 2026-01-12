import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, Construction } from 'lucide-react';

interface ComingSoonModalProps {
    onClose: () => void;
}

const ComingSoonModal: React.FC<ComingSoonModalProps> = ({ onClose }) => {
    const { t } = useTranslation();

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white border-[3px] border-black max-w-md w-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b-[3px] border-black flex items-center justify-between bg-[#FACC15]">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-black text-white shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                            <Construction size={24} strokeWidth={2.5} />
                        </div>
                        <h2 className="text-xl font-black uppercase italic tracking-tighter">
                            {t('common.comingSoon.title')}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-black hover:text-white transition-colors border-[2.5px] border-black bg-white"
                    >
                        <X size={20} strokeWidth={3} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 text-center space-y-6">
                    <p className="font-bold text-xl text-slate-900">
                        {t('common.comingSoon.description')}
                    </p>
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-black text-white font-black uppercase tracking-widest hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-[4px_4px_0px_0px_rgba(100,100,100,1)] transition-all"
                    >
                        {t('modal.close')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ComingSoonModal;
