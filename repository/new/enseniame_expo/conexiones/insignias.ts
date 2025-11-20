import { supabase } from '../lib/supabase'
import { cantidad_aprendidas } from './aprendidas';

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

const ganar_insignia_senia = async (id_alumno:number) => {
    // buscar insignias de categoria señas que no hayas ganado aún
    
    let { data: i, error } = await supabase
        .from('Insignias')
        .select('*')
        .eq("motivo",3);
    if (error) throw error;

    let {data: mis_i, error: e2} = await supabase
        .from('Alumno_Insignia')
        .select('*')
        .eq("id_alumno",id_alumno);
    if (e2) throw e2;

    if (i && mis_i){
        let no_ganadas: any[] =[];
        i.forEach(each=>{
            if (!mis_i.find(ganada=>ganada.id_insignia==each.id)) {
                no_ganadas.push(each);
            }
        })

        // verificar si acabas de ganar alguna
        const cantidad_senias_aprendidas = await cantidad_aprendidas(id_alumno);
        no_ganadas.forEach(async each=>{
            if (each.cantidad<= cantidad_senias_aprendidas) {
                //marcar como ganada                
                const { data, error } = await supabase
                    .from('Alumno_Insignia')
                    .insert( [{ id_alumno: id_alumno, id_insignia: each.id }])
                    .select()
                if (error) throw error;
                console.log(data)
            }
        })
    }                  
}

export {todas_insignias,categorias_insignias,ganar_insignia_senia,
    insignias_por_categoria,buscar_categoria }