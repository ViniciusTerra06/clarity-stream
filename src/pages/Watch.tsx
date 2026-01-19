import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp, MessageSquare, ThumbsUp } from 'lucide-react';
import Header from '@/components/layout/Header';
import VideoPlayer from '@/components/video/VideoPlayer';
import VideoCard from '@/components/video/VideoCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getVideoById, mockVideos } from '@/data/mockVideos';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Video } from '@/types/video';

const Watch: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isWatchLater, setIsWatchLater] = useState(false);

  useEffect(() => {
    if (id) {
      const foundVideo = getVideoById(id);
      setVideo(foundVideo || null);
      setLoading(false);
      
      // Add to watch history if user is logged in
      if (user && foundVideo) {
        addToHistory(foundVideo);
        checkUserLists(foundVideo.id);
      }
    }
  }, [id, user]);

  const addToHistory = async (video: Video) => {
    if (!user) return;
    
    try {
      await supabase.from('watch_history').insert({
        user_id: user.id,
        video_id: video.id,
        video_title: video.title,
        video_thumbnail: video.thumbnail,
        video_channel: video.channel,
        video_duration: video.duration,
        video_source: video.source,
      });
    } catch (error) {
      console.error('Error adding to history:', error);
    }
  };

  const checkUserLists = async (videoId: string) => {
    if (!user) return;

    try {
      const [favResult, watchLaterResult] = await Promise.all([
        supabase
          .from('favorites')
          .select('id')
          .eq('user_id', user.id)
          .eq('video_id', videoId)
          .maybeSingle(),
        supabase
          .from('watch_later')
          .select('id')
          .eq('user_id', user.id)
          .eq('video_id', videoId)
          .maybeSingle(),
      ]);

      setIsFavorite(!!favResult.data);
      setIsWatchLater(!!watchLaterResult.data);
    } catch (error) {
      console.error('Error checking user lists:', error);
    }
  };

  const recommendations = mockVideos.filter(v => v.id !== id).slice(0, 6);

  // Mock comments
  const mockComments = [
    { id: 1, author: 'Maria Silva', text: 'Excelente conteúdo! Muito bem explicado.', likes: 45, time: '2 horas atrás' },
    { id: 2, author: 'João Santos', text: 'Esse vídeo me ajudou muito no meu projeto!', likes: 23, time: '5 horas atrás' },
    { id: 3, author: 'Ana Costa', text: 'Podia fazer um vídeo sobre TypeScript avançado?', likes: 12, time: '1 dia atrás' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <Skeleton className="aspect-video w-full max-w-4xl mx-auto rounded-xl" />
          <div className="max-w-4xl mx-auto mt-4 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </main>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Vídeo não encontrado</h1>
          <Button asChild>
            <Link to="/">Voltar para Home</Link>
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        {/* Back button */}
        <Button variant="ghost" size="sm" asChild className="mb-4 gap-2">
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            <VideoPlayer
              video={video}
              isFavorite={isFavorite}
              isWatchLater={isWatchLater}
              onFavoriteToggle={() => setIsFavorite(!isFavorite)}
              onWatchLaterToggle={() => setIsWatchLater(!isWatchLater)}
            />

            {/* Video Info */}
            <div className="mt-6">
              <h1 className="text-xl md:text-2xl font-bold">{video.title}</h1>
              
              <div className="flex items-center gap-4 mt-4 pb-4 border-b border-border">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-primary font-semibold">
                    {video.channel.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{video.channel}</p>
                  <p className="text-sm text-muted-foreground">
                    {video.views} visualizações • {video.uploadedAt}
                  </p>
                </div>
              </div>
            </div>

            {/* Comments Section - Collapsed by default */}
            <div className="mt-6">
              <button
                onClick={() => setShowComments(!showComments)}
                className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
              >
                <MessageSquare className="h-4 w-4" />
                Comentários ({mockComments.length})
                {showComments ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>

              {showComments && (
                <div className="mt-4 space-y-4">
                  {mockComments.map((comment) => (
                    <div key={comment.id} className="p-4 rounded-lg bg-card border border-border">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center shrink-0">
                          <span className="text-primary text-sm font-semibold">
                            {comment.author.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{comment.author}</span>
                            <span className="text-xs text-muted-foreground">{comment.time}</span>
                          </div>
                          <p className="text-sm mt-1">{comment.text}</p>
                          <button className="flex items-center gap-1 mt-2 text-xs text-muted-foreground hover:text-foreground">
                            <ThumbsUp className="h-3 w-3" />
                            {comment.likes}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Recommendations */}
          <div className="lg:col-span-1">
            <button
              onClick={() => setShowRecommendations(!showRecommendations)}
              className="flex items-center gap-2 text-sm font-medium mb-4 hover:text-primary transition-colors lg:hidden"
            >
              Recomendações ({recommendations.length})
              {showRecommendations ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>

            <div className={`space-y-4 ${!showRecommendations && 'hidden lg:block'}`}>
              <h3 className="font-semibold hidden lg:block">Recomendações</h3>
              {recommendations.map((rec) => (
                <VideoCard key={rec.id} video={rec} className="flex gap-3" />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Watch;
