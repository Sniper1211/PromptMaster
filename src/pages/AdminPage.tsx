
import React, { useState } from 'react';
import { ArrowLeft, Save, Check, AlertCircle, Wand2, Loader2, ChevronDown, ChevronUp, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Category } from '../types';

const AdminPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<'smart' | 'manual'>('smart');

  const toggleLanguage = () => {
    const currentLang = i18n.language;
    const isEnglish = currentLang.startsWith('en');
    const newLang = isEnglish ? 'zh' : 'en';
    i18n.changeLanguage(newLang);
  };
  
  // Smart Paste State
  const [rawText, setRawText] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'CODING',
    tags: '',
    content: '',
    chineseContent: '',
    expectedOutput: '',
    usage: ''
  });
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSmartAnalyze = async () => {
    if (!rawText.trim()) return;
    setIsAnalyzing(true);
    setAnalyzeError('');
    setShowDetails(true); // Auto expand form

    try {
      const res = await fetch('http://localhost:3001/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          rawText,
          apiKey: apiKey // Optional: user provided key
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.details || data.error || 'Analysis failed');
      }

      // Populate form
      setFormData({
        title: data.title || '',
        description: data.description || '',
        category: data.category || 'CODING',
        tags: Array.isArray(data.tags) ? data.tags.join(', ') : (data.tags || ''),
        content: data.content || '',
        chineseContent: data.chineseContent || '',
        expectedOutput: data.expectedOutput || '',
        usage: data.usage || ''
      });

    } catch (err: any) {
      setAnalyzeError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      };

      const res = await fetch('http://localhost:3001/api/prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage(`${t('admin.form.success')} ${data.id}`);
        // Clear inputs after success? Maybe not, in case user wants to add similar one.
      } else {
        throw new Error(data.error || t('admin.form.failed'));
      }
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f0f0] p-8 font-sans bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
      <div className="max-w-3xl mx-auto">
        <header className="flex items-center justify-between mb-8 bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <Link to="/" className="min-w-[160px] flex items-center justify-center gap-2 font-black uppercase tracking-tight text-black bg-white border-2 border-black px-4 py-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-300 hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none transition-all">
            <ArrowLeft size={20} strokeWidth={3} />
            {t('admin.backToHome')}
          </Link>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleLanguage}
              className="w-12 h-12 flex items-center justify-center bg-white border-2 border-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-100 active:translate-y-[2px] active:shadow-none transition-all"
              title="Switch Language"
            >
              <Globe size={24} strokeWidth={2.5} />
            </button>
            <h1 className="min-w-[140px] text-center text-xl font-black uppercase italic bg-yellow-400 px-2 border-2 border-black transform rotate-1">
              {t('admin.title')}
            </h1>
          </div>
        </header>

        {/* Status Message */}
        {status === 'success' && (
          <div className="mb-6 bg-green-100 border-[3px] border-green-600 text-green-900 p-4 flex items-center gap-3 font-bold shadow-[4px_4px_0px_0px_rgba(22,163,74,1)]">
            <Check size={24} strokeWidth={3} /> {message}
          </div>
        )}

        <div className="bg-white border-[3px] border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-8">
          
          {/* Smart Paste Section */}
          <section className="space-y-4 bg-indigo-50/50 p-6 border-[3px] border-indigo-900 -mx-2">
            <div className="flex items-center justify-between">
              <label className="text-base font-black uppercase tracking-widest flex items-center gap-2 text-indigo-900">
                <Wand2 size={24} className="text-indigo-600" strokeWidth={2.5} /> 
                {t('admin.smartPaste.title')}
              </label>
              
              <div className="flex items-center gap-2">
                <input 
                  type="password" 
                  placeholder={t('admin.smartPaste.apiKeyPlaceholder')} 
                  value={apiKey}
                  onChange={e => setApiKey(e.target.value)}
                  className="px-3 py-2 text-xs font-bold border-2 border-indigo-200 rounded focus:border-indigo-600 outline-none bg-white w-48 transition-all placeholder:text-indigo-300 text-indigo-900"
                />
              </div>
            </div>

            <p className="text-sm font-bold text-indigo-800/70">
              {t('admin.smartPaste.instruction')}
            </p>

            <textarea
              value={rawText}
              onChange={e => setRawText(e.target.value)}
              placeholder={t('admin.smartPaste.placeholder')}
              className="w-full p-4 border-[3px] border-indigo-200 focus:border-indigo-600 bg-white font-medium text-lg text-indigo-950 placeholder:text-indigo-300 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all min-h-[160px]"
            />
            
            {analyzeError && (
               <div className="bg-red-100 border-2 border-red-500 text-red-700 p-3 font-bold flex items-center gap-2">
                 <AlertCircle size={20} /> {analyzeError}
               </div>
            )}

            <button
              onClick={handleSmartAnalyze}
              disabled={isAnalyzing || !rawText.trim()}
              className="w-full py-4 bg-indigo-600 text-white font-black uppercase tracking-widest text-lg hover:bg-indigo-700 hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(49,46,129,1)] active:translate-y-[0px] active:shadow-none transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 size={24} className="animate-spin" /> {t('admin.smartPaste.analyzing')}
                </>
              ) : (
                <>
                  <Wand2 size={24} /> {t('admin.smartPaste.button')}
                </>
              )}
            </button>
          </section>

          <hr className="border-t-4 border-dashed border-gray-300 my-8" />

          {/* Manual Form (Collapsible) */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <button 
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className="w-full flex items-center justify-between p-4 bg-gray-100 border-2 border-black font-black text-gray-700 hover:bg-gray-200 hover:text-black uppercase tracking-wide transition-colors"
            >
              <span className="flex items-center gap-2">
                {showDetails ? t('admin.form.hideDetails') : t('admin.form.editDetails')}
              </span>
              {showDetails ? <ChevronUp size={20} strokeWidth={3} /> : <ChevronDown size={20} strokeWidth={3} />}
            </button>

            {showDetails && (
              <div className="space-y-6 animate-in fade-in slide-in-from-top-4 pt-4">
                {/* Title & Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 flex flex-col">
                    <label className="text-sm font-black uppercase tracking-widest text-black min-h-[20px] flex items-center">{t('admin.form.title')}</label>
                    <input
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className="w-full h-[60px] px-4 border-[4px] border-black font-black text-xl text-black bg-white focus:outline-none focus:ring-4 focus:ring-yellow-200 placeholder:text-gray-400"
                      placeholder="ENTER TITLE HERE..."
                    />
                  </div>
                  <div className="space-y-2 flex flex-col">
                    <label className="text-sm font-black uppercase tracking-widest text-black min-h-[20px] flex items-center">{t('admin.form.category')}</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full h-[60px] px-4 border-[4px] border-black font-black text-xl text-black bg-white focus:outline-none focus:ring-4 focus:ring-yellow-200 cursor-pointer"
                    >
                      {Object.keys(Category).filter(k => k !== 'ALL').map(cat => (
                        <option key={cat} value={cat}>{t(`categories.${cat}`, cat)}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2 flex flex-col">
                  <label className="text-xs font-black uppercase tracking-widest text-zinc-800 min-h-[16px] flex items-center">{t('admin.form.description')}</label>
                  <input
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full h-[52px] px-3 border-[3px] border-black font-medium text-gray-800 focus:outline-none focus:ring-4 focus:ring-yellow-200 placeholder:text-gray-300"
                  />
                </div>

                {/* Content (English) */}
                <div className="space-y-2 flex flex-col">
                  <label className="text-xs font-black uppercase tracking-widest text-zinc-800 flex justify-between min-h-[16px] items-center">
                    {t('admin.form.content')}
                    <span className="text-red-500">* {t('admin.form.required')}</span>
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    required
                    rows={8}
                    className="w-full p-3 border-[3px] border-black font-mono text-sm font-medium text-gray-800 focus:outline-none focus:ring-4 focus:ring-yellow-200 bg-slate-50 placeholder:text-gray-300 min-h-[200px]"
                  />
                </div>

                {/* Content (Chinese) */}
                <div className="space-y-2 flex flex-col">
                  <label className="text-xs font-black uppercase tracking-widest text-zinc-800 min-h-[16px] flex items-center">{t('admin.form.chineseContent')}</label>
                  <textarea
                    name="chineseContent"
                    value={formData.chineseContent}
                    onChange={handleChange}
                    rows={4}
                    className="w-full p-3 border-[3px] border-black font-mono text-sm font-medium text-gray-800 focus:outline-none focus:ring-4 focus:ring-yellow-200 bg-slate-50 placeholder:text-gray-300 min-h-[120px]"
                  />
                </div>

                {/* Tags */}
                <div className="space-y-2 flex flex-col">
                  <label className="text-xs font-black uppercase tracking-widest text-zinc-800 min-h-[16px] flex items-center">{t('admin.form.tags')}</label>
                  <input
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder={t('admin.form.tagsPlaceholder')}
                    className="w-full h-[52px] px-3 border-[3px] border-black font-bold text-blue-600 focus:outline-none focus:ring-4 focus:ring-yellow-200 placeholder:text-gray-300"
                  />
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 flex flex-col">
                    <label className="text-xs font-black uppercase tracking-widest text-zinc-800 min-h-[16px] flex items-center">{t('admin.form.expectedOutput')}</label>
                    <input
                      name="expectedOutput"
                      value={formData.expectedOutput}
                      onChange={handleChange}
                      className="w-full h-[52px] px-3 border-[3px] border-black font-medium text-gray-800 focus:outline-none focus:ring-4 focus:ring-yellow-200 placeholder:text-gray-300"
                    />
                  </div>
                  <div className="space-y-2 flex flex-col">
                    <label className="text-xs font-black uppercase tracking-widest text-zinc-800 min-h-[16px] flex items-center">{t('admin.form.usage')}</label>
                    <input
                      name="usage"
                      value={formData.usage}
                      onChange={handleChange}
                      className="w-full h-[52px] px-3 border-[3px] border-black font-medium text-gray-800 focus:outline-none focus:ring-4 focus:ring-yellow-200 placeholder:text-gray-300"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full min-h-[72px] bg-black text-white font-black uppercase tracking-widest text-xl hover:bg-[#FACC15] hover:text-black hover:translate-y-[-4px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-[0px] active:shadow-none transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? t('admin.form.saving') : (
                <>
                  <Save size={24} /> {t('admin.form.save')}
                </>
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
