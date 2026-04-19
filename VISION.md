# PMServer — Vision, Strategy & Implementation Tranches

> **Document Type:** Product & Engineering Strategy
> **Audience:** Founder / Solo Developer
> **Date:** April 2026

---

## Table of Contents

1. [Cloud Hosting — What It Costs & Why It's Worth It](#1-cloud-hosting--what-it-costs--why-its-worth-it)
2. [Yahoo Finance Free API — Risks & Alternatives](#2-yahoo-finance-free-api--risks--alternatives)
3. [Best Technology Stack for 2026](#3-best-technology-stack-for-2026)
4. [Database Decision — RDBMS vs Document DB](#4-database-decision--rdbms-vs-document-db)
5. [Product Vision — What You're Building](#5-product-vision--what-youre-building)
6. [Open Platform + Donation Model](#6-open-platform--donation-model)
7. [Implementation Tranches](#7-implementation-tranches)

---

## 1. Cloud Hosting — What It Costs & Why It's Worth It

### Realistic Cost Tiers

#### Tier 0 — Completely Free (Good for development & early beta)

| Service | What You Get | Cost |
|---------|-------------|------|
| [Railway.app](https://railway.app) | Node.js server, auto-deploy from GitHub | $0 (500 hours/month) |
| [MongoDB Atlas M0](https://www.mongodb.com/atlas) | 512MB shared MongoDB cluster | $0 forever |
| [Vercel](https://vercel.com) | Frontend hosting (React/Next.js) | $0 |
| [Render.com](https://render.com) | Alternative to Railway (spins down if idle) | $0 |
| **Total** | | **$0/month** |

**Catch:** Free servers sleep after 15 min of inactivity. First request is slow (cold start ~5-10 seconds).

---

#### Tier 1 — Minimal Production (~$5-10/month)

| Service | What You Get | Cost |
|---------|-------------|------|
| Railway Starter | Always-on Node.js, 512MB RAM, 1GB disk | $5/month |
| MongoDB Atlas M0 | 512MB free (enough for hundreds of users) | $0 |
| Vercel | Frontend (generous free tier) | $0 |
| **Total** | | **~$5/month** |

**This is your sweet spot.** Handles 100-500 active users comfortably.

---

#### Tier 2 — Growth (~$20-35/month)

| Service | What You Get | Cost |
|---------|-------------|------|
| Railway Pro or Fly.io | 1GB RAM, auto-scaling | $10-20/month |
| MongoDB Atlas M2 | 2GB dedicated, better performance | $9/month |
| Upstash Redis | Caching, rate limiting (free tier: 10K req/day) | $0-5/month |
| **Total** | | **~$20-35/month** |

---

### Benefits of Cloud Hosting vs Running Locally

| Benefit | Details |
|---------|---------|
| **Always Available** | Users access it 24/7. Your laptop being off doesn't matter. |
| **Auto SSL/HTTPS** | Railway and Render give you free HTTPS certificates automatically. |
| **Deploy in 60 seconds** | Push to GitHub → auto-deploys. No FTP, no manual restarts. |
| **Real URL for users** | `https://pmserver.up.railway.app` — shareable with anyone. |
| **Zero server maintenance** | No OS patches, no hardware failures, no power outages. |
| **Scale when needed** | Add more RAM/CPU with a slider — no migration needed. |
| **Logs and monitoring** | Built-in dashboards to see errors, traffic, memory usage. |
| **Database backups** | MongoDB Atlas auto-backs up daily. Free tier included. |

### Recommended Starting Path

```
1. Deploy to Railway.app free tier now (development)
2. When first real users join → upgrade to Railway Starter ($5/month)
3. When 500+ active users → evaluate growth tier
```

**Honest estimate:** If you get 50 regular users, $5/month pays for itself if even one user donates $5.

---

## 2. Yahoo Finance Free API — Risks & Alternatives

### Current Reality

`yahoo-finance2` is an **unofficial, reverse-engineered** library. It works by scraping Yahoo Finance's internal APIs. This means:

| Risk | Likelihood | Impact |
|------|-----------|--------|
| Yahoo blocks the API without notice | Medium | All price data stops |
| Rate limiting (too many requests) | High (already happens) | Partial data loss |
| Data format changes break the library | Medium | Need library update |
| Terms of Service violation | Technically yes | Unlikely enforcement for personal use |

### The Good News

For a PMS serving retail investors who aren't trading at HFT scale, Yahoo Finance is perfectly usable IF you:

1. **Cache aggressively** — store prices in MongoDB, only refresh every 30-60 minutes (already doing this with your cron job)
2. **Never fetch per-user-request** — always serve from cache
3. **Batch requests** — fetch all portfolio securities in one cron run, not on-demand

### Free API Alternatives (Ranked for Your Use Case)

| Provider | Free Tier | Best For | Indian Stocks |
|----------|-----------|----------|:---:|
| **Yahoo Finance (current)** | Unlimited (unofficial) | Everything | Yes (NSE/BSE) |
| **[Twelve Data](https://twelvedata.com)** | 800 requests/day | Real-time + history | Limited |
| **[Alpha Vantage](https://www.alphavantage.co)** | 25 req/day (too low) | US stocks only | No |
| **[NSE India Official](https://nseindia.com)** | Free (public data) | Indian stocks | Yes (best) |
| **[Polygon.io](https://polygon.io)** | Free (15min delay) | US only | No |
| **[Open Exchange Rates](https://openexchangerates.org)** | 1000 req/month free | Currency rates only | — |

### Recommended Hybrid Strategy (Zero Cost)

```
Indian Stocks (NSE/BSE):
  → Use nse-data package (already installed) as primary
  → Fall back to Yahoo Finance

US/Global Stocks:
  → Yahoo Finance as primary (cached)
  → Twelve Data as fallback (800 free req/day)

Currency Rates:
  → Open Exchange Rates free tier
  → Or European Central Bank free XML feed (no rate limit)

Price History:
  → Fetch once, store in MongoDB PriceHistories collection
  → Never re-fetch what you already have
```

---

## 3. Best Technology Stack for 2026

### Current Stack Assessment

| Current | Status | Recommendation |
|---------|--------|----------------|
| Node.js + Express | Still solid | Keep — but consider Fastify for 2x speed |
| Babel transpilation | Legacy approach | Migrate to native Node.js ESM (`"type": "module"`) |
| MongoDB + Mongoose | Good for PMS | Keep for now (see DB section) |
| JWT auth (disabled) | Needs fix | Re-enable + add refresh tokens |
| moment.js | Deprecated | Replace with `date-fns` (tree-shakeable) |
| inversify (unused) | Dead weight | Remove |
| yahoo-finance2 | Unofficial but works | Keep + add cache layer |

### Recommended Modern Stack

```
Backend (Keep & Improve):
  Runtime:      Node.js 20+ LTS (native ESM, no Babel needed)
  Framework:    Express.js 4 → consider Fastify v4 (3x faster, built-in schema validation)
  Validation:   Zod (TypeScript-friendly) or Joi (you already know it)
  Auth:         JWT + refresh tokens, or Clerk.dev (free tier, handles everything)
  Logging:      Pino (fastest JSON logger for Node.js, Fastify's default)
  DB:           MongoDB Atlas (keep) or PostgreSQL via Supabase (see DB section)
  Cache:        Upstash Redis (serverless, free tier, perfect for Railway)
  Queue:        Bull (for background jobs, replaces raw cron) or BullMQ

Frontend (New):
  Framework:    Next.js 15 (React, SSR, file-based routing, free on Vercel)
  UI Library:   shadcn/ui (copy-paste components, Tailwind-based, free)
  Charts:       Recharts or TradingView Lightweight Charts (free)
  State:        Zustand (simple) or TanStack Query (server state)

Voice Input:
  Browser API:  Web Speech API (built into Chrome/Edge — free, no backend needed)
  Alternative:  OpenAI Whisper API ($0.006/minute — extremely cheap)

Deployment:
  Backend:      Railway.app
  Frontend:     Vercel
  DB:           MongoDB Atlas or Supabase
  Cache:        Upstash Redis

CI/CD:
  GitHub Actions (free for public repos)
```

### Why These Choices

- **Next.js on Vercel**: Zero config, free SSL, global CDN, deploy in 30 seconds
- **shadcn/ui**: Beautiful financial UI components, no subscription, you own the code
- **Pino logging**: Structured JSON logs that Railway/Render can parse and display
- **Upstash Redis**: Serverless Redis — pay per request, not per hour. $0 for small scale.
- **Web Speech API**: Browser-native voice recognition, no API cost for voice position entry

---

## 4. Database Decision — RDBMS vs Document DB

### The Honest Answer for a PMS

**Short term (now):** Keep MongoDB — migration cost too high for the benefit.
**Long term (if rebuilding):** PostgreSQL is the better choice for financial data.

### Why SQL (PostgreSQL) Is Technically Better for PMS

Financial data is **relational by nature**:

```
User → Portfolio → Transaction → Security → Price
         ↓
       Account → ExchangeRate
```

| Advantage | Why It Matters for PMS |
|-----------|----------------------|
| **ACID transactions** | A buy transaction must atomically update shares_owned + cost_basis. MongoDB supports this but it's complex. |
| **Complex reporting queries** | Portfolio P&L across holdings with currency conversion is a 3-table JOIN in SQL. In MongoDB it's 3 separate queries + manual join in JS. |
| **XIRR / financial calculations** | Easier with window functions in SQL (e.g., running balance, rolling averages) |
| **Data integrity** | Foreign key constraints prevent orphaned transactions when a portfolio is deleted. Mongoose has no FK constraints. |
| **Full-text search** | PostgreSQL has built-in full-text search (no separate Elasticsearch) |
| **Audit trail** | Row-level versioning with `updated_at` triggers is built in |

### Why MongoDB Is Fine for Now

| Advantage | Context |
|-----------|---------|
| **Flexible schema** | Price data from Yahoo Finance has 60+ irregular fields — great fit for document model |
| **Time-series data** | PriceHistories is a natural document collection |
| **No migration cost** | You have working code. Rewriting everything is months of work. |
| **Free Atlas tier** | 512MB is plenty for a PMS with hundreds of users |
| **Already working** | With proper indexes, MongoDB handles PMS workloads fine |

### Recommended Hybrid Approach (Best of Both Worlds)

```
PostgreSQL (via Supabase — free tier):
  → Users, Portfolios, Transactions, Accounts
  → ExchangeRates, Currencies, SecurityMaster
  → All relational, transactional, reporting data

MongoDB (Atlas free tier):
  → PriceData (60+ fields, schema varies by security type)
  → PriceHistories (time-series, high write volume)
  → Carg (calculated metrics cache)
  → ATHTracker

Cache (Upstash Redis):
  → Current prices (TTL: 5 minutes)
  → Security search results (TTL: 1 hour)
  → User session data
```

**But for now: Keep MongoDB for everything.** Add PostgreSQL/Supabase when you rebuild the frontend.

---

## 5. Product Vision — What You're Building

You described a clear product. Here it is structured as a feature map:

```
┌─────────────────────────────────────────────────────────────────┐
│                    PMServer Platform                            │
│                   "Open PMS for Everyone"                       │
├─────────────────────┬───────────────────────────────────────────┤
│   CORE (Built)      │   NEXT (Build)                           │
│                     │                                           │
│ ✓ Portfolio tracking│ ○ OMS Provider Connections               │
│ ✓ Holdings & P&L    │ ○ Voice Position Entry                   │
│ ✓ CAGR heat maps    │ ○ Broker CSV Import + Mapping            │
│ ✓ Price history     │ ○ Portfolio rebalancing                  │
│ ✓ ATH tracking      │ ○ Alerts & notifications                 │
│ ✓ Multi-currency    │ ○ Dividend tracking                      │
│ ✓ Watchlist         │ ○ Tax lot accounting                     │
│ ✓ User accounts     │ ○ Net worth dashboard                    │
└─────────────────────┴───────────────────────────────────────────┘
```

### Feature 1: OMS Provider Connections

Connect directly to broker APIs so holdings sync automatically.

```
Supported Indian Brokers (have public APIs):
  - Zerodha (Kite Connect API — ₹2000/month for developers)
  - Upstox (free API)
  - Angel Broking (free API)
  - 5paisa (free API)
  - Fyers (free API)

Strategy:
  - Build an OMS adapter interface
  - Each broker implements the same interface:
    getPositions() → PortfolioTransaction[]
    getOrders() → Order[]
    getTrades() → Trade[]
  - User links their broker account via OAuth / API key
  - Sync runs nightly or on-demand
```

### Feature 2: Voice Recording for Position Entry

```
How it works:
  User says: "Buy 50 shares of Reliance at 2850"

  Browser Web Speech API transcribes in real-time → free
  
  Parser extracts:
    action: "buy"
    quantity: 50
    symbol: "RELIANCE" → lookup in SecurityMaster
    price: 2850

  Show confirmation dialog → user confirms → transaction created

Fallback:
  If symbol not recognized → show search results
  If price not said → fetch current market price

Cost: ₹0 (Web Speech API is free in Chrome/Edge)
```

### Feature 3: Broker CSV Import with Smart Mapping

```
Flow:
  1. User uploads CSV from broker (Zerodha, Upstox, etc.)
  2. System reads headers and shows mapping UI:
  
     Your CSV Column    →    PMServer Field
     ─────────────────────────────────────
     "Symbol"           →    symbol ✓ (auto-detected)
     "Qty"              →    shares_owned ✓
     "Buy Price"        →    executed_price ✓
     "Date"             →    createdAt ✓
     "Trade Type"       →    tran_code (needs mapping)
                                  "B" = buy ✓
                                  "S" = sell ✓

  3. Save mapping as "Zerodha Trade Book" template
  4. Next upload → auto-apply saved mapping
  5. Show preview: "12 new trades, 3 already imported — proceed?"
  6. User confirms → import

Saved mappings stored per user in MongoDB:
  { userId, mappingName, columnMap, brokerFormat }
```

---

## 6. Open Platform + Donation Model

### Why Open Source is the Right Call

- **Builds trust** — users can see there's no hidden data harvesting (huge for financial data)
- **Community contributions** — other developers add broker adapters for free
- **No licensing cost** — MIT license, anyone can use
- **Differentiator from commercial PMS** — commercial tools (Smallcase, Tickertape) are closed; yours is transparent

### Recommended Open Source License

Use **MIT License** — most permissive, attracts the most contributors.

### Donation Infrastructure (Zero Platform Cost)

| Platform | Fee | Setup |
|---------|-----|-------|
| **GitHub Sponsors** | 0% (GitHub covers it) | Best — shown directly on repo |
| **Buy Me a Coffee** | 5% | Easy, professional |
| **Ko-fi** | 0% on donations | Good alternative |
| **Razorpay (India)** | 2% | Best for INR donations |
| **UPI QR Code** | 0% | Simplest for Indian users |

### Recommended Setup

```
1. GitHub Sponsors (international donors)
2. UPI QR code in README and app footer (Indian donors, zero fee)
3. Ko-fi page for one-time and recurring support

Add to your README:
  "This tool is free forever. If it saves you time,
   consider buying me a coffee ☕"
```

### Sustainability Model

```
Year 1: $0 hosting (free tiers), community growth
Year 2: Donations cover $5-10/month hosting
Year 3+: If popular, optional "Pro" cloud-hosted version
         with automatic sync (users who don't want to self-host)
         Keep self-hosted version always free
```

---

## 7. Implementation Tranches

> Each tranche is scoped to be completable in 1-2 Claude Code sessions. Earlier tranches unblock later ones.

---

### Tranche 1 — Stop the Bleeding (Critical Fixes)

**Goal:** Fix all P0/P1 bugs. Make the API safe and functional.
**Token cost:** Low (targeted fixes, no new features)

```
Tasks:
  1.1 Re-enable JWT authentication in index.js
  1.2 Fix fileUploadService.js — reference correct SecurityMaster model
  1.3 Fix ATHCutterService.js — replace yahooFinance.historical() with correct method
  1.4 Move MongoDB URI to environment variable (config.js)
  1.5 Add .env.example file with all required variables
  1.6 Fix securityservice.js::getSecurityById() — remove req/res from service layer
  1.7 Implement User.getUserHoldingIds() in User model (or fix auth middleware)
  1.8 Add centralized error handling middleware to index.js

Deliverable: A stable, authenticated API with no crash-level bugs
```

---

### Tranche 2 — Input Validation & Security Hardening

**Goal:** Protect all endpoints from bad/malicious input.
**Token cost:** Medium

```
Tasks:
  2.1 Install Joi — add validation schemas for:
       - User registration/login
       - Portfolio create/update
       - Transaction create
       - Account create/update
       - Exchange rate create/update
  2.2 Add validation middleware helper (reusable)
  2.3 Add helmet.js (security headers)
  2.4 Add express-rate-limit (per IP, per user)
  2.5 Add CORS configuration per environment
  2.6 Add pagination to all list endpoints (page, limit query params)

Deliverable: Production-safe API
```

---

### Tranche 3 — Broker CSV Import with Smart Mapping

**Goal:** Let users import their trade history from any broker.
**Token cost:** High (new feature, new model, UI considerations)

```
Tasks:
  3.1 Create ImportMapping model:
       { userId, mappingName, brokerName, columnMap, dateFormat }
  3.2 Build CSV parser service:
       - Detect headers automatically
       - Suggest field mappings using fuzzy matching
       - Validate before import (preview mode)
       - Deduplicate already-imported trades
  3.3 Create import routes:
       POST /api/import/preview    — parse and show what will be imported
       POST /api/import/confirm    — execute the import
       GET  /api/import/mappings   — get saved mappings for user
       POST /api/import/mappings   — save a new mapping
  3.4 Add import history tracking (what was imported, when, from which file)

Pre-built mappings for common Indian brokers:
  - Zerodha Trade Book
  - Upstox Trade History
  - Groww Portfolio Export
  - Angel Broking Trade History

Deliverable: Users can upload CSV and import trades in < 2 minutes
```

---

### Tranche 4 — Voice Position Entry

**Goal:** Allow users to speak a trade and have it parsed and confirmed.
**Token cost:** Medium (mainly frontend, light backend)

```
Tasks:
  4.1 Backend: Voice command parser service
       Input:  "Buy 50 Reliance at 2850"
       Output: { action: "buy", qty: 50, symbol: "RELIANCE.NS", price: 2850 }
  4.2 Backend: Fuzzy symbol matching (Reliance → RELIANCE.NS)
  4.3 Backend: POST /api/voice/parse endpoint
  4.4 Frontend: Web Speech API integration
       - Record button (hold to speak)
       - Real-time transcription display
       - Parsed result → confirmation dialog
       - "Yes, add it" → calls createTransaction endpoint

Deliverable: User speaks trade, confirms, position added
```

---

### Tranche 5 — OMS Broker API Connections

**Goal:** Auto-sync holdings from supported brokers.
**Token cost:** Very High (one adapter per broker)

```
Tasks:
  5.1 Design BrokerAdapter interface:
       interface BrokerAdapter {
         connect(credentials): Promise<void>
         getPositions(): Promise<Position[]>
         getTrades(): Promise<Trade[]>
         getAccountBalance(): Promise<Balance>
       }
  5.2 Implement Upstox adapter (free API, good docs)
  5.3 Implement Fyers adapter (free API)
  5.4 Create BrokerCredential model (encrypted storage)
  5.5 Add broker sync cron job (nightly, or on-demand)
  5.6 Add sync status tracking (last synced, errors)

Routes:
  POST /api/broker/connect         — link a broker account
  POST /api/broker/:broker/sync    — trigger manual sync
  GET  /api/broker/status          — sync status per broker

Deliverable: Holdings auto-sync from linked broker accounts
```

---

### Tranche 6 — Frontend (Next.js)

**Goal:** Build the web interface.
**Token cost:** Very High (separate project)

```
Pages:
  /dashboard          — Portfolio overview, net worth, today's P&L
  /portfolio/:id      — Portfolio detail, holdings table, allocation chart
  /import             — CSV upload + mapping UI
  /securities         — Search and add securities
  /heatmap/:symbol    — Price history heat map
  /accounts           — Bank/brokerage accounts
  /settings           — Broker connections, profile

Components:
  - HoldingsTable (sort by gain/loss, symbol, weight)
  - AllocationPieChart (current vs target)
  - PriceHeatMap (monthly CAGR grid)
  - VoiceButton (record → transcribe → confirm)
  - ImportMapper (CSV column → PMS field)
  - PerformanceChart (portfolio value over time)
```

---

### Tranche 7 — Performance, Caching & Reliability

**Goal:** Handle real load without hitting Yahoo Finance rate limits.
**Token cost:** Medium

```
Tasks:
  7.1 Add Upstash Redis client
  7.2 Cache current prices (TTL: 5 min)
  7.3 Cache security master list (TTL: 24 hours)
  7.4 Cache exchange rates (TTL: 1 hour)
  7.5 Add retry logic with exponential backoff for Yahoo Finance calls
  7.6 Add circuit breaker (if Yahoo fails 3x, switch to cache-only mode)
  7.7 Add health check endpoint: GET /health
  7.8 Add structured logging with Pino

Deliverable: 95%+ uptime even when Yahoo Finance is flaky
```

---

### Tranche 8 — Donation & Community

**Goal:** Set up the open source community and donation infrastructure.
**Token cost:** Low

```
Tasks:
  8.1 Add LICENSE file (MIT)
  8.2 Add CONTRIBUTING.md (how to add a broker adapter)
  8.3 Add GitHub Sponsors configuration (.github/FUNDING.yml)
  8.4 Add donation links to README and app footer
  8.5 Set up GitHub Issues templates (bug report, feature request, broker request)
  8.6 Add Docker + docker-compose.yml for self-hosting
  8.7 Write self-hosting guide (5-minute setup)

Deliverable: Anyone can self-host and contribute
```

---

## Quick Start Recommendation

**If you're asking "what should I do first this week?"**

```
Day 1: Start with Tranche 1 (tell Claude: "implement Tranche 1 from VISION.md")
         → Takes 1-2 Claude sessions
         → Your API becomes secure and stable

Day 2-3: Start Tranche 2 (validation and security)
         → Your API is now production-ready

Week 2: Deploy to Railway.app free tier
         → Real URL, HTTPS, auto-deploy from GitHub

Week 3+: Start Tranche 3 (CSV import)
         → This is the feature that makes early users stay
```

---

## Prompting Tips for Claude Code (Since You're New)

Being specific gets better results than being vague:

```
VAGUE (avoid):
  "Fix the bugs"

SPECIFIC (use this):
  "Implement Tranche 1 from VISION.md. Start with task 1.1:
   re-enable authenticateJWT middleware in index.js, then move
   to task 1.2. Fix one task at a time and tell me when each is done."
```

Other useful prompts:
- `"Read [filename] and explain what this function does"` — understand code first
- `"Before changing anything, show me what you plan to do"` — review before execution
- `"Only change what's needed for this task, don't refactor other things"` — keep scope tight
- `"Show me the diff before writing it"` — see changes before they're applied

---

*Document generated: April 2026 | PMServer Engineering Strategy*
