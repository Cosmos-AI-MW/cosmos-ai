# Cosmos AI — Architecture & Decision Record

This document captures the key architectural decisions made during development of the Cosmos AI platform. It exists so future contributors understand not just what was built but why.

---

## Stack

| Layer           | Technology              | Why                                                         |
| --------------- | ----------------------- | ----------------------------------------------------------- |
| Framework       | Next.js 15 (App Router) | Full-stack, server components, edge-ready, Vercel native    |
| Language        | TypeScript              | Type safety across frontend and backend                     |
| API layer       | tRPC                    | End-to-end type safety, no REST boilerplate                 |
| Database ORM    | Prisma v7               | Type-safe queries, schema migrations, Neon compatible       |
| Database        | Neon PostgreSQL         | Serverless Postgres, free tier generous, EU region          |
| Auth            | NextAuth v5             | JWT sessions, credentials providers, flexible               |
| Styling         | Tailwind v4             | Utility-first, fast iteration                               |
| Email           | Resend                  | Developer-friendly, domain verification, Vercel integration |
| AI              | Anthropic Claude Haiku  | Fast, cheap, high quality for business writing              |
| Hosting         | Vercel                  | Zero-config Next.js deployment, CDN, serverless functions   |
| Package manager | pnpm                    | Fast, disk efficient                                        |

---

## Key Architectural Decisions

### 1. Two separate auth providers — not one

**Decision:** Admin login and user login are completely separate NextAuth credential providers.

**Why:** Admins are not database users — they are environment variable credentials. This means:

- No admin record in the User table — zero risk of privilege escalation
- User login failures never reveal admin credentials
- Admin session and user session are completely isolated
- A user trying admin credentials at `/auth/login` correctly fails

**Rule:** Admin uses `signIn("admin")`, users use `signIn("user")`. Never mix.

---

### 2. Session tokens carry user state

**Decision:** JWT tokens include `tier`, `generationsUsed`, `generationsLimit`, `isAdmin`, and `emailVerified`.

**Why:** Avoids a database query on every page load to check tier or admin status. The tradeoff is that session data can be stale — a tier upgrade takes effect on next login.

**Mitigation:** The account page always fetches fresh data from the database directly (`force-dynamic`, `db.user.findUnique`) so the displayed count is always accurate even if the session token is stale.

---

### 3. Conversation saving is server-side only

**Decision:** Conversations are saved inside the `write.generate` tRPC mutation on the server — not via separate client-side mutations after generation.

**Why:** Client-side mutations caused React re-renders that triggered double animations in the CosmicLoader. Moving saving to the server means the client receives one response (`output`, `remaining`, `conversationId`) and updates UI once. Zero extra mutations, zero re-render loops.

**Rule:** Never save conversation messages from the client. Always go through the generate mutation.

---

### 4. Anonymous usage via cookie, not session

**Decision:** Anonymous users (not logged in) get a cookie-based session with a 24-hour limit of 3 generations. The cookie stores `{ id, created, remaining }`.

**Why:** Server-side session for anonymous users would require a database record per visitor — expensive and unnecessary. Cookie is client-side, expires automatically, and is harder to game than `sessionStorage` which resets on new tab.

**Limit hierarchy:**

- Anonymous: 3 generations per 24 hours
- Free registered: 10 per month
- Starter: 50 per month
- Professional: unlimited (stored as 999999, displayed as "Unlimited")

---

### 5. API isolation and graceful degradation

**Decision:** Each external API is isolated behind its own module. A failure in one never crashes another.

**APIs and their isolation:**

- `src/lib/email.ts` — Resend. Contact form saves to DB first, email is fire-and-forget with `.catch()`. Email failure never blocks form submission.
- `src/server/api/routers/write.ts` — Anthropic. Core product. If this fails the error is surfaced to the user cleanly.
- Future: Hugging Face — translation and summarisation. Always additive. Cosmos Write works fully without it. If translation fails, pass the original text to Claude directly.
- Future: Paychangu — payments. Tier upgrades can be done manually by admin if Paychangu is down.

**Rule:** Never make the core generation flow depend on a secondary API. Enhance, never couple.

---

### 6. Database schema is additive only

**Decision:** Never run `pnpm db:push` without checking for data loss. Schema changes must be additive (new tables, new optional fields) never destructive.

**Sacred data:**

- `ContactSubmission` — real client enquiries, never wipe
- `User` — real user accounts
- `Conversation` and `ConversationMessage` — user history
- `Service`, `AboutContent`, `Value` — CMS content

**Safe to wipe in development:** `WriteGeneration`, `EmailVerificationToken`

**Rule:** Always run `pnpm db:push` (not `db:migrate reset`) in production. Always stop dev server on Windows before schema changes.

---

### 7. Prisma v7 specific configuration

**Decision:** Prisma v7 uses a different configuration pattern from v5/v6.

**Key differences:**

- `generator provider = "prisma-client"` not `"prisma-client-js"`
- `datasource url` removed from schema, lives in `prisma.config.ts`
- `src/server/db.ts` uses `PrismaPg` adapter from `@prisma/adapter-pg`
- Import path: `../../generated/prisma/client`
- `/generated` is gitignored — Vercel regenerates via `prisma generate && next build`
- `binaryTargets = ["native", "rhel-openssl-3.0.x"]` required for Vercel

---

### 8. Three admin emails

**Decision:** Contact form notifications go to up to three admin emails simultaneously.

**Current assignment:**

- `ADMIN_EMAIL` — hello@cosmosai.mw (Zoho business mailbox)
- `ADMIN_EMAIL_2` — personal Gmail of co-founder 1
- `ADMIN_EMAIL_3` — personal Gmail of co-founder 2

**Why three:** Business mailbox may not always be checked. Personal Gmail ensures notifications are seen. When Google Workspace is set up on cosmosai.mw, the Zoho mailbox will be replaced.

---

## Service Limits (Free Tiers)

| Service   | Free Limit                              | Upgrade Cost                      | Action at 85%                |
| --------- | --------------------------------------- | --------------------------------- | ---------------------------- |
| Resend    | 3,000 emails/month, 100/day             | $20/month for 50,000              | Email alert to admins        |
| Neon      | 0.5 GB storage, 190 compute hours/month | $19/month for 10 GB               | Warning on health dashboard  |
| Vercel    | 100 GB bandwidth, 6,000 build minutes   | $20/month per member              | Monitor deployments          |
| Anthropic | Pay as you go                           | ~$0.80 per million tokens (Haiku) | Monitor via health dashboard |

---

## Future Architecture Decisions (Pending)

### WhatsApp Business Chatbot

- Webhook endpoint at `/api/webhooks/whatsapp` receives messages from Meta
- Calls Claude for response generation
- Airtel Money and TNM Mpamba payment confirmation via webhook
- Tier upgrades triggered server-side on payment confirmation
- Loosely coupled — website works fully without WhatsApp

### Hugging Face Integration

- Translation module at `src/lib/translate.ts`
- English ↔ Chichewa via Helsinki-NLP models
- Speech to text via Whisper
- Always optional — core generation never depends on it
- Graceful fallback: if translation fails, pass original text to Claude

### Paychangu

- Payment initiation from `/account` page
- Webhook at `/api/webhooks/paychangu` confirms payment
- On confirmation: update user tier via `upgradeUser` mutation
- Admin can always upgrade manually if Paychangu is down

### Organisation Subscription Bundle

- New `Organisation` model with `adminUserId`, `memberLimit`, `tier`
- Organisation admin approves members
- Members inherit organisation tier
- Separate billing from individual accounts

---

## Repository

- **GitHub:** github.com/Cosmos-AI-MW/cosmos-ai (public)
- **Production:** cosmosai.mw
- **Staging:** cosmos-ai-mw.vercel.app
- **Local:** http://localhost:3000

## Environment Variables Required

---

_Last updated: September 2026_
_Maintained by: Cosmos AI development team_
