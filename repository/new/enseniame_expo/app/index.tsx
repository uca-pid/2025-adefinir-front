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

export default function Login() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Página de login.</Text>
        <Pressable onPress={()=>{router.replace('/tabs');}} style={{borderWidth:3,backgroundColor: "lightblue", padding:5, margin:5}} >
          <Text style={{fontWeight: "bold",color:"white"}}>Ingresar</Text>
        </Pressable>
      <View >
        <Text >¿No tienes un usuario? </Text>
        <Link href="/signup" >
          <Text style={{color:"blue"}}>Regístrate aquí</Text>
        </Link>
      </View>

      <View >
        <Link href="/acc_recovery" >
          <Text style={{color:"blue"}}>Olvidé mi contraseña</Text>
        </Link>
      </View>
    </View>
  );
}
