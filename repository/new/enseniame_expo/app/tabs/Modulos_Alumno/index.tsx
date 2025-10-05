import React, { useCallback, useState } from "react";
import { View, Text, Pressable, StyleSheet, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { Senia,Senia_Info, Modulo } from "@/components/types";
import { todos_los_modulos } from "@/conexiones/modulos";


export default function ModulosScreen() {
  const router = useRouter();

  const [modulos,setModulos] = useState<Modulo[]>();

  useFocusEffect(
      useCallback(() => {
        fetch_modulos();
        return () => {};
      }, [])
    );

  const fetch_modulos = async ()=>{
    const m = await todos_los_modulos();
    setModulos(m || [])
    //console.log(m)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis módulos</Text>
      <FlatList
        data={modulos}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{paddingBottom:80}}

        renderItem={({ item }) => (
          <View style={styles.card}>
            <Ionicons name={item.icon} size={36} color="#20bfa9" />
            <Text style={styles.cardTitle}>{item.nombre}</Text>
            <Text style={styles.cardSubtitle}>
              {/* {item.length} señas incluidas */}
            </Text>
            <Pressable
              style={styles.button}
              onPress={() => router.push({ pathname: '/tabs/Modulos_Alumno/modulo_detalle', params: { id: item.id } })}
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
  },
});
