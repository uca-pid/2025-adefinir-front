import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link , router} from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { error_alert, success_alert } from '@/components/alert';
import Toast from 'react-native-toast-message';
import { useUserContext } from '@/context/UserContext';
import { validateEmail, validatePassword } from '@/components/validaciones';

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
    }

    const borrar_cambios = ()=>{
        setName(undefined);
        setMail(undefined);
        setPass(undefined);
        setI(undefined)
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
            } else error_alert("La institución no puede estar vacía");
        }

        setTimeout( ()=> contexto.actualizar_info(contexto.user.id),200);
        if (exito) {
            setTimeout(()=>success_alert("Cambios aplicados"),200)
            borrar_cambios();
        }
        
    }

    return(
        <View style={styles.safeArea}>
            <View style={styles.mainView}>
            <ScrollView contentContainerStyle={[styles.scrollViewContent]}>
                <View style={styles.formContainer}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.panelTitle}>Perfil </Text>
                    </View>
                    <View style={styles.inputContainer}>
                        <Ionicons name="mail-outline" size={24} color="#666" style={styles.inputIcon} />
                        <TextInput
                            style={styles.textInput}
                            textContentType="emailAddress"
                            keyboardType="email-address"
                            onChangeText={handleEmailChange}
                            value={mail}
                            placeholder={contexto.user.mail}
                            placeholderTextColor="#999"
                        />
                    </View>
                    {errorEmail ? <ThemedText type='error'>{errorEmail}</ThemedText> : null}

                    <View style={styles.inputContainer}>
                        <Ionicons name="person-outline" size={24} color="#666" style={styles.inputIcon} />
                        <TextInput
                            style={styles.textInput}
                            onChangeText={handleNameChange}
                            value={name}
                            placeholder={contexto.user.username}
                            placeholderTextColor="#999"
                        />
                    </View>
                    {errorName ? <ThemedText type='error'>{errorName}</ThemedText> : null}

                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={24} color="#666" style={styles.inputIcon} />
                        <TextInput
                            style={styles.textInput}
                            value={pass}
                            onChangeText={ handlePasswordChange}
                            placeholder="Nueva contraseña"
                            placeholderTextColor="#999"
                            secureTextEntry={!showPassword}
                        />
                        <Pressable onPress={() => setShowPassword(!showPassword)}>
                            <Ionicons
                            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                            size={24}
                            color="#666"
                            />
                        </Pressable>
                    </View>
                    {errorPassword ? <ThemedText type='error' style={{maxWidth: "80%"}}>{errorPassword}</ThemedText> : null}

                    {contexto.user.is_prof ? 
                    <View style={styles.inputContainer}>
                        <Ionicons name="business-outline" size={24} color="#666" style={styles.inputIcon} />
                        <TextInput
                            style={styles.textInput}
                            onChangeText={handleInstitutionChange}
                            value={institucion}
                            placeholder="Institución"
                            placeholderTextColor="#999"
                        />
                    </View>:null}
                    {contexto.user.is_prof && errorI ? <ThemedText type='error'>{errorI}</ThemedText> : null}

                    <TouchableOpacity onPress={confirmar} style={styles.loginButton} >
                        <ThemedText type="subtitle" lightColor='white'>Guardar cambios</ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.loginButton,styles.cancelButton]} onPress={borrar_cambios}   >
                        <ThemedText type="subtitle" lightColor='#7209B7'>Cancelar</ThemedText>
                    </TouchableOpacity>

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
    backgroundColor: '#f3e8ff', // violeta claro
  },
  mainView: {
    flex: 1,
    backgroundColor: '#f3e8ff',
    justifyContent: 'flex-start',
    alignItems: 'center',
    
  },
  headerContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  panelTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#560bad',
    marginBottom: 4,
  },
  teacherName: {
    fontSize: 18,
    color: '#560bad',
    fontWeight: '500',
    marginBottom: 18,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F72585',
    borderRadius: 14,
    height: 60,
    marginBottom: 28,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    paddingHorizontal: 24,
  },
  ctaIcon: {
    marginRight: 10,
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 22,
    width: '100%',
    paddingHorizontal: 16,
  },
  quickActionCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingVertical: 20,
    marginHorizontal: 6,
  },
  quickActionText: {
    color: '#560bad',
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 6,
    textAlign: 'center',
  },
  // summaryCard y summaryText eliminados
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: '#560bad',
    paddingVertical: 12,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 10,
    zIndex: 1,
  },
  fabPlaceholder: {
    width: 80,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  navText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  fabButton: {
    position: 'absolute',
    left: '50%',
    bottom: 1,
    transform: [{ translateX: -32 }, { translateY: -32 }],
    backgroundColor: '#7209B7',
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 4,
    borderColor: '#f3e8ff',
    zIndex: 2,
  },

  inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 15
    },
    inputIcon: {
      marginRight: 10,
    },
     scrollViewContent: {
      flexGrow: 1,
      justifyContent: 'center',
      minWidth: "80%",
      marginBottom: 50
    },
    formContainer: {
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 10,
        padding: 20,
        justifyContent: "center",
        alignItems: 'center',
        height: 500
    },
   loginButton: {
      backgroundColor: '#B5179E',
      borderRadius: 10,
      height: 50,
      minWidth: "60%",
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 25,
      marginHorizontal: 30,
      width:"80%",
  },
   title : {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
    textAlign: 'center',
  },
  textInput:{
        padding:8,
        backgroundColor: "white",
        fontSize:18,
        elevation: 1,
        zIndex: 1,
        minWidth: "60%",
        maxHeight: 60,
        minHeight: 40,
        borderColor: "#0538cf",
        borderRadius: 5,
        borderWidth: 2,
        flex: 1,
        position: "relative"
    },
    cancelButton:{
        width:"80%",
        borderWidth: 1, 
        borderColor: '#7209B7',
        backgroundColor: '#fff',
    }
});
