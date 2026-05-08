-- Test database connection and verify setup
-- Go to: https://cvwsdjcdehysifdeletu.supabase.co/project/_/sql/new
-- Run this to verify everything is working

-- 1. Check if tables exist
SELECT 
    tablename,
    schemaname
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('consultation_bookings', 'app_settings');

-- 2. Check RLS status
SELECT 
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('consultation_bookings', 'app_settings');

-- 3. Check table structure
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'consultation_bookings'
ORDER BY ordinal_position;

-- 4. Count existing records
SELECT 
    'consultation_bookings' as table_name,
    COUNT(*) as total_records
FROM consultation_bookings
UNION ALL
SELECT 
    'app_settings' as table_name,
    COUNT(*) as total_records
FROM app_settings;

-- 5. Show recent bookings
SELECT 
    id,
    full_name,
    email,
    payment_amount,
    payment_status,
    created_at
FROM consultation_bookings
ORDER BY created_at DESC
LIMIT 5;

-- 6. Show current settings
SELECT * FROM app_settings;
