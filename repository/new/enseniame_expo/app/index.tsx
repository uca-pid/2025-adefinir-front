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
import { HelloWave } from '@/components/HelloWave';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function Login() {
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
        <Pressable onPress={()=>{router.replace('/signup');}} style={{borderWidth:3,backgroundColor: '#4CC9F0', padding:10, margin:5}} >
          <ThemedText type="subtitle" lightColor='white'>Soy alumno</ThemedText>
        </Pressable>
        <Pressable onPress={()=>{router.replace('/signup');}} style={{borderWidth:3,backgroundColor: '#4CC9F0', padding:10, margin:5}} >
            <ThemedText type="subtitle" lightColor='white'>Soy profesor</ThemedText>
        </Pressable>
      </View>
        
      <View >
        <ThemedText >¿Ya tienes un usuario? </ThemedText>
        <Link href="/login" >
          <ThemedText type='link'>Inicia sesión aquí</ThemedText>
        </Link>
      </View>
    
    </ParallaxScrollView>
  );
}
const styles = StyleSheet.create({
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
})