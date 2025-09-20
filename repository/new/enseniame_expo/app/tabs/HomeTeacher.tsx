import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link , router} from 'expo-router';
import { useUserContext } from '@/context/UserContext';

export default function HomeTeacher() {
  const contexto = useUserContext();
  // Simulación de nombre docente
  const teacherName = 'Prof. '+ contexto.user.username;
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.mainView}>
        {/* Encabezado */}
        <View style={styles.headerContainer}>
          <Text style={styles.panelTitle}>Panel del Profesor <Text style={{fontSize:22}}></Text></Text>
          <Text style={styles.teacherName}>Bienvenido, {teacherName}</Text>
        </View>

        {/* CTA principal */}
        <Pressable style={styles.ctaButton}>
          <Ionicons name="add" size={28} color="#fff" style={styles.ctaIcon} />
          <Text style={styles.ctaButtonText}>Crear contenido</Text>
        </Pressable>

        {/* Gestión rápida */}
        <View style={styles.quickActionsRow}>
          <Pressable onPress={()=>{router.push('/tabs/video_upload_form');}} style={styles.quickActionCard}>
            <Ionicons name="videocam-outline" size={26} color="#560bad" />
            <Text style={styles.quickActionText}>Subir video de seña</Text>
          </Pressable>
          <Pressable style={styles.quickActionCard}>
            <Ionicons name="school-outline" size={26} color="#560bad" />
            <Text style={styles.quickActionText}>Ver progreso de estudiantes</Text>
          </Pressable>
        </View>


        {/* Barra de navegación inferior con botón flotante */}
        {/* <View style={styles.navBar}>
          <View style={styles.navItem}>
            <Ionicons name="home" size={22} color="#fff" />
            <Text style={styles.navText}>Inicio</Text>
          </View>
          <View style={styles.navItem}>
            <Ionicons name="book" size={22} color="#fff" />
            <Text style={styles.navText}>Cursos</Text>
          </View>
          <View style={styles.fabPlaceholder} />
          <View style={styles.navItem}>
            <Ionicons name="search" size={22} color="#fff" />
            <Text style={styles.navText}>Diccionario</Text>
          </View>
          <View style={styles.navItem}>
            <Ionicons name="person-circle-outline" size={22} color="#fff" />
            <Text style={styles.navText}>Perfil</Text>
          </View>
        </View> */}
        {/* Botón flotante central sobre la barra */}
        {/* <Pressable style={styles.fabButton}>
          <Ionicons name="add" size={32} color="#fff" />
        </Pressable> */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f3e8ff', // violeta claro
  },
  mainView: {
    flex: 1,
    backgroundColor: '#f3e8ff',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 60,
  },
  headerContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  panelTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#560bad',
    marginBottom: 4,
  },
  teacherName: {
    fontSize: 18,
    color: '#560bad',
    fontWeight: '500',
    marginBottom: 18,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F72585',
    borderRadius: 14,
    height: 60,
    marginBottom: 28,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    paddingHorizontal: 24,
  },
  ctaIcon: {
    marginRight: 10,
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 22,
    width: '100%',
    paddingHorizontal: 16,
  },
  quickActionCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingVertical: 20,
    marginHorizontal: 6,
  },
  quickActionText: {
    color: '#560bad',
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 6,
    textAlign: 'center',
  },
  // summaryCard y summaryText eliminados
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: '#560bad',
    paddingVertical: 12,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 10,
    zIndex: 1,
  },
  fabPlaceholder: {
    width: 80,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  navText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  fabButton: {
    position: 'absolute',
    left: '50%',
    bottom: 1,
    transform: [{ translateX: -32 }, { translateY: -32 }],
    backgroundColor: '#7209B7',
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 4,
    borderColor: '#f3e8ff',
    zIndex: 2,
  },
});
