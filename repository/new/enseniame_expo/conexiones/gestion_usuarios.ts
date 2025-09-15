import { AppState } from 'react-native'
import { supabase } from '../lib/supabase'
import { User } from '@/components/types'
import { router } from 'expo-router';
import { error_alert } from '@/components/alert';
import { validateEmail } from '@/components/validaciones';


const ingresar = async  (mail:string, contraseña: string) =>{
  try {
    const { data: user, error } = await supabase.from('Users').select('*').eq('mail', mail);

    if (error) {
      console.error('Error:', error.message);
      return;
    }
    
    if (user && user.length > 0) {
      if (contraseña!= user[0].hashed_password || mail!= user[0].mail) {
        error_alert("Usuario o contraseña incorrectos");
      } else{
        //inicializar entorno

        router.push('/tabs');
      }
    } else{
      error_alert("Usuario o contraseña incorrectos");
    }
    
  } catch (error: any) {
    console.error('Error fetching user:', error.message);
  }
}

const registrarse = async (user:User )=>{
  try {
    const { error } = await supabase
          .from('Users')
          .insert(user);

    if (error) {
      console.error('Error:', error.message);
      return;
    }
    //inicializar entorno
    router.push('/tabs');

  } catch (error: any) {
    console.error('Error insertando:', error.message);
    error_alert("Error al crear usuario")
  }
}

const cuenta_existe = async (mail:string)=>{
  try {
    const { data: user, error } = await supabase.from('Users').select('*').eq('mail', mail);

    if (error) {
      console.error('Error:', error.message);
      return false;
    }

    if (user && user.length >0) {
      return true 
    }
    return false
  } catch (error:any) {
    console.error('Error insertando:', error.message);
    error_alert("Error al recuperar usuario")
  }
}

export {ingresar, registrarse, cuenta_existe }