import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeTeacher() {
  // Simulación de nombre docente
  const teacherName = 'Prof. Martínez';
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
          <Pressable style={styles.quickActionCard}>
            <Ionicons name="videocam-outline" size={26} color="#560bad" />
            <Text style={styles.quickActionText}>Subir video de seña</Text>
          </Pressable>
          <Pressable style={styles.quickActionCard}>
            <Ionicons name="school-outline" size={26} color="#560bad" />
            <Text style={styles.quickActionText}>Ver progreso de estudiantes</Text>
          </Pressable>
        </View>
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
});
