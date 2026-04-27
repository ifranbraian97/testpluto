-- ============================================================================
-- SCRIPT 011: Funciones RPC para el sistema de variantes
-- ============================================================================

-- ============================================================================
-- FUNCIÓN: get_product_variants_with_attributes
-- Obtiene todas las variantes de un producto con sus atributos asociados
-- ============================================================================

CREATE OR REPLACE FUNCTION get_product_variants_with_attributes(p_product_id BIGINT)
RETURNS TABLE (
  variant_id BIGINT,
  product_id BIGINT,
  sku VARCHAR,
  name VARCHAR,
  description TEXT,
  price BIGINT,
  price_offer BIGINT,
  discount_percentage NUMERIC,
  stock_quantity INTEGER,
  stock_status VARCHAR,
  is_active BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  attributes JSON
) AS $$
SELECT 
  pv.id,
  pv.product_id,
  pv.sku,
  pv.name,
  pv.description,
  pv.price,
  pv.price_offer,
  pv.discount_percentage,
  pv.stock_quantity,
  pv.stock_status,
  pv.is_active,
  pv.created_at,
  pv.updated_at,
  COALESCE(
    json_agg(
      json_build_object(
        'type_id', vt.id,
        'type_name', vt.display_name,
        'value_id', vv.id,
        'value_name', vv.value,
        'color_hex', vv.color_hex
      ) ORDER BY vt.order_index
    ) FILTER (WHERE vt.id IS NOT NULL),
    '[]'::JSON
  ) as attributes
FROM product_variants pv
LEFT JOIN product_variant_values pvv ON pv.id = pvv.product_variant_id
LEFT JOIN variant_types vt ON pvv.variant_type_id = vt.id
LEFT JOIN variant_values vv ON pvv.variant_value_id = vv.id
WHERE pv.product_id = p_product_id
GROUP BY pv.id
ORDER BY pv.created_at DESC;
$$ LANGUAGE sql STABLE;

-- ============================================================================
-- FUNCIÓN: create_product_variant_with_attributes
-- Crea una variante de producto y asigna sus atributos en una sola operación
-- ============================================================================

CREATE OR REPLACE FUNCTION create_product_variant_with_attributes(
  p_product_id BIGINT,
  p_sku VARCHAR,
  p_name VARCHAR,
  p_description TEXT,
  p_price BIGINT,
  p_price_offer BIGINT,
  p_stock_quantity INTEGER,
  p_stock_status VARCHAR,
  p_attributes JSON
)
RETURNS TABLE (
  variant_id BIGINT,
  success BOOLEAN,
  message VARCHAR
) AS $$
DECLARE
  v_variant_id BIGINT;
  v_attribute JSONB;
BEGIN
  -- Crear la variante
  INSERT INTO product_variants (
    product_id,
    sku,
    name,
    description,
    price,
    price_offer,
    stock_quantity,
    stock_status
  ) VALUES (
    p_product_id,
    NULLIF(p_sku, ''),
    p_name,
    NULLIF(p_description, ''),
    p_price,
    NULLIF(p_price_offer, 0),
    COALESCE(p_stock_quantity, 0),
    COALESCE(p_stock_status, 'medium')
  )
  RETURNING product_variants.id INTO v_variant_id;

  -- Insertar atributos
  FOR v_attribute IN SELECT * FROM jsonb_array_elements(p_attributes)
  LOOP
    INSERT INTO product_variant_values (
      product_variant_id,
      variant_type_id,
      variant_value_id
    ) VALUES (
      v_variant_id,
      (v_attribute->>'variant_type_id')::BIGINT,
      (v_attribute->>'variant_value_id')::BIGINT
    );
  END LOOP;

  RETURN QUERY SELECT v_variant_id, true::BOOLEAN, 'Variante creada exitosamente'::VARCHAR;
EXCEPTION WHEN OTHERS THEN
  RETURN QUERY SELECT NULL::BIGINT, false::BOOLEAN, SQLERRM::VARCHAR;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FUNCIÓN: get_variant_combinations
-- Genera todas las combinaciones posibles de variantes para un producto
-- Útil para sugerir nuevas variantes
-- ============================================================================

CREATE OR REPLACE FUNCTION get_variant_combinations(p_product_id BIGINT)
RETURNS TABLE (
  combination_name VARCHAR,
  variant_types_needed TEXT[]
) AS $$
SELECT 
  string_agg(vv.value, ' - ' ORDER BY vt.order_index) as combination_name,
  array_agg(DISTINCT vt.display_name) as variant_types_needed
FROM (
  SELECT DISTINCT vt.id, vt.display_name, vt.order_index
  FROM product_variant_values pvv
  JOIN product_variants pv ON pvv.product_variant_id = pv.id
  JOIN variant_types vt ON pvv.variant_type_id = vt.id
  WHERE pv.product_id = p_product_id
) vt
CROSS JOIN variant_values vv
WHERE vv.variant_type_id = vt.id
GROUP BY vt.id, vt.display_name, vt.order_index
ORDER BY vt.order_index;
$$ LANGUAGE sql STABLE;

-- ============================================================================
-- FUNCIÓN: calculate_variant_stock_status
-- Actualiza automáticamente el estado de stock de una variante basado en cantidad
-- ============================================================================

CREATE OR REPLACE FUNCTION calculate_variant_stock_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Actualizar stock_status basado en stock_quantity
  IF NEW.stock_quantity = 0 THEN
    NEW.stock_status := 'out';
  ELSIF NEW.stock_quantity <= 5 THEN
    NEW.stock_status := 'low';
  ELSIF NEW.stock_quantity <= 20 THEN
    NEW.stock_status := 'medium';
  ELSE
    NEW.stock_status := 'high';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para actualizar stock_status automáticamente
DROP TRIGGER IF EXISTS trg_calculate_variant_stock_status ON product_variants;
CREATE TRIGGER trg_calculate_variant_stock_status
BEFORE INSERT OR UPDATE ON product_variants
FOR EACH ROW
EXECUTE FUNCTION calculate_variant_stock_status();

-- ============================================================================
-- FUNCIÓN: delete_product_variant_cascade
-- Elimina una variante y todos sus atributos
-- ============================================================================

CREATE OR REPLACE FUNCTION delete_product_variant_cascade(p_variant_id BIGINT)
RETURNS TABLE (
  success BOOLEAN,
  message VARCHAR,
  deleted_count INTEGER
) AS $$
DECLARE
  v_deleted_count INTEGER;
BEGIN
  -- Eliminar valores de variantes (la cascada se encarga)
  DELETE FROM product_variants WHERE id = p_variant_id;
  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
  
  IF v_deleted_count > 0 THEN
    RETURN QUERY SELECT true::BOOLEAN, 'Variante eliminada exitosamente'::VARCHAR, 1::INTEGER;
  ELSE
    RETURN QUERY SELECT false::BOOLEAN, 'Variante no encontrada'::VARCHAR, 0::INTEGER;
  END IF;
EXCEPTION WHEN OTHERS THEN
  RETURN QUERY SELECT false::BOOLEAN, SQLERRM::VARCHAR, 0::INTEGER;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- FIN DEL SCRIPT
-- ============================================================================
