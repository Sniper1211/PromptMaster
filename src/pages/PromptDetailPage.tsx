import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Copy, Check, X, Search, Cpu, ArrowLeft, Tag, Layers, Calendar, ChevronRight, Share2, Info, Flame } from 'lucide-react';
import { usePrompts } from '../hooks/usePrompts';
import { usePromptDetail } from '../hooks/usePromptDetail';
import SEOHead from '../components/seo/SEOHead';
import AdUnit from '../components/ads/AdUnit';
import PromptCard from '../components/PromptCard';
import ImageWithSkeleton from '../components/common/ImageWithSkeleton';

const PromptDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    
    // Fetch specific prompt detail
    const { prompt, loading: detailLoading, error: detailError } = usePromptDetail(id);
    
    // Fetch list for related items (optional, just gets first page)
    const { prompts: listPrompts } = usePrompts();
    
    const { t } = useTranslation();
    const [copied, setCopied] = useState(false);
    const [showFullImage, setShowFullImage] = useState(false);
    
    // Local state for copy count to show instant update
    const [localCopyCount, setLocalCopyCount] = useState<number | undefined>(undefined);
    
    // Sync local count when prompt loads
    useMemo(() => {
        if (prompt && prompt.copyCount !== undefined) {
            setLocalCopyCount(prompt.copyCount);
        }
    }, [prompt]);

    const relatedPrompts = useMemo(() => {
        if (!prompt || !listPrompts.length) return [];
        return listPrompts
            .filter(p => p.category === prompt.category && p.id !== prompt.id)
            .slice(0, 4);
    }, [prompt, listPrompts]);

    const copyPrompt = () => {
        if (prompt) {
            navigator.clipboard.writeText(prompt.content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            
            // Optimistic update
            setLocalCopyCount(prev => (prev || 0) + 1);
            
            // Send increment request silently
            fetch(`/api/increment-copy?id=${prompt.id}`, { method: 'POST' })
                .catch(err => console.error('Failed to increment copy count', err));
        }
    };

    // Show loading if fetching detail
    if (detailLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-[5px] border-black border-t-transparent rounded-full animate-spin"></div>
                    <p className="font-bold text-slate-400 uppercase tracking-widest text-sm">{t('promptDetail.loading')}</p>
                </div>
            </div>
        );
    }

    if (!prompt || detailError) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] gap-6 text-center px-4">
                <h2 className="text-4xl font-black uppercase italic">{t('promptDetail.notFound')}</h2>
                <p className="text-slate-600 max-w-md">{t('promptDetail.movedOrDeleted')}</p>
                <Link to="/" className="px-8 py-3 bg-black text-white font-bold uppercase tracking-wide hover:bg-[#FF4D4D] transition-colors border-[3px] border-transparent hover:border-black">
                    {t('promptDetail.returnToLibrary')}
                </Link>
            </div>
        );
    }

    // Helper to get absolute image URL
    const getImageUrl = (url?: string) => {
        if (!url) return "";
        if (url.startsWith('http')) return url;
        return `https://pentaprompt.com${url}`;
    };

    // JSON-LD for SEO
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        "name": prompt.title,
        "headline": prompt.title,
        "description": prompt.description,
        "image": getImageUrl(prompt.previewImageUrl),
        "genre": prompt.category,
        "keywords": prompt.tags.join(", "),
        "datePublished": "2024-01-01", // TODO: Use real createdAt
        "author": {
            "@type": "Organization",
            "name": "PentaPrompt",
            "url": "https://pentaprompt.com"
        },
        "interactionStatistic": {
            "@type": "InteractionCounter",
            "interactionType": "https://schema.org/ShareAction",
            "userInteractionCount": 100 // Placeholder, will connect to real data later
        }
    };

    return (
        <>
            <SEOHead
                title={`${prompt.title} - PentaPrompt`}
                description={prompt.description}
                keywords={prompt.tags.slice(0, 8).join(", ")}
                image={getImageUrl(prompt.previewImageUrl)}
                url={`https://pentaprompt.com/prompt/${prompt.id}`}
                type="article"
                structuredData={jsonLd}
            />

            <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 pb-32">

                {/* 1. Navbar / Breadcrumbs */}
                <header className="bg-white border-b-[3px] border-black sticky top-0 z-40">
                    <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-500 overflow-hidden">
                            <Link to="/" className="hover:text-black flex items-center gap-1 shrink-0 transition-colors">
                                <Layers size={16} strokeWidth={2.5} /> {t('nav.library')}
                            </Link>
                            <ChevronRight size={14} className="shrink-0 text-slate-300" />
                            <Link to={`/?category=${prompt.category}`} className="hover:text-black shrink-0 transition-colors">
                                {t(`categories.${prompt.category.toUpperCase()}`)}
                            </Link>
                            <ChevronRight size={14} className="shrink-0 text-slate-300" />
                            <span className="text-black truncate">{prompt.title}</span>
                        </div>

                        <Link
                            to="/"
                            className="flex items-center justify-center w-9 h-9 bg-white border-[2.5px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex-shrink-0"
                            aria-label="Close"
                        >
                            <X size={20} strokeWidth={3} />
                        </Link>
                    </div>
                </header>

                <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
                    <div className="flex flex-col lg:flex-row gap-12 items-start">

                        {/* 2. Main Content (Left) */}
                        <div className="flex-1 min-w-0 space-y-10">

                            {/* Header Section */}
                            <div>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase italic tracking-tighter leading-[0.95] mb-6 text-black">
                                    {prompt.title}
                                </h1>

                                <div className="flex flex-wrap gap-3">
                                    <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-black text-white text-xs font-bold uppercase tracking-wider">
                                        <Calendar size={12} /> {t('promptDetail.updatedToday')}
                                    </span>
                                    {prompt.model && (
                                        <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border-[2px] border-black text-xs font-bold uppercase tracking-wider">
                                            <Cpu size={14} /> {prompt.model}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Hero Image */}
                            {prompt.previewImageUrl && (
                                <div className="w-full bg-white border-[3px] border-black p-1 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                                    <div className="relative group w-full">
                                        <ImageWithSkeleton
                                            src={prompt.previewImageUrl}
                                            alt={prompt.title}
                                            aspectRatio="aspect-video md:aspect-[2/1]"
                                        />
                                        <button
                                            onClick={() => setShowFullImage(true)}
                                            className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-zoom-in z-20"
                                        >
                                            <div className="bg-white text-black px-4 py-2 font-bold uppercase text-sm border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
                                                {t('promptDetail.viewFullSize')}
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Description */}
                            <div className="prose prose-lg md:prose-xl max-w-none text-slate-800 leading-relaxed font-medium">
                                <p>{prompt.description}</p>
                            </div>

                            {/* Prompt Code Block (The Core) */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-black uppercase italic tracking-tight flex items-center gap-2">
                                        <div className="w-3 h-6 bg-[#8B5CF6]"></div> {t('promptDetail.promptContent')}
                                    </h3>
                                    <div className="flex items-center gap-3">
                                        {/* Copy Count Badge */}
                                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#FACC15] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs font-black uppercase tracking-wider text-black transform hover:-translate-y-[1px] transition-transform cursor-help" title={t('promptDetail.totalCopies')}>
                                            <Flame size={12} fill="black" /> 
                                            {localCopyCount === undefined ? (
                                                <span className="inline-block w-10 h-3 bg-black opacity-20 animate-pulse"></span>
                                            ) : (
                                                <>
                                                    {localCopyCount.toLocaleString()} <span className="ml-0.5 opacity-80 text-[10px]">{t('promptDetail.copies')}</span>
                                                </>
                                            )}
                                        </div>
                                        
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                            {prompt.content.length} {t('promptDetail.characters')}
                                        </span>
                                    </div>
                                </div>

                                <div className="relative group rounded-xl overflow-hidden border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-[#1e1e1e]">
                                    {/* Code Header */}
                                    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-[#404040]">
                                        <div className="flex gap-1.5">
                                            <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                                            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                                            <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                                        </div>
                                        <button
                                            onClick={copyPrompt}
                                            className="text-white/70 hover:text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                                        >
                                            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                                            {copied ? t('promptDetail.copied') : t('promptDetail.copyRaw')}
                                        </button>
                                    </div>

                                    <div className="p-6 md:p-8 overflow-x-auto">
                                        <pre className="font-mono text-sm md:text-base leading-loose text-[#d4d4d4] whitespace-pre-wrap font-medium">
                                            {prompt.content}
                                        </pre>
                                    </div>
                                </div>
                            </div>

                            {/* Ad Unit In-Content */}
                            <AdUnit className="my-10" label="Sponsored Partner" />

                            {/* Usage Instructions */}
                            {prompt.usage && (
                                <div className="bg-[#FEF9C3] border-[3px] border-black p-6 relative">
                                    <div className="absolute -top-3 -left-3 bg-black text-[#FEF9C3] px-3 py-1 font-black uppercase text-xs tracking-widest border-[2px] border-[#FEF9C3]">
                                        {t('promptDetail.tipsAndTricks')}
                                    </div>
                                    <p className="font-medium text-slate-900 leading-relaxed">
                                        {prompt.usage}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* 3. Sticky Sidebar (Right) */}
                        <div className="w-full lg:w-96 shrink-0 lg:sticky lg:top-24 space-y-8">

                            {/* Primary Action Card */}
                            <div className="bg-white border-[3px] border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                                <div className="mb-6">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{t('promptDetail.category')}</p>
                                    <Link to={`/?category=${prompt.category}`} className="text-2xl font-black uppercase italic hover:underline decoration-4 underline-offset-4 decoration-[#FACC15]">
                                        {t(`categories.${prompt.category.toUpperCase()}`)}
                                    </Link>
                                </div>

                                <button
                                    onClick={copyPrompt}
                                    className="w-full py-4 bg-[#2DD4BF] border-[3px] border-black text-black font-black uppercase text-lg tracking-wide hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-3 group"
                                >
                                    {copied ? (
                                        <>
                                            <Check size={24} strokeWidth={3} /> {t('promptDetail.copied')}!
                                        </>
                                    ) : (
                                        <>
                                            <Copy size={24} strokeWidth={3} className="group-hover:scale-110 transition-transform" /> {t('promptDetail.copyPrompt')}
                                        </>
                                    )}
                                </button>

                                <div className="mt-4 pt-4 border-t-2 border-dashed border-gray-200 flex justify-center">
                                    <button className="text-slate-500 hover:text-black font-bold uppercase text-xs tracking-widest flex items-center gap-2 transition-colors">
                                        <Share2 size={14} /> {t('promptDetail.sharePrompt')}
                                    </button>
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="bg-[#F1F5F9] border-[3px] border-black p-6">
                                <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Tag size={16} /> {t('promptDetail.relatedKeywords')}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {prompt.tags.map(tag => (
                                        <Link
                                            key={tag}
                                            to={`/?search=${tag}`}
                                            className="px-3 py-1 bg-white border-[2px] border-transparent hover:border-black text-xs font-bold uppercase transition-all"
                                        >
                                            #{tag}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Sidebar Ad */}
                            <AdUnit format="rectangle" />
                        </div>
                    </div>

                    {/* 4. Related Content (Bottom) */}
                    {true && ( /* Always render wrapper to maintain layout spacing */
                        <div className="mt-24 pt-12 border-t-[3px] border-black">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-3xl font-black uppercase italic tracking-tighter">
                                    {t('promptDetail.moreFrom')} {t(`categories.${prompt.category.toUpperCase()}`)}
                                </h2>
                                <Link to={`/?category=${prompt.category}`} className="hidden md:flex items-center gap-2 font-bold uppercase tracking-wide hover:translate-x-1 transition-transform">
                                    {t('promptDetail.viewAll')} <ChevronRight size={16} strokeWidth={3} />
                                </Link>
                            </div>

                            {relatedPrompts.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {relatedPrompts.map(p => (
                                        <PromptCard key={p.id} prompt={p} />
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center text-slate-400 font-bold uppercase tracking-widest">
                                    {t('promptDetail.noRelated')}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Full Image Overlay */}
            {showFullImage && prompt.previewImageUrl && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 p-4 animate-in fade-in duration-200"
                    onClick={() => setShowFullImage(false)}
                >
                    <button
                        className="absolute top-6 right-6 p-4 bg-white rounded-full hover:bg-gray-200 transition-colors z-50 group"
                        onClick={() => setShowFullImage(false)}
                    >
                        <X size={24} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
                    </button>
                    <img
                        src={prompt.previewImageUrl}
                        alt={prompt.title}
                        className="max-w-[95%] max-h-[95vh] object-contain shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </>
    );
};

export default PromptDetailPage;
