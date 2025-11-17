import React, { useCallback, useState } from 'react';
import { View, StyleSheet,   TouchableOpacity, Pressable, ActivityIndicator, FlatList,Text } from 'react-native';
import {  Ionicons  } from '@expo/vector-icons';
import {  router, useFocusEffect } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { error_alert, success_alert } from '@/components/alert';
import Toast from 'react-native-toast-message';
import { useUserContext } from '@/context/UserContext';
import { paleta, paleta_colores } from '@/components/colores';
import { estilos } from '@/components/estilos';
import { Image } from 'expo-image';
import { cambiar_mi_avatar, my_avatar, todos_avatares } from '@/conexiones/avatars';
import { mi_racha } from '@/conexiones/racha';

type Avatar = {
  id: number;
  image_url: string;
  racha_desbloquear: number;
}
export default function Perfil () {
  const [racha_maxima,setRacha] =useState(0)
  const [pfp,setPfp]=useState<Avatar>();
  const [avatares,setAvatares] = useState<Avatar[]>();
  const [loading,setLoading] = useState(false);

  const contexto = useUserContext();  

  const candado = require("../../../assets/images/lock.png");

  useFocusEffect(
      useCallback(() => {
        const fetchData = async () => {
          setLoading(true)
          try {
            const p = await my_avatar(contexto.user.id);
            const img = require("../../../assets/images/pfp.jpg");
            
            if (p.Avatar) {setPfp(p.Avatar)}
            else setPfp({image_url:img,id:1,racha_desbloquear:1});

            const a = await todos_avatares();                                              
            setAvatares(a || []);                         

            const r = await mi_racha(contexto.user.id);
            setRacha(r.racha_maxima);

            setLoading(false)
          } catch (error) {
            console.error(error);
            error_alert("No se pudo cargar tu perfil");
          }            
        };
        fetchData();
        return () => {};
      }, [])
    );


  const cambiar_avatar = async (a:Avatar) => {
      try {
        await cambiar_mi_avatar(contexto.user.id,a.id);
        setPfp(a)
        success_alert("¡Tu avatar fue cambiado con éxito!")
      } catch (error) {
        console.error(error);
        error_alert("No se pudo cambiar tu avatar");
      }
    }
  
  const renderAvatar = ({ item }: { item: Avatar }) =>{
    if (fue_desbloqueado(item)) {
      return  (
    <TouchableOpacity 
      onPress={()=>cambiar_avatar(item)}
      style={[{margin:10},item.id==pfp?.id ? styles.round_border:{}]}>
      <Image
        style={[styles.image]}
        source={item.image_url}
        contentFit="contain"
        transition={0}
      /> 
    </TouchableOpacity>
  )
    } else {
      return (
        <View style={[{margin:10}]}>
          <Image
            style={[styles.image]}
            source={candado}
            contentFit="contain"
            transition={0}
          /> 
        </View>
      )
    }
   }

  const fue_desbloqueado = (av:Avatar)=>{
    
    return av.racha_desbloquear<=racha_maxima
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={paleta.dark_aqua} />
      </View>
    );
  }   
    return (
        <View style={styles.mainView}>
            <Pressable
                style={[styles.backBtn, { marginBottom: 10, marginTop:30, flexDirection: 'row', alignItems: 'center' }]}
                onPress={() => {   contexto.user.gotToProfile()   }}
            >
            <Ionicons name="arrow-back" size={20} color="#20bfa9" style={{ marginRight: 6 }} />
            <Text style={styles.backBtnText}>Volver</Text>
            </Pressable>

            <ThemedText style={styles.title} type='title'>Mis avatares</ThemedText>

            <View style={styles.formAndImg}>
              <Image
                style={[styles.pfp,{borderColor:paleta.aqua}]}
                source={pfp?.image_url}
                contentFit="contain"
                transition={1000}
              />

            <FlatList 
              keyExtractor={(item) => item.id.toString()}
              style={[{maxHeight:500}]}
              data={avatares}
              renderItem={renderAvatar}
              numColumns={3}
              columnWrapperStyle={{marginHorizontal:10}}
            />
            </View>

           
        <Toast/>
        </View>
    )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
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
  headerContainer: {
    flex:1,
    margin: 70,
    alignItems: 'center',
  },

  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    minWidth: "80%",
    paddingBottom:60 
  },
  formAndImg: {
    width: '100%',
    borderRadius: 10,
    padding: 20,
    justifyContent: "center",
    alignItems: 'center',
    height: "100%"
  },
  formContainer: {
    width: "100%",
    zIndex: 999,
    marginBottom: 20,
    marginTop: 15,
    flex: 1
  },
  infoContainer: {
    flexDirection: "row",
    backgroundColor:"white",
    justifyContent: "space-between",
    width:"100%",
    height: 50,
    alignContent:"center",
    alignItems:"center",
    borderBottomColor:"lightgray",
    borderBottomWidth:1,
    padding: 10
  },
  iconButton: {
    borderRadius: 10,
    height: 50,
    minWidth: "100%",
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
    width:"100%",
    backgroundColor: "white"
  },
   title : {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
    textAlign: 'center',
  },
  
  backBtn: {
    padding: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
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
  round_border:{
    borderColor:paleta.aqua,
    borderWidth:2,
    borderRadius: 40,
    backgroundColor:paleta.turquesa
  },
  image: {
    flex: 1,
    width: 100,
    maxWidth: 100,
    height: 100,
    borderRadius: 50,   
  },
  pfp: {
    flex: 1,
    width: 100,
    maxHeight:100,
    height: 100,
    borderRadius: 20,
    borderWidth: 1,
  },
});
