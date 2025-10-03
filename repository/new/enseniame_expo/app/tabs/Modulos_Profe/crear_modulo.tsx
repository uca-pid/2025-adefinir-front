import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, Pressable, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { supabase } from "../../../utils/supabase";
import { useUserContext } from "@/context/UserContext";

const iconOptions = ["car", "paw", "hand-left", "book", "star", "color-palette"] as const;

export default function CrearModuloScreen() {
  
  const params = useLocalSearchParams<{ id?: string; nombre?: string; icon?: string; descripcion?: string }>();
  const isEdit = !!params.id;
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [icon, setIcon] = useState("car");
  const [loading, setLoading] = useState(false);

  const contexto = useUserContext();

  useEffect(() => {
    if (isEdit) {
      setNombre(params.nombre ? String(params.nombre) : "");
      setDescripcion(params.descripcion ? String(params.descripcion) : "");
      setIcon(params.icon ? String(params.icon) : "car");
    } else {
      setNombre("");
      setDescripcion("");
      setIcon("car");
    }
  }, [params.id, params.nombre, params.descripcion, params.icon, isEdit]);

  const handleSave = async () => {
    if (!nombre.trim()) {
      Alert.alert("Error", "El nombre del módulo es obligatorio.");
      return;
    }
    setLoading(true);
    try {
      if (isEdit && params.id) {
        const { error } = await supabase
          .from("Modulos")
          .update({ nombre, descripcion, icon })
          .eq("id", params.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("Modulos")
          .insert([{ nombre, descripcion, icon }]);
        if (error) throw error;
      }
      contexto.user.gotToModules();
    } catch (e: any) {
      Alert.alert("Error", e.message || "No se pudo guardar el módulo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable 
        style={styles.backBtn} 
        onPress={() => contexto.user.gotToModules()}
      >
        <Ionicons name="arrow-back" size={20} color="#20bfa9" style={{ marginRight: 6 }} />
        <Text style={styles.backBtnText}>Volver</Text>
      </Pressable>
      <Text style={styles.title}>{isEdit ? "Editar módulo" : "Agregar módulo"}</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre del módulo"
        value={nombre}
        onChangeText={setNombre}
        placeholderTextColor="#888"
        editable={!loading}
        selectTextOnFocus={true}
        autoCorrect={false}
        autoCapitalize="words"
      />
      <TextInput
        style={[styles.input, { height: 60 }]}
        placeholder="Descripción breve (opcional)"
        value={descripcion}
        onChangeText={setDescripcion}
        placeholderTextColor="#888"
        multiline
        editable={!loading}
        selectTextOnFocus={true}
        autoCorrect={false}
        autoCapitalize="sentences"
        textAlignVertical="top"
      />
      <Text style={styles.label}>Icono:</Text>
      <View style={styles.iconRow}>
        {iconOptions.map((ic) => (
          <Pressable
            key={ic}
            style={[styles.iconOption, icon === ic && styles.iconSelected]}
            onPress={() => setIcon(ic)}
          >
            <Ionicons name={ic} size={28} color={icon === ic ? "#20bfa9" : "#888"} />
          </Pressable>
        ))}
      </View>
      <Pressable style={styles.saveBtn} onPress={handleSave} disabled={loading}>
        <Text style={styles.saveBtnText}>{loading ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear módulo"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6f7f2',
    padding: 24,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 10,
    padding: 8,
  },
  backBtnText: {
    color: '#20bfa9',
    fontWeight: 'bold',
    fontSize: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#222',
    alignSelf: 'center',
    marginBottom: 18,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#222',
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
  },
  label: {
    color: '#555',
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 15,
  },
  iconRow: {
    flexDirection: 'row',
    marginBottom: 18,
  },
  iconOption: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
  },
  iconSelected: {
    borderColor: '#20bfa9',
    backgroundColor: '#e6f7f2',
  },
  saveBtn: {
    backgroundColor: '#20bfa9',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
  },
});
