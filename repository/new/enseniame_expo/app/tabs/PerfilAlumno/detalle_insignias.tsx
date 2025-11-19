import React, { useCallback, useState } from 'react';
import { View, StyleSheet,   TouchableOpacity, Pressable, ActivityIndicator, FlatList,Text, SectionList } from 'react-native';
import {  Ionicons  } from '@expo/vector-icons';
import {   useFocusEffect } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { error_alert, success_alert } from '@/components/alert';
import Toast from 'react-native-toast-message';
import { useUserContext } from '@/context/UserContext';
import { paleta, paleta_colores } from '@/components/colores';
import { estilos } from '@/components/estilos';
import { Image } from 'expo-image';
import { categorias_insignias, insignias_por_categoria, todas_insignias } from '@/conexiones/insignias';

type Insignia = {
  id: number;
  nombre: string;
  descripcion: string;
  image_url: string;
  motivo:number
}

type Seccion ={
  title: string;
  data: Insignia[][]
}

export default function Detalle_Insignias () {  
  
  const [insignias,setInsignias] = useState<Insignia[]>();
  const [mis_insignias,setMisInsignias] = useState<Insignia[]>();
  const [selected_insignia,setSelectedInsignia]  = useState<Insignia>();
  const [secciones,setSecciones] = useState<Seccion[]>([])
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

            const c = await categorias_insignias();
            if (c && c.length>0 && i){
              let s: Seccion[] =[];
              c.forEach(async each=>{
                const insignias_cate = insignias_por_cate(i,each.id);                         
                s.push({title:each.motivo,data:[insignias_cate]});
              });
              
              setSecciones(s || [])
            }
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
  
  const insignias_por_cate = (i:Insignia[],cate_id:number)=>{
    return i.filter(v=>v.motivo==cate_id)
  }


  const renderInsignia = ({ item }: { item: Insignia }) =>(
      <View style={[styles.dataInsignia,estilos.centrado]}>
        <Image
          style={[styles.insignia]}
          source={item.image_url}
          contentFit="cover"
          transition={0}
        /> 
        <View style={estilos.centrado} >
          <ThemedText style={{fontSize:15}} type='bold'>{item.nombre}</ThemedText>
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

              <SectionList
                sections={secciones}
                keyExtractor={(item, index) => index.toString()}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                renderItem={({item})=>(
                  <FlatList 
                  keyExtractor={(item) => item.id.toString()}
                  style={[{maxHeight: 320,minHeight:200}]}
                  data={item}
                  renderItem={renderInsignia} 
                  horizontal={true} 
                  showsHorizontalScrollIndicator={false}
                />
                )}
                style={styles.section}
                contentContainerStyle={{justifyContent: "flex-start",}}
                renderSectionHeader={({section: {title}}) => (
                  <View style={styles.row}>
                  <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
                  <Pressable style={{marginRight:10}}>
                    <ThemedText style={styles.subtitle}>Ver todas</ThemedText>
                  </Pressable>
                  
                </View>
                )}
                stickySectionHeadersEnabled={false}
                
              />             
              {/* <View style={styles.section}>
                <View style={styles.row}>
                  <ThemedText style={styles.sectionTitle}>Racha</ThemedText>
                  <Pressable style={{marginRight:10}}>
                    <ThemedText style={styles.subtitle}>Ver todas</ThemedText>
                  </Pressable>
                  
                </View>
                
                <FlatList 
                  keyExtractor={(item) => item.id.toString()}
                  style={[{maxHeight: 320,minHeight:200}]}
                  data={insignias}
                  renderItem={renderInsignia} 
                  horizontal={true} 
                />
              </View> */}

             {/*  <View style={styles.section}>                
                <View style={styles.row}>
                  <ThemedText style={styles.sectionTitle}>Señas</ThemedText>
                  <Pressable style={{marginRight:10}}>
                    <ThemedText style={styles.subtitle}>Ver todas</ThemedText>
                  </Pressable>                  
                </View>
                <FlatList 
                  keyExtractor={(item) => item.id.toString()}
                  style={[{maxHeight:220,minHeight:150}]}
                  data={insignias}
                  renderItem={renderInsignia}  
                  horizontal={true}                                                     
                />
              </View> */}

              {/* <View style={styles.section}>                
                <View style={styles.row}>
                  <ThemedText style={styles.sectionTitle}>Módulos</ThemedText>
                  <Pressable style={{marginRight:10}}>
                    <ThemedText style={styles.subtitle}>Ver todas</ThemedText>
                  </Pressable>                  
                </View>
                <FlatList 
                  keyExtractor={(item) => item.id.toString()}
                  style={[{maxHeight:220,minHeight:150}]}
                  data={insignias}
                  renderItem={renderInsignia}  
                  horizontal={true}                                                     
                />
              </View> */}

             {/*  <View style={styles.section}>                
                <View style={styles.row}>
                  <ThemedText style={styles.sectionTitle}>Objetivos</ThemedText>
                  <Pressable style={{marginRight:10}}>
                    <ThemedText style={styles.subtitle}>Ver todas</ThemedText>
                  </Pressable>                  
                </View>
                <FlatList 
                  keyExtractor={(item) => item.id.toString()}
                  style={[{maxHeight:220,minHeight:150}]}
                  data={insignias}
                  renderItem={renderInsignia}  
                  horizontal={true}                                                     
                />
              </View> */}

            
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
    fontSize: 26, 
    fontWeight: 'bold', 
    color: '#222',
    marginVertical: 5,
    marginLeft:12,
    alignSelf: "flex-start"  
  },   
  section:{
    width:"100%",
    marginVertical: 25,
    alignContent: "flex-start",
    
    marginBottom:80
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
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: paleta.dark_aqua,
  },
  dataInsignia:{    
    margin: 10,       
    padding: 7,
    borderRadius: 10
  },
  subtitle : {
    fontSize: 14,
    color: 'gray',    
  },
   row: {
    flexDirection:"row",
    justifyContent: "space-between"
  },
  separator: {
    height: 10,
  },
});
