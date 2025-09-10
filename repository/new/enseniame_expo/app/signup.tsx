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
import { Link, router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';

export default function Signup() {
  const [mail, setMail] = useState('');
  const [name, setName] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');

  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  return (
    <View style={styles.mainView} >
      <ScrollView contentContainerStyle={[styles.scrollViewContent]}>
          <View style={styles.formContainer}>
      
        <ThemedText type="title" style={{margin:40}}>Crear cuenta</ThemedText>
      
      
      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={24} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          onChangeText={setName}
          value={name}
          placeholder="Nombre"
          placeholderTextColor="#999"
        />
      </View>

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
          secureTextEntry={!showPassword1}
          textContentType="newPassword"
          onChangeText={setPassword1}
          value={password1}
          placeholder="Contraseña"
          placeholderTextColor="#999"
        />
        <Pressable onPress={()=> setShowPassword1(!showPassword1)} >
          <Ionicons
            name={showPassword1 ? "eye-outline" : "eye-off-outline"}
            size={24}
            color="#666"
          />
        </Pressable>
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={24} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          secureTextEntry={!showPassword2}
          textContentType="newPassword"
          onChangeText={setPassword2}
          value={password2}
          placeholder="Confirmar contraseña"
          placeholderTextColor="#999"
        />
        <Pressable onPress={()=> setShowPassword2(!showPassword2)} >
          <Ionicons
            name={showPassword2 ? "eye-outline" : "eye-off-outline"}
            size={24}
            color="#666"
          />
        </Pressable>
      </View>

      <Pressable onPress={()=>{router.replace('/tabs');}} style={styles.loginButton} >
          <Text style={{fontWeight: "bold",color:"white"}}>Registrarse</Text>
      </Pressable>
      <View >
        <Text >¿Ya tienes un usuario? </Text>
        <Link href="/login" >
          <Text style={{color:"blue"}}>Inicia sesión aquí</Text>
        </Link>
      </View>
      </View>
      </ScrollView>
    </View>
  );
}

const styles=StyleSheet.create({
  mainView:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: '100%',
    height: '100%',
    backgroundColor: "#3A0CA3"
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
      backgroundColor: '#4CC9F0',
      borderRadius: 10,
      height: 50,
      minWidth: "60%",
      justifyContent: 'center',
      alignItems: 'center',
      margin: 30,
  },
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
     title : {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 50,
    textAlign: 'center',
  },
})
