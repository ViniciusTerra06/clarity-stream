import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Heart, Clock, History, Settings, Moon, Sun, Play, MessageSquare, LayoutList, Trash2 } from 'lucide-react';
import Header from '@/components/layout/Header';
import VideoCard from '@/components/video/VideoCard';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { supabase } from '@/integrations/supabase/client';
import { Video } from '@/types/video';
import { toast } from 'sonner';

interface UserPrefs {
  autoplay: boolean;
  showComments: boolean;
  showRecommendations: boolean;
}

const Profile: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  
  const [favorites, setFavorites] = useState<Video[]>([]);
  const [watchLater, setWatchLater] = useState<Video[]>([]);
  const [history, setHistory] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState<UserPrefs>({
    autoplay: false,
    showComments: false,
    showRecommendations: false,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth', { state: { from: { pathname: '/profile' } } });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const [favsResult, watchLaterResult, historyResult, prefsResult] = await Promise.all([
        supabase
          .from('favorites')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('watch_later')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('watch_history')
          .select('*')
          .eq('user_id', user.id)
          .order('watched_at', { ascending: false })
          .limit(20),
        supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle(),
      ]);

      if (favsResult.data) {
        setFavorites(favsResult.data.map(mapDbToVideo));
      }
      if (watchLaterResult.data) {
        setWatchLater(watchLaterResult.data.map(mapDbToVideo));
      }
      if (historyResult.data) {
        // Remove duplicates (keep most recent)
        const uniqueHistory = historyResult.data.reduce((acc: any[], curr) => {
          if (!acc.find(v => v.video_id === curr.video_id)) {
            acc.push(curr);
          }
          return acc;
        }, []);
        setHistory(uniqueHistory.map(mapDbToVideo));
      }
      if (prefsResult.data) {
        setPreferences({
          autoplay: prefsResult.data.autoplay,
          showComments: prefsResult.data.show_comments,
          showRecommendations: prefsResult.data.show_recommendations,
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const mapDbToVideo = (row: any): Video => ({
    id: row.video_id,
    videoId: row.video_id,
    title: row.video_title,
    thumbnail: row.video_thumbnail || '',
    channel: row.video_channel || '',
    duration: row.video_duration || '',
    source: row.video_source || 'youtube',
  });

  const updatePreference = async (key: keyof UserPrefs, value: boolean) => {
    if (!user) return;

    const newPrefs = { ...preferences, [key]: value };
    setPreferences(newPrefs);

    const dbKey = key === 'showComments' ? 'show_comments' : 
                  key === 'showRecommendations' ? 'show_recommendations' : key;

    try {
      await supabase
        .from('user_preferences')
        .update({ [dbKey]: value })
        .eq('user_id', user.id);
    } catch (error) {
      console.error('Error updating preference:', error);
      toast.error('Erro ao salvar preferência');
    }
  };

  const clearHistory = async () => {
    if (!user) return;

    try {
      await supabase
        .from('watch_history')
        .delete()
        .eq('user_id', user.id);
      setHistory([]);
      toast.success('Histórico limpo');
    } catch (error) {
      toast.error('Erro ao limpar histórico');
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        {/* Profile Header */}
        <div className="flex items-center gap-4 mb-8 p-6 rounded-xl bg-card border border-border">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold">{user.email}</h1>
            <p className="text-muted-foreground text-sm">
              Membro desde {new Date(user.created_at).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="favorites" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="favorites" className="gap-2">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Favoritos</span>
            </TabsTrigger>
            <TabsTrigger value="watchlater" className="gap-2">
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Assistir Depois</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">Histórico</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Preferências</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="favorites">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-video rounded-xl" />
                ))}
              </div>
            ) : favorites.length === 0 ? (
              <div className="text-center py-16">
                <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Nenhum vídeo favoritado ainda</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {favorites.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="watchlater">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-video rounded-xl" />
                ))}
              </div>
            ) : watchLater.length === 0 ? (
              <div className="text-center py-16">
                <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Sua lista "Assistir Depois" está vazia</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {watchLater.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="history">
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground">
                {history.length} vídeos no histórico
              </p>
              {history.length > 0 && (
                <Button variant="outline" size="sm" onClick={clearHistory} className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  Limpar histórico
                </Button>
              )}
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-video rounded-xl" />
                ))}
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-16">
                <History className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Nenhum vídeo assistido ainda</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {history.map((video, index) => (
                  <VideoCard key={`${video.id}-${index}`} video={video} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings">
            <div className="max-w-lg space-y-6">
              <div className="p-6 rounded-xl bg-card border border-border space-y-6">
                <h3 className="font-semibold">Aparência</h3>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {theme === 'dark' ? (
                      <Moon className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <Sun className="h-5 w-5 text-muted-foreground" />
                    )}
                    <Label htmlFor="theme">Modo Escuro</Label>
                  </div>
                  <Switch
                    id="theme"
                    checked={theme === 'dark'}
                    onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                  />
                </div>
              </div>

              <div className="p-6 rounded-xl bg-card border border-border space-y-6">
                <h3 className="font-semibold">Player de Vídeo</h3>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Play className="h-5 w-5 text-muted-foreground" />
                    <Label htmlFor="autoplay">Autoplay</Label>
                  </div>
                  <Switch
                    id="autoplay"
                    checked={preferences.autoplay}
                    onCheckedChange={(checked) => updatePreference('autoplay', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 text-muted-foreground" />
                    <Label htmlFor="comments">Mostrar comentários por padrão</Label>
                  </div>
                  <Switch
                    id="comments"
                    checked={preferences.showComments}
                    onCheckedChange={(checked) => updatePreference('showComments', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <LayoutList className="h-5 w-5 text-muted-foreground" />
                    <Label htmlFor="recommendations">Mostrar recomendações por padrão</Label>
                  </div>
                  <Switch
                    id="recommendations"
                    checked={preferences.showRecommendations}
                    onCheckedChange={(checked) => updatePreference('showRecommendations', checked)}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Profile;
