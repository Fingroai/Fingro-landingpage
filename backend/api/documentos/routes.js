const express = require('express');
const router = express.Router();
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

// Configuración de multer para almacenamiento temporal
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB máximo
  fileFilter: (req, file, cb) => {
    // Permitir solo ciertos tipos de archivo
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Tipo de archivo no permitido. Solo se aceptan PDF, JPEG y PNG.'));
    }
    cb(null, true);
  }
});

// Middleware para verificar autenticación del usuario
// TODO: Implementar middleware de autenticación

// Subir documento
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se ha proporcionado ningún archivo' });
    }

    const { leadId, tipo } = req.body;
    
    if (!leadId || !tipo) {
      return res.status(400).json({ message: 'leadId y tipo son campos requeridos' });
    }
    
    // Generar nombre único para el archivo
    const fileExt = path.extname(req.file.originalname);
    const fileName = `${leadId}/${tipo}_${uuidv4()}${fileExt}`;
    
    // Subir a Supabase Storage
    const { data, error } = await req.supabase
      .storage
      .from('documentos')
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        cacheControl: '3600'
      });
    
    if (error) throw error;
    
    // Generar URL firmada para acceso temporal
    const { data: urlData, error: urlError } = await req.supabase
      .storage
      .from('documentos')
      .createSignedUrl(fileName, 60 * 60 * 24); // 24 horas
    
    if (urlError) throw urlError;
    
    // Registrar documento en la base de datos
    const documento = {
      lead_id: leadId,
      tipo,
      nombre_original: req.file.originalname,
      path: fileName,
      tamano: req.file.size,
      mime_type: req.file.mimetype,
      created_at: new Date().toISOString()
    };
    
    const { data: docData, error: docError } = await req.supabase
      .from('documentos')
      .insert([documento])
      .select();
    
    if (docError) throw docError;
    
    res.status(201).json({
      id: docData[0].id,
      url: urlData.signedUrl,
      nombre: req.file.originalname,
      tipo
    });
  } catch (error) {
    console.error('Error al subir documento:', error);
    res.status(500).json({ error: error.message });
  }
});

// Obtener documentos de un lead
router.get('/lead/:leadId', async (req, res) => {
  try {
    const { leadId } = req.params;
    
    // Verificar permisos (implementación posterior)
    // TODO: Verificar que el usuario tiene permisos para ver estos documentos
    
    const { data, error } = await req.supabase
      .from('documentos')
      .select('*')
      .eq('lead_id', leadId);
    
    if (error) throw error;
    
    // Generar URLs firmadas para cada documento
    const documentosConUrl = await Promise.all(data.map(async (doc) => {
      const { data: urlData, error: urlError } = await req.supabase
        .storage
        .from('documentos')
        .createSignedUrl(doc.path, 60 * 60); // 1 hora
      
      if (urlError) throw urlError;
      
      return {
        ...doc,
        url: urlData.signedUrl
      };
    }));
    
    res.json(documentosConUrl);
  } catch (error) {
    console.error('Error al obtener documentos:', error);
    res.status(500).json({ error: error.message });
  }
});

// Eliminar documento
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Obtener información del documento
    const { data: docData, error: docError } = await req.supabase
      .from('documentos')
      .select('*')
      .eq('id', id)
      .single();
    
    if (docError) throw docError;
    
    if (!docData) {
      return res.status(404).json({ message: 'Documento no encontrado' });
    }
    
    // Verificar permisos (implementación posterior)
    // TODO: Verificar que el usuario tiene permisos para eliminar este documento
    
    // Eliminar archivo de Storage
    const { error: storageError } = await req.supabase
      .storage
      .from('documentos')
      .remove([docData.path]);
    
    if (storageError) throw storageError;
    
    // Eliminar registro de la base de datos
    const { error: deleteError } = await req.supabase
      .from('documentos')
      .delete()
      .eq('id', id);
    
    if (deleteError) throw deleteError;
    
    res.json({ message: 'Documento eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar documento:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
