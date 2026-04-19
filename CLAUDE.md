# CLAUDE.md — PMServer Development Guide

This file provides Claude Code with the context, conventions, and architecture decisions needed to assist effectively on this project.

---

## Project Identity

**PMServer** is a Portfolio Management System backend built with Node.js, Express, and MongoDB. It helps retail investors (primarily Indian market, NSE/BSE) track holdings, compute CAGR, view price history heat maps, and manage multi-currency accounts.

**Server runs on:** `http://localhost:3003`
**Database:** MongoDB at `mongodb://localhost:27017/test` (currently hardcoded — see Known Issues)

---

## Development Commands

```bash
yarn dev       # Start with nodemon (hot reload via Babel)
yarn start     # Production start (babel-node index.js)
```

There is currently **no test command** — `yarn test` prints a placeholder. Do not assume tests pass.

---

## Architecture Conventions

### Layer Responsibilities

```
index.js           → Express app bootstrap, middleware registration, route mounting
routes/*.js        → Route definitions only. Mount middleware, call services. No business logic.
services/*.js      → Business logic. No req/res objects ever. Return plain data or throw errors.
model/*.js         → Mongoose schemas and models only.
middleware/auth.js → JWT verification and ownership guards.
helpers/tokens.js  → JWT creation utility.
Cron/cronjob.js    → Background price refresh job (runs every 30 minutes).
```

### Critical Rule: Services Must Not Touch HTTP

Services should never accept or reference `req`, `res`, or `next`. If you see this pattern, flag it:

```js
// WRONG — never do this in a service
async getSecurityById(req, res) { ... }

// CORRECT
async getSecurityById(id) { ... }
```

### Error Handling

Custom error classes are in `expressError.js`:
- `ExpressError(message, status)` — base class
- `NotFoundError` (404)
- `UnauthorizedError` (401)
- `BadRequestError` (400)
- `ForbiddenError` (403)

In routes, always use `next(error)` — never `res.json({ error })` directly for errors.

```js
try {
  const result = await service.doSomething();
  res.json(result);
} catch (e) {
  next(e);
}
```

---

## Known Issues (Do Not Work Around These — Fix Them)

| # | Issue | File | Status |
|---|-------|------|--------|
| 1 | **JWT auth disabled** — `authenticateJWT` is commented out in `index.js` | `index.js:39` | P0 |
| 2 | `fileUploadService.js` references `securityModel` which doesn't exist | `services/fileUploadService.js` | P0 |
| 3 | `ATHCutterService.js` calls `yahooFinance.historical()` — not injected | `services/ATHCutterService.js` | P0 |
| 4 | MongoDB URI is hardcoded (`localhost:27017/test`) | `DBconnection.js`, `lib/mongo.js` | P1 |
| 5 | `User.getUserHoldingIds()` called in `auth.js` — method doesn't exist | `middleware/auth.js` | P1 |
| 6 | `securityservice.js::getSecurityById()` uses req/res inside a service | `services/securityservice.js` | P1 |
| 7 | No input validation anywhere despite `jsonschema` being installed | All routes | P1 |
| 8 | `inversify` is installed but never used | `package.json` | P2 |
| 9 | Two MongoDB connection files, only one used | `DBconnection.js` + `lib/mongo.js` | P2 |

---

## Data Model Quick Reference

```
User           → has many Portfolio, has watchlist[]
Portfolio      → belongs to User, has many PortfolioTransaction
PortfolioTransaction → belongs to Portfolio, references SecurityMaster
SecurityMaster → has one PriceData (current), has many PriceHistories, Carg, ATHTracker
Account        → belongs to User
ExchangeRate   → independent (baseCurrency, targetCurrency, rate, date)
Currency       → master list of currencies
Trancode       → master list of transaction types (buy/sell)
JobMonitor     → tracks cron job state (prevent concurrent runs)
```

**Key relationships resolved at query time (no Mongoose populate in most services — manual joins via multiple queries).**

---

## External Integrations

### Yahoo Finance (primary data source)

Wrapper in `services/yahooFinService.js` — uses `yahoo-finance2` library.

Available methods: `quote`, `quoteSummary`, `fundamentalsTimeSeries`, `search`, `chart`, `screener`

**Important:** `yahoo-finance2` does NOT have a `.historical()` method at the top-level module — use `yahooFinance.chart()` or the historical module from `yahoo-finance2` instead.

### NSE Data

Package `nse-data` — used for Indian stock market data. Not widely used in current codebase yet.

### Background Price Refresh

`Cron/cronjob.js` runs every 30 minutes. It:
1. Finds all securities referenced in `portfoliotransactions`
2. Checks if `pricedatas.lastUpdated` is older than 50 minutes
3. Fetches current quote from Yahoo Finance
4. Updates `pricedatas` collection
5. Uses `jobmonitors` collection to prevent concurrent runs

---

## Authentication Flow

```
POST /api/users/token
  → userService.authenticate(username, password)
  → bcrypt.compare
  → createToken(user) — signs JWT with { username }
  → returns { token }

Protected routes expect:
  Authorization: Bearer <token>

Middleware chain:
  authenticateJWT → ensureLoggedIn → ensureCorrectUser (for user-scoped routes)
                                   → ensureCorrectPortfolio (for portfolio routes)
```

**Currently auth middleware is disabled in `index.js`. Do not ship without re-enabling it.**

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SECRET_KEY` | Yes | JWT signing secret |
| `MONGODB_URI` | Yes | MongoDB connection string |
| `PORT` | No | Default: 3003 |
| `ALPHAVANTAGE_KEY` | No | Reserved — not used in code |

Create a `.env` file at project root. Currently config is in `config.js` which reads from `process.env`.

---

## Code Style & Patterns in Use

- **ES6+ with Babel** — `import/export` syntax is compiled via `@babel/node`. Do not use `require()` in new files.
- **Async/await** — all async operations use async/await. No callbacks or raw promises.
- **No TypeScript** — plain JavaScript only. Do not add TypeScript.
- **Mongoose models** — defined in `model/` directory, exported as default. Use `mongoose.model('Name', schema)`.
- **Route files** — each resource has its own router file, mounted in `index.js`.

---

## What Claude Should Prioritize When Helping

1. **Fix P0/P1 issues before adding features.** The codebase has security holes (no auth) and crashes (missing model refs). New features on a broken foundation waste effort.

2. **Keep services pure.** If asked to add business logic, put it in services, not routes.

3. **Validate inputs at the route level** using Joi before touching any service or model.

4. **Do not add dependencies** without a clear reason. The current `package.json` already has unused packages.

5. **Follow the existing file naming convention:**
   - Models: PascalCase (e.g., `SecurityMaster.js`)
   - Routes: camelCase or descriptive (e.g., `securityRouter.js`)
   - Services: camelCase (e.g., `securityservice.js`)

6. **Do not refactor working code** unless asked. This is an active development project. Focus on what was asked.

---

## Proposed Architecture (Target State)

See `README.md` for the full multi-phase proposal. The short version:

```
Phase 1 — Fix bugs and re-enable auth (NOW)
Phase 2 — Controllers, repositories, Redis cache, pagination
Phase 3 — Portfolio XIRR, dividend tracking, tax lots, alerts
Phase 4 — Docker, CI/CD, observability, 80% test coverage
```

---

## File Index

| File/Dir | Purpose |
|----------|---------|
| `index.js` | Express app entry point |
| `DBconnection.js` | Active MongoDB connection (use this one) |
| `lib/mongo.js` | Duplicate connection file — ignore/remove |
| `config.js` | Shared config (reads env vars) |
| `expressError.js` | Custom HTTP error classes |
| `helpers/tokens.js` | JWT token creation |
| `middleware/auth.js` | JWT verification, ownership guards |
| `Cron/cronjob.js` | Scheduled price refresh job |
| `model/*.js` | 14 Mongoose schemas |
| `routes/*.js` | 10 Express routers |
| `services/*.js` | 11 service modules |
| `uploads/` | CSV upload storage directory |
