import { 
  Pressable, Text, TextInput, View, StyleSheet, SafeAreaView,
  ScrollView, TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useRef } from "react";
import { Image } from 'expo-image';
import VideoUpload from '@/components/VideoUpload';
import VideoPlayer from '@/components/VideoPlayer';
import { supabase } from '../../utils/supabase';
import { error_alert, success_alert } from '@/components/alert';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { paleta } from '@/components/colores';
import { estilos } from '@/components/estilos';
import { BotonLogin } from '@/components/botones';


export default function VideoUploadForm() {
  
  const [meaning, setMeaning] = useState('');
  const [meaningError, setMeaningError] = useState<string | null>(null);
  const [checkingMeaning, setCheckingMeaning] = useState(false);
  const [videoFile, setVideoFile] = useState<{ uri: string; name: string; type: string } | null>(null);
  const [subiendo, setSubiendo] = useState(false);
  const checkTimeoutRef = useRef<any>(null);

  useEffect(() => {
    const trimmed = meaning.trim();

    if (!trimmed) {
      setMeaningError(null);
      setCheckingMeaning(false);
      return;
    }

    setCheckingMeaning(true);
    if (checkTimeoutRef.current) clearTimeout(checkTimeoutRef.current);

    checkTimeoutRef.current = setTimeout(async () => {
      try {

        const { data, error } = await supabase
          .from('Senias')
          .select('id')
          .ilike('significado', trimmed);

        if (error) {
          console.error('Error checking significado:', error.message);

          setMeaningError(null);
        } else if (data && data.length > 0) {
          setMeaningError('La seña ya está creada');
        } else {
          setMeaningError(null);
        }
      } catch (e) {
        console.error('Error checking significado:', e);
        setMeaningError(null);
      } finally {
        setCheckingMeaning(false);
      }
    }, 500);

    return () => {
      if (checkTimeoutRef.current) clearTimeout(checkTimeoutRef.current);
    };
  }, [meaning]);

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
    if (meaningError) {
      error_alert('Revisa el significado: ' + meaningError);
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
      } finally {
        setSubiendo(false);
      }
  };

  return (
    <ThemedView style={styles.safeArea} lightColor={paleta.aqua_bck} darkColor="#1a1a1a">
      <ScrollView contentContainerStyle={styles.mainView}>
        <View style={styles.headerContainer}>
          <ThemedText type="title" style={styles.panelTitle}>Subir video de seña</ThemedText>
          <ThemedText type="defaultSemiBold" lightColor="#666" darkColor="#999" style={styles.subtitle}>Comparte tus videos de LSA con la comunidad</ThemedText>
        </View>

        <ThemedView style={[styles.card, estilos.shadow]} lightColor="white" darkColor="#2a2a2a">
          {videoFile && (
            <VideoPlayer 
              uri={videoFile.uri}
              style={styles.previewVideo}
            />
          )}
          
          <ThemedText type="defaultSemiBold" style={styles.label}>¿Qué significa la seña?</ThemedText>
          <TextInput
            placeholder="Ej: Hola, Gracias, etc."
            placeholderTextColor={"#888"}
            value={meaning}
            onChangeText={setMeaning}
            style={[styles.input, { backgroundColor: paleta.softgray }]}
          />
          {meaningError && (
            <ThemedText style={styles.errorText}>{meaningError}</ThemedText>
          )}


          {videoFile ? (
            <ThemedView style={styles.fileInfoContainer} lightColor={paleta.aqua_bck} darkColor="#3a3a3a">
              <Ionicons name="videocam" size={22} color={paleta.dark_aqua} />
              <ThemedText style={styles.fileName}>{videoFile.name}</ThemedText>
              <TouchableOpacity onPress={handleRemoveVideo} style={styles.removeFileBtn}>
                <Ionicons name="close-circle" size={20} color="#73d3c8ff" />
              </TouchableOpacity>
            </ThemedView>
          ) : (
            <VideoUpload onVideoUpload={handleVideoUpload} />
          )}

          {meaning.trim() !== '' && videoFile && !meaningError && (
            <BotonLogin 
              callback={handleSubmit} 
              textColor="white" 
              text={subiendo ? 'Subiendo...' : 'Guardar Seña'} 
              bckColor={paleta.dark_aqua}
            />
          )}
        </ThemedView>

        <ThemedView style={[styles.infoCard, estilos.shadow]} lightColor={paleta.softgray} darkColor="#2a2a2a">
          <ThemedText type="defaultSemiBold" style={styles.infoTitle}>¿Por qué subir tus videos?</ThemedText>
          <ThemedText style={styles.infoText}>
            Sube videos cortos de tus prácticas en Lengua de Señas Argentina (LSA) y contribuye a una comunidad de aprendizaje colaborativo. Tus videos ayudarán a otros usuarios a mejorar sus habilidades y a compartir conocimientos.
          </ThemedText>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  mainView: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 40,
    flexGrow: 1,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  panelTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 10,
  },
  card: {
    borderRadius: 16,
    padding: 22,
    marginBottom: 18,
    width: '90%',
    alignItems: 'center',
  },
  label: {
    marginBottom: 8,
    alignSelf: 'flex-start',
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    width: '100%',
    marginBottom: 18,
    fontSize: 16,
  },
  infoCard: {
    borderRadius: 16,
    padding: 20,
    width: '90%',
    marginTop: 12,
  },
  infoTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  fileInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    marginTop: 4,
    width: '100%',
  },
  fileName: {
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  removeFileBtn: {
    marginLeft: 8,
    padding: 4,
  },
  previewVideo: {
    marginBottom: 20,
    width: '100%',
    borderRadius: 10,
  },
  errorText: {
    color: '#cc0000',
    fontSize: 12,
    alignSelf: 'flex-start',
    marginTop: -12,
    marginBottom: 12,
  },
});