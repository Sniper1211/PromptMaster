import React from 'react';
import SkeletonCard from '../common/SkeletonCard';

const SkeletonGrid: React.FC = () => {
  // Render 12 skeleton cards
  const skeletons = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6">
      {skeletons.map((i) => (
        <div key={i} className="break-inside-avoid mb-6">
          <SkeletonCard />
        </div>
      ))}
    </div>
  );
};

export default SkeletonGrid;
