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

const buscar_senias_modulo = async (id:number)=>{
    try {
        
        let { data: id_senias, error } = await supabase.from('Modulo_Video').select(`Senias (id)`).eq("id_modulo",id);
        if (id_senias && id_senias.length>0) {
            const ids = id_senias.map(each => Number(each.Senias.id))
            let {data:senias,error} = await supabase.from("Senias").select(`*,  Users (*),  Categorias (nombre) `).in("id",ids);
            if (senias && senias.length>0) return senias

            if (error) throw error
        }

        if (error) throw error
    } catch (error) {
        error_alert("No se pudieron cargar las señas");
        console.error(error)
    }
}

const modulos_completados_por_alumno = async (id_alumno:number) =>{
    try {
        let { data, error } = await supabase.from('Alumno_Modulo').select('id_modulo').eq('id_alumno', id_alumno).eq('completado', true);
        if (data) return data.length;
        console.log(data)
        if (error) throw error;
    } catch (error) {
        console.error('Error al obtener módulos completados:', error);
        return 0;
    }
}


export {todos_los_modulos,buscar_modulo,buscar_senias_modulo,modulos_completados_por_alumno}