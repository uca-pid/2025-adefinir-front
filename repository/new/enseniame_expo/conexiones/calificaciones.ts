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
            if (cant!=0) return {id: profe.id, username: profe.username, promedio: promedio / cant}
            else return {id: profe.id,username: profe.username, promedio:0}
        });
        return res
    } else {
        throw new Error("No hay datos de profesores");
    }
          
}

const calificarModulo = async (id_modulo: number, id_alumno: number, puntaje: number, comentario?: string) => {
    const { data, error } = await supabase
        .from('Calificaciones_Modulos')
        .upsert([
            {
                id_modulo,
                id_alumno,
                puntaje,
                comentario
            }
        ])
        .select();
    
    if (error) throw error;
    return data;
}

export {
    traerTodasCalificaciones, 
    calificacionesModulo, 
    calificacionesProfe, 
    getRanking,
    calificarModulo
}