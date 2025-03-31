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
