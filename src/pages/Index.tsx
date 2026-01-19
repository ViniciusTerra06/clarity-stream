import React, { useState, useMemo } from 'react';
import Header from '@/components/layout/Header';
import VideoGrid from '@/components/video/VideoGrid';
import FilterTabs from '@/components/filters/FilterTabs';
import { mockVideos } from '@/data/mockVideos';
import { useAuth } from '@/contexts/AuthContext';

const filterTabs = [
  { id: 'all', label: 'Todos' },
  { id: 'recent', label: 'Recentes' },
  { id: 'popular', label: 'Populares' },
];

const Index: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const { user } = useAuth();

  const filteredVideos = useMemo(() => {
    let videos = [...mockVideos];
    
    switch (activeFilter) {
      case 'recent':
        // Sort by most recent (using uploadedAt string)
        return videos.sort((a, b) => {
          const aRecent = a.uploadedAt?.includes('dia') || a.uploadedAt?.includes('hora');
          const bRecent = b.uploadedAt?.includes('dia') || b.uploadedAt?.includes('hora');
          return (bRecent ? 1 : 0) - (aRecent ? 1 : 0);
        });
      case 'popular':
        // Sort by views
        return videos.sort((a, b) => {
          const aViews = parseInt(a.views?.replace('K', '000') || '0');
          const bViews = parseInt(b.views?.replace('K', '000') || '0');
          return bViews - aViews;
        });
      default:
        return videos;
    }
  }, [activeFilter]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        {/* Welcome message for new users */}
        {!user && (
          <div className="mb-8 p-6 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-border">
            <h2 className="text-xl font-semibold mb-2">Bem-vindo ao StreamClean</h2>
            <p className="text-muted-foreground">
              Uma plataforma de vídeos focada em você. Sem distrações, sem anúncios intrusivos.
              <span className="text-primary font-medium ml-1">
                Faça login para salvar favoritos e criar sua lista pessoal.
              </span>
            </p>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6">
          <FilterTabs
            tabs={filterTabs}
            activeTab={activeFilter}
            onTabChange={setActiveFilter}
          />
        </div>

        {/* Video Grid */}
        <VideoGrid videos={filteredVideos} />
      </main>
    </div>
  );
};

export default Index;
