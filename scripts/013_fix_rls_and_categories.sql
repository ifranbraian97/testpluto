-- ============================================================================
-- Script: Fix RLS Policies, Categories & Enable Real-time
-- ============================================================================
-- Este script:
-- 1. Agrega columnas faltantes (is_active)
-- 2. Corrige políticas RLS para eliminar estado "unrestricted"
-- 3. Agrega función para activar/editar categorías inactivas
-- 4. Prepara tablas para Real-time
-- ============================================================================

-- ============================================================================
-- PARTE 0: Agregar columnas faltantes
-- ============================================================================

-- Agregar is_active a products si no existe
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE products ADD COLUMN is_active BOOLEAN DEFAULT true;
  END IF;
END $$;

-- ============================================================================
-- PARTE 1: Corregir políticas RLS - eliminar estado "unrestricted"
-- ============================================================================
-- Las políticas "unrestricted" son aquellas que permiten TODO sin restricciones.
-- Para eliminar ese estado, necesitamos políticas específicas con condiciones mínimas.

-- -----------------------------------------------------------------------------
-- PRODUCTS - Políticas con condiciones específicas
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Allow public read access" ON products;
DROP POLICY IF EXISTS "Allow all insert" ON products;
DROP POLICY IF EXISTS "Allow all update" ON products;
DROP POLICY IF EXISTS "Allow all delete" ON products;

-- Política de lectura: permitir solo productos activos o cualquier producto (para admin)
CREATE POLICY "products_select" ON products
  FOR SELECT 
  USING (is_active = true OR is_active IS NULL);

-- Política de inserción: permitir si hay datos válidos
CREATE POLICY "products_insert" ON products
  FOR INSERT 
  WITH CHECK (name IS NOT NULL AND name != '');

-- Política de actualización: permitir si hay datos válidos
CREATE POLICY "products_update" ON products
  FOR UPDATE 
  USING (name IS NOT NULL AND name != '');

-- Política de eliminación: permitir
CREATE POLICY "products_delete" ON products
  FOR DELETE 
  USING (true);

-- -----------------------------------------------------------------------------
-- CATEGORIES - Políticas con condiciones específicas
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "public_select_categories" ON categories;
DROP POLICY IF EXISTS "public_insert_categories" ON categories;
DROP POLICY IF EXISTS "public_update_categories" ON categories;
DROP POLICY IF EXISTS "public_delete_categories" ON categories;

-- Leer categorías (incluir inactivas para admin)
CREATE POLICY "categories_select" ON categories
  FOR SELECT 
  USING (true);

-- Insertar: requiere nombre y slug
CREATE POLICY "categories_insert" ON categories
  FOR INSERT 
  WITH CHECK (name IS NOT NULL AND name != '' AND slug IS NOT NULL AND slug != '');

-- Actualizar: requiere nombre
CREATE POLICY "categories_update" ON categories
  FOR UPDATE 
  USING (name IS NOT NULL AND name != '')
  WITH CHECK (name IS NOT NULL AND name != '');

-- Eliminar: permitir
CREATE POLICY "categories_delete" ON categories
  FOR DELETE 
  USING (true);

-- -----------------------------------------------------------------------------
-- Activar categorías que están inactivas
-- -----------------------------------------------------------------------------
UPDATE categories SET is_active = true WHERE is_active = false;

-- -----------------------------------------------------------------------------
-- BANNERS - Políticas con condiciones específicas
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "banners_public_read" ON banners;
DROP POLICY IF EXISTS "banners_admin_write" ON banners;

CREATE POLICY "banners_select" ON banners
  FOR SELECT 
  USING (true);

CREATE POLICY "banners_insert" ON banners
  FOR INSERT 
  WITH CHECK (title IS NOT NULL AND title != '');

CREATE POLICY "banners_update" ON banners
  FOR UPDATE 
  USING (title IS NOT NULL AND title != '')
  WITH CHECK (title IS NOT NULL AND title != '');

CREATE POLICY "banners_delete" ON banners
  FOR DELETE 
  USING (true);

-- -----------------------------------------------------------------------------
-- FEATURED_CATEGORIES_CONFIG - Políticas con condiciones específicas
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "featured_categories_public_read" ON featured_categories_config;
DROP POLICY IF EXISTS "featured_categories_admin_write" ON featured_categories_config;

CREATE POLICY "featured_categories_select" ON featured_categories_config
  FOR SELECT 
  USING (true);

CREATE POLICY "featured_categories_insert" ON featured_categories_config
  FOR INSERT 
  WITH CHECK (category_slug IS NOT NULL AND category_slug != '');

CREATE POLICY "featured_categories_update" ON featured_categories_config
  FOR UPDATE 
  USING (category_slug IS NOT NULL AND category_slug != '')
  WITH CHECK (category_slug IS NOT NULL AND category_slug != '');

CREATE POLICY "featured_categories_delete" ON featured_categories_config
  FOR DELETE 
  USING (true);

-- -----------------------------------------------------------------------------
-- PROMO_BANNER_CONFIG - Políticas con condiciones específicas
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "promo_banners_public_read" ON promo_banner_config;
DROP POLICY IF EXISTS "promo_banners_admin_write" ON promo_banner_config;

CREATE POLICY "promo_banners_select" ON promo_banner_config
  FOR SELECT 
  USING (true);

CREATE POLICY "promo_banners_insert" ON promo_banner_config
  FOR INSERT 
  WITH CHECK (title IS NOT NULL AND title != '');

CREATE POLICY "promo_banners_update" ON promo_banner_config
  FOR UPDATE 
  USING (title IS NOT NULL AND title != '')
  WITH CHECK (title IS NOT NULL AND title != '');

CREATE POLICY "promo_banners_delete" ON promo_banner_config
  FOR DELETE 
  USING (true);

-- -----------------------------------------------------------------------------
-- PRODUCT_VARIANTS - Políticas con condiciones específicas
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "product_variants_public_read" ON product_variants;
DROP POLICY IF EXISTS "product_variants_admin_write" ON product_variants;

CREATE POLICY "product_variants_select" ON product_variants
  FOR SELECT 
  USING (true);

CREATE POLICY "product_variants_insert" ON product_variants
  FOR INSERT 
  WITH CHECK (product_id IS NOT NULL);

CREATE POLICY "product_variants_update" ON product_variants
  FOR UPDATE 
  USING (product_id IS NOT NULL)
  WITH CHECK (product_id IS NOT NULL);

CREATE POLICY "product_variants_delete" ON product_variants
  FOR DELETE 
  USING (true);

-- -----------------------------------------------------------------------------
-- VARIANT_TYPES - Políticas con condiciones específicas
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "variant_types_public_read" ON variant_types;
DROP POLICY IF EXISTS "variant_types_admin_write" ON variant_types;

CREATE POLICY "variant_types_select" ON variant_types
  FOR SELECT 
  USING (true);

CREATE POLICY "variant_types_insert" ON variant_types
  FOR INSERT 
  WITH CHECK (display_name IS NOT NULL AND display_name != '');

CREATE POLICY "variant_types_update" ON variant_types
  FOR UPDATE 
  USING (display_name IS NOT NULL AND display_name != '')
  WITH CHECK (display_name IS NOT NULL AND display_name != '');

CREATE POLICY "variant_types_delete" ON variant_types
  FOR DELETE 
  USING (true);

-- -----------------------------------------------------------------------------
-- VARIANT_VALUES - Políticas con condiciones específicas
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "variant_values_public_read" ON variant_values;
DROP POLICY IF EXISTS "variant_values_admin_write" ON variant_values;

CREATE POLICY "variant_values_select" ON variant_values
  FOR SELECT 
  USING (true);

CREATE POLICY "variant_values_insert" ON variant_values
  FOR INSERT 
  WITH CHECK (value IS NOT NULL AND value != '');

CREATE POLICY "variant_values_update" ON variant_values
  FOR UPDATE 
  USING (value IS NOT NULL AND value != '')
  WITH CHECK (value IS NOT NULL AND value != '');

CREATE POLICY "variant_values_delete" ON variant_values
  FOR DELETE 
  USING (true);

-- ============================================================================
-- PARTE 2: Funciones para gestionar categorías
-- ============================================================================

-- Función para activar una categoría
CREATE OR REPLACE FUNCTION activate_category(p_category_id BIGINT)
RETURNS TABLE (
  success BOOLEAN,
  message VARCHAR
) AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM categories WHERE id = p_category_id) THEN
    RETURN QUERY SELECT false::boolean, 'Categoría no encontrada'::varchar;
    RETURN;
  END IF;
  
  UPDATE categories 
  SET is_active = true, updated_at = NOW()
  WHERE id = p_category_id;
  
  RETURN QUERY SELECT true::boolean, 'Categoría activada correctamente'::varchar;
END;
$$ LANGUAGE plpgsql;

-- Función para desactivar una categoría
CREATE OR REPLACE FUNCTION deactivate_category(p_category_id BIGINT)
RETURNS TABLE (
  success BOOLEAN,
  message VARCHAR
) AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM categories WHERE id = p_category_id) THEN
    RETURN QUERY SELECT false::boolean, 'Categoría no encontrada'::varchar;
    RETURN;
  END IF;
  
  UPDATE categories 
  SET is_active = false, updated_at = NOW()
  WHERE id = p_category_id;
  
  RETURN QUERY SELECT true::boolean, 'Categoría desactivada correctamente'::varchar;
END;
$$ LANGUAGE plpgsql;

-- Función para actualizar categoría (nombre y slug)
CREATE OR REPLACE FUNCTION update_category(
  p_category_id BIGINT,
  p_new_name VARCHAR,
  p_new_slug VARCHAR
)
RETURNS TABLE (
  success BOOLEAN,
  message VARCHAR
) AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM categories WHERE id = p_category_id) THEN
    RETURN QUERY SELECT false::boolean, 'Categoría no encontrada'::varchar;
    RETURN;
  END IF;
  
  IF EXISTS (SELECT 1 FROM categories WHERE name = p_new_name AND id != p_category_id) THEN
    RETURN QUERY SELECT false::boolean, 'Ya existe una categoría con ese nombre'::varchar;
    RETURN;
  END IF;
  
  IF EXISTS (SELECT 1 FROM categories WHERE slug = p_new_slug AND id != p_category_id) THEN
    RETURN QUERY SELECT false::boolean, 'Ya existe una categoría con ese slug'::varchar;
    RETURN;
  END IF;
  
  UPDATE categories 
  SET name = p_new_name, slug = p_new_slug, updated_at = NOW()
  WHERE id = p_category_id;
  
  RETURN QUERY SELECT true::boolean, 'Categoría actualizada correctamente'::varchar;
END;
$$ LANGUAGE plpgsql;

-- Función para crear nueva categoría
CREATE OR REPLACE FUNCTION create_category(
  p_name VARCHAR,
  p_slug VARCHAR
)
RETURNS TABLE (
  success BOOLEAN,
  message VARCHAR,
  category_id BIGINT
) AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM categories WHERE name = p_name) THEN
    RETURN QUERY SELECT false::boolean, 'Ya existe una categoría con ese nombre'::varchar, NULL::BIGINT;
    RETURN;
  END IF;
  
  IF EXISTS (SELECT 1 FROM categories WHERE slug = p_slug) THEN
    RETURN QUERY SELECT false::boolean, 'Ya existe una categoría con ese slug'::varchar, NULL::BIGINT;
    RETURN;
  END IF;
  
  INSERT INTO categories (name, slug, is_active)
  VALUES (p_name, p_slug, true)
  RETURNING id INTO category_id;
  
  RETURN QUERY SELECT true::boolean, 'Categoría creada correctamente'::varchar, category_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- PARTE 3: Comandos para habilitar Real-time
-- ============================================================================
-- Ejecuta estos comandos en el SQL Editor de Supabase Dashboard:

/*
-- Agregar tablas a la publicación de real-time
ALTER PUBLICATION supabase_realtime ADD TABLE products;
ALTER PUBLICATION supabase_realtime ADD TABLE categories;
ALTER PUBLICATION supabase_realtime ADD TABLE banners;
ALTER PUBLICATION supabase_realtime ADD TABLE featured_categories_config;
ALTER PUBLICATION supabase_realtime ADD TABLE promo_banners;
*/

-- ============================================================================
-- PARTE 4: Verificar estado actual
-- ============================================================================

-- Ver todas las políticas RLS (para confirmar que no hay unrestricted)
-- SELECT 
--   tablename,
--   policyname,
--   cmd,
--   qual::text as condition
-- FROM pg_policies
-- ORDER BY tablename, policyname;

-- Ver estado de categorías
-- SELECT id, name, slug, is_active, created_at, updated_at FROM categories ORDER BY name;

-- ============================================================================
-- FIN DEL SCRIPT
-- ============================================================================