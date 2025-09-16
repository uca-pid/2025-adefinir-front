import { Pressable,  Text,  TextInput,  View,
  StyleSheet,  Platform,  ScrollView, KeyboardAvoidingView,
  TouchableOpacity
} from 'react-native';
import { useEffect, useState } from "react";
import { Link, router, useLocalSearchParams } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { estilos } from '@/components/estilos';
import { Checkbox } from 'expo-checkbox';
import { error_alert,success_alert } from '@/components/alert';
import { validateEmail, validatePassword, validateInstitution } from '@/components/validaciones';
import Toast from 'react-native-toast-message';
import { registrarse } from '@/conexiones/gestion_usuarios';
import { User, Profesor } from '@/components/types';

export default function Signup() {
  
  const [mail, setMail] = useState('');
  const [name, setName] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [institucion, setInstitucion]= useState('');

  const [errorEmail, setErrorEmail] = useState('');
  const [errorName, setErrorName] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [errorPasswordConfirm, setErrorPasswordConfirm] = useState('');
  const [errorI, setErrorI] = useState('');

  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const validatePasswordConfirm = (password1:String, password2:String) => {
        if (password1 !== password2) {
            setErrorPasswordConfirm('Las contraseñas deben coincidir');
            return false;
        } else {
            setErrorPasswordConfirm('');
            return true;
        }
    };

    const handleEmailChange = (text:any) => {
      setMail(text);
      setErrorEmail(validateEmail(text).msj);
    };

    const handleNameChange = (text:any) => {
        setName(text);
        setErrorName(text ? '' : 'El nombre de usuario no puede estar vacío');
    };

    const handlePasswordChange = (text:any) => {
        setPassword1(text);
        setErrorPassword(validatePassword(text).msj);
        validatePasswordConfirm(text, password2);
    };

    const handlePasswordConfirmChange = (text:any) => {
        setPassword2(text);
        validatePasswordConfirm(password1, text);
    };

    const handleInstitutionChange = (text:any) =>{
      setInstitucion(text);
      setErrorI(text ? '' : 'El nombre de la institución no puede estar vacío');
    }


  async function signup() {
    setMail(mail.toLowerCase())
    const isEmailValid = validateEmail(mail).status;
    const isNameValid = name !== '';
    const isPasswordValid = validatePassword(password1).status;
    const isPasswordConfirmValid = password1==password2;
    const isInstitutionValid = validateInstitution(institucion);

    if (isEmailValid && isNameValid && isPasswordValid && isPasswordConfirmValid && isInstitutionValid) {
      const user = new Profesor(mail,name,password1,institucion)
      registrarse(user);      
    }
    else {
      error_alert("Complete todos los campos para continuar");  
    }
  }

  return (
    <View style={styles.mainView} >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}
      >
      <ScrollView contentContainerStyle={[styles.scrollViewContent,estilos.centrado]}>
       
        <View style={styles.formContainer}>
       
        <ThemedText type="title" style={{margin:40}}>Crear cuenta</ThemedText>
      
      
      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={24} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          onChangeText={handleNameChange}
          value={name}
          placeholder="Nombre"
          placeholderTextColor="#999"
        />
      </View>
      {errorName ? <ThemedText type='error'>{errorName}</ThemedText> : null}

      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={24} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          textContentType="emailAddress"
          keyboardType="email-address"
          onChangeText={handleEmailChange}
          value={mail}
          placeholder="Correo electrónico"
          placeholderTextColor="#999"
        />
      </View>
      {errorEmail ? <ThemedText type='error'>{errorEmail}</ThemedText> : null}

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={24} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          secureTextEntry={!showPassword1}
          textContentType="newPassword"
          onChangeText={handlePasswordChange}
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
      {errorPassword ? <ThemedText type='error' style={{maxWidth: "80%"}}>{errorPassword}</ThemedText> : null}

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={24} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          secureTextEntry={!showPassword2}
          textContentType="newPassword"
          onChangeText={handlePasswordConfirmChange}
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
      {errorPasswordConfirm ? <ThemedText type='error'>{errorPasswordConfirm}</ThemedText> : null}

      
        <View style={styles.inputContainer}>
        <Ionicons name="business-outline" size={24} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.textInput}
          onChangeText={handleInstitutionChange}
          value={institucion}
          placeholder="Institución"
          placeholderTextColor="#999"
        />
      </View>
    
      {errorI ? <ThemedText type='error'>{errorI}</ThemedText> : null}

      <TouchableOpacity onPress={signup} style={styles.loginButton} >
        <ThemedText type="subtitle" lightColor='white'>Registrarse</ThemedText>
      </TouchableOpacity>
      <View style={[estilos.centrado,{marginBottom:10}]}>
        <ThemedText style={{fontSize: 16}}>¿Ya tienes un usuario? </ThemedText>
        <Link href="/login" >
          <ThemedText style={{fontSize: 16}} type='link' >Inicia sesión aquí</ThemedText>
        </Link>
      </View>

      <View style={[estilos.centrado,{marginBottom:10}]}>
        <ThemedText style={{fontSize: 16}}>¿Eres alumno? </ThemedText>
        <Link href="/signup_alumno" >
          <ThemedText style={{fontSize: 16}} type='link' >Crear cuenta de alumno</ThemedText>
        </Link>
      </View>
      
      </View>
      </ScrollView>
      </KeyboardAvoidingView>
      <Toast/>
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
    backgroundColor: "#560bad"
  },
  
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    minWidth: "85%"
  },
  formContainer: {
      width: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      borderRadius: 10,
      padding: 20,
      justifyContent: "center",
      alignItems: 'center',
      height: 650
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
      shadowOpacity: 0.15,
      shadowRadius: 6,
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
  checkbox: {
    margin: 8,
  },
})
