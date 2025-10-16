import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useUserContext } from '@/context/UserContext';
import { modulos_completados_por_alumno, progreso_por_categoria } from '@/conexiones/modulos';
  
export default function HomeStudent() {
  const contexto = useUserContext();
  const [user, setUser] = useState({ 
    id: contexto.user.id,
    nombre: contexto.user.username,
    racha: 5,
    modulosCompletados: 0,
  });

  useEffect(() => {
    const fetchModulosCompletados = async () => {
      const completados = await modulos_completados_por_alumno(contexto.user.id);
      setUser(prev => ({ ...prev, modulosCompletados: completados || 0 }));
      console.log('Modulos completados actualizados:', completados);
    };

    fetchModulosCompletados();
  }, [contexto.user.id]);

  const [progresoCategorias, setProgresoCategorias] = useState<Array<any>>([]);

  useEffect(()=>{
    let mounted = true;
    const load = async () =>{
      try{
        const data = await progreso_por_categoria(contexto.user.id);
        if(mounted) setProgresoCategorias(data || []);
        console.log('Progreso por categoría cargado:', data);
      }catch(err){ console.error('Error cargando progreso por categoría', err) }
    }
    if(contexto.user && contexto.user.id) load();
    return ()=>{ mounted = false }
  }, [contexto.user.id]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Hola, {contexto.user.username} 👋</Text>
        
        
        <View style={styles.stackCards}>
          <View style={[styles.card, styles.cardLeft]}> 
            <Ionicons name="flame" size={28} color="#20bfa9" style={{marginBottom: 8}} />
            <Text style={styles.cardTitleCursos}>{user.racha} días de racha</Text>
          </View>
          <View style={[styles.card, styles.cardRight]}> 
            <Text style={styles.cardTitleCursos}>{user.modulosCompletados}</Text>
            <Text style={styles.cardTitleCursos}>módulos completos</Text>
          </View>
        </View>

        <View style={[styles.card, {marginTop: 8, marginBottom: 20}]}>
          <Text style={{fontWeight: 'bold', marginBottom: 8}}>Tus categorías más aprendidas</Text>
          {progresoCategorias.length === 0 && <Text style={{color:'#666'}}>Aún no hay progreso por categoría</Text>}
          {progresoCategorias.map((c, idx)=> (
            <View key={String(c.categoriaId||idx)} style={{marginBottom: 10}}>
              <Text style={{fontWeight:'600', marginBottom: 6}}>{c.nombre} — {c.porcentaje}%</Text>
              <View style={styles.smallProgressBg}>
                <View style={[styles.smallProgressFill, {width: `${c.porcentaje}%`}]} />
              </View>
            </View>
          ))}
        </View>

        
        <Pressable style={styles.ctaButtonCursos}>
          <Ionicons name="flash" size={24} color="#fff" style={styles.buttonIcon} />
          <Text style={styles.ctaButtonTextCursos}>Practicar ahora</Text>
        </Pressable>

       
        <View style={styles.shortcutsRow}>
          <Pressable style={styles.shortcutCardCursos} onPress={() => router.push('/tabs/cursos')}>
            <Ionicons name="book" size={22} color="#20bfa9" />
            <Text style={styles.shortcutTextCursos}>Cursos</Text>
          </Pressable>
          <Pressable style={styles.shortcutCardCursos} onPress={() => router.push('/tabs/Diccionario')}>
            <Ionicons name="search" size={22} color="#20bfa9" />
            <Text style={styles.shortcutTextCursos}>Diccionario</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6f7f2',
    position: 'relative',
    paddingTop: 0,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 60,
    zIndex: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 32,
    marginBottom: 18,
    alignSelf: 'center',
    zIndex: 2,
    letterSpacing: 0.5,
  },
  stackCards: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 32,
    padding: 24,
    flex: 1, 
    alignItems: 'flex-start',
    shadowColor: '#222',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
  },
  cardLeft: {
    marginRight: 6,
  },
  cardRight: {
    marginLeft: 6,
  },
  cardTitleCursos: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
    fontFamily: 'System',
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  cardTextCursos: {
    fontSize: 15,
    color: '#222',
    opacity: 0.8,
    marginBottom: 6,
    fontFamily: 'System',
  },
  progressBarBgCursos: {
    width: '100%',
    height: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginTop: 12,
    marginBottom: 4,
    overflow: 'hidden',
  },
  progressBarFillCursos: {
    height: '100%',
    borderRadius: 8,
    backgroundColor: '#20bfa9',
  },
  ctaButtonCursos: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#20bfa9',
    borderRadius: 14,
    height: 50,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  ctaButtonTextCursos: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonIcon: {
    marginRight: 8,
  },
  shortcutsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  shortcutCardCursos: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 18,
    marginHorizontal: 6,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    shadowColor: '#222',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  shortcutTextCursos: {
    color: '#20bfa9',
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 6,
    fontFamily: 'System',
  },
  smallProgressBg: {
    width: '100%',
    height: 10,
    backgroundColor: '#eee',
    borderRadius: 6,
    overflow: 'hidden',
  },
  smallProgressFill: {
    height: '100%',
    backgroundColor: '#20bfa9',
    borderRadius: 6,
  },
});
