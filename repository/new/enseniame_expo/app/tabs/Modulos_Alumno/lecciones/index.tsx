import React, { useCallback, useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, FlatList,  TouchableOpacity, ActivityIndicator, Modal, TextInput } from "react-native";
import { useLocalSearchParams, router, useFocusEffect } from "expo-router";
import { Senia_Info, Modulo } from "@/components/types";
import { buscar_modulo, buscar_senias_modulo } from "@/conexiones/modulos";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import VideoPlayer from "@/components/VideoPlayer";
import { paleta, paleta_colores } from "@/components/colores";
import { useUserContext } from "@/context/UserContext";
import { SmallPopupModal } from "@/components/modals";
import Toast from "react-native-toast-message";
import { alumno_ver_senia, senias_aprendidas_alumno, visualizaciones_alumno } from "@/conexiones/visualizaciones";
import { error_alert, success_alert } from "@/components/alert";
import Checkbox from "expo-checkbox";
import { marcar_aprendida, marcar_no_aprendida } from "@/conexiones/aprendidas";
import { calificacionesModulo, calificarModulo } from "@/conexiones/calificaciones";
import { RatingStars } from "@/components/review";
import { estilos } from "@/components/estilos";
import { get_antiguedad } from "@/components/validaciones";
import { AntDesign } from "@expo/vector-icons";

export default function Leccion (){
  const { id=0 } = useLocalSearchParams<{ id: string }>();
  if (id==0) router.back();
  const [modulo,setModulo] = useState<Modulo | undefined>();
  const [senias,setSenias] = useState<Senia_Info[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSenia, setSelectedSenia] = useState<Senia_Info | null>(null);
  const [currentIndex,setIndex]=useState(0)

  const contexto = useUserContext();

  useFocusEffect(
    useCallback(() => {
        fetch_modulo();
        fetch_senias();
        
        return () => {};
    }, [])
    );

    const fetch_modulo = async ()=>{
        try {
            setLoading(true)
            const m = await buscar_modulo(Number(id));
            setModulo(m || []);
          
        } catch (error) {
          error_alert("No se pudo cargar el módulo");
          console.error(error)
        } finally {
            setLoading(false)
        }
    } 

    const fetch_senias = async () => {
        try {
            setLoading(true);
            const s = await  buscar_senias_modulo(Number(id));
            setSenias(s || []);
            if (s && s.length>0)  setSelectedSenia(s[0])
        } catch (error) {
            error_alert("No se pudieron cargar las señas");
          console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const next =()=>{
        const i = senias.findIndex(each=>each.id==selectedSenia?.id);
        if (i!=-1 && i<senias.length-1) {
          setIndex(i+1);
          setSelectedSenia(senias[i+1]);
        }
        else {
            //terminar lección
            console.log("terminaste");
            success_alert("Terminaste el módulo!!")
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
            <View style={[styles.bck_content,estilos.centrado]}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {width: `${currentIndex/senias.length*100}%`}
                  ]}
                />
              </View>
                <View>
                    {selectedSenia && (
                        <VideoPlayer 
                        uri={selectedSenia.video_url}
                        style={styles.video}
                        />
                    )}
                </View>
                <View style={[styles.card,paleta_colores.dark_aqua,{width:"95%"}]}>
                    <ThemedText style={styles.title}>{modulo?.nombre}</ThemedText>
                    <ThemedText style={styles.cardSubtitle}>{modulo?.descripcion}hola</ThemedText>
                    <View style={styles.card}>
                        {selectedSenia ? 
                        <>
                        <View style={[{flexDirection:"row",alignItems:"stretch",justifyContent:"space-between",marginBottom:10},estilos.thinGrayBottomBorder]}>
                        <ThemedText style={styles.cardTitle}>{selectedSenia.significado}</ThemedText>
                        <ThemedText style={styles.cardTitle}>{selectedSenia.Categorias.nombre}</ThemedText>
                        </View>
                        <ThemedText>Acá va una descripcion de la seña o una aclaración en el contexto específico del módulo. 
                            Podríamos añadirlo a la tabla Senia_Modulo
                        </ThemedText>
                        <Pressable style={{marginVertical:10}} onPress={next}>
                            <ThemedText type="defaultSemiBold" lightColor={paleta.strong_yellow}>Siguiente</ThemedText>
                        </Pressable>
                        </>
                    :null
                    }
                    </View>
                    
                    
                </View>
            </View>
            <Toast/>
        </View>
    )
    
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e6f7f2",
    padding: 16,
  },
  bck_content:{
    width: "90%",
    backgroundColor: "#ffffffff",
    height: "90%"
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginTop:20,
    color: "white",
    
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    //marginBottom: 34,
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
    paddingHorizontal: 5,
  },
  
  video: {
    width: '95%',
    aspectRatio: 16/9,
    borderRadius: 12,
    marginBottom: 25
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
 progressTotal: { color: '#555', marginBottom: 8 },
  progressBar: { height: 12, backgroundColor: '#e53838ff', borderRadius: 8, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#20bfa9', borderRadius: 8 },
  progressPercent: { alignSelf: 'flex-end', color: '#20bfa9', fontWeight: 'bold', marginTop: 6 },
  
  cardSubtitle: {
    color: "white",
    fontSize: 15,
    marginBottom: 12,
  },
});
