import { 
  Pressable, Text, TextInput, View, StyleSheet,  SafeAreaView,
  ScrollView,  KeyboardAvoidingView,  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from "react";
import { Image } from 'expo-image';
import VideoUpload from '@/components/VideoUpload';
import VideoPlayer from '@/components/VideoPlayer';
import { error_alert, success_alert } from '@/components/alert';
import Toast from 'react-native-toast-message';
import { router, useLocalSearchParams } from 'expo-router';
import { borrar_video_de_storage, cambiar_nombre_senia, cambiar_video, subir_senia } from '@/conexiones/videos';
import { paleta } from '@/components/colores';

export default function VideoUploadForm() {
    const {id_senia=0,url,significado} =useLocalSearchParams();
    if (id_senia==0) router.back();

    const {name,type}= getNameAndTypeFromURL(String(url));
  
  const [meaning, setMeaning] = useState(String(significado));
  const [videoFile, setVideoFile] = useState<{ uri: string; name: string; type: string } | null>({uri:String(url),name:name,type:type});
  const [subiendo, setSubiendo] = useState(false);

  const handleVideoUpload = (video: { uri: string; name: string; type: string }) => {
    setVideoFile(video);
  };

  const handleRemoveVideo = () => {
    setVideoFile(null);
  };

  const handleSubmit = async () => {
    if (!meaning || !videoFile) {
      error_alert('Completa el significado y sube un video.');
      return;
    }
    setSubiendo(true);
    try {
      //si cambio el video
        if (name!=videoFile.name || type!=videoFile.type) {
            borrar_video_de_storage(String(url))
            cambiar_video(videoFile,Number(id_senia))
        }

      //si cambio el significado
      if (significado!=meaning) cambiar_nombre_senia(meaning,Number(id_senia));

      //si cambio la categoria (después)

      success_alert('¡Seña subida con éxito!'),

      setMeaning('');
      setVideoFile(null);
    } catch (e: any) {
      error_alert('Error al subir: ' + e.message);
      //atrapar error de videos/señas repetidas
    } finally {
      setSubiendo(false);
      setTimeout(()=> {
        router.dismiss();
        router.replace("/tabs/Diccionario");}, 700);
    }
  };

  return (
    <View style={styles.safeArea}>
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{flex: 1,width:"100%"}}
          >
      <ScrollView contentContainerStyle={styles.mainView}>
        <View style={styles.headerContainer}>
          <Text style={styles.panelTitle}>Editar video de seña</Text>
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
              <Ionicons name="videocam" size={22} color="#34a0a4" />
              <Text style={styles.fileName}>{videoFile.name}</Text>
              <Pressable onPress={handleRemoveVideo} style={styles.removeFileBtn}>
                <Ionicons name="close-circle" size={20} color={paleta.strong_yellow} />
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
      </KeyboardAvoidingView>
      <Toast/>
    </View>
  );
}

const getNameAndTypeFromURL = (url:string)=>{
    const partes= url.split("/");
    const index = partes.indexOf("Senias") +1;
    const nameAndType = partes[index];
    const name = nameAndType.split(".")[0];
    const type = nameAndType.split(".")[1].split("?")[0];
    return {name,type}
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: paleta.aqua_bck,
  },
  mainView: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 40,
    backgroundColor: paleta.aqua_bck,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 18,
  },
  panelTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#34a0a4',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#34a0a4',
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
    color: '#34a0a4',
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
    backgroundColor: paleta.aqua_bck,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: paleta.yellow,
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
    backgroundColor: paleta.aqua_bck,
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
    color: '#34a0a4',
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
    backgroundColor: paleta.aqua_bck,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    marginTop: 4,
    width: '100%',
  },
  fileName: {
    color: '#34a0a4',
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