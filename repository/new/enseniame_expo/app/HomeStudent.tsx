import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

export default function HomeStudent() {
  // Simulación de datos de usuario y progreso
  const [user] = useState({ nombre: 'Juan', racha: 5, nivel: 2, xp: 120, xpMax: 200 });

  return (
    <View style={styles.mainView}>
      <ScrollView contentContainerStyle={[styles.scrollViewContent]}>
        {/* Encabezado */}
        <View style={styles.headerContainer}>
          <Text style={styles.greeting}>Hola, {user.nombre} <Text style={{fontSize: 22}}>👋</Text></Text>
          <View style={styles.streakContainer}>
            <Ionicons name="flame" size={22} color="#ff9100" />
            <Text style={styles.streakText}>{user.racha} días de racha</Text>
          </View>
        </View>

        {/* Progreso */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Nivel {user.nivel} – {user.xp}/{user.xpMax} XP</Text>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, {width: `${(user.xp/user.xpMax)*100}%`}]} />
          </View>
        </View>

        {/* Acción principal */}
        <Pressable style={styles.ctaButton}>
          <Ionicons name="flash" size={24} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.ctaButtonText}>Practicar ahora 🎯</Text>
        </Pressable>

        {/* Atajos */}
        <View style={styles.shortcutsContainer}>
          <Pressable style={styles.shortcutButton}>
            <Ionicons name="book" size={22} color="#3b82f6" style={styles.shortcutIcon} />
            <Text style={styles.shortcutText}>Cursos</Text>
          </Pressable>
          <Pressable style={styles.shortcutButton}>
            <Ionicons name="search" size={22} color="#3b82f6" style={styles.shortcutIcon} />
            <Text style={styles.shortcutText}>Diccionario</Text>
          </Pressable>
        </View>
      </ScrollView>
      {/* Barra de navegación inferior */}
      <View style={styles.navBar}>
        <View style={styles.navItem}>
          <Ionicons name="home-outline" size={26} color="#fff" />
          <Text style={styles.navText}>Inicio</Text>
        </View>
        <View style={styles.navItem}>
          <Ionicons name="book" size={26} color="#fff" />
          <Text style={styles.navText}>Cursos</Text>
        </View>
        <View style={styles.navItem}>
          <Ionicons name="search" size={26} color="#fff" />
          <Text style={styles.navText}>Diccionario</Text>
        </View>
        <View style={styles.navItem}>
          <Ionicons name="person-circle-outline" size={26} color="#fff" />
          <Text style={styles.navText}>Perfil</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: '100%',
    height: '100%',
    backgroundColor: "#7209B7"
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    minWidth: "80%"
  },
  headerContainer: {
    width: '100%',
    marginBottom: 10,
    marginTop: 10,
    alignItems: 'flex-start',
    paddingHorizontal: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  streakText: {
    color: '#ff9100',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 16,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 18,
    paddingHorizontal: 10,
  },
  progressText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
    fontWeight: '500',
  },
  progressBarBg: {
    width: '100%',
    height: 16,
    backgroundColor: '#e0e7ef',
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 8,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F72585',
    borderRadius: 12,
    height: 60,
    justifyContent: 'center',
    marginVertical: 18,
    marginHorizontal: 10,
    paddingHorizontal: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonIcon: {
    marginRight: 10,
  },
  shortcutsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
    marginBottom: 20,
  },
  shortcutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
    marginHorizontal: 5,
  },
  shortcutIcon: {
    marginRight: 8,
  },
  shortcutText: {
    color: '#3b82f6',
    fontWeight: 'bold',
    fontSize: 16,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#560bad',
    paddingVertical: 8,
    paddingBottom: 16,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 2,
  },
});
