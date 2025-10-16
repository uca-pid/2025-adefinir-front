import React, { useCallback, useState } from "react";
import { View, Text, Pressable, StyleSheet, FlatList,  TouchableOpacity, ActivityIndicator } from "react-native";
import { useLocalSearchParams, router, useFocusEffect } from "expo-router";
import { Senia,Senia_Info, Modulo } from "@/components/types";
import { buscar_modulo, buscar_senias_modulo } from "@/conexiones/modulos";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import VideoPlayer from "@/components/VideoPlayer";
import { paleta } from "@/components/colores";
import { useUserContext } from "@/context/UserContext";
import { SmallPopupModal } from "@/components/modals";
import Toast from "react-native-toast-message";
import Checkbox from 'expo-checkbox';
import { supabase } from "@/lib/supabase";

export default function ModuloDetalleScreen() {
  const { id=0 } = useLocalSearchParams<{ id: string }>();
  if (id==0) router.back();
  const [modulo,setModulo] = useState<Modulo | undefined>();
  const [senias,setSenias] = useState<Senia_Info[]>();

  const [loading, setLoading] = useState(true);
  const [selectedSenia, setSelectedSenia] = useState<Senia_Info | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  const contexto = useUserContext();
  const [aprendidasMap, setAprendidasMap] = useState<Record<number, boolean>>({});
  
   useFocusEffect(
      useCallback(() => {
        fetch_modulo();
        fetch_senias();
        fetch_aprendidas();
        return () => {};
      }, [])
    );
  const fetch_modulo = async ()=>{
    const m = await buscar_modulo(Number(id));
    setModulo(m || []);
  } 

  const fetch_senias = async ()=>{
    const s = await  buscar_senias_modulo(Number(id));
    setSenias(s || []);
    setLoading(false)
  }

  const fetch_aprendidas = async () => {
    try {
      if (!contexto.user?.id) return;
      const { data, error } = await supabase
        .from('Alumno_Senia')
        .select('senia_id, aprendida')
        .eq('user_id', contexto.user.id);
      if (error) throw error;
      const map: Record<number, boolean> = {};
      (data || []).forEach((row: any) => {
        map[Number(row.senia_id)] = !!row.aprendida;
      });
      setAprendidasMap(map);
    } catch (e) {
      // Si no existe la tabla o hay error, seguimos sin bloquear la vista
      console.warn('[modulo_detalle] No se pudo cargar Aprendidas:', (e as any)?.message);
    }
  }

  const toggleAprendida = async (seniaId: number, value: boolean) => {
    try {
      if (!contexto.user?.id) return;
      if (value) {
        const { error } = await supabase
          .from('Alumno_Senia')
          .upsert(
            [{ user_id: contexto.user.id, senia_id: seniaId, aprendida: true }],
            { onConflict: 'user_id,senia_id' }
          );
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('Alumno_Senia')
          .update({ aprendida: false })
          .eq('user_id', contexto.user.id)
          .eq('senia_id', seniaId);
        if (error) throw error;
      }
      setAprendidasMap((prev) => ({ ...prev, [seniaId]: value }));
      Toast.show({ type: 'success', text1: value ? 'Marcada como aprendida' : 'Marcada como no aprendida' });
    } catch (e) {
      console.error(e);
      Toast.show({ type: 'error', text1: 'No se pudo actualizar el estado' });
    }
  }
  
  if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#20bfa9" />
        </View>
      );
    }
  
  return (
    <View style={styles.container}>
      <Pressable
              style={[styles.backBtn, { marginBottom: 10, marginTop:30, flexDirection: 'row', alignItems: 'center' }]}
              onPress={() => {   contexto.user.gotToModules()   }}
            >
              <Ionicons name="arrow-back" size={20} color="#20bfa9" style={{ marginRight: 6 }} />
              <Text style={styles.backBtnText}>Volver</Text>
            </Pressable>
      <Text style={styles.title}> {modulo?.nombre}</Text>

      
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

        <SmallPopupModal title={selectedSenia?.significado} modalVisible={modalVisible} setVisible={setModalVisible}>
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

          {/* Toggle Aprendida */}
          {selectedSenia && (
            <View style={styles.row}>
              <Checkbox
                value={!!aprendidasMap[selectedSenia.id]}
                onValueChange={(v) => toggleAprendida(selectedSenia.id, v)}
                color={aprendidasMap[selectedSenia.id] ? '#20bfa9' : undefined}
                style={styles.checkbox}
              />
              <Text style={styles.checkboxLabel}>Aprendida</Text>
            </View>
          )}
        </SmallPopupModal>

        <Toast/>
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
    marginTop:60,
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
  
  video: {
    width: '100%',
    aspectRatio: 16/9,
    borderRadius: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: paleta.aqua_bck
  },
  checkbox: {
    margin: 8,
    borderRadius:10,
    borderColor: paleta.strong_yellow 
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 6
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#222'
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
  },
  backBtn: {
    padding: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  backBtnText: {
    color: '#20bfa9',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
