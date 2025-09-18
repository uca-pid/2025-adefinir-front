import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link , router} from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { success_alert } from '@/components/alert';
import Toast from 'react-native-toast-message';

export default function Perfil (){
    const [name,setName]= useState("");
    const [mail,setMail]= useState("");
    const [pass,setPass]=useState("");
    const [institucion,setI]=useState("");

    const [showPassword, setShowPassword] = useState(false);

    const confirmar = async () => {
        success_alert("Cambios guardados correctamente");
    }

    return(
        <View style={styles.safeArea}>
            <View style={styles.mainView}>
            <ScrollView contentContainerStyle={[styles.scrollViewContent]}>
                <View style={styles.formContainer}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.panelTitle}>Perfil </Text>
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
                        <Ionicons name="lock-closed-outline" size={24} color="#666" style={styles.inputIcon} />
                        <TextInput
                            style={styles.textInput}
                            value={pass}
                            onChangeText={ setPass}
                            placeholder="Nueva contraseña"
                            placeholderTextColor="#999"
                            secureTextEntry={!showPassword}
                        />
                        <Pressable onPress={() => setShowPassword(!showPassword)}>
                            <Ionicons
                            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                            size={24}
                            color="#666"
                            />
                        </Pressable>
                    </View>

                    <View style={styles.inputContainer}>
                        <Ionicons name="business-outline" size={24} color="#666" style={styles.inputIcon} />
                        <TextInput
                            style={styles.textInput}
                            onChangeText={setI}
                            value={institucion}
                            placeholder="Institución"
                            placeholderTextColor="#999"
                        />
                    </View>

                    <TouchableOpacity onPress={confirmar} style={styles.loginButton} >
                        <ThemedText type="subtitle" lightColor='white'>Guardar cambios</ThemedText>
                    </TouchableOpacity>

                </View>
            </ScrollView>
            </View>
            <Toast/>
        </View>
    )
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f3e8ff', // violeta claro
  },
  mainView: {
    flex: 1,
    backgroundColor: '#f3e8ff',
    justifyContent: 'flex-start',
    alignItems: 'center',
    
  },
  headerContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  panelTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#560bad',
    marginBottom: 4,
  },
  teacherName: {
    fontSize: 18,
    color: '#560bad',
    fontWeight: '500',
    marginBottom: 18,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F72585',
    borderRadius: 14,
    height: 60,
    marginBottom: 28,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    paddingHorizontal: 24,
  },
  ctaIcon: {
    marginRight: 10,
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 22,
    width: '100%',
    paddingHorizontal: 16,
  },
  quickActionCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingVertical: 20,
    marginHorizontal: 6,
  },
  quickActionText: {
    color: '#560bad',
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 6,
    textAlign: 'center',
  },
  // summaryCard y summaryText eliminados
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: '#560bad',
    paddingVertical: 12,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 10,
    zIndex: 1,
  },
  fabPlaceholder: {
    width: 80,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  navText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  fabButton: {
    position: 'absolute',
    left: '50%',
    bottom: 1,
    transform: [{ translateX: -32 }, { translateY: -32 }],
    backgroundColor: '#7209B7',
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 4,
    borderColor: '#f3e8ff',
    zIndex: 2,
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
      minWidth: "80%",
      marginBottom: 50
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
      paddingHorizontal: 10
  },
   title : {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
    textAlign: 'center',
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
});
