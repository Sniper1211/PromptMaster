import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Copy, Check, Code, Terminal, Send, CheckCircle, XCircle } from 'lucide-react';

import { Category, Prompt } from '../../types';
import { submitPrompt, createPrompt, analyzePrompt } from '../../services/submissionService';
import { Sparkles, Eye, Edit3, Image as ImageIcon } from 'lucide-react';

interface AddPromptModalProps {
    onClose: () => void;
    nextId: string;
    isAdmin?: boolean;
}

const AddPromptModal: React.FC<AddPromptModalProps> = ({ onClose, nextId, isAdmin = false }) => {
    const { t } = useTranslation();
    const [copied, setCopied] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    
    // Admin Wizard States
    const [isWizardMode, setIsWizardMode] = useState(isAdmin);
    const [rawInput, setRawInput] = useState('');
    const [imageUrlInput, setImageUrlInput] = useState('');

    const [formData, setFormData] = useState<Partial<Prompt> & { titleZh?: string, descriptionZh?: string }>({
        id: nextId,
        title: '',
        description: '',
        category: Category.CODING,
        tags: [],
        content: '',
        chineseContent: '',
        expectedOutput: '',
        usage: '',
        model: 'GPT-4o',
        format: ''
    });

    const [tagInput, setTagInput] = useState('');

    const handleAddTag = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!formData.tags?.includes(tagInput.trim())) {
                setFormData({ ...formData, tags: [...(formData.tags || []), tagInput.trim()] });
            }
            setTagInput('');
        }
    };

    const removeTag = (tag: string) => {
        setFormData({ ...formData, tags: formData.tags?.filter(t => t !== tag) });
    };

    const generatedCode = useMemo(() => {
        return JSON.stringify(formData, null, 2);
    }, [formData]);

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleAIAnalyze = async () => {
        if (!rawInput.trim()) {
            setErrorMessage('Please paste some prompt content first.');
            return;
        }

        setIsAnalyzing(true);
        setErrorMessage('');
        try {
            const token = localStorage.getItem('adminToken') || '';
            const result = await analyzePrompt(rawInput, token);
            
            // Map string category to Enum
            let matchedCategory = Category.CODING;
            const catStr = result.category?.toUpperCase();
            if (catStr) {
                const found = Object.entries(Category).find(([key]) => key === catStr);
                if (found) matchedCategory = found[1];
            }

            setFormData(prev => ({
                ...prev,
                title: result.title || '',
                titleZh: result.titleZh || '',
                description: result.description || '',
                descriptionZh: result.descriptionZh || '',
                category: matchedCategory,
                tags: result.tags || [],
                content: result.content || '',
                chineseContent: result.chineseContent || '',
                expectedOutput: result.expectedOutput || '',
                usage: result.usage || '',
                previewImageUrl: imageUrlInput || prev.previewImageUrl
            }));
            
            setIsWizardMode(false); // Switch to review mode
        } catch (err: any) {
            setErrorMessage(err.message || 'AI Analysis failed');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setSubmitStatus('idle');
        setErrorMessage('');

        let result;
        if (isAdmin) {
            const token = localStorage.getItem('adminToken') || '';
            result = await createPrompt(formData, token);
        } else {
            result = await submitPrompt({
                title: formData.title || '',
                category: formData.category || Category.CODING,
                tags: formData.tags || [],
                description: formData.description || '',
                content: formData.content || '',
                chineseContent: formData.chineseContent,
                expectedOutput: formData.expectedOutput || '',
                usage: formData.usage || '',
                contact: contactEmail
            });
        }

        setIsSubmitting(false);
        if (result.success) {
            setSubmitStatus('success');
            setTimeout(() => {
                onClose();
            }, 2000);
        } else {
            setSubmitStatus('error');
            setErrorMessage(result.message || 'Submission failed');
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white border-[3px] border-black max-w-6xl w-full h-[90vh] flex flex-col shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">

                {/* Header */}
                <div className="p-4 md:p-6 border-b-[3px] border-black flex items-center justify-between bg-[#FACC15]">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-black text-white shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                            <Terminal size={24} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h2 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter text-black">
                                {isAdmin ? 'Admin: Add Prompt' : 'JSON Generator'}
                            </h2>
                            <p className="text-xs font-bold uppercase tracking-widest text-black/70">
                                {isAdmin ? (isWizardMode ? 'Step 1: AI Magic Box' : 'Step 2: Review & Publish') : 'Create & Export Prompt Data'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {isAdmin && !isWizardMode && (
                            <button 
                                onClick={() => setIsWizardMode(true)}
                                className="px-3 py-1.5 bg-white border-2 border-black font-black uppercase text-xs flex items-center gap-2 hover:bg-black hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]"
                            >
                                <Edit3 size={14} /> Back to Input
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-red-500 hover:text-white transition-all border-[2.5px] border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]"
                        >
                            <X size={20} strokeWidth={3} />
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
                    
                    {/* --- ADMIN WIZARD MODE (Simplified Input) --- */}
                    {isAdmin && isWizardMode ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#F1F5F9] overflow-y-auto">
                            <div className="w-full max-w-3xl space-y-8">
                                <div className="text-center space-y-2">
                                    <div className="inline-block p-4 bg-yellow-300 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-4">
                                        <Sparkles size={40} className="text-black" />
                                    </div>
                                    <h3 className="text-3xl font-black uppercase tracking-tight italic text-black">AI Magic Submission</h3>
                                    <p className="font-bold text-slate-600 uppercase text-sm tracking-widest">Just paste, we'll do the rest.</p>
                                </div>

                                <div className="space-y-6">
                                    {/* Raw Text Input */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-black uppercase flex items-center gap-2 text-black">
                                            <span className="w-3 h-3 bg-black"></span> Paste Prompt Content (Any Language)
                                        </label>
                                        <textarea
                                            value={rawInput}
                                            onChange={e => setRawInput(e.target.value)}
                                            className="w-full h-64 p-6 border-4 border-black font-bold text-lg focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] focus:-translate-x-1 focus:-translate-y-1 transition-all outline-none resize-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white placeholder:text-slate-400"
                                            placeholder="Paste the raw prompt, a description, or even a link to a prompt here..."
                                        />
                                    </div>

                                    {/* Optional Image URL */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-black uppercase flex items-center gap-2 text-black">
                                            <span className="w-3 h-3 bg-[#8B5CF6]"></span> Image URL (Optional)
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-black">
                                                <ImageIcon size={20} strokeWidth={2.5} />
                                            </div>
                                            <input
                                                value={imageUrlInput}
                                                onChange={e => setImageUrlInput(e.target.value)}
                                                className="w-full pl-12 pr-4 py-4 border-4 border-black font-black text-lg focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all outline-none bg-white placeholder:text-slate-400"
                                                placeholder="https://your-bucket.com/preview.png"
                                            />
                                        </div>
                                    </div>

                                    {/* Error Message */}
                                    {errorMessage && (
                                        <div className="p-4 bg-red-100 border-4 border-red-500 text-red-700 font-black text-sm shadow-[4px_4px_0px_0px_rgba(239,68,68,0.2)]">
                                            ⚠️ ERROR: {errorMessage}
                                        </div>
                                    )}

                                    {/* Action Button */}
                                    <button
                                        onClick={handleAIAnalyze}
                                        disabled={isAnalyzing || !rawInput.trim()}
                                        className="w-full py-5 bg-[#8B5CF6] text-white border-4 border-black font-black uppercase tracking-widest text-xl hover:bg-[#7C3AED] hover:translate-y-[-4px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:transform-none active:translate-y-0 active:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                                    >
                                        {isAnalyzing ? (
                                            <span className="flex items-center justify-center gap-3">
                                                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                AI IS ANALYZING...
                                            </span>
                                        ) : (
                                            <span className="flex items-center justify-center gap-3">
                                                <Sparkles size={24} />
                                                GENERATE EVERYTHING
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* --- NORMAL MODE / REVIEW MODE --- */
                        <>
                            {/* LEFT: Editor Form */}
                            <div className="flex-1 overflow-y-auto p-6 bg-white custom-scrollbar border-b-[3px] lg:border-b-0 lg:border-r-[3px] border-black">
                                <div className="space-y-8 max-w-2xl mx-auto">
                                    
                                    {isAdmin && (
                                        <div className="bg-blue-50 border-4 border-blue-600 p-4 mb-4 flex items-center justify-between shadow-[4px_4px_0px_0px_rgba(37,99,235,0.1)]">
                                            <div className="flex items-center gap-2 text-blue-900 font-black uppercase text-xs">
                                                <Eye size={16} strokeWidth={3} /> AI Review Mode: Check and refine the generated data.
                                            </div>
                                            <button 
                                                onClick={() => setIsWizardMode(true)}
                                                className="text-[10px] font-black uppercase underline hover:text-blue-700 transition-colors"
                                            >
                                                Redo AI Generation
                                            </button>
                                        </div>
                                    )}

                                    {/* Section: Metadata */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-black uppercase tracking-widest border-b-[3px] border-black pb-2 text-black flex items-center gap-2">
                                            <span className="w-2 h-2 bg-black"></span> 1. Metadata
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-xs font-black uppercase text-black">{t('addPrompt.form.title')} (EN)</label>
                                                <input
                                                    value={formData.title}
                                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                                    className="w-full p-2 border-[2.5px] border-black font-bold focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[-2px] focus:translate-y-[-2px] transition-all outline-none bg-white"
                                                    placeholder="Prompt Title"
                                                />
                                            </div>
                                            {isAdmin && (
                                                <div className="space-y-1">
                                                    <label className="text-xs font-black uppercase text-black">Title (ZH)</label>
                                                    <input
                                                        value={formData.titleZh}
                                                        onChange={e => setFormData({ ...formData, titleZh: e.target.value })}
                                                        className="w-full p-2 border-[2.5px] border-black font-bold focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[-2px] focus:translate-y-[-2px] transition-all outline-none bg-white"
                                                        placeholder="中文标题"
                                                    />
                                                </div>
                                            )}
                                            <div className="space-y-1">
                                                <label className="text-xs font-black uppercase text-black">{t('addPrompt.form.category')}</label>
                                                <select
                                                    value={formData.category}
                                                    onChange={e => setFormData({ ...formData, category: e.target.value as Category })}
                                                    className="w-full p-2 border-[2.5px] border-black font-black outline-none bg-white cursor-pointer"
                                                >
                                                    {Object.keys(Category).filter(k => k !== 'ALL').map(key => (
                                                        <option key={key} value={Category[key as keyof typeof Category]}>
                                                            {t(`categories.${key}`)}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-xs font-black uppercase text-black">{t('addPrompt.form.description')} (EN)</label>
                                                <textarea
                                                    value={formData.description}
                                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                                    className="w-full p-2 border-[2.5px] border-black font-bold text-sm outline-none resize-none h-24 bg-white"
                                                    placeholder="Short description for the card..."
                                                />
                                            </div>
                                            {isAdmin && (
                                                <div className="space-y-1">
                                                    <label className="text-xs font-black uppercase text-black">Description (ZH)</label>
                                                    <textarea
                                                        value={formData.descriptionZh}
                                                        onChange={e => setFormData({ ...formData, descriptionZh: e.target.value })}
                                                        className="w-full p-2 border-[2.5px] border-black font-bold text-sm outline-none resize-none h-24 bg-white"
                                                        placeholder="中文描述..."
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-xs font-black uppercase text-black">{t('addPrompt.form.tags')}</label>
                                            <div className="flex flex-wrap gap-2 p-2 border-[2.5px] border-black bg-white min-h-[46px]">
                                                {formData.tags?.map(tag => (
                                                    <span key={tag} className="bg-black text-white px-2 py-1 text-xs font-black flex items-center gap-1">
                                                        {tag}
                                                        <button onClick={() => removeTag(tag)} className="hover:text-red-400 transition-colors"><X size={12} strokeWidth={3} /></button>
                                                    </span>
                                                ))}
                                                <input
                                                    value={tagInput}
                                                    onChange={e => setTagInput(e.target.value)}
                                                    onKeyDown={handleAddTag}
                                                    className="flex-1 outline-none text-sm font-black min-w-[80px] bg-transparent"
                                                    placeholder="Add tag + Enter"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section: Content */}
                                    <div className="space-y-4 pt-4">
                                        <h3 className="text-sm font-black uppercase tracking-widest border-b-[3px] border-black pb-2 text-black flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 bg-red-500"></span> 2. Content
                                            </div>
                                            <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 font-black animate-pulse">REQUIRED</span>
                                        </h3>

                                        <div className="space-y-1">
                                            <label className="text-xs font-black uppercase text-black">English Content (JSON Compatible)</label>
                                            <textarea
                                                value={formData.content}
                                                onChange={e => setFormData({ ...formData, content: e.target.value })}
                                                className="w-full p-4 border-[2.5px] border-black font-mono text-sm leading-relaxed outline-none h-48 bg-[#1a1a1a] text-[#4ade80] shadow-inner focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                                                placeholder="Paste your English prompt here..."
                                            />
                                        </div>
                                        <div className="space-y-1 pt-2">
                                            <label className="text-xs font-black uppercase text-black">Chinese Content (Optional)</label>
                                            <textarea
                                                value={formData.chineseContent}
                                                onChange={e => setFormData({ ...formData, chineseContent: e.target.value })}
                                                className="w-full p-4 border-[2.5px] border-black font-mono text-sm leading-relaxed outline-none h-40 bg-slate-50 text-slate-900 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                                                placeholder="中文翻译..."
                                            />
                                        </div>
                                    </div>

                                    {!isAdmin && (
                                        /* Section: Contact (Optional) */
                                        <div className="space-y-4 pt-4">
                                            <h3 className="text-sm font-black uppercase tracking-widest border-b-[3px] border-black pb-2 text-black">
                                                <span className="w-2 h-2 bg-blue-500 mr-2 inline-block"></span> 3. Contact (Optional)
                                            </h3>
                                            <div className="space-y-1">
                                                <label className="text-xs font-black uppercase text-black">Email for Updates</label>
                                                <input
                                                    value={contactEmail}
                                                    onChange={e => setContactEmail(e.target.value)}
                                                    className="w-full p-3 border-[2.5px] border-black font-black focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[-2px] focus:translate-y-[-2px] transition-all outline-none bg-white"
                                                    placeholder="your@email.com (optional)"
                                                    type="email"
                                                />
                                                <p className="text-[10px] text-slate-500 font-black uppercase mt-1">We'll notify you when your prompt is reviewed.</p>
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>

                            {/* RIGHT: Preview & Action */}
                            <div className="lg:w-[450px] bg-[#121212] flex flex-col border-l-[3px] border-black relative">
                                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/40">
                                    <h3 className="text-white font-black uppercase tracking-widest text-xs flex items-center gap-2">
                                        <Code size={16} strokeWidth={3} className="text-teal-400" /> JSON Preview
                                    </h3>
                                    <button
                                        onClick={handleCopy}
                                        className="bg-[#2DD4BF] hover:bg-[#1fbfa6] text-black px-4 py-2 text-xs font-black uppercase flex items-center gap-1.5 transition-all shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] active:translate-y-0.5"
                                    >
                                        {copied ? <Check size={14} strokeWidth={3} /> : <Copy size={14} strokeWidth={3} />}
                                        {copied ? 'Copied' : 'Copy JSON'}
                                    </button>
                                </div>

                                <div className="flex-1 overflow-auto p-5 custom-scrollbar bg-[#0a0a0a]">
                                    <pre className="text-[12px] font-mono text-[#e0e0e0] leading-relaxed whitespace-pre-wrap break-all selection:bg-teal-500 selection:text-black">
                                        {generatedCode}
                                    </pre>
                                </div>

                                <div className="p-6 bg-[#1a1a1a] border-t-2 border-white/10 space-y-4 relative overflow-hidden">
                                    {/* Submit Button */}
                                    <button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting || !formData.title || !formData.content}
                                        className={`w-full py-4 px-6 font-black uppercase text-base flex items-center justify-center gap-3 transition-all border-2 border-black ${submitStatus === 'success' ? 'bg-green-500 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' :
                                            submitStatus === 'error' ? 'bg-red-500 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' :
                                                isSubmitting ? 'bg-slate-700 text-slate-400 cursor-not-allowed' :
                                                    'bg-[#FF4D4D] hover:bg-[#FF3333] text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none'
                                            }`}
                                    >
                                        {isSubmitting ? (
                                            <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> {isAdmin ? 'Publishing...' : 'Submitting...'}</>
                                        ) : submitStatus === 'success' ? (
                                            <><CheckCircle size={20} strokeWidth={3} /> {isAdmin ? 'Published!' : 'Submitted Successfully!'}</>
                                        ) : submitStatus === 'error' ? (
                                            <><XCircle size={20} strokeWidth={3} /> {isAdmin ? 'Publish Failed' : 'Submission Failed'}</>
                                        ) : (
                                            <><Send size={18} strokeWidth={3} /> {isAdmin ? 'Publish to Database' : 'Submit for AI Review'}</>
                                        )}
                                    </button>

                                    {submitStatus === 'success' && (
                                        <div className="bg-green-950/50 border border-green-500 p-3 text-center">
                                            <p className="text-green-400 text-xs font-black uppercase">
                                                {isAdmin ? 'Prompt successfully deployed!' : 'Thank you! AI Review in progress.'}
                                            </p>
                                        </div>
                                    )}
                                    {submitStatus === 'error' && (
                                        <div className="bg-red-950/50 border border-red-500 p-3 text-center">
                                            <p className="text-red-400 text-xs font-black uppercase">
                                                {errorMessage || 'An error occurred. Please try again.'}
                                            </p>
                                        </div>
                                    )}

                                    {/* Manual Instructions */}
                                    <div className="bg-white/5 p-4 border border-white/10 rounded-sm">
                                        <p className="text-slate-400 text-[10px] font-black uppercase mb-3 tracking-widest">Manual Publication:</p>
                                        <ol className="text-slate-200 text-xs space-y-2 list-decimal list-inside font-bold">
                                            <li>Click <span className="text-[#2DD4BF] underline">Copy JSON</span> above.</li>
                                            <li>Go to <code className="bg-black/50 px-1 py-0.5 rounded text-teal-300">src/data/prompts-en.ts</code>.</li>
                                            <li>Insert into the prompts array.</li>
                                        </ol>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Coming Soon Overlay (Only for non-admin) */}
                    {!isAdmin && (
                        <div className="absolute inset-0 backdrop-blur-sm bg-black/60 z-50 flex items-center justify-center">
                            <div className="bg-[#FACC15] border-4 border-black p-10 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] max-w-md text-center transform rotate-[-1deg]">
                                <div className="text-7xl mb-6 animate-bounce">🚧</div>
                                <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-4 text-black">
                                    {t('addPrompt.comingSoon.title', 'Coming Soon')}
                                </h3>
                                <div className="w-full h-1 bg-black mb-4"></div>
                                <p className="font-black text-black text-xl uppercase tracking-tight">
                                    {t('addPrompt.comingSoon.subtitle', '功能开发中，敬请期待')}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddPromptModal;
