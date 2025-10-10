import { supabase } from '../lib/supabase'

const visualizaciones_profe = async (id:number)=>{
    
    let { data: Visualizaciones_Senias, error } = await supabase
    .from('Visualizaciones_Senias')
    .select('*, Senias!inner (*)')
    .eq('Senias.id_autor',id)
    if (error) throw error;
    if (Visualizaciones_Senias && Visualizaciones_Senias.length>0) return Visualizaciones_Senias
          
}

export {visualizaciones_profe}