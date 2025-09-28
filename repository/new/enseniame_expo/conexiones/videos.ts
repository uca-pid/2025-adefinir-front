import { AppState } from 'react-native'
import { supabase } from '../lib/supabase'
import { Profesor, User } from '@/components/types'
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
      const { data, error } = await supabase
        .from('Senias')
        .select('*')
        .order('significado', { ascending: true });

      if (error) throw error;
      return data
    } catch (error) {
      console.error('Error fetching señas:', error);
      error_alert('No se pudieron cargar las señas');
    } 
};
const buscarAutor = async (id:number) =>{
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

const buscarCategoria = async (id:number) =>{
    try {
       
        let { data: cate, error } = await supabase.from('Categorias').select('*').eq('id',id);
            
        if (error) throw error;
        if (cate && cate.length>0) {
            console.log(cate);
            return cate[0]
        }
    } catch (error) {
        console.error('Error buscando la categoria:', error);
    }
}

export {traer_tabla_videos,buscarSenias,buscarAutor, buscarCategoria}