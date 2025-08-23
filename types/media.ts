export interface MediaItem {
  id: string;
  title: string;
  artist?: string;
  duration: number;
  uri: string;
  type: 'audio' | 'video';
  thumbnail?: string;
}

export interface PlayerState {
  isPlaying: boolean;
  position: number;
  duration: number;
  isLoading: boolean;
  volume: number;
  isLooping: boolean;
  isFullscreen: boolean;
}