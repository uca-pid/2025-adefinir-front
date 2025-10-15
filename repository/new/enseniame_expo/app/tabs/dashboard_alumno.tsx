import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUserContext } from '@/context/UserContext';
import { supabase } from '@/lib/supabase';
import ProgressCard from '@/components/ProgressCard';
import GlobalProgress from '@/components/GlobalProgress';

type Modulo = { id: number; nombre: string };
type RelacionModuloVideo = { id_modulo: number; id_video: number };

export default function DashboardAlumnoScreen() {
  const { user } = useUserContext();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [relaciones, setRelaciones] = useState<RelacionModuloVideo[]>([]);
  const [aprendidasMap, setAprendidasMap] = useState<Record<number, boolean>>({}); // senia_id -> aprendida
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setError(null);
    setLoading(true);
    try {
      const { data: mods, error: modErr } = await supabase
        .from('Modulos')
        .select('id, nombre')
        .order('id', { ascending: true });
      if (modErr) throw modErr;

      const { data: rels, error: relErr } = await supabase
        .from('Modulo_Video')
        .select('id_modulo, id_video');
      if (relErr) throw relErr;

      const aprendidas: Record<number, boolean> = {};
      const { data: as, error: asErr } = await supabase
        .from('Alumno_Senia') // Ajusta nombre/columnas si difieren
        .select('senia_id, aprendida')
        .eq('user_id', user.id);
      if (!asErr && as) {
        as.forEach((row: any) => {
          aprendidas[row.senia_id] = !!row.aprendida;
        });
      } else {
        console.warn('[dashboard] Alumno_Senia no disponible, fallback 0 aprendidas.', asErr?.message);
      }

      setModulos(mods || []);
      setRelaciones(rels || []);
      setAprendidasMap(aprendidas);
    } catch (e: any) {
      console.error('[dashboard] fetch error:', e?.message);
      setError(e?.message || 'Error al cargar el Dashboard');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user?.id]);

  const progresoPorModulo = useMemo(() => {
    const byModule: Array<{ id: number; nombre: string; total: number; learned: number }> = [];
    const relsByModule = new Map<number, number[]>();
    relaciones.forEach((r) => {
      const arr = relsByModule.get(r.id_modulo) || [];
      arr.push(r.id_video);
      relsByModule.set(r.id_modulo, arr);
    });
    modulos.forEach((m) => {
      const senias = relsByModule.get(m.id) || [];
      const total = senias.length;
      const learned = senias.reduce((acc, sid) => acc + (aprendidasMap[sid] ? 1 : 0), 0);
      byModule.push({ id: m.id, nombre: m.nombre, total, learned });
    });
    return byModule;
  }, [modulos, relaciones, aprendidasMap]);

  const progresoGlobal = useMemo(() => {
    return progresoPorModulo.reduce(
      (acc, m) => ({ total: acc.total + m.total, learned: acc.learned + m.learned }),
      { total: 0, learned: 0 }
    );
  }, [progresoPorModulo]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}> 
        <ActivityIndicator size="large" color="#20bfa9" />
        <Text style={{ marginTop: 12, color: '#555' }}>Cargando progreso…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard de Aprendizaje</Text>

      <GlobalProgress learned={progresoGlobal.learned} total={progresoGlobal.total} />

      {error && (
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle" size={18} color="#e74c3c" />
          <Text style={styles.errorText}> {error} </Text>
        </View>
      )}

      <FlatList
        data={progresoPorModulo}
        keyExtractor={(item) => String(item.id)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: 80 }}
        renderItem={({ item }) => (
          <ProgressCard
            title={item.nombre}
            learned={item.learned}
            total={item.total}
            onPress={() => router.push({ pathname: '/tabs/Modulos_Alumno/modulo_detalle', params: { id: String(item.id) } })}
          />
        )}
        ListEmptyComponent={() => (
          <Text style={{ color: '#777', alignSelf: 'center', marginTop: 24 }}>No hay módulos disponibles.</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e6f7f2', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#222', alignSelf: 'center', marginBottom: 14 },
  errorBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fdecea', borderRadius: 8, padding: 10, marginBottom: 10, borderWidth: 1, borderColor: '#f5c2c0' },
  errorText: { color: '#e74c3c', marginLeft: 6 },
});
