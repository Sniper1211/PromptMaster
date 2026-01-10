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
  const [showFullImage, setShowFullImage] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showFullImage) {
          setShowFullImage(false);
        } else {
          onClose();
        }
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
        className="bg-white brutal-border brutal-shadow w-full max-w-4xl h-[520px] max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200 pointer-events-auto overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Content Side */}
        <div className="flex flex-col h-full min-h-0 bg-white">
          {/* Top Bar: User & Close */}
          <div className="p-6 border-b-[2.5px] border-black flex items-center justify-between gap-4">
            <h2 className="text-xl font-black uppercase italic tracking-tighter line-clamp-2 pr-2">{prompt.title}</h2>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={copyPrompt}
                className="flex items-center gap-2 px-4 py-1.5 bg-[#2DD4BF] border-[2.5px] border-black font-black uppercase text-[10px] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:brutal-shadow-sm transition-all"
              >
                <Copy size={14} strokeWidth={3} />
                <span>{copied ? '已复制' : '复制'}</span>
              </button>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center brutal-border bg-white hover:bg-gray-100 transition-colors brutal-shadow-sm active:shadow-none active:translate-x-[1px] active:translate-y-[1px]"
              >
                <X size={18} strokeWidth={3} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden p-6 flex flex-col md:flex-row gap-6">
            {/* Left: Image */}
            {prompt.previewImageUrl && (
              <div className="w-full md:w-1/3 flex-shrink-0 flex flex-col justify-center">
                <div className="relative group brutal-border bg-black overflow-hidden aspect-square flex items-center justify-center w-full">
                  <img
                    src={prompt.previewImageUrl}
                    alt={prompt.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <button
                    onClick={() => setShowFullImage(true)}
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 cursor-zoom-in"
                  >
                    <div className="p-3 bg-white/90 rounded-full border-[2px] border-black brutal-shadow-sm hover:scale-110 transition-transform">
                      <Search size={20} strokeWidth={3} className="text-black" />
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Full Image Overlay */}
            {showFullImage && prompt.previewImageUrl && (
              <div 
                className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 animate-in fade-in duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFullImage(false);
                }}
              >
                <button 
                  className="absolute top-6 right-6 p-2 bg-white rounded-full hover:bg-gray-200 transition-colors"
                  onClick={() => setShowFullImage(false)}
                >
                  <X size={24} strokeWidth={3} />
                </button>
                <img 
                  src={prompt.previewImageUrl} 
                  alt={prompt.title} 
                  className="max-w-full max-h-full object-contain brutal-shadow"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}

            {/* Right: Prompt Text */}
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex items-center gap-2 mb-3">
                <Cpu size={18} className="text-[#8B5CF6]" strokeWidth={3} />
                <h3 className="text-sm font-black uppercase italic tracking-tighter">提示词</h3>
              </div>

              <div className="brutal-border p-4 bg-gray-50 flex-1 overflow-y-auto custom-scrollbar">
                <p className="font-mono text-xs leading-relaxed text-black/80 font-bold whitespace-pre-wrap">
                  {prompt.content}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptDetailModal;
