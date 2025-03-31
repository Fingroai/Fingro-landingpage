const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const scoringService = require('../scoring/service');

// Obtener todos los leads (para bancos autorizados)
router.get('/', async (req, res) => {
  try {
    // Verificar autenticación del banco (JWT)
    // TODO: Implementar middleware de autenticación
    
    const { data, error } = await req.supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    console.error('Error al obtener leads:', error);
    res.status(500).json({ error: error.message });
  }
});

// Obtener un lead específico por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await req.supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (!data) {
      return res.status(404).json({ message: 'Lead no encontrado' });
    }
    
    res.json(data);
  } catch (error) {
    console.error('Error al obtener lead:', error);
    res.status(500).json({ error: error.message });
  }
});

// Crear un nuevo lead (desde el formulario)
router.post('/', async (req, res) => {
  try {
    const leadData = req.body;
    
    // Generar ID único
    const leadId = uuidv4();
    
    // Calcular score
    const score = await scoringService.calculateScore(leadData);
    
    // Preparar datos para inserción
    const newLead = {
      id: leadId,
      ...leadData,
      score,
      status: 'pending',
      created_at: new Date().toISOString()
    };
    
    // Insertar en Supabase
    const { data, error } = await req.supabase
      .from('leads')
      .insert([newLead])
      .select();
    
    if (error) throw error;
    
    // Notificar a bancos (implementación posterior)
    // TODO: Implementar notificación a bancos
    
    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Error al crear lead:', error);
    res.status(500).json({ error: error.message });
  }
});

// Actualizar estado de un lead
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['pending', 'reviewing', 'approved', 'rejected', 'completed'].includes(status)) {
      return res.status(400).json({ message: 'Estado no válido' });
    }
    
    const { data, error } = await req.supabase
      .from('leads')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    if (data.length === 0) {
      return res.status(404).json({ message: 'Lead no encontrado' });
    }
    
    res.json(data[0]);
  } catch (error) {
    console.error('Error al actualizar estado del lead:', error);
    res.status(500).json({ error: error.message });
  }
});

// Obtener ofertas para un lead específico
router.get('/:id/ofertas', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await req.supabase
      .from('ofertas')
      .select('*, banco:bancos(*)')
      .eq('lead_id', id);
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    console.error('Error al obtener ofertas:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
