-- Agregar campo NIT a la tabla de solicitudes
ALTER TABLE solicitudes 
ADD COLUMN IF NOT EXISTS nit TEXT;

-- Actualizar las políticas de seguridad para incluir el nuevo campo
-- Asegurar que los usuarios puedan ver sus propias solicitudes con el campo NIT
CREATE POLICY IF NOT EXISTS "Los usuarios pueden ver sus propias solicitudes" ON solicitudes
  FOR SELECT USING (auth.uid() = user_id);

-- Asegurar que los usuarios puedan actualizar sus propias solicitudes incluyendo el campo NIT
CREATE POLICY IF NOT EXISTS "Los usuarios pueden actualizar sus propias solicitudes" ON solicitudes
  FOR UPDATE USING (auth.uid() = user_id);

-- Comentario para documentar el cambio
COMMENT ON COLUMN solicitudes.nit IS 'Número de Identificación Tributaria del solicitante';
