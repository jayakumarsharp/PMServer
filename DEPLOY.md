# PMServer — Deployment Guide

Free stack: **MongoDB Atlas** (database) + **Render.com** (backend API)

---

## Step 1 — MongoDB Atlas (Free Database)

1. Go to **https://cloud.mongodb.com** → Sign up / Log in
2. Click **"Build a Database"** → choose **M0 Free** tier → select any region → click **Create**
3. **Create a database user:**
   - Username: `pmserver`
   - Password: click **"Autogenerate Secure Password"** → copy and save it
   - Click **"Create User"**
4. **Allow all IPs** (required for Render):
   - Click **"Add My Current IP Address"** then also add `0.0.0.0/0`
   - Click **"Finish and Close"**
5. **Get your connection string:**
   - Click **"Connect"** → **"Drivers"** → select **Node.js**
   - Copy the string — it looks like:
     ```
     mongodb+srv://pmserver:<password>@cluster0.xxxxx.mongodb.net/pmserver?retryWrites=true&w=majority
     ```
   - Replace `<password>` with the password you saved in step 3

**You now have:** `MONGODB_URI` ✓

---

## Step 2 — Generate a SECRET_KEY

Run this in any terminal (Node.js required):

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output — it will be your `SECRET_KEY`.

**You now have:** `SECRET_KEY` ✓

---

## Step 3 — Render.com (Free Backend Hosting)

1. Go to **https://render.com** → Sign up with GitHub
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repo: `jayakumarsharp/PMServer`
4. Render will auto-detect `render.yaml` — confirm settings:
   - **Name:** `pmserver-api`
   - **Branch:** `main`
   - **Build Command:** `yarn install --frozen-lockfile`
   - **Start Command:** `yarn start:prod`
   - **Plan:** Free
5. Scroll to **"Environment Variables"** → add these 3:

   | Key | Value |
   |-----|-------|
   | `MONGODB_URI` | your Atlas connection string from Step 1 |
   | `SECRET_KEY` | your 128-char hex from Step 2 |
   | `NODE_ENV` | `production` |

6. Click **"Create Web Service"**
7. Wait ~3 minutes for first deploy
8. Your API URL will be: `https://pmserver-api.onrender.com`

**Test it:**
```
https://pmserver-api.onrender.com/health
```
Should return: `{"status":"ok"}`

**You now have:** Backend URL ✓

---

## Notes

- **Free tier sleep:** Render free tier sleeps after 15 minutes of inactivity. First request after sleep takes ~30 seconds. Upgrade to Starter ($7/mo) to keep it always on.
- **Auto-deploy:** Every `git push origin main` will auto-deploy to Render.
- **Logs:** Render dashboard → your service → "Logs" tab to debug any startup errors.
