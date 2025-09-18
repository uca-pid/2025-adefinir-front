import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, SafeAreaView, Dimensions } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useUserContext } from '@/context/UserContext';

export default function HomeStudent() {
  const contexto = useUserContext();

  const [user,setUser] = useState({ nombre: contexto.user.username, racha: 5, nivel: 2, xp: 120, xpMax: 200 });



  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.mainView}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Saludo */}
          <View style={styles.headerContainer}>
            <Text style={styles.greeting}>Hola, {contexto.user.username} 👋</Text>
          </View>

          {/* Racha */}
          <View style={styles.streakHighlight}>
            <Ionicons name="flame" size={22} color="#F72585" />
            <Text style={styles.streakHighlightText}>{user.racha} días de racha</Text>
          </View>

          {/* Progreso */}
          <View style={styles.progressMiniCard}>
            <Text style={styles.progressMiniText}>
              Nivel {user.nivel} – {user.xp}/{user.xpMax} XP
            </Text>
            <View style={styles.progressMiniBarBg}>
              <View style={[styles.progressMiniBarFill, { width: `${(user.xp / user.xpMax) * 100}%` }]} />
            </View>
          </View>

          {/* Botón central */}
          <Pressable style={styles.ctaButton}>
            <Ionicons name="flash" size={26} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.ctaButtonText}>Practicar ahora</Text>
          </Pressable>

          {/* Atajos */}
          <View style={styles.shortcutsRow}>
            <Pressable style={styles.shortcutCard} onPress={() => router.push('/tabs/cursos')}>
              <Ionicons name="book" size={26} color="#560bad" />
              <Text style={styles.shortcutText}>Cursos</Text>
            </Pressable>
            <Pressable style={styles.shortcutCard} onPress={() => router.push('/tabs/Diccionario')}>
              <Ionicons name="search" size={26} color="#560bad" />
              <Text style={styles.shortcutText}>Diccionario</Text>
            </Pressable>
          </View>
        </ScrollView>

        {/* NavBar Fija en la parte inferior */}
        {/* <View style={styles.navBar}>
          <View style={styles.navItem}>
            <Ionicons name="home" size={22} color="#fff" />
            <Text style={styles.navText}>Inicio</Text>
          </View>
          <View style={styles.navItem}>
            <Ionicons name="book" size={22} color="#fff" />
            <Text style={styles.navText}>Cursos</Text>
          </View>
          <View style={styles.navItem}>
            <Ionicons name="search" size={22} color="#fff" />
            <Text style={styles.navText}>Diccionario</Text>
          </View>
          <View style={styles.navItem}>
            <Ionicons name="person-circle-outline" size={22} color="#fff" />
            <Text style={styles.navText}>Perfil</Text>
          </View>
        </View> */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mainView: {
    flex: 1,
    position: 'relative',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 100, // Espacio para la barra de navegación
  },
  headerContainer: {
    marginBottom: 10,
  },
  greeting: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#560bad",
  },
  streakHighlight: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#f3e8ff",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 20,
  },
  streakHighlightText: {
    marginLeft: 8,
    color: "#560bad",
    fontWeight: "600",
    fontSize: 14,
  },
  progressMiniCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 12,
    marginBottom: 25,
  },
  progressMiniText: {
    fontSize: 14,
    color: "#560bad",
    fontWeight: "bold",
    marginBottom: 6,
  },
  progressMiniBarBg: {
    width: "100%",
    height: 8,
    backgroundColor: "#e5defa",
    borderRadius: 4,
  },
  progressMiniBarFill: {
    height: "100%",
    backgroundColor: "#F72585",
    borderRadius: 4,
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#560bad",
    borderRadius: 14,
    height: 60,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  ctaButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonIcon: {
    marginRight: 10,
  },
  shortcutsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  shortcutCard: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    paddingVertical: 20,
    marginHorizontal: 6,
  },
  shortcutText: {
    color: "#560bad",
    fontWeight: "bold",
    fontSize: 14,
    marginTop: 6,
  },
  // Barra de navegación mejorada
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70, // Ancho mínimo para cada elemento
  },
  navText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
});