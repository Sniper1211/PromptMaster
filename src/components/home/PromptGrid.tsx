import React from 'react';
import { useTranslation } from 'react-i18next';
import { Compass } from 'lucide-react';
import { Prompt, Category } from '../../types';
import PromptCard from '../PromptCard';

interface PromptGridProps {
    prompts: Prompt[];
    onSelectPrompt: (prompt: Prompt) => void;
    onClearFilters: () => void;
}

const PromptGrid: React.FC<PromptGridProps> = ({ prompts, onSelectPrompt, onClearFilters }) => {
    const { t } = useTranslation();

    return (
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {prompts.length > 0 ? (
                prompts.map(prompt => (
                    <div key={prompt.id} className="break-inside-avoid">
                        <PromptCard
                            prompt={prompt}
                            onTry={onSelectPrompt}
                        />
                    </div>
                ))
            ) : (
                <div className="col-span-full py-20 text-center">
                    <Compass size={48} className="mx-auto text-slate-600 mb-4 opacity-20" />
                    <p className="text-slate-400 text-lg">{t('noResults.message')}</p>
                    <button
                        onClick={onClearFilters}
                        className="mt-4 text-indigo-400 hover:underline"
                    >
                        {t('noResults.clear')}
                    </button>
                </div>
            )}
        </div>
    );
};

export default PromptGrid;
