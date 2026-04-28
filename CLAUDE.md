# CLAUDE.md — PMServer Development Guide

This file provides Claude Code with the context, conventions, and architecture decisions needed to assist effectively on this project.

---

## Standing Rules — Read First

These rules apply to **every session**, without the user needing to repeat them:

1. **Commit after every meaningful change.** After completing any code modification, run a quick sanity check and immediately commit to git (main branch). Do not batch multiple features into one large commit at the end.

2. **Verify before committing.** Before committing:
   - Start the backend (`yarn start`) and confirm it reaches `Server is running on port 3003`
   - Hit `GET /health` and confirm `{"status":"ok"}`
   - If the server crashes on startup, fix the error first — never commit broken code

3. **Push to GitHub after every commit.** The user wants the remote always in sync: `git push origin main` after every commit.

4. **Commit message format:** Use `feat:`, `fix:`, `refactor:`, `chore:` prefixes. Be specific. Include `Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>` in the commit body.

---

## Project Identity

**PMServer** is a full-stack Portfolio Management System for Indian retail investors (NSE/BSE).

| Layer | Tech | URL |
|-------|------|-----|
| Backend | Node.js 20 + Express + Babel | `http://localhost:3003` |
| Frontend | Next.js 16 (App Router) + Tailwind | `http://localhost:3000` |
| Database | MongoDB (local: `localhost:27017/pmserver`) | — |

**Repo:** `https://github.com/jayakumarsharp/PMServer` (main branch)

**Monorepo layout:**
```
PMServer/          ← backend root (this is the git repo root)
  client/          ← Next.js frontend (subfolder, same git repo)
```

---

## Development Commands

### Backend (run from repo root)
```bash
yarn start         # nodemon + babel-node (hot reload)
```
Wait for: `Server is running on port 3003` + `MongoDB connected`

### Frontend (run from client/)
```bash
cd client
npm run dev        # Next.js dev server with Turbopack
```
Wait for: `✓ Ready in ~8s` at `http://localhost:3000`

### Health check
```bash
curl http://localhost:3003/health   # → {"status":"ok","ts":"..."}
```

**No test command exists** — `yarn test` prints a placeholder. Do not claim tests pass.

---

## Architecture Conventions

### Layer Responsibilities

```
index.js              → Express app bootstrap, middleware, route mounts
routes/*.js           → Route definitions only. Call services, use next(). No business logic.
services/*.js         → Business logic only. No req/res/next ever.
model/*.js            → Mongoose schemas and models only.
middleware/auth.js    → JWT verification and ownership guards.
helpers/tokens.js     → JWT creation.
Cron/cronjob.js       → Background price refresh (every 30 min).
validations/schemas.js → Joi schemas + validate() middleware helper (CommonJS).
lib/cache.js          → NodeCache instances: priceCache (5min), securityCache (24h), fxCache (1h).
client/               → Next.js 16 App Router frontend.
```

### Critical Rule: Services Must Not Touch HTTP

```js
// WRONG — never do this in a service
async getSecurityById(req, res) { ... }

// CORRECT
async getSecurityById(id) { ... }
```

### Error Handling

Custom error classes in `expressError.js`:
- `ExpressError(message, status)` — base
- `NotFoundError` (404), `UnauthorizedError` (401), `BadRequestError` (400), `ForbiddenError` (403)

In routes, always `next(error)` — never `res.json({ error })` for errors.

```js
try {
  const result = await service.doSomething();
  res.json(result);
} catch (e) {
  next(e);
}
```

---

## Known Issues

All P0 bugs from the original codebase have been fixed. Remaining items:

| # | Issue | File | Priority |
|---|-------|------|----------|
| 1 | `fileUploadService.js` — legacy upload flow, partially updated | `services/fileUploadService.js` | P2 |
| 2 | `lib/mongo.js` — duplicate DB connection file, never used | `lib/mongo.js` | P2 (delete it) |
| 3 | `inversify` installed but never used | `package.json` | P2 (remove dep) |
| 4 | No automated tests anywhere | All | P1 |
| 5 | `securityservice.js::findBysecIdAndUpdate` references `securityModel` (wrong var) | `model/SecurityMaster.js:39` | P1 |

---

## Data Model Quick Reference

```
User             → has many Portfolio, has watchlist[], has one UserSettings
UserSettings     → belongs to User (Claude API key, defaultCurrency)
Portfolio        → belongs to User, has many PortfolioTransaction
PortfolioTransaction → belongs to Portfolio, references SecurityMaster
SecurityMaster   → has one PriceData, has many PriceHistories, Carg, ATHTracker
Account          → belongs to User
ImportMapping    → belongs to User (saved CSV/Excel column mapping templates)
ImportHistory    → audit trail for each import run
BrokerCredential → belongs to User (Upstox/Fyers OAuth tokens)
ExchangeRate     → independent (baseCurrency, targetCurrency, rate, date)
Currency, Trancode, JobMonitor → master/utility tables
```

---

## External Integrations

### Yahoo Finance
`services/yahooFinService.js` — `yahoo-finance2` library.
Methods: `quote`, `quoteSummary`, `fundamentalsTimeSeries`, `search`, `chart`, `screener`
**No `.historical()` method** — use `yahooFinance.chart()` instead.

### Claude AI
`services/claudeService.js` — `@anthropic-ai/sdk`
- Reads user's Claude API key from `UserSettings` collection
- Builds live portfolio context (holdings, prices, P&L) → sends to `claude-opus-4-6`
- Route: `POST /api/ai/analyze`

### Excel / CSV Import
`services/importService.js` — `SheetJS (xlsx)` + `csv-parser`
- Accepts `.csv`, `.xlsx`, `.xls`
- Fuzzy column header matching against 50+ broker aliases
- Route: `POST /api/import/preview` then `POST /api/import/confirm`

### Broker OAuth
`services/brokerService.js` + `services/brokers/` (UpstoxAdapter, FyersAdapter)

### Background Price Refresh
`Cron/cronjob.js` — runs every 30 minutes, updates `pricedatas` collection from Yahoo Finance.

---

## Authentication Flow

```
POST /api/users/token
  → userService.authenticate(username, password)
  → bcrypt.compare
  → createToken(user) → { token }

Protected routes: Authorization: Bearer <token>

Middleware chain:
  authenticateJWT → ensureLoggedIn → ensureCorrectUser (user routes)
                                   → ensureCorrectPortfolio (portfolio routes)
```

Auth IS enabled — `authenticateJWT` runs on all routes except `/api/users/token`, `/api/users/register`, `/health`.

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SECRET_KEY` | Yes | JWT signing secret (random 64-char hex) |
| `MONGODB_URI` | Yes | MongoDB connection string |
| `PORT` | No | Default: 3003 |
| `ALLOWED_ORIGINS` | No | Comma-separated CORS origins, default: localhost:3000,3003 |

`.env` file lives at the repo root. Never commit it. `.env.example` is the template.

---

## Code Style

- **ES6+ with Babel** — `import/export` in all backend files. Never `require()` in new files (except `validations/schemas.js` which is intentionally CommonJS).
- **Async/await** — no callbacks or raw `.then()` chains.
- **No TypeScript on backend** — plain JS only. Frontend (`client/`) is TypeScript.
- **Mongoose models** — `model/` directory, `mongoose.model('Name', schema)`, named exports.
- **File naming:** Models: PascalCase (`SecurityMaster.js`), Routes: camelCase (`securityRouter.js`), Services: camelCase (`securityservice.js`).

---

## What Claude Must Do on Every Code Change

```
1. Make the change
2. yarn start → wait for "Server is running" + "MongoDB connected"
3. curl http://localhost:3003/health → confirm {"status":"ok"}
4. Kill the test server
5. git add <specific files>
6. git commit -m "type: description\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
7. git push origin main
```

If step 2 or 3 fails — fix the bug, then repeat from step 1. Never skip to step 5.

---

## Frontend (client/)

Next.js 16 App Router. All pages are in `client/app/`. Key files:

| Path | Purpose |
|------|---------|
| `client/lib/api.ts` | Typed API client for all backend endpoints |
| `client/lib/auth-context.tsx` | JWT auth context (localStorage) |
| `client/components/AppShell.tsx` | Sidebar + mobile nav shell |
| `client/app/dashboard/` | Net worth, portfolio list, top holdings |
| `client/app/portfolio/[id]/` | Holdings table, pie chart, add position |
| `client/app/import/` | 4-step CSV/Excel import wizard |
| `client/app/voice/` | Voice command entry (Web Speech API) |
| `client/app/ai/` | Claude AI chat analysis |
| `client/app/accounts/` | Bank/brokerage account management |
| `client/app/settings/` | Claude API key + broker connections |

Frontend env: `client/.env.local` → `NEXT_PUBLIC_API_URL=http://localhost:3003`

---

## File Index (Backend)

| File/Dir | Purpose |
|----------|---------|
| `index.js` | Express entry point |
| `DBconnection.js` | MongoDB connection (use this one, not `lib/mongo.js`) |
| `config.js` | Reads env vars, exports SECRET_KEY, MONGODB_URI, PORT |
| `expressError.js` | Custom HTTP error classes |
| `helpers/tokens.js` | JWT creation |
| `middleware/auth.js` | JWT + ownership guards |
| `validations/schemas.js` | Joi schemas + validate() middleware (CommonJS) |
| `lib/cache.js` | NodeCache instances |
| `Cron/cronjob.js` | Background price refresh |
| `model/` | 16 Mongoose schemas |
| `routes/` | 13 Express routers |
| `services/` | 14 service modules |
| `services/brokers/` | BrokerAdapter base + Upstox + Fyers implementations |
| `uploads/` | Temp file storage for CSV/Excel uploads |
