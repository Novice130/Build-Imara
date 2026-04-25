# Build Imara — Handoff Summary

**Project:** `c:\Users\Syed Amer\Documents\Phet\Build_Imara`
**Live URL:** [https://buildimara.com](https://buildimara.com)
**GitHub:** [Novice130/Build-Imara](https://github.com/Novice130/Build-Imara)

A static HTML website for a Hyderabad home construction company (Build Imara).

---

## 🚀 How to Deploy (READ THIS FIRST)

This project is hosted on **Cloudflare Workers** (not Pages, not Docker).

### Method 1: Auto-deploy via Git push (PREFERRED)
If the GitHub → Cloudflare connection is active, just push to `main`:
```bash
git add .
git commit -m "your message"
git push origin main
```
Cloudflare will auto-deploy within ~30 seconds.

**⚠️ If auto-deploy stops working:** The Git connection has been disconnected.
Go to: **Cloudflare Dashboard** → **Workers & Pages** → **build-imara** → **Settings** → scroll to **Build** section → click **"Manage"** next to the Git repository → **reconnect your GitHub account**.

### Method 2: Manual deploy via CLI (FALLBACK)
If auto-deploy is broken or you need to deploy immediately:
```bash
cd c:\Users\Syed Amer\Documents\Phet\Build_Imara
npx wrangler deploy
```
This uses `wrangler.toml` to deploy directly. You must be logged into wrangler (`npx wrangler login` if needed).

### What NOT to do
- ❌ Do NOT use `docker-compose up` for the static site — Docker files exist only for the webhook server
- ❌ Do NOT delete `wrangler.toml` — it's required for Cloudflare deployment
- ❌ Do NOT delete `.assetsignore` — it prevents `.git/`, Docker files, etc. from being uploaded to Cloudflare

### Key deployment files

| File | Purpose |
|---|---|
| `wrangler.toml` | Cloudflare Workers config — project name, compatibility date, asset directory |
| `.assetsignore` | Tells Cloudflare which files to skip (`.git/`, `webhook/`, Docker files, etc.) |

### Cloudflare Dashboard details
- **Project name:** `build-imara`
- **Account:** `syedamer130@gmail.com`
- **Account ID:** `6b8df46475fc4b356cd5979c1418780f`
- **Workers URL:** `https://build-imara.syedamer130.workers.dev`
- **Custom domain:** `buildimara.com`
- **Production branch:** `main`

---

## What Was Completed ✅

### 1. Pricing Section Updated — `index.html`
Replaced the old 3-card placeholder pricing (ECO/MODULAR/LUXURY) with the real 4-package layout from `PACKAGES.xlsx`:

| Package | Price | Target Audience | Status |
|---|---|---|---|
| **ESSENTIAL** | ₹1,700/sqft | Rental homes, first-time budget builds | ✅ Live |
| **CORE** | ₹1,950/sqft | End-use family homes | ✅ Live |
| **SMART LIVING** | ₹2,300/sqft | Premium everyday living (highlighted as "Most Popular") | ✅ Live |
| **ELEVATED LIVING** | ₹2,750/sqft | Aspirational premium / statement homes | ✅ Live |
| **LUXURY** | TBD | Bespoke villas | ✅ "Coming Soon" banner |

Each card includes key specs from the Excel (RCC grade, flooring material & cost, door quality, ceiling height, warranty details, etc.) and an important notes section at the bottom.

### 2. Cal.com Booking Integration — `index.html`
- Every "Book Consultation" and "Get Free Quote" button opens a **popup modal** with an inline cal.com booking widget
- **"View Plans"** hero button scrolls to `#pricing` section
- **Cal.com username:** `syed-salman-3zq4k8`
- **Event slug:** `15min` (15 min meeting via Cal Video)
- **Full booking URL:** `https://cal.com/syed-salman-3zq4k8/15min`

### 3. Webhook Server for Email Notifications — `webhook/server.js`
- Simple Node.js HTTP server (zero npm dependencies)
- Listens on port `3001`
- Endpoint: `POST /webhook/cal` — receives cal.com webhook events
- On `BOOKING_CREATED` event → sends a styled HTML email via Resend to owner
- **Sends from:** `Salman@buildimara.com` (domain verified on Resend)
- **Sends to:** `syedsalman726@gmail.com`

**Note:** The webhook server runs separately — it needs a VPS or serverless function to host. It does NOT run on Cloudflare Workers. Deploy it with:
```bash
cd webhook
docker build -t build-imara-webhook .
docker run -p 3001:3001 -e RESEND_API_KEY=re_LjsPaaur_EcwbCvYqG5nZg2RyZWnds2Ch build-imara-webhook
```

### 4. Cal.com Webhook Configuration
Already configured in Cal.com dashboard:
- **Subscriber URL:** `https://buildimara.com:3001/webhook/cal`
- **Secret:** `buildimara-calcom-webhook-2026`
- **Triggers:** Booking created, rejected, requested, payment initiated, rescheduled, paid, form submitted

---

## Key Files

| File | Purpose |
|---|---|
| `index.html` | Main website — pricing section + cal.com booking modal |
| `wrangler.toml` | Cloudflare Workers deployment config |
| `.assetsignore` | Excludes non-static files from Cloudflare upload |
| `PACKAGES.xlsx` | Source of truth for all package specs |
| `webhook/server.js` | Cal.com webhook → Resend email notifications |
| `webhook/Dockerfile` | Docker config for webhook server |
| `docker-compose.yml` | Runs webhook server (port 3001) |

---

## Credentials

| Service | Key | Purpose |
|---|---|---|
| Cal.com API | `cal_live_a981aa9152f46bf30d9600ca1cb78e85` | Account access (username: `syed-salman-3zq4k8`) |
| Resend API | `re_LjsPaaur_EcwbCvYqG5nZg2RyZWnds2Ch` | Sending email notifications |
| Resend sender | `Salman@buildimara.com` | From address (domain verified on Cloudflare/Resend) |
| Notify email | `syedsalman726@gmail.com` | Where booking emails are sent |
| Cloudflare account | `syedamer130@gmail.com` | Workers & Pages hosting |
