import React from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, Globe, Rocket, Github, Menu, X } from 'lucide-react';

interface NavbarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  toggleLanguage: () => void;
  currentLanguage: string;
}

const Navbar: React.FC<NavbarProps> = ({ 
  isMobileMenuOpen, 
  setIsMobileMenuOpen, 
  toggleLanguage, 
  currentLanguage 
}) => {
  const { t } = useTranslation();

  return (
    <nav className="sticky top-0 z-40 w-full glass border-b border-white/10 px-6 py-4 mb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Sparkles size={18} className="text-white fill-current" />
          </div>
          <span className="text-xl font-bold tracking-tight">{t('nav.title')}</span>
        </div>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <a href="#" className="text-white hover:text-indigo-400 transition-colors min-w-[60px] text-center">{t('nav.explorer')}</a>
          <a href="#" className="hover:text-indigo-400 transition-colors min-w-[60px] text-center">{t('nav.guide')}</a>
          <a href="#" className="hover:text-indigo-400 transition-colors min-w-[60px] text-center">{t('nav.library')}</a>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-white transition-colors"
            title="Switch Language"
          >
            <Globe size={20} />
            <span className="text-sm font-medium w-8 text-center">{currentLanguage.startsWith('en') ? '中文' : 'EN'}</span>
          </button>
          <button className="hidden sm:flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 transition-colors rounded-xl text-sm font-bold min-w-[140px]">
            <Rocket size={16} />
            {t('nav.proUpgrade')}
          </button>
          <div className="hidden sm:flex w-10 h-10 rounded-full bg-slate-800 border border-white/10 items-center justify-center cursor-pointer hover:bg-slate-700 transition-colors">
            <Github size={20} />
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-slate-400 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full glass border-b border-white/10 p-4 flex flex-col gap-4 animate-in slide-in-from-top-2 shadow-2xl">
          <a href="#" className="text-white hover:text-indigo-400 py-2 px-2 font-medium">{t('nav.explorer')}</a>
          <a href="#" className="text-slate-400 hover:text-indigo-400 py-2 px-2 font-medium">{t('nav.guide')}</a>
          <a href="#" className="text-slate-400 hover:text-indigo-400 py-2 px-2 font-medium">{t('nav.library')}</a>
          <div className="h-px bg-white/10 my-2"></div>
          <button className="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold w-full transition-colors">
            <Rocket size={16} />
            {t('nav.proUpgrade')}
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
