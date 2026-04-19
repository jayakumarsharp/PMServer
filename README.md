# PMServer — Portfolio Management System (Backend)

> **Engineering Lead Review** | Author: Senior Engineering Assessment | Date: April 2026

---

## Table of Contents

- [Project Overview](#project-overview)
- [Current Architecture](#current-architecture)
- [Tech Stack](#tech-stack)
- [API Reference](#api-reference)
- [Data Models](#data-models)
- [Running the Project](#running-the-project)
- [Known Issues & Critical Bugs](#known-issues--critical-bugs)
- [Proposed Production Architecture](#proposed-production-architecture)
- [Roadmap & Prioritized Backlog](#roadmap--prioritized-backlog)
- [Engineering Standards & Best Practices](#engineering-standards--best-practices)

---

## Project Overview

PMServer is a **Node.js/Express REST API** that serves as the backend for a Portfolio Management System (PMS). It enables users to:

- Manage investment portfolios and track holdings (buy/sell transactions)
- Fetch real-time and historical stock prices via Yahoo Finance API
- Calculate portfolio metrics: gains/losses, CAGR (1yr/3yr/5yr/10yr), All-Time Highs (ATH)
- Manage multiple bank/brokerage accounts with multi-currency support
- Maintain a stock watchlist
- View heat maps of price history with monthly/yearly growth aggregates
- Upload CSV files for bulk data import

**Target market:** Indian retail investors (NSE/BSE data support via `nse-data`) with global stock coverage.

---

## Current Architecture

```
┌──────────────────────────────────────────────────────┐
│                   Express.js Server                  │
│                      Port 3003                       │
├──────────┬───────────────────────────────────────────┤
│  Routes  │  /api/users   /api/portfolio              │
│  Layer   │  /api/security /api/price /api/heatmap    │
│          │  /api/currency /api/account               │
│          │  /api/exhangerate /api/upload             │
├──────────┴───────────────────────────────────────────┤
│               Services Layer (Business Logic)        │
│  userService | portfolioService | pricehistoryservice│
│  securityservice | yahooFinService | accountService  │
│  ExchangeRateservice | ATHCutterService | currencyService│
├──────────────────────────────────────────────────────┤
│               Mongoose ODM (MongoDB)                 │
│  Collections: users, portfolios, portfoliotransactions│
│  securitymasters, pricedatas, pricehistories, cargs  │
│  athTrackers, exchangerates, accounts, currencies    │
├──────────────────────────────────────────────────────┤
│         External APIs & Background Jobs              │
│  Yahoo Finance API (quotes, history, fundamentals)   │
│  NSE Data (Indian market)                            │
│  node-cron (price refresh every 30 min)              │
└──────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Runtime | Node.js | LTS |
| Framework | Express.js | ^4.19.2 |
| Transpiler | Babel | 7.x |
| Database | MongoDB (local) | — |
| ODM | Mongoose | ^8.3.3 |
| Auth | JWT (jsonwebtoken) | ^9.0.2 |
| Password Hashing | bcrypt | ^5.1.1 |
| Market Data | yahoo-finance2 | ^2.11.3 |
| Indian Market | nse-data | ^1.0.4 |
| HTTP Client | axios + axios-retry | ^1.6.8 |
| Scheduler | node-cron | ^3.0.3 |
| File Upload | multer | ^1.4.5-lts.1 |
| CSV Parsing | csv-parser | ^3.0.0 |
| Real-time | Socket.IO | ^4.7.5 |
| DI Container | inversify | ^6.0.2 |
| Date Utils | moment.js | ^2.30.1 |

---

## API Reference

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| POST | `/api/users/register` | Register new user | No |
| POST | `/api/users/token` | Login — returns JWT | No |
| GET | `/api/users/:username` | Get user info | Yes |
| GET | `/api/users/:username/complete` | User with portfolios + computed metrics | Yes |
| POST | `/api/users/watchlist` | Add to watchlist | Yes |
| DELETE | `/api/users/removeWatchlist` | Remove from watchlist | Yes |

### Portfolio Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| POST | `/api/portfolio/createPortfolio` | Create portfolio | Yes |
| GET | `/api/portfolio/:name` | Get portfolio by name | Yes |
| PATCH | `/api/portfolio/:id` | Update portfolio | Yes |
| DELETE | `/api/portfolio/:id` | Delete portfolio | Yes |
| POST | `/api/portfoliotransactions/createTransaction` | Add holding/transaction | Yes |
| POST | `/api/portfoliotransactions/getHoldingbypfandsecurity` | Get holdings | Yes |

### Market Data

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/security/securities` | All securities in master |
| POST | `/api/security/search` | Search by symbol/name (Yahoo) |
| POST | `/api/security/quote` | Batch quote for symbols |
| POST | `/api/security/historical` | Historical data + ATH tracking |
| POST | `/api/security/quoteSummary` | Full company summary |
| POST | `/api/security/fundamentalsTimeSeries` | Financial fundamentals |
| POST | `/api/security/getchart` | Chart data |
| GET | `/api/security/trending` | Trending symbols |
| GET | `/api/price/getPrice/:security` | Current price |

### Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/heatmap/getpricehistoryforsecurity` | Price history + CAGR heat map |
| POST | `/api/heatmap/getATHpricelistbySymbol` | ATH breakout frequency analysis |

### Account & Currency

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/account/accounts` | Create account |
| POST | `/api/account/updateaccount` | Update account |
| GET | `/api/account/accounts/:user_id` | Get user accounts |
| GET | `/api/currency/currencies` | List currencies |
| POST | `/api/currency/currencies` | Add currency |
| GET | `/api/exhangerate/exchange-rates` | Get exchange rates |
| POST | `/api/exhangerate/exchange-rates/bulk-upsert` | Bulk upsert rates |

---

## Data Models

### Relationship Diagram

```
User
 ├── watchlist: [symbol]
 ├── Portfolio[]
 │    └── PortfolioTransaction[]
 │         └── SecurityMaster
 │              ├── PriceData          (current prices)
 │              ├── PriceHistories[]   (daily OHLCV)
 │              ├── Carg               (CAGR cache)
 │              └── ATHTracker         (all-time highs)
 └── Account[]

ExchangeRate (baseCurrency ↔ targetCurrency)
Currency (master list)
Trancode (buy/sell types)
JobMonitor (cron job state)
FileUpload (uploaded CSVs)
```

### Key Model Schemas

**PortfolioTransaction (Holdings)**
```js
{
  symbol: ObjectId → SecurityMaster,
  shares_owned: Number,
  cost_basis: Number,
  tran_code: String,        // buy | sell
  executed_price: Number,
  target_percentage: Number,
  goal: String,
  portfolio_id: ObjectId → Portfolio,
  createdBy: String
}
```

**PriceData (Live Market Data)**
```js
{
  securityMaster_id: ObjectId,
  regularMarketPrice: Number,
  marketCap: Number,
  trailingPE: Number, forwardPE: Number,
  fiftyTwoWeekHigh: Number, fiftyTwoWeekLow: Number,
  dividendYield: Number,
  lastUpdated: Date
  // 60+ Yahoo Finance fields
}
```

---

## Running the Project

### Prerequisites

- Node.js LTS
- MongoDB running locally on `mongodb://localhost:27017`
- Yarn

### Setup

```bash
# Install dependencies
yarn install

# Start development server (with hot reload)
yarn dev

# Start production server
yarn start
```

### Environment Variables

Create a `.env` file in the root:

```env
SECRET_KEY=your-strong-jwt-secret
MONGODB_URI=mongodb://localhost:27017/pmserver
ALPHAVANTAGE_KEY=your-key    # reserved for future use
PORT=3003
```

> **Note:** Currently the MongoDB URI is hardcoded in `DBconnection.js`. See [Known Issues](#known-issues--critical-bugs).

---

## Known Issues & Critical Bugs

> This section is the honest result of a full codebase audit. These must be resolved before any production deployment.

### P0 — Critical (Blocking)

| # | Issue | Location | Impact |
|---|-------|----------|--------|
| 1 | **JWT authentication is disabled** — `authenticateJWT` middleware is commented out in `index.js:39`. All protected endpoints are currently open. | `index.js` | Any user can access any data |
| 2 | **`fileUploadService.js` references undefined `securityModel`** — CSV upload will crash at runtime. | `services/fileUploadService.js` | File import is broken |
| 3 | **`ATHCutterService.js` calls `yahooFinance.historical()`** — this method does not exist in the imported `yahoo-finance2` service; it was never injected. | `services/ATHCutterService.js` | ATH route crashes |

### P1 — High Priority

| # | Issue | Location | Impact |
|---|-------|----------|--------|
| 4 | **Hardcoded MongoDB URI** (`localhost:27017/test`) — cannot configure without code changes. | `DBconnection.js`, `lib/mongo.js` | Not deployable |
| 5 | **`auth.js` calls `User.getUserHoldingIds()`** — this static method does not exist on the User model. | `middleware/auth.js`, `model/User.js` | `ensureCorrectHolding` crashes |
| 6 | **`securityservice.js::getSecurityById()`** — uses `req`/`res` directly inside a service (wrong layer), broken implementation. | `services/securityservice.js` | Delete security endpoint broken |
| 7 | **No input validation** — `jsonschema` is imported in `package.json` but never used. All user inputs go directly to MongoDB queries. | All routes | NoSQL injection risk |

### P2 — Medium Priority

| # | Issue | Location | Impact |
|---|-------|----------|--------|
| 8 | No pagination on any list endpoint (e.g., `GET /securities`) — will degrade at scale. | All list endpoints | Performance |
| 9 | No rate limiting on Yahoo Finance API calls — can result in IP bans or 429 errors. | `yahooFinService.js`, `Cron/cronjob.js` | Reliability |
| 10 | `moment.js` is used for dates — deprecated; should migrate to `date-fns` or `Day.js`. | `services/pricehistoryservice.js` | Tech debt |
| 11 | `inversify` is listed as a dependency but **never used** — adds bundle weight for no benefit. | `package.json` | Dependency bloat |
| 12 | No test suite exists — `package.json` test script is a placeholder echo. | `package.json` | No regression safety |
| 13 | Dual MongoDB connection files (`DBconnection.js` + `lib/mongo.js`) — two different connection patterns, only one is used. | Root directory | Confusion/dead code |

---

## Proposed Production Architecture

> As lead engineer, here is the target architecture to evolve PMServer into a production-grade PMS.

### Phase 1 — Stabilization (Fix what's broken)

**Goal:** Make the current codebase safe and deployable.

```
Week 1-2:
  ✓ Re-enable JWT authentication on all protected routes
  ✓ Fix P0 bugs (fileUploadService, ATHCutterService, auth middleware)
  ✓ Move all config to environment variables (MongoDB URI, port, secret)
  ✓ Add basic input validation using Joi (replace unused jsonschema)
  ✓ Add structured error handling middleware (centralized, no leaking stack traces)
  ✓ Remove unused dependencies (inversify, duplicate mongo connection)
  ✓ Add .env.example with all required variables documented
```

### Phase 2 — Architecture Improvement

**Goal:** Clean separation of concerns, testability, and reliability.

```
┌──────────────────────────────────────────────────────────────┐
│                   API Gateway / Reverse Proxy                │
│                   (nginx or Caddy in prod)                   │
│                   Rate Limiting | SSL Termination            │
└──────────────────┬───────────────────────────────────────────┘
                   │
┌──────────────────▼───────────────────────────────────────────┐
│                   Express.js Application                     │
│                                                              │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────┐  │
│  │  Validation │  │  Auth (JWT)  │  │  Rate Limiter      │  │
│  │  (Joi)      │  │  Middleware  │  │  (express-rate-limit│  │
│  └─────────────┘  └──────────────┘  └────────────────────┘  │
│                                                              │
│  Routes → Controllers → Services → Repositories             │
│                              │                               │
│                    (business logic only,                     │
│                    no req/res in services)                   │
└──────────────────┬───────────────────────────────────────────┘
                   │
     ┌─────────────┴──────────────┐
     │                            │
┌────▼─────┐              ┌───────▼──────┐
│ MongoDB  │              │  Redis Cache │
│ (Atlas)  │              │  (prices,    │
│          │              │   sessions)  │
└──────────┘              └──────────────┘
                   │
┌──────────────────▼───────────────────────────────────────────┐
│                    Background Workers                        │
│                                                              │
│  ┌─────────────────────┐   ┌────────────────────────────┐   │
│  │ Price Refresh Worker │   │  CAGR Calculation Worker   │   │
│  │ (node-cron, 30min)   │   │  (runs nightly)            │   │
│  └─────────────────────┘   └────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

**Structural changes:**
1. **Controllers** — Extract route handler logic from routes into controller files; routes become thin routers only.
2. **Repository pattern** — Abstract MongoDB queries out of services into repository classes. Services call repos, not Mongoose directly.
3. **Validation layer** — Validate all incoming request bodies/params using Joi schemas before they reach controllers.
4. **Redis caching** — Cache frequently read data (current prices, security master, exchange rates) with TTL; eliminate redundant Yahoo Finance API calls.
5. **Centralized error handling** — Single Express error middleware that formats all errors consistently.

### Phase 3 — Feature Completion & Enhancement

**Goal:** Complete the business features and add value for users.

#### Core Missing Features

| Feature | Description | Priority |
|---------|-------------|----------|
| **Portfolio Performance Dashboard** | Aggregate P&L, XIRR, time-weighted returns per portfolio | High |
| **Dividend Tracking** | Record and report dividend income per holding | High |
| **Tax Lot Accounting** | FIFO/LIFO/HIFO cost basis calculation for capital gains | High |
| **Rebalancing Engine** | Compare current vs target allocation; suggest trades | Medium |
| **Alerts & Notifications** | Price targets, ATH breaks, portfolio thresholds via email/push | Medium |
| **Multi-currency P&L** | Convert all holdings to user's base currency using live rates | Medium |
| **Benchmarking** | Compare portfolio returns vs Nifty 50, S&P 500, custom index | Medium |
| **SIP Tracker** | Systematic Investment Plan tracking and projections | Low |
| **Options & Derivatives** | Support F&O positions alongside equity | Low |

#### Proposed New API Endpoints

```
GET  /api/portfolio/:id/performance     - XIRR, TWR, Sharpe ratio
GET  /api/portfolio/:id/allocation      - Current vs target allocation
POST /api/portfolio/:id/rebalance       - Suggested rebalancing trades
GET  /api/portfolio/:id/dividends       - Dividend income history
GET  /api/user/:id/net-worth            - Across all portfolios + accounts
POST /api/alerts                        - Create price/portfolio alert
GET  /api/market/indices                - Major index performance (Nifty, Sensex, S&P)
```

### Phase 4 — Production Readiness

**Goal:** Observability, security hardening, and CI/CD.

```yaml
Security:
  - Helmet.js for HTTP security headers
  - CORS configured per environment (not wildcard)
  - Rate limiting per IP and per user
  - Input sanitization to prevent NoSQL injection
  - Secrets in environment variables (never in code)
  - Dependency vulnerability scanning (npm audit / Snyk)

Observability:
  - Structured JSON logging (Winston or Pino)
  - Request tracing with correlation IDs
  - Metrics endpoint for CPU, memory, DB connection pool
  - Health check endpoint: GET /health

Testing:
  - Unit tests for all services (Jest)
  - Integration tests for all API routes (supertest)
  - Target: 80% code coverage minimum

CI/CD Pipeline:
  - GitHub Actions: lint → test → build → deploy
  - Environment-specific MongoDB Atlas clusters
  - Docker containerization for consistent deployments
  - PM2 or systemd for process management in production
```

---

## Roadmap & Prioritized Backlog

```
MILESTONE 1 — Stabilize (2-3 weeks)
  [ ] Fix P0 bugs (auth, fileUpload, ATHCutterService)
  [ ] Re-enable JWT on all routes
  [ ] Externalize all config to .env
  [ ] Add Joi validation to all POST/PUT endpoints
  [ ] Centralize error handling middleware
  [ ] Write basic smoke tests for auth and portfolio APIs

MILESTONE 2 — Architecture (4-6 weeks)
  [ ] Extract controllers from routes
  [ ] Introduce repository pattern for DB access
  [ ] Add Redis for price caching (TTL: 5 minutes)
  [ ] Migrate to date-fns, remove moment.js
  [ ] Add pagination to all list endpoints
  [ ] Migrate to MongoDB Atlas (cloud)

MILESTONE 3 — Features (6-10 weeks)
  [ ] Portfolio XIRR / TWR calculation engine
  [ ] Tax lot accounting (FIFO cost basis)
  [ ] Dividend tracking
  [ ] Multi-currency net worth calculation
  [ ] Price and portfolio alerts
  [ ] Portfolio rebalancing suggestions

MILESTONE 4 — Production (4-6 weeks)
  [ ] Security hardening (Helmet, rate limiting, CORS)
  [ ] Structured logging with Winston/Pino
  [ ] Health check & metrics endpoints
  [ ] 80% test coverage
  [ ] Docker + CI/CD pipeline
  [ ] API documentation (Swagger/OpenAPI)
```

---

## Engineering Standards & Best Practices

### Service Layer Contract

Services must **never** receive or return `req`/`res` objects. They are pure business logic:

```js
// WRONG (current pattern in some files)
async getSecurityById(req, res) {
  const security = await Security.findById(req.params.id);
  res.json(security);
}

// CORRECT (target pattern)
async getSecurityById(id) {
  return Security.findById(id);
}
```

### Validation Pattern

Every write endpoint must validate before touching the database:

```js
// In routes — validate first, then delegate
router.post('/createPortfolio', ensureLoggedIn, async (req, res, next) => {
  const { error } = portfolioSchema.validate(req.body);
  if (error) return next(new BadRequestError(error.details[0].message));
  const result = await portfolioService.registerPortfolio(req.body);
  res.status(201).json(result);
});
```

### Error Handling Pattern

All async route handlers must forward errors to the centralized handler:

```js
router.get('/securities', async (req, res, next) => {
  try {
    const data = await securityService.securities();
    res.json(data);
  } catch (e) {
    next(e); // Always forward — never swallow
  }
});
```

### Environment Configuration

Never hardcode connection strings or secrets:

```js
// config.js — single source of truth
module.exports = {
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/pmserver_dev',
  SECRET_KEY:  process.env.SECRET_KEY,   // No fallback for secrets in production
  PORT:        parseInt(process.env.PORT) || 3003,
  NODE_ENV:    process.env.NODE_ENV || 'development',
};
```

---

## Target Directory Structure

```
PMServer/
├── src/
│   ├── config/           # All configuration (env, db)
│   ├── controllers/      # HTTP layer — parse req, call service, format res
│   ├── middleware/       # Auth, validation, error handling
│   ├── models/           # Mongoose schemas
│   ├── repositories/     # DB queries (Mongoose calls)
│   ├── routes/           # Route definitions only (thin)
│   ├── services/         # Business logic (no HTTP primitives)
│   ├── validations/      # Joi schemas for each resource
│   ├── workers/          # Background job workers (cron)
│   └── utils/            # Pure utility functions
├── tests/
│   ├── unit/             # Service & utility unit tests
│   └── integration/      # API route integration tests
├── .env.example
├── .gitignore
├── CLAUDE.md             # Claude Code context and guidance
├── package.json
├── Dockerfile
└── README.md
```

---

*Generated by senior engineering audit — April 2026*
