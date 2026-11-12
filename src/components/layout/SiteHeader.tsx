import React, { useEffect, useState, type ReactNode } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Plus } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

interface SiteHeaderProps {
    /** Optional "submit a prompt" action; hidden when not provided. */
    onContribute?: () => void;
    /** Extra content rendered inside the mobile drawer (e.g. home filters). */
    drawerContent?: ReactNode;
}

const desktopLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 border-[2px] text-xs font-black uppercase tracking-wide transition-all ${
        isActive
            ? 'border-black bg-[#FACC15] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
            : 'border-transparent hover:border-black hover:bg-white'
    }`;

const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-3 py-2 border-[2px] text-sm font-black uppercase tracking-wide ${
        isActive ? 'border-black bg-[#FACC15]' : 'border-transparent hover:border-black'
    }`;

const SiteHeader: React.FC<SiteHeaderProps> = ({ onContribute, drawerContent }) => {
    const { t } = useTranslation();
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();

    // Close the drawer on navigation.
    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname, location.search]);

    useEffect(() => {
        if (!menuOpen) return;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setMenuOpen(false);
        };
        window.addEventListener('keydown', onKeyDown);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [menuOpen]);

    const links = [
        { to: '/', label: t('nav.prompts'), end: true },
        { to: '/collections/video-prompts', label: t('nav.videoCollections'), end: false },
        { to: '/guides', label: t('nav.guides'), end: false },
        { to: '/about', label: t('nav.about'), end: false }
    ];

    return (
        <header className="sticky top-0 z-50 bg-white border-b-[3px] border-black">
            <div className="max-w-[1600px] mx-auto px-3 md:px-6 h-14 md:h-16 flex items-center gap-2 md:gap-4">
                <button
                    type="button"
                    onClick={() => setMenuOpen(true)}
                    aria-label={t('nav.menu')}
                    aria-expanded={menuOpen}
                    aria-controls="mobile-menu"
                    className="lg:hidden p-2 border-[2px] border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
                >
                    <Menu size={20} strokeWidth={3} />
                </button>

                <Link to="/" className="font-black uppercase tracking-tighter text-lg md:text-2xl shrink-0">
                    PentaPrompt
                </Link>

                <nav className="hidden lg:flex items-center gap-1 ml-4" aria-label={t('nav.menu')}>
                    {links.map((link) => (
                        <NavLink key={link.to} to={link.to} end={link.end} className={desktopLinkClass}>
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="ml-auto flex items-center gap-2 md:gap-3">
                    {onContribute && (
                        <button
                            type="button"
                            onClick={onContribute}
                            className="hidden sm:flex items-center gap-2 bg-[#66D9E8] text-black px-4 py-2 border-[2.5px] border-black border-solid font-black uppercase tracking-widest text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
                        >
                            <Plus size={16} strokeWidth={3} />
                            <span>{t('nav.addPrompt')}</span>
                        </button>
                    )}
                    <LanguageSwitcher />
                </div>
            </div>

            {menuOpen && (
                <div id="mobile-menu" className="fixed inset-0 z-[60] lg:hidden">
                    <button
                        type="button"
                        onClick={() => setMenuOpen(false)}
                        aria-label={t('nav.close')}
                        className="absolute inset-0 bg-black/60"
                    />
                    <div className="absolute inset-y-0 left-0 w-[88%] max-w-sm bg-white border-r-[3px] border-black flex flex-col">
                        <div className="h-14 shrink-0 flex items-center justify-between px-4 border-b-[3px] border-black bg-[#F2F2F2]">
                            <span className="font-black uppercase tracking-tighter text-lg">PentaPrompt</span>
                            <button
                                type="button"
                                onClick={() => setMenuOpen(false)}
                                className="p-2 border-[2px] border-black bg-white"
                                aria-label={t('nav.close')}
                            >
                                <X size={18} strokeWidth={3} />
                            </button>
                        </div>

                        <nav className="p-4 space-y-2 border-b-[3px] border-black shrink-0" aria-label={t('nav.menu')}>
                            {links.map((link) => (
                                <NavLink key={link.to} to={link.to} end={link.end} className={mobileLinkClass}>
                                    {link.label}
                                </NavLink>
                            ))}
                            {onContribute && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMenuOpen(false);
                                        onContribute();
                                    }}
                                    className="w-full flex items-center justify-center gap-2 mt-2 bg-[#66D9E8] px-3 py-2 border-[2px] border-black font-black uppercase tracking-wide text-sm"
                                >
                                    <Plus size={16} strokeWidth={3} />
                                    {t('nav.addPrompt')}
                                </button>
                            )}
                        </nav>

                        {drawerContent && <div className="flex-1 overflow-y-auto">{drawerContent}</div>}
                    </div>
                </div>
            )}
        </header>
    );
};

export default SiteHeader;
