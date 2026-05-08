-- Create consultation_bookings table in Supabase
-- Go to: https://cvwsdjcdehysifdeletu.supabase.co/project/_/sql/new
-- Copy and paste this SQL, then click "Run"

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

-- Disable RLS to allow inserts from API
ALTER TABLE consultation_bookings DISABLE ROW LEVEL SECURITY;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_consultation_bookings_email ON consultation_bookings(email);
CREATE INDEX IF NOT EXISTS idx_consultation_bookings_payment_date ON consultation_bookings(payment_date DESC);
CREATE INDEX IF NOT EXISTS idx_consultation_bookings_order_id ON consultation_bookings(cashfree_order_id);

-- Verify table creation
SELECT * FROM consultation_bookings LIMIT 5;
