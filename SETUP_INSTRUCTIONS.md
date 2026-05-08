# Setup Instructions for Dynamic Pricing

## Step 1: Create Database Table

1. Go to Supabase SQL Editor:
   https://cvwsdjcdehysifdeletu.supabase.co/project/_/sql/new

2. Copy and paste this SQL:

```sql
CREATE TABLE IF NOT EXISTS app_settings (
  id BIGSERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value INTEGER NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO app_settings (key, value)
VALUES ('booking_price', 999)
ON CONFLICT (key) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_app_settings_key ON app_settings(key);
```

3. Click "Run" button

## Step 2: Verify Table Creation

1. Go to Table Editor:
   https://cvwsdjcdehysifdeletu.supabase.co/project/_/editor

2. Look for `app_settings` table in the left sidebar

3. You should see one row with:
   - key: `booking_price`
   - value: `999`

## Step 3: Test the Admin Panel

1. Go to: https://subhandigital-one.vercel.app/admin
2. Login with your Supabase credentials
3. Click "Settings" in sidebar
4. Change the price (e.g., to 1499)
5. Click "Update Price"

## Step 4: Verify on Frontend

1. Open: https://subhandigital-one.vercel.app
2. Do a hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. Check the booking form - it should show the new price

## Troubleshooting

If the price still shows 999:

1. **Check browser console** (F12) for any errors
2. **Hard refresh** the page (Ctrl+Shift+R)
3. **Clear browser cache**
4. **Verify the database** has the updated value
5. **Check Vercel logs** for any API errors

## Important Notes

- The default price is ₹999
- Price changes take effect immediately for new page loads
- Existing bookings keep their original price
- Only authenticated admins can change the price
