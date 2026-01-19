import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const VideoCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-xl overflow-hidden bg-card">
      <Skeleton className="aspect-video w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex gap-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
};

export default VideoCardSkeleton;
