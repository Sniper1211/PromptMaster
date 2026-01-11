import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Copy, Check, X, Search, Cpu, ArrowLeft, Tag, Layers, Calendar, ChevronRight, Share2, Info } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { usePrompts } from '../hooks/usePrompts';
import AdUnit from '../components/ads/AdUnit';
import PromptCard from '../components/PromptCard';

const PromptDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { prompts, loading } = usePrompts();
    const { t } = useTranslation();
    const [copied, setCopied] = useState(false);
    const [showFullImage, setShowFullImage] = useState(false);

    const prompt = prompts.find(p => p.id === id);

    const relatedPrompts = useMemo(() => {
        if (!prompt || !prompts.length) return [];
        return prompts
            .filter(p => p.category === prompt.category && p.id !== prompt.id)
            .slice(0, 4);
    }, [prompt, prompts]);

    const copyPrompt = () => {
        if (prompt) {
            navigator.clipboard.writeText(prompt.content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-[5px] border-black border-t-transparent rounded-full animate-spin"></div>
                    <p className="font-bold text-slate-400 uppercase tracking-widest text-sm">Loading...</p>
                </div>
            </div>
        );
    }

    if (!prompt) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] gap-6 text-center px-4">
                <h2 className="text-4xl font-black uppercase italic">404 - Prompt Not Found</h2>
                <p className="text-slate-600 max-w-md">The prompt you are looking for might have been moved or deleted.</p>
                <Link to="/" className="px-8 py-3 bg-black text-white font-bold uppercase tracking-wide hover:bg-[#FF4D4D] transition-colors border-[3px] border-transparent hover:border-black">
                    Return to Library
                </Link>
            </div>
        );
    }

    // JSON-LD for SEO
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        "headline": prompt.title,
        "description": prompt.description,
        "image": prompt.previewImageUrl || "",
        "articleSection": prompt.category,
        "keywords": prompt.tags.join(", "),
        "datePublished": "2024-01-01",
        "author": {
            "@type": "Organization",
            "name": "PromptMaster"
        }
    };

    return (
        <>
            <Helmet>
                <title>{`${prompt.title} - PromptMaster`}</title>
                <meta name="description" content={prompt.description} />
                <script type="application/ld+json">
                    {JSON.stringify(jsonLd)}
                </script>
            </Helmet>

            <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 pb-32">

                {/* 1. Navbar / Breadcrumbs */}
                <header className="bg-white border-b-[3px] border-black sticky top-0 z-40">
                    <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-500 overflow-hidden">
                            <Link to="/" className="hover:text-black flex items-center gap-1 shrink-0 transition-colors">
                                <Layers size={16} strokeWidth={2.5} /> Library
                            </Link>
                            <ChevronRight size={14} className="shrink-0 text-slate-300" />
                            <Link to={`/?category=${prompt.category}`} className="hover:text-black shrink-0 transition-colors">
                                {prompt.category}
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
                                        <Calendar size={12} /> Updated Today
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
                                    <div className="relative group w-full aspect-video md:aspect-[2/1] overflow-hidden bg-slate-100">
                                        <img
                                            src={prompt.previewImageUrl}
                                            alt={prompt.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            onClick={() => setShowFullImage(true)}
                                            className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-zoom-in"
                                        >
                                            <div className="bg-white text-black px-4 py-2 font-bold uppercase text-sm border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:translate-x-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
                                                View Full Size
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
                                        <div className="w-3 h-6 bg-[#8B5CF6]"></div> Prompt Content
                                    </h3>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                        {prompt.content.length} Characters
                                    </span>
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
                                            {copied ? 'Copied' : 'Copy Raw'}
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
                                        Tips & Tricks
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
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Category</p>
                                    <Link to={`/?category=${prompt.category}`} className="text-2xl font-black uppercase italic hover:underline decoration-4 underline-offset-4 decoration-[#FACC15]">
                                        {prompt.category}
                                    </Link>
                                </div>

                                <button
                                    onClick={copyPrompt}
                                    className="w-full py-4 bg-[#2DD4BF] border-[3px] border-black text-black font-black uppercase text-lg tracking-wide hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-3 group"
                                >
                                    {copied ? (
                                        <>
                                            <Check size={24} strokeWidth={3} /> Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy size={24} strokeWidth={3} className="group-hover:scale-110 transition-transform" /> Copy Prompt
                                        </>
                                    )}
                                </button>

                                <div className="mt-4 pt-4 border-t-2 border-dashed border-gray-200 flex justify-center">
                                    <button className="text-slate-500 hover:text-black font-bold uppercase text-xs tracking-widest flex items-center gap-2 transition-colors">
                                        <Share2 size={14} /> Share this prompt
                                    </button>
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="bg-[#F1F5F9] border-[3px] border-black p-6">
                                <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Tag size={16} /> Related Keywords
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
                                    More from {prompt.category}
                                </h2>
                                <Link to={`/?category=${prompt.category}`} className="hidden md:flex items-center gap-2 font-bold uppercase tracking-wide hover:translate-x-1 transition-transform">
                                    View All <ChevronRight size={16} strokeWidth={3} />
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
                                    No other prompts in this category found.
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
