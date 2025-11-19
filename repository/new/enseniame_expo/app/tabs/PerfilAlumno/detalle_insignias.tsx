import React, { useCallback, useState } from 'react';
import { View, StyleSheet,   TouchableOpacity, Pressable, ActivityIndicator, FlatList,Text } from 'react-native';
import {  Ionicons  } from '@expo/vector-icons';
import {   useFocusEffect } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { error_alert, success_alert } from '@/components/alert';
import Toast from 'react-native-toast-message';
import { useUserContext } from '@/context/UserContext';
import { paleta, paleta_colores } from '@/components/colores';
import { estilos } from '@/components/estilos';
import { Image } from 'expo-image';
import { mi_racha } from '@/conexiones/racha';
import { todas_insignias } from '@/conexiones/insignias';

type Insignia = {
  id: number;
  nombre: string;
  descripcion: string;
  image_url: string;
}

export default function Detalle_Insignias () {  
  
  const [insignias,setInsignias] = useState<Insignia[]>();
  const [mis_insignias,setMisInsignias] = useState<Insignia[]>();
  const [loading,setLoading] = useState(false);

  const contexto = useUserContext();  

  const candado = require("../../../assets/images/lock.png");

  useFocusEffect(
      useCallback(() => {
        const fetchData = async () => {
          setLoading(true)
          try {
            const i = await todas_insignias();
            setInsignias(i || []);

            setLoading(false)
          } catch (error) {
            console.error(error);
            error_alert("No se pudo cargar la información de las insignias");
          }            
        };
        fetchData();
        return () => {};
      }, [])
    );



  const renderInsignia = ({ item }: { item: Insignia }) =>(
      <View style={styles.dataInsignia}>
        <Image
          style={[styles.insignia]}
          source={item.image_url}
          contentFit="cover"
          transition={0}
        /> 
        <View style={{alignSelf:"center"}}>
          <ThemedText type='bold'>{item.nombre}</ThemedText>
          <ThemedText style={styles.subtitle}>{item.descripcion}</ThemedText>
        </View>
      </View>
    )


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={paleta.dark_aqua} />
      </View>
    );
  }   
    return (
        <View style={styles.mainView}>
            <View style={[styles.header]}>
                <Pressable
                style={[styles.backBtn, { marginBottom: 10,  flexDirection: 'row', alignItems: 'center' }]}
                onPress={() => {   contexto.user.gotToProfile()   }}
                >
                <Ionicons name="arrow-back" size={20} color="#20bfa9" style={{ marginRight: 6 }} />
                <Text style={styles.backBtnText}>Volver</Text>
                </Pressable>

                <ThemedText style={styles.title} type='title'>Mis insignias</ThemedText>
            </View>
            
            <View style={styles.formAndImg}>              
              <View style={styles.section}>
                <ThemedText style={styles.sectionTitle}>Racha</ThemedText>
                <FlatList 
                  keyExtractor={(item) => item.id.toString()}
                  style={[{maxHeight: 320,minHeight:200}]}
                  data={insignias}
                  renderItem={renderInsignia}                                                      
                />
              </View>

              <View style={styles.section}>
                
                <ThemedText lightColor="#005348ff" style={styles.sectionTitle}>Señas</ThemedText>
                <FlatList 
                  keyExtractor={(item) => item.id.toString()}
                  style={[{maxHeight:220,minHeight:150}]}
                  data={mis_insignias}
                  renderItem={renderInsignia}
                                    
                  ListEmptyComponent={() => (
                    <View style={[estilos.centrado, {marginTop: 80}]}>
                    <ThemedText lightColor="#005348ff" style={styles.msg}>¡Felicidades! 🎉</ThemedText>
                    <ThemedText lightColor={paleta.dark_aqua} type='subtitle'>Desbloqueaste todos los avatares</ThemedText>
                    </View>
                    
                  )}
                />
              </View>

            
            </View>

           
        <Toast/>
        </View>
    )
}

const styles = StyleSheet.create({
  mainView:{
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    width: '100%',
    height: '100%',
    marginBottom: 60,
    paddingTop:30 ,
    backgroundColor: paleta.aqua_bck
  },
  header: {
    flexDirection: "row",
    alignContent:"center",
    justifyContent: "flex-start",
    paddingTop: 20,
    width: "100%"
  },
  formAndImg: {
    width: '100%',
    borderRadius: 10,    
    justifyContent: "center",
    alignItems: 'center',
    height: "100%"
  },  
   title : {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 45,
    textAlign: 'center',
    
  },
  sectionTitle : {
    fontSize: 30, 
    fontWeight: 'bold', 
    color: '#222',
    marginVertical: 5,
    marginLeft:12,
    alignSelf: "flex-start"  
  },   
  section:{
    marginTop: 8,
    width:"100%"
  },
  msg : {
    fontSize: 25, 
    fontWeight:"bold", 
    marginBottom: 15  
  },  
  backBtn: {    
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 5,
    marginTop: 5
    //elevation: 2,
  },
  backBtnText: {
    color: '#20bfa9',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e6f7f2',
  },
 
  image: {
    flex: 1,
    width: 100,
    maxWidth: 100,
    height: 100,
    borderRadius: 50,   
  },
  
  insignia: {
    flex: 1,
    width: 60,
    maxWidth: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: paleta.dark_aqua, 
    marginRight: 15   
  },
  dataInsignia:{
    flexDirection:"row",
    marginVertical: 10,
    alignContent:"center",
    backgroundColor: "#f8ffffff",
    padding: 7,
    borderRadius: 10
  },
  subtitle : {
    fontSize: 14,
    color: 'gray',    
  },
});
