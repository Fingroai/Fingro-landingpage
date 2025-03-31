// Este script crea un usuario para el banco de ejemplo
// Ejecutar con: node crear-usuario-banco.js

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
      email: 'banco@ejemplo.com',
      password: 'password123',
    });

    if (authError) {
      throw authError;
    }

    console.log('Usuario creado con éxito:', authData.user.id);

    // 2. Actualizar el banco con el ID del usuario
    const { data: updateData, error: updateError } = await supabase
      .from('bancos')
      .update({ user_id: authData.user.id })
      .eq('nombre', 'Banco Ejemplo')
      .select();

    if (updateError) {
      throw updateError;
    }

    console.log('Banco actualizado con éxito:', updateData);

    console.log('\nInstrucciones:');
    console.log('1. Ve a tu bandeja de entrada y confirma el correo electrónico');
    console.log('2. Inicia sesión en el panel de bancos con:');
    console.log('   - Email: banco@ejemplo.com');
    console.log('   - Contraseña: password123');

  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
