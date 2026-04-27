-- Create enum types
CREATE TYPE stock_status AS ENUM ('out', 'low', 'medium', 'high');

-- Products table
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  full_description TEXT,
  price BIGINT NOT NULL,
  category VARCHAR(100) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  image VARCHAR(500),
  images TEXT[] DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  stock stock_status DEFAULT 'medium',
  has_quantity_variants BOOLEAN DEFAULT FALSE,
  has_flavor_variants BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Quantity variants table (min/max price ranges)
CREATE TABLE quantity_variants (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  min_quantity INT NOT NULL,
  max_quantity INT,
  price BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(product_id, min_quantity, max_quantity)
);

-- Flavor variants table
CREATE TABLE flavor_variants (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  stock stock_status DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(product_id, name)
);

-- Indexes
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_quantity_variants_product_id ON quantity_variants(product_id);
CREATE INDEX idx_flavor_variants_product_id ON flavor_variants(product_id);

-- RLS Policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE quantity_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE flavor_variants ENABLE ROW LEVEL SECURITY;

-- Allow public access for development (change in production)
CREATE POLICY "public_select_products" ON products FOR SELECT USING (true);
CREATE POLICY "public_insert_products" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update_products" ON products FOR UPDATE USING (true);
CREATE POLICY "public_delete_products" ON products FOR DELETE USING (true);

CREATE POLICY "public_select_quantity_variants" ON quantity_variants FOR SELECT USING (true);
CREATE POLICY "public_insert_quantity_variants" ON quantity_variants FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update_quantity_variants" ON quantity_variants FOR UPDATE USING (true);
CREATE POLICY "public_delete_quantity_variants" ON quantity_variants FOR DELETE USING (true);

CREATE POLICY "public_select_flavor_variants" ON flavor_variants FOR SELECT USING (true);
CREATE POLICY "public_insert_flavor_variants" ON flavor_variants FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update_flavor_variants" ON flavor_variants FOR UPDATE USING (true);
CREATE POLICY "public_delete_flavor_variants" ON flavor_variants FOR DELETE USING (true);
