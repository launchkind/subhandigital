# Final Setup Checklist

## ✅ What's Been Fixed:

1. **Booking Data Storage**: Now saves to database BEFORE payment (as "pending")
2. **Payment Verification**: Updates the pending booking to "paid" after successful payment
3. **No SessionStorage Issues**: Data persists in database, not browser storage
4. **Success Page**: Shows after payment with booking details
5. **Admin Panel**: Shows all leads with full details

## 🔧 Critical Setup Steps:

### 1. Create Database Tables (MUST DO FIRST!)

Go to: https://cvwsdjcdehysifdeletu.supabase.co/project/_/sql/new

Run this SQL:

```sql
-- Create consultation_bookings table
CREATE TABLE IF NOT EXISTS consultation_bookings (
  id BIGSERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  mobile_number TEXT NOT NULL,
  business_idea TEXT NOT NULL,
  short_description TEXT NOT NULL,
  payment_amount INTEGER NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  payment_gateway TEXT NOT NULL DEFAULT 'cashfree',
  cashfree_order_id TEXT UNIQUE,
  cashfree_payment_id TEXT,
  payment_method TEXT,
  payment_date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS
ALTER TABLE consultation_bookings DISABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_consultation_bookings_email ON consultation_bookings(email);
CREATE INDEX IF NOT EXISTS idx_consultation_bookings_payment_date ON consultation_bookings(payment_date DESC);
CREATE INDEX IF NOT EXISTS idx_consultation_bookings_order_id ON consultation_bookings(cashfree_order_id);

-- Create app_settings table
CREATE TABLE IF NOT EXISTS app_settings (
  id BIGSERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value INTEGER NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS
ALTER TABLE app_settings DISABLE ROW LEVEL SECURITY;

-- Insert default price
INSERT INTO app_settings (key, value)
VALUES ('booking_price', 1499)
ON CONFLICT (key) DO UPDATE SET value = 1499;
```

### 2. Verify Tables Created

Go to: https://cvwsdjcdehysifdeletu.supabase.co/project/_/editor

You should see:
- `consultation_bookings` table
- `app_settings` table

### 3. Test the Flow

1. Fill out the booking form
2. Complete payment
3. Check Supabase `consultation_bookings` table
4. You should see the booking with `payment_status = 'paid'`

### 4. Check Admin Panel

1. Go to `/admin`
2. Login with your Supabase credentials
3. Click "Leads" in sidebar
4. You should see all bookings

## 📊 How It Works Now:

1. **User fills form** → Data validated
2. **Create Cashfree order** → Get order ID
3. **Save to database** → Status: "pending", Order ID stored
4. **User pays** → Cashfree processes payment
5. **Redirect to callback** → `/payment-callback?order_id=xxx`
6. **Verify payment** → Check Cashfree API
7. **Update database** → Status: "pending" → "paid"
8. **Show success page** → User sees confirmation
9. **Admin sees lead** → In admin panel

## 🐛 Debugging:

If bookings still don't save:

1. Check browser console (F12) for errors
2. Check terminal/server logs
3. Verify Supabase tables exist
4. Verify RLS is disabled
5. Check `SUPABASE_SERVICE_ROLE_KEY` is set

## 📝 Environment Variables Needed:

```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
CASHFREE_APP_ID=your_app_id
CASHFREE_SECRET_KEY=your_secret_key
CASHFREE_ENV=production
```

All done! Test a payment now and check the database.
