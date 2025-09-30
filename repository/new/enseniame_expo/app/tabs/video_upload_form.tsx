import { 
  Pressable, Text, TextInput, View, StyleSheet,  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from "react";
import { Image } from 'expo-image';
import VideoUpload from '@/components/VideoUpload';
import VideoPlayer from '@/components/VideoPlayer';
import { supabase } from '../../utils/supabase';
import { error_alert, success_alert } from '@/components/alert';
import Toast from 'react-native-toast-message';


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
    // Calcular expiración en segundos (1 año = 365 días * 24 horas * 60 minutos * 60 segundos)
    const expiresIn = 365 * 24 * 60 * 60;
    
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
      // 1. Crear FormData para subir el archivo
      const formData = new FormData();
      formData.append('file', {
        uri: videoFile.uri,
        name: videoFile.name,
        type: 'video/mp4'
      } as any);

      // 2. Subir video al bucket usando FormData
      const filename = `Senias/${videoFile.name}`;
      const { data, error } = await supabase.storage
        .from('videos')
        .upload(filename, formData, {
          contentType: 'video/mp4',
          upsert: true
        });

      if (error) throw error;

      // 3. Obtener URL privada
      const videoPath = data.path;
      const videoUrl = await getSignedUrl('videos', videoPath);

      // 4. Guardar en la tabla
      const { error: insertError } = await supabase
        .from('Senias')
        .insert([{ significado: meaning, video_url: videoUrl }]);

      if (insertError) throw insertError;

      success_alert('¡Seña subida con éxito!');
      setMeaning('');
      setVideoFile(null);
    } catch (e: any) {
      error_alert('Error al subir: ' + e.message);
      //atrapar error de videos/señas repetidas
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
              <Ionicons name="videocam" size={22} color="#560bad" />
              <Text style={styles.fileName}>{videoFile.name}</Text>
              <Pressable onPress={handleRemoveVideo} style={styles.removeFileBtn}>
                <Ionicons name="close-circle" size={20} color="#F72585" />
              </Pressable>
            </View>
          ) : (
            <VideoUpload onVideoUpload={handleVideoUpload} />
          )}

          {meaning.trim() !== '' && videoFile && (
            <Pressable style={styles.ctaButton} onPress={handleSubmit} disabled={subiendo}>
              <Text style={styles.ctaButtonText}>{subiendo ? 'Subiendo...' : 'Guardar Seña'}</Text>
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
      <Toast/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f3e8ff',
  },
  mainView: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 40,
    backgroundColor: '#f3e8ff',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 18,
  },
  panelTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#560bad',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#560bad',
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
    borderRadius: 16,
    padding: 22,
    marginBottom: 18,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    color: '#560bad',
    fontWeight: '600',
    marginBottom: 8,
    alignSelf: 'flex-start',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    width: '100%',
    marginBottom: 18,
    backgroundColor: '#f8f9fa',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F72585',
    borderRadius: 14,
    height: 50,
    paddingHorizontal: 24,
    marginTop: 8,
    width: '100%',
  },
  ctaIcon: {
    marginRight: 10,
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  infoCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 14,
    padding: 18,
    width: '90%',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
    marginTop: 8,
  },
  infoTitle: {
    color: '#560bad',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6,
    textAlign: 'center',
  },
  infoText: {
    color: '#22223b',
    fontSize: 14,
    textAlign: 'center',
  },
  fileInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3e8ff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    marginTop: 4,
    width: '100%',
  },
  fileName: {
    color: '#560bad',
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