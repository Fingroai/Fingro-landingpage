const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Middleware para verificar autenticación del banco
const authenticateBank = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Autenticación requerida' });
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verificar que el token pertenece a un banco
    if (decoded.role !== 'bank') {
      return res.status(403).json({ message: 'Acceso no autorizado' });
    }
    
    req.bank = decoded;
    next();
  } catch (error) {
    console.error('Error de autenticación:', error);
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

// Autenticación de banco
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Autenticar con Supabase
    const { data, error } = await req.supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    
    // Obtener información del banco
    const { data: bankData, error: bankError } = await req.supabase
      .from('bancos')
      .select('*')
      .eq('user_id', data.user.id)
      .single();
    
    if (bankError) throw bankError;
    
    if (!bankData) {
      return res.status(404).json({ message: 'Banco no encontrado' });
    }
    
    // Generar JWT
    const token = jwt.sign(
      { 
        id: bankData.id, 
        name: bankData.nombre,
        role: 'bank',
        user_id: data.user.id
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      token,
      bank: {
        id: bankData.id,
        nombre: bankData.nombre,
        email: bankData.email
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(401).json({ message: 'Credenciales inválidas', error: error.message });
  }
});

// Obtener leads disponibles para el banco
router.get('/leads', authenticateBank, async (req, res) => {
  try {
    const bankId = req.bank.id;
    
    // Obtener leads que cumplan con los criterios del banco
    const { data: bankCriteria, error: criteriaError } = await req.supabase
      .from('banco_criterios')
      .select('*')
      .eq('banco_id', bankId)
      .single();
    
    if (criteriaError && criteriaError.code !== 'PGRST116') throw criteriaError;
    
    let query = req.supabase
      .from('leads')
      .select('*')
      .eq('status', 'pending');
    
    // Aplicar filtros según criterios del banco si existen
    if (bankCriteria) {
      if (bankCriteria.min_score) {
        query = query.gte('score', bankCriteria.min_score);
      }
      
      if (bankCriteria.max_monto) {
        query = query.lte('monto_solicitado', bankCriteria.max_monto);
      }
      
      // Otros filtros según criterios
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    console.error('Error al obtener leads para banco:', error);
    res.status(500).json({ error: error.message });
  }
});

// Crear una oferta para un lead
router.post('/leads/:leadId/ofertas', authenticateBank, async (req, res) => {
  try {
    const { leadId } = req.params;
    const bankId = req.bank.id;
    const { monto_ofertado, plazo, tasa, cuota_aproximada, validez } = req.body;
    
    // Validar datos requeridos
    if (!monto_ofertado || !plazo || !tasa || !cuota_aproximada || !validez) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }
    
    // Verificar que el lead existe
    const { data: leadData, error: leadError } = await req.supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single();
    
    if (leadError) throw leadError;
    
    if (!leadData) {
      return res.status(404).json({ message: 'Lead no encontrado' });
    }
    
    // Crear la oferta
    const nuevaOferta = {
      lead_id: leadId,
      banco_id: bankId,
      monto_ofertado,
      plazo,
      tasa,
      cuota_aproximada,
      validez,
      status: 'pending',
      created_at: new Date().toISOString()
    };
    
    const { data, error } = await req.supabase
      .from('ofertas')
      .insert([nuevaOferta])
      .select();
    
    if (error) throw error;
    
    // Notificar al usuario (implementación posterior)
    // TODO: Implementar notificación al usuario
    
    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Error al crear oferta:', error);
    res.status(500).json({ error: error.message });
  }
});

// Registrar desembolso
router.post('/desembolso', authenticateBank, async (req, res) => {
  try {
    const { id_lead, monto, fecha } = req.body;
    const bankId = req.bank.id;
    
    // Validar datos requeridos
    if (!id_lead || !monto) {
      return res.status(400).json({ message: 'ID de lead y monto son requeridos' });
    }
    
    // Verificar que existe una oferta aceptada
    const { data: ofertaData, error: ofertaError } = await req.supabase
      .from('ofertas')
      .select('*')
      .eq('lead_id', id_lead)
      .eq('banco_id', bankId)
      .eq('status', 'accepted')
      .single();
    
    if (ofertaError && ofertaError.code !== 'PGRST116') throw ofertaError;
    
    if (!ofertaData) {
      return res.status(404).json({ message: 'No existe una oferta aceptada para este lead' });
    }
    
    // Registrar desembolso
    const desembolso = {
      lead_id: id_lead,
      banco_id: bankId,
      oferta_id: ofertaData.id,
      monto,
      fecha: fecha || new Date().toISOString(),
      created_at: new Date().toISOString()
    };
    
    const { data, error } = await req.supabase
      .from('desembolsos')
      .insert([desembolso])
      .select();
    
    if (error) throw error;
    
    // Actualizar estado del lead
    await req.supabase
      .from('leads')
      .update({ status: 'completed', updated_at: new Date().toISOString() })
      .eq('id', id_lead);
    
    // Actualizar estado de la oferta
    await req.supabase
      .from('ofertas')
      .update({ status: 'completed', updated_at: new Date().toISOString() })
      .eq('id', ofertaData.id);
    
    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Error al registrar desembolso:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
