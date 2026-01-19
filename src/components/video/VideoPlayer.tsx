import React, { useState } from 'react';
import { Video } from '@/types/video';
import { Heart, Clock, Share2, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  video: Video;
  isFavorite?: boolean;
  isWatchLater?: boolean;
  onFavoriteToggle?: () => void;
  onWatchLaterToggle?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  video,
  isFavorite = false,
  isWatchLater = false,
  onFavoriteToggle,
  onWatchLaterToggle,
}) => {
  const { user } = useAuth();
  const [focusMode, setFocusMode] = useState(false);
  const [isAddingFavorite, setIsAddingFavorite] = useState(false);
  const [isAddingWatchLater, setIsAddingWatchLater] = useState(false);

  const getEmbedUrl = () => {
    if (video.source === 'youtube') {
      return `https://www.youtube.com/embed/${video.videoId}?rel=0&modestbranding=1`;
    }
    return `https://player.vimeo.com/video/${video.videoId}`;
  };

  const handleFavorite = async () => {
    if (!user) {
      toast.error('Faça login para favoritar vídeos');
      return;
    }

    setIsAddingFavorite(true);
    try {
      if (isFavorite) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('video_id', video.id);
        toast.success('Removido dos favoritos');
      } else {
        await supabase.from('favorites').insert({
          user_id: user.id,
          video_id: video.id,
          video_title: video.title,
          video_thumbnail: video.thumbnail,
          video_channel: video.channel,
          video_duration: video.duration,
          video_source: video.source,
        });
        toast.success('Adicionado aos favoritos');
      }
      onFavoriteToggle?.();
    } catch (error) {
      toast.error('Erro ao atualizar favoritos');
    } finally {
      setIsAddingFavorite(false);
    }
  };

  const handleWatchLater = async () => {
    if (!user) {
      toast.error('Faça login para salvar vídeos');
      return;
    }

    setIsAddingWatchLater(true);
    try {
      if (isWatchLater) {
        await supabase
          .from('watch_later')
          .delete()
          .eq('user_id', user.id)
          .eq('video_id', video.id);
        toast.success('Removido de "Assistir Depois"');
      } else {
        await supabase.from('watch_later').insert({
          user_id: user.id,
          video_id: video.id,
          video_title: video.title,
          video_thumbnail: video.thumbnail,
          video_channel: video.channel,
          video_duration: video.duration,
          video_source: video.source,
        });
        toast.success('Adicionado a "Assistir Depois"');
      }
      onWatchLaterToggle?.();
    } catch (error) {
      toast.error('Erro ao atualizar lista');
    } finally {
      setIsAddingWatchLater(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: video.title,
          url,
        });
      } catch (error) {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success('Link copiado!');
    }
  };

  return (
    <div className={cn('w-full', focusMode && 'fixed inset-0 z-50 bg-background p-4')}>
      {/* Video Player */}
      <div className={cn('relative w-full bg-black rounded-xl overflow-hidden', focusMode ? 'h-full' : 'aspect-video')}>
        <iframe
          src={getEmbedUrl()}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>

      {/* Controls */}
      <div className={cn('flex items-center justify-between gap-4 mt-4', focusMode && 'absolute bottom-4 left-4 right-4')}>
        <div className="flex items-center gap-2">
          <Button
            variant={isFavorite ? 'default' : 'outline'}
            size="sm"
            onClick={handleFavorite}
            disabled={isAddingFavorite}
            className="gap-2"
          >
            <Heart className={cn('h-4 w-4', isFavorite && 'fill-current')} />
            <span className="hidden sm:inline">{isFavorite ? 'Favoritado' : 'Favoritar'}</span>
          </Button>
          
          <Button
            variant={isWatchLater ? 'default' : 'outline'}
            size="sm"
            onClick={handleWatchLater}
            disabled={isAddingWatchLater}
            className="gap-2"
          >
            <Clock className={cn('h-4 w-4', isWatchLater && 'fill-current')} />
            <span className="hidden sm:inline">{isWatchLater ? 'Salvo' : 'Assistir Depois'}</span>
          </Button>

          <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Compartilhar</span>
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setFocusMode(!focusMode)}
          className="gap-2"
        >
          {focusMode ? (
            <>
              <Minimize2 className="h-4 w-4" />
              <span className="hidden sm:inline">Sair do Foco</span>
            </>
          ) : (
            <>
              <Maximize2 className="h-4 w-4" />
              <span className="hidden sm:inline">Modo Foco</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default VideoPlayer;
