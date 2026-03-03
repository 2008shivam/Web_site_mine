# Cyberent³ - GitHub Pages Deployment Guide

## Overview
This is a **pure frontend** React application that can be deployed to GitHub Pages without any backend/Python.

## Prerequisites
- Node.js (v18+)
- Git
- GitHub account
- EmailJS account (free)

---

## Step 1: Set Up EmailJS (Free)

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/) and sign up
2. **Add Email Service:**
   - Go to "Email Services" → "Add New Service"
   - Choose your email provider (Gmail, Outlook, etc.)
   - Connect your account
   - Note your **Service ID** (e.g., `service_abc123`)

3. **Create Email Template:**
   - Go to "Email Templates" → "Create New Template"
   - Use this template:
   ```
   Subject: [Cyberent³] New Inquiry: {{service_type}} - {{from_name}}
   
   New contact form submission:
   
   Name: {{from_name}}
   Email: {{from_email}}
   Company: {{company}}
   Service: {{service_type}}
   
   Message:
   {{message}}
   ```
   - Save and note your **Template ID** (e.g., `template_xyz789`)

4. **Get Public Key:**
   - Go to "Account" → "API Keys"
   - Copy your **Public Key**

---

## Step 2: Configure Environment Variables

Edit `/frontend/.env`:
```env
REACT_APP_EMAILJS_SERVICE_ID=service_your_id
REACT_APP_EMAILJS_TEMPLATE_ID=template_your_id
REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key
```

**Note:** These keys are PUBLIC and safe to commit to GitHub (EmailJS is designed this way).

---

## Step 3: Update package.json Homepage

Edit `package.json` and update the homepage URL:
```json
"homepage": "https://YOUR_GITHUB_USERNAME.github.io/YOUR_REPO_NAME"
```

---

## Step 4: Deploy to GitHub Pages

### Option A: Using gh-pages (Recommended)

```bash
# Install gh-pages if not already installed
yarn add --dev gh-pages

# Build and deploy
yarn deploy
```

### Option B: Manual Deployment

```bash
# Build the project
yarn build

# The build folder contains your static site
# Push the contents of /build to the gh-pages branch
```

### Option C: GitHub Actions (Automatic)

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: yarn install
        
      - name: Build
        run: yarn build
        env:
          REACT_APP_EMAILJS_SERVICE_ID: ${{ secrets.EMAILJS_SERVICE_ID }}
          REACT_APP_EMAILJS_TEMPLATE_ID: ${{ secrets.EMAILJS_TEMPLATE_ID }}
          REACT_APP_EMAILJS_PUBLIC_KEY: ${{ secrets.EMAILJS_PUBLIC_KEY }}
          
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
```

---

## Step 5: Enable GitHub Pages

1. Go to your GitHub repository
2. Settings → Pages
3. Source: Deploy from a branch
4. Branch: `gh-pages` / `root`
5. Save

Your site will be live at: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME`

---

## Project Structure (Frontend Only)

```
/frontend
├── public/
│   ├── index.html
│   ├── favicon.svg
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── App.js          # Main application
│   ├── App.css         # Styles
│   ├── index.css       # Global styles
│   └── components/ui/  # Shadcn components
├── .env                # Environment variables
├── package.json
└── tailwind.config.js
```

---

## Custom Domain (Optional)

1. Add a `CNAME` file in `/public` with your domain:
   ```
   cyberentcube.com
   ```

2. Configure DNS:
   - Add CNAME record pointing to `YOUR_USERNAME.github.io`
   - Or add A records pointing to GitHub's IPs

---

## Troubleshooting

### Blank page after deployment
- Ensure `homepage` in package.json matches your GitHub Pages URL
- Check browser console for errors

### Email not sending
- Verify EmailJS credentials in .env
- Check EmailJS dashboard for logs
- Ensure template variables match exactly

### 404 on refresh
- This is normal for single-page apps on GitHub Pages
- HashRouter is used (`/#/` URLs) to handle this

---

## Security Notes

✅ **Safe to expose:**
- EmailJS Public Key (designed to be public)
- EmailJS Service ID
- EmailJS Template ID

❌ **Never expose:**
- Resend API keys
- Backend secrets
- Database credentials

---

## Contact

For issues: hello@cyberentcube.com
