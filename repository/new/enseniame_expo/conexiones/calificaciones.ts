import { supabase } from '../lib/supabase'

const traerTodasCalificaciones = async () => {
    
    let { data: Calificaciones_Modulos, error } = await supabase
    .from('Calificaciones_Modulos')
    .select('*');
    if (error) throw error
    return Calificaciones_Modulos
}

const calificacionesModulo = async (id_modulo:number) => {
    let { data: calificaciones, error } = await supabase.from('Calificaciones_Modulos').select("*").eq("id_modulo",id_modulo);
    if (error) throw error
    if (calificaciones && calificaciones.length>0) return calificaciones
}

const calificacionesProfe = async (id_profe:number) => {
    let {data, error} = await supabase.from("Modulos").select("*, Calificaciones_Modulos(*)").eq("autor",id_profe);
    if (error) throw error
    return data
}


export {traerTodasCalificaciones, calificacionesModulo, calificacionesProfe}