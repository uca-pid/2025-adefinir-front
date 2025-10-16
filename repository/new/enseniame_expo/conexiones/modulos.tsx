import { supabase } from '../lib/supabase'
import { Logged_Alumno, Logged_Profesor, Modulo, Profesor, User } from '@/components/types'
import { router } from 'expo-router';
import { error_alert } from '@/components/alert';

const todos_los_modulos = async () =>{
    try {
        
        let { data: Modulos, error } = await supabase.from('Modulos').select('*');
          
        if (Modulos && Modulos.length>0) return Modulos
        if (error) throw new Error(String(error));
          
    } catch (error) {
        error_alert("Ocurrió un error al buscar los módulos");
        console.error(error)
    }
}

const buscar_modulo = async (id:number) =>{
    try {
        
        let { data: modulo, error } = await supabase.from('Modulos').select('*').eq('id',id);
          
        if (modulo && modulo.length>0) return modulo[0]
        if (error) throw new Error(String(error));
          
    } catch (error) {
        error_alert("Ocurrió un error al buscar el módulo");
        console.error(error)
    }
}

const buscar_senias_modulo = async (id:number)=>{
    try {
        // Primero obtener los IDs de seña (id_video) del módulo
        let { data: relaciones, error: relErr } = await supabase.from('Modulo_Video').select('id_video').eq("id_modulo",id);
        if (relErr) throw relErr;

        const ids = (relaciones || []).map((r: any) => Number(r.id_video)).filter((n) => !isNaN(n));
        if (ids.length === 0) return [];

        // Luego traer las señas con relaciones desambiguadas
        let {data: senias, error: senErr} = await supabase
          .from("Senias")
          .select(`*,  Users!Senias_id_autor_fkey (*),  Categorias (nombre) `)
          .in("id", ids);
        if (senErr) throw senErr;

        return senias || [];
    } catch (error) {
        error_alert("No se pudieron cargar las señas");
        console.error(error)
        return []
    }
}

const modulos_completados_por_alumno = async (id_alumno:number) =>{
    try {
        let { data, error } = await supabase.from('Alumno_Modulo').select('id_modulo').eq('id_alumno', id_alumno).eq('completado', true);
        if (data) return data.length;
        console.log(data)
        if (error) throw error;
    } catch (error) {
        console.error('Error al obtener módulos completados:', error);
        return 0;
    }
}

// Calcular porcentaje aprendido por categoría para un usuario
const progreso_por_categoria = async (user_id: number) => {
  try {
    // Todas las señas con su categoría
    const { data: senias, error: senErr } = await supabase
      .from('Senias')
      .select('id, categoria_id, Categorias (nombre)');
    if (senErr) throw senErr;

    // Aprendidas del usuario
    const { data: aprendidas, error: aErr } = await supabase
      .from('Alumno_Senia')
      .select('senia_id, aprendida')
      .eq('user_id', user_id)
      .eq('aprendida', true);
    if (aErr) throw aErr;

    const learnedSet = new Set<number>((aprendidas || []).map((r: any) => Number(r.senia_id)));

    // Totales y contadores
    const totals = new Map<number, { nombre: string; total: number; learned: number }>();
    (senias || []).forEach((s: any) => {
      const catId = Number(s.categoria_id) || 0;
      const nombre = s?.Categorias?.nombre || 'Sin categoría';
      const entry = totals.get(catId) || { nombre, total: 0, learned: 0 };
      entry.total += 1;
      if (learnedSet.has(Number(s.id))) entry.learned += 1;
      totals.set(catId, entry);
    });

    // Resultado con porcentaje
    const result = Array.from(totals.entries()).map(([categoriaId, v]) => ({
      categoriaId,
      nombre: v.nombre,
      porcentaje: v.total > 0 ? Math.round((v.learned * 100) / v.total) : 0,
    }));

    // Ordenar por porcentaje desc
    result.sort((a, b) => b.porcentaje - a.porcentaje);
    return result;
  } catch (e) {
    console.error('progreso_por_categoria error', e);
    return [];
  }
}

export {todos_los_modulos,buscar_modulo,buscar_senias_modulo,modulos_completados_por_alumno,progreso_por_categoria}