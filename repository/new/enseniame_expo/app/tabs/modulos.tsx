import React from "react";
import { View, Text, Pressable, StyleSheet, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type Module = {
  id: string;
  nombre: string;
  icon: keyof typeof Ionicons.glyphMap;
  cantidad: number;
};

const modules: Module[] = [
  { id: "1", nombre: "Señas de tránsito", icon: "car", cantidad: 10 },
  { id: "2", nombre: "Señas básicas", icon: "hand-left", cantidad: 15 },
  { id: "3", nombre: "Animales", icon: "paw", cantidad: 8 },
];

export default function ModulosScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis módulos</Text>
      <FlatList
        data={modules}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Ionicons name={item.icon} size={32} color="#fff" />
            <Text style={styles.cardTitle}>{item.nombre}</Text>
            <Text style={styles.cardSubtitle}>
              {item.cantidad} señas incluidas
            </Text>
            <Pressable
              style={styles.button}
              onPress={() =>
                router.push("./modulo_detalle")
              }
            >
              <Text style={styles.buttonText}>Ver módulo</Text>
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
    backgroundColor: "#7209b7",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  cardTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
  },
  cardSubtitle: {
    color: "#e0e0e0",
    fontSize: 14,
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
