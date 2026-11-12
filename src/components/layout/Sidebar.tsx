import React from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutGrid, Search, ArrowUpDown, Clock, Shuffle, BookOpen, Video } from 'lucide-react';
import { Category } from '../../types';

export interface SidebarFiltersProps {
    activeCategory: Category;
    setActiveCategory: (category: Category) => void;
    videoOnly: boolean;
    onVideoOnlyClick: () => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    sortOrder: 'recent' | 'random';
    setSortOrder: (order: 'recent' | 'random') => void;
    onTutorialClick: () => void;
    categoryCounts?: Record<string, number> | null;
    className?: string;
}

/** Filter controls shared by the desktop rail and the mobile drawer. */
export const SidebarFilters: React.FC<SidebarFiltersProps> = ({
    activeCategory,
    setActiveCategory,
    videoOnly,
    onVideoOnlyClick,
    searchQuery,
    setSearchQuery,
    sortOrder,
    setSortOrder,
    onTutorialClick,
    categoryCounts,
    className
}) => {
    const { t } = useTranslation();
    const videoPromptCount = categoryCounts?.VIDEO_PROMPTS ?? 0;

    const categories = Object.keys(Category)
        .filter((k) => k !== 'ALL')
        .filter((k) => !categoryCounts || (categoryCounts[k] ?? 0) > 0);

    return (
        <div className={className ?? 'py-6 px-4 space-y-8'}>
            {/* Search */}
            <div className="relative group">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('hero.searchPlaceholder')}
                    aria-label={t('hero.searchPlaceholder')}
                    className="w-full pl-10 pr-4 py-2 border-[2.5px] border-black rounded-none focus:outline-none focus:ring-0 placeholder:text-slate-400 font-bold bg-white focus:bg-gray-50 transition-all"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black" size={18} strokeWidth={3} />
            </div>

            {/* Sort */}
            <section className="space-y-3">
                <h2 className="flex items-center gap-2 px-1 text-black font-black uppercase tracking-widest text-[10px] border-b-[2px] border-black pb-1 w-fit">
                    <ArrowUpDown size={12} strokeWidth={3} />
                    <span>{t('sidebar.sort')}</span>
                </h2>
                <div className="grid grid-cols-2 gap-2">
                    <button
                        type="button"
                        onClick={() => setSortOrder('recent')}
                        className={`flex items-center justify-center gap-2 px-2 py-2 border-[2px] transition-all text-black font-bold text-sm ${
                            sortOrder === 'recent'
                                ? 'border-black bg-[#FACC15] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                                : 'border-transparent hover:border-black hover:bg-white'
                        }`}
                    >
                        <Clock size={16} strokeWidth={2.5} />
                        <span>{t('sidebar.recent')}</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setSortOrder('random')}
                        className={`flex items-center justify-center gap-2 px-2 py-2 border-[2px] transition-all text-black font-bold text-sm ${
                            sortOrder === 'random'
                                ? 'border-black bg-[#FACC15] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                                : 'border-transparent hover:border-black hover:bg-white'
                        }`}
                    >
                        <Shuffle size={16} strokeWidth={2.5} />
                        <span>{t('sidebar.random')}</span>
                    </button>
                </div>
            </section>

            {/* Categories */}
            <section className="space-y-3">
                <h2 className="px-1 text-black font-black uppercase tracking-widest text-[10px] border-b-[2px] border-black pb-1 w-fit">
                    {t('sidebar.categories')}
                </h2>
                <div className="space-y-2">
                    <button
                        type="button"
                        onClick={() => setActiveCategory(Category.ALL)}
                        className={`w-full flex items-center gap-3 px-3 py-2 border-[2px] transition-all text-sm font-bold ${
                            !videoOnly && activeCategory === Category.ALL
                                ? 'border-black bg-[#FF4D4D] text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                                : 'border-transparent text-black hover:border-black hover:bg-white'
                        }`}
                    >
                        <LayoutGrid size={18} strokeWidth={2.5} />
                        <span className="font-black italic uppercase">{t('sidebar.all')}</span>
                    </button>

                    {videoPromptCount > 0 && (
                        <button
                            type="button"
                            onClick={onVideoOnlyClick}
                            className={`w-full flex items-center justify-between px-3 py-2 border-[2px] transition-all text-sm font-bold ${
                                videoOnly
                                    ? 'border-black bg-[#FACC15] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                                    : 'border-transparent text-black hover:border-black hover:bg-white'
                            }`}
                        >
                            <span className="flex items-center gap-3">
                                <Video size={18} strokeWidth={2.5} />
                                <span>{t('sidebar.videoPrompts')}</span>
                            </span>
                        </button>
                    )}

                    {categories.map((key) => {
                        const value = Category[key as keyof typeof Category];
                        return (
                            <button
                                type="button"
                                key={key}
                                onClick={() => setActiveCategory(value)}
                                className={`w-full flex items-center justify-between px-3 py-2 border-[2px] transition-all text-sm font-bold ${
                                    activeCategory === value
                                        ? 'border-black bg-[#FACC15] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                                        : 'border-transparent text-black hover:border-black hover:bg-white'
                                }`}
                            >
                                <span>{t(`categories.${key}`)}</span>
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* Guides entry */}
            <section className="space-y-2 border-t-[3px] border-black pt-6">
                <button
                    type="button"
                    onClick={onTutorialClick}
                    className="w-full flex items-center gap-3 px-3 py-2 border-[2px] border-transparent hover:border-black hover:bg-white transition-all text-black font-bold text-sm"
                >
                    <BookOpen size={18} strokeWidth={2.5} />
                    <span>{t('sidebar.tutorials')}</span>
                </button>
            </section>
        </div>
    );
};

/** Desktop filter rail (hidden below 1024px; mobile users get the same controls in the header drawer). */
const Sidebar: React.FC<SidebarFiltersProps> = (props) => {
    return (
        <aside className="hidden lg:flex w-64 shrink-0 border-r-[3px] border-black bg-white flex-col sticky top-16 h-[calc(100vh-4rem)]">
            <SidebarFilters {...props} className="flex-1 overflow-y-auto custom-scrollbar py-6 px-4 space-y-8 pb-20" />
        </aside>
    );
};

export default Sidebar;
