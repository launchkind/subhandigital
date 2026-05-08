# Vercel Environment Variables Setup

## ⚠️ CRITICAL FIX APPLIED

**The main issue was `output: "export"` in next.config.mjs** - this creates a static site that doesn't support API routes. This has been removed.

## Steps to Fix Your Production Deployment

### 1. Commit and Push Changes

```bash
git add .
git commit -m "Fix: Remove static export to enable API routes"
git push
```

### 2. Set Environment Variables in Vercel

Go to your Vercel project → Settings → Environment Variables and add:

### Required Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://cvwsdjcdehysifdeletu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2d3NkamNkZWh5c2lmZGVsZXR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5NTg4NjksImV4cCI6MjA5MzUzNDg2OX0.zBEsjVX0z1-zum609g8q9yWcT7R37975hIef8mWSlE8

CASHFREE_APP_ID=12777621b23ef67856819dd9b5c2677721
CASHFREE_SECRET_KEY=cfsk_ma_prod_79b9e2c518ef5208997b21c09714a69f_93c7a162
NEXT_PUBLIC_CASHFREE_APP_ID=12777621b23ef67856819dd9b5c2677721
CASHFREE_ENV=production

NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app
```

## Important Notes

1. **Update NEXT_PUBLIC_APP_URL** with your actual Vercel deployment URL
2. All variables should be set for **Production**, **Preview**, and **Development** environments
3. After adding variables, **redeploy** your application
4. The Cashfree credentials are for **production mode** - ensure they're active in your Cashfree dashboard

## Deployment Checklist

- [ ] All environment variables added to Vercel
- [ ] NEXT_PUBLIC_APP_URL updated with actual domain
- [ ] Redeployed after adding variables
- [ ] Tested payment flow in production
- [ ] Checked Vercel function logs for any errors

## Troubleshooting

If you still see "Unexpected token '<'" error:

1. Check Vercel deployment logs for build errors
2. Verify all API routes are deployed (check Functions tab)
3. Test API routes directly: `https://your-domain.vercel.app/api/cashfree/create-order`
4. Check browser console for the actual error response
5. Verify Cashfree credentials are correct and active

## Testing API Routes

After deployment, test your API routes:

```bash
# Test create-order endpoint
curl -X POST https://your-domain.vercel.app/api/cashfree/create-order \
  -H "Content-Type: application/json" \
  -d '{"amount":48,"customerName":"Test","customerEmail":"test@example.com","customerPhone":"9999999999"}'
```

Should return JSON with `success: true` and order details.
