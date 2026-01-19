import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, SlidersHorizontal } from 'lucide-react';
import Header from '@/components/layout/Header';
import VideoGrid from '@/components/video/VideoGrid';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { searchVideos, mockVideos } from '@/data/mockVideos';

const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [durationFilter, setDurationFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('relevance');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: query });
  };

  const results = useMemo(() => {
    let videos = initialQuery ? searchVideos(initialQuery) : mockVideos;

    // Filter by duration
    if (durationFilter !== 'all') {
      videos = videos.filter((video) => {
        const minutes = parseInt(video.duration.split(':')[0]);
        switch (durationFilter) {
          case 'short':
            return minutes < 10;
          case 'medium':
            return minutes >= 10 && minutes < 30;
          case 'long':
            return minutes >= 30;
          default:
            return true;
        }
      });
    }

    // Sort
    if (sortBy === 'views') {
      videos = [...videos].sort((a, b) => {
        const aViews = parseInt(a.views?.replace('K', '000') || '0');
        const bViews = parseInt(b.views?.replace('K', '000') || '0');
        return bViews - aViews;
      });
    } else if (sortBy === 'date') {
      videos = [...videos].sort((a, b) => {
        const aRecent = a.uploadedAt?.includes('dia') || a.uploadedAt?.includes('hora');
        const bRecent = b.uploadedAt?.includes('dia') || b.uploadedAt?.includes('hora');
        return (bRecent ? 1 : 0) - (aRecent ? 1 : 0);
      });
    }

    return videos;
  }, [initialQuery, durationFilter, sortBy]);

  const FiltersContent = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Duração</label>
        <Select value={durationFilter} onValueChange={setDurationFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Todas as durações" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as durações</SelectItem>
            <SelectItem value="short">Curto (&lt; 10 min)</SelectItem>
            <SelectItem value="medium">Médio (10-30 min)</SelectItem>
            <SelectItem value="long">Longo (&gt; 30 min)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Ordenar por</label>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger>
            <SelectValue placeholder="Relevância" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Relevância</SelectItem>
            <SelectItem value="views">Mais vistos</SelectItem>
            <SelectItem value="date">Mais recentes</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar vídeos, canais..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-12 pr-4 h-12 text-lg bg-secondary border-0 rounded-full"
              />
            </div>
          </form>
        </div>

        {/* Results header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            {initialQuery ? (
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">{results.length}</span> resultados para{' '}
                <span className="font-medium text-foreground">"{initialQuery}"</span>
              </p>
            ) : (
              <p className="text-muted-foreground">
                Explore <span className="font-medium text-foreground">{results.length}</span> vídeos
              </p>
            )}
          </div>

          {/* Desktop Filters */}
          <div className="hidden md:flex items-center gap-4">
            <Select value={durationFilter} onValueChange={setDurationFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Duração" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="short">Curto</SelectItem>
                <SelectItem value="medium">Médio</SelectItem>
                <SelectItem value="long">Longo</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Ordenar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevância</SelectItem>
                <SelectItem value="views">Mais vistos</SelectItem>
                <SelectItem value="date">Mais recentes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Mobile Filters */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="md:hidden gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filtros
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filtros</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FiltersContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Results Grid */}
        <VideoGrid
          videos={results}
          emptyMessage={
            initialQuery
              ? `Nenhum resultado encontrado para "${initialQuery}"`
              : 'Nenhum vídeo encontrado'
          }
        />
      </main>
    </div>
  );
};

export default Search;
