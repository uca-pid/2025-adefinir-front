import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator, Modal, TextInput } from 'react-native';
import { supabase } from '../../utils/supabase';
import { Ionicons } from '@expo/vector-icons';
import VideoPlayer from '@/components/VideoPlayer';
import { Senia } from '@/components/types';
import { error_alert } from '@/components/alert';

export default function Diccionario() {
  const [senias, setSenias] = useState<Senia[]>([]);
  const [filteredSenias, setFilteredSenias] = useState<Senia[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedSenia, setSelectedSenia] = useState<Senia | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchSenias();
      return () => {};
    }, [])
  );

  useEffect(() => {
    filterSenias();
  }, [searchQuery, senias]);

  const fetchSenias = async () => {
    try {
      const { data, error } = await supabase
        .from('Senias')
        .select('*')
        .order('significado', { ascending: true });

      if (error) throw error;
      setSenias(data || []);
      setFilteredSenias(data || []);
    } catch (error) {
      error_alert('No se pudieron cargar las señas');
    } finally {
      setLoading(false);
    }
  };

  const filterSenias = () => {
    const filtered = senias.filter(senia => 
      senia.significado.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredSenias(filtered);
  };

  const renderSenia = ({ item }: { item: Senia }) => (
    <Pressable 
      style={styles.listItem}
      onPress={() => {
        setSelectedSenia(item);
        setModalVisible(true);
      }}
    >
      <View style={styles.listItemContent}>
        <Text style={styles.significadoText}>{item.significado}</Text>
        <Ionicons name="chevron-forward" size={24} color="#560bad" />
      </View>
    </Pressable>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#20bfa9" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
  {/* Barra de diseño eliminada */}
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
                <Ionicons name="close" size={24} color="#20bfa9" />
              </Pressable>
            </View>
            {selectedSenia && (
              <VideoPlayer 
                uri={selectedSenia.video_url}
                style={styles.video}
              />
            )}
          </View>
        </View>
      </Modal>
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
  titleCursos: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 48,
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
    backgroundColor: '#20bfa9',
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderRadius: 28,
    marginBottom: 10,
    shadowColor: '#20bfa9',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 2,
    borderColor: '#17897a',
  },
  listItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  significadoText: {
    fontSize: 17,
    color: '#fff',
    fontWeight: '700',
    textShadowColor: '#17897a',
    textShadowOffset: {width:0, height:1},
    textShadowRadius: 2,
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

