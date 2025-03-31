-- Habilitar la extensión UUID si no está habilitada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de bancos
CREATE TABLE IF NOT EXISTS bancos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users,
  nombre TEXT NOT NULL,
  logo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Modificar la tabla de solicitudes para agregar campos de estado y ofertas
ALTER TABLE solicitudes 
ADD COLUMN IF NOT EXISTS estado TEXT DEFAULT 'pendiente',
ADD COLUMN IF NOT EXISTS tiene_ofertas BOOLEAN DEFAULT FALSE;

-- Tabla de ofertas
CREATE TABLE IF NOT EXISTS ofertas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  solicitud_id UUID REFERENCES solicitudes,
  banco_id UUID REFERENCES bancos,
  banco_nombre TEXT NOT NULL,
  banco_logo TEXT,
  monto NUMERIC NOT NULL,
  tasa NUMERIC NOT NULL,
  plazo INTEGER NOT NULL,
  cuota_mensual NUMERIC NOT NULL,
  comision NUMERIC NOT NULL,
  requisitos TEXT[] NOT NULL,
  validez_dias INTEGER NOT NULL,
  estado TEXT DEFAULT 'pendiente',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar un banco de ejemplo para pruebas
INSERT INTO bancos (nombre, logo)
VALUES ('Banco Ejemplo', '/images/banco1.png');

-- Crear un usuario para el banco de ejemplo
-- Nota: En producción, deberías crear usuarios a través de la API de autenticación
-- Esta es solo una forma de crear un usuario para pruebas
-- Primero verificamos si el usuario ya existe
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'banco@ejemplo.com') THEN
    INSERT INTO auth.users (
      id,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at
    )
    VALUES (
      uuid_generate_v4(),
      'banco@ejemplo.com',
      crypt('password123', gen_salt('bf')),
      now(),
      now(),
      now()
    );
  END IF;
END
$$;

-- Vincular el usuario con el banco
UPDATE bancos
SET user_id = (SELECT id FROM auth.users WHERE email = 'banco@ejemplo.com')
WHERE nombre = 'Banco Ejemplo'
AND user_id IS NULL;

-- Crear políticas de seguridad (RLS) para las tablas
-- Habilitar RLS en las tablas
ALTER TABLE bancos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ofertas ENABLE ROW LEVEL SECURITY;

-- Políticas para bancos
CREATE POLICY "Bancos pueden ver sus propios datos" ON bancos
  FOR SELECT USING (auth.uid() = user_id);

-- Políticas para ofertas
CREATE POLICY "Bancos pueden ver sus propias ofertas" ON ofertas
  FOR SELECT USING (banco_id IN (SELECT id FROM bancos WHERE user_id = auth.uid()));

CREATE POLICY "Bancos pueden crear ofertas" ON ofertas
  FOR INSERT WITH CHECK (banco_id IN (SELECT id FROM bancos WHERE user_id = auth.uid()));

CREATE POLICY "Bancos pueden actualizar sus propias ofertas" ON ofertas
  FOR UPDATE USING (banco_id IN (SELECT id FROM bancos WHERE user_id = auth.uid()));

-- Política para que los usuarios puedan ver todas las ofertas (para la página de ofertas)
CREATE POLICY "Usuarios pueden ver todas las ofertas" ON ofertas
  FOR SELECT USING (true);
