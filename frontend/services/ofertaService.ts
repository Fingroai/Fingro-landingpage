import { supabase } from '../lib/supabase';

// Obtener ofertas para una solicitud específica
export const obtenerOfertasPorSolicitud = async (solicitudId: string) => {
  try {
    console.log('Obteniendo ofertas para solicitud:', solicitudId);
    
    // Obtener todas las ofertas para la solicitud, sin filtrar por estado
    const { data, error } = await supabase
      .from('ofertas')
      .select('*')
      .eq('solicitud_id', solicitudId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    console.log('Ofertas encontradas:', data?.length || 0);
    return { data, error: null };
  } catch (error) {
    console.error('Error al obtener ofertas:', error);
    return { data: null, error };
  }
};

// Aceptar una oferta
export const aceptarOferta = async (ofertaId: string, solicitudId: string) => {
  try {
    const fechaAceptacion = new Date().toISOString();
    
    // Primero actualizamos la oferta seleccionada a 'aceptada' y registramos la fecha de aceptación
    const { error: errorOferta } = await supabase
      .from('ofertas')
      .update({ 
        estado: 'aceptada',
        fecha_aceptacion: fechaAceptacion,
        notificacion_leida: false // Marcar como no leída para que aparezca como notificación
      })
      .eq('id', ofertaId);
    
    if (errorOferta) throw errorOferta;
    
    // Luego actualizamos las demás ofertas a 'rechazada'
    const { error: errorOtrasOfertas } = await supabase
      .from('ofertas')
      .update({ estado: 'rechazada' })
      .eq('solicitud_id', solicitudId)
      .neq('id', ofertaId);
    
    if (errorOtrasOfertas) throw errorOtrasOfertas;
    
    // Finalmente actualizamos el estado de la solicitud
    const { error: errorSolicitud } = await supabase
      .from('solicitudes')
      .update({ 
        estado: 'oferta_aceptada',
        fecha_aceptacion: fechaAceptacion
      })
      .eq('id', solicitudId);
    
    if (errorSolicitud) throw errorSolicitud;
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error al aceptar oferta:', error);
    return { success: false, error };
  }
};

// Obtener detalles de una oferta específica
export const obtenerDetalleOferta = async (ofertaId: string) => {
  try {
    const { data, error } = await supabase
      .from('ofertas')
      .select('*')
      .eq('id', ofertaId)
      .single();
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error al obtener detalle de oferta:', error);
    return { data: null, error };
  }
};

// Obtener todas las ofertas para un banco
export const obtenerOfertasPorBanco = async (bancoId: string) => {
  try {
    const { data, error } = await supabase
      .from('ofertas')
      .select('*, solicitudes(*)')
      .eq('banco_id', bancoId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error al obtener ofertas del banco:', error);
    return { data: null, error };
  }
};
