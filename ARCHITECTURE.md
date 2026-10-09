# Cosmos AI — Master Architecture & Vision Document

> This document is the single source of truth for Cosmos AI's architecture, vision, decisions, and build pipeline. If this conversation is ever lost, start here. It captures not just what was built but why, and where we are going.

---

## The Mission

**AI at every Malawian's fingertips, no matter their level in society, at an affordable price.**

This is not a tagline. It is the architectural constraint that drives every decision. Every feature, every pricing model, every tool must be measurable against this mission.

---

## The Platform Overview

Cosmos AI is a platform with multiple products under one brand:

```
Cosmos AI (cosmosai.mw)
├── Cosmos Write          — Web app, AI business writing, all sectors
├── Cosmos AI Bot         — WhatsApp +265991455490, serves every Malawian
├── Future: Cosmos Summarise — Web app, document summarisation
└── Future: More tools    — Each added as the platform matures
```

### The Key Principle
One great tool beats ten mediocre ones. Products are added only when the existing ones are solid. Features are deepened before new products are launched.

---

## Product 1 — Cosmos Write (Web)

### What It Is
An AI-powered business writing assistant at `cosmosai.mw/tools/cosmos-write`. It produces complete, professional, ready-to-use documents instantly.

### Who It Serves
Every Malawian who has internet access and needs professional documents — professionals, NGO workers, government staff, students, entrepreneurs, traders. Not segmented by sector — the tool adapts to whoever is using it.

### Sector Coverage (Current and Growing)
The tool knows and serves every sector:
- Banking and finance
- Agriculture and farming
- Education and academia
- Healthcare and hospitals
- Government and civil service
- NGOs and donor organisations
- Legal and compliance
- Construction and engineering
- Hospitality and tourism
- Retail and trading
- Transport and logistics
- Media and communications
- Religious organisations
- Community and social work
- Technology and startups
- Everyday needs: complaints, rental agreements, job applications, payment requests

**This list grows through system prompt refinement — no code changes needed.**

### Pricing (Web)
| Plan | Generations | Price |
|---|---|---|
| Free (anonymous) | 3 per 24 hours via cookie | Free |
| Free (registered) | 10 per month | Free |
| Starter | 50 per month | MWK 5,000/month |
| Professional | Unlimited | MWK 15,000/month |

### Key Files
- `src/app/tools/cosmos-write/page.tsx` — the UI
- `src/server/api/routers/write.ts` — the tRPC mutation, generation logic, conversation saving
- `src/server/api/routers/conversation.ts` — conversation CRUD
- `prisma/schema.prisma` — Conversation and ConversationMessage models

### How Conversations Are Saved
Server-side only — inside the `write.generate` tRPC mutation. The client never calls separate save mutations. This prevents re-render loops and double animations. The server returns `conversationId` and the client updates the URL once.

### What Never Changes About Cosmos Write
- It is English-first (Chichewa may be added later via Hugging Face)
- It is account-based with tiers
- It lives on the web
- It is independent from WhatsApp

---

## Product 2 — Cosmos AI Bot (WhatsApp)

### What It Is
An AI assistant on WhatsApp number `+265991455490`. It serves every Malawian regardless of literacy level, technical skill, or language.

### Who It Serves
Everyone. A university professor writing a formal proposal. A market vendor needing a receipt. A farmer asking about crop pricing. A student needing help with a job application. The system adapts to the person — the person does not adapt to the system.

### Language Support
- **Current:** English only
- **Planned:** Automatic language detection via Hugging Face. If the user writes in Chichewa, the bot detects it, translates to English, sends to Claude, translates response back to Chichewa. The user never has to specify a language.

### Pricing (WhatsApp)
| Tier | Prompts | Price |
|---|---|---|
| Free | 5 per day | Free |
| Paid bundle | 50 prompts | MWK 500 |

Payment via Airtel Money or TNM Mpamba — no web account needed. Phone number is the identity.

### Key Files
- `src/app/api/webhooks/whatsapp/route.ts` — everything WhatsApp lives here

### What Is Separate from Cosmos Write
- Different system prompt — broader mandate, Cosmos AI identity
- Different limits — 5/day free, not 3/day
- Different payment model — MWK 500 bundles not monthly subscriptions
- Different identity storage — phone number not email account
- Conversation history stored in memory per phone number (database persistence planned)
- No tRPC — direct API calls inside the route handler

### What Is Shared with Cosmos Write
- Same Claude AI model (claude-haiku-4-5-20251001)
- Same Cosmos AI brand
- Same Malawian context knowledge
- Same cosmosai.mw domain for privacy/terms

### The Bot's Broader Mandate
Unlike Cosmos Write which focuses on document generation, the WhatsApp bot handles:
- Formal business documents (same as Cosmos Write)
- Simple everyday documents — receipts, payment requests, basic contracts
- Explanations — explain this document to me simply
- Business advice — how to price goods, how to register a business
- Questions — what is VAT, what is a TPIN, how does Airtel Money work
- All in English or Chichewa automatically

---

## Technical Stack

| Layer | Technology | Why |
|---|---|---|
| Framework | Next.js 15 (App Router) | Full-stack, server components, Vercel native |
| Language | TypeScript | Type safety across frontend and backend |
| API layer | tRPC | End-to-end type safety, no REST boilerplate |
| Database ORM | Prisma v7 | Type-safe queries, Neon compatible |
| Database | Neon PostgreSQL (eu-central-1) | Serverless Postgres, free tier generous |
| Auth | NextAuth v5 | JWT sessions, credentials providers |
| Styling | Tailwind v4 | Utility-first, fast iteration |
| Email | Resend | Domain verified, cosmosai.mw |
| AI | Anthropic Claude Haiku 4.5 | Fast, cheap, high quality |
| Hosting | Vercel (Hobby — public repo required) | Zero-config Next.js deployment |
| Package manager | pnpm | Fast, disk efficient |
| WhatsApp | Meta WhatsApp Business API (direct) | Not Twilio — direct Meta integration |
| Translation (planned) | Hugging Face Helsinki-NLP | English-Chichewa translation |

---

## Brand & Design

| Element | Value |
|---|---|
| Display font | Syne |
| Body font | DM Sans |
| Primary | cosmos-forest #0D4A3A |
| Accent | cosmos-accent #2E7D5E |
| Teal | cosmos-teal #2A8C6E |
| Sage | cosmos-sage #B8CFC4 |
| Background | cosmos-chalk #F2F5F3 |
| Night | cosmos-night #041E17 |
| Glyph | ✴ (not ✦ or Gemini-style) |
| Language | "Exploratory Meeting" not "Discovery Call" |

---

## Infrastructure & Services

### Domain
- Primary: `cosmosai.mw`
- Nameservers: Vercel (ns1.vercel-dns.com, ns2.vercel-dns.com)
- www redirects to non-www
- SSL: automatic via Vercel

### Email
- Provider: Resend (free tier: 3,000/month, 100/day)
- Sending domain: `noreply@cosmosai.mw` (verified)
- Business inbox: `hello@cosmosai.mw` (Zoho mailbox)
- Admin emails: ADMIN_EMAIL, ADMIN_EMAIL_2, ADMIN_EMAIL_3

### Database
- Provider: Neon PostgreSQL
- Region: eu-central-1
- Free tier: 0.5 GB storage, 190 compute hours/month

### WhatsApp
- Number: +265991455490 (Malawian business number)
- API: Meta WhatsApp Business API v26.0
- Webhook: `https://cosmosai.mw/api/webhooks/whatsapp`
- Access token: Permanent system user token (never expires)
- Verify token: stored in WHATSAPP_VERIFY_TOKEN env var

---

## Key Architectural Decisions

### 1. Two separate auth providers
Admin login uses env var credentials (no database record). User login uses database. Completely isolated — a user cannot access admin and admin does not appear in the User table.

### 2. Session tokens carry user state
JWT includes tier, generationsUsed, generationsLimit, isAdmin, emailVerified. Account page always fetches fresh from database to avoid stale token display.

### 3. Conversation saving is server-side only
Conversations saved inside write.generate tRPC mutation — not via client-side mutations. Prevents React re-render loops and double animations. Client receives one response and updates URL once.

### 4. Anonymous usage via cookie (web)
24-hour cookie stores session ID and remaining count. Cannot be reset by user (unlike sessionStorage). Expires automatically.

### 5. WhatsApp is completely separate from web
Different limits, different pricing, different system prompt, different identity model. They share the AI model and brand only. This allows each to evolve independently without coupling problems.

### 6. API isolation and graceful degradation
Each external API is isolated. A failure in one never crashes another:
- Resend: fire-and-forget, database saves first
- Anthropic: core product, errors surfaced cleanly
- Hugging Face (planned): always additive, Cosmos Write works without it
- Paychangu (planned): admin can upgrade manually if down
- Airtel/TNM (planned): WhatsApp bot works without payment if provider is down

### 7. Database schema is additive only
Never destructive migrations in production. Sacred data: ContactSubmission, User, Conversation, ConversationMessage, Service, AboutContent, Value.

### 8. Repository is public
Vercel free tier requires public repo for automatic deployments. Private repo needs Vercel Pro ($20/month). Secrets are safe in environment variables — code being public is an acceptable tradeoff at this stage.

### 9. Cosmos Write is one tool for all sectors
Not split into sector-specific tools. The system prompt grows smarter per sector over time. Same interface, same URL, same brand — increasingly intelligent.

---

## Environment Variables

```
DATABASE_URL                  — Neon connection string
AUTH_SECRET                   — NextAuth JWT secret
NEXTAUTH_URL                  — https://cosmosai.mw
ANTHROPIC_API_KEY             — Claude API key
RESEND_API_KEY                — Resend email API key
ADMIN_EMAIL                   — hello@cosmosai.mw
ADMIN_EMAIL_2                 — co-founder 1 Gmail
ADMIN_EMAIL_3                 — co-founder 2 Gmail
ADMIN_PASSWORD                — Admin dashboard password
WHATSAPP_PHONE_NUMBER_ID      — Malawian number Meta ID
WHATSAPP_BUSINESS_ACCOUNT_ID  — Meta business account ID
WHATSAPP_ACCESS_TOKEN         — Permanent system user token
WHATSAPP_VERIFY_TOKEN         — Webhook verification token
HUGGINGFACE_API_KEY           — Planned: translation
```

---

## Service Limits Reference

| Service | Free Limit | Upgrade | Alert At |
|---|---|---|---|
| Resend | 3,000 emails/month, 100/day | $20/month → 50,000 | 70% |
| Neon | 0.5 GB, 190 compute hours/month | $19/month → 10 GB | 85% |
| Vercel | 100 GB bandwidth, 6,000 build minutes | $20/month/member | Monitor |
| Anthropic | Pay as you go | ~$0.80/million tokens (Haiku) | Monitor cost |

---

## Build Pipeline — What Is Done

### Website
- [x] Home page with hero, services, about teaser, CTA
- [x] Services page — reads from database, editable from admin
- [x] About page — reads from database, editable from admin
- [x] Contact page — form saves to database, email notifications to all admins
- [x] Search — across Service, AboutContent, Value tables
- [x] Privacy Policy — `/privacy`
- [x] Terms of Service — `/terms`
- [x] Data Deletion — `/data-deletion`

### Auth
- [x] Admin login — env var credentials, separate from users
- [x] User registration with email verification via Resend
- [x] User login with JWT session
- [x] Email verification flow with resend option
- [x] Unverified user banner on account and Cosmos Write

### User Accounts
- [x] Registration and login
- [x] Account dashboard — usage, tier, remaining generations
- [x] Chat history page — `/account/history`
- [x] Tier system — Free, Starter, Professional
- [x] Monthly generation reset on login

### Cosmos Write (Web)
- [x] Chat interface with markdown rendering
- [x] Cosmic loader animation
- [x] Suggestion chips (10 categories)
- [x] Refine panel with quick options
- [x] Copy button per message
- [x] Anonymous limit — 3/day via cookie
- [x] Registered limit — 10/month Free, 50 Starter, Unlimited Professional
- [x] Server-side conversation saving
- [x] Conversation history loading from URL
- [x] History link for logged-in users
- [x] Limit reached screens — different for anonymous vs logged-in
- [x] Comprehensive Malawian system prompt

### Admin
- [x] Admin dashboard — contact submissions, pagination, mark as read
- [x] Content management — services, about, values
- [x] Cosmos Write stats — usage by type, daily activity
- [x] User management — tier upgrade, usage bars, next reset date
- [x] Health dashboard — service limits, usage tracking
- [x] Three admin emails for notifications

### WhatsApp Bot
- [x] Webhook at `/api/webhooks/whatsapp`
- [x] Message reception and Claude response
- [x] Guided mode — user types "help" to get menu
- [x] Conversation history in memory per phone number
- [x] Permanent system user token (never expires)
- [x] Malawian business number +265991455490 active
- [x] Meta app in Live mode

---

## Build Pipeline — What Is Next

### Immediate (WhatsApp improvements)
- [ ] 5 prompts per day limit (currently 3 — same as web anonymous)
- [ ] Updated system prompt — Cosmos AI identity, broader mandate, serves everyone
- [ ] Chichewa language detection and translation via Hugging Face
- [ ] Conversation persistence to database per phone number
- [ ] Airtel Money / TNM Mpamba payment — MWK 500 for 50 prompts

### Web improvements
- [ ] Session reset on sign out for privacy (chat messages clear)
- [ ] Cosmos Write system prompt — add remaining sectors
- [ ] Paychangu payment integration for web tiers
- [ ] Admin ability to delete users

### Future tools
- [ ] Cosmos Summarise — paste a long document, get a clear summary
- [ ] Hugging Face Whisper — speech to text for WhatsApp voice notes

### Future platform
- [ ] Organisation subscription bundle — org admin approves members
- [ ] Google sign-in
- [ ] Legal documents (deeper)
- [ ] Telegram alerts for system health

---

## Database Schema (Key Models)

```prisma
User              — email, password, tier, generationsUsed, generationsLimit
ContactSubmission — name, org, email, phone, service, message, read
Service           — CMS: title, tagline, description, deliverables, pricing
AboutContent      — CMS: key, value pairs
Value             — CMS: title, description
WriteGeneration   — documentType, inputs, output, sessionId, userId
Conversation      — title, userId, updatedAt
ConversationMessage — conversationId, role, content
EmailVerificationToken — email, token, expires
```

---

## Repository

- GitHub: github.com/Cosmos-AI-MW/cosmos-ai (public)
- Production: https://cosmosai.mw
- Staging: https://cosmos-ai-mw.vercel.app
- Local: http://localhost:3000
- Local path: C:\Users\finly\OneDrive\Documents\PhD\Kitchen\CosmosAI\devv\cosmos-ai

---

## Commands Reference

```bash
pnpm dev              — Start development server (Terminal 1)
pnpm build            — prisma generate && next build
pnpm db:push          — Push schema to Neon (stop dev first on Windows)
pnpm db:generate      — Regenerate Prisma client (stop dev first on Windows)
pnpm db:studio        — Open Prisma Studio at localhost:5555
pnpm db:seed          — Seed content tables only (safe for production)
```

### Critical Rules
- Always stop `pnpm dev` before `db:push` or `db:generate` on Windows
- Always run `pnpm build` locally before pushing to catch TypeScript errors
- Always run `db:push` before pushing to GitHub when schema changes
- Never run `db:push` without checking for data loss first
- Never run `db:seed` on production without confirming content tables only
- ContactSubmission records are production data — never wipe

---

*Last updated: October 2026*
*Maintained by: Finlyson Mwadambo Msiska — Technical Co-founder, Cosmos AI*
