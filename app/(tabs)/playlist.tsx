import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
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
      style={styles.playlistItem}
      onPress={() => handlePlayItem(item)}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        {item.type === 'video' ? (
          <Video size={20} color="#6366f1" />
        ) : (
          <Music size={20} color="#6366f1" />
        )}
      </View>
      
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>
          {item.title}
        </Text>
        {item.artist && (
          <Text style={styles.itemArtist}>
            {item.artist}
          </Text>
        )}
      </View>
      
      <View style={styles.itemActions}>
        <Text style={styles.duration}>
          {formatDuration(item.duration)}
        </Text>
        <TouchableOpacity
          onPress={() => handlePlayItem(item)}
          style={styles.playButtonSmall}
        >
          <Play size={16} color="white" fill="white" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Playlist</Text>
        <Text style={styles.headerSubtitle}>
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

      <TouchableOpacity style={styles.addButton}>
        <Plus size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  headerTitle: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    color: '#94a3b8',
    fontSize: 16,
  },
  playlistItem: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    borderRadius: 50,
    padding: 12,
    marginRight: 16,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemArtist: {
    color: '#94a3b8',
    fontSize: 14,
  },
  itemActions: {
    alignItems: 'flex-end',
  },
  duration: {
    color: '#64748b',
    fontSize: 14,
    marginBottom: 4,
  },
  playButtonSmall: {
    backgroundColor: '#6366f1',
    borderRadius: 50,
    padding: 8,
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#6366f1',
    borderRadius: 50,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});