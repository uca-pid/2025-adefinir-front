import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, Pressable, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { supabase } from "../../utils/supabase";

const iconOptions = ["car", "paw", "hand-left", "book", "star", "color-palette"] as const;

export default function CrearModuloScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string; nombre?: string; icon?: string }>();
  const isEdit = !!params.id;
  const [nombre, setNombre] = useState(params.nombre || "");
  const [descripcion, setDescripcion] = useState("");
  const [icon, setIcon] = useState((params.icon as string) || "car");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (params.nombre) setNombre(params.nombre as string);
    if (params.icon) setIcon(params.icon as string);
  }, [params]);

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
      router.replace("/tabs/mis_modulos");
    } catch (e: any) {
      Alert.alert("Error", e.message || "No se pudo guardar el módulo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isEdit ? "Editar módulo" : "Agregar módulo"}</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre del módulo"
        value={nombre}
        onChangeText={setNombre}
        placeholderTextColor="#888"
      />
      <TextInput
        style={[styles.input, { height: 60 }]}
        placeholder="Descripción breve (opcional)"
        value={descripcion}
        onChangeText={setDescripcion}
        placeholderTextColor="#888"
        multiline
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
