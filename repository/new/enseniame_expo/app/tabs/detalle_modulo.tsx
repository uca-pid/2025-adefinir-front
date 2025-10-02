import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Pressable, Image, TextInput, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "../../utils/supabase";

interface Senia {
  id: number;
  significado: string;
  video_url: string;
  thumbnail?: string;
}

export default function DetalleModuloScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [seniasModulo, setSeniasModulo] = useState<Senia[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [diccionario, setDiccionario] = useState<Senia[]>([]);
  const [agregando, setAgregando] = useState(false);

  useEffect(() => {
    fetchSeniasModulo();
    fetchDiccionario();
  }, [id]);

  const fetchDiccionario = async () => {
    const { data, error } = await supabase.from('Senias').select('*').order('significado', { ascending: true });
    if (!error && data) setDiccionario(data);
  };

  const fetchSeniasModulo = async () => {
    setLoading(true);
    try {
      // 1. Traer las relaciones Modulo_Video para este módulo
      const { data: relaciones, error: relError } = await supabase
        .from('Modulo_Video')
        .select('id_video')
        .eq('id_modulo', id);
      if (relError) throw relError;
      const ids = relaciones?.map((r: any) => r.id_video) || [];
      if (ids.length === 0) {
        setSeniasModulo([]);
        setLoading(false);
        return;
      }
      // 2. Traer los videos correspondientes
      const { data: senias, error: seniaError } = await supabase
        .from('Senias')
        .select('*')
        .in('id', ids);
      if (seniaError) throw seniaError;
      setSeniasModulo(senias || []);
    } catch (e) {
      Alert.alert('Error', 'No se pudieron cargar las señas del módulo');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleEliminarSenia = async (seniaId: number) => {
    Alert.alert(
      'Eliminar seña',
      '¿Estás seguro de que quieres eliminar esta seña del módulo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar', style: 'destructive', onPress: async () => {
            const { error } = await supabase
              .from('Modulo_Video')
              .delete()
              .eq('id_modulo', id)
              .eq('id_video', seniaId);
            if (error) {
              Alert.alert('Error', 'No se pudo eliminar la seña');
            } else {
              setSeniasModulo(seniasModulo.filter(s => s.id !== seniaId));
              fetchSeniasModulo();
              Alert.alert('Seña eliminada', 'La seña fue eliminada del módulo correctamente.');
            }
          }
        }
      ]
    );
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchSeniasModulo();
  };

  const handleVerSenia = (senia: Senia) => {
    router.push({
      pathname: "/tabs/senia",
      params: {
        id: senia.id,
        nombre: senia.significado,
        video_url: senia.video_url,
        modulo_id: id
      }
    });
  };

  const handleAgregarSenia = async (senia: Senia) => {
    setAgregando(true);
    const { error } = await supabase
      .from('Modulo_Video')
      .insert([{ id_modulo: id, id_video: senia.id }]);
    setAgregando(false);
    if (error) {
      Alert.alert('Error', 'No se pudo agregar la seña');
    } else {
      setSearch("");
      fetchSeniasModulo();
      Alert.alert('Seña agregada', 'La seña fue agregada al módulo correctamente.');
    }
  };

  // Filtrar señas del diccionario que no estén ya en el módulo y coincidan con la búsqueda
  const filteredDiccionario = diccionario.filter(
    s =>
      s.significado.toLowerCase().includes(search.toLowerCase()) &&
      !seniasModulo.some(sm => sm.id === s.id)
  );

  return (
    <View style={styles.container}>
      <Pressable style={[styles.backBtn, {marginBottom: 10, flexDirection: 'row', alignItems: 'center'}]} onPress={() => router.replace('/tabs/mis_modulos')}>
        <Ionicons name="arrow-back" size={20} color="#fff" style={{marginRight: 6}} />
        <Text style={styles.backBtnText}>Volver</Text>
      </Pressable>
      <Text style={styles.title}>Módulo: {id}</Text>
      {/* Barra de búsqueda fija */}
      <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 14, elevation: 2 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>Buscar seña en el diccionario</Text>
        <TextInput
          placeholder="Buscar palabra..."
          style={{ borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8, padding: 8, marginBottom: 10 }}
          value={search}
          onChangeText={setSearch}
        />
        {agregando && <ActivityIndicator size="small" color="#20bfa9" style={{ marginBottom: 8 }} />}
        {search.length > 0 && filteredDiccionario.length > 0 && (
          filteredDiccionario.map((senia) => (
            <Pressable
              key={senia.id}
              style={{ paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eee' }}
              onPress={() => handleAgregarSenia(senia)}
            >
              <Text style={{ color: '#222', fontSize: 16 }}>{senia.significado}</Text>
            </Pressable>
          ))
        )}
        {search.length > 0 && filteredDiccionario.length === 0 && (
          <Text style={{ color: '#888', fontStyle: 'italic' }}>No se encontraron coincidencias.</Text>
        )}
      </View>
      {/* Lista de señas agregadas al módulo */}
      {loading ? (
        <ActivityIndicator size="large" color="#20bfa9" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={seniasModulo}
          keyExtractor={(item) => item.id.toString()}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.row}>
                <Image source={{ uri: item.thumbnail || 'https://img.youtube.com/vi/1/default.jpg' }} style={styles.thumbnail} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{item.significado}</Text>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <Pressable
                      style={styles.viewBtn}
                      onPress={() => handleVerSenia(item)}
                    >
                      <Text style={styles.viewBtnText}>Ver seña</Text>
                    </Pressable>
                    <Pressable
                      style={[styles.viewBtn, { backgroundColor: '#e74c3c' }]}
                      onPress={() => handleEliminarSenia(item.id)}
                    >
                      <Ionicons name="trash" size={18} color="#fff" />
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
          )}
        />
      )}
      {/* Botón Guardar */}
      <Pressable
        style={{ backgroundColor: '#20bfa9', borderRadius: 30, alignSelf: 'center', marginTop: 24, paddingVertical: 14, paddingHorizontal: 40 }}
        onPress={() => router.back()}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>Guardar</Text>
      </Pressable>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6f7f2',
    padding: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#222',
    alignSelf: 'center',
    marginBottom: 18,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#222',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 14,
    backgroundColor: '#e0e0e0',
  },
  cardTitle: {
    color: '#222',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  viewBtn: {
    backgroundColor: '#20bfa9',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  viewBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  backBtn: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
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
});
