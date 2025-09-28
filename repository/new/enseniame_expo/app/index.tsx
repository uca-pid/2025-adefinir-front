import {   StyleSheet} from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { Link, router } from 'expo-router';
import { Image } from 'expo-image';
import { HelloWave } from '@/components/HelloWave';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { BotonLogin } from '@/components/botones';
import { paleta } from '@/components/colores';

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
        <ThemedText>
          <ThemedText type="subtitle">¿Qué es </ThemedText>{''}
          <ThemedText type="subtitle">En</ThemedText>{''}
          <ThemedText type="subtitle" lightColor="#03a793">seña</ThemedText>{''}
          <ThemedText type="subtitle">me?</ThemedText>
        </ThemedText>
        <ThemedText>
          <ThemedText type="defaultSemiBold">En</ThemedText>{''}
          <ThemedText type="defaultSemiBold" lightColor="#03a793">seña</ThemedText>{''}
          <ThemedText type="defaultSemiBold">me</ThemedText>{' '}
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

      <BotonLogin callback={()=>{router.navigate('/signup_alumno');}} textColor={'black'} bckColor={paleta.dark_aqua} text={'Empezar'} />
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
  
})