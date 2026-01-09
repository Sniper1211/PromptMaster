import React from 'react';
import { useTranslation } from 'react-i18next';
import { Category } from '../../types';

interface CategoryFilterProps {
    activeCategory: Category;
    setActiveCategory: (category: Category) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ activeCategory, setActiveCategory }) => {
    const { t } = useTranslation();

    return (
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            {Object.values(Category).map(cat => (
                <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-300 border ${activeCategory === cat
                            ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                            : 'glass border-white/5 text-slate-400 hover:border-white/20 hover:text-white'
                        }`}
                >
                    {t(`categories.${cat}`)}
                </button>
            ))}
        </div>
    );
};

export default CategoryFilter;
