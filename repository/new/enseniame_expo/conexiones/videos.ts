import { AppState } from 'react-native'
import { supabase } from '../lib/supabase'
import { Profesor, Senia, Senia_Info, User } from '@/components/types'
import { router } from 'expo-router';
import { error_alert } from '@/components/alert';

const traer_tabla_videos = async () => {
    try {
        const { data: videos, error } = await supabase.from('Senias').select('*');
        if (error) {
            console.error('Error:', error.message);
            return;
        }
        if (videos && videos.length >0){
            return videos
        }

    } catch (error) {
        error_alert(String(error))
    }
    
}

const buscarSenias = async () => {
    try {        
        let { data, error } = await supabase.from('Senias').select(`*,  Users (*),  Categorias (nombre) `);        

        if (error) throw error;
        if (data && data.length>0)  return data
      
    } catch (error) {
      console.error('Error fetching señas:', error);
      error_alert('No se pudieron cargar las señas');
    } 
};

const buscarAutor = async (id:number ) =>{
    try {
        const { data: user, error } = await supabase.from('Users').select('*').eq('id', id);
        if (error) throw error;
        if (user && user.length >0) {
            return user[0]
        }
    } catch (error) {
        console.error('Error buscando al autor:', error);
    }
}

const buscarCategoria = async (id:number ) =>{
    try {
       
        let { data: cate, error } = await supabase.from('Categorias').select('*').eq('id',id);
            
        if (error) throw error;
        if (cate && cate.length>0) {
            console.log(cate);
            return cate[0]
        }
        return {id:0,nombre: "Nada"}
    } catch (error) {
        console.error('Error buscando la categoria:', error);
    }
}

const eliminar_video = async (senia:Senia_Info)=>{
    try {

        const { data, error: error2 } = await supabase.storage.from('videos').remove([senia.video_url]);
        
        const { error } = await supabase.from('Senias').delete().eq('id', senia.id);
        if (error || error2) throw new Error(String(error));
          
    } catch (error) {
        console.error("Error borrando la seña:",error);
        error_alert("Ocurrió un error al borrar la seña");
    }
}

export {traer_tabla_videos,buscarSenias,eliminar_video}