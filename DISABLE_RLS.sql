-- Disable Row Level Security on app_settings table
-- This allows the anon key to read the booking price
-- Go to: https://cvwsdjcdehysifdeletu.supabase.co/project/_/sql/new
-- Copy and paste this SQL, then click "Run"

-- Disable RLS
ALTER TABLE app_settings DISABLE ROW LEVEL SECURITY;

-- Or if you want to keep RLS enabled but allow public reads:
-- ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
-- 
-- CREATE POLICY "Allow public read access" ON app_settings
-- FOR SELECT
-- USING (true);

-- Verify the setting
SELECT * FROM app_settings WHERE key = 'booking_price';
