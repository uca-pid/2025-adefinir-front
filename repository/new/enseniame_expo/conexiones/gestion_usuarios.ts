import { AppState } from 'react-native'
import { supabase } from '../lib/supabase'
import { Logged_Alumno, Logged_Profesor, Profesor, User } from '@/components/types'
import { router } from 'expo-router';
import { error_alert } from '@/components/alert';
import { validateEmail } from '@/components/validaciones';
import { useUserContext } from '@/context/UserContext';

const entrar = async (mail: string)=>{
  const { data: user, error } = await supabase.from('Users').select('*').eq('mail', mail);

    if (error) {
      console.error('Error:', error.message);
      return;
    }
    if (user && user.length > 0) {
      
        //inicializar entorno
        if (user[0].is_prof) router.push('/tabs/HomeTeacher');
        else router.push('/tabs/HomeStudent');              
    }
}

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
        //devolver usuario hallado
       
       const usuario = user[0].is_prof ? new Logged_Profesor(user[0].mail,user[0].username,user[0].hashed_password,user[0].institution,user[0].id) :
                                         new Logged_Alumno(user[0].mail,user[0].username,user[0].hashed_password,user[0].id);
                
       return usuario
        
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
    const mail= user.mail;

    try {
      const { data: user, error } = await supabase.from('Users').select('*').eq('mail', mail);

      if (error) {
        console.error('Error:', error.message);
        return;
      }
      
      if (user && user.length > 0) {
        if (user[0].is_prof) router.push('/tabs/HomeTeacher');
        else router.push('/tabs/HomeStudent');
      }
    } catch (error) {
      console.error(error);
    }
   

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

export {ingresar, registrarse, cuenta_existe , entrar}