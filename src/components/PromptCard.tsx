
import React, { useState } from 'react';
import { Prompt } from '../types';
import { Copy, Check, Play } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PromptCardProps {
  prompt: Prompt;
  onTry: (prompt: Prompt) => void;
}

const PromptCard: React.FC<PromptCardProps> = ({ prompt, onTry }) => {
  const [copied, setCopied] = useState(false);
  const { t } = useTranslation();

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="glass rounded-2xl p-6 flex flex-col h-full transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-500/10 group">
      <div className="flex justify-between items-start mb-4">
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
          {t(`categories.${prompt.category}`)}
        </span>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors text-slate-400 hover:text-white"
            title={t('card.copy')}
          >
            {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
          </button>
        </div>
      </div>

      <h3 className="text-xl font-bold mb-2 text-white group-hover:text-indigo-300 transition-colors">
        {prompt.title}
      </h3>
      <p className="text-slate-400 text-sm mb-4 line-clamp-2">
        {prompt.description}
      </p>

      <div className="bg-slate-900/50 rounded-xl p-4 mb-6 border border-white/5 relative">
        <p className="text-xs text-slate-500 uppercase tracking-wider mb-2 font-bold">{t('card.snippet')}</p>
        <p className="text-sm text-slate-300 italic line-clamp-3">
          "{prompt.content}"
        </p>
      </div>

      <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
        <div className="flex gap-1 flex-wrap">
          {prompt.tags.slice(0, 2).map(tag => (
            <span key={tag} className="text-[10px] text-slate-500">#{tag}</span>
          ))}
        </div>
        <button
          onClick={() => onTry(prompt)}
          className="flex items-center gap-2 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors group/btn"
        >
          {t('card.tryLive')}
          <Play size={14} className="fill-current group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default PromptCard;
