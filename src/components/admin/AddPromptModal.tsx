import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Copy, Check, Code, Terminal, Send } from 'lucide-react';

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
                            <h2 className="text-xl md:text-2xl font-black uppercase italic tracking-tighter">
                                {isAdmin ? 'Admin: Add Prompt' : 'JSON Generator'}
                            </h2>
                            <p className="text-xs font-bold uppercase tracking-widest opacity-70">
                                {isAdmin ? (isWizardMode ? 'Step 1: AI Magic Box' : 'Step 2: Review & Publish') : 'Create & Export Prompt Data'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {isAdmin && !isWizardMode && (
                            <button 
                                onClick={() => setIsWizardMode(true)}
                                className="px-3 py-1.5 bg-white border-2 border-black font-black uppercase text-xs flex items-center gap-2 hover:bg-slate-100"
                            >
                                <Edit3 size={14} /> Back to Input
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-black hover:text-white transition-colors border-[2.5px] border-black bg-white"
                        >
                            <X size={20} strokeWidth={3} />
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
                    
                    {/* --- ADMIN WIZARD MODE (Simplified Input) --- */}
                    {isAdmin && isWizardMode ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#F8FAFC] overflow-y-auto">
                            <div className="w-full max-w-3xl space-y-8">
                                <div className="text-center space-y-2">
                                    <div className="inline-block p-4 bg-yellow-300 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4">
                                        <Sparkles size={40} className="text-black" />
                                    </div>
                                    <h3 className="text-3xl font-black uppercase tracking-tight italic">AI Magic Submission</h3>
                                    <p className="font-bold text-slate-500 uppercase text-sm tracking-widest">Just paste, we'll do the rest.</p>
                                </div>

                                <div className="space-y-6">
                                    {/* Raw Text Input */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-black uppercase flex items-center gap-2">
                                            <span className="w-2 h-2 bg-black"></span> Paste Prompt Content (Any Language)
                                        </label>
                                        <textarea
                                            value={rawInput}
                                            onChange={e => setRawInput(e.target.value)}
                                            className="w-full h-64 p-6 border-4 border-black font-medium text-lg focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] focus:-translate-x-1 focus:-translate-y-1 transition-all outline-none resize-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                                            placeholder="Paste the raw prompt, a description, or even a link to a prompt here..."
                                        />
                                    </div>

                                    {/* Optional Image URL */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-black uppercase flex items-center gap-2">
                                            <span className="w-2 h-2 bg-purple-500"></span> Image URL (Optional)
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                                <ImageIcon size={20} />
                                            </div>
                                            <input
                                                value={imageUrlInput}
                                                onChange={e => setImageUrlInput(e.target.value)}
                                                className="w-full pl-12 pr-4 py-4 border-4 border-black font-bold text-lg focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all outline-none"
                                                placeholder="https://your-bucket.com/preview.png"
                                            />
                                        </div>
                                    </div>

                                    {/* Error Message */}
                                    {errorMessage && (
                                        <div className="p-4 bg-red-100 border-2 border-red-500 text-red-700 font-bold text-sm">
                                            ⚠️ {errorMessage}
                                        </div>
                                    )}

                                    {/* Action Button */}
                                    <button
                                        onClick={handleAIAnalyze}
                                        disabled={isAnalyzing || !rawInput.trim()}
                                        className="w-full py-5 bg-black text-white border-4 border-black font-black uppercase tracking-widest text-xl hover:bg-[#8B5CF6] hover:translate-y-[-4px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:transform-none active:translate-y-0 active:shadow-none"
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
                            <div className="flex-1 overflow-y-auto p-6 bg-gray-50 custom-scrollbar border-b-[3px] lg:border-b-0 lg:border-r-[3px] border-black">
                                <div className="space-y-8 max-w-2xl mx-auto">
                                    
                                    {isAdmin && (
                                        <div className="bg-blue-50 border-2 border-blue-500 p-4 mb-4 flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-blue-800 font-bold uppercase text-xs">
                                                <Eye size={16} /> AI Review Mode: Check and refine the generated data.
                                            </div>
                                            <button 
                                                onClick={() => setIsWizardMode(true)}
                                                className="text-[10px] font-black uppercase underline hover:text-blue-600"
                                            >
                                                Redo AI Generation
                                            </button>
                                        </div>
                                    )}

                                    {/* Section: Metadata */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-black uppercase tracking-widest border-b-[2px] border-black pb-2">1. Metadata</h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold uppercase">{t('addPrompt.form.title')} (EN)</label>
                                                <input
                                                    value={formData.title}
                                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                                    className="w-full p-2 border-[2px] border-black font-bold focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[-2px] focus:translate-y-[-2px] transition-all outline-none"
                                                    placeholder="Prompt Title"
                                                />
                                            </div>
                                            {isAdmin && (
                                                <div className="space-y-1">
                                                    <label className="text-xs font-bold uppercase">Title (ZH)</label>
                                                    <input
                                                        value={formData.titleZh}
                                                        onChange={e => setFormData({ ...formData, titleZh: e.target.value })}
                                                        className="w-full p-2 border-[2px] border-black font-bold focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[-2px] focus:translate-y-[-2px] transition-all outline-none"
                                                        placeholder="中文标题"
                                                    />
                                                </div>
                                            )}
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold uppercase">{t('addPrompt.form.category')}</label>
                                                <select
                                                    value={formData.category}
                                                    onChange={e => setFormData({ ...formData, category: e.target.value as Category })}
                                                    className="w-full p-2 border-[2px] border-black font-bold outline-none bg-white"
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
                                                <label className="text-xs font-bold uppercase">{t('addPrompt.form.description')} (EN)</label>
                                                <textarea
                                                    value={formData.description}
                                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                                    className="w-full p-2 border-[2px] border-black font-medium text-sm outline-none resize-none h-20"
                                                    placeholder="Short description for the card..."
                                                />
                                            </div>
                                            {isAdmin && (
                                                <div className="space-y-1">
                                                    <label className="text-xs font-bold uppercase">Description (ZH)</label>
                                                    <textarea
                                                        value={formData.descriptionZh}
                                                        onChange={e => setFormData({ ...formData, descriptionZh: e.target.value })}
                                                        className="w-full p-2 border-[2px] border-black font-medium text-sm outline-none resize-none h-20"
                                                        placeholder="中文描述..."
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-xs font-bold uppercase">{t('addPrompt.form.tags')}</label>
                                            <div className="flex flex-wrap gap-2 p-2 border-[2px] border-black bg-white min-h-[42px]">
                                                {formData.tags?.map(tag => (
                                                    <span key={tag} className="bg-black text-white px-2 py-0.5 text-xs font-bold flex items-center gap-1">
                                                        {tag}
                                                        <button onClick={() => removeTag(tag)} className="hover:text-red-400"><X size={10} /></button>
                                                    </span>
                                                ))}
                                                <input
                                                    value={tagInput}
                                                    onChange={e => setTagInput(e.target.value)}
                                                    onKeyDown={handleAddTag}
                                                    className="flex-1 outline-none text-sm font-bold min-w-[60px]"
                                                    placeholder="Press Enter..."
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section: Content */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-black uppercase tracking-widest border-b-[2px] border-black pb-2 flex justify-between">
                                            2. Content
                                            <span className="text-[10px] bg-red-500 text-white px-2 py-0.5">IMPORTANT</span>
                                        </h3>

                                        <div className="space-y-1">
                                            <label className="text-xs font-bold uppercase">English Content (JSON Compatible)</label>
                                            <textarea
                                                value={formData.content}
                                                onChange={e => setFormData({ ...formData, content: e.target.value })}
                                                className="w-full p-3 border-[2px] border-black font-mono text-xs leading-relaxed outline-none h-40 bg-[#1a1a1a] text-green-400"
                                                placeholder="Paste your English prompt here..."
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold uppercase">Chinese Content (Optional)</label>
                                            <textarea
                                                value={formData.chineseContent}
                                                onChange={e => setFormData({ ...formData, chineseContent: e.target.value })}
                                                className="w-full p-3 border-[2px] border-black font-mono text-xs leading-relaxed outline-none h-32"
                                                placeholder="中文翻译..."
                                            />
                                        </div>
                                    </div>

                                    {!isAdmin && (
                                        /* Section: Contact (Optional) */
                                        <div className="space-y-4">
                                            <h3 className="text-sm font-black uppercase tracking-widest border-b-[2px] border-black pb-2">3. Contact (Optional)</h3>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold uppercase">Email for Updates</label>
                                                <input
                                                    value={contactEmail}
                                                    onChange={e => setContactEmail(e.target.value)}
                                                    className="w-full p-2 border-[2px] border-black font-bold focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[-2px] focus:translate-y-[-2px] transition-all outline-none"
                                                    placeholder="your@email.com (optional)"
                                                    type="email"
                                                />
                                                <p className="text-[10px] text-gray-500 font-medium">We'll notify you when your prompt is reviewed.</p>
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>

                            {/* RIGHT: Preview & Action */}
                            <div className="lg:w-[450px] bg-[#2d2d2d] flex flex-col border-l-[3px] border-black relative">
                                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                                    <h3 className="text-white font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                                        <Code size={16} /> JSON Preview
                                    </h3>
                                    <button
                                        onClick={handleCopy}
                                        className="bg-[#2DD4BF] hover:bg-[#20AFA0] text-black px-3 py-1.5 text-xs font-black uppercase flex items-center gap-1 transition-colors"
                                    >
                                        {copied ? <Check size={14} /> : <Copy size={14} />}
                                        {copied ? 'Copied' : 'Copy JSON'}
                                    </button>
                                </div>

                                <div className="flex-1 overflow-auto p-4 custom-scrollbar">
                                    <pre className="text-[11px] font-mono text-[#d4d4d4] leading-relaxed whitespace-pre-wrap break-all">
                                        {generatedCode}
                                    </pre>
                                </div>

                                <div className="p-6 bg-[#1a1a1a] border-t border-gray-700 space-y-4 relative overflow-hidden">
                                    {/* Submit Button */}
                                    <button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting || !formData.title || !formData.content}
                                        className={`w-full py-3 px-4 font-black uppercase text-sm flex items-center justify-center gap-2 transition-all ${submitStatus === 'success' ? 'bg-green-500 text-white' :
                                            submitStatus === 'error' ? 'bg-red-500 text-white' :
                                                isSubmitting ? 'bg-gray-600 text-gray-300 cursor-not-allowed' :
                                                    'bg-[#FF4D4D] hover:bg-[#FF3333] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none'
                                            }`}
                                    >
                                        {isSubmitting ? (
                                            <><span className="animate-spin">⏳</span> {isAdmin ? 'Publishing...' : 'Submitting...'}</>
                                        ) : submitStatus === 'success' ? (
                                            <><Check size={16} /> {isAdmin ? 'Published!' : 'Submitted Successfully!'}</>
                                        ) : submitStatus === 'error' ? (
                                            <>❌ {isAdmin ? 'Publish Failed' : 'Submission Failed'}</>
                                        ) : (
                                            <><Send size={16} /> {isAdmin ? 'Publish to Database' : 'Submit for AI Review'}</>
                                        )}
                                    </button>

                                    {submitStatus === 'success' && (
                                        <p className="text-green-400 text-xs text-center font-medium">
                                            {isAdmin ? 'Prompt has been added to the database!' : 'Your prompt will be reviewed soon!'}
                                        </p>
                                    )}
                                    {submitStatus === 'error' && (
                                        <p className="text-red-400 text-xs text-center font-medium">
                                            {errorMessage || 'Please try again or copy JSON manually.'}
                                        </p>
                                    )}

                                    {/* Manual Instructions */}
                                    <div className="bg-[#333] p-4 rounded border border-gray-600">
                                        <p className="text-gray-400 text-[10px] font-bold uppercase mb-2">Or publish manually:</p>
                                        <ol className="text-gray-300 text-xs space-y-2 list-decimal list-inside font-medium">
                                            <li>Click <span className="text-[#2DD4BF]">Copy JSON</span> above.</li>
                                            <li>Open <code className="bg-black px-1 py-0.5 rounded">src/data/prompts-en.ts</code>.</li>
                                            <li>Paste into the prompts array.</li>
                                        </ol>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Coming Soon Overlay (Only for non-admin) */}
                    {!isAdmin && (
                        <div className="absolute inset-0 backdrop-blur-sm bg-black/50 z-50 flex items-center justify-center">
                            <div className="bg-[#FACC15] border-[3px] border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] max-w-md text-center transform rotate-[-2deg]">
                                <div className="text-6xl mb-4 animate-bounce">🚧</div>
                                <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-2 text-black">
                                    {t('addPrompt.comingSoon.title', 'Coming Soon')}
                                </h3>
                                <p className="font-bold text-black border-t-[2px] border-black pt-2 mt-2 text-lg">
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
