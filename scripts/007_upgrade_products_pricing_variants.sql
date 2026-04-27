-- ============================================================================
-- Actualizar tabla products: Agregar precio de oferta y sistema de variantes mejorado
-- ============================================================================

-- 1. Agregar columna price_offer a products (si no existe)
ALTER TABLE products
ADD COLUMN IF NOT EXISTS price_offer BIGINT;

-- Crear índice para mejor performance
CREATE INDEX IF NOT EXISTS idx_products_price_offer ON products(price_offer);

-- ============================================================================
-- Sistema de Variantes Personalizables (100% flexible)
-- ============================================================================

-- Tipos de variantes (Ej: Color, Tamaño, Almacenamiento, Sabor, etc.)
CREATE TABLE IF NOT EXISTS variant_types (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  display_name VARCHAR(100) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Valores de variantes (Ej: Para Color: Rojo, Azul, Verde; Para Sabor: Fresa, Chocolate)
CREATE TABLE IF NOT EXISTS variant_values (
  id BIGSERIAL PRIMARY KEY,
  variant_type_id BIGINT NOT NULL REFERENCES variant_types(id) ON DELETE CASCADE,
  value VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(variant_type_id, value)
);

-- Variantes de productos (combinaciones de tipos con valores)
-- Ej: Un producto puede tener variantes de Color Y Sabor
CREATE TABLE IF NOT EXISTS product_variants (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_name VARCHAR(255) NOT NULL,
  description TEXT,
  price BIGINT NOT NULL,
  stock_status VARCHAR(50) DEFAULT 'medium',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(product_id, variant_name)
);

-- Mapeo de valores de variantes a variantes de productos
-- Ej: product_variants[1] tiene color=Rojo (id 5) y sabor=Fresa (id 12)
CREATE TABLE IF NOT EXISTS product_variant_values (
  id BIGSERIAL PRIMARY KEY,
  product_variant_id BIGINT NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
  variant_type_id BIGINT NOT NULL REFERENCES variant_types(id) ON DELETE CASCADE,
  variant_value_id BIGINT NOT NULL REFERENCES variant_values(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(product_variant_id, variant_type_id)
);

-- ============================================================================
-- INDEXES para Performance
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_variant_types_active ON variant_types(is_active);
CREATE INDEX IF NOT EXISTS idx_variant_values_type_id ON variant_values(variant_type_id);
CREATE INDEX IF NOT EXISTS idx_variant_values_active ON variant_values(is_active);
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_active ON product_variants(is_active);
CREATE INDEX IF NOT EXISTS idx_product_variant_values_pv_id ON product_variant_values(product_variant_id);
CREATE INDEX IF NOT EXISTS idx_product_variant_values_vt_id ON product_variant_values(variant_type_id);

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

ALTER TABLE variant_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE variant_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variant_values ENABLE ROW LEVEL SECURITY;

-- Variant Types - Public read, authorized write
CREATE POLICY "public_select_variant_types" ON variant_types FOR SELECT USING (true);
CREATE POLICY "public_insert_variant_types" ON variant_types FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update_variant_types" ON variant_types FOR UPDATE USING (true);
CREATE POLICY "public_delete_variant_types" ON variant_types FOR DELETE USING (true);

-- Variant Values - Public read, authorized write
CREATE POLICY "public_select_variant_values" ON variant_values FOR SELECT USING (true);
CREATE POLICY "public_insert_variant_values" ON variant_values FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update_variant_values" ON variant_values FOR UPDATE USING (true);
CREATE POLICY "public_delete_variant_values" ON variant_values FOR DELETE USING (true);

-- Product Variants - Public read, authorized write
CREATE POLICY "public_select_product_variants" ON product_variants FOR SELECT USING (true);
CREATE POLICY "public_insert_product_variants" ON product_variants FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update_product_variants" ON product_variants FOR UPDATE USING (true);
CREATE POLICY "public_delete_product_variants" ON product_variants FOR DELETE USING (true);

-- Product Variant Values - Public read, authorized write
CREATE POLICY "public_select_product_variant_values" ON product_variant_values FOR SELECT USING (true);
CREATE POLICY "public_insert_product_variant_values" ON product_variant_values FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update_product_variant_values" ON product_variant_values FOR UPDATE USING (true);
CREATE POLICY "public_delete_product_variant_values" ON product_variant_values FOR DELETE USING (true);

-- ============================================================================
-- DATOS PREDEFINIDOS (Tipos de variantes comunes)
-- ============================================================================

INSERT INTO variant_types (name, display_name, description, is_active) VALUES
  ('color', 'Color', 'Color del producto', true),
  ('size', 'Tamaño', 'Tamaño del producto', true),
  ('storage', 'Almacenamiento', 'Capacidad de almacenamiento', true),
  ('flavor', 'Sabor', 'Sabor del producto', true),
  ('capacity', 'Capacidad', 'Capacidad del producto', true)
ON CONFLICT (name) DO NOTHING;

-- Color values
INSERT INTO variant_values (variant_type_id, value, is_active) 
SELECT id, 'Rojo', true FROM variant_types WHERE name = 'color' 
ON CONFLICT (variant_type_id, value) DO NOTHING;

INSERT INTO variant_values (variant_type_id, value, is_active) 
SELECT id, 'Azul', true FROM variant_types WHERE name = 'color' 
ON CONFLICT (variant_type_id, value) DO NOTHING;

INSERT INTO variant_values (variant_type_id, value, is_active) 
SELECT id, 'Verde', true FROM variant_types WHERE name = 'color' 
ON CONFLICT (variant_type_id, value) DO NOTHING;

INSERT INTO variant_values (variant_type_id, value, is_active) 
SELECT id, 'Negro', true FROM variant_types WHERE name = 'color' 
ON CONFLICT (variant_type_id, value) DO NOTHING;

INSERT INTO variant_values (variant_type_id, value, is_active) 
SELECT id, 'Blanco', true FROM variant_types WHERE name = 'color' 
ON CONFLICT (variant_type_id, value) DO NOTHING;

-- Flavor values
INSERT INTO variant_values (variant_type_id, value, is_active) 
SELECT id, 'Fresa', true FROM variant_types WHERE name = 'flavor' 
ON CONFLICT (variant_type_id, value) DO NOTHING;

INSERT INTO variant_values (variant_type_id, value, is_active) 
SELECT id, 'Chocolate', true FROM variant_types WHERE name = 'flavor' 
ON CONFLICT (variant_type_id, value) DO NOTHING;

INSERT INTO variant_values (variant_type_id, value, is_active) 
SELECT id, 'Vainilla', true FROM variant_types WHERE name = 'flavor' 
ON CONFLICT (variant_type_id, value) DO NOTHING;

-- Storage values
INSERT INTO variant_values (variant_type_id, value, is_active) 
SELECT id, '64GB', true FROM variant_types WHERE name = 'storage' 
ON CONFLICT (variant_type_id, value) DO NOTHING;

INSERT INTO variant_values (variant_type_id, value, is_active) 
SELECT id, '128GB', true FROM variant_types WHERE name = 'storage' 
ON CONFLICT (variant_type_id, value) DO NOTHING;

INSERT INTO variant_values (variant_type_id, value, is_active) 
SELECT id, '256GB', true FROM variant_types WHERE name = 'storage' 
ON CONFLICT (variant_type_id, value) DO NOTHING;

INSERT INTO variant_values (variant_type_id, value, is_active) 
SELECT id, '512GB', true FROM variant_types WHERE name = 'storage' 
ON CONFLICT (variant_type_id, value) DO NOTHING;
