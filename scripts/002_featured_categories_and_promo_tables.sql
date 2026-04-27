-- Create featured_categories_config and promo_banner_config tables
-- Tables for managing dynamic homepage sections with database-driven content

-- ========== FEATURED_CATEGORIES_CONFIG TABLE ==========
CREATE TABLE IF NOT EXISTS featured_categories_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  position INTEGER NOT NULL UNIQUE CHECK (position >= 1 AND position <= 3),
  category_slug VARCHAR(100) NOT NULL,
  category_name VARCHAR(255) NOT NULL,
  image_url TEXT NOT NULL,
  image_key VARCHAR(500) NOT NULL,
  redirect_link TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ========== PROMO_BANNER_CONFIG TABLE ==========
CREATE TABLE IF NOT EXISTS promo_banner_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  category_slug VARCHAR(100) NOT NULL,
  image_url TEXT NOT NULL,
  image_key VARCHAR(500) NOT NULL,
  redirect_link TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE featured_categories_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_banner_config ENABLE ROW LEVEL SECURITY;

-- Create indexes for better query performance
CREATE INDEX idx_featured_categories_position ON featured_categories_config(position);
CREATE INDEX idx_featured_categories_active ON featured_categories_config(is_active);
CREATE INDEX idx_promo_banner_active ON promo_banner_config(is_active);
