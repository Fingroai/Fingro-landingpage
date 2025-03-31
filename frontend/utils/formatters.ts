/**
 * Utilidades para formatear valores en la aplicación
 */

/**
 * Formatea un número como moneda en Quetzales (Q)
 * @param value - El valor numérico a formatear
 * @param includeSymbol - Si se debe incluir el símbolo Q (por defecto: true)
 * @returns String formateado como moneda (ej: "Q 1,234.56")
 */
export const formatCurrency = (value: number | undefined | null, includeSymbol = true): string => {
  if (value === undefined || value === null) return includeSymbol ? 'Q 0.00' : '0.00';
  
  const formatter = new Intl.NumberFormat('es-GT', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  const formattedValue = formatter.format(value);
  return includeSymbol ? `Q ${formattedValue}` : formattedValue;
};

/**
 * Convierte un string formateado como moneda a un número
 * @param formattedValue - El string formateado (ej: "Q 1,234.56")
 * @returns Valor numérico
 */
export const parseCurrency = (formattedValue: string): number => {
  if (!formattedValue) return 0;
  
  // Eliminar el símbolo Q y cualquier espacio
  const cleanValue = formattedValue.replace(/[Q\s,]/g, '');
  
  // Convertir a número
  const numericValue = parseFloat(cleanValue);
  return isNaN(numericValue) ? 0 : numericValue;
};
