-- Update RLS policies for Homepage Config tables
-- to allow all operations via API (since admin uses external JWT auth, not Supabase auth)
-- This is suitable for development and when using a separate admin authentication system

-- ============================================
-- BANNERS TABLE POLICIES
-- ============================================

DROP POLICY IF EXISTS "Allow public read banners" ON banners;
DROP POLICY IF EXISTS "Allow all operations banners" ON banners;

-- Allow anyone to read banners (public store)
CREATE POLICY "Allow public read banners" ON banners
  FOR SELECT USING (true);

-- Allow all insert/update/delete operations (admin auth handled at API level)
CREATE POLICY "Allow all operations banners" ON banners
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow all update banners" ON banners
  FOR UPDATE USING (true);

CREATE POLICY "Allow all delete banners" ON banners
  FOR DELETE USING (true);

-- ============================================
-- FEATURED_PRODUCTS_MAPPING TABLE POLICIES
-- ============================================

DROP POLICY IF EXISTS "Allow public read featured" ON featured_products_mapping;
DROP POLICY IF EXISTS "Allow all operations featured" ON featured_products_mapping;

-- Allow anyone to read featured products (public store)
CREATE POLICY "Allow public read featured" ON featured_products_mapping
  FOR SELECT USING (true);

-- Allow all insert/update/delete operations (admin auth handled at API level)
CREATE POLICY "Allow all operations featured" ON featured_products_mapping
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow all update featured" ON featured_products_mapping
  FOR UPDATE USING (true);

CREATE POLICY "Allow all delete featured" ON featured_products_mapping
  FOR DELETE USING (true);

-- ============================================
-- NEW_ARRIVALS_MAPPING TABLE POLICIES
-- ============================================

DROP POLICY IF EXISTS "Allow public read new arrivals" ON new_arrivals_mapping;
DROP POLICY IF EXISTS "Allow all operations new arrivals" ON new_arrivals_mapping;

-- Allow anyone to read new arrivals (public store)
CREATE POLICY "Allow public read new arrivals" ON new_arrivals_mapping
  FOR SELECT USING (true);

-- Allow all insert/update/delete operations (admin auth handled at API level)
CREATE POLICY "Allow all operations new arrivals" ON new_arrivals_mapping
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow all update new arrivals" ON new_arrivals_mapping
  FOR UPDATE USING (true);

CREATE POLICY "Allow all delete new arrivals" ON new_arrivals_mapping
  FOR DELETE USING (true);

-- ============================================
-- GENERAL_PRODUCTS_MAPPING TABLE POLICIES
-- ============================================

DROP POLICY IF EXISTS "Allow public read general" ON general_products_mapping;
DROP POLICY IF EXISTS "Allow all operations general" ON general_products_mapping;

-- Allow anyone to read general products (public store)
CREATE POLICY "Allow public read general" ON general_products_mapping
  FOR SELECT USING (true);

-- Allow all insert/update/delete operations (admin auth handled at API level)
CREATE POLICY "Allow all operations general" ON general_products_mapping
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow all update general" ON general_products_mapping
  FOR UPDATE USING (true);

CREATE POLICY "Allow all delete general" ON general_products_mapping
  FOR DELETE USING (true);
