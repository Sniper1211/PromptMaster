import React, { useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface ImageWithSkeletonProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string; // e.g. "aspect-video"
}

const ImageWithSkeleton: React.FC<ImageWithSkeletonProps> = ({ 
  src, 
  alt, 
  className = "",
  aspectRatio = "aspect-video"
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-slate-100 ${aspectRatio} ${className}`}>
      {/* 1. Skeleton / Loading State */}
      {!isLoaded && !isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-200 animate-pulse z-10">
          <ImageIcon className="text-slate-300 w-12 h-12" />
        </div>
      )}

      {/* 2. Actual Image */}
      {!isError ? (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setIsLoaded(true)}
          onError={() => setIsError(true)}
        />
      ) : (
        /* 3. Error State */
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 text-slate-400 gap-2">
          <ImageIcon className="w-12 h-12 opacity-50" />
          <span className="text-xs font-bold uppercase tracking-widest">Image Not Found</span>
        </div>
      )}
    </div>
  );
};

export default ImageWithSkeleton;
