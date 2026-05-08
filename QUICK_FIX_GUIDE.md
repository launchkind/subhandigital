# Quick Fix Guide - Payment Error in Production

## The Issue
`SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON`

## The Solution (3 Steps)

### 1️⃣ Push the Fixed Code
```bash
git add .
git commit -m "Fix: Enable API routes for Cashfree payments"
git push
```

### 2️⃣ Update Vercel Environment Variable
Go to Vercel → Settings → Environment Variables

**Update this one variable:**
```
NEXT_PUBLIC_APP_URL=https://your-actual-vercel-domain.vercel.app
```
Replace with your real Vercel URL (e.g., `https://subhan-digital.vercel.app`)

### 3️⃣ Wait for Auto-Deploy
Vercel will automatically redeploy. Wait 1-2 minutes.

## Test It
1. Visit your production site
2. Fill the form
3. Click "Book Consultation for ₹48"
4. ✅ Payment should work!

## What Was Fixed
- Removed `output: "export"` from next.config.mjs (this was breaking API routes)
- Added better error handling
- Made all API responses return proper JSON

That's it! Your payment flow should now work in production. 🎉
