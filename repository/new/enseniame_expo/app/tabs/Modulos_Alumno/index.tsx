import React, { useCallback, useState } from "react";
import { View, Text, Pressable, StyleSheet, FlatList, Modal, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import {  Modulo } from "@/components/types";
import { alumno_completo_modulo, mis_modulos_completos, modulos_completados_por_alumno, todos_los_modulos } from "@/conexiones/modulos";
import { calificacionesModulo } from "@/conexiones/calificaciones";
import Toast from "react-native-toast-message";
import { AntDesign } from "@expo/vector-icons";
import { modulosCalificados, promedio_reseñas } from "@/conexiones/calificaciones";
import { ThemedText } from "@/components/ThemedText";
import { useUserContext } from "@/context/UserContext";

interface ModuloCalificado extends Modulo {
  promedio: number;
  completado: boolean
}

export default function ModulosScreen() {
  const router = useRouter();

  const [modulos,setModulos] = useState<ModuloCalificado[]>();
  const [calificacionesPorModulo, setCalificacionesPorModulo] = useState<Record<number, any[]>>({});
  const [promediosPorModulo, setPromediosPorModulo] = useState<Record<number, number>>({});
  const [comentariosModalVisible, setComentariosModalVisible] = useState(false);
  const [comentariosSeleccionados, setComentariosSeleccionados] = useState<any[]>([]);

  const contexto = useUserContext();

  useFocusEffect(
      useCallback(() => {
        fetch_modulos();
        return () => {};
      }, [])
    );

  const fetch_modulos = async ()=>{
    const m2 = await modulosCalificados();
    const completados = await mis_modulos_completos(contexto.user.id);
    console.log(completados)
    
    //corregir para que te muestre los que completaste
    const res =m2?.map( e=>{        
      let prom = promedio_reseñas(e.Calificaciones_Modulos);
      let completo = completados.includes({"id_modulo":e.id});
      console.log(completo)
      return {id: e.id, descripcion: e.descripcion,icon:e.icon,nombre:e.nombre,promedio:prom, autor:e.autor, completado:completo}
    });
    setModulos(res || []);    
  }

      {/** const fetchCalificaciones = async (id_modulo: number) => {
    try {
      const calificaciones = await calificacionesModulo(id_modulo) || [];
      setCalificacionesPorModulo(prev => ({ ...prev, [id_modulo]: calificaciones }));
      // Calcula el promedio
      const puntajes = calificaciones.map(c => c.puntaje);
      const promedio = puntajes.length ? puntajes.reduce((a, b) => a + b, 0) / puntajes.length : 0;
      setPromediosPorModulo(prev => ({ ...prev, [id_modulo]: promedio }));
    } catch (e) {
      setPromediosPorModulo(prev => ({ ...prev, [id_modulo]: 0 }));
    }
  };**/}

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis módulos</Text>
      <FlatList
        data={modulos}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{paddingBottom:80}}

        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{flexDirection:"row",justifyContent:"space-between",alignContent:"center"}}>
              <Ionicons name={item.icon} size={36} color="#20bfa9" />
              {item.completado &&  (<ThemedText>🎉 ¡Completado!</ThemedText>)}
            </View>
            
            <Text style={styles.cardTitle}>{item.nombre}</Text>
            <Text style={styles.cardSubtitle}>  {item.descripcion}</Text>
        {/* <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
              { Promedio de estrellas }
              <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
                {[...Array(5)].map((_, i) => (
                  <AntDesign
                    key={i}
                    name={promediosPorModulo[item.id] > i ? "star" : "star"}
                    size={20}
                    color={promediosPorModulo[item.id] > i ? "#FFD700" : "#E0E0E0"}
                  />
                ))}
              </View>
              { Botón para ver comentarios }
              <Pressable
                style={{ padding: 8, backgroundColor: "#20bfa9", borderRadius: 8 }}
                onPress={async () => {
                  if (!calificacionesPorModulo[item.id]) {
                    await fetchCalificaciones(item.id);
                  }
                  setComentariosSeleccionados((calificacionesPorModulo[item.id] || []).filter(c => c.comentario));
                  setComentariosModalVisible(true);
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>Ver comentarios</Text>
              </Pressable> */}
            <View>
                            
              <ThemedText lightColor="gray">
                <ThemedText type="defaultSemiBold" lightColor="gray">Calificación: </ThemedText>
                {item.promedio==0 ? <ThemedText>-</ThemedText> : <ThemedText>{item.promedio.toFixed(2)} / 5</ThemedText> }
                
              </ThemedText>
                
            </View>
            <Pressable
              style={styles.button}
              onPress={() => router.push({ pathname: '/tabs/Modulos_Alumno/modulo_detalle', params: { id: item.id } })}
            >
              <Text style={styles.buttonText}>Ver módulo</Text>
            </Pressable>
          </View>
        )}
      />
      <Modal
        visible={comentariosModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setComentariosModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Comentarios del módulo</Text>
            <ScrollView style={{ maxHeight: 300 }}>
              {comentariosSeleccionados.length === 0 ? (
                <Text>No hay comentarios.</Text>
              ) : (
                comentariosSeleccionados.map((c, idx) => (
                  <View key={idx} style={{ marginBottom: 16 }}>
                    <Text style={{ fontWeight: "bold", color: "#20bfa9" }}>{c.Users?.username || "Alumno"}</Text>
                    <Text>{c.comentario}</Text>
                  </View>
                ))
              )}
            </ScrollView>
            <Pressable style={styles.button} onPress={() => setComentariosModalVisible(false)}>
              <Text style={styles.buttonText}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
    fontSize: 28,
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
    paddingHorizontal: 5,

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
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#222",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#222",
  },
});
