import { createClient } from '@supabase/supabase-js';

// Obtener las variables de entorno con valores predeterminados para la landing page
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-supabase-url.com';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

// Crear un cliente de Supabase con manejo de errores para la landing page
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // No persistir la sesión en la landing page
  }
});

// Función para obtener un cliente de Supabase con la clave de servicio
export const getServiceSupabase = () => {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || 'placeholder-service-key';
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false, // No persistir la sesión en la landing page
    }
  });
};
