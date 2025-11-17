import { supabase } from '../lib/supabase'

const prueba_pfp = async () => {
    
let { data: Avatar, error } = await supabase
  .from('Avatar')
  .select('*')
    if (error) throw error
    return Avatar
}

const my_avatar = async (id:number) => {
    let { data: Avatar, error } = await supabase
        .from('Users')
        .select('*, Avatar(*)')
        .eq("id",id)
        .single()
    if (error) throw error;
    return Avatar
}
export {prueba_pfp, my_avatar}