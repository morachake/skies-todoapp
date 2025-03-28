import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://yrjqbqqdsieikbxkqlvq.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlyanFicXFkc2llaWtieGtxbHZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwNjI1MDMsImV4cCI6MjA1ODYzODUwM30.isNCj96Fjs1AEmYge9rk16m7v0JKseNIZmaAFArE1QA";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
