import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useUserContext } from '@/context/UserContext';
import ObjetivoCard from '../../components/ObjetivoCard';
import ObjetivoModal from '../../components/ObjetivoModal';
import { Ionicons } from '@expo/vector-icons';

type Objetivo = {
  id: number;
  titulo: string;
  descripcion?: string | null;
  fecha_limite?: string | null;
  completado: boolean;
  user_id?: number;
}

export default function AlumnoObjetivosScreen() {
  const { user } = useUserContext();
  const [objetivos, setObjetivos] = useState<Objetivo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<Objetivo | null>(null);

  useEffect(() => {
    loadObjetivos();
  }, []);

  async function loadObjetivos() {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('objetivos')
        .select('*')
        .eq('user_id', (user as any).id);

      if (error) throw error;
      const list: Objetivo[] = (data || []).map((r: any) => ({
        id: r.id,
        titulo: r.titulo,
        descripcion: r.descripcion,
        fecha_limite: r.fecha_limite,
        completado: r.completado,
        user_id: r.user_id,
      }));

      // sort by fecha_limite (closest first). nulls last
      list.sort((a, b) => {
        if (!a.fecha_limite && !b.fecha_limite) return 0;
        if (!a.fecha_limite) return 1;
        if (!b.fecha_limite) return -1;
        return new Date(a.fecha_limite).getTime() - new Date(b.fecha_limite).getTime();
      });

      setObjetivos(list);
    } catch (err: any) {
      console.error(err);
      setError('Error cargando objetivos');
    } finally {
      setLoading(false);
    }
  }

  const openCreate = () => {
    setEditing(null);
    setModalVisible(true);
  };

  const openEdit = (o: Objetivo) => {
    if (o.completado) {
      Alert.alert('No permitido', 'No se puede editar un objetivo completado');
      return;
    }
    setEditing(o);
    setModalVisible(true);
  };

  const handleSave = async (payload: Partial<Objetivo> & { id?: number }) => {
    try {
      setLoading(true);
      if (payload.id) {
        // update
        const { data, error } = await supabase
          .from('objetivos')
          .update({ titulo: payload.titulo, descripcion: payload.descripcion, fecha_limite: payload.fecha_limite })
          .eq('id', payload.id)
          .select();
        if (error) throw error;
      } else {
        // create
        const { data, error } = await supabase
          .from('objetivos')
          .insert([{ titulo: payload.titulo, descripcion: payload.descripcion, fecha_limite: payload.fecha_limite, completado: false, user_id: (user as any).id }])
          .select();
        if (error) throw error;
      }
      setModalVisible(false);
      await loadObjetivos();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudo guardar el objetivo');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (o: Objetivo) => {
    if (o.completado) {
      Alert.alert('No permitido', 'No se puede eliminar un objetivo completado');
      return;
    }
    Alert.alert('Confirmar', '¿Eliminar objetivo?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => confirmDelete(o) },
    ]);
  };

  const confirmDelete = async (o: Objetivo) => {
    try {
      setLoading(true);
      const { error } = await supabase.from('objetivos').delete().eq('id', o.id);
      if (error) throw error;
      await loadObjetivos();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudo eliminar el objetivo');
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = async (o: Objetivo) => {
    try {
      setLoading(true);
      const { error } = await supabase.from('objetivos').update({ completado: !o.completado }).eq('id', o.id);
      if (error) throw error;
      await loadObjetivos();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudo actualizar el estado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Objetivos</Text>
      {loading && <ActivityIndicator />}
      {error && <Text style={{ color: 'red' }}>{error}</Text>}

      <FlatList
        data={objetivos}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <ObjetivoCard
            objetivo={item}
            onEdit={() => openEdit(item)}
            onDelete={() => handleDelete(item)}
            onToggle={() => toggleComplete(item)}
          />
        )}
        ListEmptyComponent={<Text style={styles.empty}>No tienes objetivos aún</Text>}
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      <TouchableOpacity style={styles.fab} onPress={openCreate}>
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>

      <ObjetivoModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
        initialData={editing || undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: 'white' },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 12 },
  empty: { textAlign: 'center', marginTop: 40, color: '#666' },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#0a7ea4',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
});
