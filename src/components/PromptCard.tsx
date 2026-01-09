
import React, { useState } from 'react';
import { Prompt } from '../types';
import { Copy, Check, Play, Image as ImageIcon } from 'lucide-react';
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
    <div className="brutal-card group flex flex-col h-full rounded-none">
      {/* Image Container */}
      <div className="relative overflow-hidden border-b-[2.5px] border-black">
        {prompt.previewImageUrl ? (
          <img
            src={prompt.previewImageUrl}
            alt={prompt.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="aspect-video bg-red-100 flex flex-col items-center justify-center text-red-500">
            <ImageIcon size={40} strokeWidth={2.5} />
            <span className="text-[10px] font-black uppercase mt-2">{t('card.needImage')}</span>
          </div>
        )}

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
          <button
            onClick={() => onTry(prompt)}
            className="p-3 bg-white border-[2px] border-black rounded-lg brutal-shadow-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
          >
            <Play size={20} className="fill-black" />
          </button>
          <button
            onClick={handleCopy}
            className="p-3 bg-white border-[2px] border-black rounded-lg brutal-shadow-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
          >
            {copied ? <Check size={20} className="text-green-600" /> : <Copy size={20} />}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-lg font-black mb-2 line-clamp-2 leading-tight uppercase tracking-tight group-hover:text-[#FF4D4D] transition-colors">
          {prompt.title}
        </h3>
        <p className="text-slate-500 text-xs font-medium mb-6 line-clamp-3 leading-relaxed flex-1">
          {prompt.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t-[2px] border-dashed border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full border-[1.5px] border-black bg-indigo-100 flex items-center justify-center overflow-hidden">
              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${prompt.id}`} alt="avatar" />
            </div>
            <span className="text-[10px] font-black text-slate-400">@author_id</span>
          </div>

          <span className="px-2 py-1 bg-white border-[1.5px] border-black text-[9px] font-black uppercase tracking-tighter rounded-md brutal-shadow-sm">
            PromptMaster
          </span>
        </div>
      </div>
    </div>
  );
};

export default PromptCard;
