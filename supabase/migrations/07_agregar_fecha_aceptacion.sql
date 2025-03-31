-- Agregar campo fecha_aceptacion a la tabla de ofertas
ALTER TABLE ofertas 
ADD COLUMN IF NOT EXISTS fecha_aceptacion TIMESTAMP WITH TIME ZONE;

-- Agregar campo notificacion_leida para rastrear si la notificación ha sido vista
ALTER TABLE ofertas 
ADD COLUMN IF NOT EXISTS notificacion_leida BOOLEAN DEFAULT FALSE;

-- Comentarios para documentar los cambios
COMMENT ON COLUMN ofertas.fecha_aceptacion IS 'Fecha y hora en que la oferta fue aceptada por el usuario';
COMMENT ON COLUMN ofertas.notificacion_leida IS 'Indica si la notificación de aceptación ha sido vista por el banco';
