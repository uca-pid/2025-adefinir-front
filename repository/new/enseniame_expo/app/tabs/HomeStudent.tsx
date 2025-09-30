import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useUserContext } from '@/context/UserContext';

export default function HomeStudent() {
  const contexto = useUserContext();
  const [user, setUser] = useState({ nombre: contexto.user.username, racha: 5, nivel: 2, xp: 120, xpMax: 200 });
  return (
    <View style={styles.container}>
  {/* Barra de diseño eliminada para unificar estilo */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Hola, {contexto.user.username} 👋</Text>
        <View style={styles.rowCards}>
          <View style={[styles.card, styles.cardLeft]}> 
            <Ionicons name="flame" size={28} color="#20bfa9" style={{marginBottom: 8}} />
            <Text style={styles.cardTitleCursos}>{user.racha} días de racha</Text>
          </View>
          <View style={[styles.card, styles.cardRight]}> 
            <Text style={styles.cardTitleCursos}>Nivel {user.nivel}</Text>
            <Text style={styles.cardTextCursos}>{user.xp}/{user.xpMax} XP</Text>
            <View style={styles.progressBarBgCursos}>
              <View style={[styles.progressBarFillCursos, { width: `${(user.xp / user.xpMax) * 100}%` }]} />
            </View>
          </View>
        </View>
        <Pressable style={styles.ctaButtonCursos}>
          <Ionicons name="flash" size={24} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.ctaButtonTextCursos}>Practicar ahora</Text>
        </Pressable>
        <View style={styles.shortcutsRow}>
          <Pressable style={styles.shortcutCardCursos} onPress={() => router.push('/tabs/cursos')}>
            <Ionicons name="book" size={22} color="#20bfa9" />
            <Text style={styles.shortcutTextCursos}>Cursos</Text>
          </Pressable>
          <Pressable style={styles.shortcutCardCursos} onPress={() => router.push('/tabs/Diccionario')}>
            <Ionicons name="search" size={22} color="#20bfa9" />
            <Text style={styles.shortcutTextCursos}>Diccionario</Text>
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
  // topBlock eliminado
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
    marginBottom: 18,
    alignSelf: 'center',
    zIndex: 2,
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 32,
    padding: 24,
    marginBottom: 18,
    width: '92%',
    alignItems: 'flex-start',
    shadowColor: '#222',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
  },
  cardLeft: {
    marginRight: 8,
  },
  cardRight: {
    marginLeft: 8,
  },
  cardTitleCursos: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
    fontFamily: 'System',
    letterSpacing: 0.2,
  },
  cardTextCursos: {
    fontSize: 15,
    color: '#222',
    opacity: 0.8,
    marginBottom: 6,
    fontFamily: 'System',
  },
  progressBarBgCursos: {
    width: '100%',
    height: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginTop: 12,
    marginBottom: 4,
    overflow: 'hidden',
  },
  progressBarFillCursos: {
    height: '100%',
    borderRadius: 8,
    backgroundColor: '#20bfa9',
  },
  ctaButtonCursos: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#20bfa9',
    borderRadius: 14,
    height: 50,
    marginBottom: 18,
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
  shortcutCardCursos: {
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
  shortcutTextCursos: {
    color: '#20bfa9',
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 6,
    fontFamily: 'System',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#20bfa9',
    marginBottom: 4,
  },
  cardText: {
    fontSize: 15,
    color: '#222',
    opacity: 0.8,
    marginBottom: 6,
  },
  progressBarBg: {
    width: '100%',
    height: 8,
    backgroundColor: '#e6f7f2',
    borderRadius: 4,
    marginTop: 8,
    marginBottom: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#ffb703',
    borderRadius: 4,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#20bfa9',
    borderRadius: 14,
    height: 50,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonIcon: {
    marginRight: 8,
  },
  rowCards: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 10,
  },
  shortcutsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  shortcutCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#20bfa9',
    borderRadius: 12,
    paddingVertical: 18,
    marginHorizontal: 6,
    borderWidth: 2,
    borderColor: '#17897a',
    shadowColor: '#20bfa9',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  shortcutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 6,
    textShadowColor: '#17897a',
    textShadowOffset: {width:0, height:1},
    textShadowRadius: 2,
  },
});