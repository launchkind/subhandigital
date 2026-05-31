-- ============================================
-- ADD LEAD STATUS AND CALL DETAILS FIELDS
-- ============================================
-- Go to: https://cvwsdjcdehysifdeletu.supabase.co/project/_/sql/new
-- Copy ALL of this SQL and click "Run"

-- Add new columns to consultation_bookings table for status and call details
ALTER TABLE consultation_bookings 
ADD COLUMN IF NOT EXISTS call_status TEXT DEFAULT 'pending' CHECK (call_status IN ('pending', 'called', 'not_interested', 'follow_up', 'converted')),
ADD COLUMN IF NOT EXISTS call_details TEXT,
ADD COLUMN IF NOT EXISTS call_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS next_follow_up TIMESTAMPTZ;

-- Create index for call_status to improve filtering
CREATE INDEX IF NOT EXISTS idx_consultation_bookings_call_status ON consultation_bookings(call_status);
CREATE INDEX IF NOT EXISTS idx_consultation_bookings_call_date ON consultation_bookings(call_date DESC);

-- Update existing records to have default status
UPDATE consultation_bookings 
SET call_status = 'pending' 
WHERE call_status IS NULL;

-- Verify the new columns
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'consultation_bookings' 
ORDER BY ordinal_position;

-- Check sample data with new columns
SELECT full_name, email, call_status, call_details, call_date 
FROM consultation_bookings 
ORDER BY created_at DESC 
LIMIT 10;
