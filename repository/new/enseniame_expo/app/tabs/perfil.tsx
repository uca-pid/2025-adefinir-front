import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons  } from '@expo/vector-icons';
import { Link , router, useFocusEffect} from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { error_alert, success_alert } from '@/components/alert';
import Toast from 'react-native-toast-message';
import { useUserContext } from '@/context/UserContext';
import { validateEmail, validatePassword } from '@/components/validaciones';
import { eliminar_usuario } from '@/conexiones/gestion_usuarios';
import { paleta, paleta_colores } from '@/components/colores';
import { IconTextInput, PasswordInput } from '@/components/inputs';
import { BotonLogin } from '@/components/botones';
import { estilos } from '@/components/estilos';

export default function Perfil (){
    const [name,setName]= useState<string>();
    const [mail,setMail]= useState<string>();
    const [pass,setPass]=useState<string>();
    const [institucion,setI]=useState<string>();

    const [errorEmail, setErrorEmail] = useState('');
    const [errorPassword, setErrorPassword] = useState('');
    const [errorName,setErrorName] = useState('');
    const [errorI, setErrorI] = useState('');

    const [showPassword, setShowPassword] = useState(false);

    const contexto = useUserContext();

    const eliminar_cuenta = ()=>{
      eliminar_usuario(contexto.user.id);
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
            setTimeout(()=>success_alert("Cambios aplicados"),200)
            borrar_cambios();
        }
        
    }

    return(
        <View style={[styles.safeArea,paleta_colores.softgray]}>
            <View style={[styles.mainView,paleta_colores.softgray]}>
            <ScrollView contentContainerStyle={[styles.scrollViewContent]}>
              <View style={styles.headerContainer}>
                <ThemedText type='error'> implementar foto perfil</ThemedText>
                <ThemedText type='title'>{contexto.user.username}</ThemedText>
              </View>
              <View style={[styles.formContainer]}>

                <TouchableOpacity style={[styles.infoContainer,estilos.shadow,{borderTopRightRadius:15, borderTopLeftRadius:15,}]}>
                  <ThemedText >Nombre</ThemedText>
                  <View style={{flexDirection:"row"}}>
                    <ThemedText lightColor='gray'>{contexto.user.username}</ThemedText>
                    <MaterialIcons name="keyboard-arrow-right" size={24} color="lightgray" />
                  </View>
                  
                </TouchableOpacity>

                <TouchableOpacity style={[styles.infoContainer]}>
                  <ThemedText >Mail</ThemedText>
                  <View style={{flexDirection:"row"}}>
                    <ThemedText lightColor='gray'>{contexto.user.mail}</ThemedText>
                    <MaterialIcons name="keyboard-arrow-right" size={24} color="lightgray" />
                  </View>
                  
                </TouchableOpacity>

                <TouchableOpacity style={[styles.infoContainer,{borderBottomRightRadius:15, borderBottomLeftRadius:15,borderBottomWidth:0}]}>
                  <ThemedText >Cambiar contraseña</ThemedText>
                    <MaterialIcons name="keyboard-arrow-right" size={24} color="lightgray" />
                  
                </TouchableOpacity>

                   {/*  
                    <IconTextInput 
                      icon={{Ionicon_name: "mail-outline"}} 
                      value={mail} 
                      bck_color={paleta.softgray}
                      onChange={handleEmailChange}
                      keyboardType='email-address'
                      placeholder={contexto.user.mail}
                    />
                    {errorEmail ? <ThemedText type='error'>{errorEmail}</ThemedText> : null}
 */}
                   
                  {/*   <IconTextInput 
                      icon={{Ionicon_name: "person-outline"}} 
                      value={name} 
                      bck_color={paleta.softgray}
                      onChange={handleNameChange}
                      keyboardType='default'
                      placeholder={contexto.user.username} />
                    {errorName ? <ThemedText type='error'>{errorName}</ThemedText> : null} */}
{/* 
                    <PasswordInput 
                      value={pass}
                      bck_color={paleta.soft_yellow}
                      onChange={handlePasswordChange}
                      showPassword={showPassword}
                      setShowPassword={()=> setShowPassword(!showPassword)}
                      placeholder='Nueva contraseña'
                    />
                    {errorPassword ? <ThemedText type='error' style={{maxWidth: "80%"}}>{errorPassword}</ThemedText> : null} */}

                  {/*   {contexto.user.is_prof ? 
                     <IconTextInput 
                        icon={{Ionicon_name: "business-outline"}} 
                        value={institucion} 
                        bck_color={paleta.softgray}
                        onChange={handleInstitutionChange}
                        keyboardType='default'
                        placeholder='Institución' />:null}
                    {contexto.user.is_prof && errorI ? <ThemedText type='error'>{errorI}</ThemedText> : null}

                    <BotonLogin 
                      callback={confirmar}
                      textColor='black'
                      bckColor={paleta.dark_aqua}
                      text='Guardar cambios'
                    /> */}

                   {/*  <BotonLogin 
                      callback={borrar_cambios}
                      textColor='black'
                      bckColor={paleta.yellow}
                      text='Cancelar'
                    /> */}

                    <TouchableOpacity style={[styles.iconButton]} onPress={salir}   >  
                      <ThemedText type="subtitle" lightColor='red'>Salir</ThemedText>
                    </TouchableOpacity>

{/* 
                    <TouchableOpacity style={[styles.loginButton,{backgroundColor:"red"}]} onPress={eliminar_cuenta}   >
                        <ThemedText type="subtitle" lightColor='white'>Eliminar cuenta</ThemedText>
                    </TouchableOpacity> */}

                </View>
            </ScrollView>
            </View>
            <Toast/>
        </View>
    )
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  mainView: {
    flex: 1,
    
    justifyContent: 'flex-start',
    alignItems: 'center',
    
  },
  headerContainer: {
    margin: 24,
    alignItems: 'center',
  },

  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    minWidth: "80%",
    marginBottom: 50
  },
  formContainer: {
      width: '100%',
      borderRadius: 10,
      padding: 20,
      justifyContent: "center",
      alignItems: 'center',
      height: 600
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
});
