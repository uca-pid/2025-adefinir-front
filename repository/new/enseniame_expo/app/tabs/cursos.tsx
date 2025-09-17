import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Cursos() {
  type IoniconName = 
    | "school-outline"
    | "chatbubble-ellipses-outline"
    | "briefcase-outline"
    | "people-outline";

  const cursos: {
    nombre: string;
    icon: IoniconName;
    dificultad: string;
    dificultadColor: string;
    progreso: number;
  }[] = [
    {
      nombre: 'LSA Básico',
      icon: 'school-outline',
      dificultad: 'Fácil',
      dificultadColor: '#43aa8b',
      progreso: 0.7,
    },
    {
      nombre: 'Conversación Cotidiana',
      icon: 'chatbubble-ellipses-outline',
      dificultad: 'Intermedio',
      dificultadColor: '#f9c846',
      progreso: 0.35,
    },
    {
      nombre: 'LSA para Profesionales',
      icon: 'briefcase-outline',
      dificultad: 'Difícil',
      dificultadColor: '#f3722c',
      progreso: 0.12,
    },
    {
      nombre: 'Cultura Sorda y Comunidad',
      icon: 'people-outline',
      dificultad: 'Experto',
      dificultadColor: '#b5179e',
      progreso: 0.0,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cursos</Text>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {cursos.map((curso, idx) => (
          <View key={idx} style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name={curso.icon} size={32} color="#560bad" style={styles.cardIcon} />
              <View style={{flex:1}}>
                <Text style={styles.cardTitle}>{curso.nombre}</Text>
                <View style={styles.difficultyRow}>
                  <Ionicons name="ellipse" size={12} color={curso.dificultadColor} style={{marginRight:4}} />
                  <Text style={[styles.difficultyText, {color: curso.dificultadColor}]}>{curso.dificultad}</Text>
                </View>
              </View>
            </View>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, {width: `${curso.progreso*100}%`}]} />
            </View>
            <Text style={styles.progressText}>{Math.round(curso.progreso*100)}% completado</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3e8ff', // violeta claro
    paddingTop: 40,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#560bad', // violeta oscuro
    marginBottom: 18,
    alignSelf: 'center',
    fontFamily: 'System',
  },
  scrollContent: {
    paddingBottom: 30,
    alignItems: 'center',
  },
  card: {
    width: '98%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#560bad',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    alignItems: 'flex-start',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardIcon: {
    marginRight: 14,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#560bad',
    marginBottom: 2,
    fontFamily: 'System',
  },
  difficultyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  difficultyText: {
    fontSize: 13,
    fontWeight: '600',
    opacity: 0.85,
  },
  progressBarBg: {
    width: '100%',
    height: 10,
    backgroundColor: '#e5defa',
    borderRadius: 5,
    marginTop: 8,
    marginBottom: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#F72585',
    borderRadius: 5,
  },
  progressText: {
    fontSize: 12,
    color: '#560bad',
    fontWeight: '500',
    marginTop: 2,
    opacity: 0.7,
  },
});