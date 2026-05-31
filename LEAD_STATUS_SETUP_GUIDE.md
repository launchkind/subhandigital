# Lead Status Update Feature - Complete Setup Guide

## 🎯 What's New?

You can now:
1. **Update Lead Status** - Mark leads as: Pending, Called, Not Interested, Follow Up, or Converted
2. **Add Call Details** - Take notes during/after calls with detailed descriptions
3. **Track Call Dates** - Record when you called the lead
4. **Schedule Follow-ups** - Set next follow-up dates

---

## 📋 Setup Instructions

### Step 1: Create New Database Columns

Go to your Supabase Dashboard:
1. Click on **SQL Editor** in the left sidebar
2. Click **New Query**
3. Copy and paste the SQL from `ADD_LEAD_STATUS_FIELDS.sql`
4. Click **Run**

**SQL Query:**
```sql
-- ADD LEAD STATUS AND CALL DETAILS FIELDS
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
```

**Expected Output:**
You should see columns listed including:
- call_status (TEXT, nullable)
- call_details (TEXT, nullable)
- call_date (TIMESTAMPTZ, nullable)
- next_follow_up (TIMESTAMPTZ, nullable)

---

### Step 2: (Optional) View Your Current Schema

Run this query to see all columns in the bookings table:

```sql
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'consultation_bookings' 
ORDER BY ordinal_position;
```

---

### Step 3: Test the Setup

Run this to verify everything is working:

```sql
-- Check that columns exist and have correct data
SELECT 
  full_name, 
  email, 
  call_status, 
  call_details, 
  call_date, 
  next_follow_up
FROM consultation_bookings 
ORDER BY created_at DESC 
LIMIT 5;
```

---

## 🚀 How to Use in Admin Panel

### View Leads with Status
1. Go to Admin Panel → **All Leads** tab
2. You'll see each lead with a **status badge** showing:
   - 🟡 **Pending** - Not called yet
   - 🔵 **Called** - Called successfully
   - 🔴 **Not Interested** - Lead rejected
   - 🟠 **Follow Up** - Need to follow up
   - 🟢 **Converted** - Lead became customer

### Update Lead Status
1. Click on a lead in the left panel
2. In the **Lead Details** panel on the right, scroll to **"Update Call Status"** section
3. Fill in the fields:
   - **Call Status** - Select from dropdown (Pending, Called, Not Interested, Follow Up, Converted)
   - **Call Details** - Add your notes (e.g., "Customer interested, waiting for callback", "Not interested in current offering")
   - **Call Date** - Select the date you called them
   - **Next Follow Up** - Select when to follow up next (optional)
4. Click **Update Lead Status** button
5. You'll see a success message ✅

---

## 📊 Useful SQL Queries for Your Dashboard

### Get all pending leads (not called yet)
```sql
SELECT full_name, email, mobile_number, payment_amount, payment_date
FROM consultation_bookings
WHERE call_status = 'pending'
ORDER BY payment_date ASC;
```

### Get leads needing follow-up
```sql
SELECT full_name, email, call_details, next_follow_up, call_date
FROM consultation_bookings
WHERE call_status = 'follow_up' AND next_follow_up <= NOW()
ORDER BY next_follow_up ASC;
```

### Get converted leads (customers)
```sql
SELECT full_name, email, mobile_number, payment_amount, call_date
FROM consultation_bookings
WHERE call_status = 'converted'
ORDER BY call_date DESC;
```

### Get conversion rate
```sql
SELECT 
  COUNT(*) as total_leads,
  SUM(CASE WHEN call_status = 'converted' THEN 1 ELSE 0 END) as converted,
  ROUND(100.0 * SUM(CASE WHEN call_status = 'converted' THEN 1 ELSE 0 END) / COUNT(*), 2) as conversion_rate_percent
FROM consultation_bookings;
```

### Get all leads with their call history
```sql
SELECT 
  full_name, 
  email, 
  mobile_number, 
  call_status, 
  call_details, 
  call_date,
  next_follow_up,
  payment_date
FROM consultation_bookings
ORDER BY call_date DESC NULLS LAST;
```

### Find leads to call today
```sql
SELECT full_name, email, mobile_number, payment_date
FROM consultation_bookings
WHERE (call_status = 'pending' OR (call_status = 'follow_up' AND next_follow_up::DATE = CURRENT_DATE))
ORDER BY payment_date ASC;
```

### Get statistics by status
```sql
SELECT 
  call_status,
  COUNT(*) as count,
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) as percentage
FROM consultation_bookings
GROUP BY call_status
ORDER BY count DESC;
```

---

## 🔧 Database Backup Query

Before making any changes, backup your current data:

```sql
-- Export all booking data with call status
SELECT * FROM consultation_bookings 
ORDER BY created_at DESC;
```

**To backup:**
1. Run this query in Supabase SQL Editor
2. Click the download icon (arrow pointing down)
3. Save the CSV file safely

---

## 📝 Update Record Manually (if needed)

If you need to update a specific lead's status directly in the database:

```sql
UPDATE consultation_bookings
SET 
  call_status = 'called',
  call_details = 'Your notes here',
  call_date = NOW(),
  next_follow_up = NOW() + INTERVAL '3 days'
WHERE email = 'customer@example.com';
```

---

## ❌ Troubleshooting

**Q: I don't see the new fields in my table**
- A: Make sure you ran the ADD_LEAD_STATUS_FIELDS.sql query and clicked "Run"
- Check that no error messages appeared

**Q: The update button doesn't work**
- A: Make sure you're logged in as admin
- Check browser console (F12) for error messages
- Verify the API route was created at `/api/admin/update-lead-status/route.js`

**Q: How do I reset a lead's status?**
```sql
UPDATE consultation_bookings
SET call_status = 'pending', call_details = NULL, call_date = NULL
WHERE id = YOUR_LEAD_ID;
```

---

## 📚 Files Modified/Created

1. ✅ **ADD_LEAD_STATUS_FIELDS.sql** - Database migration
2. ✅ **app/api/admin/update-lead-status/route.js** - New API endpoint
3. ✅ **app/admin/page.js** - Updated with status form UI

---

## 🎓 Next Steps

- Test updating a lead's status in the admin panel
- Run the statistics queries to see your pipeline
- Set up regular follow-ups using the next_follow_up date
- Use the call_details field to track conversations

---

**Questions?** Check the Supabase SQL Editor documentation or run the verification queries above!
