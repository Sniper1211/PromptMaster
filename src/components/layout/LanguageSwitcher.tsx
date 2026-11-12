import React from 'react';
import { Languages } from 'lucide-react';
import { useLanguage } from '../../hooks/useLanguage';

interface LanguageSwitcherProps {
    className?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className }) => {
    const { currentLanguage, setLanguage } = useLanguage();

    return (
        <div
            className={`flex items-center border-[2.5px] border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${className ?? ''}`}
            role="group"
            aria-label="Language"
        >
            <Languages size={14} strokeWidth={3} className="ml-2 text-black" aria-hidden="true" />
            {(['zh', 'en'] as const).map((lang) => (
                <button
                    key={lang}
                    type="button"
                    onClick={() => setLanguage(lang)}
                    aria-pressed={currentLanguage === lang}
                    className={`px-2 py-1.5 text-[11px] font-black uppercase tracking-widest transition-colors ${
                        currentLanguage === lang ? 'bg-[#FACC15]' : 'hover:bg-gray-100'
                    }`}
                >
                    {lang === 'zh' ? '中文' : 'EN'}
                </button>
            ))}
        </div>
    );
};

export default LanguageSwitcher;
