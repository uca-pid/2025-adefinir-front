import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useUserContext } from '@/context/UserContext';

export default function HomeTeacher() {
  const contexto = useUserContext();
  const teacherName = 'Prof. ' + contexto.user.username;
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Panel del Profesor</Text>
        <Text style={styles.subtitle}>Bienvenido, {teacherName}</Text>
        <Pressable style={styles.ctaButtonCursos} onPress={()=>router.push('/tabs/mis_modulos')}>
          <Ionicons name="albums-outline" size={24} color="#fff" style={styles.ctaIcon} />
          <Text style={styles.ctaButtonTextCursos}>Mis módulos</Text>
        </Pressable>
        <View style={styles.cardRow}>
          <Pressable onPress={()=>{router.push('/tabs/video_upload_form');}} style={styles.quickActionCardCursos}>
            <Ionicons name="videocam-outline" size={22} color="#20bfa9" />
            <Text style={styles.quickActionTextCursos}>Subir video de seña</Text>
          </Pressable>
          <Pressable style={styles.quickActionCardCursos}>
            <Ionicons name="school-outline" size={22} color="#20bfa9" />
            <Text style={styles.quickActionTextCursos}>Ver progreso de estudiantes</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6f7f2',
    position: 'relative',
    paddingTop: 0,
  },
  
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 60,
    zIndex: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 32,
    marginBottom: 8,
    alignSelf: 'center',
    zIndex: 2,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#20bfa9',
    fontWeight: '500',
    marginBottom: 18,
    alignSelf: 'center',
    zIndex: 2,
  },
  
  ctaButtonCursos: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#20bfa9',
    borderRadius: 14,
    height: 50,
    marginBottom: 8,
    paddingHorizontal: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  ctaButtonTextCursos: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quickActionCardCursos: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 18,
    marginHorizontal: 6,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    shadowColor: '#222',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  quickActionTextCursos: {
    color: '#20bfa9',
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 6,
    textAlign: 'center',
    fontFamily: 'System',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffb703',
    borderRadius: 14,
    height: 44,
    marginBottom: 8,
    paddingHorizontal: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  ctaIcon: {
    marginRight: 8,
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quickActionCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 18,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: '#20bfa9',
  },
  quickActionText: {
    color: '#20bfa9',
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 6,
    textAlign: 'center',
  },
});
