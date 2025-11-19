import React, { useState, useEffect, useCallback,  } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Modal, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { useUserContext } from '@/context/UserContext';
import { modulos_completados_por_alumno, progreso_por_categoria } from '@/conexiones/modulos';
import { Image } from 'expo-image';
import Toast from 'react-native-toast-message';
import { paleta } from '@/components/colores';
import { mi_racha, perder_racha, sumar_racha } from '@/conexiones/racha';
import { error_alert } from '@/components/alert';
import { es_hoy, fue_ayer, now } from '@/components/validaciones';
import { BotonLogin } from '@/components/botones';
import { estilos } from '@/components/estilos';
import { desbloquee_un_avatar, nuevo_avatar_desbloqueado } from '@/conexiones/avatars';
import { Avatar } from '@/components/types';
import { ThemedText } from '@/components/ThemedText';

export default function HomeStudent() {
  const contexto = useUserContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [user, setUser] = useState({ 
    id: contexto.user.id,
    nombre: contexto.user.username,
    racha: 0,
    modulosCompletados: 0,
  });  
  const [progresoCategorias, setProgresoCategorias] = useState<Array<any>>([]);

  const [showModalRacha,setShowModalRacha] = useState(false);
  const fuego_racha = require("../../../assets/images/Streak activation.gif");
  const racha_perdida =require("../../../assets/images/Broken Stars.gif");

  const [showModalAvatar,setShowModalAvatar] = useState(false);
  const [nuevo_avatar, setNuevoAvatar] = useState<String>();
  const [desbloqueado,setDesbloqueado] = useState(false);

  useFocusEffect(
      useCallback(() => {
        const fetchModulosCompletados = async () => {
        const completados = await modulos_completados_por_alumno(contexto.user.id);
        setUser(prev => ({ ...prev, modulosCompletados: completados || 0 }));
        //console.log('Modulos completados actualizados:', completados);
        };

        fetchModulosCompletados();
        fetch_racha();
          return () => {};
        }, [])
      );


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

  const fetch_racha = async ()=>{
    try {      
      const r = await mi_racha(contexto.user.id);
      let racha = 1;
      let cambio = false;
      if (r) {
        let ultimo_login =new Date(r.last_login);        
        if (fue_ayer(ultimo_login)) { 
          const desbloquee = await desbloquee_un_avatar(r.racha+1,r.racha_maxima);
          setDesbloqueado(desbloquee)
          await sumar_racha(contexto.user.id);
          racha= r.racha+1;
          cambio=true;
          console.log("sumo racha",r.last_login);         
        }
        else if (!es_hoy(ultimo_login)) {
          await perder_racha(contexto.user.id);
          cambio=true;
          console.log("pierdo racha",r.last_login)
        }
        else {
          racha= r.racha;
          console.log("es hoy; no sumo ni pierdo")
        }        
      }
      setUser(prev => ({ ...prev, racha: racha || 0 }));
      setShowModalRacha(cambio);
    } catch (error) {
      console.error(error);
      error_alert("Ocurrió un error al cargar la racha");
    }    
  }

  const cerrar_modal_racha = async () => {
    try {            
      if (desbloqueado) {        
        //modal avatar nuevo    
        const a:Avatar = await nuevo_avatar_desbloqueado(user.racha) ;
        setNuevoAvatar(a.image_url);
        setShowModalRacha(false);
        setShowModalAvatar(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setShowModalRacha(false)
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Hola, {contexto.user.username} 👋</Text>
        
        <View style={styles.stackCards}>
          <View style={[styles.card, styles.cardLeft]}> 
            <Ionicons name="flame" size={28} color={paleta.strong_yellow} style={{marginBottom: 8}} />
            <Text style={styles.cardTitleCursos}>{user.racha} {user.racha ==1 ? "día":"días"} de racha</Text>
          </View>
          <Pressable style={[styles.card, styles.cardRight]} onPress={() => router.push('/tabs/Dashboard_Alumno')}>
            <Text style={styles.cardTitleCursos}>{user.modulosCompletados}</Text>
            <Text style={styles.cardTitleCursos}>{user.modulosCompletados==1 ? "módulo completo":"módulos completos"}</Text>
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
          <Pressable style={styles.shortcutCardCursos} onPress={() => router.push('/tabs/HomeStudent/alumno_objetivos')}>
            <Ionicons name="flag" size={22} color="#20bfa9" />
            <Text style={styles.shortcutTextCursos}>Mis objetivos</Text>
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
        <View style={[styles.modalContainer]}>
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
        </View>
      </Modal>

      {/* Modal de sumar o perder racha */}
        <Modal
          visible={showModalRacha}
          animationType="fade"
          transparent={true}
        >
          <View style={[styles.modalContainer,estilos.centrado,{width:"100%"}]}>
            <View style={[styles.modalContent,{height:"60%",borderBottomEndRadius:20,borderBottomStartRadius:20}]}>
              {user.racha==1 ? (
                <View>
                    <Text style={[styles.title_racha]}>Perdiste tu racha</Text>
                    <Image
                      style={[styles.image]}
                      source={racha_perdida}
                      contentFit="contain"
                      transition={0}
                    />
                
                <BotonLogin callback={()=>setShowModalRacha(false)} textColor={'black'} bckColor={paleta.turquesa} text={'Aceptar'}  />
                </View>
                ):(
                  <View>
                    <Text style={[styles.title_racha]}>¡¡Sumaste 1 día de racha!!</Text>
                    <Image
                      style={[styles.image]}
                      source={fuego_racha}
                      contentFit="contain"
                      transition={0}
                    />
                
                <BotonLogin callback={cerrar_modal_racha} textColor={'black'} bckColor={paleta.turquesa} text={'Aceptar'}  />
                </View>
                )}                                          
                
              
            </View>
          </View>
        </Modal>

        {/* Modal de desbloaquear un nuevo avatar */}
        <Modal
          visible={showModalAvatar}
          animationType="fade"
          transparent={true}
        >
          <View style={[styles.modalContainer,estilos.centrado,{width:"100%"}]}>
            <View style={[styles.modalContent,{height:"60%",borderBottomEndRadius:20,borderBottomStartRadius:20}]}>             
                  <View>
                    <Text style={[styles.title_racha,estilos.centrado]}>¡¡Desbloqueaste un nuevo avatar!!</Text>
                    <Image
                      style={[styles.image]}
                      source={nuevo_avatar? nuevo_avatar : fuego_racha}
                      contentFit="contain"
                      transition={0}
                    />
                  <BotonLogin callback={()=>{setShowModalAvatar(false);contexto.user.gotToProfile()}} textColor={'black'} bckColor={paleta.turquesa} text={'Equipar'}  />                
                  <Pressable style={[estilos.centrado,{marginTop:10}]} onPress={()=>setShowModalAvatar(false)}>
                    <ThemedText lightColor={paleta.dark_aqua} type='subtitle'>Cerrar</ThemedText>
                  </Pressable>
                </View>                                                                                      
            </View>
          </View>
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
  image: {
    flex: 1,
    width: "100%",
    height: "100%",    
  },
  title_racha: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 30,
    marginTop:60,
    color: paleta.dark_aqua,
    alignSelf: "center",
  },
});
