import React from 'react';

const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white border-[2.5px] border-black rounded-3xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col h-full">
      {/* Image Skeleton */}
      <div className="relative aspect-[4/3] bg-slate-200 animate-pulse border-b-[2.5px] border-black">
        <div className="absolute inset-0 flex items-center justify-center text-slate-300">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="p-5 flex flex-col flex-1 gap-4">
        {/* Title */}
        <div className="h-7 bg-slate-200 rounded-md w-3/4 animate-pulse"></div>
        
        {/* Description */}
        <div className="space-y-2">
          <div className="h-4 bg-slate-100 rounded w-full animate-pulse"></div>
          <div className="h-4 bg-slate-100 rounded w-5/6 animate-pulse"></div>
          <div className="h-4 bg-slate-100 rounded w-4/6 animate-pulse"></div>
        </div>

        {/* Tags */}
        <div className="mt-auto pt-4 flex gap-2 overflow-hidden">
          <div className="h-6 w-16 bg-slate-100 rounded-full animate-pulse"></div>
          <div className="h-6 w-20 bg-slate-100 rounded-full animate-pulse"></div>
          <div className="h-6 w-14 bg-slate-100 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
