import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const iconOptions = ["car", "paw", "hand-left", "book", "star", "color-palette"] as const;

export default function CrearModuloScreen() {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [icon, setIcon] = useState("car");
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear módulo</Text>
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
      <Pressable style={styles.saveBtn} onPress={() => router.back()}>
        <Text style={styles.saveBtnText}>Guardar módulo</Text>
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
