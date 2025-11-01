import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Modal, TouchableOpacity, SafeAreaView } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useUserContext } from '@/context/UserContext';
import { modulos_completados_por_alumno, progreso_por_categoria } from '@/conexiones/modulos';
  
import Toast from 'react-native-toast-message';

export default function HomeStudent() {
  const contexto = useUserContext();
  const [modalVisible, setModalVisible] = useState(false);
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
      //console.log('Modulos completados actualizados:', completados);
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
        //console.log('Progreso por categoría cargado:', data);
      }catch(err){ console.error('Error cargando progreso por categoría', err) }
    }
    if(contexto.user && contexto.user.id) load();
    return ()=>{ mounted = false }
  }, [contexto.user.id]);

  // Solo mostrar las primeras 3 categorías en la vista principal
  const topCategorias = progresoCategorias.slice(0, 3);
  const hayMasCategorias = progresoCategorias.length > 3;

  // Componente para renderizar una barra de categoría
  const CategoriaProgressBar = ({ categoria, index }: { categoria: any, index: number }) => (
    <View key={String(categoria.categoriaId || index)} style={styles.categoriaItem}>
      <View style={styles.categoriaHeader}>
        <Text style={styles.categoriaNombre}>{categoria.nombre}</Text>
        <Text style={styles.categoriaPorcentaje}>{categoria.porcentaje}%</Text>
      </View>
      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, {width: `${categoria.porcentaje}%`}]} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Hola, {contexto.user.username} 👋</Text>
        
        <View style={styles.stackCards}>
          <View style={[styles.card, styles.cardLeft]}> 
            <Ionicons name="flame" size={28} color="#20bfa9" style={{marginBottom: 8}} />
            <Text style={styles.cardTitleCursos}>{user.racha} días de racha</Text>
          </View>
          <Pressable style={[styles.card, styles.cardRight]} onPress={() => router.push('/tabs/dashboard_alumno')}>
            <Text style={styles.cardTitleCursos}>{user.modulosCompletados}</Text>
            <Text style={styles.cardTitleCursos}>módulos completos</Text>
          </Pressable>
        </View>

        <View style={[styles.card, {marginTop: 8, marginBottom: 20}]}>
          <View style={styles.categoriasHeader}>
            <Text style={styles.categoriasTitle}>Tus categorías más aprendidas</Text>
            {hayMasCategorias && (
              <TouchableOpacity 
                onPress={() => setModalVisible(true)}
                style={styles.verTodasButton}
              >
                <Text style={styles.verTodasText}>Ver todas</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={{alignItems: 'center', marginBottom: 10, width: "100%"}}>
          {progresoCategorias.length === 0 && <Text style={{color:'#666'}}>Aún no hay progreso por categoría</Text>}
          <ScrollView style={{maxHeight: 200, maxWidth: '100%', width: "100%"}}>
            {topCategorias.map((categoria, idx) => (
              <CategoriaProgressBar key={categoria.categoriaId} categoria={categoria} index={idx} />
            ))}
          </ScrollView>
          </View>
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

      {/* Modal para mostrar todas las categorías */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Todas las categorías</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <Ionicons name="close-circle" size={28} color="#20bfa9" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalScrollView}>
              {progresoCategorias.map((categoria, idx) => (
                <CategoriaProgressBar key={categoria.categoriaId} categoria={categoria} index={idx} />
              ))}
            </ScrollView>
          </View>
        </SafeAreaView>
      </Modal>
      <Toast/>
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
  categoriasHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoriasTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  verTodasButton: {
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  verTodasText: {
    color: '#20bfa9',
    fontWeight: '600',
    fontSize: 10,
  },
  categoriaItem: {
    marginBottom: 14,
  },
  categoriaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoriaNombre: {
    fontWeight: '600',
    fontSize: 14,
    color: '#333',
  },
  categoriaPorcentaje: {
    fontWeight: '600',
    fontSize: 14,
    color: '#20bfa9',
  },
  progressBarBg: {
    width: '100%',
    height: 12,
    backgroundColor: '#eee',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#20bfa9',
    borderRadius: 6,
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
  // Estilos para el modal
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  closeButton: {
    padding: 5,
  },
  modalScrollView: {
    paddingBottom: 20,
  },
});
