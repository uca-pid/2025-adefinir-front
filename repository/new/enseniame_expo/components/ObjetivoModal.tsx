import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SmallPopupModal } from '@/components/modals';
import { paleta } from '@/components/colores';

type Objetivo = {
  id?: number;
  titulo: string;
  descripcion?: string | null;
  fecha_limite?: string | null;
  completado?: boolean;
}

export default function ObjetivoModal({
  visible,
  onClose,
  onSave,
  initialData,
}: {
  visible: boolean;
  onClose: () => void;
  onSave: (payload: Partial<Objetivo> & { id?: number }) => Promise<void> | void;
  initialData?: Objetivo;
}) {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fecha, setFecha] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitulo(initialData.titulo || '');
      setDescripcion(initialData.descripcion || '');
      setFecha(initialData.fecha_limite || '');
    } else {
      setTitulo('');
      setDescripcion('');
      setFecha('');
    }
  }, [initialData, visible]);

  const handleSave = async () => {
    if (!titulo.trim()) {
      Alert.alert('Validación', 'El título no puede estar vacío');
      return;
    }

    const payload: Partial<Objetivo> & { id?: number } = {
      titulo: titulo.trim(),
      descripcion: descripcion.trim() || null,
      fecha_limite: fecha ? fecha : null,
    };
    if (initialData && initialData.id) payload.id = initialData.id;

    await onSave(payload);
  };

  return (
  <SmallPopupModal title={initialData ? 'Editar objetivo' : 'Nuevo objetivo'} modalVisible={visible} setVisible={(v) => onClose()}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={styles.label}>Título *</Text>
        <TextInput
          value={titulo}
          onChangeText={setTitulo}
          placeholder="Título"
          placeholderTextColor="#9aa0a6"
          style={styles.input}
        />

        <Text style={styles.label}>Descripción</Text>
        <TextInput
          value={descripcion}
          onChangeText={setDescripcion}
          placeholder="Descripción (opcional)"
          placeholderTextColor="#9aa0a6"
          style={[styles.input, styles.textarea]}
          multiline
        />

        <Text style={styles.label}>Fecha límite (YYYY-MM-DD)</Text>
        <TextInput
          value={fecha}
          onChangeText={setFecha}
          placeholder="2025-12-31"
          placeholderTextColor="#9aa0a6"
          style={styles.input}
        />

        <View style={styles.rowBtns}>
          <TouchableOpacity style={[styles.btn, styles.cancel]} onPress={onClose}>
            <Ionicons name="close" size={18} color="#222" />
            <Text style={styles.btnCancelText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.save]} onPress={handleSave}>
            <Ionicons name="save" size={18} color="#fff" />
            <Text style={styles.btnSaveText}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SmallPopupModal>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 24 },
  label: { marginTop: 8, fontSize: 13, color: '#333', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  textarea: { minHeight: 90, textAlignVertical: 'top' },
  rowBtns: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16 },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginLeft: 10,
  },
  cancel: { backgroundColor: '#f1f1f1' },
  save: { backgroundColor: '#20bfa9' },
  btnCancelText: { color: '#222', fontWeight: '600' },
  btnSaveText: { color: '#fff', fontWeight: '700' },
});
