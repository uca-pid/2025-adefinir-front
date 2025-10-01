import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function SeniaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Seña {id}</Text>
      <Text style={styles.description}>
        Aquí se mostraría el video o imagen de la seña seleccionada.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e6f7f2",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#20bfa9",
    marginBottom: 14,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
  },
});
