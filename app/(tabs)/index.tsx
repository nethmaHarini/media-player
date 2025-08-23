import React from 'react';
import { router } from 'expo-router';
import MediaList from '@/components/MediaList';
import { sampleMediaItems } from '@/data/sampleMedia';
import { MediaItem } from '@/types/media';

export default function HomeScreen() {
  const handleMediaItemPress = (item: MediaItem) => {
    router.push({
      pathname: '/player',
      params: { mediaItem: JSON.stringify(item) }
    });
  };

  return (
    <MediaList 
      mediaItems={sampleMediaItems} 
      onItemPress={handleMediaItemPress} 
    />
  );
}