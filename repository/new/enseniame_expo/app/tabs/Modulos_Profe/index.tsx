import React, { useState, useEffect } from "react";
import { useFocusEffect } from "expo-router";
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { supabase } from "../../../utils/supabase";
import { mis_modulos } from "@/conexiones/modulos";
import { useUserContext } from "@/context/UserContext";
import { error_alert } from "@/components/alert";

export default function MisModulosScreen() {
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState<number | null>(null);
  const router = useRouter();

  const contexto = useUserContext()

  useFocusEffect(
    React.useCallback(() => {
      fetchModules();
    }, [])
  );

  const fetchModules = async () => {
    setLoading(true);
    try {
      const data = await mis_modulos(contexto.user.id);
      setModules(data || [])
    } catch (error) {
      console.error(error);
      error_alert("Se produjo un error al buscar los módulos");
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    setShowMenu(null);
    const { error } = await supabase.from('Modulos').delete().eq('id', id);
    if (!error) fetchModules();
  };

  return (
    <View style={styles.container}>
  <Text style={styles.title}>Mis módulos</Text>
      <Pressable
        style={styles.addBtn}
        onPress={() => router.push("/tabs/Modulos_Profe/crear_modulo")}
      >
        <Ionicons name="add" size={28} color="#fff" />
        <Text style={styles.addBtnText}>Agregar módulo</Text>
      </Pressable>
      {loading ? (
        <ActivityIndicator size="large" color="#20bfa9" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={modules}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name={item.icon || "cube-outline"} size={32} color="#20bfa9" style={{ marginRight: 10 }} />
                  <View>
                    <Text style={styles.cardTitle}>{item.nombre}</Text>
                    <Text style={styles.cardSubtitle}>{item.descripcion || ''}</Text>
                  </View>
                </View>
                <Pressable onPress={() => setShowMenu(showMenu === item.id ? null : item.id)} style={{ padding: 8 }}>
                  <Ionicons name="ellipsis-vertical" size={22} color="#888" />
                </Pressable>
              </View>
              <View style={styles.cardActions}>
                <Pressable
                  style={styles.viewBtn}
                  onPress={() => router.push({
                    pathname: "/tabs/Modulos_Profe/detalle_modulo",
                    params: { id: item.id, nombre: item.nombre }
                  })}
                >
                  <Text style={styles.viewBtnText}>Ver señas</Text>
                </Pressable>
              </View>
              {showMenu === item.id && (
                <>
                  <Pressable
                    style={{
                      position: 'absolute',
                      top: -1000,
                      left: -1000,
                      right: -1000, 
                      bottom: -1000,
                      zIndex: 98
                    }}
                    onPress={() => setShowMenu(null)}
                  />
                  {/* Menú flotante */}
                  <View style={{ 
                    position: 'absolute', 
                    top: 12, 
                    right: 12, 
                    backgroundColor: '#fff', 
                    borderRadius: 10, 
                    elevation: 6, 
                    shadowColor: '#222', 
                    shadowOpacity: 0.15, 
                    zIndex: 100 
                  }}>
                    <Pressable
                      style={{ padding: 12, flexDirection: 'row', alignItems: 'center' }}
                      onPress={() => {
                        setShowMenu(null);
                        router.push({ pathname: "/tabs/Modulos_Profe/crear_modulo", params: { id: item.id, nombre: item.nombre, icon: item.icon, descripcion: item.descripcion } });
                      }}
                    >
                      <Ionicons name="create-outline" size={18} color="#20bfa9" style={{ marginRight: 8 }} />
                      <Text style={{ color: '#20bfa9', fontWeight: 'bold' }}>Editar módulo</Text>
                    </Pressable>
                    <Pressable
                      style={{ padding: 12, flexDirection: 'row', alignItems: 'center' }}
                      onPress={() => handleDelete(item.id)}
                    >
                      <Ionicons name="trash" size={18} color="#e74c3c" style={{ marginRight: 8 }} />
                      <Text style={{ color: '#e74c3c', fontWeight: 'bold' }}>Eliminar módulo</Text>
                    </Pressable>
                  </View>
                </>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e6f7f2",
    padding: 16,
  },
  backBtn: {
    alignSelf: 'flex-start',
    marginBottom: 10,
    backgroundColor: '#20bfa9',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  backBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: '#20bfa9',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 28,
    marginBottom: 18,
    marginTop: 8,
    shadowColor: '#222',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    marginVertical: 20
  },
  addBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 8,
    
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#222",
    alignSelf: "center",
    marginBottom: 18,
    marginTop: 50
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
    marginTop: 8,
  },
  cardSubtitle: {
    color: "#555",
    fontSize: 15,
    marginBottom: 10,
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e6f7f2",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  editBtnText: {
    color: "#20bfa9",
    fontWeight: "bold",
    marginLeft: 4,
  },
  viewBtn: {
    backgroundColor: "#20bfa9",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  viewBtnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
