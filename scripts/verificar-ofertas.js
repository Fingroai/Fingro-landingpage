// Este script verifica las ofertas en la base de datos y ayuda a diagnosticar problemas
// Ejecutar con: node verificar-ofertas.js

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
    console.log('=== Verificación de Ofertas en Supabase ===\n');

    // 1. Verificar solicitudes existentes
    console.log('Verificando solicitudes...');
    const { data: solicitudes, error: errorSolicitudes } = await supabase
      .from('solicitudes')
      .select('*')
      .order('created_at', { ascending: false });

    if (errorSolicitudes) {
      throw new Error(`Error al obtener solicitudes: ${errorSolicitudes.message}`);
    }

    console.log(`Se encontraron ${solicitudes.length} solicitudes.`);
    
    if (solicitudes.length === 0) {
      console.log('No hay solicitudes en la base de datos. Primero debes crear una solicitud.');
      return;
    }

    // Mostrar las últimas 3 solicitudes
    console.log('\nÚltimas solicitudes:');
    solicitudes.slice(0, 3).forEach((sol, index) => {
      console.log(`${index + 1}. ID: ${sol.id} | Estado: ${sol.estado} | Tiene ofertas: ${sol.tiene_ofertas}`);
    });

    // 2. Verificar ofertas existentes
    console.log('\nVerificando todas las ofertas...');
    const { data: todasOfertas, error: errorTodasOfertas } = await supabase
      .from('ofertas')
      .select('*')
      .order('created_at', { ascending: false });

    if (errorTodasOfertas) {
      throw new Error(`Error al obtener ofertas: ${errorTodasOfertas.message}`);
    }

    console.log(`Se encontraron ${todasOfertas.length} ofertas en total.`);

    // Mostrar las últimas 5 ofertas
    if (todasOfertas.length > 0) {
      console.log('\nÚltimas ofertas creadas:');
      todasOfertas.slice(0, 5).forEach((oferta, index) => {
        console.log(`${index + 1}. ID: ${oferta.id} | Solicitud: ${oferta.solicitud_id} | Banco: ${oferta.banco_nombre} | Estado: ${oferta.estado}`);
      });
    } else {
      console.log('No hay ofertas en la base de datos.');
    }

    // 3. Verificar ofertas para la última solicitud
    const ultimaSolicitud = solicitudes[0];
    console.log(`\nVerificando ofertas para la última solicitud (ID: ${ultimaSolicitud.id})...`);
    
    const { data: ofertasUltimaSolicitud, error: errorOfertasUltima } = await supabase
      .from('ofertas')
      .select('*')
      .eq('solicitud_id', ultimaSolicitud.id)
      .order('created_at', { ascending: false });

    if (errorOfertasUltima) {
      throw new Error(`Error al obtener ofertas para la última solicitud: ${errorOfertasUltima.message}`);
    }

    console.log(`Se encontraron ${ofertasUltimaSolicitud.length} ofertas para la última solicitud.`);
    
    if (ofertasUltimaSolicitud.length > 0) {
      console.log('\nOfertas para la última solicitud:');
      ofertasUltimaSolicitud.forEach((oferta, index) => {
        console.log(`${index + 1}. ID: ${oferta.id} | Banco: ${oferta.banco_nombre} | Monto: ${oferta.monto} | Estado: ${oferta.estado}`);
      });

      // Verificar si el estado de la solicitud está actualizado correctamente
      if (!ultimaSolicitud.tiene_ofertas) {
        console.log('\n⚠️ PROBLEMA DETECTADO: La solicitud tiene ofertas pero el campo tiene_ofertas está en FALSE');
        console.log('Actualizando el campo tiene_ofertas...');
        
        const { error: errorUpdate } = await supabase
          .from('solicitudes')
          .update({ tiene_ofertas: true })
          .eq('id', ultimaSolicitud.id);
        
        if (errorUpdate) {
          console.log(`Error al actualizar solicitud: ${errorUpdate.message}`);
        } else {
          console.log('✅ Solicitud actualizada correctamente.');
        }
      }
    } else {
      console.log('No hay ofertas para la última solicitud.');
    }

    console.log('\n=== Diagnóstico ===');
    if (todasOfertas.length === 0) {
      console.log('❌ No hay ofertas en la base de datos. Debes crear ofertas desde el panel de banco.');
    } else if (ofertasUltimaSolicitud.length === 0) {
      console.log('❌ La última solicitud no tiene ofertas. Debes crear ofertas para esta solicitud desde el panel de banco.');
    } else if (!ultimaSolicitud.tiene_ofertas) {
      console.log('⚠️ La solicitud tiene ofertas pero el campo tiene_ofertas estaba en FALSE (ya se corrigió).');
    } else {
      console.log('✅ Todo parece estar correcto. Verifica la página de ofertas para ver si se muestran las ofertas.');
    }

    console.log('\n=== Recomendaciones ===');
    console.log('1. Ejecuta el script para corregir las políticas de seguridad (05_corregir_politicas_ofertas.sql)');
    console.log('2. Asegúrate de estar viendo las ofertas para la solicitud correcta');
    console.log('3. Verifica la consola del navegador para ver los mensajes de depuración');

  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
