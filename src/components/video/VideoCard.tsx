import React from 'react';
import { Link } from 'react-router-dom';
import { Video } from '@/types/video';
import { cn } from '@/lib/utils';

interface VideoCardProps {
  video: Video;
  className?: string;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, className }) => {
  return (
    <Link
      to={`/watch/${video.id}`}
      className={cn(
        'group block rounded-xl overflow-hidden bg-card transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1',
        className
      )}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        <img
          src={video.thumbnail}
          alt={video.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Duration badge */}
        <span className="absolute bottom-2 right-2 px-2 py-0.5 text-xs font-medium bg-black/80 text-white rounded">
          {video.duration}
        </span>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-medium text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {video.title}
        </h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="truncate">{video.channel}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
          {video.views && <span>{video.views} visualizações</span>}
          {video.views && video.uploadedAt && <span>•</span>}
          {video.uploadedAt && <span>{video.uploadedAt}</span>}
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
