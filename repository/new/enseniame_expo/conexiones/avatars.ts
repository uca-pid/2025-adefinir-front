import { supabase } from '../lib/supabase'

const my_avatar = async (id:number) => {
    let { data: Avatar, error } = await supabase
        .from('Users')
        .select('*, Avatar(*)')
        .eq("id",id)
        .single()
    if (error) throw error;
    return Avatar
}

const todos_avatares = async () => {
    let { data: Avatar, error } = await supabase
        .from('Avatar')
        .select('*')                
    if (error) throw error;
    return Avatar
}

export { my_avatar, todos_avatares}