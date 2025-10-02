import React from "react";
import { View, Text, Pressable, StyleSheet, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Senia,Senia_Info } from "@/components/types";

type Sign = { id: string; nombre: string; video_url: string };
type Module = {
  id: string;
  nombre: string;
  icon: keyof typeof Ionicons.glyphMap;
  signs: Sign[];
};

const modules: Module[] = [
  {
    id: "1",
    nombre: "Señas de tránsito",
    icon: "car",
    signs: [
      { id: "1", nombre: "Pare", video_url: "https://www.example.com/video/pare.mp4" },
      { id: "2", nombre: "Ceda el paso", video_url: "https://www.example.com/video/ceda.mp4" },
      { id: "3", nombre: "Velocidad máxima", video_url: "https://www.example.com/video/velocidad.mp4" },
    ],
  },
  {
    id: "2",
    nombre: "Señas básicas",
    icon: "hand-left",
    signs: [
      { id: "4", nombre: "Hola", video_url: "https://www.example.com/video/hola.mp4" },
      { id: "5", nombre: "Gracias", video_url: "https://www.example.com/video/gracias.mp4" },
    ],
  },
  {
    id: "3",
    nombre: "Animales",
    icon: "paw",
    signs: [
      { id: "6", nombre: "Perro", video_url: "https://www.example.com/video/perro.mp4" },
      { id: "7", nombre: "Gato", video_url: "https://www.example.com/video/gato.mp4" },
    ],
  },
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
            <Ionicons name={item.icon} size={36} color="#20bfa9" />
            <Text style={styles.cardTitle}>{item.nombre}</Text>
            <Text style={styles.cardSubtitle}>
              {item.signs.length} señas incluidas
            </Text>
            <Pressable
              style={styles.button}
              onPress={() => router.push({ pathname: '/tabs/modulo_detalle', params: { id: item.id } })}
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
    backgroundColor: "#e6f7f2",
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#222",
    alignSelf: "center",
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
    marginTop: 12,
  },
  cardSubtitle: {
    color: "#555",
    fontSize: 15,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#20bfa9",
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
});
