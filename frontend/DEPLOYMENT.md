# Cyberent³ - Vercel Deployment Guide (with Resend)

## Overview
Deploy to **Vercel** with a serverless function that securely handles Resend API calls.

```
┌─────────────────┐      ┌─────────────────────┐      ┌─────────────┐
│     Vercel      │      │  Vercel Serverless  │      │   Resend    │
│  (React App)    │ ───► │    Function /api    │ ───► │   (Email)   │
└─────────────────┘      └─────────────────────┘      └─────────────┘
     Frontend              API key is secure            Sends email
```

**Benefits:**
- ✅ One-click deployment
- ✅ API key stored securely as environment variable
- ✅ Free tier (100GB bandwidth, unlimited serverless invocations)
- ✅ Automatic HTTPS
- ✅ Custom domain support

---

## Step 1: Prepare Your Code

Your project structure should look like:
```
/frontend
├── api/
│   └── send-email.js    # Serverless function (already created)
├── src/
│   └── App.js           # React app
├── vercel.json          # Vercel configuration
├── package.json
└── .env
```

---

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (from /frontend directory)
cd frontend
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Select your account
# - Link to existing project? No
# - Project name? cyberent-cube
# - Directory? ./
# - Override settings? No
```

### Option B: Deploy via GitHub Integration

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click **"Add New Project"**
4. Import your GitHub repository
5. Configure:
   - Framework Preset: **Create React App**
   - Root Directory: `frontend` (if in subdirectory)
6. Click **Deploy**

---

## Step 3: Add Environment Variables

**IMPORTANT:** Add your Resend API key securely in Vercel.

### Via Vercel Dashboard:
1. Go to your project in Vercel Dashboard
2. Click **Settings** → **Environment Variables**
3. Add:
   | Name | Value | Environment |
   |------|-------|-------------|
   | `RESEND_API_KEY` | `re_DEMwQcGB_LvQhAgmkgqgnFqwTZYeZgMKo` | Production, Preview, Development |
4. Click **Save**
5. **Redeploy** for changes to take effect

### Via Vercel CLI:
```bash
vercel env add RESEND_API_KEY
# Enter: re_DEMwQcGB_LvQhAgmkgqgnFqwTZYeZgMKo
# Select: Production, Preview, Development
```

---

## Step 4: Test Your Deployment

1. Visit your Vercel URL: `https://your-project.vercel.app`
2. Fill out the contact form
3. Check your email at jhashivam2008@gmail.com

---

## Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → **Settings** → **Domains**
2. Add your domain: `cyberentcube.com`
3. Configure DNS as instructed by Vercel

---

## Project Files Explained

### `/api/send-email.js`
```javascript
// This is a Vercel Serverless Function
// - Runs on server, not in browser
// - Has access to process.env.RESEND_API_KEY
// - Called when frontend POSTs to /api/send-email
```

### `/vercel.json`
```json
{
  "builds": [...],  // How to build the project
  "routes": [...],  // URL routing rules
  "env": {...}      // Environment variable references
}
```

---

## Security

| What | Where | Secure? |
|------|-------|---------|
| Resend API Key | Vercel Environment Variables | ✅ Yes - Server-side only |
| Form Data | HTTPS encrypted | ✅ Yes |
| API Endpoint | `/api/send-email` | ✅ Yes - Serverless function |

**The API key is NEVER exposed to the browser.**

---

## Troubleshooting

### "Failed to send email" error
1. Check Vercel Dashboard → Your Project → **Logs**
2. Verify `RESEND_API_KEY` is set in Environment Variables
3. Redeploy after adding environment variables

### Form submits but no email received
1. Check Resend Dashboard for delivery status
2. Check spam folder
3. Verify the recipient email in `/api/send-email.js`

### 404 on /api/send-email
1. Ensure `/api/send-email.js` exists
2. Check `vercel.json` configuration
3. Redeploy the project

### CORS errors
The serverless function includes CORS headers. If issues persist:
```javascript
// In /api/send-email.js
res.setHeader("Access-Control-Allow-Origin", "https://your-domain.com");
```

---

## Updating the Recipient Email

To change where emails are sent, edit `/api/send-email.js`:
```javascript
to: ["your-new-email@example.com"],
```

Then redeploy:
```bash
vercel --prod
```

---

## Costs

| Service | Free Tier |
|---------|-----------|
| Vercel | 100GB bandwidth, unlimited serverless |
| Resend | 100 emails/day, 3,000/month |

**Total: $0/month** for most small businesses

---

## Quick Commands

```bash
# Deploy to production
vercel --prod

# View logs
vercel logs

# List environment variables
vercel env ls

# Pull env vars locally for testing
vercel env pull
```

---

## Local Development

To test the serverless function locally:

```bash
# Install Vercel CLI
npm install -g vercel

# Run development server with serverless functions
vercel dev
```

This will run both the React app and serverless functions locally.

---

## Contact
For issues: hello@cyberentcube.com
