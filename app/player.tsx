import React from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import MediaPlayer from '@/components/MediaPlayer';
import { MediaItem } from '@/types/media';

export default function PlayerScreen() {
  const { mediaItem } = useLocalSearchParams<{ mediaItem: string }>();
  
  if (!mediaItem) {
    router.back();
    return null;
  }

  const parsedMediaItem: MediaItem = JSON.parse(mediaItem);

  const handleBack = () => {
    router.back();
  };

  return (
    <MediaPlayer 
      mediaItem={parsedMediaItem} 
      onBack={handleBack}
    />
  );
}