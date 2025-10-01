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
      senia.Categorias?.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) 
    );
    if (mostrarPropios){
      filtered = filtered.filter(senia =>  esMio(senia))
    }
   
    setFilteredSenias(filtered);
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
    router.push({ pathname: "/tabs/Diccionario/editar_senia", params: { id_senia: senia.id, url: senia.video_url,significado:senia.significado } })
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
          {item.Categorias ? <Text style={[styles.significadoText,{fontSize:12,marginTop:5}]}>{item.Categorias?.nombre}</Text>:null }
          
        </View>
        
        <Ionicons name="chevron-forward" size={24} color="#34a0a4" />
      </View>
    </Pressable>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#34a0a4" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.mainView}>
        <View style={styles.headerContainer}>
          <Text style={styles.panelTitle}>Diccionario LSA</Text>
          <Text style={styles.subtitle}>
            {filteredSenias.length} {filteredSenias.length === 1 ? 'seña' : 'señas'} disponibles
          </Text>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#34a0a4" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar señas o categorías..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#34a0a499"
          />
        </View>

        <View style={[styles.searchContainer,{padding:5}]}>
          <Checkbox
            style={styles.checkbox}
            value={mostrarPropios}
            onValueChange={setmostrarPropios}
            color={mostrarPropios ? paleta.yellow : undefined}
          />
          <ThemedText type='defaultSemiBold' lightColor='#34a0a4'>Mostrar sólo mis videos</ThemedText>
        </View>

        <FlatList
          data={filteredSenias}
          renderItem={renderSenia}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{selectedSenia?.significado}</Text>
                <Pressable 
                  onPress={() => setModalVisible(false)}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={24} color="#014f86" />
                </Pressable>
              </View>
              
              {selectedSenia && (
                <VideoPlayer 
                  uri={selectedSenia.video_url}
                  style={styles.video}
                />
              )}
              {selectedSenia && selectedSenia.Categorias ?
              <ThemedText style={{margin:10}}>
                <ThemedText type='defaultSemiBold'>Categoría:</ThemedText> {''}
                <ThemedText>{selectedSenia.Categorias.nombre}</ThemedText>
              </ThemedText>
                :null
              }
              {selectedSenia && selectedSenia.Users ?
              <ThemedText style={{margin:10}}>
                <ThemedText type='defaultSemiBold'>Autor:</ThemedText> {''}
                <ThemedText>{selectedSenia.Users.username}</ThemedText>
              </ThemedText>
                :null
              }

              {selectedSenia && esMio(selectedSenia) ?
                <>
                  <TouchableOpacity style={[styles.iconButton,estilos.shadow]} onPress={()=>{editar_senia(selectedSenia)}}   >  
                    <Ionicons name="create" color='#34a0a4' size={25} style={styles.icon} />
                    <ThemedText type="subtitle" lightColor='#34a0a4' style={{flex:2}}>Editar seña</ThemedText>
                  </TouchableOpacity>
                 <TouchableOpacity style={[styles.iconButton,estilos.shadow,paleta_colores.yellow]} onPress={()=>{eliminar_senia(selectedSenia)}}   >  
                    <Ionicons name="trash-bin-outline" color='#c91216' size={25} style={styles.icon} />
                    <ThemedText type="subtitle" lightColor='#c91216' style={{flex:2}}>Eliminar seña</ThemedText>
                  </TouchableOpacity></> : null
              }
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
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
    color: "#34a0a4",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 18,
    color: '#34a0a4',
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
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#34a0a4',
    
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  listItem: {
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  listItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  significadoText: {
    fontSize: 16,
    color: '#34a0a4',
    fontWeight: '500',
  },
  separator: {
    height: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#34a0a4',
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
    backgroundColor: '#f3e8ff',
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
  }
});
