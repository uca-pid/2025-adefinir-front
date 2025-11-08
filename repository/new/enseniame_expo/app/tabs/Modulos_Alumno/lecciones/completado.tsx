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
import { BotonLogin } from "@/components/botones";

export default function ModuloCompletado (){
     const { id=0 } = useLocalSearchParams<{ id: string }>();
      if (id==0) router.back();
      const [modulo,setModulo] = useState<Modulo | undefined>();
      const [loading, setLoading] = useState(true);

      const [puntaje, setPuntaje] = useState(0);
      const [comentario, setComentario] = useState("");
      const [showCalificacionModal, setShowCalificacionModal] = useState(false);
      const [yaCalificado, setYaCalificado] = useState(false);

      const contexto = useUserContext();

      useFocusEffect(
          useCallback(() => {
              fetch_modulo();                            
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

    const enviarCalificacion = async () => {
        try {
          await calificarModulo(Number(id), contexto.user.id, puntaje, comentario);
          setShowCalificacionModal(false);
          setYaCalificado(true);
          success_alert("¡Gracias por tu calificación!");
        } catch (e) {
          error_alert("No se pudo guardar la calificación");
        }
      };

    if (loading) {
        return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#20bfa9" />
        </View>
        );
    }

      return (
        <View style={styles.container}>
            <Text style={styles.title}> ¡¡Felicidades!!</Text>
            <Text style={[styles.cardTitle,estilos.centrado]}>Completaste el módulo {modulo?.nombre}</Text>

            {!yaCalificado && (
                <>
<ThemedText type="defaultSemiBold" lightColor="gray" style={estilos.centrado}>¿Deseas dejar una calificación?</ThemedText>
            <BotonLogin callback={()=>setShowCalificacionModal(true)} textColor={"white"} bckColor={paleta.strong_yellow} text={"Calificar"} /></>
            )}
            
            <BotonLogin callback={()=>{router.back();contexto.user.goHome()}} textColor={"white"} bckColor={paleta.aqua} text={"Aceptar"} />

            {/* Modal para calificación */}
                    <Modal
                      visible={showCalificacionModal}
                      animationType="slide"
                      transparent={true}
                    >
                      <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                          <Text style={styles.modalTitle}>Califica este módulo</Text>
                          {/* Estrellas para puntaje */}
                          <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 15 }}>
                            {[...Array(5)].map((_, i) => (
                              <TouchableOpacity key={i} onPress={() => setPuntaje(i + 1)}>
                                <AntDesign
                                  name={puntaje > i ? "star" : "star"}
                                  size={32}
                                  color={puntaje > i ? "#FFD700" : "#E0E0E0"}
                                  style={{ marginHorizontal: 2 }}
                                />
                              </TouchableOpacity>
                            ))}
                          </View>
                          <Text style={{textAlign:'center', marginBottom:10}}>Puntaje: {puntaje} estrellas</Text>
                          <TextInput
                            style={[styles.input, { height: 60 }]}
                            placeholder="Comentario (opcional)"
                            value={comentario}
                            onChangeText={setComentario}
            
                          />
                    <View style={styles.modalButtons}>
                    <Pressable style={styles.button} onPress={enviarCalificacion} disabled={puntaje === 0}>
                        <Text style={styles.buttonText}>Enviar calificación</Text>
                    </Pressable>
                    <Pressable style={styles.button} onPress={() => setShowCalificacionModal(false)}>
                        <Text style={styles.buttonText}>Cerrar</Text>
                    </Pressable>
                    </View>
                </View>
                </View>
            </Modal>
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
    paddingHorizontal: 5,
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  
});
