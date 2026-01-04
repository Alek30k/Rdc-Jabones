-- Crear tabla para registrar la producción de jabones
CREATE TABLE IF NOT EXISTS soap_production (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  tipo_jabon TEXT NOT NULL,
  cantidad INTEGER NOT NULL CHECK (cantidad > 0),
  color TEXT,
  notas TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Crear índice para búsquedas por fecha
CREATE INDEX IF NOT EXISTS idx_soap_production_fecha ON soap_production(fecha DESC);

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear trigger para actualizar updated_at
DROP TRIGGER IF EXISTS update_soap_production_updated_at ON soap_production;
CREATE TRIGGER update_soap_production_updated_at
  BEFORE UPDATE ON soap_production
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insertar algunos datos de ejemplo (opcional, puedes comentar esto si no quieres datos de ejemplo)
INSERT INTO soap_production (fecha, tipo_jabon, cantidad, color, notas) VALUES
  (CURRENT_DATE, 'Café', 25, 'Marrón', 'Lote con aroma intenso'),
  (CURRENT_DATE - INTERVAL '1 day', 'Arroz', 30, 'Blanco', 'Textura suave'),
  (CURRENT_DATE - INTERVAL '2 days', 'Cúrcuma', 20, 'Amarillo', 'Color vibrante')
ON CONFLICT DO NOTHING;
