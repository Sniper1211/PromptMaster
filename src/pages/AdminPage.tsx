import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePrompts } from '../hooks/usePrompts';
import { Search, Edit, Image as ImageIcon, CheckCircle, XCircle, Wand2, Save, LogOut } from 'lucide-react';
import ImageWithSkeleton from '../components/common/ImageWithSkeleton';

const AdminPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Check auth on mount
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) setIsAuthenticated(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      
      const data = await res.json();
      
      if (data.success) {
        localStorage.setItem('adminToken', password);
        setIsAuthenticated(true);
      } else {
        setError('Invalid Password');
      }
    } catch (err) {
      setError('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setPassword('');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="bg-white p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-md">
          <h1 className="text-4xl font-black uppercase mb-8 text-center tracking-tighter bg-yellow-300 border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-2">
            Admin Access
          </h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold uppercase mb-2 text-black">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border-2 border-black p-4 font-bold text-lg focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all placeholder:text-slate-400"
                placeholder="Enter admin password"
              />
            </div>
            {error && <div className="bg-red-100 border-2 border-red-500 text-red-700 p-3 font-bold text-sm">{error}</div>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#8B5CF6] text-white border-2 border-black py-4 font-black uppercase tracking-wider text-lg hover:bg-[#7C3AED] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <AdminDashboard onLogout={handleLogout} />;
};

// --- Sub-components for Dashboard ---

const AdminDashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const { prompts, loading: promptsLoading } = usePrompts();
  const [filter, setFilter] = useState<'all' | 'incomplete'>('incomplete');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPrompt, setEditingPrompt] = useState<any | null>(null);

  const filteredPrompts = prompts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.includes(searchTerm);
    if (filter === 'all') return matchesSearch;
    // Incomplete = Missing Usage OR Missing Image
    return matchesSearch && (!p.usage || !p.previewImageUrl);
  });

  if (promptsLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
      <div className="text-2xl font-black uppercase animate-pulse">Loading Prompts...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 bg-white border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-2 inline-block bg-black text-white px-3 py-1 transform -skew-x-3">
            Prompt Operations
          </h1>
          <p className="text-slate-700 font-bold text-lg ml-1">Manage {prompts.length} prompts | {filteredPrompts.length} shown</p>
        </div>
        <button onClick={onLogout} className="flex items-center gap-2 font-black text-black border-2 border-black px-4 py-2 hover:bg-red-500 hover:text-white transition-colors uppercase text-sm">
          <LogOut size={18} /> Logout
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3.5 text-black" size={20} />
          <input
            type="text"
            placeholder="SEARCH BY TITLE OR ID..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-black font-bold text-lg focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] placeholder:text-slate-400"
          />
        </div>
        <div className="flex border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-3 font-black uppercase tracking-wider transition-colors ${filter === 'all' ? 'bg-black text-white' : 'hover:bg-slate-100 text-black'}`}
          >
            All Prompts
          </button>
          <div className="w-0.5 bg-black"></div>
          <button
            onClick={() => setFilter('incomplete')}
            className={`px-6 py-3 font-black uppercase tracking-wider transition-colors ${filter === 'incomplete' ? 'bg-black text-white' : 'hover:bg-slate-100 text-black'}`}
          >
            Incomplete Only
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-black text-white border-b-4 border-black">
              <th className="p-5 font-black uppercase text-sm tracking-wider w-24">ID</th>
              <th className="p-5 font-black uppercase text-sm tracking-wider">Title</th>
              <th className="p-5 font-black uppercase text-sm tracking-wider w-32 text-center">Tips</th>
              <th className="p-5 font-black uppercase text-sm tracking-wider w-32 text-center">Image</th>
              <th className="p-5 font-black uppercase text-sm tracking-wider w-24 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredPrompts.map(prompt => (
              <tr key={prompt.id} className="border-b-2 border-slate-200 hover:bg-yellow-50 transition-colors group">
                <td className="p-5 font-mono text-sm font-bold text-slate-700 border-r-2 border-slate-100">{prompt.id.substring(0, 6)}...</td>
                <td className="p-5 font-bold text-lg text-black">{prompt.title}</td>
                <td className="p-5 text-center border-l-2 border-slate-100">
                  {prompt.usage ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 border-2 border-green-600 text-green-700 text-xs font-black uppercase rounded">
                      <CheckCircle size={14} /> Done
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 border-2 border-red-600 text-red-700 text-xs font-black uppercase rounded">
                      <XCircle size={14} /> Missing
                    </span>
                  )}
                </td>
                <td className="p-5 text-center border-l-2 border-slate-100">
                  {prompt.previewImageUrl ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 border-2 border-green-600 text-green-700 text-xs font-black uppercase rounded">
                      <CheckCircle size={14} /> Done
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 border-2 border-red-600 text-red-700 text-xs font-black uppercase rounded">
                      <XCircle size={14} /> Missing
                    </span>
                  )}
                </td>
                <td className="p-5 text-center border-l-2 border-slate-100">
                  <button
                    onClick={() => setEditingPrompt(prompt)}
                    className="p-3 bg-white border-2 border-black text-black hover:bg-black hover:text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                  >
                    <Edit size={18} strokeWidth={2.5} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredPrompts.length === 0 && (
              <tr>
                <td colSpan={5} className="p-12 text-center text-slate-500 font-bold uppercase text-lg">No prompts found matching your criteria</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Editor Modal */}
      {editingPrompt && (
        <EditorModal 
          prompt={editingPrompt} 
          onClose={() => setEditingPrompt(null)} 
          onSave={() => {
            // Force a reload to refresh data
            window.location.reload(); 
          }}
        />
      )}
    </div>
  );
};

const EditorModal: React.FC<{ prompt: any, onClose: () => void, onSave: () => void }> = ({ prompt, onClose, onSave }) => {
  const [usage, setUsage] = useState(prompt.usage || '');
  const [imageUrl, setImageUrl] = useState(prompt.previewImageUrl || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleGenerateTips = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-tips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: prompt.content })
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Generation failed');
      }

      if (!data.usage_zh || !data.usage_en) {
        throw new Error('Invalid response format from AI');
      }
      
      const formattedUsage = `### Chinese Tips (中文建议)\n${data.usage_zh}\n\n### English Tips\n${data.usage_en}`;
      setUsage(formattedUsage);
    } catch (err: any) {
      alert(`AI Generation Failed: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/prompts?id=${prompt.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          usage,
          previewImageUrl: imageUrl
        })
      });
      
      if (res.ok) {
        onSave();
        onClose();
      } else {
        alert('Save Failed');
      }
    } catch (err) {
      alert('Save Error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] flex flex-col">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b-4 border-black bg-yellow-300 sticky top-0 z-10">
          <h2 className="text-2xl font-black uppercase truncate pr-4">Edit: {prompt.title}</h2>
          <button onClick={onClose} className="hover:bg-black hover:text-white p-1 rounded-full transition-colors"><XCircle size={32} strokeWidth={2.5} /></button>
        </div>

        <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 overflow-y-auto">
          {/* Left Column: Reference & Image */}
          <div className="space-y-8">
            <div className="bg-slate-50 border-4 border-slate-200 p-6">
              <label className="block text-sm font-black uppercase mb-3 text-slate-700 flex items-center gap-2">
                <span className="w-3 h-3 bg-black"></span> Original Prompt Content
              </label>
              <div className="font-mono text-sm leading-relaxed text-slate-800 whitespace-pre-wrap max-h-60 overflow-y-auto bg-white p-4 border-2 border-slate-200">
                {prompt.content}
              </div>
            </div>
            
            {/* Image Section */}
            <div className="bg-slate-50 border-4 border-slate-200 p-6">
              <label className="block text-sm font-black uppercase mb-3 text-slate-700 flex items-center gap-2">
                 <span className="w-3 h-3 bg-purple-500"></span> Preview Image URL
              </label>
              <input 
                type="text" 
                value={imageUrl} 
                onChange={e => setImageUrl(e.target.value)}
                className="w-full border-4 border-black p-3 font-mono text-sm mb-4 focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                placeholder="https://your-r2-bucket.com/image.png"
              />
              <div className="w-full aspect-video bg-white border-4 border-dashed border-slate-300 flex items-center justify-center overflow-hidden shadow-inner group relative">
                {imageUrl ? (
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center text-slate-400">
                    <ImageIcon size={48} strokeWidth={1.5} />
                    <span className="text-xs font-bold uppercase mt-2">No Image Set</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Usage Editor */}
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
              <label className="text-sm font-black uppercase text-black flex items-center gap-2">
                <span className="w-3 h-3 bg-yellow-400"></span> Usage Tips (Markdown)
              </label>
              <button 
                onClick={handleGenerateTips}
                disabled={isGenerating}
                className="flex items-center gap-2 px-4 py-2 bg-[#FACC15] border-2 border-black text-sm font-black uppercase hover:bg-yellow-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Wand2 size={16} />
                {isGenerating ? 'AI Generating...' : 'Auto-Generate Tips'}
              </button>
            </div>
            <textarea
              value={usage}
              onChange={e => setUsage(e.target.value)}
              className="w-full flex-1 min-h-[400px] border-4 border-black p-6 font-mono text-base text-slate-800 focus:outline-none focus:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-shadow resize-none leading-relaxed"
              placeholder="Enter usage tips here...&#10;- Tip 1&#10;- Tip 2"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t-4 border-black bg-slate-50 flex justify-end gap-4 sticky bottom-0 z-10">
          <button 
            onClick={onClose} 
            className="px-8 py-3 font-black uppercase border-2 border-transparent hover:bg-slate-200 transition-colors text-slate-600"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-3 px-8 py-3 bg-black text-white border-2 border-black font-black uppercase tracking-wider hover:bg-[#8B5CF6] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all disabled:opacity-50 disabled:transform-none"
          >
            <Save size={20} />
            {isSaving ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
