import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { MediaItem } from '@/types/media';
import { Play, Music, Video } from 'lucide-react-native';

interface MediaListProps {
  mediaItems: MediaItem[];
  onItemPress: (item: MediaItem) => void;
}

export default function MediaList({ mediaItems, onItemPress }: MediaListProps) {
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderMediaItem = ({ item }: { item: MediaItem }) => (
    <TouchableOpacity
      className="bg-dark-800 rounded-xl p-4 m-2 flex-1 shadow-lg"
      style={{ minWidth: '45%', maxWidth: '48%' }}
      onPress={() => onItemPress(item)}
      activeOpacity={0.8}
    >
      <View className="relative mb-3">
        <Image
          source={{ uri: item.thumbnail }}
          className="w-full h-32 rounded-lg"
          style={{ backgroundColor: '#334155' }}
        />
        <View className="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center">
          <View className="bg-primary/80 rounded-full p-3">
            <Play size={24} color="white" fill="white" />
          </View>
        </View>
        <View className="absolute top-2 right-2 bg-black/60 rounded-full p-1">
          {item.type === 'video' ? (
            <Video size={16} color="white" />
          ) : (
            <Music size={16} color="white" />
          )}
        </View>
      </View>
      
      <Text className="text-white text-lg font-semibold mb-1" numberOfLines={1}>
        {item.title}
      </Text>
      {item.artist && (
        <Text className="text-dark-400 text-sm mb-2" numberOfLines={1}>
          {item.artist}
        </Text>
      )}
      <Text className="text-dark-500 text-xs">
        {formatDuration(item.duration)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-dark-900">
      <View className="px-4 py-6">
        <Text className="text-white text-3xl font-bold mb-2">My Media</Text>
        <Text className="text-dark-400 text-base">
          {mediaItems.length} items available
        </Text>
      </View>
      
      <FlatList
        data={mediaItems}
        renderItem={renderMediaItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}