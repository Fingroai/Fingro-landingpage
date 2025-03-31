-- Este script vincula un usuario existente con el banco de ejemplo
-- Reemplaza 'ID_DEL_USUARIO_AQUÍ' con el ID real del usuario que creaste en Supabase

-- Actualizar el banco con el ID del usuario
UPDATE bancos
SET user_id = 'ID_DEL_USUARIO_AQUÍ'  -- ¡Reemplaza esto con el ID real del usuario!
WHERE nombre = 'Banco Ejemplo'
AND user_id IS NULL;

-- Verificar que la actualización fue exitosa
SELECT * FROM bancos WHERE nombre = 'Banco Ejemplo';
