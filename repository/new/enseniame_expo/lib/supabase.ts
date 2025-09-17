import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://apjepniceyfghladqqxg.supabase.co";
const supabasePublishableKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwamVwbmljZXlmZ2hsYWRxcXhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NjE5NjcsImV4cCI6MjA3MzQzNzk2N30.gVnCO7ALvbF3Zol9k-R6k-CyPDh8-7KjJiqRuU5YVRk"

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})