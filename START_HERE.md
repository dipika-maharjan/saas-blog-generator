# 🎮 Start Here - Step by Step

## 📋 You Need (Before Starting)

- ✅ Node.js 18+ (from nodejs.org)
- ✅ npm (comes with Node)
- ✅ This folder: `e:\WeIntern\saas-blog-generator`
- ✅ API Keys (3 minutes to collect)

---

## 🔑 Collect Your Keys (3 Steps)

### 1. Firebase Keys
**Go to:** [console.firebase.google.com](https://console.firebase.google.com)

```
1. Create new project
2. Go to "Authentication" → Enable "Email/Password"
3. Go to "Firestore Database" → Create database (test mode)
4. Go to "Project Settings" (gear icon)
5. Copy from "Your apps" section:
   - apiKey
   - authDomain
   - projectId
   - storageBucket
   - messagingSenderId
   - appId
6. Go to "Service Accounts" tab
7. Click "Generate New Private Key"
8. Save JSON file
```

### 2. OpenAI Key
**Go to:** [platform.openai.com/api-keys](https://platform.openai.com/api-keys)

```
1. Sign up / Log in
2. Click "Create new secret key"
3. Copy it (won't show again!)
```

### 3. Stripe Keys
**Go to:** [dashboard.stripe.com](https://dashboard.stripe.com)

```
1. Sign up / Log in
2. Go to "Products" (left menu)
3. Create Product "Starter"
   - Price: $9
   - Get priceId (starts with price_)
4. Create Product "Pro"
   - Price: $19
   - Get priceId
5. Go to "Developers" → "API Keys"
6. Copy "Secret Key"
```

---

## 🔧 Setup Your Computer

### Open Terminal
```
Windows: Right-click folder → Open in Terminal
Mac:    Cmd + Space → Terminal
```

### Go to Project Folder
```bash
cd e:\WeIntern\saas-blog-generator
```

### Install Dependencies
```bash
npm install
```
⏳ Wait 2-3 minutes...

### Create `.env.local` File
```bash
copy .env.example .env.local
```

### Edit `.env.local`
Open in your editor and fill in:

```
NEXT_PUBLIC_APP_URL=http://localhost:3000

NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_KEY_HERE
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_DOMAIN_HERE
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID_HERE
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_BUCKET_HERE
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_ID_HERE
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID_HERE

OPENAI_API_KEY=sk-proj-YOUR_KEY_HERE

STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_test_will_get_later
```

Save file!

---

## ▶️ Run the App

```bash
npm run dev
```

You should see:
```
  ▲ Next.js 16.1.1
  
  ✓ Ready in 2.1s
  
  Local:    http://localhost:3000
```

✅ Copy the URL: **http://localhost:3000**

---

## 🌐 Open in Browser

Paste in address bar:
```
http://localhost:3000
```

You should see:
```
┌─────────────────────────────────────────┐
│   BlogGen AI                            │
│   Generate SEO-Optimized Blogs...       │
│                                          │
│   [Get Started Free] [View Pricing]     │
└─────────────────────────────────────────┘
```

---

## ✅ Test 1: Create Account

```
1. Click "Sign Up"
2. Fill in:
   Email:    test@example.com
   Password: Test123!@#
3. Click "Register"
4. Wait 2-3 seconds
5. ✅ Should see Dashboard
6. ✅ Should see "3" credits
```

---

## ✅ Test 2: Generate Blog

```
1. On Dashboard:
   Keyword: artificial intelligence
   Tone:    professional
2. Click "Generate Blog"
3. Wait 10-30 seconds... (AI is thinking!)
4. ✅ Blog appears below
5. ✅ Credits: 3 → 2
```

---

## ✅ Test 3: Out of Credits

```
1. Generate 2 more blogs (use all credits)
2. Try to generate again
3. ✅ See red error: "Not enough credits"
4. ✅ Button is disabled
```

---

## ✅ Test 4: Buy Credits

```
1. Click "Upgrade Plan" (top right)
2. Click "Choose Plan" on Starter ($9)
3. Stripe opens:
   Card: 4242 4242 4242 4242
   Expiry: 12/25
   CVC: 123
   Zip: 12345
4. Click "Pay"
5. ✅ See "Payment Successful!" page
6. Click "Go to Dashboard"
7. ✅ Credits: 50
```

---

## ✅ Test 5: Use New Credits

```
1. Generate 3 blogs
2. Watch credits count down: 50 → 47
3. ✅ Everything works!
```

---

## 🎉 You're Done!

All tests pass? **Congratulations!** Your app is working!

---

## 📂 File Locations

When you need to change something:

| File | What | Location |
|------|------|----------|
| Environment | API keys | `.env.local` |
| Landing Page | Homepage | `app/page.tsx` |
| Blog Generator | Dashboard | `app/dashboard/page.tsx` |
| Authentication | Login/Register | `app/auth/` |
| Payments | Stripe code | `app/api/stripe/` |
| Blog AI | Generation logic | `app/api/generate/route.ts` |

---

## ❌ Something Broken?

### "Firebase error"
→ Check keys in `.env.local` match Firebase console

### "OpenAI error"
→ Check key at openai.com/account/billing (need credits)

### "Stripe error"
→ Check key is test key (sk_test_)

### "Blog is blank"
→ Wait 30 seconds, OpenAI is slow sometimes

### "Page not loading"
→ Restart terminal: `npm run dev`

### "Still stuck?"
Read: `TESTING.md` file in the project folder

---

## 📱 Mobile Testing

Your phone can't access `localhost:3000`

To test on phone:
1. Find your computer IP: `ipconfig` (Windows) or `ifconfig` (Mac)
2. Use: `http://YOUR_IP:3000` on phone
3. Same WiFi required

---

## 🚀 Next: Deploy

When you're ready to go live:

```bash
# Create Vercel account at vercel.com
# Then:

npm i -g vercel
vercel login
vercel
```

Done! Your app is live! 🎉

---

## 📚 More Help

- Full guide: `SETUP.md`
- Test scenarios: `TESTING.md`
- Quick reference: `QUICKSTART.md`
- Overview: `README.md`

---

**Got stuck? Check the TESTING.md file for detailed troubleshooting! 🆘**
