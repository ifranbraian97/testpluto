-- Update RLS policies to allow all operations via API (since admin uses session auth, not Supabase auth)
-- This is suitable for development and when using a separate admin authentication system

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read access" ON products;
DROP POLICY IF EXISTS "Allow authenticated insert" ON products;
DROP POLICY IF EXISTS "Allow authenticated update" ON products;
DROP POLICY IF EXISTS "Allow authenticated delete" ON products;

-- Allow anyone to read products (public store)
CREATE POLICY "Allow public read access" ON products
  FOR SELECT USING (true);

-- Allow all insert operations (admin auth handled at API level)
CREATE POLICY "Allow all insert" ON products
  FOR INSERT WITH CHECK (true);

-- Allow all update operations (admin auth handled at API level)
CREATE POLICY "Allow all update" ON products
  FOR UPDATE USING (true);

-- Allow all delete operations (admin auth handled at API level)
CREATE POLICY "Allow all delete" ON products
  FOR DELETE USING (true);
