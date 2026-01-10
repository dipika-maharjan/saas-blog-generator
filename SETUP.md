# SaaS Blog Generator - Complete Setup Guide

This guide walks you through setting up the SaaS Blog Generator from scratch.

## Step 1: Clone & Install

```bash
# Clone the repository
git clone <your-repo-url>
cd saas-blog-generator

# Install dependencies
npm install
```

## Step 2: Firebase Setup

### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a new project"
3. Name it (e.g., "BlogGen AI")
4. Disable Google Analytics (optional)
5. Click "Create project"

### Enable Authentication
1. Go to **Authentication** → **Sign-in method**
2. Enable **Email/Password** provider
3. Save

### Create Firestore Database
1. Go to **Firestore Database**
2. Click "Create database"
3. Choose **Test mode** (for development; switch to production rules before deploying)
4. Choose closest region
5. Create

### Get Client Credentials
1. Go to **Project Settings** (gear icon)
2. Scroll to "Your apps" section
3. Click "Web" if not already created (</> icon)
4. Copy the `firebaseConfig` object:

```javascript
{
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
}
```

### Get Admin Credentials (For Server-Side)
1. Stay in **Project Settings**
2. Go to **Service Accounts** tab
3. Click **Generate New Private Key**
4. **Save the downloaded JSON file somewhere safe**
5. Open the JSON and copy:
   - `private_key` (with `\n` characters)
   - `client_email`

## Step 3: OpenAI Setup

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Go to **API Keys** section
4. Click **Create new secret key**
5. Copy the key (you won't see it again!)

**Important**: Ensure your account has credits or billing enabled.

## Step 4: Stripe Setup

### Create Stripe Account
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Sign up with email
3. Verify email

### Create Products & Prices
1. Go to **Products** (left sidebar)
2. Click **Add product**
   - Name: "Starter"
   - Description: "50 blog generation credits"
   - Click "Add"
3. In the Pricing section, click **Add price**
   - One-time payment
   - Price: $9 (or 900 cents)
   - Currency: USD
   - Click **Save product**
4. **Copy the Price ID** (starts with `price_`) - you'll need this
5. Repeat for **Pro** plan (200 credits, $19)

### Get API Keys
1. Go to **Developers** → **API Keys**
2. Copy your **Secret key** (starts with `sk_test_` or `sk_live_`)
3. Keep this page open for the webhook setup

### Setup Webhook (Local Testing)

**Windows Users**:
```bash
# Install Stripe CLI
winget install Stripe.StripeCLI

# Or use Chocolatey
choco install stripecli

# Verify installation
stripe -v
```

**macOS Users**:
```bash
brew install stripe/stripe-cli/stripe
```

**Linux Users**: See [Stripe CLI docs](https://stripe.com/docs/stripe-cli)

## Step 5: Configure Environment

```bash
# Copy environment template
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Firebase (Client-side - from Step 2)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyD...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=bloggen-ai.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=bloggen-ai
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=bloggen-ai.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123def456

# Firebase Admin (Server-side - from Step 2 JSON file)
# For the private key, copy the entire value including newlines
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkq...\n-----END PRIVATE KEY-----\n"
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-abc123@bloggen-ai.iam.gserviceaccount.com

# OpenAI (from Step 3)
OPENAI_API_KEY=sk-proj-...
OPENAI_MODEL=gpt-4o-mini

# Stripe (from Step 4)
STRIPE_SECRET_KEY=sk_test_4eC39HqLyjWDarhtT...
STRIPE_WEBHOOK_SECRET=whsec_test_1234567890
```

**Note on `FIREBASE_ADMIN_PRIVATE_KEY`**:
- In the JSON file, the private key looks like: `"-----BEGIN PRIVATE KEY-----\nMIIE...==\n-----END PRIVATE KEY-----\n"`
- Copy it exactly as shown (including the `\n` characters)
- Or paste in your editor and it will be interpreted correctly

## Step 6: Test Locally

```bash
# Start the development server
npm run dev
```

Open http://localhost:3000 in your browser.

### Test User Registration
1. Click **Sign Up**
2. Enter email and password
3. You'll get 3 free credits
4. You should be redirected to the dashboard

### Test Blog Generation
1. On dashboard, enter a keyword (e.g., "AI in healthcare")
2. Select a tone
3. Click "Generate Blog"
4. Wait for content (takes ~10-30 seconds)
5. Blog appears with credit deducted

### Test Stripe Payment
1. On dashboard, click "Upgrade Plan"
2. Click a plan card
3. Fill in Stripe test card: `4242 4242 4242 4242`
4. Any future expiry date and CVC
5. Enter test email
6. Complete payment
7. You should see your credits increased

### Test Webhook (Optional)

In a **new terminal**:
```bash
# Login to Stripe (first time only)
stripe login

# Start listening for webhooks
stripe listen --forward-to http://localhost:3000/api/stripe/webhook
```

You'll see:
```
Ready! Your webhook signing secret is: whsec_test_xxxxx...
```

Copy this `whsec_test_xxxxx...` and update `STRIPE_WEBHOOK_SECRET` in `.env.local`. Restart dev server.

In **another terminal**:
```bash
# Trigger a test event
stripe trigger checkout.session.completed
```

You should see the webhook being processed in the first terminal!

## Step 7: Deployment Checklist

Before deploying to production:

- [ ] Test all features locally
- [ ] Change Firebase Firestore rules from test to production
- [ ] Use real Stripe API keys (not test keys)
- [ ] Remove `FIREBASE_ADMIN_PRIVATE_KEY` debug logging
- [ ] Set up proper error logging/monitoring
- [ ] Enable HTTPS (automatic on Vercel)
- [ ] Set up custom domain (optional)
- [ ] Configure email verification (optional)

## Step 8: Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Add environment variables
vercel env add OPENAI_API_KEY
vercel env add STRIPE_SECRET_KEY
vercel env add STRIPE_WEBHOOK_SECRET
# ... etc for all env vars
```

## Troubleshooting

### "Firebase initialization error"
- Check that `FIREBASE_ADMIN_PRIVATE_KEY` has proper `\n` newlines
- Ensure `FIREBASE_ADMIN_CLIENT_EMAIL` matches the JSON

### "OpenAI API error: 401"
- Verify `OPENAI_API_KEY` is correct
- Check that account has credits (openai.com/account/billing)

### "Stripe webhook failed"
- Make sure `STRIPE_WEBHOOK_SECRET` is set
- Check webhook signing secret in Stripe Dashboard

### Blog generation too slow
- Check OpenAI quota
- Try a shorter keyword
- Consider using `gpt-3.5-turbo` if on tight budget

### "User not found" error
- Ensure user's document was created in Firestore
- Check Firebase rules allow read/write

## Next Steps

1. **Customize branding**: Edit app name and colors in [app/page.tsx](../app/page.tsx)
2. **Add more AI features**: Modify system prompt in [app/api/generate/route.ts](../app/api/generate/route.ts)
3. **Setup email notifications**: Use SendGrid or Mailgun
4. **Add analytics**: Integrate Posthog or Mixpanel
5. **Expand features**: Comment system, sharing, collaboration

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [OpenAI Docs](https://platform.openai.com/docs)
- [Stripe Docs](https://stripe.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**Happy building! 🚀**
