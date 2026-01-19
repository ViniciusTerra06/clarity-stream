import React from 'react';
import { Video } from '@/types/video';
import VideoCard from './VideoCard';
import VideoCardSkeleton from './VideoCardSkeleton';

interface VideoGridProps {
  videos: Video[];
  loading?: boolean;
  emptyMessage?: string;
}

const VideoGrid: React.FC<VideoGridProps> = ({ 
  videos, 
  loading = false,
  emptyMessage = 'Nenhum vídeo encontrado'
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <VideoCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-muted-foreground text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
};

export default VideoGrid;
