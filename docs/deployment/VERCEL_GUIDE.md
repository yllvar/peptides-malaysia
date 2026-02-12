# Deployment Guide

This document provides a guide for deploying the **Peptides Malaysia - Evo™** backend to Vercel.

## 🚀 Deployment Process

### Prerequisites
- A Vercel account.
- A Neon PostgreSQL database instance (`DATABASE_URL`).
- A `JWT_SECRET` generated for production.

### Step-by-Step

1.  **Configure Environment Variables**
    In your Vercel Project Settings > Environment Variables, add the following:
    
    | Variable | Description |
    |---|---|
    | `DATABASE_URL` | Your Neon Postgres connection string (with `?sslmode=require`). |
    | `JWT_SECRET` | A secure, long random string for signing JWT tokens. |
    | `TOYYIBPAY_SECRET_KEY` | Your live ToyyibPay Secret Key. |
    | `TOYYIBPAY_CATEGORY_CODE` | Your live ToyyibPay Category Code. |
    | `TOYYIBPAY_BASE_URL` | `https://toyyibpay.com` (Production). |
    | `VITE_APP_URL` | Your production URL (e.g., `https://peptides-malaysia.vercel.app`). |
    | `ADMIN_EMAIL` | (Optional) Admin notification email. |

2.  **Database Migrations**
    Ensure schema migrations are applied to production:
    ```bash
    npx prisma migrate deploy
    ```
    *(This runs automatically during the build if configured in `package.json` scripts).*

3.  **Build & Deploy**
    Vercel automatically detects the framework (Vite) and builds the project.
    - **Build Command:** `npm run build`
    - **Output Directory:** `dist`

### Post-Deployment Verification
- Verify the **Health Check** endpoint (if applicable) or load the homepage.
- Test strict **CORS** policies if configured.
- Monitor Vercel Logs for any runtime errors in Serverless Functions.

---

## ⚠️ Important Considerations

### Cold Starts
Vercel Serverless Functions may experience cold starts. Prisma Client initialization adds ~200-500ms overhead.
- **Implementation:** We use the standard Prisma Client with the `nodejs` runtime for maximum stability and performance on Vercel.

### Database Connection Limits
Serverless functions can exhaust database connections during traffic spikes.
- **Solution:** Use Neon's connection pooling features or PgBouncer if necessary.

### ToyyibPay Webhook Security
Ensure the webhook URL is correctly whitelisted or accessible publicly.
- **URL Pattern:** `https://your-domain.com/api/checkout/webhook`
- **Verification:** Implement server-to-server callback verification or IP whitelisting if supported.
