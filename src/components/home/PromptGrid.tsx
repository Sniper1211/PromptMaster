import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Compass } from 'lucide-react';
import { Prompt } from '../../types';
import PromptCard from '../PromptCard';
import AdUnit from '../ads/AdUnit';

interface PromptGridProps {
    prompts: Prompt[];
    onSelectPrompt: (prompt: Prompt) => void;
    onClearFilters: () => void;
}

const useColumns = () => {
    const [cols, setCols] = useState(1);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1280) setCols(4); // xl
            else if (window.innerWidth >= 1024) setCols(3); // lg
            else if (window.innerWidth >= 768) setCols(2); // md
            else setCols(1);
        };

        handleResize(); // Init
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return cols;
};

const PromptGrid: React.FC<PromptGridProps> = ({ prompts, onSelectPrompt, onClearFilters }) => {
    const { t } = useTranslation();
    const columns = useColumns();

    if (prompts.length === 0) {
        return (
            <div className="py-20 text-center w-full">
                <Compass size={48} className="mx-auto text-slate-600 mb-4 opacity-20" />
                <p className="text-slate-400 text-lg">{t('noResults.message')}</p>
                <button
                    onClick={onClearFilters}
                    className="mt-4 text-indigo-400 hover:underline"
                >
                    {t('noResults.clear')}
                </button>
            </div>
        );
    }

    // Distribute prompts into columns (Round-robin)
    // We store { prompt, originalIndex } to maintain Ad placement logic
    const columnData = Array.from({ length: columns }, () => [] as { prompt: Prompt, originalIndex: number }[]);
    
    prompts.forEach((prompt, index) => {
        const colIndex = index % columns;
        columnData[colIndex].push({ prompt, originalIndex: index });
    });

    return (
        <div className="flex gap-6 items-start">
            {columnData.map((colItems, colIndex) => (
                <div key={colIndex} className="flex-1 flex flex-col gap-6 min-w-0">
                    {colItems.map(({ prompt, originalIndex }) => (
                        <React.Fragment key={prompt.id}>
                            <PromptCard
                                prompt={prompt}
                                onTry={onSelectPrompt}
                            />
                            {(originalIndex + 1) % 8 === 0 && (
                                <AdUnit label="Sponsored" />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default PromptGrid;
