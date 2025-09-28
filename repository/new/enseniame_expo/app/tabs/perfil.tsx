import React, { useState } from 'react';
import { View, StyleSheet, Pressable, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { Ionicons, MaterialIcons  } from '@expo/vector-icons';
import { Link , router} from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { error_alert, success_alert } from '@/components/alert';
import Toast from 'react-native-toast-message';
import { useUserContext } from '@/context/UserContext';
import { validateEmail, validatePassword } from '@/components/validaciones';
import { eliminar_usuario } from '@/conexiones/gestion_usuarios';
import { paleta, paleta_colores } from '@/components/colores';
import { IconTextInput, PasswordInput } from '@/components/inputs';
import { estilos } from '@/components/estilos';
import { Image } from 'expo-image';
import { BotonLogin } from '@/components/botones';

export default function Perfil (){
    const [name,setName]= useState<string>();
    const [mail,setMail]= useState<string>();
    const [pass,setPass]=useState<string>();
    const [institucion,setI]=useState<string>();

    const [mailModalVisible, setMailModalVisible] = useState(false);
    const [nameModalVisible, setNameModalVisible] = useState(false);
    const [PassModalVisible, setPassModalVisible] = useState(false);
    const [instModalVisible, setInstModalVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);

    const [errorEmail, setErrorEmail] = useState('');
    const [errorPassword, setErrorPassword] = useState('');
    const [errorName,setErrorName] = useState('');
    const [errorI, setErrorI] = useState('');

    const [showPassword, setShowPassword] = useState(false);

    const contexto = useUserContext();

    const img = require("../../assets/images/pfp.jpg");

    const eliminar_cuenta = ()=>{
      Alert.alert('Eliminar cuenta', '¿Estás seguro de que querés eliminar la cuenta?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'OK', onPress: () => console.log('OK Pressed')},
    ])
      //eliminar_usuario(contexto.user.id);
      salir();
    }

    const handleEmailChange = (text:any) => {
      setMail(text);
      setErrorEmail(validateEmail(text).msj);
    };

    const handleNameChange = (text:any) => {
        setName(text);
        setErrorName(text ? '' : 'El nombre de usuario no puede estar vacío');
    };

    const handlePasswordChange = (text:any) => {
        setPass(text);
        setErrorPassword(validatePassword(text).msj);
        
    };

    const handleInstitutionChange = (text:any) =>{
      setI(text);
      setErrorI(text ? '' : 'El nombre de la institución no puede estar vacío');
      console.log("escribir algo")
    }

    const salir = ()=>{
      contexto.logout();
      router.dismissTo("/")
      
    }

    const borrar_cambios = ()=>{
        setName(undefined);
        setMail(undefined);
        setPass(undefined);
        setI(undefined);
        setErrorEmail("");
        setErrorPassword("");
        setErrorName("");
        setErrorI("")
    }

    const confirmar = async () => {
        let exito=false;
        if (name!=undefined ) {
            if (name !== '')  {
            contexto.cambiarNombre(name); 
            exito=true;
            }
            else  error_alert("El nombre no puede estar vacío");
        } 
        if (mail!= undefined) {
            const lower_case_mail=mail.toLowerCase();
            if (validateEmail(lower_case_mail).status) {
                contexto.cambiar_mail(lower_case_mail);
                exito=true;
            } else error_alert("Formato inválido de mail");              
        }
        if (pass!=undefined){
            if (validatePassword(pass).status) {
                contexto.cambiar_password(pass);
                exito=true;
            } else error_alert("Contraseña inválida");
        }
        if (institucion!=undefined){
            if (institucion !== '') {
                contexto.cambiar_institucion(institucion);
                setI(undefined);
            } else error_alert("La institución no puede estar vacía");
        }
        
        setTimeout( ()=> contexto.actualizar_info(contexto.user.id),400);
        if (exito) {
            setNameModalVisible(false);
            setMailModalVisible(false);
            setPassModalVisible(false);
            setDeleteModalVisible(false);
            setTimeout(()=>success_alert("Cambios aplicados"),200)
            borrar_cambios();
        }
        
    }

    return(
        <View
      style={[styles.mainView,{backgroundColor:"#ebfbfbff"}]}
    >
       
      <ScrollView contentContainerStyle={[styles.scrollViewContent]}>
        <View style={styles.formAndImg}>

          <Image
            style={[styles.image,{borderColor:paleta.aqua}]}
            source={img}
            contentFit="contain"
            transition={1000}
          />
          
            <View style={{marginTop:25}}>
              <ThemedText type='title'>{contexto.user.username}</ThemedText>
            </View>
         
            <View style={styles.formContainer}>
             <ThemedText type='defaultSemiBold' lightColor='gray' style={{alignSelf:"flex-start", margin:15}}>Actualizar datos</ThemedText>
                <TouchableOpacity onPress={()=>{setNameModalVisible(true)}} style={[styles.infoContainer,estilos.shadow,{borderTopRightRadius:15, borderTopLeftRadius:15,}]}>
                  <ThemedText >Nombre</ThemedText>
                  <View style={{flexDirection:"row"}}>
                    <ThemedText lightColor='gray'>{contexto.user.username}</ThemedText>
                    <MaterialIcons name="keyboard-arrow-right" size={24} color="lightgray" />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={()=>{setMailModalVisible(true)}} style={[styles.infoContainer]}>
                  <ThemedText >Mail</ThemedText>
                  <View style={{flexDirection:"row"}}>
                    <ThemedText lightColor='gray'>{contexto.user.mail}</ThemedText>
                    <MaterialIcons name="keyboard-arrow-right" size={24} color="lightgray" />
                  </View>
                </TouchableOpacity>

                {contexto.user.is_prof ? 
                <TouchableOpacity onPress={()=>{setInstModalVisible(true)}} style={[styles.infoContainer]}>
                  <ThemedText >Institución</ThemedText>
                  <View style={{flexDirection:"row"}}>
                    <ThemedText lightColor='gray'>{contexto.user.institution}</ThemedText>
                    <MaterialIcons name="keyboard-arrow-right" size={24} color="lightgray" />
                  </View>
                </TouchableOpacity> : null
              }

                <TouchableOpacity onPress={()=>{setPassModalVisible(true)}} style={[styles.infoContainer,{borderBottomRightRadius:15, borderBottomLeftRadius:15,borderBottomWidth:0}]}>
                  <ThemedText >Cambiar contraseña</ThemedText>
                    <MaterialIcons name="keyboard-arrow-right" size={24} color="lightgray" />
                </TouchableOpacity>

                <ThemedText type='defaultSemiBold' lightColor='gray' style={{alignSelf:"flex-start", margin:15}}>Cuenta</ThemedText>
                <TouchableOpacity onPress={eliminar_cuenta} style={[styles.infoContainer,estilos.shadow,{borderBottomRightRadius:15, borderBottomLeftRadius:15,borderBottomWidth:0,borderTopRightRadius:15, borderTopLeftRadius:15}]}>
                  <ThemedText >Eliminar cuenta</ThemedText>
                    <MaterialIcons name="keyboard-arrow-right" size={24} color="lightgray" />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.iconButton,estilos.shadow]} onPress={salir}   >  
                  <ThemedText type="subtitle" lightColor='red'>Salir</ThemedText>
                </TouchableOpacity>


            </View>
            
          </View>
        </ScrollView>

        <Modal animationType="slide" 
          transparent={false}
          visible={nameModalVisible}
          onRequestClose={() => {
            setNameModalVisible(!nameModalVisible);
          }}>
            <View style={[styles.mainView,{backgroundColor:paleta.aqua_bck,marginBottom:0}]}>
              <View style={[styles.formAndImg,{justifyContent:"flex-start",marginTop:60}]}>
                <View style={[{flexDirection:"row",justifyContent:"flex-start",width:"100%"}]}>
                  <Pressable onPress={() => {setNameModalVisible(false);borrar_cambios()}}>
                    <MaterialIcons name="keyboard-arrow-left" size={40} color="blue"  />
                  </Pressable>
                  
                  <ThemedText type='title' style={{alignSelf:"center",marginLeft:40}}>Editar nombre</ThemedText>
                </View>

                <ThemedText type='defaultSemiBold' lightColor='gray' style={{alignSelf:"flex-start", marginTop:25,marginHorizontal:15}}>Nombre </ThemedText>
                <IconTextInput 
                    icon={{Ionicon_name: "person-outline"}} 
                    value={name} 
                    bck_color="white"
                    onChange={handleNameChange}
                    keyboardType='default'
                    placeholder={contexto.user.username} />
                  {errorName ? <ThemedText type='error'>{errorName}</ThemedText> : null} 
                  <BotonLogin callback={confirmar} textColor='black' text='Guardar cambios' bckColor={paleta.dark_aqua}/>
              </View>
            </View>
            
        </Modal>

        <Modal animationType="slide" 
          transparent={false}
          visible={mailModalVisible}
          onRequestClose={() => {
            setMailModalVisible(false);
          }}>
            <View style={[styles.mainView,{backgroundColor:paleta.aqua_bck,marginBottom:0}]}>
              <View style={[styles.formAndImg,{justifyContent:"flex-start",marginTop:60}]}>
                <View style={[{flexDirection:"row",justifyContent:"flex-start",width:"100%"}]}>
                  <Pressable onPress={() => {setMailModalVisible(false);borrar_cambios()}}>
                    <MaterialIcons name="keyboard-arrow-left" size={40} color="blue"  />
                  </Pressable>
                  
                  <ThemedText type='title' style={{alignSelf:"center",marginLeft:60}}>Editar mail</ThemedText>
                </View>

                <ThemedText type='defaultSemiBold' lightColor='gray' style={{alignSelf:"flex-start", marginTop:25,marginHorizontal:15}}>Mail </ThemedText>
                <IconTextInput 
                      icon={{Ionicon_name: "mail-outline"}} 
                      value={mail} 
                      bck_color="white"
                      onChange={handleEmailChange}
                      keyboardType='email-address'
                      placeholder={contexto.user.mail}
                    />
                    {errorEmail ? <ThemedText type='error'>{errorEmail}</ThemedText> : null}

                  <BotonLogin callback={confirmar} textColor='black' text='Guardar cambios' bckColor={paleta.dark_aqua}/>
              </View>
            </View>
            
        </Modal>

        <Modal animationType="slide" 
          transparent={false}
          visible={instModalVisible}
          onRequestClose={() => {
            setInstModalVisible(false);
          }}>
            <View style={[styles.mainView,{backgroundColor:paleta.aqua_bck,marginBottom:0}]}>
              <View style={[styles.formAndImg,{justifyContent:"flex-start",marginTop:60}]}>
                <View style={[{flexDirection:"row",justifyContent:"flex-start",width:"100%"}]}>
                  <Pressable onPress={() => {setInstModalVisible(false);;borrar_cambios()}}>
                    <MaterialIcons name="keyboard-arrow-left" size={40} color="blue"  />
                  </Pressable>
                  
                  <ThemedText type='title' style={{alignSelf:"center",marginLeft:30}}>Editar institución</ThemedText>
                </View>

                <ThemedText type='defaultSemiBold' lightColor='gray' style={{alignSelf:"flex-start", marginTop:25,marginHorizontal:15}}>Institución </ThemedText>
                <IconTextInput 
                        icon={{Ionicon_name: "business-outline"}} 
                        value={institucion} 
                        bck_color="white"
                        onChange={handleInstitutionChange}
                        keyboardType='default'
                        placeholder='Institución' />
                  { errorI ? <ThemedText type='error'>{errorI}</ThemedText>:null}

                  <BotonLogin callback={confirmar} textColor='black' text='Guardar cambios' bckColor={paleta.dark_aqua}/>
              </View>
            </View>
            
        </Modal>

        <Modal animationType="slide" 
          transparent={false}
          visible={PassModalVisible}
          onRequestClose={() => {
            setPassModalVisible(false);
          }}>
            <View style={[styles.mainView,{backgroundColor:paleta.aqua_bck,marginBottom:0}]}>
              <View style={[styles.formAndImg,{justifyContent:"flex-start",marginTop:60}]}>
                <View style={[{flexDirection:"row",justifyContent:"flex-start",width:"100%"}]}>
                  <Pressable onPress={() => {setPassModalVisible(false);borrar_cambios()}}>
                    <MaterialIcons name="keyboard-arrow-left" size={40} color="blue"  />
                  </Pressable>
                  
                  <ThemedText type='title' style={{alignSelf:"center",marginLeft:30}}>Editar contraseña</ThemedText>
                </View>

                <ThemedText type='defaultSemiBold' lightColor='gray' style={{alignSelf:"flex-start", marginTop:25,marginHorizontal:15}}>Nueva contraseña </ThemedText>
                <PasswordInput 
                  value={pass}
                  bck_color={paleta.soft_yellow}
                  onChange={handlePasswordChange}
                  showPassword={showPassword}
                  setShowPassword={()=> setShowPassword(!showPassword)}
                  placeholder='Nueva contraseña'
                />
                {errorPassword ? <ThemedText type='error' style={{maxWidth: "80%"}}>{errorPassword}</ThemedText> : null}

                <BotonLogin callback={confirmar} textColor='black' text='Guardar cambios' bckColor={paleta.dark_aqua}/>
              </View>
            </View>
            
        </Modal>
        
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
    marginBottom: 60
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
  
  cancelButton:{
      width:"80%",
      borderWidth: 1, 
      borderColor: '#7209B7',
      backgroundColor: '#fff',
  },
  icon: {
      marginRight: 10,
      marginLeft: 10
  },
  image: {
    flex: 1,
    width: '28%',
    borderRadius: 20,
    borderWidth: 1,
  },
});
