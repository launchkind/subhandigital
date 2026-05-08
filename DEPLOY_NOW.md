# Deploy to Vercel - Final Steps

## 🚀 Quick Deploy (2 Steps)

### Step 1: Push Code
```bash
git add .
git commit -m "Fix: Auto-detect HTTPS URL for Cashfree"
git push
```

### Step 2: Set Environment Variables in Vercel

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

Add these variables (if not already added):

```
NEXT_PUBLIC_SUPABASE_URL=https://cvwsdjcdehysifdeletu.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2d3NkamNkZWh5c2lmZGVsZXR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5NTg4NjksImV4cCI6MjA5MzUzNDg2OX0.zBEsjVX0z1-zum609g8q9yWcT7R37975hIef8mWSlE8

CASHFREE_APP_ID=12777621b23ef67856819dd9b5c2677721

CASHFREE_SECRET_KEY=cfsk_ma_prod_79b9e2c518ef5208997b21c09714a69f_93c7a162

NEXT_PUBLIC_CASHFREE_APP_ID=12777621b23ef67856819dd9b5c2677721

CASHFREE_ENV=production

NEXT_PUBLIC_APP_URL=https://subhandigital-one.vercel.app
```

**Important:** Update `NEXT_PUBLIC_APP_URL` with your actual Vercel domain!

### Step 3: Wait & Test

1. Wait for Vercel to auto-deploy (1-2 minutes)
2. Visit your site: https://subhandigital-one.vercel.app
3. Fill the form and click "Book Consultation for ₹48"
4. ✅ Payment should work!

## What Was Fixed

The API now automatically detects the correct HTTPS URL from request headers, so it works in production even if `NEXT_PUBLIC_APP_URL` isn't set perfectly.

## Troubleshooting

If it still doesn't work:
1. Check that all environment variables are set in Vercel
2. Make sure you redeployed after adding variables
3. Check browser console for any new errors
4. Verify Cashfree credentials are active in production mode

That's it! 🎉
