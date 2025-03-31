/**
 * Utilidades generales para la aplicación Fingro
 */

/**
 * Formatea un número como moneda
 * @param {Number} amount - Cantidad a formatear
 * @param {String} currency - Código de moneda (por defecto GTQ)
 * @returns {String} - Cantidad formateada como moneda
 */
const formatCurrency = (amount, currency = 'GTQ') => {
  return new Intl.NumberFormat('es-GT', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2
  }).format(amount);
};

/**
 * Genera un ID único para transacciones
 * @param {String} prefix - Prefijo para el ID (opcional)
 * @returns {String} - ID único
 */
const generateTransactionId = (prefix = 'TRX') => {
  const timestamp = new Date().getTime().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}_${randomStr}`.toUpperCase();
};

/**
 * Valida un correo electrónico
 * @param {String} email - Correo a validar
 * @returns {Boolean} - true si es válido, false si no
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida un número de teléfono (formato guatemalteco)
 * @param {String} phone - Teléfono a validar
 * @returns {Boolean} - true si es válido, false si no
 */
const isValidPhone = (phone) => {
  const phoneRegex = /^[2-9]\d{7}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

/**
 * Valida un número de DPI (Guatemala)
 * @param {String} dpi - DPI a validar
 * @returns {Boolean} - true si es válido, false si no
 */
const isValidDPI = (dpi) => {
  // Eliminar caracteres no numéricos
  const cleanDPI = dpi.replace(/\D/g, '');
  
  // DPI debe tener 13 dígitos
  if (cleanDPI.length !== 13) {
    return false;
  }
  
  // Implementación básica de validación
  // En una implementación real, se podría agregar verificación de municipio y departamento
  return true;
};

/**
 * Calcula la edad a partir de una fecha de nacimiento
 * @param {String|Date} birthDate - Fecha de nacimiento
 * @returns {Number} - Edad en años
 */
const calculateAge = (birthDate) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

/**
 * Sanitiza un texto para prevenir inyección
 * @param {String} text - Texto a sanitizar
 * @returns {String} - Texto sanitizado
 */
const sanitizeText = (text) => {
  if (!text) return '';
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

module.exports = {
  formatCurrency,
  generateTransactionId,
  isValidEmail,
  isValidPhone,
  isValidDPI,
  calculateAge,
  sanitizeText
};
