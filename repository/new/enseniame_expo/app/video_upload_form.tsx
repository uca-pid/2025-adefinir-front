import { 
  Pressable,
  Text,
  TextInput,
  View,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from "react";
import { router } from 'expo-router';
import { Image } from 'expo-image';
import VideoUpload from '@/components/VideoUpload';


export default function VideoUploadForm() {
  
  const [meaning, setMeaning] = useState('');
  const handleVideoUpload = (videoUri: string) => {
    console.log('Video subido:', videoUri);
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
          <Text style={styles.label}>¿Qué significa la seña?</Text>
          <TextInput
            placeholder="Ej: Hola, Gracias, etc."
            placeholderTextColor={"#888"}
            value={meaning}
            onChangeText={setMeaning}
            style={styles.input}
          />

          <VideoUpload onVideoUpload={handleVideoUpload} />

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
});