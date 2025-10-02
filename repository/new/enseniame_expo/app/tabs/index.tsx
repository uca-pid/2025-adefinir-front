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
import { useEffect, useState } from "react";

export default function Inicio() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido</Text>
      <View style={styles.cardsRow}>
        <View style={styles.cardStudent}>
          <Text style={styles.cardTitleStudent}>Alumno</Text>
          <Text style={styles.cardTextStudent}>Accede a cursos, práctica y tu progreso.</Text>
        </View>
        <View style={styles.cardTeacher}>
          <Text style={styles.cardTitleTeacher}>Profesor</Text>
          <Text style={styles.cardTextTeacher}>Crea contenido y gestiona estudiantes.</Text>
        </View>
      </View>
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

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 48,
    marginBottom: 28,
    alignSelf: 'center',
    zIndex: 2,
    letterSpacing: 0.5,
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginTop: 20,
    zIndex: 2,
  },
  cardStudent: {
    backgroundColor: '#20bfa9',
    borderRadius: 32,
    padding: 28,
    marginHorizontal: 10,
    width: 150,
    alignItems: 'center',
    shadowColor: '#20bfa9',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    borderWidth: 2,
    borderColor: '#17897a',
  },
  cardTitleStudent: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    letterSpacing: 0.2,
    textShadowColor: '#17897a',
    textShadowOffset: {width:0, height:1},
    textShadowRadius: 2,
  },
  cardTextStudent: {
    fontSize: 15,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.95,
    textShadowColor: '#17897a',
    textShadowOffset: {width:0, height:1},
    textShadowRadius: 1,
  },
  cardTeacher: {
    backgroundColor: '#ffd600',
    borderRadius: 32,
    padding: 28,
    marginHorizontal: 10,
    width: 150,
    alignItems: 'center',
    shadowColor: '#ffd600',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    borderWidth: 2,
    borderColor: '#bfa900',
  },
  cardTitleTeacher: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
    letterSpacing: 0.2,
    textShadowColor: '#fffbe6',
    textShadowOffset: {width:0, height:1},
    textShadowRadius: 1,
  },
  cardTextTeacher: {
    fontSize: 15,
    color: '#222',
    textAlign: 'center',
    opacity: 0.95,
    textShadowColor: '#fffbe6',
    textShadowOffset: {width:0, height:1},
    textShadowRadius: 1,
  },
});
