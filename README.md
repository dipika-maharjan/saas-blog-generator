## SaaS Blog Generator

Generate SEO-optimized blog posts from keywords with AI, manage user authentication via Firebase, and monetize with Stripe subscriptions.

### Tech Stack
- **Framework**: Next.js 16.1 with TypeScript
- **Auth**: Firebase Authentication
- **Database**: Firebase Firestore
- **AI**: OpenAI GPT-4 Mini
- **Payments**: Stripe
- **Styling**: Tailwind CSS

### Features
✅ AI-powered SEO blog generation  
✅ User authentication (register/login)  
✅ Credit-based subscription system  
✅ Stripe payment integration  
✅ Blog history and management  
✅ Multiple tone options (Professional, Casual, Informative)  
✅ Responsive landing page  
✅ Dashboard with real-time stats  

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase project (Firestore + Authentication)
- OpenAI API key (GPT-4 model access)
- Stripe account with API keys
- Stripe CLI (for local webhook testing)

### Quick Start

**1. Clone and install dependencies**
```bash
npm install
```

**2. Get your API credentials**

**Firebase Setup**:
- Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
- Enable Authentication (Email/Password)
- Create Firestore database (Start in test mode)
- Go to Settings > Service Accounts
- Click "Generate New Private Key" (download JSON)
- Note your client credentials from Project Settings

**OpenAI Setup**:
- Get your API key from [openai.com/api](https://platform.openai.com/api-keys)

**Stripe Setup**:
- Create Stripe account at [stripe.com](https://dashboard.stripe.com)
- Create two Products with Prices:
  - **Starter**: 50 credits at $9 (get the `price_` ID)
  - **Pro**: 200 credits at $19 (get the `price_` ID)
- Get your Secret Key from Developers > API Keys

**3. Configure environment**
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Firebase (Client)
NEXT_PUBLIC_FIREBASE_API_KEY=your_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# Firebase Admin (Server) — From downloaded JSON
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_test_...
```

**4. Run development server**
```bash
npm run dev
```
Open http://localhost:3000

### API Endpoints

**Generate Blog**
- `POST /api/generate`
- Body: `{ keyword: string, tone: "professional" | "casual" | "informative", uid: string }`
- Uses 1 credit per generation
- Stores in user's `/blogs` collection

**Stripe Checkout**
- `POST /api/stripe/checkout`
- Body: `{ priceId: string, uid: string }`
- Redirects to Stripe checkout session

**Stripe Webhook**
- `POST /api/stripe/webhook`
- Listens for `checkout.session.completed`
- Updates user's plan and credits

### Pages

| Route | Purpose |
|-------|---------|
| `/` | Landing page with features & pricing |
| `/auth/login` | User login |
| `/auth/register` | User registration (starts with 3 free credits) |
| `/dashboard` | Blog generator & history |
| `/pricing` | Upgrade plans |
| `/success` | Payment success confirmation |

### Local Testing with Stripe CLI

**Install Stripe CLI**:
```bash
# Windows (Winget)
winget install Stripe.StripeCLI

# macOS (Brew)
brew install stripe/stripe-cli/stripe

# Linux (See https://stripe.com/docs/stripe-cli)
```

**Test webhooks**:
```bash
# Terminal 1: Start forwarding webhook
stripe login
stripe listen --forward-to http://localhost:3000/api/stripe/webhook

# Terminal 2: Trigger test event
stripe trigger checkout.session.completed
```

Copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET` in `.env.local`.

### Project Structure
```
app/
  ├── page.tsx                    # Landing page
  ├── layout.tsx                  # Root layout
  ├── api/
  │   ├── generate/route.ts       # Blog generation
  │   └── stripe/
  │       ├── checkout/route.ts   # Stripe session creation
  │       └── webhook/route.ts    # Webhook handler
  ├── auth/
  │   ├── login/page.tsx
  │   └── register/page.tsx
  ├── dashboard/page.tsx          # Main app dashboard
  ├── pricing/page.tsx            # Pricing page
  └── success/page.tsx            # Payment success
lib/
  ├── firebase.ts                 # Client Firebase config
  ├── firebase-admin.ts           # Server-side Admin SDK
  └── auth.ts                     # Auth utilities
```

### Key Features Explained

**Credit System**:
- Free account: 3 credits
- Starter plan: 50 credits ($9)
- Pro plan: 200 credits ($19)
- Each blog generation uses 1 credit

**SEO Optimization**:
- Structured content with headers and subheadings
- Professional copywriting
- Call-to-action sections
- Keyword-focused content

**Security**:
- Server-side user verification
- Credit validation before generation
- Secure Stripe webhook signature verification
- Firebase security rules (enable in production)

### Deployment

**Build**:
```bash
npm run build
```

**Deploy to Vercel** (recommended):
```bash
npm i -g vercel
vercel
```

**Set environment variables** in Vercel dashboard or:
```bash
vercel env add OPENAI_API_KEY
vercel env add STRIPE_SECRET_KEY
# ... etc
```

### Environment Variables Reference

See [.env.example](.env.example) for all required variables.

### Troubleshooting

**"OpenAI API error"**: Check `OPENAI_API_KEY` is valid and has credits  
**"Stripe webhook error"**: Verify `STRIPE_WEBHOOK_SECRET` matches your webhook signing secret  
**"Firebase Auth error"**: Ensure Authentication is enabled and Database Rules allow reads/writes  
**"Blog generation failed"**: Check OpenAI quota and retry with shorter keyword  

### Support
For issues or feature requests, open an issue on GitHub.

### License
MIT
