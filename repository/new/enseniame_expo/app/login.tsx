import { 
  Pressable,
  Text,
  TextInput,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useEffect, useState } from "react";
import { Link , router} from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Login() {
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: '100%',
        height: '100%',
        backgroundColor: "#7209B7"
      }}
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
                secureTextEntry={true}
                textContentType="password"
                onChangeText={setPassword}
                value={password}
                placeholder="Contraseña"
                placeholderTextColor="#999"
              />
              {/* <Pressable onPress={()=> {}} >
                <Ionicons
                  name= "eye-outline" 
                  size={24}
                  color="#666"
                />
              </Pressable> */}
            </View>

            <Pressable onPress={()=>{router.push('/tabs');}} style={styles.loginButton} >
              <Text style={{fontWeight: "bold",color:"white", fontSize: 18,}}>Ingresar</Text>
            </Pressable>
            <View style={{margin:5, alignContent:"center", justifyContent:"center", alignItems:"center"}} >
              <Text style={{fontSize: 16}}>¿No tienes un usuario? </Text>
              <Link href="/signup" >
                <Text style={{fontSize: 16,color:"blue"}}>Regístrate aquí</Text>
              </Link>
            </View>

            <View style={{margin:5, alignContent:"center", justifyContent:"center", alignItems:"center"}}>
              <Link href="/acc_recovery" >
                <Text style={{fontSize: 16,color:"blue"}}>Olvidé mi contraseña</Text>
              </Link>
            </View>
          </View>
        </ScrollView>
      
    </View>
  );
}

const styles = StyleSheet.create({
  textInput:{
        padding:8,
        backgroundColor: "white",
        fontSize:18,
        
        minWidth: "60%",
        maxHeight: 60,
        minHeight: 40,
        borderColor: "#0538cf",
        borderRadius: 5,
        borderWidth: 2,
        flex: 1,
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
  },
   title : {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
    textAlign: 'center',
  },
})