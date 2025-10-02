import { supabase } from '../lib/supabase'
import { Logged_Alumno, Logged_Profesor, Modulo, Profesor, User } from '@/components/types'
import { router } from 'expo-router';
import { error_alert } from '@/components/alert';

const todos_los_modulos = async () =>{
    try {
        
        let { data: Modulos, error } = await supabase.from('Modulos').select('*');
          
        if (Modulos && Modulos.length>0) return Modulos
        if (error) throw new Error(String(error));
          
    } catch (error) {
        error_alert("Ocurrió un error al buscar los módulos");
        console.error(error)
    }
}

const buscar_modulo = async (id:number) =>{
    try {
        
        let { data: modulo, error } = await supabase.from('Modulos').select('*').eq('id',id);
          
        if (modulo && modulo.length>0) return modulo[0]
        if (error) throw new Error(String(error));
          
    } catch (error) {
        error_alert("Ocurrió un error al buscar el módulo");
        console.error(error)
    }
}

export {todos_los_modulos,buscar_modulo}