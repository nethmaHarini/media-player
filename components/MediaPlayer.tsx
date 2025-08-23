import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import Slider from 'react-native-slider';
import { MediaItem, PlayerState } from '@/types/media';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Maximize,
  Minimize,
  ArrowLeft 
} from 'lucide-react-native';

interface MediaPlayerProps {
  mediaItem: MediaItem;
  onBack: () => void;
}

export default function MediaPlayer({ mediaItem, onBack }: MediaPlayerProps) {
  const videoRef = useRef<Video>(null);
  const [playerState, setPlayerState] = useState<PlayerState>({
    isPlaying: false,
    position: 0,
    duration: 0,
    isLoading: true,
    volume: 1.0,
    isLooping: false,
    isFullscreen: false,
  });
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (playerState.isPlaying) {
      interval = setInterval(updateProgress, 100);
    }
    return () => clearInterval(interval);
  }, [playerState.isPlaying]);

  const updateProgress = async () => {
    if (videoRef.current) {
      const status = await videoRef.current.getStatusAsync();
      if (status.isLoaded) {
        setPlayerState(prev => ({
          ...prev,
          position: status.positionMillis || 0,
          duration: status.durationMillis || 0,
          isPlaying: status.isPlaying,
          isLoading: false,
        }));
      }
    }
  };

  const togglePlayPause = async () => {
    if (videoRef.current) {
      if (playerState.isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
    }
  };

  const handleSeek = async (value: number) => {
    if (videoRef.current) {
      await videoRef.current.setPositionAsync(value);
    }
  };

  const toggleMute = async () => {
    if (videoRef.current) {
      const newMutedState = !isMuted;
      setIsMuted(newMutedState);
      await videoRef.current.setVolumeAsync(newMutedState ? 0 : playerState.volume);
    }
  };

  const handleVolumeChange = async (value: number) => {
    setPlayerState(prev => ({ ...prev, volume: value }));
    if (videoRef.current && !isMuted) {
      await videoRef.current.setVolumeAsync(value);
    }
  };

  const toggleLoop = async () => {
    const newLoopState = !playerState.isLooping;
    setPlayerState(prev => ({ ...prev, isLooping: newLoopState }));
    if (videoRef.current) {
      await videoRef.current.setIsLoopingAsync(newLoopState);
    }
  };

  const toggleFullscreen = () => {
    setPlayerState(prev => ({ ...prev, isFullscreen: !prev.isFullscreen }));
  };

  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const videoStyle = playerState.isFullscreen 
    ? { width: screenHeight, height: screenWidth }
    : { width: screenWidth, height: screenWidth * 0.56 };

  return (
    <View className="flex-1 bg-dark-900">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-12 pb-4">
        <TouchableOpacity
          onPress={onBack}
          className="bg-dark-800 rounded-full p-3"
        >
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <View className="flex-1 mx-4">
          <Text className="text-white text-lg font-semibold" numberOfLines={1}>
            {mediaItem.title}
          </Text>
          {mediaItem.artist && (
            <Text className="text-dark-400 text-sm" numberOfLines={1}>
              {mediaItem.artist}
            </Text>
          )}
        </View>
      </View>

      {/* Video/Audio Player */}
      <View className="bg-black" style={videoStyle}>
        <Video
          ref={videoRef}
          source={{ uri: mediaItem.uri }}
          style={{ flex: 1 }}
          resizeMode={ResizeMode.CONTAIN}
          isLooping={playerState.isLooping}
          volume={isMuted ? 0 : playerState.volume}
          onLoad={(status) => {
            setPlayerState(prev => ({
              ...prev,
              duration: status.durationMillis || 0,
              isLoading: false,
            }));
          }}
          onPlaybackStatusUpdate={(status) => {
            if (status.isLoaded) {
              setPlayerState(prev => ({
                ...prev,
                position: status.positionMillis || 0,
                isPlaying: status.isPlaying,
              }));
            }
          }}
        />
        
        {/* Overlay Controls for Video */}
        {mediaItem.type === 'video' && showControls && (
          <View className="absolute inset-0 flex items-center justify-center">
            <TouchableOpacity
              onPress={togglePlayPause}
              className="bg-black/50 rounded-full p-6"
            >
              {playerState.isPlaying ? (
                <Pause size={48} color="white" fill="white" />
              ) : (
                <Play size={48} color="white" fill="white" />
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Controls */}
      <View className="flex-1 px-6 py-8">
        {/* Progress Bar */}
        <View className="mb-6">
          <Slider
            value={playerState.position}
            minimumValue={0}
            maximumValue={playerState.duration}
            onValueChange={handleSeek}
            minimumTrackTintColor="#6366f1"
            maximumTrackTintColor="#334155"
            thumbStyle={{
              backgroundColor: '#6366f1',
              width: 20,
              height: 20,
            }}
            trackStyle={{ height: 4, borderRadius: 2 }}
          />
          <View className="flex-row justify-between mt-2">
            <Text className="text-dark-400 text-sm">
              {formatTime(playerState.position)}
            </Text>
            <Text className="text-dark-400 text-sm">
              {formatTime(playerState.duration)}
            </Text>
          </View>
        </View>

        {/* Main Controls */}
        <View className="flex-row items-center justify-center mb-8">
          <TouchableOpacity
            onPress={toggleLoop}
            className={`mx-4 p-4 rounded-full ${
              playerState.isLooping ? 'bg-primary' : 'bg-dark-800'
            }`}
          >
            <RotateCcw size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={togglePlayPause}
            className="bg-primary mx-6 p-6 rounded-full shadow-lg"
          >
            {playerState.isPlaying ? (
              <Pause size={32} color="white" fill="white" />
            ) : (
              <Play size={32} color="white" fill="white" />
            )}
          </TouchableOpacity>

          {mediaItem.type === 'video' && (
            <TouchableOpacity
              onPress={toggleFullscreen}
              className="mx-4 p-4 bg-dark-800 rounded-full"
            >
              {playerState.isFullscreen ? (
                <Minimize size={24} color="white" />
              ) : (
                <Maximize size={24} color="white" />
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* Volume Control */}
        <View className="flex-row items-center">
          <TouchableOpacity onPress={toggleMute} className="mr-4">
            {isMuted ? (
              <VolumeX size={24} color="#64748b" />
            ) : (
              <Volume2 size={24} color="#6366f1" />
            )}
          </TouchableOpacity>
          <View className="flex-1">
            <Slider
              value={isMuted ? 0 : playerState.volume}
              minimumValue={0}
              maximumValue={1}
              onValueChange={handleVolumeChange}
              minimumTrackTintColor="#6366f1"
              maximumTrackTintColor="#334155"
              thumbStyle={{
                backgroundColor: '#6366f1',
                width: 16,
                height: 16,
              }}
              trackStyle={{ height: 3, borderRadius: 1.5 }}
            />
          </View>
        </View>
      </View>
    </View>
  );
}