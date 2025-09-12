import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function HomeTeacher() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Panel del Profesor 👩‍🏫</Text>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>➕ Crear contenido</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>📊 Supervisar estudiantes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#f5f9ff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e3a8a",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#10b981",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
});
