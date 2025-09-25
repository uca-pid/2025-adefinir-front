import { Pressable,  Text,  TextInput,  View,
  StyleSheet,  ScrollView,  AppState, 
  TouchableOpacity
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
      <View style={styles.titleContainer}>
            <ThemedText>
              <ThemedText type='title' lightColor='white'>en</ThemedText>{''}
              <ThemedText type='title' lightColor='#F72585'>seña</ThemedText>{''}
              <ThemedText type='title' lightColor='white'>me</ThemedText>{''}
            </ThemedText>
          </View>
        <ScrollView contentContainerStyle={[styles.scrollViewContent]}>
          <View style={styles.formContainer}>
          
            <Image
        style={styles.image}
        source={img}
        
        contentFit="cover"
        transition={1000}
      />
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={24} color="#666" style={styles.inputIcon} />
              <TextInput
              style={styles.textInput}
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
                style={styles.textInput}
                secureTextEntry={!showPassword}
                textContentType="password"
                onChangeText={setPassword}
                value={password}
                placeholder="Contraseña"
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


            <TouchableOpacity onPress={login} style={styles.loginButton} >
              <ThemedText type="subtitle" lightColor='white'>Ingresar</ThemedText>
            </TouchableOpacity>

            <View style={{margin:5, alignContent:"center", justifyContent:"center", alignItems:"center"}} >
              <ThemedText style={{fontSize: 16}}>¿No tienes un usuario? </ThemedText>
              <Link href="/signup_alumno" >
                <ThemedText style={{fontSize: 16}} type='link' >Regístrate aquí</ThemedText>
              </Link>
            </View>

            <View style={{margin:5, alignContent:"center", justifyContent:"center", alignItems:"center"}}>
              <Link href="/acc_recovery" >
                <ThemedText style={{fontSize: 16}} type='link' >Olvidé mi contraseña</ThemedText>
              </Link>
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
    backgroundColor: "#c7a6edff"
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
      minWidth: "80%"
    },
    formContainer: {
        width: '100%',
        //backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 10,
        padding: 20,
        justifyContent: "center",
        alignItems: 'center',
        height: 500
    },
    loginButton: {
      backgroundColor: '#F72585',
      borderRadius: 10,
      height: 50,
      minWidth: "60%",
      justifyContent: 'center',
      alignItems: 'center',
      margin: 30,
      shadowColor: "#000",
      shadowOpacity: 0.2,
      shadowRadius: 6,
  },
   titleContainer : {
    textAlign: 'center',
    position: "absolute",
    top: 80
  },
  image: {
    flex: 1,
    width: '200%',
    backgroundColor: 'rgba(255, 255, 255, 0)',
  },
})

