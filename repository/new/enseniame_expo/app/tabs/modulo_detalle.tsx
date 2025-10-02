import React from "react";
import { View, Text, Pressable, StyleSheet, FlatList } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

type Sign = { id: string; nombre: string; video_url: string };
const modules = [
  {
    id: "1",
    signs: [
      { id: "1", nombre: "Pare", video_url: "https://www.example.com/video/pare.mp4" },
      { id: "2", nombre: "Ceda el paso", video_url: "https://www.example.com/video/ceda.mp4" },
      { id: "3", nombre: "Velocidad máxima", video_url: "https://www.example.com/video/velocidad.mp4" },
    ],
  },
  {
    id: "2",
    signs: [
      { id: "4", nombre: "Hola", video_url: "https://www.example.com/video/hola.mp4" },
      { id: "5", nombre: "Gracias", video_url: "https://www.example.com/video/gracias.mp4" },
    ],
  },
  {
    id: "3",
    signs: [
      { id: "6", nombre: "Perro", video_url: "https://www.example.com/video/perro.mp4" },
      { id: "7", nombre: "Gato", video_url: "https://www.example.com/video/gato.mp4" },
    ],
  },
];

export default function ModuloDetalleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const module = modules.find((m) => m.id === id);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalle del módulo {id}</Text>
      <FlatList
        data={module ? module.signs : []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.nombre}</Text>
            <Pressable
              style={styles.button}
              onPress={() => router.push({ pathname: '/tabs/senia', params: { id: item.id, nombre: item.nombre, video_url: item.video_url } })}
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
    backgroundColor: "#e6f7f2",
    padding: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#222",
    alignSelf: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 14,
    shadowColor: "#222",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardTitle: {
    color: "#222",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#20bfa9",
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
});
