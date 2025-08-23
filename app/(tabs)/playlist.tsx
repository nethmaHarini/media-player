import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { sampleMediaItems } from '@/data/sampleMedia';
import { MediaItem } from '@/types/media';
import { Play, Music, Video, Plus } from 'lucide-react-native';
import { router } from 'expo-router';

export default function PlaylistScreen() {
  const [playlist, setPlaylist] = useState<MediaItem[]>(sampleMediaItems.slice(0, 3));

  const handlePlayItem = (item: MediaItem) => {
    router.push({
      pathname: '/player',
      params: { mediaItem: JSON.stringify(item) }
    });
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderPlaylistItem = ({ item, index }: { item: MediaItem; index: number }) => (
    <TouchableOpacity
      className="bg-dark-800 rounded-xl p-4 mb-3 flex-row items-center"
      onPress={() => handlePlayItem(item)}
      activeOpacity={0.8}
    >
      <View className="bg-primary/20 rounded-full p-3 mr-4">
        {item.type === 'video' ? (
          <Video size={20} color="#6366f1" />
        ) : (
          <Music size={20} color="#6366f1" />
        )}
      </View>
      
      <View className="flex-1">
        <Text className="text-white text-lg font-semibold mb-1">
          {item.title}
        </Text>
        {item.artist && (
          <Text className="text-dark-400 text-sm">
            {item.artist}
          </Text>
        )}
      </View>
      
      <View className="items-end">
        <Text className="text-dark-500 text-sm mb-1">
          {formatDuration(item.duration)}
        </Text>
        <TouchableOpacity
          onPress={() => handlePlayItem(item)}
          className="bg-primary rounded-full p-2"
        >
          <Play size={16} color="white" fill="white" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-dark-900">
      <View className="px-4 py-6">
        <Text className="text-white text-3xl font-bold mb-2">My Playlist</Text>
        <Text className="text-dark-400 text-base">
          {playlist.length} songs in queue
        </Text>
      </View>
      
      <FlatList
        data={playlist}
        renderItem={renderPlaylistItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity className="absolute bottom-6 right-6 bg-primary rounded-full p-4 shadow-lg">
        <Plus size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}