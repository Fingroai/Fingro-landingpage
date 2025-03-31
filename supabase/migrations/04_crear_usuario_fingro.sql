-- Este script crea un usuario para fingro.tech@gmail.com y lo vincula con un banco
-- IMPORTANTE: Ejecuta este script en el SQL Editor de Supabase

-- Habilitar la extensión UUID si no está habilitada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear un nuevo banco para Fingro Tech
INSERT INTO bancos (id, nombre, logo)
VALUES (
  uuid_generate_v4(),
  'Banco Fingro Tech',
  '/images/banco_fingro.png'
);

-- Obtener el ID del banco recién creado
DO $$
DECLARE
  banco_id UUID;
  user_id_var UUID;
BEGIN
  -- Obtener el ID del banco
  SELECT id INTO banco_id FROM bancos WHERE nombre = 'Banco Fingro Tech';
  
  -- Verificar si el usuario ya existe
  SELECT id INTO user_id_var FROM auth.users WHERE email = 'fingro.tech@gmail.com';
  
  IF user_id_var IS NULL THEN
    -- Si el usuario no existe, mostramos un mensaje
    RAISE NOTICE 'El usuario fingro.tech@gmail.com no existe en auth.users. Debes crearlo manualmente desde el panel de Authentication de Supabase.';
  ELSE
    -- Si el usuario existe, lo vinculamos con el banco
    UPDATE bancos
    SET user_id = user_id_var
    WHERE id = banco_id;
    
    RAISE NOTICE 'Usuario vinculado exitosamente con el banco.';
  END IF;
  
  -- Mostrar información del banco
  RAISE NOTICE 'ID del banco: %', banco_id;
  RAISE NOTICE 'Para vincular manualmente, ejecuta: UPDATE bancos SET user_id = ''ID_DEL_USUARIO'' WHERE id = ''%'';', banco_id;
END $$;
