import React, { useState } from 'react';
import Link from './common/LocalizedLink';

import { Prompt, Category } from '../types';
import { Copy, Check, Eye, Image as ImageIcon, Video } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PromptCardProps {
  prompt: Prompt;
  onTry?: (prompt: Prompt) => void;
}

const getCategoryKey = (category: Category | string) => {
  const key = Object.keys(Category).find((k) => Category[k as keyof typeof Category] === category);
  return key && key !== 'ALL' ? key : null;
};

const hasCjk = (value?: string) => /[\u4e00-\u9fff]/.test(value || '');

const PromptCard: React.FC<PromptCardProps> = ({ prompt, onTry: _onTry }) => {
  const [copied, setCopied] = useState(false);
  const { t, i18n } = useTranslation();

  const currentLang = i18n.language.startsWith('zh') ? 'zh' : 'en';
  const categoryKey = getCategoryKey(prompt.category);
  const categoryLabel = categoryKey ? t(`categories.${categoryKey}`) : String(prompt.category);
  // Language badge: tell users when the card is showing the other language's original text.
  const showLanguageBadge = currentLang === 'zh' ? !hasCjk(prompt.title) : hasCjk(prompt.title);

  const handleCopy = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    // List responses no longer include the full prompt text; fetch it on demand.
    let text = prompt.content || '';
    if (!text) {
      try {
        const res = await fetch(`/api/prompts?id=${encodeURIComponent(prompt.id)}&lang=${currentLang}`);
        if (res.ok) {
          const full = await res.json();
          text = typeof full?.content === 'string' ? full.content : '';
        }
      } catch (err) {
        console.error('Failed to load prompt content', err);
      }
    }
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Clipboard write failed', err);
      return;
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    fetch(`/api/increment-copy?id=${prompt.id}`, { method: 'POST' })
      .catch((err) => console.error('Failed to increment copy count', err));
  };

  const copyCount = prompt.copyCount ?? 0;

  return (
    <div className="brutal-card group flex flex-col rounded-none">
      {/* Cover */}
      <div className="relative overflow-hidden border-b-[2.5px] border-black bg-slate-100">
        <Link to={`/prompt/${prompt.id}`} className="block" aria-label={prompt.title}>
        {prompt.previewImageUrl ? (
          <div className="aspect-[4/3] w-full">
            <img
              src={prompt.previewImageUrl}
              alt={prompt.title}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="aspect-[4/3] w-full flex flex-col items-center justify-center gap-2 text-slate-400 p-4">
            <ImageIcon size={32} strokeWidth={2} />
            <span className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">{categoryLabel}</span>
          </div>
        )}
        </Link>

        {/* Overlay actions (hover + keyboard focus) */}
        <div className="absolute inset-0 z-20 bg-black/40 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity flex items-center justify-center gap-4">
          <span className="p-3 bg-white border-[2.5px] border-black rounded-xl brutal-shadow-sm">
            <Eye size={26} className="text-black" strokeWidth={2.5} />
          </span>
          <button
            type="button"
            onClick={handleCopy}
            aria-label={copied ? t('common.copied') : t('promptDetail.copyPrompt')}
            className="p-3 bg-white border-[2.5px] border-black rounded-xl brutal-shadow-sm hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all"
          >
            {copied ? <Check size={26} className="text-green-600" strokeWidth={3} /> : <Copy size={26} strokeWidth={2.5} />}
          </button>
          {prompt.promptType === 'video' && prompt.sourceLink && (
            <a
              href={prompt.sourceLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('promptDetail.viewSource')}
              className="p-3 bg-red-500 border-[2.5px] border-black rounded-xl brutal-shadow-sm hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all"
            >
              <Video size={26} className="text-white" strokeWidth={2.5} />
            </a>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Link to={`/prompt/${prompt.id}`} className="group-hover:text-[#FF4D4D] transition-colors flex-1 min-w-0">
            <h3 className="text-lg font-black line-clamp-2 leading-tight uppercase tracking-tight">{prompt.title}</h3>
          </Link>
          <div className="flex items-center gap-1 shrink-0 pt-1">
            {showLanguageBadge && (
              <span className="text-[9px] font-black uppercase tracking-widest border-[1.5px] border-black bg-white px-1 py-0.5">
                {currentLang === 'zh' ? 'EN' : '中文'}
              </span>
            )}
            {prompt.promptType === 'video' && <Video size={14} className="text-red-500" strokeWidth={2.5} />}
          </div>
        </div>

        <p className="text-slate-500 text-xs font-medium line-clamp-3 leading-relaxed flex-1 mb-3">{prompt.description}</p>

        <div className="flex items-center justify-between gap-2 pt-3 border-t-2 border-slate-100">
          <div className="flex items-center gap-2 min-w-0">
            {prompt.copyCount === undefined ? (
              <span className="inline-block w-10 h-3 bg-black/20 animate-pulse rounded-sm" />
            ) : (
              copyCount > 0 && (
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                  <Copy size={10} strokeWidth={3} />
                  {(copyCount + (copied ? 1 : 0)).toLocaleString()}
                </span>
              )
            )}
            {prompt.authorName && (
              <span className="text-[10px] font-medium text-slate-400 truncate">by {prompt.authorName}</span>
            )}
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 shrink-0">{categoryLabel}</span>
        </div>
      </div>
    </div>
  );
};

export default PromptCard;
