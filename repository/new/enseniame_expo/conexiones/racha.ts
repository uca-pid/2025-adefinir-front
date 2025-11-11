import { now } from '@/components/validaciones';
import { supabase } from '../lib/supabase'

const mi_racha = async (id_alumno:number) => {
    
    let { data: Alumno_Racha, error } = await supabase
        .from('Alumno_Racha')
        .select('*')
        .eq("id_alumno",id_alumno);
    if (error) throw error

    if (Alumno_Racha && Alumno_Racha.length>0) return Alumno_Racha[0]
    else {
        const { data, error } = await supabase
            .from('Alumno_Racha')
            .insert([
                { id_alumno: id_alumno, racha: 1,last_login: now() },
            ])
            .select()
        if (error) throw error
        return data[0]
    }
}

const sumar_racha= async (id_alumno:number) =>{
    //verificar si hay racha
    let { data: Alumno_Racha, error } = await supabase
        .from('Alumno_Racha')
        .select('*')
        .eq("id_alumno",id_alumno);
    if (error) throw error
    if (Alumno_Racha && Alumno_Racha.length>0){
        let r =Alumno_Racha[0];        
        const { data, error } = await supabase
            .from('Alumno_Racha')
            .update({ racha: r.racha+1, last_login: now() })
            .eq('id_alumno', id_alumno)
            .select()
        if (error) throw error
        console.log(data)
    } else {        
        const { data, error } = await supabase
            .from('Alumno_Racha')
            .insert([
                { id_alumno: id_alumno, racha: 1,last_login: now() },
            ])
            .select()
        if (error) throw error
        console.log(data)
    }
}

const perder_racha = async (id_alumno:number) => {
    const { data, error } = await supabase
        .from('Alumno_Racha')
        .update({ racha: 1, last_login: now() })
        .eq('id_alumno', id_alumno)
        .select()
    if (error) throw error
    console.log(data)
}

export {mi_racha, sumar_racha, perder_racha}