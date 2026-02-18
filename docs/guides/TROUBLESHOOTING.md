# Troubleshooting Guide

This guide covers common issues and their solutions for the **Peptides Malaysia - Evo™** platform.

## 🛑 Common Server Errors

### 500 Internal Server Error (Generic)
This usually means a crash in the Vercel Serverless Function.
- **Check Vercel Logs:** Go to the Vercel Dashboard -> Logs.
- **Common Cause:** Missing environment variables (e.g., `DATABASE_URL` not set).
- **Common Cause:** Database connection timeout or throttled (Neon free tier limits).

### Database Verification
If you suspect database connection or data integrity issues, use the included verification script:
```bash
node verify_db.cjs
```
This script attempts to connect to the database defined in your `.env` and fetches a list of products.
- **Success:** Logs "Products in DB: [...]"
- **Failure:** Logs connection error details. useful for diagnosing `PrismaClientInitializationError`.

### 401 Unauthorized
The API requires a valid JWT token.
- **Check Token:** Verify the `Authorization: Bearer <token>` header is sent.
- **Check Expiration:** Token might have expired. Log out and log back in.
- **Secret Mismatch:** If `JWT_SECRET` was recently changed on the server, all existing tokens are invalidated.

### 403 Forbidden
The token is valid, but the user lacks permissions.
- **Check Role:** Ensure the `User.role` in the database is set to `admin` for managing products/orders.

---

## 💾 Database Issues

### "PrismaClient did not initialize"
Usually happens on Vercel after a dependency update.
- **Solution:** Ensure the `postinstall` script in `package.json` includes `prisma generate`.
- **Solution:** Redeploy without cache on Vercel.

### Connection Limits (Neon)
If you see "Too many connections" errors:
- **Solution:** Use Neon's **Connection Pooling** URL in the `DATABASE_URL`.
- **Optimization:** Ensure the `prisma` client is used as a singleton (implemented in `src/lib/db.ts`).

---

## 🎨 Styling & Frontend

### Tailwind Styles Not Appearing
- **Solution:** Ensure `npm run dev` is running (it recompiles Tailwind JIT).
- **Solution:** Check if the classes are being stripped by the CSS minifier.

### Product Page Loading Forever
- **Check API:** Open browser DevTools Network tab. If `/api/products` is pending, it's a server-side issue.
- **Check React Query:** Ensure the `ProductsProvider` is wrapping the application in `App.tsx`.

---

## 🛠️ Developer Support

If an issue persists:
1.  Run `npm run test` to see if core logic is failing.
2.  Run `npx prisma studio` to verify data integrity.
3.  Check the `.env.local` file for local development discrepancies.
