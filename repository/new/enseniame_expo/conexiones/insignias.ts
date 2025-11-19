import { supabase } from '../lib/supabase'

const todas_insignias = async () => {
    
    let { data: Insignias, error } = await supabase
        .from('Insignias')
        .select('*');
    if (error) throw error
    return Insignias
}

export {todas_insignias}