import React, { useCallback, useState } from "react";
import { View, Text, Pressable, StyleSheet, FlatList, Modal, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter, router, useFocusEffect } from "expo-router";
import { Senia,Senia_Info, Modulo } from "@/components/types";
import { buscar_modulo, buscar_senias_modulo } from "@/conexiones/modulos";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import VideoPlayer from "@/components/VideoPlayer";
import { paleta } from "@/components/colores";

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

interface SeniaAux {
  Senias: Senia
}

export default function ModuloDetalleScreen() {
  const { id=0 } = useLocalSearchParams<{ id: string }>();
  if (id==0) router.back();
  const [modulo,setModulo] = useState<Modulo | undefined>();
  const [senias,setSenias] = useState<Senia_Info[]>();

  const [loading, setLoading] = useState(true);
  const [selectedSenia, setSelectedSenia] = useState<Senia_Info | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  
   useFocusEffect(
      useCallback(() => {
        fetch_modulo();
        fetch_senias();
        return () => {};
      }, [])
    );
  const fetch_modulo = async ()=>{
    const m = await buscar_modulo(Number(id));
    setModulo(m || []);
  } 

  const fetch_senias = async ()=>{
    const s = await  buscar_senias_modulo(Number(id));
    setSenias(s || [])
  }
  
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalle del módulo {id}</Text>
      <FlatList
        data={senias ? senias : []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.significado}</Text>
            <Pressable
              style={styles.button}
              onPress={() => {
                setSelectedSenia(item);
                setModalVisible(true);
              }}
            >
              <Text style={styles.buttonText}>Ver seña</Text>
            </Pressable>
          </View>
        )}
      />

      <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{selectedSenia?.significado}</Text>
                <Pressable 
                  onPress={() => setModalVisible(false)}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={24} color="#014f86" />
                </Pressable>
              </View>
              
              {selectedSenia && (
                <VideoPlayer 
                  uri={selectedSenia.video_url}
                  style={styles.video}
                />
              )}
              {selectedSenia && selectedSenia.Categorias ?
              <ThemedText style={{margin:10}}>
                <ThemedText type='defaultSemiBold'>Categoría:</ThemedText> {''}
                <ThemedText>{selectedSenia.Categorias.nombre}</ThemedText>
              </ThemedText>
                :null
              }
              
              {selectedSenia && selectedSenia.Users  ?
              <ThemedText style={{margin:10}}>
                <ThemedText type='defaultSemiBold'>Autor:</ThemedText> {''}
                <ThemedText>{selectedSenia.Users.username} </ThemedText> {''}
              </ThemedText>
                :null
              }

              
            </View>
          </View>
        </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: paleta.dark_aqua
  },
  closeButton: {
    padding: 8,
  },
  video: {
    width: '100%',
    aspectRatio: 16/9,
    borderRadius: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3e8ff',
  },
  checkbox: {
    margin: 8,
    borderRadius:10,
    borderColor: paleta.strong_yellow 
  },
   iconButton: {
    borderRadius: 10,
    height: 50,
    minWidth: "100%",
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: "row",
    width:"100%",
    backgroundColor: "white",
    position: "relative",
    marginTop: 25
  },
  icon:{
    flex:1,
    marginLeft: 25
  }
});
