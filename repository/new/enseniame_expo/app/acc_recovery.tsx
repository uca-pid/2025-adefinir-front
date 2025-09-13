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
  const [showPassword, setShowPassword] = useState(false);
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
    }
  }
  return (
    <View  style={styles.mainView}  >
      
      <ScrollView contentContainerStyle={[styles.scrollViewContent, ]}>
        
        <View style={styles.formContainer}>
          <View >
          <ThemedText type='title' style={{margin:20}}>Recuperar cuenta</ThemedText>

          <View style={[styles.inputContainer,]}>
            <Ionicons name="mail-outline" size={24} color="white" style={styles.inputIcon} />
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

          <Pressable style={[styles.loginButton,{borderWidth: 1, borderColor: '#7209B7',backgroundColor: '#fff',}]} onPress={() => router.back()}   >
            <ThemedText type="subtitle" lightColor='#7209B7'>Cancelar</ThemedText>
          </Pressable>
          </View>
        </View>
      </ScrollView>
      

      <Modal animationType="slide" 
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
            <View style={[styles.mainView,{backgroundColor:'rgba(255, 255, 255, 0)'}]}>
              <ScrollView contentContainerStyle={[styles.scrollViewContent, {minWidth:"85%"} ]}>
        
              <View style={[styles.formContainer,{backgroundColor:"white"}]}>
               <ThemedText type='title'>Ingresar código</ThemedText>
               <ThemedText style={[estilos.centrado,{marginTop:20}]}> Se envió un correo a tu casilla </ThemedText>
               <ThemedText>con una contraseña temporal.</ThemedText>
               <ThemedText>Recuerde restaurarla luego de ingresar.</ThemedText>

               <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={24} color="#666" style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  keyboardType="default"
                  secureTextEntry={!showPassword}
                  textContentType="newPassword"
                  onChangeText={setInputCode}
                  value={inputCode}
                  placeholder="Código"
                  placeholderTextColor="#999"
                  />
                  <Pressable onPress={()=> setShowPassword(!showPassword)} >
                    <Ionicons
                      name={showPassword ? "eye-outline" : "eye-off-outline"}
                      size={24}
                      color="#666"
                    />
                  </Pressable>
              </View>
              {errorEmail ? <ThemedText type='error'>{errorEmail}</ThemedText> : null}

              <Pressable onPress={recuperar} style={[styles.loginButton,{width:"80%"}]} >
                <ThemedText type="subtitle" lightColor='white'>Recuperar</ThemedText>
              </Pressable>

              <Pressable style={[styles.loginButton,{width:"80%",borderWidth: 1, borderColor: '#7209B7',backgroundColor: '#fff',}]} onPress={() => setModalVisible(false)}   >
                <ThemedText type="subtitle" lightColor='#7209B7'>Cancelar</ThemedText>
              </Pressable>
            
              <View style={[estilos.centrado,{marginTop: 30,width:"100%"}]}>
                <ThemedText> ¿No lo recibiste?</ThemedText>
                <Pressable style={[styles.loginButton, {backgroundColor: '#F72585',width:"80%"}]}>
                  <ThemedText type="subtitle" lightColor='white'>Reenviar</ThemedText>
                </Pressable>
              </View>
              </View>
              </ScrollView>
              <Toast/>
            </View>
           
          <Toast/>
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
    backgroundColor: "#560bad"
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
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    minWidth: "80%",
  },
  loginButton: {
      backgroundColor: '#B5179E',
      borderRadius: 10,
      height: 50,
      minWidth: "60%",
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
      marginHorizontal: 30
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
