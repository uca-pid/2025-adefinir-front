import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

interface VideoPlayerProps {
  uri: string;
  style?: any;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ uri, style }) => {
  const video = useRef<Video>(null);
  const [status, setStatus] = useState<AVPlaybackStatus | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = async () => {
    if (!video.current) return;

    if (isPlaying) {
      await video.current.pauseAsync();
    } else {
      await video.current.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <View style={[styles.container, style]}>
      <Video
        ref={video}
        style={styles.video}
        source={{ uri }}
        useNativeControls={false}
        resizeMode={ResizeMode.CONTAIN}
        isLooping
        onPlaybackStatusUpdate={status => setStatus(status)}
      />
      <TouchableOpacity 
        style={styles.playButton} 
        onPress={handlePlayPause}
      >
        <Ionicons 
          name={isPlaying ? "pause" : "play"} 
          size={24} 
          color="white" 
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 16/9,
    backgroundColor: '#000',
    borderRadius: 8,
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  playButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default VideoPlayer;