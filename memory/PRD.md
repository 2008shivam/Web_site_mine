# Cyberent³ Website PRD

## Original Problem Statement
Build a website for a freelancing cybersecurity company named "Cyberent^3" which provides VAPT (Vulnerability Assessment and Penetration Testing) services for Web, Mobile, Infrastructure/Network, Thick Client, APIs, and GRC Auditing.

## User Choices
- Static informational website with contact form functionality
- Dark cyber-fortress theme
- Email notifications to jhashivam2008@gmail.com
- Contact email: hello@cyberentcube.com

## Target Users
- Businesses seeking VAPT/cybersecurity services
- CTOs, IT Managers, Security Teams
- Enterprise clients

## Architecture
- **Frontend**: React with Tailwind CSS, Shadcn UI, React Router
- **Backend**: FastAPI with MongoDB, Resend email integration
- **Styling**: Dark theme with neon green (#00FF94) accents

## What's Been Implemented

### Frontend (Updated Jan 31, 2025)
- [x] Custom cyber-cube SVG logo
- [x] Hero section with typing animation effect
- [x] Navigation with smooth scroll
- [x] Services section (6 services including GRC)
- [x] About section with stats and features
- [x] Contact form with service selection dropdown
- [x] Footer with company info & email
- [x] Responsive design with mobile menu
- [x] Toast notifications (Sonner)
- [x] SSL Security Badge (256-bit encryption indicator)
- [x] Error Pages: 404, 403, 500, Offline
- [x] Favicon (matching logo)
- [x] SEO: robots.txt, sitemap.xml, meta tags

### Backend
- [x] `/api/contact` - POST endpoint for contact form submissions
- [x] `/api/contact` - GET endpoint to retrieve submissions
- [x] MongoDB integration for storing contact data
- [x] Resend email integration (notifications to jhashivam2008@gmail.com)
- [x] Security headers (CSP, HSTS, XSS Protection, etc.)

### Security Headers Implemented
- Content-Security-Policy (CSP)
- X-Content-Type-Options: nosniff
- X-Frame-Options: SAMEORIGIN
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy
- Strict-Transport-Security (HSTS)

## Feature Backlog

### P0 (Critical)
- All features implemented ✅

### P1 (Important)
- Admin dashboard to view contact submissions
- Email auto-responder to form submitters

### P2 (Nice to Have)
- Blog section
- Case studies/testimonials
- Service-specific landing pages
- Multi-language support
- Live chat integration
- Analytics dashboard

## Services Offered
1. Web Application VAPT
2. Mobile Application VAPT
3. Infrastructure/Network VAPT
4. Thick Client VAPT
5. API Security Testing
6. GRC Auditing (ISO 27001, SOC 2, GDPR/HIPAA)

## Error Pages
- 404 - Page Not Found (cyber-security themed)
- 403 - Access Forbidden (warning styled)
- 500 - Internal Server Error (red alert styled)
- Offline - Network Connection Lost

## Next Action Items
1. Set up custom domain (cyberentcube.com)
2. Add testimonials/case studies section
3. Implement admin dashboard for contact submissions
