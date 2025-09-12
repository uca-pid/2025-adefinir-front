import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function Cursos() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cursos</Text>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Aquí irán las tarjetas de cursos en la próxima entrega */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3e8ff', // violeta claro
    paddingTop: 40,
    paddingHorizontal: 18,
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
  },
});