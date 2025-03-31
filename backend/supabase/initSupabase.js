const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

/**
 * Inicializa y configura el cliente de Supabase
 * @returns {Object} Cliente de Supabase configurado
 */
const initSupabase = () => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Variables de entorno SUPABASE_URL y SUPABASE_ANON_KEY son requeridas');
  }
  
  return createClient(supabaseUrl, supabaseKey);
};

module.exports = initSupabase;
