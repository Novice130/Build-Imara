# Build Imara — Handoff Summary

**Project:** `c:\Users\Syed Amer\Documents\Phet\Build_Imara`
A static HTML website for a Hyderabad home construction company (Build Imara).

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
- Every "Book Consultation" button opens a **popup modal** with an inline cal.com booking widget
- **Cal.com username:** `syed-salman-3zq4k8`
- **Event slug:** `15min` (15 min meeting via Cal Video)
- **Full booking URL:** `https://cal.com/syed-salman-3zq4k8/15min`
- **Verified working** — modal opens, shows "Syed Salman · 15 min meeting · Asia/Kolkata" with calendar

### 3. Webhook Server for Email Notifications — `webhook/server.js`
- Simple Node.js HTTP server (zero npm dependencies)
- Listens on port `3001`
- Endpoint: `POST /webhook/cal` — receives cal.com webhook events
- Health check: `GET /health`
- On `BOOKING_CREATED` event → sends a styled HTML email via Resend API to the owner
- Email includes: attendee name, email, phone, date/time, event title, notes
- **Sends from:** `Salman@buildimara.com` (domain verified on Resend)

### 4. Button Wiring
- All **"Get Free Quote"** buttons (navbar, hero, CTA section) → open cal.com booking modal
- **"View Plans"** hero button → scrolls to `#pricing` section

### 5. Docker Setup
- **`webhook/Dockerfile`** — uses `node:20-alpine`, no `npm install` needed
- **`docker-compose.yml`** — runs both:
  - `build-imara` (nginx static site, port 80)
  - `build-imara-webhook` (Node.js webhook server, port 3001)

---

## What Still Needs To Be Done ⚠️

### 1. Configure the Cal.com Webhook (REQUIRED for email notifications)
Go to [cal.com](https://cal.com) → **Settings** → **Developer** → **Webhooks** → **Add webhook**:
- **Subscriber URL:** `https://YOUR_DOMAIN:3001/webhook/cal`
  - Replace `YOUR_DOMAIN` with your actual server domain/IP after deploying
- **Enable webhook:** ON
- **Event triggers:** Select at minimum `Booking created`
- Click **Create webhook**

### 2. Deploy
```bash
docker-compose up --build -d
```

### 3. Resend Sender ✅
Emails now send from `Salman@buildimara.com` — domain is verified on Resend.

---

## Key Files

| File | Purpose |
|---|---|
| `index.html` | Main website — pricing section + cal.com modal |
| `PACKAGES.xlsx` | Source of truth for all package specs |
| `webhook/server.js` | Cal.com webhook → Resend email notifications |
| `webhook/Dockerfile` | Docker config for webhook server |
| `docker-compose.yml` | Runs static site (port 80) + webhook (port 3001) |

---

## Credentials

| Service | Key | Purpose |
|---|---|---|
| Cal.com API | `cal_live_a981aa9152f46bf30d9600ca1cb78e85` | Account access (username: `syed-salman-3zq4k8`) |
| Resend API | `re_LjsPaaur_EcwbCvYqG5nZg2RyZWnds2Ch` | Sending email notifications |
| Notify email | `syedsalman726@gmail.com` | Where booking emails are sent |
