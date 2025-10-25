import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TouchableOpacity, FlatList, ActivityIndicator, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { error_alert } from '@/components/alert';
import { paleta, paleta_colores } from '@/components/colores';

import { ThemedText } from '@/components/ThemedText';
import VideoPlayer from '@/components/VideoPlayer';
import { estilos } from '@/components/estilos';
import Toast from 'react-native-toast-message';
import { getRanking } from '@/conexiones/calificaciones';
import { RatingStars } from '@/components/review';

type DatosRanking ={
    id: number;
    username: string;
    promedio: number
}

export default function RankingProfes (){

    const [loading, setLoading] = useState(false);
    const [dataRanking,setDataRanking] = useState<DatosRanking[]>()

    useFocusEffect(
            useCallback(() => {
              fetchRanking();
              return () => {
              };
            }, [])
        );

    const fetchRanking = async () => {
        setLoading(true);
        try {
            const d = await getRanking();
            //ordenar por mayor ranking
            const ordered = d.sort(function(a,b){
                return b.promedio-a.promedio
            })

            setDataRanking(ordered || [])
        } catch (error) {
            error_alert("No se pudo cargar el ranking");
            console.error(error)
        } finally{
            setLoading(false);
        }
    }
    if (loading) {
          return (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={paleta.dark_aqua} />
            </View>
          );
        }
    return (
        <View style={styles.container}>
            <View style={styles.modalHeader}>
                <Text style={styles.title}>Ranking</Text>
            </View>

            <FlatList
                data={dataRanking}
                keyExtractor={item=>item.id.toString()}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                ListEmptyComponent={<ThemedText style={estilos.centrado} lightColor='gray'>No hay datos de ranking disponibles</ThemedText>}
                renderItem={({ item }: { item: DatosRanking }) =>{
                    if (item.promedio==0) return <></>
                    return (
                    
                    <View style={styles.card}>
                         <ThemedText>
                            <ThemedText type='subtitle'>{item.username}:</ThemedText>{' '}
                            <ThemedText type='defaultSemiBold'>{ item.promedio}</ThemedText>
                         </ThemedText>
                         <RatingStars puntaje={item.promedio} color={paleta.strong_yellow}/>
                    </View>
                )}}
            />
            
            <Toast/>
        </View>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6f7f2',
    position: 'relative',
    paddingTop: 0,
  },
  
  
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: paleta.dark_aqua,
    marginTop: 50,
    marginBottom: 40,
    alignSelf: 'center',
    zIndex: 2,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#20bfa9',
    fontWeight: '500',
    marginBottom: 18,
    alignSelf: 'center',
    zIndex: 2,
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
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e6f7f2',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  separator: {
    height: 10,
  },
});