import { Calificaciones } from '@/components/types';
import { supabase } from '../lib/supabase'

const traerTodasCalificaciones = async () => {
    
    let { data: Calificaciones_Modulos, error } = await supabase
    .from('Calificaciones_Modulos')
    .select('*');
    if (error) throw error
    return Calificaciones_Modulos
}

const calificacionesModulo = async (id_modulo:number) => {
    let { data: calificaciones, error } = await supabase.from('Calificaciones_Modulos').select("*, Users(username)").eq("id_modulo",id_modulo);
    if (error) throw error
    if (calificaciones && calificaciones.length>0) return calificaciones
}


const calificacionesProfe = async (id_profe:number) => {
    let {data, error} = await supabase.from("Modulos").select("id, Calificaciones_Modulos(*)").eq("autor",id_profe);
    if (error) throw error
    return data
}

const getRanking = async () => {
    // Buscar todos los profes, sus módulos y calificaciones    
    let { data: profes, error } = await supabase.from('Users') 
        .select('id, username, Modulos!Modulos_autor_fkey(id, Calificaciones_Modulos(*))')
        .eq("is_prof",true);
    if (error) throw error;
    if (profes && profes.length>0) {
        // Buscar las calificaciones de cada profe
        const res = profes.map(profe=>{
            let promedio = 0;
            let cant=0;
            profe.Modulos.forEach(modulo=>{
                modulo.Calificaciones_Modulos.forEach(calificaciones=>{
                    promedio+= calificaciones.puntaje;
                    cant++
                })
            });
            if (cant!=0) return {id: profe.id, username: profe.username, promedio: promedio / cant, cant_reviews:cant}
            else return {id: profe.id,username: profe.username, promedio:0, cant_reviews:0}
        });
        return res
    } else {
        throw new Error("No hay datos de profesores");
    }
          
}

const modulosCalificados = async () =>{
    let { data: Modulos, error } = await supabase
        .from('Modulos')
        .select('*, Calificaciones_Modulos (*)')        
    if (error) throw error;
    if (Modulos && Modulos.length>0) return Modulos 
}

const promedio_reseñas = (calificaciones_modulo: Calificaciones[])=>{
    let promedio =0;
    calificaciones_modulo?.forEach(each=>{
      promedio+= each.puntaje;
    });
    return calificaciones_modulo.length>0 ? promedio / calificaciones_modulo.length : 0
  }

export {traerTodasCalificaciones, calificacionesModulo, calificacionesProfe, getRanking, modulosCalificados, promedio_reseñas}