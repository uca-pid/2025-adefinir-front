import { 
  Pressable,
  Text,
  TextInput,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  AppState 
} from 'react-native';
import { useEffect, useState } from "react";
import { Link , router} from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { validateEmail, validatePassword } from '@/components/validaciones';
import { error_alert } from '@/components/alert';
import Toast from 'react-native-toast-message';

import { supabase } from '../lib/supabase'

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

  async function login  (){
    const isEmailValid = validateEmail(mail).status;
    const isPasswordValid = validatePassword(password).status;
    if (isPasswordValid && isEmailValid) {
      //acceder a db
      try {
        const { data: todos, error } = await supabase.from('Users').select('*').eq('mail', mail);

        if (error) {
          console.error('Error:', error.message);
          error_alert("Error de autenticación. Verifique sus credenciales y vuelva a intentar");
          return;
        }
       
        if (todos && todos.length > 0) {
          console.log(todos);
          if (password!= todos[0].hashed_password || mail!= todos[0].mail) {
            error_alert("Usuario o contraseña incorrectos");
            console.log
          } else{
            router.push('/tabs');
          }
        }
        
      } catch (error: any) {
        console.error('Error fetching todos:', error.message);
      }
      
    } else {
      error_alert("Complete todos los campos para continuar");  
    }
  }
  return (
    <View
      style={styles.mainView}
    >
      
        <ScrollView contentContainerStyle={[styles.scrollViewContent]}>
          <View style={styles.formContainer}>
            
            <Text style={styles.title}>Iniciar Sesión</Text>
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

            <Pressable onPress={login} style={styles.loginButton} >
              <ThemedText type="subtitle" lightColor='white'>Ingresar</ThemedText>
              
            </Pressable>
            <View style={{margin:5, alignContent:"center", justifyContent:"center", alignItems:"center"}} >
              <ThemedText style={{fontSize: 16}}>¿No tienes un usuario? </ThemedText>
              <Link href="/signup" >
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
    backgroundColor: "#560bad"},
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
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
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
   title : {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
    textAlign: 'center',
  },
})