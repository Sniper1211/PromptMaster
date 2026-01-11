import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    LayoutGrid,
    Search,
    ArrowUpDown,
    Clock,
    Shuffle,
    Users,
    BookOpen,
    Globe,
    Plus
} from 'lucide-react';
import { Category } from '../../types';

interface SidebarProps {
    activeCategory: Category;
    setActiveCategory: (category: Category) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    toggleLanguage: () => void;
    currentLanguage: string;
}

const Sidebar: React.FC<SidebarProps> = ({
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    toggleLanguage,
    currentLanguage
}) => {
    const { t } = useTranslation();

    const categories = Object.values(Category);

    return (
        <aside className="w-64 border-r-[3px] border-black bg-white flex flex-col h-screen shrink-0 relative">
            {/* Brand */}
            <div className="p-6 border-b-[3px] border-black hover:bg-[#FACC15] transition-colors group cursor-pointer">
                <h1 className="text-2xl font-black uppercase tracking-tighter group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-transform">PentaPrompt</h1>
            </div>

            {/* Search */}
            <div className="p-4 px-6 border-b-[3px] border-black bg-white">
                <div className="relative group">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t('hero.searchPlaceholder')}
                        className="w-full pl-10 pr-4 py-2 border-[2.5px] border-black rounded-none focus:outline-none focus:ring-0 placeholder:text-slate-400 font-bold bg-white focus:bg-gray-50 transition-all focus:shadow-[inset_3px_3px_0px_0px_rgba(0,0,0,0.1)]"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black" size={18} strokeWidth={3} />
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 py-6 px-4 space-y-8 overflow-y-auto custom-scrollbar pb-20">
                {/* Sort Section */}
                <section className="space-y-3">
                    <div className="flex items-center gap-2 px-1 text-black font-black uppercase tracking-widest text-[10px] border-b-[2px] border-black pb-1 w-fit">
                        <ArrowUpDown size={12} strokeWidth={3} />
                        <span>{t('sidebar.sort')}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <button className="flex items-center justify-center gap-2 px-2 py-2 border-[2px] border-transparent hover:border-black hover:bg-white hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all text-black font-bold text-sm">
                            <Clock size={16} strokeWidth={2.5} />
                            <span>{t('sidebar.recent')}</span>
                        </button>

                        <button className="flex items-center justify-center gap-2 px-2 py-2 border-[2px] border-transparent hover:border-black hover:bg-white hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all text-black font-bold text-sm">
                            <Shuffle size={16} strokeWidth={2.5} />
                            <span>{t('sidebar.random')}</span>
                        </button>
                    </div>
                </section>

                {/* Categories Section */}
                <section className="space-y-3">
                    <div className="flex items-center gap-2 px-1 text-black font-black uppercase tracking-widest text-[10px] border-b-[2px] border-black pb-1 w-fit">
                        <span>{t('sidebar.categories')}</span>
                    </div>

                    <div className="space-y-2">
                        <button
                            onClick={() => setActiveCategory(Category.ALL)}
                            className={`w-full flex items-center gap-3 px-3 py-2 border-[2px] transition-all text-sm font-bold ${activeCategory === Category.ALL
                                ? 'border-black bg-[#FF4D4D] text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                                : 'border-transparent text-black hover:border-black hover:bg-white hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                                }`}
                        >
                            <LayoutGrid size={18} strokeWidth={2.5} />
                            <span className="font-black italic uppercase">{t('sidebar.all')}</span>
                        </button>

                        {categories.filter(c => c !== Category.ALL).map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`w-full flex items-center gap-3 px-3 py-2 border-[2px] transition-all text-sm font-bold ${activeCategory === category
                                    ? 'border-black bg-[#FACC15] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                                    : 'border-transparent text-black hover:border-black hover:bg-white hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                                    }`}
                            >
                                <span>{t(`categories.${category}`)}</span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Other Sections */}
                <section className="space-y-2 border-t-[3px] border-black pt-6">
                    <button className="w-full flex items-center gap-3 px-3 py-2 border-[2px] border-transparent hover:border-black hover:bg-white hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all text-black font-bold text-sm">
                        <BookOpen size={18} strokeWidth={2.5} />
                        <span>{t('sidebar.tutorials')}</span>
                    </button>
                </section>
            </div>

            {/* Footer / Language */}
            <div className="p-4 border-t-[3px] border-black bg-[#F2F2F2] mt-auto sticky bottom-0 z-10">
                <button
                    onClick={toggleLanguage}
                    className="w-full flex items-center justify-between px-3 py-2 border-[2.5px] border-black bg-white hover:bg-[#2DD4BF] transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                >
                    <Globe size={16} strokeWidth={2.5} />
                    <span className="font-black text-xs uppercase">
                        {currentLanguage.startsWith('zh') ? 'English' : '简体中文'}
                    </span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
