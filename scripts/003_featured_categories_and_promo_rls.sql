-- Update RLS policies for featured_categories_config and promo_banner_config tables
-- This is suitable for development and when using a separate admin authentication system

-- Drop existing policies for featured_categories_config
DROP POLICY IF EXISTS "Allow public read access" ON featured_categories_config;
DROP POLICY IF EXISTS "Allow all insert" ON featured_categories_config;
DROP POLICY IF EXISTS "Allow all update" ON featured_categories_config;
DROP POLICY IF EXISTS "Allow all delete" ON featured_categories_config;

-- Drop existing policies for promo_banner_config
DROP POLICY IF EXISTS "Allow public read access" ON promo_banner_config;
DROP POLICY IF EXISTS "Allow all insert" ON promo_banner_config;
DROP POLICY IF EXISTS "Allow all update" ON promo_banner_config;
DROP POLICY IF EXISTS "Allow all delete" ON promo_banner_config;

-- ========== FEATURED_CATEGORIES_CONFIG POLICIES ==========

-- Allow anyone to read featured categories (public store)
CREATE POLICY "Allow public read access" ON featured_categories_config
  FOR SELECT USING (true);

-- Allow all insert operations (admin auth handled at API level)
CREATE POLICY "Allow all insert" ON featured_categories_config
  FOR INSERT WITH CHECK (true);

-- Allow all update operations (admin auth handled at API level)
CREATE POLICY "Allow all update" ON featured_categories_config
  FOR UPDATE USING (true);

-- Allow all delete operations (admin auth handled at API level)
CREATE POLICY "Allow all delete" ON featured_categories_config
  FOR DELETE USING (true);

-- ========== PROMO_BANNER_CONFIG POLICIES ==========

-- Allow anyone to read promo banner (public store)
CREATE POLICY "Allow public read access" ON promo_banner_config
  FOR SELECT USING (true);

-- Allow all insert operations (admin auth handled at API level)
CREATE POLICY "Allow all insert" ON promo_banner_config
  FOR INSERT WITH CHECK (true);

-- Allow all update operations (admin auth handled at API level)
CREATE POLICY "Allow all update" ON promo_banner_config
  FOR UPDATE USING (true);

-- Allow all delete operations (admin auth handled at API level)
CREATE POLICY "Allow all delete" ON promo_banner_config
  FOR DELETE USING (true);
