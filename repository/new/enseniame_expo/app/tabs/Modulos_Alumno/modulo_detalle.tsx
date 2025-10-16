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
import { alumno_ver_senia, senias_aprendidas_alumno, visualizaciones_alumno } from "@/conexiones/visualizaciones";
import { error_alert, success_alert } from "@/components/alert";
import Checkbox from "expo-checkbox";
import { marcar_aprendida, marcar_no_aprendida } from "@/conexiones/aprendidas";

type Senia_Aprendida ={
  senia: Senia_Info;
  vista: boolean;
  aprendida: boolean
}

export default function ModuloDetalleScreen() {
  const { id=0 } = useLocalSearchParams<{ id: string }>();
  if (id==0) router.back();
  const [modulo,setModulo] = useState<Modulo | undefined>();
  const [senias,setSenias] = useState<Senia_Aprendida[]>();
  const [aprendidasMap, setAprendidasMap] = useState<Record<number, boolean>>({});

  const [loading, setLoading] = useState(true);
  const [selectedSenia, setSelectedSenia] = useState<Senia_Aprendida | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  const contexto = useUserContext();
  
   useFocusEffect(
      useCallback(() => {
        fetch_modulo();
        fetch_senias();
        fetch_aprendidas();
        return () => {};
      }, [])
    );
  const fetch_modulo = async ()=>{
    try {
      const m = await buscar_modulo(Number(id));
      setModulo(m || []);
    } catch (error) {
      error_alert("No se pudo cargar el módulo");
      console.error(error)
    }
  } 

  const fetch_senias = async ()=>{
    try {
      const s = await  buscar_senias_modulo(Number(id));
      const vistas = await visualizaciones_alumno(contexto.user.id);
      const aprendidas = await senias_aprendidas_alumno(contexto.user.id);

      const fue_vista = (senia_id:number)=>{
        let res = false;
        vistas?.forEach(each=>{
          if (each.senia==senia_id) res= true
        });
        return res
      }

      const fue_aprendida =(senia_id:number)=>{
        let res = false;
        aprendidas?.forEach(each=>{
          if (each.senia_id==senia_id && each.aprendida) res= true
        });
        return res
      }

      const senias_vistas = s?.map(each=>{
        let vista = fue_vista(each.id);
        return {senia:each, vista:vista}
      });

      const senias_vistas_aprendidas =senias_vistas?.map(each=>{
        let aprendida = fue_aprendida(each.senia.id);
        return {senia:each.senia, vista:each.vista,aprendida:aprendida}
      });

      setSenias(senias_vistas_aprendidas || []);

    } catch (error) {
      error_alert("No se pudo cargar tu progreso");
      console.error(error)
    }
    
  }
  const fetch_aprendidas = async () => {
    try {
      if (!contexto.user?.id) return;
      const data = await senias_aprendidas_alumno(contexto.user.id)
      const map: Record<number, boolean> = {};
      (data || []).forEach((row: any) => {
        map[Number(row.senia_id)] = !!row.aprendida;
      });
      setAprendidasMap(map);
      setLoading(false);
    } catch (e) {
      // Si no existe la tabla o hay error, seguimos sin bloquear la vista
      console.warn('[modulo_detalle] No se pudo cargar Aprendidas:', (e as any)?.message);
    }
  }


  const toggle_visualizada = async (item: Senia_Aprendida)=>{
    setSelectedSenia(item);
    setModalVisible(true);
    //sumar visualización de la seña
    if (!item.vista){
      alumno_ver_senia(contexto.user.id,item.senia.id)
        .catch(reason=>{
          error_alert("No se pudo guardar tu progreso");
          console.error(reason);
        })
        .then(()=>{
          item.vista= true
        })
        
    }
  }

  const toggleAprendida = async (info_senia: Senia_Aprendida, value: boolean) => {
  
    if (value) {
      marcar_aprendida(info_senia.senia.id,contexto.user.id)
        .catch(reason =>{
          console.error(reason);
          error_alert("No se pudo actualizar el estado")
        })
    } else {
      marcar_no_aprendida(info_senia.senia.id,contexto.user.id)
        .catch(reason=>{
          console.error(reason);
          error_alert("No se pudo actualizar el estado")
        })
    }
    setAprendidasMap((prev) => ({ ...prev, [info_senia.senia.id]: value }));
    success_alert(value ? 'Marcada como aprendida' : 'Marcada como no aprendida')
    info_senia.aprendida= value;
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
        keyExtractor={(item) => item.senia.id.toString()}
        ListFooterComponent={<View style={{marginVertical:28}}></View>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{flexDirection:"row", alignContent: "space-around", justifyContent:"space-between"}}>
              <Text style={styles.cardTitle}>{item.senia.significado}</Text>
              {item.aprendida  && <Ionicons name="checkmark-circle" color={paleta.strong_yellow} size={25}  />}
            </View>
           
            <Pressable
              style={[styles.button]}
              onPress={() => { toggle_visualizada(item)}}
            >
              <Text style={styles.buttonText}>Ver seña</Text>
            </Pressable>
            
          </View>
        )}
      />

        <SmallPopupModal title={selectedSenia?.senia.significado} modalVisible={modalVisible} setVisible={setModalVisible}>
          {selectedSenia && (
            <VideoPlayer 
              uri={selectedSenia.senia.video_url}
              style={styles.video}
            />
          )}
          {selectedSenia && selectedSenia.senia.Categorias ?
          <ThemedText style={{margin:10}}>
            <ThemedText type='defaultSemiBold'>Categoría:</ThemedText> {''}
            <ThemedText>{selectedSenia.senia.Categorias.nombre}</ThemedText>
          </ThemedText>
            :null
          }
          
          {selectedSenia && selectedSenia.senia.Users  ?
          <ThemedText style={{margin:10}}>
            <ThemedText type='defaultSemiBold'>Autor:</ThemedText> {''}
            <ThemedText>{selectedSenia.senia.Users.username} </ThemedText> {''}
          </ThemedText>
            :null
          }

          {/* Toggle Aprendida */}
          {selectedSenia && (
            <View style={styles.row}>
              <Checkbox
                value={!!aprendidasMap[selectedSenia.senia.id]}
                onValueChange={(v) => toggleAprendida(selectedSenia, v)}
                color={aprendidasMap[selectedSenia.senia.id] ? '#20bfa9' : undefined}
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
    marginBottom: 30,
    marginTop:20,
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
