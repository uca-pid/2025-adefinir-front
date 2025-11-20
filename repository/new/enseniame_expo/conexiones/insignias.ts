import { supabase } from '../lib/supabase'

const todas_insignias = async () => {
    
    let { data: Insignias, error } = await supabase
        .from('Insignias')
        .select('*');
    if (error) throw error
    return Insignias
}

const insignias_modulos = async () => {
    let { data: Insignias, error } = await supabase
        .from('Insignias')
        .select('*')
        .eq("motivo",2);
    if (error) throw error
    return Insignias
}

const insignias_racha = async () => {
    let { data: Insignias, error } = await supabase
        .from('Insignias')
        .select('*')
        .eq("motivo",1);
    if (error) throw error
    return Insignias
}

const insignias_objetivos = async () => {
    let { data: Insignias, error } = await supabase
        .from('Insignias')
        .select('*')
        .eq("motivo",4);
    if (error) throw error
    return Insignias
}

const insignias_senias = async () => {
    let { data: Insignias, error } = await supabase
        .from('Insignias')
        .select('*')
        .eq("motivo",3);
    if (error) throw error
    return Insignias
}

const categorias_insignias = async () => {
    
    let { data: Motivos_Insignia, error } = await supabase
    .from('Motivos_Insignia')
    .select('*')
    if (error) throw error
    return Motivos_Insignia          
}

const insignias_por_categoria = async  (id_cate:number) => {
    let { data: Insignias, error } = await supabase
        .from('Insignias')
        .select('*')
        .eq("motivo",id_cate);
    if (error) throw error
    return Insignias
}

const buscar_categoria = async (id_cate:number) => {
    let { data: Motivos_Insignia, error } = await supabase
        .from('Motivos_Insignia')
        .select('*')
        .eq("id",id_cate)
        .single()
    if (error) throw error
    return Motivos_Insignia 
}

export {todas_insignias,insignias_modulos,insignias_objetivos,insignias_racha,insignias_senias, categorias_insignias,
    insignias_por_categoria,buscar_categoria }