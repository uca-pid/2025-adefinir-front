import { 
  Pressable,
  Text,
  TextInput,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { useEffect, useState } from "react";
import { Link, router } from 'expo-router';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import VideoUpload from '@/components/VideoUpload';

export default function VideoUploadForm() {
  const handleVideoUpload = (videoUri: string) => {
    console.log('Video subido:', videoUri);
  };

  return (
    <ParallaxScrollView
          headerBackgroundColor={{ light: '#4CC9F0', dark: '#1D3D47' }}
          headerImage={
            <Image
              source={require('@/assets/images/LSA.png')}
              style={styles.logo}
            />
          }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Comparte tus videos de LSA con la comunidad</ThemedText>
      </ThemedView>

      <VideoUpload onVideoUpload={handleVideoUpload} />

      <ThemedView style={[styles.stepContainer, styles.centrado]}>
        <ThemedText>
          Sube videos de tus prácticas en Lengua de Señas Argentina (LSA) y contribuye a una comunidad de aprendizaje colaborativo. 
          Tus videos ayudarán a otros usuarios a mejorar sus habilidades y a compartir conocimientos.
        </ThemedText>
      </ThemedView>

      </ParallaxScrollView>
  );
}


const styles = StyleSheet.create({
  centrado:{
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center"
  },
  logo: {
    height: 350,
    width: "100%",
    bottom: -100,
    left: 0,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  loginButton: {
      backgroundColor: '#F72585',
      borderRadius: 10,
      height: 50,
      padding: 10,
      paddingHorizontal: 20,
      justifyContent: 'center',
      alignItems: 'center',
      margin: 5,
  },
})