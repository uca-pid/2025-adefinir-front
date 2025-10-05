import { View, Text, TouchableOpacity, StyleSheet, FlatList, Pressable, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, router } from "expo-router";
import { Senia,Senia_Info, Modulo } from "@/components/types";
import { BotonLogin } from "@/components/botones";
import { paleta, paleta_colores } from "@/components/colores";
import { ThemedText } from "@/components/ThemedText";
import { estilos } from "@/components/estilos";
import { useUserContext } from "@/context/UserContext";
import { useState } from "react";
import { Image } from 'expo-image';

export default function Lecciones () {
    const [index,setIndex] = useState(0);
    const [modalVisible, setModalVisible] = useState(false);
    const contexto = useUserContext();

    const img = require("../../../assets/images/applause.gif");

    const sig = ()=>{
        setIndex(index+1);
        if (index+1 == tarjetas.length) {
            setModalVisible(true);
            
        }
    }

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
                    <View style={[styles.progressBarFillCursos, { width: `${(index / tarjetas.length) * 100}%` }]} />
                </View>
            </View>
            
            <Text style={styles.title}>Introducción a la LSA</Text>

            <View style={[styles.card,{marginTop:10}]}>
                <Text style={styles.cardTitle}>{titulos[index]}</Text>
                {tarjetas[index]}
                <BotonLogin callback={sig} textColor="white" bckColor={paleta.dark_aqua} text={index == tarjetas.length -1 ? "Finalizar":"Siguiente"} />
            </View> 
            

            
            <Modal animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)} >
                <View style={styles.container}>
                    <Text style={[styles.title,estilos.centrado,{color:paleta.dark_aqua,marginTop:50}]}>¡Lección completada!</Text>
                    <Image
                        style={styles.image}
                        source={img}
                        contentFit="contain"
                        transition={1000}
                    />
                    <BotonLogin callback={()=>{}} textColor={"white"} bckColor={paleta.strong_yellow} text={"Continuar"} />
                </View>
            </Modal>
        </View>
    )
}

const tarjetas = [(<ThemedText>
                    <ThemedText>La</ThemedText> {''}
                    <ThemedText type="defaultSemiBold">Lengua de Señas Argentina</ThemedText> {'o'}
                    <ThemedText type="defaultSemiBold"> LSA </ThemedText> {'es la lengua de las'}
                    <ThemedText type="defaultSemiBold"> personas sordas </ThemedText> {'que conforman la'}
                    <ThemedText type="defaultSemiBold"> Comunidad Sorda Argentina</ThemedText>{'.'}
                    <ThemedText> Es una lengua natural, con una estructura gramatical diferente a la del español. Esto significa que la</ThemedText>{''} 
                    <ThemedText type="defaultSemiBold"> LSA </ThemedText>{'y el'}
                    <ThemedText type="defaultSemiBold"> español </ThemedText> {'son dos lenguas distintas.'}
                </ThemedText>),
                (<ThemedText>
                    <ThemedText>Lo correcto es decir</ThemedText> {''}
                    <ThemedText type="defaultSemiBold">lengua de señas</ThemedText>{', no '}
                    <ThemedText type="defaultSemiBold">lenguaje de señas</ThemedText>{'.'}
                    <ThemedText > Una "lengua" es un idioma completo y natural, con su propia gramática y estructura. En cambio, "lenguaje" es un concepto más amplio que designa la capacidad humana de comunicarse mediante sistemas simbólicos, incluyendo tanto las lenguas orales como las de señas. </ThemedText> 
                    
                </ThemedText>),
                (<ThemedText style={{fontSize:18,paddingVertical:5}}>
                    <ThemedText style={{fontSize:18}}>Un mito común de las</ThemedText> {''}
                    <ThemedText style={{fontSize:18}} type="defaultSemiBold">lenguas de señas</ThemedText> {'es que son universales. Al igual que todos los idiomas, las'}
                    <ThemedText style={{fontSize:18}} type="defaultSemiBold"> lenguas de señas</ThemedText>{' fueron formadas y se siguen formando dentro de cada comunidad de sordos de todo el mundo.'}
                    <ThemedText style={{fontSize:18}} > Por lo tanto, existe una </ThemedText>{''}
                    <ThemedText style={{fontSize:18}} type="defaultSemiBold">Lengua de Señas Argentina</ThemedText>{', una '}
                    <ThemedText style={{fontSize:18}} type="defaultSemiBold">Lengua de Señas Americana</ThemedText>{', una '}
                    <ThemedText style={{fontSize:18}} type="defaultSemiBold">Lengua de Señas Chilena</ThemedText>{', etc.'}
                    
                </ThemedText>)];
const titulos = ["¿Qué es la LSA?","¿Lengua o lenguaje?","¿Por qué 'Argentina'?"]                
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
});
