import { 
  Pressable,
  Text,
  TextInput,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
  Animated
} from 'react-native';
import { useEffect, useState } from "react";
import { Link, router } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { validateEmail } from '@/components/validaciones';
import { estilos } from '@/components/estilos';
import { error_alert, success_alert } from '@/components/alert';
import Toast from 'react-native-toast-message';

export default function Login() {
  const [mail, setMail] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [inputCode,setInputCode]= useState('');
  const codigo ="1234";
  const handleEmailChange = (text:any) => {
      setMail(text);
      setErrorEmail(validateEmail(text).msj);
    };
  async function enviar_codigo() {
    if (validateEmail(mail).status){
      //verificar que la cuenta exista en la db
      setModalVisible(true);
    } else{
      error_alert("Ingrese un mail válido");
    }
  }

  async function recuperar() {
    
    if (inputCode===codigo){
      success_alert("Código correcto");
      router.replace('/tabs');
    } else {
      error_alert("Contraseña incorrecta");
      console.log("No")
    }
  }
  return (
    <View
      style={styles.mainView}
    >
      
      <ScrollView contentContainerStyle={[styles.scrollViewContent]}>
        
        <View style={styles.formContainer}>
            <ThemedText type='title' lightColor='white' style={{margin:20}}>Recuperar cuenta</ThemedText>

            <View style={styles.inputContainer}>
              <Ionicons name="code-download" size={24} color="white" style={styles.inputIcon} />
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

            <Pressable onPress={enviar_codigo} style={styles.loginButton} >
              <ThemedText type="subtitle" lightColor='white'>Enviar código</ThemedText>
            </Pressable>
        </View>
      </ScrollView>
      

      <Modal animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
            <View style={styles.mainView}>
               <ThemedText type='subtitle'>Ingresar código</ThemedText>
               <ThemedText style={estilos.centrado}> Se envió un correo a tu casilla </ThemedText>
               <ThemedText>con una contraseña temporal.</ThemedText>

               <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={24} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                keyboardType="default"
                onChangeText={setInputCode}
                value={inputCode}
                placeholder="Código"
                placeholderTextColor="#999"
              />
            </View>
            {errorEmail ? <ThemedText type='error'>{errorEmail}</ThemedText> : null}

              <Pressable onPress={recuperar} style={styles.loginButton} >
                <ThemedText type="subtitle" lightColor='white'>Recuperar</ThemedText>
              </Pressable>

                <Pressable style={[styles.cancelButton]} onPress={() => router.back()}   >
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                </Pressable>

                <ThemedText> ¿No lo recibiste?</ThemedText>
                <Pressable style={styles.loginButton}>
                  <ThemedText type="subtitle" lightColor='white'>Reenviar</ThemedText>
                </Pressable>
                <Toast/>
            </View>
           

      </Modal>
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
    backgroundColor: "white"
  },
  formContainer: {
      width: '100%',
      backgroundColor: '#7209B7',
      borderRadius: 10,
      padding: 20,
      justifyContent: "center",
      alignItems: 'center',
      height: 500

  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    minWidth: "90%",
    
  },
  loginButton: {
      backgroundColor: '#B5179E',
      borderRadius: 10,
      height: 50,
      minWidth: "60%",
      justifyContent: 'center',
      alignItems: 'center',
      margin: 30,
  },
  cancelButton: {
      backgroundColor: '#fff',
      borderRadius: 10,
      height: 50,
      minWidth: "60%",
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#7209B7',
      marginBottom: 30
  },
  cancelButtonText: {
    color: '#7209B7',
    fontSize: 18,
    fontWeight: 'bold',
  },
  textInput:{
        padding:8,
        backgroundColor: "white",
        fontSize:18,
        
        minWidth: "60%",
        maxWidth: "80%",
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
})
