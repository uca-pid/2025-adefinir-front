import { 
  Pressable, Text, TextInput, View, StyleSheet, SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from "react";
import { Image } from 'expo-image';
import VideoUpload from '@/components/VideoUpload';
import VideoPlayer from '@/components/VideoPlayer';
import { supabase } from '../../utils/supabase';
import { error_alert, success_alert } from '@/components/alert';

export default function VideoUploadForm() {
  
  const [meaning, setMeaning] = useState('');
  const [videoFile, setVideoFile] = useState<{ uri: string; name: string; type: string } | null>(null);
  const [subiendo, setSubiendo] = useState(false);

  const handleVideoUpload = (video: { uri: string; name: string; type: string }) => {
    setVideoFile(video);
  };

  const handleRemoveVideo = () => {
    setVideoFile(null);
  };

  const getSignedUrl = async (bucketName: string, filePath: string): Promise<string> => {
    try {
      const expiresIn = 365 * 24 * 60 * 60; // 1 año
      
      const { data, error } = await supabase.storage
        .from(bucketName)
        .createSignedUrl(filePath, expiresIn);
      
      if (error) {
        throw new Error(`Error creating signed URL: ${error.message}`);
      }
      
      return data.signedUrl;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!meaning || !videoFile) {
      error_alert('Completa el significado y sube un video.');
      return;
    }
    setSubiendo(true);
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: videoFile.uri,
        name: videoFile.name,
        type: 'video/mp4'
      } as any);

      const filename = `Senias/${videoFile.name}`;
      const { data, error } = await supabase.storage
        .from('videos')
        .upload(filename, formData, {
          contentType: 'video/mp4',
          upsert: true
        });

      if (error) throw error;

      const videoPath = data.path;
      const videoUrl = await getSignedUrl('videos', videoPath);

      const { error: insertError } = await supabase
        .from('Senias')
        .insert([{ significado: meaning, video_url: videoUrl }]);

      if (insertError) throw insertError;

      success_alert('¡Seña subida con éxito!');
      setMeaning('');
      setVideoFile(null);
    } catch (e: any) {
      error_alert('Error al subir: ' + e.message);
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.mainView}>
        <View style={styles.headerContainer}>
          <Text style={styles.panelTitle}>Subir video de seña</Text>
          <Text style={styles.subtitle}>Comparte tus videos de LSA con la comunidad</Text>
        </View>

        <Image
          source={require('@/assets/images/LSA.png')}
          style={styles.logo}
        />

        <View style={styles.card}>
          {videoFile && (
            <VideoPlayer 
              uri={videoFile.uri}
              style={styles.previewVideo}
            />
          )}
          
          <Text style={styles.label}>¿Qué significa la seña?</Text>
          <TextInput
            placeholder="Ej: Hola, Gracias, etc."
            placeholderTextColor={"#888"}
            value={meaning}
            onChangeText={setMeaning}
            style={styles.input}
          />

          {videoFile ? (
            <View style={styles.fileInfoContainer}>
              <Ionicons name="videocam" size={22} color="#222" />
              <Text style={styles.fileName}>{videoFile.name}</Text>
              <Pressable onPress={handleRemoveVideo} style={styles.removeFileBtn}>
                <Ionicons name="close-circle" size={20} color="#dc3545" />
              </Pressable>
            </View>
          ) : (
            <VideoUpload onVideoUpload={handleVideoUpload} />
          )}

          {meaning.trim() !== '' && videoFile && (
            <Pressable style={styles.cursosBtn} onPress={handleSubmit} disabled={subiendo}>
              <Text style={styles.cursosBtnText}>{subiendo ? 'Subiendo...' : 'Subir Video'}</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>¿Por qué subir tus videos?</Text>
          <Text style={styles.infoText}>
            Sube videos cortos de tus prácticas en Lengua de Señas Argentina (LSA) y contribuye a una comunidad de aprendizaje colaborativo. Tus videos ayudarán a otros usuarios a mejorar sus habilidades y a compartir conocimientos.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#e6f7f2',
  },
  mainView: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 40,
    backgroundColor: '#e6f7f2',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 18,
  },
  panelTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#222',
    fontWeight: '500',
    marginBottom: 10,
    textAlign: 'center',
  },
  logo: {
    height: 120,
    width: 120,
    marginBottom: 18,
    borderRadius: 60,
    backgroundColor: '#fff',
    alignSelf: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 32,
    padding: 24,
    marginBottom: 18,
    width: '92%',
    alignItems: 'flex-start',
    shadowColor: '#222',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
  },
  label: {
    fontSize: 16,
    color: '#222',
    fontWeight: '600',
    marginBottom: 8,
    alignSelf: 'flex-start',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 10,
    width: '100%',
    marginBottom: 18,
    backgroundColor: '#fff',
    color: '#222',
  },
  cursosBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#20bfa9',
    borderRadius: 32,
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginTop: 18,
    alignSelf: 'center',
    width: '92%',
    shadowColor: '#222',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cursosBtnText: {
    color: '#222',
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 0.2,
    fontFamily: 'System',
    width: '100%',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    width: '92%',
    shadowColor: '#222',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
    marginTop: 8,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
  },
  infoTitle: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6,
    textAlign: 'center',
  },
  infoText: {
    color: '#222',
    fontSize: 14,
    textAlign: 'center',
  },
  fileInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f7f2',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    marginTop: 4,
    width: '100%',
  },
  fileName: {
    color: '#222',
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  removeFileBtn: {
    marginLeft: 8,
    padding: 2,
  },
  previewVideo: {
    marginBottom: 20,
    width: '100%',
  },
});
