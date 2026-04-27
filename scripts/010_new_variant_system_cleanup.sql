-- ============================================================================
-- SCRIPT 010: Sistema de Variantes 100% Personalizable (CLEAN REBUILD)
-- ============================================================================
-- Este script limpia y recrea el sistema de variantes de forma completa
-- Elimina las tablas antiguas y crea el nuevo sistema modular
-- ============================================================================

-- ============================================================================
-- 1. LIMPIAR TABLAS ANTIGUAS (si existen)
-- ============================================================================

DROP TABLE IF EXISTS product_variant_values CASCADE;
DROP TABLE IF EXISTS product_variants CASCADE;
DROP TABLE IF EXISTS variant_values CASCADE;
DROP TABLE IF EXISTS variant_types CASCADE;
DROP TABLE IF EXISTS quantity_variants CASCADE;
DROP TABLE IF EXISTS flavor_variants CASCADE;

-- ============================================================================
-- 2. ACTUALIZAR TABLA PRODUCTS
-- ============================================================================

-- Agregar columnas necesarias (si no existen)
ALTER TABLE products
ADD COLUMN IF NOT EXISTS price_offer BIGINT NULL,
ADD COLUMN IF NOT EXISTS discount_percentage NUMERIC(5, 2) GENERATED ALWAYS AS (
  CASE 
    WHEN price_offer IS NOT NULL AND price_offer > 0 THEN 
      ROUND(((price - price_offer) * 100.0 / price), 2)
    ELSE 0
  END
) STORED;

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_price_offer ON products(price_offer);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);

-- ============================================================================
-- 3. CREAR SISTEMA DE VARIANTES PERSONALIZABLES
-- ============================================================================

-- Tabla de TIPOS de variantes (Ej: Color, Sabor, Tamaño, Almacenamiento)
-- El cliente puede crear los tipos que necesite
CREATE TABLE IF NOT EXISTS variant_types (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  display_name VARCHAR(100) NOT NULL,
  description TEXT,
  order_index SMALLINT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_variant_types_active ON variant_types(is_active);
CREATE INDEX IF NOT EXISTS idx_variant_types_name ON variant_types(name);

-- Tabla de VALORES de variantes (Ej: Para Color -> Rojo, Azul; Para Sabor -> Fresa, Chocolate)
-- Los valores se asignan a cada tipo de variante
CREATE TABLE IF NOT EXISTS variant_values (
  id BIGSERIAL PRIMARY KEY,
  variant_type_id BIGINT NOT NULL REFERENCES variant_types(id) ON DELETE CASCADE,
  value VARCHAR(100) NOT NULL,
  color_hex VARCHAR(7),
  order_index SMALLINT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(variant_type_id, value)
);

CREATE INDEX IF NOT EXISTS idx_variant_values_type_id ON variant_values(variant_type_id);
CREATE INDEX IF NOT EXISTS idx_variant_values_active ON variant_values(is_active);

-- Tabla VARIANTES DE PRODUCTOS
-- Cada variante es una combinación única de valores
-- Ej: Un producto puede tener variantes "Rojo-M", "Rojo-L", "Azul-M", "Azul-L"
CREATE TABLE IF NOT EXISTS product_variants (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sku VARCHAR(100) UNIQUE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price BIGINT NOT NULL,
  price_offer BIGINT NULL,
  discount_percentage NUMERIC(5, 2) GENERATED ALWAYS AS (
    CASE 
      WHEN price_offer IS NOT NULL AND price_offer > 0 THEN 
        ROUND(((price - price_offer) * 100.0 / price), 2)
      ELSE 0
    END
  ) STORED,
  stock_quantity INTEGER DEFAULT 0,
  stock_status VARCHAR(50) DEFAULT 'medium', -- 'out', 'low', 'medium', 'high'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_active ON product_variants(is_active);
CREATE INDEX IF NOT EXISTS idx_product_variants_sku ON product_variants(sku);

-- Tabla de MAPEO: Asigna valores de variantes a cada variante de producto
-- Ej: product_variant 1 (Rojo-M) tiene color=Rojo (id 5) Y tamaño=M (id 12)
CREATE TABLE IF NOT EXISTS product_variant_values (
  id BIGSERIAL PRIMARY KEY,
  product_variant_id BIGINT NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
  variant_type_id BIGINT NOT NULL REFERENCES variant_types(id) ON DELETE CASCADE,
  variant_value_id BIGINT NOT NULL REFERENCES variant_values(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(product_variant_id, variant_type_id)
);

CREATE INDEX IF NOT EXISTS idx_product_variant_values_pv_id ON product_variant_values(product_variant_id);
CREATE INDEX IF NOT EXISTS idx_product_variant_values_vt_id ON product_variant_values(variant_type_id);
CREATE INDEX IF NOT EXISTS idx_product_variant_values_vv_id ON product_variant_values(variant_value_id);

-- ============================================================================
-- 4. HABILITAR ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE variant_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE variant_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variant_values ENABLE ROW LEVEL SECURITY;

-- Políticas para variant_types (públicamente legible)
DROP POLICY IF EXISTS "public_select_variant_types" ON variant_types;
DROP POLICY IF EXISTS "public_insert_variant_types" ON variant_types;
DROP POLICY IF EXISTS "public_update_variant_types" ON variant_types;
DROP POLICY IF EXISTS "public_delete_variant_types" ON variant_types;

CREATE POLICY "public_select_variant_types" ON variant_types FOR SELECT USING (true);
CREATE POLICY "public_insert_variant_types" ON variant_types FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update_variant_types" ON variant_types FOR UPDATE USING (true);
CREATE POLICY "public_delete_variant_types" ON variant_types FOR DELETE USING (true);

-- Políticas para variant_values
DROP POLICY IF EXISTS "public_select_variant_values" ON variant_values;
DROP POLICY IF EXISTS "public_insert_variant_values" ON variant_values;
DROP POLICY IF EXISTS "public_update_variant_values" ON variant_values;
DROP POLICY IF EXISTS "public_delete_variant_values" ON variant_values;

CREATE POLICY "public_select_variant_values" ON variant_values FOR SELECT USING (true);
CREATE POLICY "public_insert_variant_values" ON variant_values FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update_variant_values" ON variant_values FOR UPDATE USING (true);
CREATE POLICY "public_delete_variant_values" ON variant_values FOR DELETE USING (true);

-- Políticas para product_variants
DROP POLICY IF EXISTS "public_select_product_variants" ON product_variants;
DROP POLICY IF EXISTS "public_insert_product_variants" ON product_variants;
DROP POLICY IF EXISTS "public_update_product_variants" ON product_variants;
DROP POLICY IF EXISTS "public_delete_product_variants" ON product_variants;

CREATE POLICY "public_select_product_variants" ON product_variants FOR SELECT USING (true);
CREATE POLICY "public_insert_product_variants" ON product_variants FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update_product_variants" ON product_variants FOR UPDATE USING (true);
CREATE POLICY "public_delete_product_variants" ON product_variants FOR DELETE USING (true);

-- Políticas para product_variant_values
DROP POLICY IF EXISTS "public_select_product_variant_values" ON product_variant_values;
DROP POLICY IF EXISTS "public_insert_product_variant_values" ON product_variant_values;
DROP POLICY IF EXISTS "public_update_product_variant_values" ON product_variant_values;
DROP POLICY IF EXISTS "public_delete_product_variant_values" ON product_variant_values;

CREATE POLICY "public_select_product_variant_values" ON product_variant_values FOR SELECT USING (true);
CREATE POLICY "public_insert_product_variant_values" ON product_variant_values FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update_product_variant_values" ON product_variant_values FOR UPDATE USING (true);
CREATE POLICY "public_delete_product_variant_values" ON product_variant_values FOR DELETE USING (true);

-- ============================================================================
-- 5. VISTAS ÚTILES PARA EL ADMIN
-- ============================================================================

-- Vista para ver todas las variantes de un producto con sus valores
DROP VIEW IF EXISTS product_variants_detailed CASCADE;
CREATE VIEW product_variants_detailed AS
SELECT 
  pv.id as variant_id,
  pv.product_id,
  pv.sku,
  pv.name as variant_name,
  pv.description,
  pv.price,
  pv.price_offer,
  pv.discount_percentage,
  pv.stock_quantity,
  pv.stock_status,
  pv.is_active,
  json_agg(
    json_build_object(
      'type_id', vt.id,
      'type_name', vt.display_name,
      'value_id', vv.id,
      'value_name', vv.value,
      'color_hex', vv.color_hex
    )
  ) as attributes
FROM product_variants pv
LEFT JOIN product_variant_values pvv ON pv.id = pvv.product_variant_id
LEFT JOIN variant_types vt ON pvv.variant_type_id = vt.id
LEFT JOIN variant_values vv ON pvv.variant_value_id = vv.id
WHERE pv.is_active = true
GROUP BY pv.id, vt.id, vv.id;

-- ============================================================================
-- 6. DATOS INICIALES: TIPOS DE VARIANTES COMUNES (opcionales)
-- ============================================================================

INSERT INTO variant_types (name, display_name, description, order_index, is_active) VALUES
  ('size', 'Tamaño', 'Tamaño del producto', 1, true),
  ('color', 'Color', 'Color del producto', 2, true),
  ('flavor', 'Sabor', 'Sabor del producto', 3, true),
  ('capacity', 'Capacidad', 'Capacidad del producto', 4, true),
  ('material', 'Material', 'Material del producto', 5, true)
ON CONFLICT (name) DO NOTHING;

-- Valores para Tamaño
INSERT INTO variant_values (variant_type_id, value, order_index, is_active) 
SELECT id, 'XS', 1, true FROM variant_types WHERE name = 'size' 
ON CONFLICT (variant_type_id, value) DO NOTHING;

INSERT INTO variant_values (variant_type_id, value, order_index, is_active) 
SELECT id, 'S', 2, true FROM variant_types WHERE name = 'size' 
ON CONFLICT (variant_type_id, value) DO NOTHING;

INSERT INTO variant_values (variant_type_id, value, order_index, is_active) 
SELECT id, 'M', 3, true FROM variant_types WHERE name = 'size' 
ON CONFLICT (variant_type_id, value) DO NOTHING;

INSERT INTO variant_values (variant_type_id, value, order_index, is_active) 
SELECT id, 'L', 4, true FROM variant_types WHERE name = 'size' 
ON CONFLICT (variant_type_id, value) DO NOTHING;

INSERT INTO variant_values (variant_type_id, value, order_index, is_active) 
SELECT id, 'XL', 5, true FROM variant_types WHERE name = 'size' 
ON CONFLICT (variant_type_id, value) DO NOTHING;

INSERT INTO variant_values (variant_type_id, value, order_index, is_active) 
SELECT id, 'XXL', 6, true FROM variant_types WHERE name = 'size' 
ON CONFLICT (variant_type_id, value) DO NOTHING;

-- Valores para Color
INSERT INTO variant_values (variant_type_id, value, color_hex, order_index, is_active) 
SELECT id, 'Negro', '#000000', 1, true FROM variant_types WHERE name = 'color' 
ON CONFLICT (variant_type_id, value) DO NOTHING;

INSERT INTO variant_values (variant_type_id, value, color_hex, order_index, is_active) 
SELECT id, 'Blanco', '#FFFFFF', 2, true FROM variant_types WHERE name = 'color' 
ON CONFLICT (variant_type_id, value) DO NOTHING;

INSERT INTO variant_values (variant_type_id, value, color_hex, order_index, is_active) 
SELECT id, 'Rojo', '#FF0000', 3, true FROM variant_types WHERE name = 'color' 
ON CONFLICT (variant_type_id, value) DO NOTHING;

INSERT INTO variant_values (variant_type_id, value, color_hex, order_index, is_active) 
SELECT id, 'Azul', '#0000FF', 4, true FROM variant_types WHERE name = 'color' 
ON CONFLICT (variant_type_id, value) DO NOTHING;

INSERT INTO variant_values (variant_type_id, value, color_hex, order_index, is_active) 
SELECT id, 'Verde', '#008000', 5, true FROM variant_types WHERE name = 'color' 
ON CONFLICT (variant_type_id, value) DO NOTHING;

INSERT INTO variant_values (variant_type_id, value, color_hex, order_index, is_active) 
SELECT id, 'Amarillo', '#FFFF00', 6, true FROM variant_types WHERE name = 'color' 
ON CONFLICT (variant_type_id, value) DO NOTHING;

-- Valores para Sabor
INSERT INTO variant_values (variant_type_id, value, order_index, is_active) 
SELECT id, 'Natural', 1, true FROM variant_types WHERE name = 'flavor' 
ON CONFLICT (variant_type_id, value) DO NOTHING;

INSERT INTO variant_values (variant_type_id, value, order_index, is_active) 
SELECT id, 'Fresa', 2, true FROM variant_types WHERE name = 'flavor' 
ON CONFLICT (variant_type_id, value) DO NOTHING;

INSERT INTO variant_values (variant_type_id, value, order_index, is_active) 
SELECT id, 'Chocolate', 3, true FROM variant_types WHERE name = 'flavor' 
ON CONFLICT (variant_type_id, value) DO NOTHING;

INSERT INTO variant_values (variant_type_id, value, order_index, is_active) 
SELECT id, 'Vainilla', 4, true FROM variant_types WHERE name = 'flavor' 
ON CONFLICT (variant_type_id, value) DO NOTHING;

INSERT INTO variant_values (variant_type_id, value, order_index, is_active) 
SELECT id, 'Menta', 5, true FROM variant_types WHERE name = 'flavor' 
ON CONFLICT (variant_type_id, value) DO NOTHING;

-- ============================================================================
-- FIN DEL SCRIPT
-- ============================================================================
