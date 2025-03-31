const express = require('express');
const router = express.Router();
const scoringService = require('./service');

// Calcular score para un conjunto de datos
router.post('/calculate', async (req, res) => {
  try {
    const userData = req.body;
    
    // Validar datos mínimos requeridos
    if (!userData.ingresos_mensuales || !userData.tipo_vivienda || !userData.estado_laboral) {
      return res.status(400).json({ 
        message: 'Datos insuficientes para calcular score',
        required: ['ingresos_mensuales', 'tipo_vivienda', 'estado_laboral']
      });
    }
    
    const score = await scoringService.calculateScore(userData);
    
    res.json({ score });
  } catch (error) {
    console.error('Error al calcular score:', error);
    res.status(500).json({ error: error.message });
  }
});

// Obtener reglas de scoring (solo para administradores)
router.get('/rules', async (req, res) => {
  try {
    // TODO: Implementar middleware de autenticación para administradores
    
    const { data, error } = await req.supabase
      .from('scoring_rules')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    console.error('Error al obtener reglas de scoring:', error);
    res.status(500).json({ error: error.message });
  }
});

// Crear o actualizar regla de scoring (solo para administradores)
router.post('/rules', async (req, res) => {
  try {
    // TODO: Implementar middleware de autenticación para administradores
    
    const { field, condition, value, score_value } = req.body;
    
    // Validar datos requeridos
    if (!field || !condition || value === undefined || score_value === undefined) {
      return res.status(400).json({ 
        message: 'Todos los campos son requeridos',
        required: ['field', 'condition', 'value', 'score_value']
      });
    }
    
    const newRule = {
      field,
      condition,
      value,
      score_value,
      created_at: new Date().toISOString()
    };
    
    const { data, error } = await req.supabase
      .from('scoring_rules')
      .insert([newRule])
      .select();
    
    if (error) throw error;
    
    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Error al crear regla de scoring:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
