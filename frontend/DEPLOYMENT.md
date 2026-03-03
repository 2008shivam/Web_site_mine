# Cyberent³ - GitHub Pages + Resend Deployment Guide

## Overview
This is a **pure frontend** React app deployable to GitHub Pages, using **Resend** for emails via a free **Cloudflare Worker** proxy.

```
┌─────────────────┐      ┌─────────────────────┐      ┌─────────────┐
│  GitHub Pages   │ ───► │  Cloudflare Worker  │ ───► │   Resend    │
│  (React App)    │      │  (Free, Serverless) │      │   (Email)   │
└─────────────────┘      └─────────────────────┘      └─────────────┘
     Frontend              Keeps API key safe           Sends email
```

---

## Step 1: Set Up Cloudflare Worker (5 minutes)

### 1.1 Create Cloudflare Account
Go to [https://dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up) (free)

### 1.2 Create Worker
1. Go to **Workers & Pages** → **Create Application** → **Create Worker**
2. Name it: `cyberent-email`
3. Click **Deploy**

### 1.3 Edit Worker Code
1. Click **Edit code**
2. Replace all code with contents of `cloudflare-worker.js` (included in this project)
3. Click **Save and Deploy**

### 1.4 Add Resend API Key
1. Go to Worker → **Settings** → **Variables**
2. Click **Add variable**
3. Name: `RESEND_API_KEY`
4. Value: Your Resend API key (e.g., `re_DEMwQcGB_...`)
5. Click **Encrypt** (important!)
6. Click **Save and Deploy**

### 1.5 Get Your Worker URL
Your worker URL will be: `https://cyberent-email.YOUR_SUBDOMAIN.workers.dev`

---

## Step 2: Configure React App

Update `/frontend/.env`:
```env
REACT_APP_EMAIL_API_URL=https://cyberent-email.YOUR_SUBDOMAIN.workers.dev
```

---

## Step 3: Deploy to GitHub Pages

### 3.1 Update package.json
```json
"homepage": "https://YOUR_USERNAME.github.io/cyberent-cube"
```

### 3.2 Deploy
```bash
cd frontend
yarn install
yarn deploy
```

### 3.3 Enable GitHub Pages
1. Go to GitHub repo → **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: `gh-pages` / `root`
4. Save

---

## Project Files

```
/frontend
├── src/
│   └── App.js              # Main app (uses EMAIL_API_URL)
├── cloudflare-worker.js    # Deploy this to Cloudflare
├── .env                    # Set REACT_APP_EMAIL_API_URL here
├── package.json            # Update homepage for your repo
└── DEPLOYMENT.md           # This file
```

---

## Security

✅ **Secure:**
- Resend API key stored in Cloudflare Worker (encrypted)
- Never exposed to frontend/browser

✅ **How it works:**
1. User submits form on your website
2. React sends data to Cloudflare Worker
3. Worker calls Resend API with secret key
4. Email sent to jhashivam2008@gmail.com

---

## Troubleshooting

### CORS Error
Make sure your Cloudflare Worker has these headers:
```javascript
"Access-Control-Allow-Origin": "*"
```

### Email not received
1. Check Cloudflare Worker logs (Workers → Your Worker → Logs)
2. Check Resend dashboard for delivery status
3. Verify RESEND_API_KEY is set correctly

### 404 on page refresh
This is normal - HashRouter uses `/#/` URLs which work on GitHub Pages

---

## Costs

| Service | Cost |
|---------|------|
| GitHub Pages | Free |
| Cloudflare Workers | Free (100k requests/day) |
| Resend | Free (100 emails/day) |

**Total: $0/month** for most use cases

---

## Custom Domain (Optional)

1. Add `CNAME` file in `/public`:
   ```
   cyberentcube.com
   ```

2. Configure DNS to point to GitHub Pages

---

## Contact
For issues: hello@cyberentcube.com
