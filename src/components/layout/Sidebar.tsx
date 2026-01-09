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
        <aside className="w-64 border-r-[2.5px] border-black bg-white flex flex-col h-screen h-full overflow-y-auto custom-scrollbar shrink-0">
            {/* Brand */}
            <div className="p-6 border-b-[2.5px] border-black">
                <h1 className="text-2xl font-black uppercase tracking-tighter">PromptMaster</h1>
            </div>

            {/* Search */}
            <div className="p-4 px-6 border-b-[2.5px] border-black">
                <div className="relative group">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t('hero.searchPlaceholder')}
                        className="w-full pl-10 pr-4 py-2 border-[2px] border-black rounded-lg focus:outline-none focus:ring-0 placeholder:text-slate-400 font-medium bg-gray-50 group-hover:bg-white transition-colors"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black" size={18} strokeWidth={2.5} />
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 py-6 px-4 space-y-8">
                {/* All Section */}
                <div>
                    <button
                        onClick={() => setActiveCategory(Category.ALL)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${activeCategory === Category.ALL
                                ? 'bg-[#FF4D4D] text-white border-[2px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                                : 'hover:bg-gray-100 text-black font-bold'
                            }`}
                    >
                        <LayoutGrid size={20} strokeWidth={2.5} />
                        <span className="font-black italic uppercase">全部</span>
                    </button>
                </div>

                {/* Sort Section */}
                <section className="space-y-2">
                    <div className="flex items-center gap-2 px-3 text-slate-400 font-black uppercase tracking-widest text-[10px]">
                        <ArrowUpDown size={12} strokeWidth={3} />
                        <span>排序</span>
                    </div>
                    <div className="space-y-1">
                        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-black font-bold text-sm">
                            <Clock size={18} strokeWidth={2.5} />
                            <span>最近</span>
                        </button>
                        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-black font-bold text-sm">
                            <Shuffle size={18} strokeWidth={2.5} />
                            <span>随机</span>
                        </button>
                    </div>
                </section>

                {/* Categories Section */}
                <section className="space-y-2">
                    <div className="flex items-center gap-2 px-3 text-slate-400 font-black uppercase tracking-widest text-[10px]">
                        <span>分类</span>
                    </div>
                    <div className="space-y-1">
                        {categories.filter(c => c !== Category.ALL).map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-bold ${activeCategory === category
                                        ? 'text-[#FF4D4D] bg-[#FF4D4D]/5'
                                        : 'text-black hover:bg-gray-100'
                                    }`}
                            >
                                <span>{t(`categories.${category}`)}</span>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Other Sections */}
                <section className="space-y-1 border-t-[2px] border-dashed border-slate-200 pt-6">
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-black font-bold text-sm">
                        <Users size={18} strokeWidth={2.5} />
                        <span>创作者</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-black font-bold text-sm">
                        <BookOpen size={18} strokeWidth={2.5} />
                        <span>提示词教程</span>
                    </button>
                </section>
            </div>

            {/* Footer / Language */}
            <div className="p-6 border-t-[2.5px] border-black bg-gray-50 mt-auto">
                <button
                    onClick={toggleLanguage}
                    className="w-full flex items-center justify-between px-3 py-2 border-[2px] border-black rounded-xl bg-white hover:bg-gray-50 transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                >
                    <Globe size={18} strokeWidth={2.5} />
                    <span className="font-black text-xs uppercase">{currentLanguage.toUpperCase()}</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
