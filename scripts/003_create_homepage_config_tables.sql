-- Homepage Configuration Tables
-- Tablas para gestionar las secciones configurables de la página de inicio

-- 1. TABLA: banners
-- Almacena las imágenes del banner principal (máximo 3)
CREATE TABLE IF NOT EXISTS banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  image_url VARCHAR(500) NOT NULL, -- URL de Cloudflare R2
  image_key VARCHAR(255) NOT NULL, -- Key en R2 para eliminación
  link VARCHAR(500), -- URL destino del banner (opcional)
  position INTEGER NOT NULL, -- Orden de presentación (1, 2, 3)
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 2. TABLA: featured_products_mapping
-- Relación entre productos destacados y su orden de presentación (máximo 8)
CREATE TABLE IF NOT EXISTS featured_products_mapping (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  position INTEGER NOT NULL CHECK (position >= 1 AND position <= 8), -- Orden (1-8)
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(product_id, position) -- Evitar duplicados
);

-- 3. TABLA: new_arrivals_mapping
-- Relación entre productos nuevos y su orden de presentación (máximo 8)
CREATE TABLE IF NOT EXISTS new_arrivals_mapping (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  position INTEGER NOT NULL CHECK (position >= 1 AND position <= 8), -- Orden (1-8)
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(product_id, position) -- Evitar duplicados
);

-- 4. TABLA: general_products_mapping
-- Relación entre productos en general y su orden de presentación (máximo 12)
CREATE TABLE IF NOT EXISTS general_products_mapping (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  position INTEGER NOT NULL CHECK (position >= 1 AND position <= 12), -- Orden (1-12)
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(product_id, position) -- Evitar duplicados
);

-- ÍNDICES para optimizar consultas
CREATE INDEX IF NOT EXISTS banners_position_idx ON banners(position);
CREATE INDEX IF NOT EXISTS banners_is_active_idx ON banners(is_active);

CREATE INDEX IF NOT EXISTS featured_products_position_idx ON featured_products_mapping(position);
CREATE INDEX IF NOT EXISTS featured_products_is_active_idx ON featured_products_mapping(is_active);

CREATE INDEX IF NOT EXISTS new_arrivals_position_idx ON new_arrivals_mapping(position);
CREATE INDEX IF NOT EXISTS new_arrivals_is_active_idx ON new_arrivals_mapping(is_active);

CREATE INDEX IF NOT EXISTS general_products_position_idx ON general_products_mapping(position);
CREATE INDEX IF NOT EXISTS general_products_is_active_idx ON general_products_mapping(is_active);

-- RLS POLICIES - Permitir lectura pública pero restringir escritura a admin (mediante auth JWT)
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE featured_products_mapping ENABLE ROW LEVEL SECURITY;
ALTER TABLE new_arrivals_mapping ENABLE ROW LEVEL SECURITY;
ALTER TABLE general_products_mapping ENABLE ROW LEVEL SECURITY;

-- Políticas de vista pública (solo activos)
CREATE POLICY "banners_read_public" ON banners
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "featured_products_read_public" ON featured_products_mapping
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "new_arrivals_read_public" ON new_arrivals_mapping
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "general_products_read_public" ON general_products_mapping
  FOR SELECT
  USING (is_active = true);

-- Políticas para admin (insertar, actualizar, eliminar)
-- Nota: La validación de admin se hace a nivel API/Action, estas políticas permiten operaciones a usuarios autenticados
CREATE POLICY "banners_admin_operations" ON banners
  FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "featured_products_admin_operations" ON featured_products_mapping
  FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "new_arrivals_admin_operations" ON new_arrivals_mapping
  FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "general_products_admin_operations" ON general_products_mapping
  FOR ALL
  USING (auth.role() = 'authenticated');
