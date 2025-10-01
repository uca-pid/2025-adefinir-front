import React from "react";
import { View, Text, Pressable, StyleSheet, FlatList } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

type Sign = {
  id: string;
  nombre: string;
};

const signs: Sign[] = [
  { id: "1", nombre: "Pare" },
  { id: "2", nombre: "Ceda el paso" },
  { id: "3", nombre: "Velocidad máxima" },
];

export default function ModuloDetalleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalle del módulo {id}</Text>
      <FlatList
        data={signs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.nombre}</Text>
            <Pressable
              style={styles.button}
              onPress={() =>
                router.push("../senia")
              }
            >
              <Text style={styles.buttonText}>Ver seña</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f3ff",
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#3a0ca3",
  },
  card: {
    backgroundColor: "#560bad",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#f72585",
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
