export type VideoSource = 'youtube' | 'vimeo';

export interface Video {
  id: string;
  videoId: string;
  title: string;
  thumbnail: string;
  channel: string;
  duration: string;
  source: VideoSource;
  views?: string;
  uploadedAt?: string;
}

export interface UserPreferences {
  theme: 'dark' | 'light';
  autoplay: boolean;
  showComments: boolean;
  showRecommendations: boolean;
}

export interface Profile {
  id: string;
  userId: string;
  username: string | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FavoriteVideo extends Video {
  createdAt: string;
}

export interface WatchHistoryVideo extends Video {
  watchedAt: string;
  progressSeconds: number;
}

export interface WatchLaterVideo extends Video {
  createdAt: string;
}
