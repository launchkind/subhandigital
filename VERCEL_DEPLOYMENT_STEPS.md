# Deploy to Vercel - Quick Guide

## Step 1: Go to Vercel

1. Visit: https://vercel.com
2. Login with GitHub
3. Click "Add New Project"
4. Import: `launchkind/subhandigital`

## Step 2: Configure Project

- Framework: **Next.js** (auto-detected)
- Build Command: `npm run build`
- Output Directory: `.next`

## Step 3: Add Environment Variables

Copy ALL values from your local `.env.local` file:

| Variable Name | Where to Get Value |
|--------------|-------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | From `.env.local` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | From `.env.local` |
| `CASHFREE_APP_ID` | From `.env.local` |
| `CASHFREE_SECRET_KEY` | From `.env.local` |
| `NEXT_PUBLIC_CASHFREE_APP_ID` | From `.env.local` |
| `CASHFREE_ENV` | Set to `production` |
| `NEXT_PUBLIC_APP_URL` | Leave blank for now |

## Step 4: Deploy

Click "Deploy" and wait for build to complete.

## Step 5: Update APP_URL

After deployment:
1. Copy your Vercel URL (e.g., `https://subhandigital.vercel.app`)
2. Go to: Settings → Environment Variables
3. Update `NEXT_PUBLIC_APP_URL` with your Vercel URL
4. Redeploy: Deployments → ... → Redeploy

## Step 6: Test

Visit your Vercel URL and test the payment flow!

---

**Important**: Production mode will charge real money (₹48 per booking).
