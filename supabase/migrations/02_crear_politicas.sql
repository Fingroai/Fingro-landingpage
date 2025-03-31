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
