import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { 
  View, Text, StyleSheet, FlatList, Pressable, 
  SafeAreaView, ActivityIndicator, Modal, TextInput,
  TouchableOpacity, Alert
} from 'react-native';
import { Checkbox } from 'expo-checkbox';
import { Ionicons } from '@expo/vector-icons';
import VideoPlayer from '@/components/VideoPlayer';
import {  Senia_Info } from '@/components/types';
import { success_alert,error_alert } from '@/components/alert';
import { paleta,paleta_colores } from '@/components/colores';
import { estilos } from '@/components/estilos';
import {  buscarSenias, eliminar_video } from '@/conexiones/videos';
import { ThemedText } from '@/components/ThemedText';
import { useUserContext } from '@/context/UserContext';
import { router } from 'expo-router';
import { SmallPopupModal } from '@/components/modals';

export default function Diccionario() {
  const [senias, setSenias] = useState<Senia_Info[]>([]);
  const [filteredSenias, setFilteredSenias] = useState<Senia_Info[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [selectedSenia, setSelectedSenia] = useState<Senia_Info | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [mostrarPropios, setmostrarPropios] = useState(false);

  const contexto = useUserContext();

  useFocusEffect(
    useCallback(() => {
      //console.log('Tab Diccionario enfocada - Recargando señas...');
      fetchSenias();
      return () => {
      };
    }, [])
  );

  useEffect(() => {
    filterSenias();
  }, [searchQuery, senias, mostrarPropios]);

  const fetchSenias = async () => {
    try {
      const data = await buscarSenias();
      
      setSenias(data || []);
      setFilteredSenias(data || []);
      
    } catch (error) {
      console.error('Error fetching señas:', error);
      error_alert('No se pudieron cargar las señas');
    } finally {
      setLoading(false);
    }
  };

  const filterSenias = () => {
    var filtered = senias.filter(senia => 
      senia.significado.toLowerCase().includes(searchQuery.toLowerCase()) ||
      senia.Categorias.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) 
    );
    if (mostrarPropios){
      filtered = filtered.filter(senia =>  esMio(senia))
    }
   const orderedAndFiltered =filtered.sort(function (a, b) {
      if (a.significado < b.significado) {
        return -1;
      }
      if (a.significado > b.significado) {
        return 1;
      }
      return 0;
    })
    setFilteredSenias(orderedAndFiltered);
    
  };

  const esMio = (senia: Senia_Info)=>{
    return senia.Users?.id == contexto.user.id && contexto.user.is_prof
  }

  const eliminar_senia = (senia: Senia_Info) =>{
    Alert.alert('Eliminar seña', '¿Estás seguro de que querés eliminar el video?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {text: 'Confirmar', onPress: () => {
        eliminar_video(senia);
        setModalVisible(false);
        router.replace("/tabs/Diccionario");
        }},
    ])
  }

  const editar_senia= (senia: Senia_Info) =>{
    router.push({ pathname: "/tabs/Diccionario/editar_senia", params: { id_senia: senia.id, url: senia.video_url,significado:senia.significado, cate:senia.categoria } });
    setModalVisible(false)
  }

  const renderSenia = ({ item }: { item: Senia_Info }) => (
    <Pressable 
      style={styles.listItem}
      onPress={async () => {
        setSelectedSenia(item);
        setModalVisible(true);
        }
      }
    >
      <View style={styles.listItemContent}>
        <View>
          <Text style={styles.significadoText}>{item.significado}</Text>
          <Text style={[styles.significadoText,{fontSize:12,marginTop:5}]}>{item.Categorias?.nombre}</Text>
          {item.Users && esMio(item) ? 
            <Text style={[styles.significadoText,{fontSize:12,marginTop:5,color:paleta.strong_yellow}]}>{item.Users?.username} (Yo)</Text>:
            <Text style={[styles.significadoText,{fontSize:12,marginTop:5,color:paleta.strong_yellow}]}>{item.Users?.username}</Text> }
          
          
        </View>
        
        <Ionicons name="chevron-forward" size={24} color={paleta.dark_aqua} />
      </View>
    </Pressable>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={paleta.dark_aqua} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
          <Text style={styles.titleCursos}>Diccionario</Text>
          <View style={styles.searchBarRowCursos}>
            <Ionicons name="search" size={22} color="#20bfa9" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInputCursos}
              placeholder="Buscar seña..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#20bfa980"
            />
            <Text style={styles.countTextCursos}>{filteredSenias.length}</Text>
          </View>

        { contexto.user.is_prof && <View style={[styles.searchContainer,{padding:5}]}>
          <Checkbox
            style={styles.checkbox}
            value={mostrarPropios}
            onValueChange={setmostrarPropios}
            color={mostrarPropios ? paleta.yellow : undefined}
          />
          <ThemedText type='defaultSemiBold' lightColor={paleta.dark_aqua}>Mostrar sólo mis videos</ThemedText>
        </View>}

        <FlatList
          data={filteredSenias}
          renderItem={renderSenia}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />

        <SmallPopupModal title={selectedSenia?.significado} modalVisible={modalVisible} setVisible={setModalVisible}>
          {selectedSenia && (
            <>
            <VideoPlayer 
              uri={selectedSenia.video_url}
              style={styles.video}
            />
            <ThemedText style={{margin:10}}>
              <ThemedText type='defaultSemiBold'>Categoría:</ThemedText> {''}
              <ThemedText>{selectedSenia.Categorias.nombre}</ThemedText>
            </ThemedText>   
            </>
          )}
          
          {selectedSenia && selectedSenia.Users && esMio(selectedSenia) ?
          <ThemedText style={{margin:10}}>
            <ThemedText type='defaultSemiBold'>Autor:</ThemedText> {''}
            <ThemedText>{selectedSenia.Users.username} (Yo)</ThemedText> {''}
          </ThemedText>
            :null
          }
          {selectedSenia && selectedSenia.Users && !esMio(selectedSenia) ?
          <ThemedText style={{margin:10}}>
            <ThemedText type='defaultSemiBold'>Autor:</ThemedText> {''}
            <ThemedText>{selectedSenia.Users.username} </ThemedText> {''}
          </ThemedText>
            :null
          }

          {selectedSenia && esMio(selectedSenia) ?
            <>
              <TouchableOpacity style={[styles.iconButton,estilos.shadow]} onPress={()=>{editar_senia(selectedSenia)}}   >  
                <Ionicons name="create" color={paleta.dark_aqua} size={25} style={styles.icon} />
                <ThemedText type="subtitle" lightColor={paleta.dark_aqua} style={{flex:2}}>Editar seña</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.iconButton,estilos.shadow,{backgroundColor:"red"}]} onPress={()=>{eliminar_senia(selectedSenia)}}   >  
                <Ionicons name="trash-bin-outline" color='white' size={25} style={styles.icon} />
                <ThemedText type="subtitle" lightColor='white' style={{flex:2}}>Eliminar seña</ThemedText>
              </TouchableOpacity></> : null
          }

        </SmallPopupModal>
        
      </View>
    
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: paleta.aqua_bck,
  },
  mainView: {
    flex: 1,
    backgroundColor: paleta.aqua_bck,
    paddingTop: 60,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  panelTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: paleta.dark_aqua,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 18,
    color: paleta.dark_aqua,
    fontWeight: '500',
    marginBottom: 18,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: paleta.dark_aqua
    
  },
  checkbox: {
    margin: 8,
    borderRadius:10,
    borderColor: paleta.strong_yellow 
  },
   iconButton: {
    borderRadius: 10,
    height: 50,
    minWidth: "100%",
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: "row",
    width:"100%",
    backgroundColor: "white",
    position: "relative",
    marginTop: 25
  },
  icon:{
    flex:1,
    marginLeft: 25
  },

  container: {
    flex: 1,
    backgroundColor: '#e6f7f2',
    position: 'relative',
    paddingTop: 0,
  },
  titleCursos: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 60,
    marginBottom: 28,
    alignSelf: 'center',
    fontFamily: 'System',
    letterSpacing: 0.5,
    zIndex: 2,
  },
  searchBarRowCursos: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    marginHorizontal: 18,
    marginBottom: 18,
    paddingHorizontal: 18,
    zIndex: 2,
    shadowColor: '#20bfa9',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 2,
    borderColor: '#20bfa9',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInputCursos: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#20bfa9',
    backgroundColor: 'transparent',
    fontWeight: 'bold',
    letterSpacing: 0.2,
    fontFamily: 'System',
  },
  countTextCursos: {
    color: '#20bfa9',
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 8,
    backgroundColor: '#e6f7f2',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    fontFamily: 'System',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 80,
    zIndex: 2,
  },
  listItem: {
    backgroundColor: '#fff',
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderRadius: 32,
    marginBottom: 14,
    shadowColor: '#222',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
  },
  listItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  significadoText: {
    fontSize: 17,
    color: '#222',
    fontWeight: 'bold',
    fontFamily: 'System',
    letterSpacing: 0.2,
  },
  separator: {
    height: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 22,
    minHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#20bfa9',
  },
  closeButton: {
    padding: 8,
  },
  video: {
    width: '100%',
    aspectRatio: 16/9,
    borderRadius: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e6f7f2',
  },
});
