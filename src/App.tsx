
import React, { useState, useMemo } from 'react';
import { Category, Prompt } from './types';
import { SAMPLE_PROMPTS } from './constants';
import PromptCard from './components/PromptCard';
import LivePreviewModal from './components/LivePreviewModal';
import { Search, Sparkles, Rocket, Compass, Layers, Github } from 'lucide-react';

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<Category>(Category.ALL);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);

  const filteredPrompts = useMemo(() => {
    return SAMPLE_PROMPTS.filter(prompt => {
      const matchesCategory = activeCategory === Category.ALL || prompt.category === activeCategory;
      const matchesSearch = prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            prompt.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen pb-20">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 w-full glass border-b border-white/10 px-6 py-4 flex items-center justify-between mb-12">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Sparkles size={18} className="text-white fill-current" />
          </div>
          <span className="text-xl font-bold tracking-tight">PromptMaster</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <a href="#" className="text-white hover:text-indigo-400 transition-colors">Explorer</a>
          <a href="#" className="hover:text-indigo-400 transition-colors">Guide</a>
          <a href="#" className="hover:text-indigo-400 transition-colors">Library</a>
        </div>
        <div className="flex items-center gap-4">
          <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 transition-colors rounded-xl text-sm font-bold">
            <Rocket size={16} />
            Pro Upgrade
          </button>
          <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center cursor-pointer hover:bg-slate-700 transition-colors">
            <Github size={20} />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6">
        {/* Hero Section */}
        <section className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent leading-tight">
            Master the Art of <br /> AI Prompting
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Discover a curated collection of high-performance prompts. 
            Learn through real examples and optimize your AI interactions.
          </p>

          <div className="max-w-2xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative flex items-center glass rounded-2xl p-2 pl-6">
              <Search className="text-slate-500 mr-4" size={20} />
              <input 
                type="text" 
                placeholder="Search for prompts by title, tag, or topic..."
                className="bg-transparent border-none outline-none text-white w-full py-2 placeholder:text-slate-600"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="px-6 py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-indigo-50 transition-colors ml-4 whitespace-nowrap hidden sm:block">
                Search
              </button>
            </div>
          </div>
        </section>

        {/* Categories */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {Object.values(Category).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-300 border ${
                activeCategory === cat 
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20' 
                : 'glass border-white/5 text-slate-400 hover:border-white/20 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrompts.length > 0 ? (
            filteredPrompts.map(prompt => (
              <PromptCard 
                key={prompt.id} 
                prompt={prompt} 
                onTry={(p) => setSelectedPrompt(p)} 
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <Compass size={48} className="mx-auto text-slate-600 mb-4 opacity-20" />
              <p className="text-slate-400 text-lg">No prompts found matching your current filters.</p>
              <button 
                onClick={() => { setActiveCategory(Category.ALL); setSearchQuery(''); }}
                className="mt-4 text-indigo-400 hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Footer Meta */}
        <section className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-12">
            <div className="text-center md:text-left">
              <p className="text-3xl font-bold text-white mb-1">2.4k+</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Curated Prompts</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-3xl font-bold text-white mb-1">15k+</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Community Uses</p>
            </div>
          </div>
          <div className="flex gap-4">
             <div className="glass px-6 py-4 rounded-2xl flex items-center gap-3">
                <Layers className="text-indigo-400" size={20} />
                <div>
                  <p className="text-sm font-bold">Open Library</p>
                  <p className="text-xs text-slate-500">Contribute your own prompts</p>
                </div>
             </div>
          </div>
        </section>
      </main>

      {/* Modal */}
      {selectedPrompt && (
        <LivePreviewModal 
          prompt={selectedPrompt} 
          onClose={() => setSelectedPrompt(null)} 
        />
      )}
    </div>
  );
};

export default App;
