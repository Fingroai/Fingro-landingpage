// Este script crea un usuario para el banco con el correo fingro.tech@gmail.com
// Ejecutar con: node crear-usuario-banco-fingro.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '../frontend/.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Variables de entorno de Supabase no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  try {
    // 1. Crear un usuario para el banco
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'fingro.tech@gmail.com',
      password: 'Fingro2025', // Contraseña segura para el usuario
    });

    if (authError) {
      throw authError;
    }

    console.log('Usuario creado con éxito:', authData.user.id);

    // 2. Crear un nuevo banco para este usuario
    const { data: bancoData, error: bancoError } = await supabase
      .from('bancos')
      .insert([
        {
          user_id: authData.user.id,
          nombre: 'Banco Fingro Tech',
          logo: '/images/banco_fingro.png'
        }
      ])
      .select();

    if (bancoError) {
      throw bancoError;
    }

    console.log('Banco creado con éxito:', bancoData);

    console.log('\nInstrucciones:');
    console.log('1. Ve a tu bandeja de entrada (fingro.tech@gmail.com) y confirma el correo electrónico');
    console.log('2. Inicia sesión en el panel de bancos con:');
    console.log('   - Email: fingro.tech@gmail.com');
    console.log('   - Contraseña: Fingro2025');

  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
