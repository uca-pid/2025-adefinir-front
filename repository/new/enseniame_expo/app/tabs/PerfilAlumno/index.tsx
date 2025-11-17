import React, { useCallback, useState } from 'react';
import { View, StyleSheet,  ScrollView, TouchableOpacity,  Alert, Pressable, ActivityIndicator, FlatList,  } from 'react-native';
import {  Ionicons, MaterialIcons  } from '@expo/vector-icons';
import {  router, useFocusEffect } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { error_alert, success_alert } from '@/components/alert';
import Toast from 'react-native-toast-message';
import { useUserContext } from '@/context/UserContext';
import { paleta, paleta_colores } from '@/components/colores';
import { estilos } from '@/components/estilos';
import { Image } from 'expo-image';
import { BotonLogin } from '@/components/botones';
import { SmallPopupModal } from '@/components/modals';
import { my_avatar, todos_avatares } from '@/conexiones/avatars';

type Avatar = {
  id: number;
  image_url: string;
  racha_desbloquear: number;
}
export default function Perfil (){
    
  const [pfp,setPfp]=useState<string>();
  const [avatares,setAvatares] = useState<Avatar[]>();
  const [loading,setLoading] = useState(false)
    
  const contexto = useUserContext();    

    useFocusEffect(
      useCallback(() => {
        const fetchData = async () => {
          try {
            const p = await my_avatar(contexto.user.id);
            const img = require("../../../assets/images/pfp.jpg");
            
            if (p.Avatar) {setPfp(p.Avatar.image_url)}
            else setPfp(img);

            const a = await todos_avatares();
            setAvatares(a || []);
          } catch (error) {
            console.error(error);
            error_alert("No se pudo cargar tu perfil");
          }            
        };
        fetchData();
        return () => {};
      }, [])
    );

  const renderAvatar = ({ item }: { item: Avatar }) =>(
    <TouchableOpacity>
      <Image
        style={[styles.image,{borderColor:paleta.aqua}]}
        source={item.image_url}
        contentFit="contain"
        transition={0}
      /> 
    </TouchableOpacity>
  )
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={paleta.dark_aqua} />
      </View>
    );
  }   

    return(
        <View style={[styles.mainView,{backgroundColor:"#ebfbfbff"}]}>
          <View style={styles.bck_top}></View>
          
            <View style={styles.dataAndImg}>
              <Image
                style={[styles.image,{borderColor:paleta.aqua}]}
                source={pfp}
                contentFit="contain"
                transition={1000}
              /> 

              <View>
                <ThemedText type='defaultSemiBold'>1500</ThemedText>
                <ThemedText>XP</ThemedText>
              </View>
              
              <View>
                <ThemedText type='defaultSemiBold'>5</ThemedText>
                <ThemedText>días de racha</ThemedText>
              </View>
              
              <View>
                <ThemedText type='defaultSemiBold'>9</ThemedText>
                <ThemedText>módulos completados</ThemedText>
              </View>
            
            </View>      
            <View style={[{marginTop:5}]}>
              <ThemedText type='defaultSemiBold'>{contexto.user.username}</ThemedText>
              <ThemedText>{contexto.user.mail}</ThemedText>
              <Pressable onPress={()=>router.push("/tabs/PerfilAlumno/editar_perfil")}>
                  <Ionicons style={styles.icon} name='pencil' size={22} color={paleta.aqua} />
              </Pressable>                 
            </View>    
            {/*  <FlatList 
                data={avatares}
                renderItem={renderAvatar}
                /> */}

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
  },
  bck_top:{
    width: "100%",
    position: "absolute",
    top: 0,
    left:0,
    backgroundColor: paleta.aqua,
    height: 100
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    minWidth: "80%",
    paddingBottom:60 
  },
  dataAndImg: {
    width: '100%',
    borderRadius: 10,
    padding: 20,
    justifyContent: "space-between",
    alignItems: 'center',
    height: "100%",
    flexDirection:"row"
  },
 
  title : {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
    textAlign: 'center',
  },   
  icon: {
      marginRight: 10,
      marginLeft: 10
  },
  image: {
    flex: 1,
    width: 100,
    height: 100,
    borderRadius: 20,
    borderWidth: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e6f7f2',
  },
});
