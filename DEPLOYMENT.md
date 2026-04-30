# PMServer — Deployment Guide

This guide sets up a fully automated CI/CD pipeline:

```
You push to GitHub main
        ↓
GitHub Actions runs build checks
        ↓
Railway auto-deploys backend    →  https://your-app.up.railway.app
Vercel auto-deploys frontend    →  https://your-app.vercel.app
```

---

## Architecture

| Service | Provider | Free tier | Purpose |
|---------|----------|-----------|---------|
| Database | MongoDB Atlas | 512 MB M0 cluster | Production MongoDB |
| Backend API | Railway | $5 credit/mo (enough for hobby) | Node.js + Express |
| Frontend | Vercel | Unlimited hobby projects | Next.js |
| CI/CD | GitHub Actions | 2000 min/mo free | Build checks |

---

## Step 1 — MongoDB Atlas (Database)

1. Go to **https://cloud.mongodb.com** → Sign up free
2. Create a new project → **Build a Cluster** → choose **M0 Free**
3. Region: choose closest to India (Mumbai `ap-south-1`)
4. **Security → Database Access** → Add a user:
   - Username: `pmserver`
   - Password: generate a strong password, **save it**
   - Role: `readWriteAnyDatabase`
5. **Security → Network Access** → Add IP Address → **Allow access from anywhere** (`0.0.0.0/0`)
   - (Railway's IPs change, so we allow all — your JWT protects the data)
6. **Databases → Connect** → **Drivers** → copy the connection string:
   ```
   mongodb+srv://pmserver:<password>@cluster0.xxxxx.mongodb.net/pmserver?retryWrites=true&w=majority
   ```
   Replace `<password>` with the password you saved.

**Save this URI — you need it in Step 2.**

---

## Step 2 — Railway (Backend)

1. Go to **https://railway.app** → Sign up with GitHub
2. **New Project** → **Deploy from GitHub repo** → select `PMServer`
3. Railway detects `railway.toml` automatically — no extra config needed
4. Click the service → **Variables** tab → add these one by one:

| Variable | Value |
|----------|-------|
| `SECRET_KEY` | Run `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` and paste the output |
| `MONGODB_URI` | The Atlas URI from Step 1 |
| `ALLOWED_ORIGINS` | `https://your-app.vercel.app` (fill in after Step 3; use `*` temporarily) |
| `PORT` | Leave blank — Railway sets this automatically |

5. Railway deploys automatically. Wait ~2 min → click **View Logs**
6. Look for: `Server is running on port XXXX` + `MongoDB connected`
7. **Settings → Networking → Generate Domain** → copy your public URL:
   ```
   https://pmserver-production-xxxx.up.railway.app
   ```

**Save this URL — you need it in Step 3.**

---

## Step 3 — Vercel (Frontend)

1. Go to **https://vercel.com** → Sign up with GitHub
2. **Add New → Project** → Import `PMServer` repo
3. **Configure Project:**
   - **Root Directory:** `client`  ← important, click Edit to change this
   - Framework: Next.js (auto-detected)
   - Build command: `npm run build` (auto-detected)
4. **Environment Variables** → add:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | Your Railway URL from Step 2 (e.g. `https://pmserver-production-xxxx.up.railway.app`) |

5. Click **Deploy** → wait ~3 min
6. Copy your Vercel URL: `https://pmserver-xxxx.vercel.app`

---

## Step 4 — Update CORS on Railway

Now that you have the Vercel URL, go back to Railway:

1. **Variables** → update `ALLOWED_ORIGINS`:
   ```
   https://pmserver-xxxx.vercel.app
   ```
2. Railway auto-redeploys. Done.

---

## Step 5 — GitHub Actions CI (auto-configured)

The file `.github/workflows/ci.yml` is already committed. It runs automatically on every push to `main`:

- Checks backend dependencies install cleanly
- Builds the Next.js frontend (catches TypeScript errors)
- Reports pass/fail in GitHub → Actions tab

**No setup needed** — GitHub Actions is free for public repos and activates as soon as the workflow file exists.

To view runs: `https://github.com/jayakumarsharp/PMServer/actions`

---

## How the pipeline works after setup

```
git push origin main
  │
  ├─► GitHub Actions (ci.yml)
  │     ├─ Install backend deps
  │     ├─ TypeScript check (client/)
  │     └─ Next.js build (client/)
  │
  ├─► Railway detects push → rebuilds backend → health check → live
  │
  └─► Vercel detects push → rebuilds frontend → live
```

All three run in parallel. Total deploy time: ~3–5 minutes.

---

## Custom domain (optional)

**Vercel:**
1. Project → Settings → Domains → Add domain
2. Add a CNAME record at your DNS provider pointing to `cname.vercel-dns.com`

**Railway:**
1. Service → Settings → Networking → Custom Domain
2. Add a CNAME pointing to your Railway service

---

## Environment variables reference

### Backend (Railway)

| Variable | Required | Notes |
|----------|----------|-------|
| `SECRET_KEY` | Yes | 64-char hex. Never reuse across environments. |
| `MONGODB_URI` | Yes | MongoDB Atlas connection string |
| `ALLOWED_ORIGINS` | Yes | Your Vercel URL, no trailing slash |
| `PORT` | No | Railway injects automatically |

### Frontend (Vercel)

| Variable | Required | Notes |
|----------|----------|-------|
| `NEXT_PUBLIC_API_URL` | Yes | Your Railway backend URL, no trailing slash |

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Railway shows `Application failed to respond` | Check logs — usually a missing env var or MongoDB connection error |
| Frontend shows `Failed to fetch` | `NEXT_PUBLIC_API_URL` is wrong, or CORS not set on Railway |
| CORS error in browser | `ALLOWED_ORIGINS` on Railway doesn't match your Vercel URL exactly |
| MongoDB `Authentication failed` | Wrong password in Atlas URI — re-generate and update Railway var |
| GitHub Actions failing | Check Actions tab → click the failing job → read the error output |
| Vercel build fails | TypeScript error — fix locally, `yarn serve` to verify, then push |

---

## Local development (unchanged)

```bash
cd d:/Study/DevChapter/PMServer
yarn serve          # starts both API :3003 and UI :3000
```

Open: http://localhost:3000
