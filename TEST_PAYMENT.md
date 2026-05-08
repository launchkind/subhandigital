# 🧪 Test Payment Flow - Step by Step

## ✅ Pre-Test Checklist

Before testing, verify:

- [x] Razorpay keys added to `.env.local`
- [x] `NEXT_PUBLIC_RAZORPAY_KEY_ID` = `rzp_test_SmatqExAk2p0tN`
- [x] Supabase connected
- [x] Database table `consultation_bookings` created
- [x] Dev server running

## 🚀 Start Testing

### Step 1: Start Dev Server

```bash
cd subhandigital
npm run dev
```

Open: http://localhost:3000

### Step 2: Fill the Form

Fill in these details:

```
Full Name: Test User
Email: test@example.com
Mobile: 9876543210
Business Idea: SaaS Product
Description: Testing payment integration
```

### Step 3: Click "Book Consultation for ₹48"

**What should happen**:
- Button shows "Processing..."
- Razorpay checkout modal opens
- Shows "Subhan Ali Consultation"
- Amount: ₹48.00

### Step 4: Complete Test Payment

**Use Test Card**:
```
Card Number: 4111 1111 1111 1111
CVV: 123
Expiry: 12/25
Name: Any Name
```

**Or Test UPI**:
```
UPI ID: success@razorpay
```

### Step 5: Verify Success

**What should happen**:
1. ✅ Payment processes
2. ✅ Success alert shows: "🎉 Payment successful! Your consultation is booked..."
3. ✅ Form resets (all fields empty)
4. ✅ Button returns to normal

### Step 6: Check Database

**Go to Supabase**:
1. Open: https://supabase.com/dashboard
2. Select your project
3. Go to: Table Editor
4. Open: `consultation_bookings`

**You should see**:
```
full_name: Test User
email: test@example.com
mobile_number: 9876543210
business_idea: SaaS Product
short_description: Testing payment integration
payment_amount: 48
payment_status: paid
razorpay_order_id: order_xxxxx
razorpay_payment_id: pay_xxxxx
razorpay_signature: xxxxx
payment_date: 2024-01-15T10:30:00Z
status: new
created_at: 2024-01-15T10:30:00Z
```

### Step 7: Check Razorpay Dashboard

**Go to Razorpay**:
1. Open: https://dashboard.razorpay.com
2. Go to: Transactions → Payments
3. You should see your ₹48 test payment

## 🧪 Test Scenarios

### Test 1: Successful Payment ✅
- Card: `4111 1111 1111 1111`
- **Expected**: Payment succeeds, booking saved

### Test 2: Failed Payment ❌
- Card: `4000 0000 0000 0002`
- **Expected**: Payment fails, no booking saved

### Test 3: Cancel Payment 🚫
- Click "X" on Razorpay modal
- **Expected**: Alert "Payment cancelled", no booking saved

### Test 4: Invalid Email ✉️
- Email: `invalid-email`
- **Expected**: Error message, can't submit

### Test 5: Invalid Mobile 📱
- Mobile: `123` (less than 10 digits)
- **Expected**: Error message, can't submit

## 🐛 Troubleshooting

### Issue: "Razorpay is not defined"
**Check**:
- Razorpay script in `app/layout.js`
- Browser console for script loading errors
- Internet connection

**Fix**:
```javascript
// app/layout.js should have:
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

### Issue: "Failed to create order"
**Check**:
- `.env.local` has correct Razorpay keys
- `RAZORPAY_KEY_ID` starts with `rzp_test_`
- Dev server restarted after adding keys

**Fix**:
```bash
# Restart dev server
npm run dev
```

### Issue: "Payment verified but booking not saved"
**Check**:
- Supabase URL and key in `.env.local`
- Table `consultation_bookings` exists
- RLS policies allow INSERT

**Fix**:
```sql
-- Run in Supabase SQL Editor
-- File: ../supabase/create-consultation-bookings-table.sql
```

### Issue: "Invalid payment signature"
**Check**:
- `RAZORPAY_KEY_SECRET` is correct
- No extra spaces in `.env.local`

**Fix**:
- Copy secret again from Razorpay dashboard
- Remove any spaces

### Issue: Razorpay modal doesn't open
**Check Browser Console**:
```javascript
// Should see:
console.log(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID)
// Output: rzp_test_SmatqExAk2p0tN
```

**Fix**:
- Make sure `NEXT_PUBLIC_RAZORPAY_KEY_ID` is set
- Restart dev server

## ✅ Success Criteria

Payment flow is working if:

- [x] Form validates correctly
- [x] Razorpay modal opens
- [x] Test payment succeeds
- [x] Success message shows
- [x] Form resets
- [x] Booking appears in Supabase
- [x] All data saved correctly
- [x] Payment details saved
- [x] Razorpay dashboard shows payment

## 📊 Test Results Template

```
Date: ___________
Tester: ___________

✅ Form validation works
✅ Razorpay modal opens
✅ Payment succeeds
✅ Success message shows
✅ Form resets
✅ Data saved to Supabase
✅ Payment details correct
✅ Razorpay dashboard updated

Issues found: ___________
Notes: ___________
```

## 🎯 Next Steps After Testing

Once everything works:

1. ✅ Test with different payment methods (UPI, cards, wallets)
2. ✅ Test error scenarios
3. ✅ Test on mobile devices
4. ✅ Get live Razorpay keys
5. ✅ Deploy to production
6. ✅ Test in production with real payment

## 🔗 Quick Links

- **Razorpay Dashboard**: https://dashboard.razorpay.com
- **Supabase Dashboard**: https://supabase.com/dashboard
- **Test Cards**: https://razorpay.com/docs/payments/payments/test-card-details/

---

**Status**: Ready to test!
**Environment**: Test mode
**Amount**: ₹48
**Payment Gateway**: Razorpay

🧪 Start testing now!
