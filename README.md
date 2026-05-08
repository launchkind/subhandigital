# Subhan Digital - Consultation Booking

A beautiful consultation booking page with Razorpay payment integration.

## Features

- ✅ Beautiful UI with floating labels
- ✅ Email field with validation
- ✅ Mobile number validation (10 digits)
- ✅ Razorpay payment integration (₹48)
- ✅ Automatic save to Supabase after payment
- ✅ Secure payment verification
- ✅ Responsive design

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your keys:

```env
# Supabase (from main project)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Razorpay (get from https://dashboard.razorpay.com)
RAZORPAY_KEY_ID=rzp_test_your_key
RAZORPAY_KEY_SECRET=your_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key
```

### 3. Create Database Table

Run SQL from `../supabase/create-consultation-bookings-table.sql` in Supabase SQL Editor.

### 4. Start Development Server
```bash
npm run dev
```

Open http://localhost:3000

## Test Payment

Use these test credentials:

**Card**: 4111 1111 1111 1111  
**CVV**: 123  
**Expiry**: 12/25

**UPI**: success@razorpay

## Documentation

See `SETUP_GUIDE.md` for complete setup instructions.

## Tech Stack

- Next.js 16
- React 19
- Tailwind CSS
- Supabase
- Razorpay

## Project Structure

```
subhandigital/
├── app/
│   ├── api/razorpay/          # Payment API routes
│   ├── layout.js              # Root layout
│   └── page.js                # Main booking form
├── lib/
│   └── supabase.js            # Supabase client
└── .env.local                 # Environment variables
```

## Support

For issues or questions, check `SETUP_GUIDE.md` or contact support.
