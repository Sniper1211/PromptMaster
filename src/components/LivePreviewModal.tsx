import React, { useState } from 'react';
import { Prompt, GenerationResult } from '../types';
import { X, Sparkles, AlertCircle, Copy, Check, Play } from 'lucide-react';
import { generatePreview, AIProvider } from '../services/aiService';
import { useTranslation } from 'react-i18next';

interface LivePreviewModalProps {
  prompt: Prompt | null;
  onClose: () => void;
}

const LivePreviewModal: React.FC<LivePreviewModalProps> = ({ prompt, onClose }) => {
  const [result, setResult] = useState<GenerationResult>({ text: '', status: 'idle' });
  const [copied, setCopied] = useState(false);
  const [provider, setProvider] = useState<AIProvider>('deepseek');
  const { t } = useTranslation();

  if (!prompt) return null;

  const handleRun = async () => {
    setResult({ text: '', status: 'loading' });
    try {
      const output = await generatePreview(prompt.content, provider);
      setResult({ text: output, status: 'success' });
    } catch (error: any) {
      setResult({ text: '', status: 'error', error: error.message });
    }
  };

  const copyResult = () => {
    navigator.clipboard.writeText(result.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="glass w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <Sparkles className="text-indigo-400" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold">{prompt.title}</h2>
              <p className="text-sm text-slate-400">{t('modal.subtitle')}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{t('modal.promptConfig')}</label>
              <div className="p-4 bg-slate-900/50 rounded-2xl border border-white/5 text-sm leading-relaxed text-slate-300 whitespace-pre-wrap">
                {prompt.content}
              </div>
              {/* Optional: Show Chinese translation if available and different */}
              {prompt.chineseContent && prompt.chineseContent !== prompt.content && (
                <div className="mt-2 p-3 bg-slate-800/30 rounded-xl border border-white/5 text-xs text-slate-400 italic">
                  <span className="font-bold not-italic text-slate-500 block mb-1">中文对照 (Chinese Translation):</span>
                  {prompt.chineseContent}
                </div>
              )}
            </div>
            <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
              <h4 className="text-sm font-semibold text-indigo-300 mb-1">{t('modal.expertTip')}</h4>
              <p className="text-xs text-indigo-200/70">{prompt.expectedOutput}</p>
            </div>

            <button
              onClick={handleRun}
              disabled={result.status === 'loading'}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:cursor-not-allowed rounded-2xl font-bold transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
            >
              {result.status === 'loading' ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  {t('modal.generating')}
                </>
              ) : (
                <>
                  <Play size={18} className="fill-current" />
                  {t('modal.runLive')}
                </>
              )}
            </button>
          </div>

          <div className="flex flex-col h-full min-h-[400px]">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{t('modal.resultOutput')}</label>
            <div className="flex-1 glass bg-slate-950/50 rounded-2xl p-6 border border-white/5 relative overflow-y-auto max-h-[500px]">
              {result.status === 'idle' && (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 italic text-center">
                  <Sparkles size={40} className="mb-4 opacity-20" />
                  <p>{t('modal.idleMessage')}</p>
                </div>
              )}

              {result.status === 'loading' && (
                <div className="space-y-4">
                  <div className="h-4 bg-white/5 rounded animate-pulse w-3/4"></div>
                  <div className="h-4 bg-white/5 rounded animate-pulse w-full"></div>
                  <div className="h-4 bg-white/5 rounded animate-pulse w-5/6"></div>
                  <div className="h-4 bg-white/5 rounded animate-pulse w-1/2"></div>
                </div>
              )}

              {result.status === 'success' && (
                <div className="animate-in fade-in duration-500">
                  <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{result.text}</p>
                  <button 
                    onClick={copyResult}
                    className="absolute top-4 right-4 p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors text-slate-400 hover:text-white"
                  >
                    {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                  </button>
                </div>
              )}

              {result.status === 'error' && (
                <div className="h-full flex flex-col items-center justify-center text-red-400 text-center p-4">
                  <AlertCircle size={40} className="mb-4 opacity-50" />
                  <p className="font-bold mb-2">Generation Failed</p>
                  <p className="text-sm opacity-80">{result.error}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivePreviewModal;