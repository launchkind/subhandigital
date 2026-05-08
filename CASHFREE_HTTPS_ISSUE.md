# Cashfree HTTPS Requirement - FIXED

## The Problem

Cashfree **production mode** requires HTTPS URLs for return URLs. You were getting:

```
order_meta.return_url : url should be https. 
Value received: http://localhost:3000?order_id=...
```

## The Solution

For **local development**, use **sandbox mode** even if you have production credentials:

```env
CASHFREE_ENV=sandbox
```

## Your Current Setup

### .env.local (Local Development)
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
CASHFREE_ENV=sandbox  ← Use sandbox for local testing
```

### Production (Vercel)
```env
NEXT_PUBLIC_APP_URL=https://yourdomain.com
CASHFREE_ENV=production  ← Use production only with HTTPS
```

## Why This Works

1. **Sandbox mode** accepts both HTTP and HTTPS URLs
2. **Production mode** only accepts HTTPS URLs
3. Local development uses HTTP (localhost:3000)
4. Production uses HTTPS (your domain)

## What I Changed

✅ Changed `CASHFREE_ENV=production` to `CASHFREE_ENV=sandbox` in `.env.local`

## Test Now!

1. **Restart your dev server**:
   ```bash
   npm run dev
   ```

2. **Test payment**:
   - Open: http://localhost:3000
   - Fill form
   - Click "Book for ₹48"
   - Should work now! ✅

## Important Notes

### About Your Credentials

You're using **production credentials** (`cfsk_ma_prod_...`) in **sandbox mode**. This will cause authentication errors!

**You need to get sandbox credentials:**

1. Login to: https://merchant.cashfree.com
2. Switch to **Sandbox/Test** mode
3. Go to **Developers** → **API Keys**
4. Copy **sandbox credentials** (starts with `cfsk_ma_test_...`)
5. Update `.env.local`:
   ```env
   CASHFREE_SECRET_KEY=cfsk_ma_test_YOUR_SANDBOX_KEY
   ```

### For Production Deployment

When deploying to Vercel:

1. **Add environment variables** in Vercel dashboard:
   ```env
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   CASHFREE_APP_ID=your_production_app_id
   CASHFREE_SECRET_KEY=cfsk_ma_prod_your_production_key
   CASHFREE_ENV=production
   ```

2. **Make sure your domain uses HTTPS** (Vercel provides this automatically)

## Alternative: Use HTTPS Locally

If you want to test production mode locally, you can use HTTPS:

### Option 1: ngrok (Easiest)
```bash
# Install ngrok: https://ngrok.com
ngrok http 3000

# Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
# Update .env.local:
NEXT_PUBLIC_APP_URL=https://abc123.ngrok.io
CASHFREE_ENV=production
```

### Option 2: Local SSL Certificate
```bash
# Generate SSL certificate
# Update next.config.mjs to use HTTPS
# More complex, not recommended for testing
```

## Summary

**For Local Testing:**
- Use `CASHFREE_ENV=sandbox`
- Use sandbox credentials (`cfsk_ma_test_...`)
- Use `http://localhost:3000`

**For Production:**
- Use `CASHFREE_ENV=production`
- Use production credentials (`cfsk_ma_prod_...`)
- Use `https://yourdomain.com`

---

**Status**: ✅ FIXED
**Action**: Restart dev server and test again!
