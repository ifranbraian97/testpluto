-- ============================================================================
-- Create categories table for dynamic category management
-- ============================================================================

-- Create categories table with proper structure
CREATE TABLE IF NOT EXISTS categories (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_is_active ON categories(is_active);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES for categories table
-- ============================================================================

-- Policy for public SELECT access (read-only for all)
CREATE POLICY "public_select_categories" ON categories
  FOR SELECT
  USING (true);

-- Policy for authenticated INSERT (admin only - adjust with auth roles if needed)
CREATE POLICY "public_insert_categories" ON categories
  FOR INSERT
  WITH CHECK (true);

-- Policy for authenticated UPDATE (admin only - adjust with auth roles if needed)
CREATE POLICY "public_update_categories" ON categories
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Policy for authenticated DELETE (admin only - adjust with auth roles if needed)
CREATE POLICY "public_delete_categories" ON categories
  FOR DELETE
  USING (true);

-- ============================================================================
-- INSERT default categories
-- ============================================================================

INSERT INTO categories (name, slug, is_active) VALUES
  ('Celulares', 'celulares', true),
  ('TV y Audio', 'tv-audio', true),
  ('Tecnología', 'tecnologia', true),
  ('Accesorios para celular', 'accesorios-celular', true),
  ('Electrodomésticos', 'electrodomesticos', true),
  ('Hogar', 'hogar', true),
  ('Seguridad', 'seguridad', true),
  ('Scooter y Motos', 'scooter-motos', true),
  ('Belleza y Cuidado Personal', 'belleza', true),
  ('Perfumería', 'perfumeria', true),
  ('Vapers', 'vapers', true),
  ('Maquillaje', 'maquillaje', true)
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- OPTIONAL: Add foreign key to products table (if you want to enforce referential integrity)
-- UNCOMMENT if you want products to reference categories table
-- ============================================================================

-- ALTER TABLE products 
-- ADD CONSTRAINT fk_products_category_id FOREIGN KEY (category) REFERENCES categories(slug);
