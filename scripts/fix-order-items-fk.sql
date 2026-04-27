-- ============================================================================
-- FIX: Permitir NULL en product_variant_id y asegurar FK correcta
-- ============================================================================

-- 1. Verificar restricción actual
-- SELECT constraint_name FROM information_schema.table_constraints 
-- WHERE table_name = 'order_items' AND constraint_type = 'FOREIGN KEY';

-- 2. Si product_variant_id NO PERMITE NULL, modificar:
ALTER TABLE order_items
  ALTER COLUMN product_variant_id DROP NOT NULL;

-- 3. Asegurar que la restricción FK permite NULL (Supabase debería hacerlo automáticamente)
-- Si hay algún issue, esta query muestra la estructura actual:
SELECT column_name, is_nullable, data_type 
FROM information_schema.columns 
WHERE table_name = 'order_items' AND column_name IN ('product_variant_id', 'product_id');
