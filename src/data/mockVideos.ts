import { Video } from '@/types/video';

export const mockVideos: Video[] = [
  {
    id: '1',
    videoId: 'dQw4w9WgXcQ',
    title: 'Como criar interfaces incríveis com React e TypeScript',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80',
    channel: 'Dev Academy',
    duration: '15:32',
    source: 'youtube',
    views: '125K',
    uploadedAt: '2 dias atrás'
  },
  {
    id: '2',
    videoId: 'jNQXAC9IVRw',
    title: 'Design Systems: O guia completo para desenvolvedores',
    thumbnail: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&q=80',
    channel: 'UI Master',
    duration: '28:45',
    source: 'youtube',
    views: '89K',
    uploadedAt: '5 dias atrás'
  },
  {
    id: '3',
    videoId: 'ZZ5LpwO-An4',
    title: 'Performance Web: Core Web Vitals explicados',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    channel: 'Performance Pro',
    duration: '22:18',
    source: 'youtube',
    views: '67K',
    uploadedAt: '1 semana atrás'
  },
  {
    id: '4',
    videoId: '9bZkp7q19f0',
    title: 'Tailwind CSS: Do básico ao avançado em 30 minutos',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    channel: 'CSS Wizard',
    duration: '31:22',
    source: 'youtube',
    views: '203K',
    uploadedAt: '3 dias atrás'
  },
  {
    id: '5',
    videoId: 'kXYiU_JCYtU',
    title: 'Supabase: Backend completo em minutos',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    channel: 'Backend Brasil',
    duration: '45:10',
    source: 'youtube',
    views: '156K',
    uploadedAt: '1 dia atrás'
  },
  {
    id: '6',
    videoId: 'Mus_vwhTCq0',
    title: 'UX Research: Entendendo seu usuário',
    thumbnail: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80',
    channel: 'UX Design Lab',
    duration: '19:55',
    source: 'youtube',
    views: '45K',
    uploadedAt: '4 dias atrás'
  },
  {
    id: '7',
    videoId: 'L_jWHffIx5E',
    title: 'TypeScript Avançado: Generics e Utility Types',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
    channel: 'TypeScript Pro',
    duration: '38:42',
    source: 'youtube',
    views: '78K',
    uploadedAt: '6 dias atrás'
  },
  {
    id: '8',
    videoId: 'ScMzIvxBSi4',
    title: 'React Query: Gerenciamento de estado server-side',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80',
    channel: 'React Masters',
    duration: '25:30',
    source: 'youtube',
    views: '92K',
    uploadedAt: '2 semanas atrás'
  },
  {
    id: '9',
    videoId: 'w7ejDZ8SWv8',
    title: 'Acessibilidade Web: WCAG 2.1 na prática',
    thumbnail: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&q=80',
    channel: 'A11y Brasil',
    duration: '33:15',
    source: 'youtube',
    views: '34K',
    uploadedAt: '1 semana atrás'
  },
  {
    id: '10',
    videoId: 'rfscVS0vtbw',
    title: 'Figma para Desenvolvedores: Workflow perfeito',
    thumbnail: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&q=80',
    channel: 'Design to Code',
    duration: '27:48',
    source: 'youtube',
    views: '118K',
    uploadedAt: '3 semanas atrás'
  },
  {
    id: '11',
    videoId: 'PkZNo7MFNFg',
    title: 'Git Avançado: Rebase, Cherry-pick e mais',
    thumbnail: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800&q=80',
    channel: 'Git Pro',
    duration: '42:20',
    source: 'youtube',
    views: '67K',
    uploadedAt: '5 dias atrás'
  },
  {
    id: '12',
    videoId: 'Ke90Tje7VS0',
    title: 'Next.js 14: App Router e Server Components',
    thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&q=80',
    channel: 'Next Academy',
    duration: '51:33',
    source: 'youtube',
    views: '245K',
    uploadedAt: '4 dias atrás'
  }
];

export const getVideoById = (id: string): Video | undefined => {
  return mockVideos.find(video => video.id === id);
};

export const searchVideos = (query: string): Video[] => {
  const lowerQuery = query.toLowerCase();
  return mockVideos.filter(
    video =>
      video.title.toLowerCase().includes(lowerQuery) ||
      video.channel.toLowerCase().includes(lowerQuery)
  );
};
