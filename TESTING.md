# Complete Testing & Running Guide

## Prerequisites

Before running, ensure you have:
- Node.js 18+ installed
- All credentials in `.env.local` (see SETUP.md)
- npm packages installed: `npm install`

## File Structure Fixed ✅

All routes are now corrected:
- ✅ `/api/stripe/webhook/route.ts` - Full error handling
- ✅ `/api/stripe/checkout/route.ts` - Full error handling  
- ✅ `/api/generate/route.ts` - SEO blog generation
- ✅ `/app/page.tsx` - Landing page
- ✅ `/app/auth/login/page.tsx` - Login
- ✅ `/app/auth/register/page.tsx` - Register
- ✅ `/app/dashboard/page.tsx` - Main dashboard
- ✅ `/app/pricing/page.tsx` - Pricing
- ✅ `/app/success/page.tsx` - Payment success

## Step 1: Install Dependencies

```bash
cd e:\WeIntern\saas-blog-generator
npm install
```

## Step 2: Set Up Environment Variables

```bash
# Copy template
cp .env.example .env.local
```

**Edit `.env.local` with your credentials:**

```env
# REQUIRED: App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# REQUIRED: Firebase (Get from Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# OPTIONAL: Firebase Admin (Server-side - for production only)
# FIREBASE_ADMIN_PRIVATE_KEY="..."
# FIREBASE_ADMIN_CLIENT_EMAIL="..."

# REQUIRED: OpenAI (Get from openai.com/api-keys)
OPENAI_API_KEY=sk-proj-your_actual_key_here
OPENAI_MODEL=gpt-4o-mini

# REQUIRED: Stripe (Get from stripe.com/dashboard)
STRIPE_SECRET_KEY=sk_test_your_actual_key_here
STRIPE_WEBHOOK_SECRET=whsec_test_your_actual_key_here
```

## Step 3: Run Development Server

```bash
npm run dev
```

You should see:
```
> next dev

  ▲ Next.js 16.1.1
  - Local:        http://localhost:3000
```

Open: **http://localhost:3000**

## Step 4: Test the Full Flow

### Test 1: Sign Up (Get Free Credits)

1. Click **Sign Up** button
2. Enter:
   - Email: `test@example.com`
   - Password: `Test123!@#`
3. Click **Register**
4. You should be redirected to **Dashboard**
5. Verify you have **3 credits**

**Expected**: Dashboard shows "3" credits remaining

---

### Test 2: Generate Blog (Use 1 Credit)

1. Stay on Dashboard
2. In the "Generate Blog" section:
   - Keyword: `artificial intelligence in healthcare`
   - Tone: `professional`
3. Click **Generate Blog**
4. Wait 10-30 seconds for AI response
5. Blog content appears below

**Expected**: 
- Blog text appears
- Credits change from 3 to 2
- Blog added to "My Blogs" history

---

### Test 3: No Credits Left

1. Click **Generate Blog** 2 more times (use remaining 2 credits)
2. Try to generate again
3. Error message: **"Not enough credits. Upgrade your plan."**

**Expected**: Button disabled, error message shown

---

### Test 4: Stripe Checkout (Purchase Credits)

1. Click **Upgrade Plan** button (top right)
2. Redirected to `/pricing` page
3. Click **Choose Plan** on Starter ($9)
4. Stripe checkout modal opens
5. Use test card: `4242 4242 4242 4242`
6. Any future expiry: `12/25`
7. Any CVC: `123`
8. Zip: `12345`
9. Click **Pay**
10. Redirected to `/success` page
11. Click **Go to Dashboard**
12. Credits should be: **50** (original 0 + 50 from purchase)

**Expected**:
- ✅ Checkout works
- ✅ Payment succeeds
- ✅ Success page shows
- ✅ Credits updated to 50

---

### Test 5: Generate with New Credits

1. On Dashboard, generate 3 more blogs
2. Verify credits count down: 50 → 47

**Expected**: Credits decrease correctly

---

## API Testing (Advanced)

### Test Webhook Locally

**Terminal 1** - Start Stripe listener:
```bash
stripe login
stripe listen --forward-to http://localhost:3000/api/stripe/webhook
```

Copy the webhook secret and update `.env.local`:
```env
STRIPE_WEBHOOK_SECRET=whsec_test_xxxxx...
```

Restart dev server:
```bash
npm run dev
```

**Terminal 2** - Trigger test event:
```bash
stripe trigger checkout.session.completed
```

**Expected**: 
- Webhook listener shows: `POST http://localhost:3000/api/stripe/webhook ... 200`
- Check logs in dev server terminal
- User's Firestore document updated with credits

---

### Test Generate API with cURL

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "keyword": "machine learning",
    "tone": "casual",
    "uid": "your_user_id_here"
  }'
```

**Expected Response**:
```json
{
  "blog": "Here's a comprehensive blog post about machine learning..."
}
```

---

### Test Checkout API with cURL

```bash
curl -X POST http://localhost:3000/api/stripe/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "priceId": "price_123",
    "uid": "your_user_id_here"
  }'
```

**Expected Response**:
```json
{
  "url": "https://checkout.stripe.com/pay/cs_test_..."
}
```

---

## Debugging

### Check Browser Console
Press `F12` → **Console** tab to see:
- React errors
- Network requests
- Firebase warnings

### Check Next.js Terminal
The dev server terminal shows:
- API request logs
- Compilation errors
- Firebase SDK logs

### Check Stripe Logs
- Stripe Dashboard → **Webhooks** → Recent attempts
- Shows which events succeeded/failed

---

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| "Firebase initialization error" | Check `FIREBASE_ADMIN_PRIVATE_KEY` format in `.env.local` |
| "OpenAI API error: 401" | Verify `OPENAI_API_KEY` is correct at openai.com/api-keys |
| "Stripe webhook error" | Update `STRIPE_WEBHOOK_SECRET` from `stripe listen` output |
| Blog generation slow | Wait 30s, check OpenAI quota at openai.com/account/usage |
| "User not found" | Register a new account, don't use hardcoded UID |
| Checkout fails | Ensure `NEXT_PUBLIC_APP_URL=http://localhost:3000` |
| Blog shows blank | Check console for errors, verify OpenAI key has credits |

---

## Production Checklist

Before deploying to production:

- [ ] Test all 5 flows above locally
- [ ] Change Stripe keys to **live** (sk_live_...)
- [ ] Change Firebase to **production** mode (not test)
- [ ] Set `FIREBASE_ADMIN_PRIVATE_KEY` env var on hosting platform
- [ ] Update `NEXT_PUBLIC_APP_URL` to your production domain
- [ ] Test payment with real test card on live Stripe account
- [ ] Setup error logging (Sentry, Rollbar)
- [ ] Enable Firebase security rules
- [ ] Set up automated backups

---

## Deploy to Vercel

```bash
npm i -g vercel
vercel login
vercel
```

Then add environment variables in Vercel dashboard:
- `OPENAI_API_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- All `NEXT_PUBLIC_*` and `FIREBASE_*` vars

---

## Support Commands

```bash
# Check Node version
node --version  # Should be 18+

# Check npm version
npm --version

# Reinstall dependencies
npm install

# Clear Next.js cache
rm -rf .next

# Type check
npm run type-check

# Build production
npm run build

# Start production build
npm run start
```

---

**Everything should now work! Follow the 5 tests above and confirm each step. 🚀**
