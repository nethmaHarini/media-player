import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
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
      style={styles.mediaItem}
      onPress={() => onItemPress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.thumbnail }}
          style={styles.thumbnail}
        />
        <View style={styles.overlay}>
          <View style={styles.playButton}>
            <Play size={24} color="white" fill="white" />
          </View>
        </View>
        <View style={styles.typeIcon}>
          {item.type === 'video' ? (
            <Video size={16} color="white" />
          ) : (
            <Music size={16} color="white" />
          )}
        </View>
      </View>
      
      <Text style={styles.title} numberOfLines={1}>
        {item.title}
      </Text>
      {item.artist && (
        <Text style={styles.artist} numberOfLines={1}>
          {item.artist}
        </Text>
      )}
      <Text style={styles.duration}>
        {formatDuration(item.duration)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Media</Text>
        <Text style={styles.headerSubtitle}>
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
  mediaItem: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    margin: 8,
    flex: 1,
    minWidth: '45%',
    maxWidth: '48%',
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  thumbnail: {
    width: '100%',
    height: 128,
    borderRadius: 8,
    backgroundColor: '#334155',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    backgroundColor: 'rgba(99, 102, 241, 0.8)',
    borderRadius: 50,
    padding: 12,
  },
  typeIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 50,
    padding: 4,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  artist: {
    color: '#94a3b8',
    fontSize: 14,
    marginBottom: 8,
  },
  duration: {
    color: '#64748b',
    fontSize: 12,
  },
});