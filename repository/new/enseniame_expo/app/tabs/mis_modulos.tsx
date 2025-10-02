import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const initialModules = [
  { id: "1", nombre: "Señas de tránsito", icon: "car" as const, signs: [{ id: "1", nombre: "Pare" }] },
  { id: "2", nombre: "Animales", icon: "paw" as const, signs: [] },
];

export default function MisModulosScreen() {
  const [modules] = useState(initialModules);
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis módulos creados</Text>
      <FlatList
        data={modules}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Ionicons name={item.icon} size={32} color="#20bfa9" />
            <Text style={styles.cardTitle}>{item.nombre}</Text>
            <Text style={styles.cardSubtitle}>{item.signs.length} señas incluidas</Text>
            <View style={styles.cardActions}>
              {/* <Pressable
                style={styles.editBtn}
                onPress={() => router.push("/tabs/editar_modulo")} 
              >
                <Ionicons name="create-outline" size={18} color="#20bfa9" />
                <Text style={styles.editBtnText}>Editar módulo</Text>
              </Pressable> */}
              <Pressable
                style={styles.viewBtn}
                onPress={() => router.push("/tabs/detalle_modulo")} 
              >
                <Text style={styles.viewBtnText}>Ver señas</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
      <Pressable
        style={styles.fab}
        onPress={() => router.push("/tabs/crear_modulo")}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e6f7f2",
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#222",
    alignSelf: "center",
    marginBottom: 18,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#222",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardTitle: {
    color: "#222",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 8,
  },
  cardSubtitle: {
    color: "#555",
    fontSize: 15,
    marginBottom: 10,
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e6f7f2",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  editBtnText: {
    color: "#20bfa9",
    fontWeight: "bold",
    marginLeft: 4,
  },
  viewBtn: {
    backgroundColor: "#20bfa9",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  viewBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },
  fab: {
    position: "absolute",
    right: 24,
    bottom: 32,
    backgroundColor: "#20bfa9",
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#222",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 10,
  },
});
