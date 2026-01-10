import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Copy, Check, Eye, Code } from 'lucide-react';

import { Category, Prompt } from '../../types';

interface AddPromptModalProps {
    onClose: () => void;
    nextId: string;
}

const AddPromptModal: React.FC<AddPromptModalProps> = ({ onClose, nextId }) => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
    const [copied, setCopied] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');


    const [formData, setFormData] = useState<Partial<Prompt>>({
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
        const { ...promptData } = formData;
        return JSON.stringify(promptData, null, 2);
    }, [formData]);

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSave = async () => {
        setIsSaving(true);
        setSaveStatus('idle');
        try {
            const response = await fetch('/api/save-prompt', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: generatedCode,
            });

            if (response.ok) {
                setSaveStatus('success');
                setTimeout(() => {
                    onClose();
                    window.location.reload(); // Reload to see the new prompt
                }, 1500);
            } else {
                setSaveStatus('error');
            }
        } catch (error) {
            console.error('Save failed:', error);
            setSaveStatus('error');
        } finally {
            setIsSaving(false);
        }
    };


    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/40 backdrop-blur-sm">
            <div className="bg-white border-[3px] border-black rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="p-6 border-b-[3px] border-black flex items-center justify-between bg-[#A5D8FF]">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-black rounded-xl text-white">
                            <Code size={24} />
                        </div>
                        <h2 className="text-2xl font-black italic uppercase tracking-tight">{t('addPrompt.title')}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-black/10 rounded-xl transition-colors border-[2.5px] border-transparent hover:border-black"
                    >
                        <X size={24} strokeWidth={3} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b-[3px] border-black bg-gray-50">
                    <button
                        onClick={() => setActiveTab('edit')}
                        className={`flex-1 py-4 font-black uppercase italic tracking-wider flex items-center justify-center gap-2 transition-all ${activeTab === 'edit' ? 'bg-white' : 'hover:bg-black/5 border-r-[3px] border-black'}`}
                    >
                        <EditIcon size={18} /> {t('addPrompt.tabs.editor')}
                    </button>
                    <button
                        onClick={() => setActiveTab('preview')}
                        className={`flex-1 py-4 font-black uppercase italic tracking-wider flex items-center justify-center gap-2 transition-all ${activeTab === 'preview' ? 'bg-white' : 'hover:bg-black/5 border-l-[3px] border-black'}`}
                    >
                        <Eye size={18} /> {t('addPrompt.tabs.preview')}
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-white">
                    {activeTab === 'edit' ? (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Basic Info */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">{t('addPrompt.form.title')}</label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                                            placeholder={t('addPrompt.form.titlePlaceholder')}
                                            className="w-full bg-white border-[3px] border-black rounded-xl px-4 py-3 font-bold focus:outline-none focus:ring-0 focus:translate-x-[2px] focus:translate-y-[2px] transition-transform placeholder:text-slate-300"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">{t('addPrompt.form.category')}</label>
                                            <select
                                                value={formData.category}
                                                onChange={e => setFormData({ ...formData, category: e.target.value as Category })}
                                                className="w-full bg-white border-[3px] border-black rounded-xl px-4 py-3 font-bold focus:outline-none focus:ring-0"
                                            >
                                                {Object.values(Category).filter(c => c !== Category.ALL).map(cat => (
                                                    <option key={cat} value={cat}>{t(`categories.${cat}`)}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">{t('addPrompt.form.model')}</label>
                                            <input
                                                type="text"
                                                value={formData.model}
                                                onChange={e => setFormData({ ...formData, model: e.target.value })}
                                                placeholder="GPT-4o"
                                                className="w-full bg-white border-[3px] border-black rounded-xl px-4 py-3 font-bold focus:outline-none focus:ring-0"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">{t('addPrompt.form.tags')}</label>
                                        <div className="min-h-[50px] bg-white border-[3px] border-black rounded-xl p-2 flex flex-wrap gap-2">
                                            {formData.tags?.map(tag => (
                                                <span key={tag} className="bg-[#FFEB3B] text-black px-2 py-1 rounded-lg border-[2px] border-black text-xs font-black flex items-center gap-1">
                                                    {tag}
                                                    <button onClick={() => removeTag(tag)}><X size={12} strokeWidth={4} /></button>
                                                </span>
                                            ))}
                                            <input
                                                type="text"
                                                value={tagInput}
                                                onChange={e => setTagInput(e.target.value)}
                                                onKeyDown={handleAddTag}
                                                placeholder={t('addPrompt.form.tagPlaceholder')}
                                                className="flex-1 min-w-[100px] border-none focus:ring-0 outline-none font-bold text-sm h-8"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">{t('addPrompt.form.description')}</label>
                                        <textarea
                                            rows={2}
                                            value={formData.description}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                            placeholder={t('addPrompt.form.descPlaceholder')}
                                            className="w-full bg-white border-[3px] border-black rounded-xl px-4 py-3 font-bold focus:outline-none focus:ring-0 resize-none h-full h-[185px]"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t-[3px] border-black pt-6">
                                {/* Content EN */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-500">{t('addPrompt.form.contentEn')}</label>
                                        <span className="text-[10px] font-black bg-blue-100 px-2 py-0.5 border-black border-[1.5px] rounded-full uppercase italic">{t('addPrompt.form.mandatory')}</span>
                                    </div>
                                    <textarea
                                        rows={6}
                                        value={formData.content}
                                        onChange={e => setFormData({ ...formData, content: e.target.value })}
                                        placeholder={t('addPrompt.form.contentEnPlaceholder')}
                                        className="w-full bg-slate-50 border-[3px] border-black rounded-xl px-4 py-3 font-mono text-sm focus:outline-none focus:ring-0"
                                    />
                                </div>
                                {/* Content ZH */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-500">{t('addPrompt.form.contentZh')}</label>
                                        <span className="text-[10px] font-black bg-gray-100 px-2 py-0.5 border-black border-[1.5px] rounded-full uppercase italic">{t('addPrompt.form.optional')}</span>
                                    </div>
                                    <textarea
                                        rows={6}
                                        value={formData.chineseContent}
                                        onChange={e => setFormData({ ...formData, chineseContent: e.target.value })}
                                        placeholder={t('addPrompt.form.contentZhPlaceholder')}
                                        className="w-full bg-slate-50 border-[3px] border-black rounded-xl px-4 py-3 font-mono text-sm focus:outline-none focus:ring-0"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">{t('addPrompt.form.expectedOutput')}</label>
                                    <input
                                        type="text"
                                        value={formData.expectedOutput}
                                        onChange={e => setFormData({ ...formData, expectedOutput: e.target.value })}
                                        placeholder={t('addPrompt.form.outputPlaceholder')}
                                        className="w-full bg-white border-[3px] border-black rounded-xl px-4 py-3 font-bold focus:outline-none focus:ring-0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">{t('addPrompt.form.usage')}</label>
                                    <input
                                        type="text"
                                        value={formData.usage}
                                        onChange={e => setFormData({ ...formData, usage: e.target.value })}
                                        placeholder={t('addPrompt.form.usagePlaceholder')}
                                        className="w-full bg-white border-[3px] border-black rounded-xl px-4 py-3 font-bold focus:outline-none focus:ring-0"
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                            <div className="bg-[#FFF066] border-[3px] border-black p-4 rounded-2xl">
                                <p className="text-xs font-black uppercase tracking-tighter">
                                    <span className="bg-black text-white px-2 py-0.5 rounded mr-2">{t('addPrompt.preview.notice')}</span>
                                    {t('addPrompt.preview.noticeText')}
                                </p>
                            </div>

                            <div className="relative group">
                                <div className="absolute top-4 right-4 z-10">
                                    <button
                                        onClick={handleCopy}
                                        className="flex items-center gap-2 bg-white border-[2.5px] border-black px-4 py-2 font-black uppercase italic text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all"
                                    >
                                        {copied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                                        {copied ? t('addPrompt.preview.copied') : t('addPrompt.preview.copyCode')}
                                    </button>
                                </div>
                                <div className="bg-black text-green-400 p-6 rounded-2xl font-mono text-sm overflow-x-auto max-h-[300px] custom-scrollbar border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)]">
                                    <pre>{generatedCode}</pre>
                                </div>
                            </div>

                            <div className="border-t-[3px] border-black pt-6">
                                <h3 className="text-xl font-black italic uppercase tracking-tight mb-4 flex items-center gap-2">
                                    <span className="w-6 h-6 bg-black rounded-full text-white text-[10px] flex items-center justify-center not-italic">?</span>
                                    {t('addPrompt.preview.howTo')}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="border-[3px] border-black p-4 rounded-xl hover:bg-black/5 cursor-pointer transition-colors flex items-start gap-3 group">
                                        <div className="w-8 h-8 rounded-lg bg-[#FF89BB] border-[2px] border-black flex items-center justify-center shrink-0">
                                            <span className="font-black text-xs">1</span>
                                        </div>
                                        <div>
                                            <p className="font-black text-sm uppercase">{t('addPrompt.preview.step1Title')}</p>
                                            <p className="text-xs text-slate-500 font-bold mt-1">{t('addPrompt.preview.step1Desc')}</p>
                                        </div>
                                    </div>
                                    <div
                                        onClick={handleSave}
                                        className={`border-[3px] border-black p-4 rounded-xl hover:bg-black/5 cursor-pointer transition-colors flex items-start gap-3 group ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-[#66D9E8] border-[2px] border-black flex items-center justify-center shrink-0">
                                            {isSaving ? <span className="animate-spin text-xs">🌀</span> : <span className="font-black text-xs">2</span>}
                                        </div>
                                        <div>
                                            <p className="font-black text-sm uppercase">{t('addPrompt.preview.step2Title')}</p>
                                            <p className="text-xs text-slate-500 font-bold mt-1">
                                                {saveStatus === 'success' ? t('addPrompt.preview.success') :
                                                    saveStatus === 'error' ? t('addPrompt.preview.error') :
                                                        t('addPrompt.preview.step2Desc')}
                                            </p>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t-[3px] border-black flex items-center justify-between bg-white">
                    <p className="text-xs text-slate-400 font-bold italic">PROMPT_ID: {formData.id}</p>
                    <div className="flex gap-4">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 font-black uppercase italic border-[3px] border-black rounded-xl hover:bg-black/5 transition-all text-sm"
                        >
                            {t('addPrompt.buttons.cancel')}
                        </button>
                        <button
                            onClick={() => {
                                if (activeTab === 'edit') setActiveTab('preview');
                                else handleCopy();
                            }}
                            className={`px-8 py-3 font-black uppercase italic border-[3px] border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-2 text-sm ${activeTab === 'edit' ? 'bg-[#FF89BB]' : 'bg-[#6EE7B7]'}`}
                        >
                            {activeTab === 'edit' ? t('addPrompt.buttons.next') : t('addPrompt.buttons.copyFinal')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const EditIcon = ({ size }: { size: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
);

export default AddPromptModal;
