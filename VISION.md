# PMServer — Complete Vision, Strategy & Implementation Plan

> **Document Type:** Product & Engineering Strategy (Living Document)
> **Audience:** Founder / Solo Developer
> **Last Updated:** April 2026

---

## Table of Contents

1. [What You Are Building](#1-what-you-are-building)
2. [Full Feature Requirements](#2-full-feature-requirements)
3. [Cloud Hosting — Costs & Benefits](#3-cloud-hosting--costs--benefits)
4. [Yahoo Finance Free API — Strategy](#4-yahoo-finance-free-api--strategy)
5. [Best Technology Stack (2026)](#5-best-technology-stack-2026)
6. [Database Decision](#6-database-decision)
7. [Claude AI Integration — Portfolio Intelligence](#7-claude-ai-integration--portfolio-intelligence)
8. [Excel / CSV Holdings Import](#8-excel--csv-holdings-import)
9. [Open Platform + Donation Model](#9-open-platform--donation-model)
10. [Deployment Guide](#10-deployment-guide)
11. [Implementation Tranches (All)](#11-implementation-tranches-all)
12. [Prompting Guide for Claude Code](#12-prompting-guide-for-claude-code)

---

## 1. What You Are Building

**PMServer** is a fully open-source, self-hostable Portfolio Management System for retail investors — primarily targeting Indian market (NSE/BSE) but supporting global stocks.

### Your Core Requirements (As Stated)

| Requirement | Status | Details |
|-------------|--------|---------|
| Portfolio tracking (holdings, P&L) | ✅ Built | Multi-portfolio, buy/sell transactions |
| Excel / spreadsheet import | ✅ Built | .xlsx, .xls, .csv with smart column mapping |
| CSV import with broker mapping | ✅ Built | Zerodha, Upstox, Groww, Angel templates |
| Voice position entry | ✅ Built | Browser mic → NLP parser → confirm → save |
| OMS broker API connections | ✅ Built | Upstox, Fyers OAuth adapters |
| Claude AI portfolio analysis | ✅ Built | Personal API key, on-demand analysis |
| CAGR heat maps | ✅ Built | Monthly/yearly price history visualization |
| ATH (All-Time High) tracking | ✅ Built | Breakout frequency analysis |
| Multi-currency accounts | ✅ Built | INR, USD, EUR, GBP, AUD, etc. |
| Watchlist | ✅ Built | Per-user symbol watchlist |
| Free hosting deployment | 📋 Planned | Railway + MongoDB Atlas free tier |
| Open source + donation | ✅ Built | MIT License, donation links |

---

## 2. Full Feature Requirements

### 2.1 Holdings Management

```
Primary input method: Excel/CSV import (manual, from your spreadsheet)

Excel import flow:
  1. User uploads .xlsx or .csv file
  2. System reads headers → auto-suggests column mapping
  3. User confirms or adjusts the mapping
  4. Save mapping as template (e.g. "My Excel Template")
  5. Preview rows — see what will be imported
  6. Confirm → positions created in selected portfolio

Supported file formats:
  .xlsx — Microsoft Excel (most common)
  .xls  — Legacy Excel
  .csv  — Comma-separated (any broker export)
  .ods  — LibreOffice Calc (future)

Manual entry (fallback):
  → Add position form (symbol search + qty + price + date)
  → Voice command ("buy 50 Reliance at 2850")
```

### 2.2 Claude AI Portfolio Intelligence

```
User connects their personal Claude API key (stored securely, per-user)
API key is NEVER shared — each user uses their own Anthropic account

Analysis types available on demand:
  📊 Portfolio Health Score     — diversification, concentration risk, sector balance
  📈 Performance Analysis       — best/worst performers, CAGR comparison
  ⚖️  Rebalancing Suggestions   — which to buy more / reduce
  🔍 Stock Deep Dive            — fundamental analysis of a single holding
  ⚠️  Risk Assessment           — volatility, beta, drawdown analysis
  💰 Tax Optimization           — STCG vs LTCG, which lots to sell
  📅 SIP Recommendation         — which stocks to add to monthly SIP
  💬 Free Chat                  — "Why is my portfolio underperforming Nifty?"

How it works:
  1. User saves their Claude API key in Settings
  2. System fetches live portfolio data (holdings, prices, P&L, CAGR)
  3. Builds a structured context and sends to Claude API
  4. Claude responds with analysis in the UI
  5. User can ask follow-up questions in the same session
  6. Conversation history kept for the session (not stored)
```

### 2.3 OMS / Broker Connections

```
Supported (free API):
  - Upstox Developer API v2 (free, OAuth)
  - Fyers API v3 (free, OAuth)

Coming soon:
  - Angel Broking SmartAPI (free)
  - 5paisa API (free)
  - Groww (unofficial)
  - Zerodha Kite Connect (₹2000/month — premium)

Connection flow:
  1. User creates app at broker's developer portal (5 minutes)
  2. Pastes API key + secret into PMServer Settings
  3. Clicks "Connect" → redirected to broker login
  4. After OAuth, positions auto-sync into selected portfolio
  5. Manual sync on demand OR automatic nightly sync
```

### 2.4 Deployment Options

```
Option A — Railway.app (Recommended for beginners)
  Cost: $0 → $5/month
  Effort: 30 minutes setup
  Steps: Connect GitHub → Add env vars → Deploy

Option B — Render.com (Free tier with sleep)
  Cost: $0 (sleeps after 15min idle)
  Effort: 30 minutes

Option C — Self-hosted VPS (Full control)
  Cost: ₹200-500/month (DigitalOcean, Linode)
  Effort: 1-2 hours (Docker + nginx)

Database: MongoDB Atlas M0 (always free, 512MB)
Frontend: Vercel (free, global CDN)
```

---

## 3. Cloud Hosting — Costs & Benefits

### Recommended Free Tier Setup

| Service | What | Cost |
|---------|------|------|
| [Railway.app](https://railway.app) | Backend API (Node.js) | $0–$5/month |
| [MongoDB Atlas](https://www.mongodb.com/atlas) | Database (M0 free cluster) | $0 forever |
| [Vercel](https://vercel.com) | Frontend (Next.js) | $0 forever |
| Total | Full production setup | **$0–$5/month** |

### Why Cloud Beats Running Locally

| Benefit | Detail |
|---------|--------|
| Always on | Friends/family can access it anytime |
| Real HTTPS URL | `https://yourname.up.railway.app` |
| Auto-deploy | Push to GitHub → live in 60 seconds |
| No laptop needed | Server runs 24/7 without your computer |
| Free SSL certificate | No certificate management |
| MongoDB daily backups | Atlas backs up automatically |
| Logs & monitoring | See errors in the dashboard |

### Scaling Path

```
0-50 users:  Railway free → $0/month (may sleep)
50-200 users: Railway Starter → $5/month (always on)
200-1000 users: Railway Pro + Atlas M2 → $25/month
1000+ users: Evaluate dedicated VPS or fly.io
```

---

## 4. Yahoo Finance Free API — Strategy

### Current Use (yahoo-finance2)
- Unofficial scraper library — no API key needed
- Rate limits apply if you call it on every request
- **Solution:** Cache everything (already implemented — 5min TTL for prices)

### Smart Caching Strategy (Implemented)

```
Live prices:      5-minute cache (node-cache)
Security master:  24-hour cache
Exchange rates:   1-hour cache
Price history:    MongoDB (permanent — fetched once, never re-fetched)
CAGR:             MongoDB (recalculated monthly)
```

### Hybrid Data Strategy for Indian Stocks

```
NSE/BSE stocks (primary):
  → nse-data package (already installed) — official NSE data, free
  → Yahoo Finance fallback

US/Global stocks:
  → Yahoo Finance (cached aggressively)
  → Twelve Data (800 free req/day) as secondary

Currency rates:
  → European Central Bank free XML feed (zero rate limit)
  → Open Exchange Rates (1000 req/month free)
```

---

## 5. Best Technology Stack (2026)

### Current Stack (Keep — Solid Choices)

```
Backend:   Node.js + Express.js + Babel
Database:  MongoDB + Mongoose
Auth:      JWT (jsonwebtoken + bcrypt)
Cache:     node-cache (in-memory, zero setup)
Market:    yahoo-finance2 + nse-data
AI:        @anthropic-ai/sdk (Claude API)
Jobs:      node-cron
```

### Frontend (Built)

```
Framework:  Next.js 15 (App Router, React Server Components)
Styling:    Tailwind CSS
Charts:     Recharts (portfolio allocation, performance)
Icons:      Lucide React
AI Client:  @anthropic-ai/sdk
Voice:      Web Speech API (built into Chrome/Edge — free)
```

### Future Upgrades (When Ready)

```
Logging:    Pino (structured JSON logs)
Validation: Already Joi — consider Zod for TypeScript route
Testing:    Jest + Supertest (unit + integration)
CI/CD:      GitHub Actions (free for public repos)
Redis:      Upstash Redis (serverless, free tier)
            — upgrade from node-cache when deploying multi-instance
```

---

## 6. Database Decision

### Verdict: Keep MongoDB + Plan PostgreSQL for v2

**MongoDB (now):** Perfect for price history time-series, flexible Yahoo Finance data shapes, zero migration cost.

**PostgreSQL via Supabase (v2):** Better for relational financial reporting (XIRR, tax lots, audit trail). Free tier, built-in auth.

### Hybrid Plan

```
MongoDB Atlas (free M0):
  ├── pricedatas          ← 60+ flexible fields from Yahoo
  ├── pricehistories      ← time-series OHLCV (high write)
  ├── cargs               ← CAGR cache
  ├── athTrackers         ← all-time highs
  └── importhistory       ← audit trail

PostgreSQL / Supabase (future v2):
  ├── users               ← auth, profiles
  ├── portfolios          ← relational
  ├── transactions        ← ACID, tax lots
  ├── accounts            ← multi-currency balance
  └── securitymaster      ← reference data
```

---

## 7. Claude AI Integration — Portfolio Intelligence

### Architecture

```
User → Frontend AI Chat UI
         ↓
    POST /api/ai/analyze
    { question, analysisType, portfolioId }
         ↓
    Backend fetches:
    - User's complete portfolio (holdings, prices, P&L)
    - CAGR data for all holdings
    - Sector allocation
    - Account balances
         ↓
    Builds structured prompt with full portfolio context
         ↓
    Calls Claude API with user's own API key
    Model: claude-sonnet-4-5 (best price/performance)
         ↓
    Streams response back to frontend
         ↓
    Chat UI renders markdown response
```

### Context Sent to Claude

```js
// What the AI sees for every analysis:
{
  portfolio: {
    name: "My Portfolio",
    totalInvested: 500000,
    currentValue: 625000,
    gainLoss: +125000,
    gainLossPercent: +25%,
    holdings: [
      {
        symbol: "RELIANCE.NS",
        name: "Reliance Industries",
        quantity: 50,
        avgPrice: 2600,
        currentPrice: 2850,
        gainLossPercent: 9.6%,
        weightInPortfolio: 22.8%,
        sector: "Energy",
        cagr1yr: 12.3%, cagr3yr: 18.5%
      },
      // ... all holdings
    ],
    sectorAllocation: { Energy: 22.8%, IT: 31.2%, ... },
    topGainers: [...],
    topLosers: [...],
  },
  question: "Should I add more IT stocks or diversify?"
}
```

### Analysis Types

| Type | What Claude Does |
|------|-----------------|
| `health` | Score 1-10, flag concentration, diversification gaps |
| `performance` | Compare to Nifty 50, identify trends, CAGR context |
| `rebalance` | Target vs actual allocation, buy/reduce suggestions |
| `deep-dive` | Pick one stock, give fundamental + technical context |
| `risk` | Beta, volatility, max drawdown, correlation |
| `tax` | STCG/LTCG holding periods, which to sell for tax efficiency |
| `chat` | Free-form Q&A about the portfolio |

### API Key Security Model

```
User's Claude API key:
  - Stored in MongoDB UserSettings collection
  - NEVER logged or exposed in API responses
  - Used server-side only (never sent to frontend)
  - User can delete it anytime from Settings
  - Each user uses their own Anthropic billing account
  - Monthly cost estimate: ~$1-5 for typical usage
    (claude-sonnet-4-5: $3/M input tokens, $15/M output)
```

---

## 8. Excel / CSV Holdings Import

### Supported Formats

```
Format        Extension    Library Used
─────────────────────────────────────────
Excel 2007+   .xlsx        xlsx (SheetJS)
Excel Legacy  .xls         xlsx (SheetJS)
CSV           .csv         csv-parser
```

### Smart Column Mapping

```
Your Excel might have:               PMServer needs:
─────────────────────────────────────────────────────
"Scrip Name" or "Stock"         →   symbol
"Qty" or "Quantity" or "Units"  →   shares_owned
"Avg Cost" or "Buy Price"       →   executed_price
"Date of Purchase"              →   createdAt
"B/S" or "Transaction Type"    →   tran_code
"Value" or "Amount"             →   cost_basis

Auto-detection: fuzzy matching against 50+ known aliases
Save as template: reuse for next import from same format
```

### Pre-built Excel Templates

Download these templates, fill in your holdings, upload:

```
1. Simple Holdings Template    — symbol, qty, price, date
2. Trade History Template      — buy/sell with dates
3. Zerodha P&L Template        — works with Zerodha's export
4. Groww Portfolio Export       — works with Groww's export
```

### Import Flow (Step by Step)

```
1. Select portfolio  →  "My Main Portfolio"
2. Upload file       →  drag .xlsx or .csv
3. Auto-mapping      →  system suggests column matches
4. Review mapping    →  adjust if needed, save as template
5. Preview           →  see 20 sample rows before importing
6. Confirmation      →  "Import 47 trades? (3 duplicates skipped)"
7. Done              →  positions created, import history saved
```

---

## 9. Open Platform + Donation Model

### Why Open Source

- **Trust:** Financial data tool — users need to see the code
- **Community:** Others add broker adapters, bug fixes, features
- **Indian market:** No good open-source PMS exists for NSE/BSE retail investors
- **Differentiator vs Smallcase/Tickertape:** Fully self-hostable, data stays yours

### Donation Links (Add to README and Footer)

```
GitHub Sponsors:  https://github.com/sponsors/jayakumarsharp
Buy Me a Coffee:  https://buymeacoffee.com/jayakumar
Ko-fi:            https://ko-fi.com/jayakumar
UPI (India):      Scan QR code in app (zero fees, direct)

Tagline: "This tool is free forever.
          If it saves you ₹ on advisory fees, share ₹ back."
```

### Community

```
GitHub Issues    → Bug reports, feature requests
GitHub Discussions → Questions, showcase your setup
CONTRIBUTING.md  → How to add a broker adapter
```

---

## 10. Deployment Guide

### Backend — Railway.app (30 minutes)

```bash
# Step 1: Push code to GitHub (done ✓)

# Step 2: Go to railway.app → New Project → Deploy from GitHub
#         Select: jayakumarsharp/PMServer

# Step 3: Add environment variables in Railway dashboard:
SECRET_KEY=<generate: openssl rand -hex 32>
MONGODB_URI=<paste from MongoDB Atlas>
PORT=3003
NODE_ENV=production
ALLOWED_ORIGINS=https://your-frontend.vercel.app
FRONTEND_URL=https://your-frontend.vercel.app

# Step 4: Railway auto-detects Node.js and deploys
#         Your URL: https://pmserver-production.up.railway.app
```

### Database — MongoDB Atlas (15 minutes)

```bash
# Step 1: atlas.mongodb.com → Create free account
# Step 2: Create a cluster → Choose M0 Free tier
# Step 3: Create a database user (username + password)
# Step 4: Network access → Allow 0.0.0.0/0 (or Railway's IP)
# Step 5: Connect → Copy connection string:
#   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/pmserver

# Paste this as MONGODB_URI in Railway dashboard
```

### Frontend — Vercel (15 minutes)

```bash
# Step 1: vercel.com → Import Git Repository
#         Select: jayakumarsharp/PMServer
#         Root Directory: client

# Step 2: Add environment variable:
NEXT_PUBLIC_API_URL=https://pmserver-production.up.railway.app

# Step 3: Deploy → Your URL: https://pmserver-client.vercel.app
```

### docker-compose (Self-hosted VPS)

```bash
# On your VPS (Ubuntu/Debian):
git clone https://github.com/jayakumarsharp/PMServer
cd PMServer
cp .env.example .env
# Edit .env with your values
docker-compose up -d

# Access at: http://your-server-ip:3003
```

---

## 11. Implementation Tranches (All)

### ✅ Completed

| Tranche | Feature | Files |
|---------|---------|-------|
| T1 | Security fixes (JWT, bugs, config) | index.js, middleware/, config.js |
| T2 | Validation (Joi) + security (helmet, rate-limit) | validations/schemas.js |
| T3 | CSV import with smart mapping | services/importService.js, routes/importRouter.js |
| T4 | Voice command parser | services/voiceService.js, routes/voiceRouter.js |
| T5 | Broker adapters (Upstox, Fyers) | services/brokers/, routes/brokerRouter.js |
| T7 | Price cache (node-cache) | lib/cache.js |
| T8 | Docker, LICENSE, community files | Dockerfile, docker-compose.yml |
| Frontend | Next.js app, all pages | client/ |

### ✅ Now Adding

| Tranche | Feature |
|---------|---------|
| T9 | **Excel (.xlsx/.xls) import** — SheetJS integration |
| T10 | **Claude AI analysis** — portfolio intelligence service |

### 📋 Next (Future Sessions)

| Tranche | Feature | Priority |
|---------|---------|----------|
| T11 | XIRR / IRR portfolio returns calculation | High |
| T12 | Dividend tracking and income calendar | High |
| T13 | Tax report — STCG/LTCG holding period calculator | High |
| T14 | Portfolio benchmarking vs Nifty 50 / Sensex | Medium |
| T15 | Price alerts (email / push notification) | Medium |
| T16 | SIP tracker with projection charts | Medium |
| T17 | Angel Broking SmartAPI adapter | Medium |
| T18 | Full test suite (Jest + Supertest, 80% coverage) | Medium |
| T19 | PostgreSQL migration for core relational data | Low |
| T20 | Mobile PWA (offline support, push notifications) | Low |

---

## 12. Prompting Guide for Claude Code

Since you are new to Claude Code, here are the exact prompts to use:

### Start a new feature

```
"Implement Tranche 11 from VISION.md — XIRR calculation.
 Read services/portfolioService.js first, then build the XIRR
 function in a new services/xirr.js. Add a route GET /api/portfolio/:id/xirr.
 Do not change any existing files unless necessary."
```

### Fix a bug

```
"I'm getting this error when calling POST /api/import/confirm:
 [paste full error message]
 Read services/importService.js and find the root cause. Fix it."
```

### Understand existing code

```
"Read services/pricehistoryservice.js and explain what
 getCagrResults() does in plain English. Don't change anything."
```

### Run and test

```
"Start the server with yarn dev and tell me if there are any
 startup errors."
```

### Deploy help

```
"I'm deploying to Railway. Read VISION.md section 10 and walk me
 through each step. Ask me to confirm before moving to the next step."
```

---

*PMServer — Built for Indian retail investors, open to the world.*
*MIT License | Free forever | Donations welcome*
