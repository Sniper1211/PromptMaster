import React, { useState, useEffect } from 'react';
import { Prompt } from '../types';
import { X, Copy, Check, Info, Lightbulb, Image as ImageIcon, Search, Download, ExternalLink, Cpu, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PromptDetailModalProps {
  prompt: Prompt | null;
  onClose: () => void;
}

const PromptDetailModal: React.FC<PromptDetailModalProps> = ({ prompt, onClose }) => {
  const [copied, setCopied] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Lock body scroll
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalStyle;
    };
  }, [onClose]);

  if (!prompt) return null;

  const copyPrompt = () => {
    navigator.clipboard.writeText(prompt.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300 overflow-hidden"
      onClick={onClose}
    >
      <div
        className="bg-white brutal-border brutal-shadow w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-200 pointer-events-auto overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: Image Side */}
        <div className="md:w-1/2 p-6 flex flex-col bg-gray-50 border-r-[2.5px] border-black">
          <div className="relative group brutal-border bg-black overflow-hidden aspect-square flex items-center justify-center">
            {prompt.previewImageUrl ? (
              <img
                src={prompt.previewImageUrl}
                alt={prompt.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-500">
                <ImageIcon size={64} strokeWidth={1.5} />
                <span className="text-xs font-black uppercase mt-4 tracking-widest">{t('card.needImage')}</span>
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="p-4 bg-white/90 rounded-full border-[2px] border-black brutal-shadow-sm">
                <Search size={24} strokeWidth={3} className="text-black" />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Content Side */}
        <div className="md:w-1/2 flex flex-col h-full min-h-0 bg-white">
          {/* Top Bar: User & Close */}
          <div className="p-6 border-b-[2.5px] border-black flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg brutal-border bg-[#F26522] flex items-center justify-center overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${prompt.authorId || prompt.id}`} alt="avatar" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black uppercase tracking-tight">@{prompt.authorId || 'craftian_keskin'}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase">创作者</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center brutal-border bg-white hover:bg-gray-100 transition-colors brutal-shadow-sm active:shadow-none active:translate-x-[1px] active:translate-y-[1px]"
            >
              <X size={18} strokeWidth={3} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
            {/* Prompt Title Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu size={18} className="text-[#8B5CF6]" strokeWidth={3} />
                  <h3 className="text-sm font-black uppercase italic tracking-tighter">提示词</h3>
                </div>
                <button
                  onClick={copyPrompt}
                  className="flex items-center gap-2 px-4 py-1.5 bg-[#FACC15] border-[2.5px] border-black font-black uppercase text-[10px] brutal-shadow-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
                >
                  <Copy size={14} strokeWidth={3} />
                  <span>{copied ? '已复制' : '复制'}</span>
                </button>
              </div>

              <div className="brutal-border p-4 bg-gray-50 min-h-[120px]">
                <p className="font-mono text-xs leading-relaxed text-black/80 font-bold whitespace-pre-wrap">
                  {prompt.content}
                </p>
              </div>
            </div>

            {/* Params Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="brutal-border p-4 bg-gray-50 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Cpu size={12} strokeWidth={3} />
                  <span className="text-[9px] font-black uppercase">模型</span>
                </div>
                <span className="text-xs font-black uppercase tracking-tight">PromptMaster</span>
              </div>
              <div className="brutal-border p-4 bg-gray-50 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <FileText size={12} strokeWidth={3} />
                  <span className="text-[9px] font-black uppercase">提示词格式</span>
                </div>
                <span className="text-xs font-black uppercase tracking-tight">text</span>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <button className="flex items-center justify-center gap-2 py-4 bg-[#FF4D4D] text-white border-[2.5px] border-black font-black uppercase italic text-sm brutal-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-sm transition-all group">
                <Download size={18} strokeWidth={3} className="group-hover:scale-110 transition-transform" />
                <span>下载</span>
              </button>
              <button className="flex items-center justify-center gap-2 py-4 bg-white text-black border-[2.5px] border-black font-black uppercase italic text-sm brutal-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-sm transition-all group">
                <ExternalLink size={18} strokeWidth={3} className="group-hover:scale-110 transition-transform" />
                <span>查看原贴</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptDetailModal;
