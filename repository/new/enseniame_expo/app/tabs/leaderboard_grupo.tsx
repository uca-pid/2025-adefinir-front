import React, { useEffect, useState, useCallback } from 'react';
import { SafeAreaView, View, Text, FlatList, ActivityIndicator, RefreshControl, StyleSheet } from 'react-native';
import { useUserContext } from '@/context/UserContext';
import { PeriodSelector } from '@/components/leaderboard/PeriodSelector';
import { LeaderboardRow } from '@/components/leaderboard/LeaderboardRow';
import { LeaderboardMyPositionCard } from '@/components/leaderboard/LeaderboardMyPositionCard';
import { fetchGroupLeaderboard } from '@/conexiones/leaderboard';
import type { PeriodType, LeaderboardEntry, LeaderboardResponse } from '@/components/leaderboard/types';
import { supabase } from '@/lib/supabase';



const DEFAULT_GROUP_ID = 1; 

export default function LeaderboardGrupoScreen() {
  const { user } = useUserContext();
  const [period, setPeriod] = useState<PeriodType>('week');
  const [data, setData] = useState<LeaderboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [groupId, setGroupId] = useState<number>(DEFAULT_GROUP_ID);
  const [groupName, setGroupName] = useState<string>('');

  
  useEffect(() => {
    const loadGroup = async () => {
      if (!user?.id) return;
      try {
        const { data: gu } = await supabase
          .from('group_users')
          .select('group_id')
          .eq('user_id', user.id)
          .limit(1);
        if (gu && gu.length > 0) {
          setGroupId(Number(gu[0].group_id));
        } else {
          setGroupId(DEFAULT_GROUP_ID);
        }
      } catch {}
    };
    loadGroup();
  }, [user?.id]);

  const load = useCallback(async () => {
    if (!user?.id) return;
    setError(null);
    setLoading(true);
    try {
      const resp = await fetchGroupLeaderboard(period, groupId, user.id);
      setGroupName(resp.groupName);
      setData(resp);
    } catch (e: any) {
      setError('No se pudo cargar el leaderboard');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [period, user?.id, groupId]);

  useEffect(() => { load(); }, [load]);

  
  useEffect(() => {
    if (!user?.id) return;
    const ch1 = supabase
      .channel(`rt-leader-aprendidas-${user.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Alumno_Senia', filter: `user_id=eq.${user.id}` }, () => load())
      .subscribe();
    const ch2 = supabase
      .channel(`rt-leader-mods-${user.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'modules_completed', filter: `user_id=eq.${user.id}` }, () => load())
      .subscribe();
    return () => {
      try { supabase.removeChannel(ch1); } catch {}
      try { supabase.removeChannel(ch2); } catch {}
    };
  }, [user?.id, load]);

  const onRefresh = () => { setRefreshing(true); load(); };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data?.entries || []}
        keyExtractor={(item) => String(item.userId)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={(
          <View style={styles.header}>
            <Text style={styles.title}>{groupName ? `Leaderboard · ${groupName}` : 'Leaderboard Grupo'}</Text>
            <PeriodSelector value={period} onChange={setPeriod} disabled={loading} />
            {loading && (
              <View style={styles.loadingBox}><ActivityIndicator color="#20bfa9" /><Text style={styles.loadingText}>Cargando…</Text></View>
            )}
            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}
            <LeaderboardMyPositionCard selfEntry={data?.selfEntry} />
            {(!loading && (!data || data.entries.length === 0)) && (
              <Text style={styles.emptyText}>Sin datos para el período seleccionado.</Text>
            )}
          </View>
        )}
        renderItem={({ item }) => <LeaderboardRow entry={item as LeaderboardEntry} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e6f7f2' },
  listContent: { paddingHorizontal: 16, paddingBottom: 64 },
  header: { paddingHorizontal: 8, paddingBottom: 16 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#222', marginTop: 52, marginBottom: 12, alignSelf: 'center' },
  loadingBox: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  loadingText: { marginLeft: 8, color: '#555' },
  errorText: { color: '#c0392b', fontWeight: '600', marginBottom: 12 },
  emptyText: { color: '#555', fontStyle: 'italic', marginTop: 8 },
});
