import { supabase } from '../lib/supabase'

const traerMotivosReporte = async ()=>{
    
    let { data: Motivos_reporte, error } = await supabase
        .from('Motivos_reporte')
        .select('*')
    if (error) throw error
    return Motivos_reporte
}

const crearReporte = async (id_autor:number,id_motivo:number,comentario:string,id_senia:number)=>{
    const { error } = await supabase
        .from('Reportes')
        .insert([
            { id_senia: id_senia, id_profe: id_autor, motivo:id_motivo, comentario:comentario },
        ])
        .select()
    if (error) throw error
}

const todosReportes = async () => {
    
    let { data: Reportes, error } = await supabase.from('Reportes').select('*, Motivos_reporte(*), Senias (*, Users: Users!id_autor (*),  Categorias (nombre))');
    if (error) throw error
    return Reportes
}

export {traerMotivosReporte, crearReporte, todosReportes}