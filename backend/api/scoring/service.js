/**
 * Servicio de scoring para Fingro
 * Calcula un puntaje crediticio basado en los datos del usuario
 */

// Pesos para diferentes factores
const WEIGHTS = {
  ingresos_mensuales: 0.35,
  tipo_vivienda: 0.15,
  estado_laboral: 0.25,
  situacion_financiera: 0.25
};

// Valores base para diferentes categorías
const INCOME_SCORE = {
  min: 20,
  max: 100,
  threshold: 10000 // Ingreso que obtendría puntaje máximo
};

const HOUSING_SCORE = {
  'propia': 100,
  'familiar': 80,
  'alquilada': 60,
  'hipotecada': 70,
  'otro': 40
};

const EMPLOYMENT_SCORE = {
  'empleado_tiempo_completo': 100,
  'empleado_tiempo_parcial': 70,
  'autonomo': 80,
  'empresario': 90,
  'estudiante': 50,
  'jubilado': 60,
  'desempleado': 20,
  'otro': 30
};

/**
 * Calcula el puntaje crediticio basado en los datos del usuario
 * @param {Object} userData - Datos del usuario
 * @returns {Number} - Puntaje crediticio (0-100)
 */
const calculateScore = async (userData) => {
  try {
    // Calcular score de ingresos (escala lineal)
    const incomeScore = calculateIncomeScore(userData.ingresos_mensuales);
    
    // Calcular score de vivienda
    const housingScore = HOUSING_SCORE[userData.tipo_vivienda] || HOUSING_SCORE.otro;
    
    // Calcular score de empleo
    const employmentScore = EMPLOYMENT_SCORE[userData.estado_laboral] || EMPLOYMENT_SCORE.otro;
    
    // Calcular score de situación financiera
    const financialScore = calculateFinancialScore(userData);
    
    // Calcular score ponderado
    const weightedScore = (
      incomeScore * WEIGHTS.ingresos_mensuales +
      housingScore * WEIGHTS.tipo_vivienda +
      employmentScore * WEIGHTS.estado_laboral +
      financialScore * WEIGHTS.situacion_financiera
    );
    
    // Redondear a entero
    return Math.round(weightedScore);
  } catch (error) {
    console.error('Error al calcular score:', error);
    // En caso de error, devolver un score conservador
    return 50;
  }
};

/**
 * Calcula el puntaje basado en los ingresos mensuales
 * @param {Number} income - Ingresos mensuales
 * @returns {Number} - Puntaje (0-100)
 */
const calculateIncomeScore = (income) => {
  if (!income || income <= 0) return 0;
  
  // Escala lineal entre min y max
  const score = INCOME_SCORE.min + (
    (income / INCOME_SCORE.threshold) * (INCOME_SCORE.max - INCOME_SCORE.min)
  );
  
  // Limitar a max
  return Math.min(score, INCOME_SCORE.max);
};

/**
 * Calcula el puntaje basado en la situación financiera
 * @param {Object} userData - Datos del usuario
 * @returns {Number} - Puntaje (0-100)
 */
const calculateFinancialScore = (userData) => {
  let score = 70; // Puntaje base
  
  // Factores positivos
  if (userData.ahorros && userData.ahorros > 0) {
    score += 10;
  }
  
  if (userData.cuentas_inversion && userData.cuentas_inversion > 0) {
    score += 10;
  }
  
  // Factores negativos
  if (userData.nuevos_prestamos_3meses) {
    score -= 15;
  }
  
  if (userData.otras_deudas && userData.monto_deuda) {
    // Calcular ratio deuda/ingreso
    const debtIncomeRatio = userData.monto_deuda / (userData.ingresos_mensuales * 12);
    
    if (debtIncomeRatio > 0.5) {
      score -= 30;
    } else if (debtIncomeRatio > 0.3) {
      score -= 20;
    } else if (debtIncomeRatio > 0.1) {
      score -= 10;
    }
  }
  
  // Limitar entre 0 y 100
  return Math.max(0, Math.min(100, score));
};

module.exports = {
  calculateScore
};
