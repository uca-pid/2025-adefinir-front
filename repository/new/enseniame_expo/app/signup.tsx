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

export default function Login() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Página de crear cuenta.</Text>
      <Pressable onPress={()=>{router.replace('/tabs');}} style={{borderWidth:3,backgroundColor: "lightblue", padding:5, margin:5}} >
          <Text style={{fontWeight: "bold",color:"white"}}>Registrarse</Text>
      </Pressable>
      <View >
        <Text >¿Ya tienes un usuario? </Text>
        <Link href="/login" >
          <Text style={{color:"blue"}}>Inicia sesión aquí</Text>
        </Link>
      </View>
    </View>
  );
}
