import React from 'react';
import { useTranslation } from 'react-i18next';
import { Search, X } from 'lucide-react';

interface HeroProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}

const Hero: React.FC<HeroProps> = ({ searchQuery, setSearchQuery }) => {
    const { t } = useTranslation();

    return (
        <section className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="min-h-[160px] md:min-h-[200px] flex items-center justify-center mb-6">
                <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent leading-tight" dangerouslySetInnerHTML={{ __html: t('hero.title') }} />
            </div>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed min-h-[3.5rem] flex items-center justify-center">
                {t('hero.subtitle')}
            </p>

            <div className="max-w-2xl mx-auto relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative flex items-center glass rounded-2xl p-2 pl-6">
                    <Search className="text-slate-500 mr-4 shrink-0" size={20} />
                    <input
                        type="text"
                        placeholder={t('hero.searchPlaceholder')}
                        className="bg-transparent border-none outline-none text-white w-full py-2 placeholder:text-slate-600"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="p-1.5 hover:bg-white/10 rounded-full mr-2 text-slate-500 hover:text-white transition-colors"
                            aria-label="Clear search"
                        >
                            <X size={16} />
                        </button>
                    )}
                    <button className="px-6 py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-indigo-50 transition-colors ml-2 whitespace-nowrap hidden sm:block">
                        {t('hero.searchButton')}
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Hero;
