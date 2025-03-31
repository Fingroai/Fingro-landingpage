-- Este script corrige las políticas de seguridad para la tabla de ofertas
-- Asegura que las ofertas sean visibles tanto para bancos como para usuarios

-- Primero, verificamos las políticas existentes
SELECT * FROM pg_policies WHERE tablename = 'ofertas';

-- Eliminar políticas existentes para recrearlas correctamente
DROP POLICY IF EXISTS "Usuarios pueden ver todas las ofertas" ON ofertas;
DROP POLICY IF EXISTS "Bancos pueden ver sus propias ofertas" ON ofertas;
DROP POLICY IF EXISTS "Todos pueden ver todas las ofertas" ON ofertas;
DROP POLICY IF EXISTS "Bancos pueden crear ofertas" ON ofertas;
DROP POLICY IF EXISTS "Bancos pueden actualizar sus propias ofertas" ON ofertas;

-- Crear políticas actualizadas usando bloques DO para verificar existencia

-- Política para que TODOS puedan ver TODAS las ofertas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'ofertas' AND policyname = 'Todos pueden ver todas las ofertas'
  ) THEN
    EXECUTE 'CREATE POLICY "Todos pueden ver todas las ofertas" ON ofertas
      FOR SELECT USING (true)';
  END IF;
END$$;

-- Política para que los bancos puedan crear ofertas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'ofertas' AND policyname = 'Bancos pueden crear ofertas'
  ) THEN
    EXECUTE 'CREATE POLICY "Bancos pueden crear ofertas" ON ofertas
      FOR INSERT WITH CHECK (banco_id IN (SELECT id FROM bancos WHERE user_id = auth.uid()))';
  END IF;
END$$;

-- Política para que los bancos puedan actualizar sus propias ofertas
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'ofertas' AND policyname = 'Bancos pueden actualizar sus propias ofertas'
  ) THEN
    EXECUTE 'CREATE POLICY "Bancos pueden actualizar sus propias ofertas" ON ofertas
      FOR UPDATE USING (banco_id IN (SELECT id FROM bancos WHERE user_id = auth.uid()))';
  END IF;
END$$;

-- Verificar que las políticas se hayan creado correctamente
SELECT * FROM pg_policies WHERE tablename = 'ofertas';
