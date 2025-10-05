import { View, Text, TouchableOpacity, StyleSheet, FlatList, Pressable, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, router } from "expo-router";
import { Senia,Senia_Info, Modulo } from "@/components/types";
import { BotonLogin } from "@/components/botones";
import { paleta, paleta_colores } from "@/components/colores";
import { ThemedText } from "@/components/ThemedText";
import { estilos } from "@/components/estilos";
import { useUserContext } from "@/context/UserContext";
import { useCallback, useEffect, useState } from "react";
import { Image } from 'expo-image';
import VideoPlayer from "@/components/VideoPlayer";
import { buscar_senias_modulo } from "@/conexiones/modulos";
import { buscarSenias } from "@/conexiones/videos";

export default function Lecciones(){
    const [selectedSenia, setSelectedSenia] = useState<Senia_Info | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalEjemplos,setModalEjemplos] = useState(false);
    const [index,setIndex] = useState(0);
    const [senias,setSenias] = useState<Senia_Info[]>([]);
    const [filteredSenias, setFilteredSenias] = useState<Senia_Info[]>([]);
    const contexto = useUserContext();

    useFocusEffect(
          useCallback(() => {
            
            fetch_senias();
            return () => {};
          }, [])
        );
    useEffect(() => {
        filterSenias();
    }, [ senias, index]);
    const sig = ()=>{
        setIndex(index+1);
    }
    const fetch_senias = async ()=>{
        const s = await  buscarSenias();
        setSenias(s || []);
        setFilteredSenias(s || []);
    }
    const filterSenias = () => {
        var filtered = senias.filter(senia => 
        senia.Categorias?.nombre?.toLowerCase().includes("verbos") 
    );

    if (index==0) filtered=filtered.filter((each,index)=>index<=5);
    if (index==1) filtered=filtered.filter((each,index)=>index>5 && index<=10);
    if (index==2)filtered=filtered.filter((each,index)=>index>10 );
    
   const orderedAndFiltered =filtered.sort(function (a, b) {
      if (a.significado < b.significado) {
        return -1;
      }
      if (a.significado > b.significado) {
        return 1;
      }
      return 0;
    });
    
    setFilteredSenias(orderedAndFiltered);
    
  };
    return (
        <View style={styles.container}>
            <View style={{flexDirection:"row",marginBottom:20}}>
            
                <Pressable 
                onPress={() => contexto.user.gotToModules()}
                style={styles.closeButton}
                >
                    <Ionicons name="close" size={24} color="#014f86" />
                </Pressable>
                <View style={styles.progressBarBgCursos}>
                    <View style={[styles.progressBarFillCursos, { width: `${((index+1) / tarjetas.length) * 100}%` }]} />
                </View>
            </View>

            <Text style={styles.title}>Verbos 1</Text>
            
            <View style={[styles.card,{marginTop:60}]}>
                <Text style={styles.cardTitle}>{tarjetas[index].titulo}</Text>
                <ThemedText style={[styles.cardSubtitle,{fontSize:18}]}>{tarjetas[index].texto}</ThemedText>
                <BotonLogin callback={()=>{setModalEjemplos(true)}} textColor={"white"} bckColor={paleta.strong_yellow} text={"Ver ejemplos"}/>
            </View>

            <BotonLogin callback={sig} textColor="white" bckColor={paleta.dark_aqua} text={index == tarjetas.length -1 ? "Finalizar":"Siguiente"} />
           
            
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
             
              {selectedSenia && selectedSenia.Users  ?
              <ThemedText style={{margin:10}}>
                <ThemedText type='defaultSemiBold'>Autor:</ThemedText> {''}
                <ThemedText>{selectedSenia.Users.username} </ThemedText> {''}
              </ThemedText>
                :null
              }

             
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalEjemplos}
          onRequestClose={() => setModalEjemplos(false)}
        >
          <View style={styles.modalContainer}>
            <View style={[styles.modalContent,{maxHeight:"80%"}]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{tarjetas[index].titulo}</Text>
                <Pressable 
                  onPress={() => setModalEjemplos(false)}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={24} color="#014f86" />
                </Pressable>
              </View>
              
              
            <FlatList 
                data={filteredSenias ? filteredSenias : []}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                    <Text style={styles.cardTitle}>{item.significado}</Text>
                    <Pressable
                        style={styles.button}
                        onPress={() => {
                        setSelectedSenia(item);
                        setModalVisible(true);
                        setModalEjemplos(false);
                        }}
                    >
                        <Text style={styles.buttonText}>Ver seña</Text>
                    </Pressable>
                    </View>
                )}
                />
             
            </View>
          </View>
        </Modal>
        </View>
    )
}
const tarjetas = [{titulo: "Verbos normales", texto: "Los verbos normales son verbos en los que la dirección de la seña siempre permanece igual sin importar quien esté realizando la acción.", senias: []},
    {titulo: "Verbos invertidos",texto:"Los verbos invertidos son verbos en los que la forma negativa del verbo no es simplemente agregar una negación al final de la oración. La configuración de la seña y el movimiento es completamente diferente a la forma positiva del verbo."},
{titulo: "Verbos direccionales" , texto: "Los verbos direccionales son verbos en los que la dirección de la seña cambia dependiendo de quién esté realizando la acción."}]
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e6f7f2",
    padding: 16,
    paddingTop: 100
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#222",
    alignSelf: "flex-start",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#222",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardTitle: {
    color: "#222",
    fontSize: 20,
    fontWeight: "bold",
    margin: 12,
  },
  cardSubtitle: {
    color: "#555",
    fontSize: 15,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#20bfa9",
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  progressBarBgCursos: {
    width: '80%',
    height: 12,
    backgroundColor: '#ffffffff',
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
    closeButton: {
    padding: 8,
    
  },
   image: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0)',
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
