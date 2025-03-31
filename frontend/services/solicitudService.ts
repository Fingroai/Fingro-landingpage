import { supabase } from '../lib/supabase';
import { FormData } from '../components/Formulario/FormContext';

// Función para calcular el score crediticio basado en los datos del formulario
export const calcularScore = (formData: FormData): number => {
  let score = 0;
  
  // Factores positivos
  
  // Ingresos mensuales
  if (formData.ingreso_mensual) {
    if (formData.ingreso_mensual > 15000) score += 30;
    else if (formData.ingreso_mensual > 10000) score += 25;
    else if (formData.ingreso_mensual > 7000) score += 20;
    else if (formData.ingreso_mensual > 5000) score += 15;
    else if (formData.ingreso_mensual > 3000) score += 10;
    else score += 5;
  }
  
  // Nivel educativo
  if (formData.nivel_educativo) {
    if (formData.nivel_educativo === 'Postgrado/Maestría') score += 15;
    else if (formData.nivel_educativo === 'Graduado universitario') score += 12;
    else if (formData.nivel_educativo === 'Universidad incompleta') score += 10;
    else if (formData.nivel_educativo === 'Secundaria') score += 8;
    else if (formData.nivel_educativo === 'Primaria') score += 5;
  }
  
  // Tipo de vivienda
  if (formData.tipo_vivienda) {
    if (formData.tipo_vivienda === 'Propia sin hipoteca') score += 15;
    else if (formData.tipo_vivienda === 'Propia con hipoteca') score += 10;
    else if (formData.tipo_vivienda === 'Rentada') score += 5;
  }
  
  // Ahorros
  if (formData.ahorros) {
    if (formData.ahorros > 50000) score += 20;
    else if (formData.ahorros > 20000) score += 15;
    else if (formData.ahorros > 10000) score += 10;
    else if (formData.ahorros > 5000) score += 5;
  }
  
  // Antigüedad laboral
  if (formData.antiguedad) {
    if (formData.antiguedad > 10) score += 20;
    else if (formData.antiguedad > 5) score += 15;
    else if (formData.antiguedad > 3) score += 10;
    else if (formData.antiguedad > 1) score += 5;
  }
  
  // Factores negativos
  
  // Nuevos préstamos recientes
  if (formData.nuevos_prestamos_3meses) {
    score -= 10;
  }
  
  // Otras deudas
  if (formData.otras_deudas && formData.monto_deuda && formData.ingreso_mensual) {
    const ratioDeuda = formData.monto_deuda / formData.ingreso_mensual;
    if (ratioDeuda > 0.5) score -= 20;
    else if (ratioDeuda > 0.3) score -= 15;
    else if (ratioDeuda > 0.2) score -= 10;
    else if (ratioDeuda > 0.1) score -= 5;
  }
  
  // Limitar el score entre 0 y 100
  return Math.max(0, Math.min(100, score));
};

// Función para guardar una solicitud en Supabase
export const guardarSolicitud = async (formData: FormData) => {
  try {
    console.log('Guardando solicitud para:', formData.correo);
    
    // Calcular el score
    const score = calcularScore(formData);
    
    // Preparar los datos para guardar
    const solicitudData = {
      ...formData,
      score,
      estado: 'pendiente',
      tiene_ofertas: false
    };
    
    // Verificar si el usuario ya existe en auth
    const { data: existingUsers } = await supabase
      .from('users')
      .select('id')
      .eq('email', formData.correo)
      .limit(1);
    
    let userId = null;
    
    // Si el usuario no existe, crear un usuario en auth
    if (!existingUsers || existingUsers.length === 0) {
      console.log('Creando usuario para:', formData.correo);
      
      // Enviar enlace mágico para iniciar sesión sin contraseña
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email: formData.correo,
        options: {
          emailRedirectTo: `${window.location.origin}/ofertas`,
        },
      });
      
      if (signInError) {
        console.error('Error al enviar enlace de acceso:', signInError);
      } else {
        console.log('Enlace de acceso enviado a:', formData.correo);
      }
    }
    
    // Guardar en Supabase
    const { data, error } = await supabase
      .from('solicitudes')
      .insert([solicitudData])
      .select();
    
    if (error) throw error;
    
    console.log('Solicitud guardada con éxito, ID:', data[0].id);
    
    return { data, error: null };
  } catch (error) {
    console.error('Error al guardar la solicitud:', error);
    return { data: null, error };
  }
};

// Función para obtener una solicitud por ID
export const obtenerSolicitud = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('solicitudes')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error('Error al obtener la solicitud:', error);
    return { data: null, error };
  }
};
