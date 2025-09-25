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

  const img = require("../assets/images/lsa-lila.png");

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
      
      <View style={[styles.titleContainer,estilos.centrado]}>
            <ThemedText>
              <ThemedText type='title' lightColor='white' >En</ThemedText>{''}
              <ThemedText type='title' lightColor='#F72585'>seña</ThemedText>{''}
              <ThemedText type='title' lightColor='white'>me</ThemedText>{''}
            </ThemedText>
          </View>
      <ScrollView contentContainerStyle={[styles.scrollViewContent]}>
          <View style={styles.formAndImg}>
          
            <Image
              style={styles.image}
              source={img}
              contentFit="cover"
              transition={1000}
            />

            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={24} color="#666" style={styles.inputIcon} />
                <TextInput
                style={[styles.textInput,styles.shadow]}
                textContentType="emailAddress"
                keyboardType="email-address"
                onChangeText={setMail}
                value={mail}
                placeholder="Correo electrónico"
                placeholderTextColor="#999"
                />
              </View>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={24} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={[styles.textInput,styles.shadow]}
                  secureTextEntry={!showPassword}
                  textContentType="password"
                  onChangeText={setPassword}
                  value={password}
                  placeholder="            Contraseña"
                  placeholderTextColor="#999"
                />
                <Pressable style={{zIndex:999,position:"relative"}} onPress={()=> {setShowPassword(!showPassword)}} >
                  <Ionicons
                    name= {showPassword ? "eye-outline" : "eye-off-outline"}
                    size={24}
                    color="#666"
                  />
                </Pressable>
              </View>
              <View style={{margin:5, alignContent:"center", justifyContent:"center", alignItems:"center"}}>
                <Link href="/acc_recovery" >
                  <ThemedText style={{fontSize: 16}} type='link' >Olvidé mi contraseña</ThemedText>
                </Link>
              </View>

              <TouchableOpacity onPress={login} style={styles.loginButton} >
                <ThemedText type="subtitle" lightColor='white'>Ingresar</ThemedText>
              </TouchableOpacity>

              <ThemedText lightColor='gray' style={estilos.centrado}>--o--</ThemedText>

              <View style={estilos.centrado} >
                <ThemedText style={{fontSize: 16}}>¿No tienes un usuario? </ThemedText>
                <Link href="/signup_alumno" asChild>
                  <TouchableOpacity style={styles.loginButton} >
                    <ThemedText type="subtitle" lightColor='white'>Regístrate aquí</ThemedText>
                  </TouchableOpacity>
                </Link>
              </View>

              
            </View>
            
          </View>
        </ScrollView>
        
      <Toast/>
    </View>
  );
}

const styles = StyleSheet.create({
  mainView:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: '100%',
    height: '100%',
    backgroundColor: "#e5b3fe"
  },
  textInput:{
    padding:8,
    backgroundColor: "white",
    fontSize:18,
    elevation: 1,
    zIndex: -1,
    minWidth: "80%",
    maxHeight: 60,
    minHeight: 40,
    borderColor: "lightgray",
    borderRadius: 5,
    borderWidth: 1,
    flex: 1,
    position: "relative",
    left: 0,
    right: 0
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15
  },
  inputIcon: {
    marginRight: 10,
    zIndex: 999,
    position: "relative",
    left: 0,
    right: 0
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
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
    position: "relative",
    top: -80,
    width: "100%",
    zIndex: 999,
    marginBottom: 20
  },
    
  loginButton: {
    backgroundColor: '#560BAD',
    borderRadius: 10,
    height: 50,
    minWidth: 300,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  titleContainer : {
    textAlign: 'center',
    position: "absolute",
    top: 80,
    flex: 1
  },
  image: {
    flex: 1,
    width: '300%',
    backgroundColor: 'rgba(255, 255, 255, 0)',
  },
  shadow:{
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
  }
})

