import { supabase } from '../lib/supabase'

const visualizaciones_profe = async (id:number)=>{
    
    let { data: Visualizaciones_Senias, error } = await supabase
    .from('Visualizaciones_Senias')
    .select('*, Senias!inner (*)')
    .eq('Senias.id_autor',id)
    if (error) throw error;
    if (Visualizaciones_Senias && Visualizaciones_Senias.length>0) return Visualizaciones_Senias
          
}

const visualizaciones_alumno = async (id:number)=>{
    let { data: Visualizaciones_Senias, error } = await supabase.from('Visualizaciones_Senias').select("*").eq("alumno",id);
    if (error) {
        
        throw error;}
    if (Visualizaciones_Senias && Visualizaciones_Senias.length>0) return Visualizaciones_Senias
}

const alumno_ver_senia = async (user_id:number,senia_id:number)=>{
    
    const { data, error } = await supabase
        .from('Visualizaciones_Senias')
        .insert([
            { alumno: user_id, senia: senia_id },
        ])
        .select()
    if (error) throw error;
}

export {visualizaciones_profe, visualizaciones_alumno,alumno_ver_senia}