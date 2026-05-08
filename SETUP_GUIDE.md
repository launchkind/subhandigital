# 🚀 Subhan Digital - Complete Setup Guide

## Overview

This is a **separate Next.js project** for Subhan Ali's consultation booking with:
- ✅ Email field in form
- ✅ Razorpay payment integration (₹48)
- ✅ Supabase database integration
- ✅ Automatic data saving after payment

## Prerequisites

1. **Supabase Account** (same as main project)
2. **Razorpay Account** (new - get your own keys)

## Step-by-Step Setup

### Step 1: Install Dependencies (Already Done ✅)

```bash
npm install @supabase/supabase-js razorpay
```

### Step 2: Configure Environment Variables

Edit `.env.local` file:

```env
# Supabase Configuration (Same as main project)
NEXT_PUBLIC_SUPABASE_URL=https://cvwsdjcdehysifdeletu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2d3NkamNkZWh5c2lmZGVsZXR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5NTg4NjksImV4cCI6MjA5MzUzNDg2OX0.zBEsjVX0z1-zum609g8q9yWcT7R37975hIef8mWSlE8

# Razorpay Configuration (Get your own keys)
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID_HERE
RAZORPAY_KEY_SECRET=YOUR_SECRET_KEY_HERE
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID_HERE
```

**Important**: Replace `YOUR_KEY_ID_HERE` and `YOUR_SECRET_KEY_HERE` with your actual Razorpay keys!

### Step 3: Get Razorpay Keys

1. **Sign up**: https://dashboard.razorpay.com/signup
2. **Go to**: Settings → API Keys
3. **Generate Test Keys**
4. **Copy**:
   - Key ID (starts with `rzp_test_`)
   - Key Secret
5. **Paste** into `.env.local`

### Step 4: Create Database Table

**Option A: Using Supabase Dashboard**
1. Go to: https://supabase.com/dashboard
2. Select your project
3. Go to: SQL Editor
4. Copy SQL from: `../supabase/create-consultation-bookings-table.sql`
5. Paste and click "Run"

**Option B: Using SQL File**
```sql
-- Run this in Supabase SQL Editor
-- File: ../supabase/create-consultation-bookings-table.sql
```

### Step 5: Test Locally

```bash
# Start development server
npm run dev
```

Open: http://localhost:3000

**Test the form**:
1. Fill in all fields (including email!)
2. Click "Book Consultation for ₹48"
3. Razorpay checkout opens
4. Use test card: `4111 1111 1111 1111`
5. CVV: `123`, Expiry: `12/25`
6. Complete payment
7. Check success message
8. **Verify in Supabase**: Go to Table Editor → `consultation_bookings`

### Step 6: Verify Everything Works

**Check 1: Form Submission**
- ✅ All fields filled (name, email, mobile, business idea, description)
- ✅ Email validation works
- ✅ Mobile validation works (10 digits)

**Check 2: Payment**
- ✅ Razorpay checkout opens
- ✅ Test payment succeeds
- ✅ Success message shows

**Check 3: Database**
- ✅ Open Supabase Table Editor
- ✅ Go to `consultation_bookings` table
- ✅ See your test booking with:
  - Customer data (name, email, mobile, etc.)
  - Payment data (amount, status, Razorpay IDs)
  - Timestamps

## Project Structure

```
subhandigital/
├── app/
│   ├── api/
│   │   └── razorpay/
│   │       ├── create-order/
│   │       │   └── route.js          ← Creates Razorpay order
│   │       └── verify-payment/
│   │           └── route.js          ← Verifies payment & saves to Supabase
│   ├── globals.css
│   ├── layout.js                     ← Added Razorpay script
│   └── page.js                       ← Main form with email field
├── lib/
│   └── supabase.js                   ← Supabase client (NEW!)
├── .env.local                        ← Environment variables
├── .env.example                      ← Example env file
├── package.json
└── SETUP_GUIDE.md                    ← This file
```

## Environment Variables Explained

### Supabase Variables:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
```
- Your Supabase project URL
- Get from: Supabase Dashboard → Settings → API

```env
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```
- Public anonymous key
- Safe to expose in frontend
- Get from: Supabase Dashboard → Settings → API

### Razorpay Variables:
```env
RAZORPAY_KEY_ID=rzp_test_xxxxx
```
- Your Razorpay Key ID
- Use `rzp_test_` for testing
- Use `rzp_live_` for production
- Get from: Razorpay Dashboard → Settings → API Keys

```env
RAZORPAY_KEY_SECRET=xxxxx
```
- Your Razorpay Secret Key
- **NEVER expose in frontend**
- Only used in API routes (server-side)
- Get from: Razorpay Dashboard → Settings → API Keys

```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx
```
- Same as RAZORPAY_KEY_ID
- Used in frontend (Razorpay checkout)
- Must start with `NEXT_PUBLIC_` to be accessible in browser

## How It Works

### 1. User Fills Form
```javascript
{
  fullName: "John Doe",
  email: "john@example.com",      // ← NEW!
  mobileNumber: "9876543210",
  businessIdea: "SaaS Product",
  shortDescription: "Need pricing help"
}
```

### 2. Click "Book for ₹48"
- Calls `/api/razorpay/create-order`
- Creates Razorpay order
- Returns order ID

### 3. Razorpay Checkout Opens
- User selects payment method
- Enters payment details
- Completes payment

### 4. Payment Verification
- Razorpay sends response with:
  - `razorpay_order_id`
  - `razorpay_payment_id`
  - `razorpay_signature`
- Calls `/api/razorpay/verify-payment`
- Verifies signature (security check)
- Saves to Supabase

### 5. Data Saved to Supabase
```javascript
{
  full_name: "John Doe",
  email: "john@example.com",
  mobile_number: "9876543210",
  business_idea: "SaaS Product",
  short_description: "Need pricing help",
  payment_amount: 48,
  payment_status: "paid",
  razorpay_order_id: "order_xxx",
  razorpay_payment_id: "pay_xxx",
  razorpay_signature: "sig_xxx",
  payment_date: "2024-01-15T10:30:00Z",
  status: "new",
  created_at: "2024-01-15T10:30:00Z"
}
```

## Test Payment Methods

### Test Cards:
```
Success Card:
Number: 4111 1111 1111 1111
CVV: 123
Expiry: 12/25
Name: Any name

Failure Card:
Number: 4000 0000 0000 0002
CVV: 123
Expiry: 12/25
```

### Test UPI:
```
Success: success@razorpay
Failure: failure@razorpay
```

### Test Wallets:
- Select any wallet
- Phone: 9999999999
- OTP: 0000

## Troubleshooting

### "Razorpay is not defined"
**Solution**: Razorpay script not loaded
- Check `app/layout.js` has the script tag
- Refresh browser
- Check browser console for errors

### "Missing Supabase environment variables"
**Solution**: Environment variables not set
- Check `.env.local` exists
- Check variables are correct
- Restart dev server: `npm run dev`

### "Invalid API key" (Razorpay)
**Solution**: Wrong Razorpay keys
- Check keys in `.env.local`
- Make sure they start with `rzp_test_`
- Get new keys from Razorpay dashboard

### "Payment verified but booking not saved"
**Solution**: Supabase connection issue
- Check Supabase URL and key
- Check table `consultation_bookings` exists
- Check RLS policies allow INSERT
- Check browser console for errors

### "Table does not exist"
**Solution**: Database table not created
- Run SQL from `../supabase/create-consultation-bookings-table.sql`
- Check Supabase Table Editor
- Verify table name is `consultation_bookings`

## Production Deployment

### 1. Update Environment Variables

Use **LIVE** Razorpay keys:
```env
RAZORPAY_KEY_ID=rzp_live_YOUR_LIVE_KEY
RAZORPAY_KEY_SECRET=YOUR_LIVE_SECRET
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_YOUR_LIVE_KEY
```

### 2. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
# Settings → Environment Variables
```

### 3. Add Environment Variables to Vercel

Go to: Vercel Dashboard → Your Project → Settings → Environment Variables

Add:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `RAZORPAY_KEY_ID` (live key)
- `RAZORPAY_KEY_SECRET` (live secret)
- `NEXT_PUBLIC_RAZORPAY_KEY_ID` (live key)

### 4. Test in Production

- Use real payment methods
- Verify bookings are saved
- Check Razorpay dashboard for payments

## Security Checklist

- ✅ Razorpay secret key only in server-side code
- ✅ Payment signature verification on server
- ✅ RLS policies on Supabase table
- ✅ Environment variables not in Git
- ✅ HTTPS required in production
- ✅ Input validation on form fields

## Support

- **Razorpay Docs**: https://razorpay.com/docs/
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs

## Quick Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## What's Next?

1. ✅ Test locally with test keys
2. ⏳ Get real Razorpay keys
3. ⏳ Deploy to production
4. ⏳ Test with real payments
5. ⏳ Add to admin panel (optional)
6. ⏳ Set up email notifications (optional)

---

**Status**: ✅ READY TO TEST
**Supabase**: ✅ Connected
**Razorpay**: ✅ Integrated
**Email Field**: ✅ Added
**Separate Project**: ✅ Yes!

🎉 Your consultation booking system is ready!
