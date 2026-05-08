-- COMPLETE DATABASE SETUP FOR SUBHAN DIGITAL
-- Go to: https://cvwsdjcdehysifdeletu.supabase.co/project/_/sql/new
-- Copy ALL of this SQL and click "Run"

-- ============================================
-- 1. CREATE CONSULTATION BOOKINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS consultation_bookings (
  id BIGSERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  mobile_number TEXT NOT NULL,
  business_idea TEXT NOT NULL,
  short_description TEXT NOT NULL,
  payment_amount INTEGER NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'paid',
  payment_gateway TEXT NOT NULL DEFAULT 'cashfree',
  cashfree_order_id TEXT UNIQUE,
  cashfree_payment_id TEXT,
  payment_method TEXT,
  payment_date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS to allow API access
ALTER TABLE consultation_bookings DISABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_consultation_bookings_email ON consultation_bookings(email);
CREATE INDEX IF NOT EXISTS idx_consultation_bookings_payment_date ON consultation_bookings(payment_date DESC);
CREATE INDEX IF NOT EXISTS idx_consultation_bookings_order_id ON consultation_bookings(cashfree_order_id);

-- ============================================
-- 2. CREATE APP SETTINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS app_settings (
  id BIGSERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value INTEGER NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS for public read access
ALTER TABLE app_settings DISABLE ROW LEVEL SECURITY;

-- Insert default booking price
INSERT INTO app_settings (key, value)
VALUES ('booking_price', 1499)
ON CONFLICT (key) DO UPDATE SET value = 1499;

-- Create index
CREATE INDEX IF NOT EXISTS idx_app_settings_key ON app_settings(key);

-- ============================================
-- 3. VERIFY SETUP
-- ============================================
-- Check tables exist
SELECT 'consultation_bookings' as table_name, COUNT(*) as row_count FROM consultation_bookings
UNION ALL
SELECT 'app_settings' as table_name, COUNT(*) as row_count FROM app_settings;

-- Show current settings
SELECT * FROM app_settings;

-- Show recent bookings (if any)
SELECT * FROM consultation_bookings ORDER BY created_at DESC LIMIT 5;
