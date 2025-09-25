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
import { Link, router } from 'expo-router';
import { Image } from 'expo-image';
import { HelloWave } from '@/components/HelloWave';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { estilos } from '@/components/estilos';

export default function Index() {
  return (
    <ParallaxScrollView
          headerBackgroundColor={{ light: '#4CC9F0', dark: '#1D3D47' }}
          headerImage={
            <Image
              source={require('@/assets/images/LSA-recorte.png')}
              style={styles.logo}
            />
          }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">¡Hola!</ThemedText>
        <HelloWave />
      </ThemedView>
      
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">¿Qué es enSEÑAme?</ThemedText>
        <ThemedText>
          <ThemedText type="defaultSemiBold">enSEÑAme</ThemedText>{' '}
           es una aplicación de aprendizaje de 
          <ThemedText type="defaultSemiBold"> Lengua de Señas Argentina (LSA)</ThemedText>.
        </ThemedText>
          
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">¿Para quién es?</ThemedText>
        <ThemedText>
          Está pensada para personas oyentes que desean aprender 
          <ThemedText type="defaultSemiBold"> LSA</ThemedText>{' '}
           para poder comunicarse con las personas sordas en su lengua natural. 
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Primeros pasos</ThemedText>
        <ThemedText>
          {`Para comenzar, creá una nueva cuenta y... `}
          <ThemedText type="defaultSemiBold">¡a aprender!</ThemedText>
        </ThemedText>
      </ThemedView>

      <View style={{flexDirection:"row", alignContent:"center",justifyContent:"center"}}>
        <Pressable onPress={()=>{router.navigate('/signup_alumno');}} style={styles.loginButton} >
          <ThemedText type="subtitle" lightColor='white'>Soy alumno</ThemedText>
        </Pressable>
        <Pressable onPress={()=>{router.navigate('/signup_profe');}} style={styles.loginButton} >
            <ThemedText type="subtitle" lightColor='white'>Soy profesor</ThemedText>
        </Pressable>
      </View>
        
      <View style={estilos.centrado} >
        <ThemedText >¿Ya tienes un usuario? </ThemedText>
        <Pressable onPress={()=>{router.navigate('/login');}} style={styles.loginButton2} >
          <ThemedText type="subtitle" lightColor='white'>Inicia sesión aquí</ThemedText>
        </Pressable>
      </View>
    
    </ParallaxScrollView>
  );
}
const styles = StyleSheet.create({
  
  logo: {
    height: "100%",
    width: "100%",
    bottom: 0,
    left: 0,
    position: "absolute",
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
  loginButton2: {
      backgroundColor: '#7209B7',
      borderRadius: 10,
      height: 50,
      padding: 10,
      paddingHorizontal: 20,
      justifyContent: 'center',
      alignItems: 'center',
      margin: 5,
  },
})