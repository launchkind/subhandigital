-- Fix the booking price in Supabase
-- Go to: https://cvwsdjcdehysifdeletu.supabase.co/project/_/sql/new
-- Copy and paste this SQL, then click "Run"

-- Update the booking price to a proper value (change 1499 to whatever you want)
UPDATE app_settings 
SET value = 1499, updated_at = NOW()
WHERE key = 'booking_price';

-- Verify the update
SELECT * FROM app_settings WHERE key = 'booking_price';
