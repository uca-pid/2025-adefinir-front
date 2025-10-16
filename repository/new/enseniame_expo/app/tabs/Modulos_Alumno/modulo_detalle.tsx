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
import { alumno_ver_senia, visualizaciones_alumno } from "@/conexiones/visualizaciones";
import { error_alert } from "@/components/alert";

type Senia_Vistas ={
  senia: Senia_Info;
  vista: boolean
}

export default function ModuloDetalleScreen() {
  const { id=0 } = useLocalSearchParams<{ id: string }>();
  if (id==0) router.back();
  const [modulo,setModulo] = useState<Modulo | undefined>();
  const [senias,setSenias] = useState<Senia_Vistas[]>();

  const [loading, setLoading] = useState(true);
  const [selectedSenia, setSelectedSenia] = useState<Senia_Info | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  const contexto = useUserContext();
  
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
    const vistas = await visualizaciones_alumno(contexto.user.id);

    const fue_vista = (senia_id:number)=>{
      let res = false;
      vistas?.forEach(each=>{
        if (each.senia==senia_id) res= true
      });
      return res
    }

    const senias_vistas = s?.map(each=>{
      let vista = fue_vista(each.id);
      return {senia:each, vista:vista}
    })
    setSenias(senias_vistas || []);
    setLoading(false);
  }


  const ver_senia = async (item: Senia_Vistas)=>{
    setSelectedSenia(item.senia);
    setModalVisible(true);
    //sumar visualización de la seña
    if (!item.vista){
      alumno_ver_senia(contexto.user.id,item.senia.id)
        .catch(reason=>{
          error_alert("No se pudo guardar tu progreso");
          console.error(reason);
        })
        .then(()=>{
          item.vista=true
        })
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
        keyExtractor={(item) => item.senia.id.toString()}
        ListFooterComponent={<View style={{marginVertical:28}}></View>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{flexDirection:"row", alignContent: "space-around", justifyContent:"space-between"}}>
              <Text style={styles.cardTitle}>{item.senia.significado}</Text>
              {item.vista  && <Ionicons name="checkmark-circle" color={paleta.strong_yellow} size={25}  />}
            </View>
           
            <Pressable
              style={[styles.button]}
              onPress={() => { ver_senia(item)}}
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
