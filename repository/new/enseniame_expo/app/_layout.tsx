import { Stack } from "expo-router";

export default function RootLayout() {
  return(
    <Stack>
    <Stack.Screen name='index' options={{title:"Start",headerShown: false}}/>
    <Stack.Screen name='login' options={{title:"Login",headerShown: false}}/>
    <Stack.Screen name='signup_alumno' options={{title:"Crear cuenta",headerShown: false}}/>
    <Stack.Screen name='signup_profe' options={{title:"Crear cuenta",headerShown: false}}/>
    <Stack.Screen name='acc_recovery' options={{title:"Recuperar cuenta",headerShown: false}}/>
    <Stack.Screen name='tabs' options={{headerShown: false}}/>
    </Stack>);
}
