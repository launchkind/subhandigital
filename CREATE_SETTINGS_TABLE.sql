-- Create app_settings table in Supabase
-- Go to: https://cvwsdjcdehysifdeletu.supabase.co/project/_/sql/new
-- Copy and paste this SQL, then click "Run"

CREATE TABLE IF NOT EXISTS app_settings (
  id BIGSERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value INTEGER NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default booking price
INSERT INTO app_settings (key, value)
VALUES ('booking_price', 999)
ON CONFLICT (key) DO NOTHING;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_app_settings_key ON app_settings(key);
