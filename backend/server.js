require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const leadsRoutes = require('./api/leads/routes');
const bancosRoutes = require('./api/bancos/routes');
const scoringRoutes = require('./api/scoring/routes');
const documentosRoutes = require('./api/documentos/routes');

// Inicializar Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Crear app Express
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Middleware para inyectar cliente de Supabase en las solicitudes
app.use((req, res, next) => {
  req.supabase = supabase;
  next();
});

// Rutas
app.use('/api/leads', leadsRoutes);
app.use('/api/bancos', bancosRoutes);
app.use('/api/scoring', scoringRoutes);
app.use('/api/documentos', documentosRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API de Fingro funcionando correctamente' });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: true,
    message: 'Error interno del servidor',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});

module.exports = app;
