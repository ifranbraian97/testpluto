-- Script de ejemplo: Datos iniciales para Homepage Configuration
-- Ejecuta esto después de crear los banners y productos desde el panel admin
-- Esto es solo una referencia, preferiblemente usar el panel admin

-- ============================================
-- EJEMPLO: INSERTAR BANNERS INICIALES
-- ============================================
-- Nota: Primero sube las imágenes a Cloudflare R2 y obtén las URLs

INSERT INTO banners (title, image_url, image_key, link, position, is_active) VALUES
('Promoción de Verano', 'https://tu-cdn.com/banners/verano.jpg', 'banners/verano-2024.jpg', '/categoria/celulares', 1, true),
('Nuevas Llegadas', 'https://tu-cdn.com/banners/nuevas.jpg', 'banners/nuevas-2024.jpg', '/ofertas', 2, true),
('Descuentos Especiales', 'https://tu-cdn.com/banners/descuentos.jpg', 'banners/descuentos-2024.jpg', null, 3, true);

-- ============================================
-- IMPORTANTE: OBTENER IDs DE PRODUCTOS
-- ============================================
-- Ejecuta esto para ver las primeras 8 productos y copiar sus IDs:
SELECT id, name, price, category FROM products LIMIT 8;

-- ============================================
-- EJEMPLO: INSERTAR PRODUCTOS DESTACADOS
-- ============================================
-- Reemplaza 'PRODUCTO_ID_1', 'PRODUCTO_ID_2', etc. con los IDs reales de la respuesta anterior

INSERT INTO featured_products_mapping (product_id, position, is_active) VALUES
('PRODUCTO_ID_1', 1, true),  -- Reemplaza con ID real
('PRODUCTO_ID_2', 2, true),
('PRODUCTO_ID_3', 3, true),
('PRODUCTO_ID_4', 4, true),
('PRODUCTO_ID_5', 5, true),
('PRODUCTO_ID_6', 6, true),
('PRODUCTO_ID_7', 7, true),
('PRODUCTO_ID_8', 8, true);

-- ============================================
-- SCRIPT PARA OBTENER LOS IDs CORRECTOS
-- ============================================
-- Para facilitar, usa esta consulta para obtener productos ordenados por categoría:

SELECT 
  id, 
  name, 
  price, 
  category,
  'FEATURED_POS_X' -- Cambiar X por 1, 2, 3, etc. al copiar
FROM products 
WHERE category = 'Celulares' 
LIMIT 8;

-- Hace lo mismo para otras categorías según necesites

-- ============================================
-- RECOMENDACIÓN
-- ============================================
-- EN LUGAR de ejecutar estos INSERTs manualmente:
-- 
-- 1. Abre el panel admin en http://tu-sitio.com/admin
-- 2. Navega a "Configurar Página de Inicio"
-- 3. Usa la interfaz visual para:
--    - Crear banners (con las URLs de Cloudflare R2)
--    - Seleccionar productos destacados
--    - Asignar nuevos ingresos
--    - Seleccionar productos generales
--
-- Esto es más seguro y no requiere escribir SQL manualmente.
--
-- SOLO usa este script si:
-- - Necesitas migrar datos de otra base de datos
-- - Quieres automatizar la carga inicial con un script
-- - Eres desarrollador y sabes lo que estás haciendo

-- ============================================
-- VERIFICAR DATOS INSERTADOS
-- ============================================
-- Ejecuta estas consultas para verifi car que todo se insertó correctamente:

-- Ver todos los banners
SELECT id, title, position, is_active FROM banners ORDER BY position;

-- Ver todos los productos destacados con detalles
SELECT 
  m.id,
  m.product_id,
  m.position,
  p.name as product_name,
  p.price
FROM featured_products_mapping m
JOIN products p ON m.product_id = p.id
ORDER BY m.position;

-- Ver todos los nuevos ingresos con detalles
SELECT 
  m.id,
  m.product_id,
  m.position,
  p.name as product_name,
  p.price
FROM new_arrivals_mapping m
JOIN products p ON m.product_id = p.id
ORDER BY m.position;

-- Ver todos los productos generales con detalles
SELECT 
  m.id,
  m.product_id,
  m.position,
  p.name as product_name,
  p.price
FROM general_products_mapping m
JOIN products p ON m.product_id = p.id
ORDER BY m.position;

-- ============================================
-- LIMPIAR DATOS (si necesitas empezar de nuevo)
-- ============================================
-- ADVERTENCIA: Esto eliminará TODOS los datos de configuración de la página de inicio

DELETE FROM banners;
DELETE FROM featured_products_mapping;
DELETE FROM new_arrivals_mapping;
DELETE FROM general_products_mapping;

-- ============================================
-- ACTUALIZAR DATOS (después de cambios)
-- ============================================
-- Cambiar posición de un producto destacado
UPDATE featured_products_mapping 
SET position = 2 
WHERE id = 'MAPPING_ID_HERE';

-- Desactivar un banner
UPDATE banners 
SET is_active = false 
WHERE id = 'BANNER_ID_HERE';

-- ============================================
-- CASOS DE USO ESPECÍFICOS
-- ============================================

-- 1. Mostrar los 3 productos más recientes como nuevos ingresos
INSERT INTO new_arrivals_mapping (product_id, position, is_active)
SELECT id, ROW_NUMBER() OVER (ORDER BY created_at DESC) as position, true
FROM products
ORDER BY created_at DESC
LIMIT 8;

-- 2. Mostrar los 8 productos más caros como destacados
INSERT INTO featured_products_mapping (product_id, position, is_active)
SELECT id, ROW_NUMBER() OVER (ORDER BY price DESC) as position, true
FROM products
ORDER BY price DESC
LIMIT 8;

-- 3. Mostrar productos de categorías específicas
INSERT INTO general_products_mapping (product_id, position, is_active)
SELECT id, ROW_NUMBER() OVER (ORDER BY created_at DESC) as position, true
FROM products
WHERE category IN ('Celulares', 'Tecnología')
ORDER BY created_at DESC
LIMIT 12;

-- ============================================
-- ESTADÍSTICAS
-- ============================================
-- Cuántos productos en cada sección
SELECT 
  'Banners' as section,
  COUNT(*) as total,
  SUM(CASE WHEN is_active THEN 1 ELSE 0 END) as activos
FROM banners

UNION ALL

SELECT 
  'Destacados' as section,
  COUNT(*) as total,
  SUM(CASE WHEN is_active THEN 1 ELSE 0 END) as activos
FROM featured_products_mapping

UNION ALL

SELECT 
  'Nuevos Ingresos' as section,
  COUNT(*) as total,
  SUM(CASE WHEN is_active THEN 1 ELSE 0 END) as activos
FROM new_arrivals_mapping

UNION ALL

SELECT 
  'Productos Generales' as section,
  COUNT(*) as total,
  SUM(CASE WHEN is_active THEN 1 ELSE 0 END) as activos
FROM general_products_mapping;
