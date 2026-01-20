import React from 'react';

const PromptDetailSkeleton: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans pb-32 animate-pulse">
            {/* 1. Navbar Skeleton */}
            <header className="bg-white border-b-[3px] border-black/10 h-16 sticky top-0 z-40"></header>

            <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
                <div className="flex flex-col lg:flex-row gap-12 items-start">
                    
                    {/* 2. Main Content (Left) */}
                    <div className="flex-1 min-w-0 space-y-10 w-full">
                        
                        {/* Header Section */}
                        <div>
                            {/* Title */}
                            <div className="h-12 md:h-16 bg-slate-200 rounded-lg w-3/4 mb-6"></div>
                            {/* Metadata Tags */}
                            <div className="flex gap-3">
                                <div className="h-8 w-32 bg-slate-200 rounded"></div>
                                <div className="h-8 w-24 bg-slate-200 rounded"></div>
                            </div>
                        </div>

                        {/* Hero Image */}
                        <div className="w-full bg-slate-200 border-[3px] border-black/10 aspect-video md:aspect-[2/1] rounded-none"></div>

                        {/* Description */}
                        <div className="space-y-3">
                            <div className="h-4 bg-slate-200 rounded w-full"></div>
                            <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                            <div className="h-4 bg-slate-200 rounded w-4/6"></div>
                        </div>

                        {/* Prompt Code Block */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <div className="h-8 w-48 bg-slate-200 rounded"></div>
                                <div className="h-8 w-24 bg-slate-200 rounded"></div>
                            </div>
                            <div className="h-64 bg-slate-200 rounded-xl border-[3px] border-black/10"></div>
                        </div>

                        {/* Usage Instructions */}
                        <div className="h-32 bg-slate-100 border-[3px] border-black/10 rounded"></div>
                    </div>

                    {/* 3. Sidebar (Right) */}
                    <div className="w-full lg:w-96 shrink-0 lg:sticky lg:top-24 space-y-8">
                        {/* Primary Action Card */}
                        <div className="h-64 bg-white border-[3px] border-black/10 p-6">
                            <div className="h-6 w-24 bg-slate-200 mb-4 rounded"></div>
                            <div className="h-10 w-48 bg-slate-200 mb-6 rounded"></div>
                            <div className="h-14 w-full bg-slate-300 rounded"></div>
                            <div className="mt-6 h-4 w-32 bg-slate-200 mx-auto rounded"></div>
                        </div>

                        {/* Tags */}
                        <div className="h-48 bg-slate-100 border-[3px] border-black/10 p-6">
                            <div className="h-6 w-32 bg-slate-200 mb-4 rounded"></div>
                            <div className="flex flex-wrap gap-2">
                                <div className="h-8 w-16 bg-slate-200 rounded"></div>
                                <div className="h-8 w-24 bg-slate-200 rounded"></div>
                                <div className="h-8 w-20 bg-slate-200 rounded"></div>
                                <div className="h-8 w-14 bg-slate-200 rounded"></div>
                                <div className="h-8 w-28 bg-slate-200 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PromptDetailSkeleton;
