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
import AdUnit from '../ads/AdUnit';

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
        <aside className="w-64 border-r-[3px] border-black bg-white flex flex-col h-screen overflow-y-auto custom-scrollbar shrink-0">
            {/* Brand */}
            <div className="p-6 border-b-[3px] border-black hover:bg-[#FACC15] transition-colors group cursor-pointer">
                <h1 className="text-2xl font-black uppercase tracking-tighter group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-transform">PromptMaster</h1>
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
            <div className="flex-1 py-6 px-4 space-y-8">
                {/* All Section */}
                <div>
                    <button
                        onClick={() => setActiveCategory(Category.ALL)}
                        className={`w-full flex items-center gap-3 px-4 py-3 border-[2.5px] border-black rounded-none transition-all ${activeCategory === Category.ALL
                            ? 'bg-[#FF4D4D] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]'
                            : 'bg-white hover:bg-gray-100 text-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]'
                            }`}
                    >
                        <LayoutGrid size={20} strokeWidth={2.5} />
                        <span className="font-black italic uppercase">{t('sidebar.all')}</span>
                    </button>

                </div>

                {/* Sort Section */}
                <section className="space-y-3">
                    <div className="flex items-center gap-2 px-1 text-black font-black uppercase tracking-widest text-[10px] border-b-[2px] border-black pb-1 w-fit">
                        <ArrowUpDown size={12} strokeWidth={3} />
                        <span>{t('sidebar.sort')}</span>
                    </div>

                    <div className="space-y-2">
                        <button className="w-full flex items-center gap-3 px-3 py-2 border-[2px] border-transparent hover:border-black hover:bg-white hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all text-black font-bold text-sm">
                            <Clock size={18} strokeWidth={2.5} />
                            <span>{t('sidebar.recent')}</span>
                        </button>

                        <button className="w-full flex items-center gap-3 px-3 py-2 border-[2px] border-transparent hover:border-black hover:bg-white hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all text-black font-bold text-sm">
                            <Shuffle size={18} strokeWidth={2.5} />
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
                        <Users size={18} strokeWidth={2.5} />
                        <span>{t('sidebar.creators')}</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 border-[2px] border-transparent hover:border-black hover:bg-white hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all text-black font-bold text-sm">
                        <BookOpen size={18} strokeWidth={2.5} />
                        <span>{t('sidebar.tutorials')}</span>
                    </button>

                </section>

                <div className="mt-auto px-4">
                    <AdUnit label="Sponsor" format="rectangle" />
                </div>
            </div>

            {/* Footer / Language */}
            <div className="p-6 border-t-[3px] border-black bg-[#F2F2F2] mt-auto">
                <button
                    onClick={toggleLanguage}
                    className="w-full flex items-center justify-between px-4 py-3 border-[2.5px] border-black bg-white hover:bg-[#2DD4BF] transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                >
                    <Globe size={18} strokeWidth={2.5} />
                    <span className="font-black text-xs uppercase">
                        {currentLanguage.startsWith('zh') ? 'English' : '简体中文'}
                    </span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
