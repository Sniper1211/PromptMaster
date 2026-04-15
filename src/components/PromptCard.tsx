
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Prompt } from '../types';
import { Copy, Check, Eye, Image as ImageIcon, Video } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PromptCardProps {
  prompt: Prompt;
  onTry?: (prompt: Prompt) => void;
}

const TAG_COLORS = [
  'bg-[#FF4D4D]', // Red
  'bg-[#FACC15]', // Yellow
  'bg-[#8B5CF6]', // Purple
  'bg-[#F26522]', // Orange
  'bg-[#2DD4BF]', // Teal
  'bg-[#EC4899]', // Pink
  'bg-[#A855F7]', // Violet
  'bg-[#14B8A6]', // Teal-500
];

const PromptCard: React.FC<PromptCardProps> = ({ prompt, onTry }) => {
  const [copied, setCopied] = useState(false);
  const { t } = useTranslation();
  const tags = Array.isArray(prompt.tags) ? prompt.tags : [];

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    // Send increment request silently
    fetch(`/api/increment-copy?id=${prompt.id}`, { method: 'POST' })
        .catch(err => console.error('Failed to increment copy count', err));
  };

  // Get a deterministic color based on prompt ID
  const getCardColor = (id: string) => {
    const sum = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return TAG_COLORS[sum % TAG_COLORS.length];
  };

  return (
    <div className="brutal-card group flex flex-col rounded-none">
      {/* Image Container */}
      <div className="relative overflow-hidden border-b-[2.5px] border-black">
        {prompt.previewImageUrl ? (
          <img
            src={prompt.previewImageUrl}
            alt={prompt.title}
            className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className={`aspect-video ${getCardColor(prompt.id)} p-6 flex flex-wrap content-center justify-center gap-4 relative overflow-hidden`}>
            {/* Decorative pattern */}
            <div className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)',
                backgroundSize: '16px 16px'
              }}
            />

            {tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="relative inline-block px-5 py-2 bg-white border-[3px] border-black text-lg font-black uppercase tracking-tighter shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transform rotate-[-3deg] odd:rotate-[2deg] group-hover:opacity-10 transition-opacity duration-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Overlay Actions */}
        <div className="absolute inset-0 z-20 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6">
          <Link
            to={`/prompt/${prompt.id}`}
            className="p-4 bg-white border-[2.5px] border-black rounded-xl brutal-shadow-sm hover:-translate-x-[2px] hover:-translate-y-[2px] hover:brutal-shadow transition-all"
          >
            <Eye size={32} className="text-black" strokeWidth={2.5} />
          </Link>
          <button
            onClick={handleCopy}
            className="p-4 bg-white border-[2.5px] border-black rounded-xl brutal-shadow-sm hover:-translate-x-[2px] hover:-translate-y-[2px] hover:brutal-shadow transition-all"
          >
            {copied ? <Check size={32} className="text-green-600" strokeWidth={3} /> : <Copy size={32} strokeWidth={2.5} />}
          </button>
          {prompt.promptType === 'video' && prompt.sourceLink && (
            <a
              href={prompt.sourceLink}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 bg-red-500 border-[2.5px] border-black rounded-xl brutal-shadow-sm hover:-translate-x-[2px] hover:-translate-y-[2px] hover:brutal-shadow transition-all"
              title="Watch video"
            >
              <Video size={32} className="text-white" strokeWidth={2.5} />
            </a>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-2">
          <Link to={`/prompt/${prompt.id}`} className="group-hover:text-[#FF4D4D] transition-colors flex-1">
            <h3 className="text-lg font-black line-clamp-2 leading-tight uppercase tracking-tight">
              {prompt.title}
            </h3>
          </Link>
          {prompt.promptType === 'video' && (
            <div className="flex items-center gap-1 ml-2">
              <Video size={16} className="text-red-500" strokeWidth={2.5} />
              {prompt.sourceLink && (
                <a 
                  href={prompt.sourceLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors"
                  title="View source video"
                >
                  ↗
                </a>
              )}
            </div>
          )}
        </div>
        <p className="text-slate-500 text-xs font-medium line-clamp-3 leading-relaxed flex-1 mb-3">
          {prompt.description}
        </p>

        <div className="flex items-center justify-between pt-3 border-t-2 border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
              <Copy size={10} strokeWidth={3} /> 
              {prompt.copyCount === undefined ? (
                <span className="inline-block w-10 h-3 bg-black/20 animate-pulse"></span>
              ) : (
                ((prompt.copyCount || 0) + (copied ? 1 : 0)).toLocaleString()
              )}
            </span>
            {prompt.authorName && (
              <span className="text-[10px] font-medium text-slate-400">
                by {prompt.authorName}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptCard;
