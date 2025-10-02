import React from "react";
import { View, Text, StyleSheet, FlatList, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

// Dummy data for module detail
const dummySigns = [
  { id: "1", nombre: "Pare", video_url: "https://www.example.com/video/pare.mp4", thumbnail: "https://img.youtube.com/vi/1/default.jpg" },
  { id: "2", nombre: "Ceda el paso", video_url: "https://www.example.com/video/ceda.mp4", thumbnail: "https://img.youtube.com/vi/2/default.jpg" },
];

export default function DetalleModuloScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Módulo: {id}</Text>
      <FlatList
        data={dummySigns}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{item.nombre}</Text>
                <Pressable
                  style={styles.viewBtn}
                  onPress={() =>
                    router.push(
                      `/tabs/senia?id=${encodeURIComponent(item.id)}&nombre=${encodeURIComponent(item.nombre)}&video_url=${encodeURIComponent(item.video_url)}`
                    )
                  }
                >
                  <Text style={styles.viewBtnText}>Ver seña</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
      />
  <Pressable style={styles.fab} onPress={() => router.push('/tabs/video_upload_form')}>
        <Ionicons name="add" size={32} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6f7f2',
    padding: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#222',
    alignSelf: 'center',
    marginBottom: 18,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#222',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 14,
    backgroundColor: '#e0e0e0',
  },
  cardTitle: {
    color: '#222',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  viewBtn: {
    backgroundColor: '#20bfa9',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  viewBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    backgroundColor: '#20bfa9',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#222',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 10,
  },
});
