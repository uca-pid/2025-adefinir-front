import { Pressable,  Text,  TextInput,  View,
  StyleSheet,  ScrollView,  AppState, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Image } from 'expo-image';
import { useState } from "react";
import { Link , router} from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { validateEmail, validatePassword } from '@/components/validaciones';
import { error_alert } from '@/components/alert';
import Toast from 'react-native-toast-message';
import {ingresar} from "../conexiones/gestion_usuarios"
import { useUserContext } from '@/context/UserContext';
import { supabase } from '../lib/supabase'
import { Logged_User } from '@/components/types';
import { estilos } from '@/components/estilos';
import { paleta_colores } from '@/components/colores';

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

export default function Login() {
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const {login_app} = useUserContext();

  const img = require("../assets/images/lsa-aqua.png");

  async function login  (){
    const lower_case_mail = mail.toLowerCase();
    const isEmailValid = validateEmail(lower_case_mail).status;
    const isPasswordValid = validatePassword(password).status;
    if (isPasswordValid && isEmailValid) {
      //acceder a db
      const usuario = await ingresar(lower_case_mail,password);
      console.log(usuario)
      if (usuario) login_app(usuario);
      setMail("");
      setPassword("");
      setShowPassword(false);
    } else {
      error_alert("Complete todos los campos para continuar");  
    }
  }
  return (
    <View
      style={styles.mainView}
    >
       <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}
      >
      <ScrollView contentContainerStyle={[styles.scrollViewContent]}>
          <View style={styles.formAndImg}>

            <Image
              style={styles.image}
              source={img}
              contentFit="cover"
              transition={1000}
            />
          
           <View style={{alignSelf:"flex-start"}}>
              <ThemedText type='title'>Ingresa a tu cuenta</ThemedText>

              <View style={{marginVertical:15}}>
                <Link href="/acc_recovery" >
                  <ThemedText lightColor='gray'>¿No tienes un usuario? / </ThemedText> {''}
                  <ThemedText style={{fontSize: 16}} type='defaultSemiBold' >Regístrate aquí</ThemedText>
                </Link>
              </View>
           </View>

            <View style={styles.formContainer}>
              <View style={[styles.inputContainer,paleta_colores.soft_yellow]}>
                <Ionicons name="mail-outline" size={24} color="#666" style={styles.inputIcon} />
                <TextInput
                style={[styles.textInput,paleta_colores.soft_yellow]}
                textContentType="emailAddress"
                keyboardType="email-address"
                onChangeText={setMail}
                value={mail}
                placeholder="Correo electrónico"
                placeholderTextColor="#999"
                />
              </View>
              <View style={[styles.inputContainer,paleta_colores.softgray]}>
                <Ionicons name="lock-closed-outline" size={24} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={[styles.textInput,paleta_colores.softgray]}
                  secureTextEntry={!showPassword}
                  textContentType="password"
                  onChangeText={setPassword}
                  value={password}
                  placeholder="Contraseña"
                  placeholderTextColor="#999"
                />
                <Pressable style={{position: "relative", left: -20}}  onPress={()=> {setShowPassword(!showPassword)}} >
                  <Ionicons
                    name= {showPassword ? "eye-outline" : "eye-off-outline"}
                    size={24}
                    color="#666"
                  />
                </Pressable>
              </View>
              <View style={{marginVertical:15}}>
                <Link href="/acc_recovery" >
                  <ThemedText lightColor='gray'>¿Olvidaste tu contraseña? / </ThemedText> {''}
                  <ThemedText style={{fontSize: 16}} type='defaultSemiBold' >Recuperar</ThemedText>
                </Link>
              </View>

              <TouchableOpacity onPress={login} style={styles.loginButton} >
                <ThemedText type="subtitle" lightColor='black'>Ingresar</ThemedText>
              </TouchableOpacity>

              
            </View>
            
          </View>
        </ScrollView>
        </KeyboardAvoidingView>
      <Toast/>
    </View>
  );
}

const styles = StyleSheet.create({
  mainView:{
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    width: '100%',
    height: '100%',
    backgroundColor: "white"
  },
  textInput:{
    padding:8,
    backgroundColor: "white",
    fontSize:18,
    elevation: 1,
    minWidth: "80%",
    maxHeight: 60,
    minHeight: 40,
    borderRadius: 9,
    flex: 1,
    
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    flex: 1,
    borderColor: "lightgray",
    borderRadius: 9,
    borderWidth: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    
  },
  inputIcon: {
    marginRight: 10,
    marginLeft: 10
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
    marginTop: 15
  },
    
  loginButton: {
    backgroundColor: '#73d3c8ff',
    borderRadius: 10,
    height: 50,
    minWidth: 300,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  image: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0)',
  },
  shadow:{
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
  }
})

