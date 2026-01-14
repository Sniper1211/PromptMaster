
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Check, AlertCircle, Wand2, Loader2, ChevronDown, ChevronUp, Globe, Lock } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Category, Prompt } from '../types';

const AdminPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // --- Auth State ---
  const [adminPassword, setAdminPassword] = useState(() => {
    // Try to restore from sessionStorage
    return typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('admin_password') || '' : '';
  });
  const [isAuthenticated, setIsAuthenticated] = useState(!!adminPassword);
  const [authError, setAuthError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsVerifying(true);

    try {
      const res = await fetch('/api/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPassword })
      });

      if (res.ok) {
        sessionStorage.setItem('admin_password', adminPassword);
        // Force reload to ensure clean state and avoid rendering glitches
        window.location.reload();
      } else {
        setAuthError('Access Denied');
        sessionStorage.removeItem('admin_password');
      }
    } catch (err) {
      setAuthError('Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f0f0] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
        <form onSubmit={handleLogin} className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-6 max-w-md w-full mx-4">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-black flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Lock size={32} strokeWidth={2.5} className="text-yellow-400" />
            </div>
            <div className="mb-4">
              <h2 className="text-3xl font-black uppercase italic tracking-tighter bg-yellow-400 px-6 py-2 border-[3px] border-black inline-block transform -rotate-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                Admin Access
              </h2>
            </div>
            <p className="text-sm font-bold text-black uppercase tracking-widest mt-4">Please enter the secret key</p>
          </div>
          
          <div className="space-y-2">
            <input 
              type="password" 
              value={adminPassword}
              onChange={e => {
                setAdminPassword(e.target.value);
                setAuthError('');
              }}
              placeholder="ENTER PASSWORD..."
              className={`w-full h-14 px-4 border-[3px] border-black font-bold text-2xl text-black tracking-[0.2em] text-center focus:outline-none focus:ring-4 focus:ring-yellow-200 placeholder:text-slate-300 placeholder:tracking-normal placeholder:font-black placeholder:text-lg ${authError ? 'border-red-500 bg-red-50' : 'bg-white'}`}
              autoFocus
            />
            {authError && <p className="text-red-600 font-bold text-xs uppercase tracking-wide flex items-center justify-center gap-1"><AlertCircle size={14} /> {authError}</p>}
          </div>
          
          <button 
            type="submit" 
            disabled={isVerifying}
            className="w-full h-14 bg-black text-white font-black uppercase tracking-widest text-lg hover:bg-yellow-400 hover:text-black hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isVerifying ? <Loader2 size={24} className="animate-spin" /> : 'UNLOCK SYSTEM'}
          </button>
        </form>
      </div>
    );
  }
  // ------------------

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
    titleZh: '', // Added titleZh
    description: '',
    descriptionZh: '', // Added descriptionZh
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

  // Load data if in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      setShowDetails(true);
      setStatus('loading');
      
      fetch('/api/prompts')
        .then(async res => {
          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.error || errorData.message || `Request failed with status ${res.status}`);
          }
          return res.json();
        })
        .then((data: any[]) => { // data is array of prompts
          if (!Array.isArray(data)) {
            throw new Error('Invalid API response: Expected an array');
          }
          // Fix: Ensure loose comparison for ID (string vs number)
          const prompt = data.find(p => String(p.id) === String(id));
          if (prompt) {
            setFormData({
              title: prompt.titleEn || prompt.title || '',
              titleZh: prompt.titleZh || prompt.title || '',
              description: prompt.descriptionEn || prompt.description || '',
              descriptionZh: prompt.descriptionZh || prompt.description || '',
              category: prompt.category || 'CODING',
              tags: Array.isArray(prompt.tags) ? prompt.tags.join(', ') : (prompt.tags || ''),
              content: prompt.content || '',
              chineseContent: prompt.chineseContent || '',
              expectedOutput: prompt.expectedOutput || '',
              usage: prompt.usage || ''
            });
            setStatus('idle');
          } else {
            setStatus('error');
            setMessage(`Prompt not found (ID: ${id})`);
          }
        })
        .catch(err => {
          console.error('Error loading prompt:', err);
          setStatus('error');
          setMessage(err.message);
        });
    }
  }, [isEditMode, id]);

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
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminPassword}`
        },
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
        titleZh: data.titleZh || '', // Populate titleZh
        description: data.description || '',
        descriptionZh: data.descriptionZh || '', // Populate descriptionZh
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

      let res;
      const headers = { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminPassword}`
      };

      if (isEditMode && id) {
        res = await fetch(`/api/prompts/${id}`, {
          method: 'PUT',
          headers: headers,
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch('/api/prompts', {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(payload)
        });
      }

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage(isEditMode ? t('admin.form.success') : `${t('admin.form.success')} ${data.id}`);
        // Redirect after short delay? Or just show success.
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
              {isEditMode ? 'EDIT PROMPT' : t('admin.title')}
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
          
          {/* Smart Paste Section - Only show in Add Mode */}
          {!isEditMode && (
            <section className="space-y-4 bg-slate-50 p-6 border-[3px] border-black -mx-2">
              <div className="flex items-center justify-between">
                <label className="text-base font-black uppercase tracking-widest flex items-center gap-2 text-black">
                  <Wand2 size={24} className="text-black" strokeWidth={2.5} /> 
                  {t('admin.smartPaste.title')}
                </label>
                
                <div className="flex items-center gap-2">
                  <input 
                    type="password" 
                    placeholder={t('admin.smartPaste.apiKeyPlaceholder')} 
                    value={apiKey}
                    onChange={e => setApiKey(e.target.value)}
                    className="px-3 py-2 text-xs font-bold border-2 border-black rounded focus:border-black outline-none bg-white w-48 transition-all placeholder:text-slate-400 text-black"
                  />
                </div>
              </div>

              <p className="text-sm font-bold text-slate-700">
                {t('admin.smartPaste.instruction')}
              </p>

              <textarea
                value={rawText}
                onChange={e => setRawText(e.target.value)}
                placeholder={t('admin.smartPaste.placeholder')}
                className="w-full p-4 border-[3px] border-black focus:border-black bg-white font-medium text-lg text-black placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-yellow-200 transition-all min-h-[160px]"
              />
              
              {analyzeError && (
                 <div className="bg-red-100 border-2 border-red-500 text-red-900 p-3 font-bold flex items-center gap-2">
                   <AlertCircle size={20} /> {analyzeError}
                 </div>
              )}

              <button
                onClick={handleSmartAnalyze}
                disabled={isAnalyzing || !rawText.trim()}
                className="w-full min-h-[64px] bg-black text-white font-black uppercase tracking-widest text-lg hover:bg-yellow-400 hover:text-black hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-[0px] active:shadow-none transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
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
          )}

          {!isEditMode && <hr className="border-t-4 border-dashed border-gray-300 my-8" />}

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
                    <label className="text-sm font-black uppercase tracking-widest text-black min-h-[20px] flex items-center">{t('admin.form.title')} (EN)</label>
                    <input
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className="w-full h-[60px] px-4 border-[4px] border-black font-black text-xl text-black bg-white focus:outline-none focus:ring-4 focus:ring-yellow-200 placeholder:text-gray-400"
                      placeholder="ENTER TITLE (EN)..."
                    />
                  </div>
                  <div className="space-y-2 flex flex-col">
                    <label className="text-sm font-black uppercase tracking-widest text-black min-h-[20px] flex items-center">{t('admin.form.title')} (ZH)</label>
                    <input
                      name="titleZh"
                      value={formData.titleZh}
                      onChange={handleChange}
                      required
                      className="w-full h-[60px] px-4 border-[4px] border-black font-black text-xl text-black bg-white focus:outline-none focus:ring-4 focus:ring-yellow-200 placeholder:text-gray-400"
                      placeholder="输入中文标题..."
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
                  <label className="text-xs font-black uppercase tracking-widest text-zinc-800 min-h-[16px] flex items-center">{t('admin.form.description')} (EN)</label>
                  <input
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full h-[52px] px-3 border-[3px] border-black font-medium text-gray-800 focus:outline-none focus:ring-4 focus:ring-yellow-200 placeholder:text-gray-300"
                  />
                </div>
                <div className="space-y-2 flex flex-col">
                  <label className="text-xs font-black uppercase tracking-widest text-zinc-800 min-h-[16px] flex items-center">{t('admin.form.description')} (ZH)</label>
                  <input
                    name="descriptionZh"
                    value={formData.descriptionZh}
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
