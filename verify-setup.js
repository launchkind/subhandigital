// Quick verification script to check if everything is configured
// Run: node verify-setup.js

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Subhandigital Setup...\n');

let allGood = true;

// Check 1: .env.local exists
console.log('1️⃣  Checking .env.local file...');
if (fs.existsSync('.env.local')) {
  console.log('   ✅ .env.local exists');
  
  const envContent = fs.readFileSync('.env.local', 'utf8');
  
  // Check Supabase URL
  if (envContent.includes('NEXT_PUBLIC_SUPABASE_URL=https://')) {
    console.log('   ✅ Supabase URL configured');
  } else {
    console.log('   ❌ Supabase URL missing or invalid');
    allGood = false;
  }
  
  // Check Supabase Anon Key
  if (envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ')) {
    console.log('   ✅ Supabase Anon Key configured');
  } else {
    console.log('   ❌ Supabase Anon Key missing or invalid');
    allGood = false;
  }
  
  // Check Razorpay Key ID
  if (envContent.includes('RAZORPAY_KEY_ID=rzp_test_')) {
    console.log('   ✅ Razorpay Key ID configured');
  } else {
    console.log('   ❌ Razorpay Key ID missing or invalid (should start with rzp_test_)');
    allGood = false;
  }
  
  // Check Razorpay Secret
  if (envContent.includes('RAZORPAY_KEY_SECRET=') && !envContent.includes('YOUR_SECRET')) {
    console.log('   ✅ Razorpay Secret configured');
  } else {
    console.log('   ❌ Razorpay Secret missing or still has placeholder');
    allGood = false;
  }
  
  // Check Public Razorpay Key
  if (envContent.includes('NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_')) {
    console.log('   ✅ Public Razorpay Key ID configured');
  } else {
    console.log('   ❌ NEXT_PUBLIC_RAZORPAY_KEY_ID missing or invalid');
    allGood = false;
  }
} else {
  console.log('   ❌ .env.local file not found');
  allGood = false;
}

console.log('');

// Check 2: Supabase client exists
console.log('2️⃣  Checking Supabase client...');
if (fs.existsSync('lib/supabase.js')) {
  console.log('   ✅ lib/supabase.js exists');
} else {
  console.log('   ❌ lib/supabase.js not found');
  allGood = false;
}

console.log('');

// Check 3: API routes exist
console.log('3️⃣  Checking API routes...');
if (fs.existsSync('app/api/razorpay/create-order/route.js')) {
  console.log('   ✅ create-order route exists');
} else {
  console.log('   ❌ create-order route not found');
  allGood = false;
}

if (fs.existsSync('app/api/razorpay/verify-payment/route.js')) {
  console.log('   ✅ verify-payment route exists');
} else {
  console.log('   ❌ verify-payment route not found');
  allGood = false;
}

console.log('');

// Check 4: Dependencies installed
console.log('4️⃣  Checking dependencies...');
if (fs.existsSync('node_modules/@supabase/supabase-js')) {
  console.log('   ✅ @supabase/supabase-js installed');
} else {
  console.log('   ❌ @supabase/supabase-js not installed');
  console.log('      Run: npm install @supabase/supabase-js');
  allGood = false;
}

if (fs.existsSync('node_modules/razorpay')) {
  console.log('   ✅ razorpay installed');
} else {
  console.log('   ❌ razorpay not installed');
  console.log('      Run: npm install razorpay');
  allGood = false;
}

console.log('');

// Check 5: Razorpay script in layout
console.log('5️⃣  Checking Razorpay script...');
if (fs.existsSync('app/layout.js')) {
  const layoutContent = fs.readFileSync('app/layout.js', 'utf8');
  if (layoutContent.includes('checkout.razorpay.com/v1/checkout.js')) {
    console.log('   ✅ Razorpay script in layout.js');
  } else {
    console.log('   ❌ Razorpay script not found in layout.js');
    allGood = false;
  }
} else {
  console.log('   ❌ app/layout.js not found');
  allGood = false;
}

console.log('');
console.log('═══════════════════════════════════════');

if (allGood) {
  console.log('✅ All checks passed! You\'re ready to test!');
  console.log('');
  console.log('Next steps:');
  console.log('1. Run: npm run dev');
  console.log('2. Open: http://localhost:3000');
  console.log('3. Fill form and test payment');
  console.log('4. Use test card: 4111 1111 1111 1111');
  console.log('');
  console.log('See TEST_PAYMENT.md for detailed testing guide.');
} else {
  console.log('❌ Some checks failed. Please fix the issues above.');
  console.log('');
  console.log('Need help? Check SETUP_GUIDE.md');
}

console.log('═══════════════════════════════════════');
