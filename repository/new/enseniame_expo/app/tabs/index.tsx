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

export default function Login() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Hola, </Text>
      <Text style={{fontWeight:"bold"}}>alumno </Text><Text>!</Text>
      <Text>Hola, </Text>
      <Text style={{fontWeight:"bold"}}>profesor </Text><Text>!</Text>
    </View>
  );
}
