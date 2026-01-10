import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Category, Prompt } from './types';
import { Plus } from 'lucide-react';
// import { PROMPTS_EN, PROMPTS_ZH } from './constants'; // Replaced with dynamic imports
import PromptDetailModal from './components/PromptDetailModal';

// Layout & Home Components
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import PromptGrid from './components/home/PromptGrid';
import AddPromptModal from './components/admin/AddPromptModal';


const App: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<Category>(Category.ALL);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentPrompts, setCurrentPrompts] = useState<Prompt[]>([]);
  const [isLoadingPrompts, setIsLoadingPrompts] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);


  // Load prompts dynamically based on language
  useEffect(() => {
    const loadPrompts = async () => {
      setIsLoadingPrompts(true);
      try {
        const lang = i18n.language.startsWith('zh') ? 'zh' : 'en';
        if (lang === 'zh') {
          const { PROMPTS_ZH } = await import('./data/prompts-zh');
          setCurrentPrompts(PROMPTS_ZH);
        } else {
          const { PROMPTS_EN } = await import('./data/prompts-en');
          setCurrentPrompts(PROMPTS_EN);
        }
      } catch (error) {
        console.error('Failed to load prompts:', error);
      } finally {
        setIsLoadingPrompts(false);
      }
    };

    loadPrompts();
  }, [i18n.language]);

  const toggleLanguage = () => {
    const currentLang = i18n.language;
    const isEnglish = currentLang.startsWith('en');
    const newLang = isEnglish ? 'zh' : 'en';
    i18n.changeLanguage(newLang);
  };

  const filteredPrompts = useMemo(() => {
    return currentPrompts.filter(prompt => {
      const matchesCategory = activeCategory === Category.ALL || prompt.category === activeCategory;
      const matchesSearch = prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, currentPrompts]);

  const nextId = useMemo(() => {
    if (currentPrompts.length === 0) return '1';
    const ids = currentPrompts.map(p => parseInt(p.id)).filter(id => !isNaN(id));
    return ids.length > 0 ? (Math.max(...ids) + 1).toString() : (currentPrompts.length + 1).toString();
  }, [currentPrompts]);

  const clearFilters = () => {

    setActiveCategory(Category.ALL);
    setSearchQuery('');
  };

  return (
    <div className="flex h-screen bg-gray-50 text-slate-900 overflow-hidden font-sans">
      <Sidebar
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        toggleLanguage={toggleLanguage}
        currentLanguage={i18n.language}
      />

      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden border-l-[2.5px] border-black">
        {/* Navigation / Header placeholder or mobile toggler could go here if needed */}

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10">
          <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-2">{t('home.exploreTitle')}</h2>
              <p className="text-slate-500 font-medium">{t('home.exploreSubtitle')}</p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 bg-[#66D9E8] text-black px-6 py-3 border-[2.5px] border-black rounded-2xl font-black uppercase italic shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                <Plus size={20} strokeWidth={3} />
                <span>{t('nav.addPrompt')}</span>
              </button>
              <button className="flex items-center gap-2 bg-[#FF4D4D] text-white px-6 py-3 border-[2.5px] border-black rounded-2xl font-black uppercase italic shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                <Plus size={20} strokeWidth={3} />
                <span>{t('nav.proUpgrade')}</span>
              </button>
            </div>

          </header>


          {isLoadingPrompts ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-black/10 border-t-black rounded-full animate-spin mb-4"></div>
              <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-xs">Loading prompts...</p>
            </div>
          ) : (
            <PromptGrid
              prompts={filteredPrompts}
              onSelectPrompt={setSelectedPrompt}
              onClearFilters={clearFilters}
            />
          )}

          <Footer />
        </div>
      </main>

      {/* Modal */}
      {selectedPrompt && (
        <PromptDetailModal
          prompt={selectedPrompt}
          onClose={() => setSelectedPrompt(null)}
        />
      )}

      {isAddModalOpen && (
        <AddPromptModal
          onClose={() => setIsAddModalOpen(false)}
          nextId={nextId}
        />
      )}
    </div>

  );
};

export default App;
