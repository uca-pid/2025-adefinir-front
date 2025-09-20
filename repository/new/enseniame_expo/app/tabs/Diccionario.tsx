import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Pressable, 
  SafeAreaView,
  ActivityIndicator,
  Modal,
  TextInput,
  Dimensions
} from 'react-native';
import { supabase } from '../../utils/supabase';
import { Ionicons } from '@expo/vector-icons';
import VideoPlayer from '@/components/VideoPlayer';

interface Senia {
  id: number;
  significado: string;
  video_url: string;
}

export default function Diccionario() {
  const [senias, setSenias] = useState<Senia[]>([]);
  const [filteredSenias, setFilteredSenias] = useState<Senia[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedSenia, setSelectedSenia] = useState<Senia | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      console.log('Tab Diccionario enfocada - Recargando señas...');
      fetchSenias();
      return () => {
      };
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
      console.error('Error fetching señas:', error);
      alert('No se pudieron cargar las señas');
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
        <ActivityIndicator size="large" color="#560bad" />
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
          <Ionicons name="search" size={20} color="#560bad" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar seña..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#560bad80"
          />
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
                  <Ionicons name="close" size={24} color="#560bad" />
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f3e8ff',
  },
  mainView: {
    flex: 1,
    backgroundColor: '#f3e8ff',
    paddingTop: 60,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  panelTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#560bad',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 18,
    color: '#560bad',
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
    color: '#560bad',
  },
  listContent: {
    paddingHorizontal: 16,
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
    color: '#560bad',
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
    color: '#560bad',
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
});
