# Order Tracking Architecture Audit & Integrity Report
**Date:** 2026-02-19
**Status:** Vital Integrity Check

## 1. Executive Summary
Order tracking is handled by **two independent systems** that both read from the same Neon Postgres database:

| System | Role | DB Access |
|---|---|---|
| **Web App** (Vite/React + Vercel Serverless) | Order creation, authenticated order history, admin status updates | Prisma ORM (read/write) |
| **WhatsApp Bot** (FastAPI + Twilio + Gemini, Railway) | Customer-facing order lookup via chat | **Direct Neon connection** via `psycopg2`/`asyncpg` (read-only) |

**Key Architectural Fact:** The WhatsApp Bot has its own `DATABASE_URL` and connects **directly** to Neon Postgres. It does **not** call the Web App's API endpoints and has **zero dependency** on the Web App's API keys, uptime, or auth layer.

This creates a **dual-reader, single-writer** pattern where **data format mismatches** between what the Web App writes and what the Bot expects to read are the primary source of tracking failures.

## 2. Data Flow
```
[Customer Checkout] → Web App → Prisma → Neon DB (writes raw user input)
[Admin Panel]       → Web App → Prisma → Neon DB (updates status/tracking)
[WhatsApp Query]    → Bot → psycopg2 → Neon DB (reads with sanitized queries)
```

## 3. Critical Findings (Prioritised)

### 🚨 P0: Phone Number Format Mismatch
**Severity:** HIGH — Causes tracking failures right now.

The Web App saves phone numbers exactly as the user types them (e.g., `012-345 6789`).
The Bot strips non-digits and queries with `LIKE '%123456789%'`.

**The bug:** The stored value `012-345 6789` does not contain the contiguous substring `123456789` — the hyphen and space break the match. The query returns **zero results** for a valid order.

**Fix:** Sanitize phone numbers at write time in `api/checkout/index.ts`:
```typescript
shippingPhone: shippingInfo.phone.replace(/\D/g, ''),
```
This is a one-line change. All future orders will be queryable by both systems.

---

### 🚨 P1: No Email / SMS Confirmation -> **[DE-PRIORITISED]**
**Reasoning:** Integrating Twilio/Email into the Web App violates the "strict independence" architecture.
**Solution:** Since **P0 is fixed**, users do *not* need their Order ID to track. They can simply message the Bot from their phone, and the Bot will look up their order history by **phone number match**.

**Conclusion:** The phone number sanitization (P0) effectively solves the "lost Order ID" problem for guests.

---

### P2: Guest Users Cannot Track on Website
**Severity:** MEDIUM

`OrderHistory.tsx` requires authentication (`requireAuth`). Guest users — who are specifically supported at checkout — have **no web interface** for tracking. They are entirely reliant on the WhatsApp Bot.

**Current state:** Acceptable if P0 is fixed (Bot becomes the reliable guest channel). A web-based `/track` page would be a nice-to-have, not urgent.

---

### P3: Sequential Order IDs
**Severity:** LOW (for now)

Order numbers use `EVO-{Date.now().slice(-8)}`, which is sequential and guessable. The WhatsApp Bot returns the customer's shipping name when given a valid Order ID.

**Current risk:** Low volume means low exposure, but worth noting for later hardening.

---

## 4. Legacy Code: `api/` Folder
The `api/` folder on the Web App side still contains the serverless endpoints used for order management. These endpoints are **not consumed by the WhatsApp Bot** — the Bot has its own direct DB connection.

The `api/` folder is still actively used by:
- The **Web App frontend** (checkout, order history, admin panel)
- The **ToyyibPay webhook** (`api/checkout/webhook/`)

It is **not** legacy/dead code for the Web App itself — only irrelevant to the Bot's architecture.

## 5. Recommended Action Order
| Priority | Action | Effort |
|---|---|---|
| **P0** | Sanitize phone at write time (`api/checkout/index.ts`) | DONE |
| **P1** | Send order confirmation via Resend after payment | DONE |
| **P2** | Guest tracking page (`/track`) | DONE |
| **P3** | Non-sequential order IDs | DONE |

## 6. Status
- [x] Audit complete
- [x] P0 fix implemented
- [x] P1 fix implemented (Resend email; currently using `onboarding@resend.dev` until production domain verified)
- [x] P3 fix implemented (random UUID-based order IDs)
