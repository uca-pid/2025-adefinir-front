import { 
  Pressable,
  Text,
  TextInput,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal
} from 'react-native';
import { useEffect, useState } from "react";
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { validateEmail } from '@/components/validaciones';
import { estilos } from '@/components/estilos';

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
    
    setModalVisible(true)
  }

  async function recuperar() {
    //verificar código
    if (inputCode===codigo){
      alert("codigo correcto")
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
        
        <View style={styles.formContainer}>
            <ThemedText type='title' lightColor='white' style={{margin:20}}>Recuperar cuenta</ThemedText>

            <View style={styles.inputContainer}>
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
        </View>
      </ScrollView>
      </KeyboardAvoidingView>

      <Modal animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
            <View style={styles.mainView}>
               <ThemedText type='subtitle'>Ingresar código</ThemedText>
               <ThemedText> Se envió un correo a tu casilla.</ThemedText>

               <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={24} color="white" style={styles.inputIcon} />
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

                <ThemedText> ¿No lo recibiste?</ThemedText>
                <Pressable style={styles.loginButton}>
                  <ThemedText type="subtitle" lightColor='white'>Reenviar</ThemedText>
                </Pressable>
            </View>
           

      </Modal>
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
})
