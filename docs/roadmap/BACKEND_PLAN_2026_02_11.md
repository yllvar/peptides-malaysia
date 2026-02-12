# 🏗️ PEPTIDES MALAYSIA — EVO™ BACKEND PLAN
### E-Commerce Backend Architecture & Implementation Roadmap
**Version:** 1.0  
**Date:** 2026-02-11  
**Status:** PLANNING

---

## TABLE OF CONTENTS

1. [Executive Summary](#1-executive-summary)
2. [Current State Audit](#2-current-state-audit)
3. [Architecture Decision](#3-architecture-decision)
4. [Database Schema Design](#4-database-schema-design)
5. [API Design](#5-api-design)
6. [Authentication & Authorization](#6-authentication--authorization)
7. [Payment Integration](#7-payment-integration)
8. [Order Management System](#8-order-management-system)
9. [Inventory Management](#9-inventory-management)
10. [Shipping & Logistics](#10-shipping--logistics)
11. [Admin Dashboard](#11-admin-dashboard)
12. [Frontend Refactor Plan](#12-frontend-refactor-plan)
13. [Infrastructure & Deployment](#13-infrastructure--deployment)
14. [Phased Rollout](#14-phased-rollout)
15. [Risk Assessment](#15-risk-assessment)

---

## 1. EXECUTIVE SUMMARY

### The Problem

The Peptides Malaysia Evo™ storefront is currently a **fully static, client-side React SPA**. It has:

| Capability | Current State | Target State |
|---|---|---|
| Product Catalog | Hardcoded in `constants.ts` (13 SKUs) | Dynamic, DB-driven, admin-manageable |
| Cart | `localStorage` only, no persistence | Server-persisted, cross-device |
| Checkout | WhatsApp redirect (manual) | Integrated payment gateway (ToyyibPay / Stripe) |
| Order Tracking | None | Full order lifecycle (Pending → Paid → Shipped → Delivered) |
| User Accounts | None | Registration, login, order history |
| Inventory | None (`inStock: boolean` flag) | Real-time stock count, low-stock alerts |
| Admin Panel | None | Product CRUD, order management, analytics |
| Shipping | Flat RM10 hardcoded | Dynamic rates by zone, courier integration |

### Business Goal

Convert the existing premium frontend into a **fully functional e-commerce platform** that can:
1. Accept online payments (Malaysian market — FPX, card, e-wallet)
2. Manage orders without manual WhatsApp intervention
3. Track inventory in real-time
4. Scale to 50+ SKUs and 100+ orders/day

---

## 2. CURRENT STATE AUDIT

### 2.1 Frontend Architecture

```
peptides-malaysia/
├── App.tsx                 # Root — HashRouter, cart state in useState
├── constants.ts            # ALL data lives here (products, blogs, COA)
├── types.ts                # Product, CartItem, BlogPost, COADocument
├── index.tsx               # Entry point
├── index.css               # TailwindCSS v4
├── vite.config.ts          # Vite + React + Tailwind
├── components/
│   ├── Navbar.tsx           # Cart count badge
│   └── Footer.tsx
├── pages/
│   ├── Home.tsx             # Hero, featured product, research goals
│   ├── Shop.tsx             # Product grid + category filters
│   ├── ProductDetail.tsx    # Tabs: Description, Technical, Handling, COA
│   ├── Cart.tsx             # Cart items + shipping form → WhatsApp checkout
│   ├── Latest.tsx           # Products flagged `isNew: true`
│   ├── Education.tsx        # Blog + calculator
│   ├── LabTesting.tsx       # COA table
│   ├── Contact.tsx          # Form → WhatsApp
│   ├── About.tsx
│   ├── BlogPost.tsx
│   ├── Privacy.tsx
│   ├── Terms.tsx
│   └── NotFound.tsx
└── __tests__/               # 101 tests, all passing (Vitest)
```

### 2.2 Critical Data Dependencies (What Must Move to DB)

| Data | Source | Lines | Records |
|---|---|---|---|
| `PRODUCTS` | `constants.ts` L6-138 | 132 | 13 SKUs |
| `TECHNICAL_SPECS` | `constants.ts` L141-147 | 6 | 5 records |
| `STORAGE_PROTOCOLS` | `constants.ts` L149-162 | 13 | 1 object |
| `BLOG_POSTS` | `constants.ts` L164-191 | 27 | 3 posts |
| `COA_DATA` | `constants.ts` L194-202 | 8 | 7 records |
| `WHATSAPP_NUMBER` | `constants.ts` L3 | 1 | Config |
| Cart State | `App.tsx` L31-67 | 36 | Runtime (localStorage) |
| Shipping Data | `Cart.tsx` L14-20 | 6 | Runtime (form state) |

### 2.3 Current Checkout Flow (Manual)

```
User browses → Adds to cart (localStorage) → Fills shipping form →
"Complete Order" button → Opens WhatsApp with pre-filled message →
Manual bank transfer → Owner confirms manually → Ships
```

**Problems:**
- No payment verification — relies on trust
- No order record — only WhatsApp chat history
- No inventory deduction — stock is a boolean flag
- No order status tracking for the customer
- Cart is lost if user clears browser data

---

## 3. ARCHITECTURE DECISION

### 3.1 Recommended Stack: **Neon Postgres + Vercel Serverless**

| Layer | Technology | Rationale |
|---|---|---|
| **Database** | **Neon Postgres** (Serverless) | Serverless Postgres, scales to zero, branching for dev, generous free tier (0.5GB) |
| **ORM** | **Prisma** | Type-safe, best-in-class DX, intuitive relational queries, Prisma Studio GUI, excellent docs |
| **Auth** | **Custom JWT** (bcrypt + jose) | Lightweight, no vendor lock-in, full control over session logic |
| **API** | **Vercel Serverless Functions** (Node.js) | Co-located with frontend, zero config, handles webhooks |
| **Storage** | **Vercel Blob** | Product images, COA PDFs — integrated with Vercel, no extra infra |
| **Payment** | ToyyibPay (primary) + Stripe (future) | ToyyibPay supports FPX (Malaysian bank transfer) — dominant local method |
| **Frontend** | Existing React + Vite (refactored) | Keep existing UI, add API calls via `fetch` to `/api/*` routes |
| **Hosting** | Vercel (existing `.vercel` dir) | Already configured, free tier sufficient |

### 3.2 Why Neon Postgres over Alternatives

| Option | Pros | Cons | Verdict |
|---|---|---|---|
| **Neon Postgres** | Serverless (scales to zero), branching, generous free tier, standard Postgres, no vendor lock-in | Newer service | ✅ **SELECTED** |
| **Supabase** | Auth + Storage + DB bundled | Vendor lock-in, "magic" abstractions hide complexity | ❌ |
| **PlanetScale** | MySQL serverless | MySQL (not Postgres), compat issues with some ORMs | ❌ |
| **Firebase** | Real-time, Google ecosystem | NoSQL (Firestore) — poor for relational e-commerce data | ❌ |
| **Custom VPS Postgres** | Full control, cheapest | Must manage server, backups, scaling — ops burden | ❌ |

### 3.3 Why Prisma ORM

| Feature | Prisma | Drizzle | Raw SQL |
|---|---|---|---|
| Type Safety | ✅ Full (codegen) | ✅ Full (schema-as-code) | ❌ None |
| Developer Experience | ✅ Best-in-class | Good | Poor |
| Documentation | ✅ Excellent, mature | Good but newer | N/A |
| Relational Queries | ✅ Intuitive `include` | `.with()` (newer) | Manual JOINs |
| Migrations | ✅ `prisma migrate` | `drizzle-kit` | Manual |
| Visual DB Browser | ✅ **Prisma Studio** (free) | ❌ None | pgAdmin |
| Neon Integration | ✅ `@prisma/adapter-neon` | First-class | Supported |
| Community / Ecosystem | ✅ Massive, 5+ years | Growing, ~2 years | N/A |
| Serverless Cold Start | ~200-400ms (mitigatable) | ~50ms | Fast |
| **Verdict** | ✅ **SELECTED** | ❌ | ❌ |

> **Cold start mitigation:** A simple Vercel cron ping every 5 minutes keeps functions warm, eliminating the Prisma engine cold-start penalty in practice.

### 3.4 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│                  VERCEL (CDN + Serverless)            │
│  ┌───────────────────────┐  ┌──────────────────────┐ │
│  │   React SPA (Vite)    │  │  /api/* Serverless   │ │
│  │ Home|Shop|Cart|Checkout│  │  Functions (Node.js) │ │
│  │                       │  │  • create-order      │ │
│  │  fetch('/api/...')  ──────→ • create-payment     │ │
│  │                       │  │  • payment-webhook   │ │
│  │                       │  │  • auth (login/reg)  │ │
│  └───────────────────────┘  └──────────┬───────────┘ │
│  ┌───────────────────────┐             │             │
│  │   Vercel Blob Storage │             │             │
│  │   (Images, PDFs)      │             │             │
│  └───────────────────────┘             │             │
└────────────────────────────────────────┼─────────────┘
                                         │
                              Prisma ORM + @prisma/adapter-neon
                                         │
┌────────────────────────────────────────▼─────────────┐
│                  NEON POSTGRES                        │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────┐   │
│  │ products │  │  orders  │  │    profiles       │   │
│  │ tech_spc │  │ ord_items│  │    sessions       │   │
│  │ coa_docs │  │ payments │  │    discount_codes │   │
│  └──────────┘  └──────────┘  └───────────────────┘   │
└──────────────────────┬───────────────────────────────┘
                       │
              Webhook Callback
                       │
┌──────────────────────▼──────────────────────────────┐
│               TOYYIBPAY GATEWAY                      │
│         FPX | Credit Card | E-Wallet                 │
└─────────────────────────────────────────────────────┘
```

---

## 4. DATABASE SCHEMA DESIGN

### 4.1 Entity Relationship Overview

```
users ─────────────┐
                    │ 1:N
                    ▼
               orders ──────────── order_items
                    │                    │
                    │ 1:1                │ N:1
                    ▼                    ▼
            order_payments          products
                                        │
                                        │ 1:N
                                   ┌────┴────┐
                              tech_specs  coa_documents
```

### 4.2 Table Definitions

#### `users` (self-managed auth)
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,            -- bcrypt hashed
  full_name TEXT NOT NULL,
  phone TEXT,
  default_address TEXT,
  default_city TEXT,
  default_postcode VARCHAR(5),
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
```

#### `sessions` (JWT refresh token tracking)
```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  refresh_token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sessions_token ON sessions(refresh_token);
CREATE INDEX idx_sessions_user ON sessions(user_id);
```

#### `products`
```sql
CREATE TABLE products (
  id TEXT PRIMARY KEY,                    -- e.g., 'evo-retat-kit'
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,              -- URL-friendly name
  price DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2),         -- For "was RM600, now RM500" display
  category TEXT NOT NULL CHECK (category IN (
    'Weight Management', 'Recovery', 'Performance',
    'Essentials', 'Anti-Aging', 'Bundles'
  )),
  description TEXT NOT NULL,
  short_description TEXT,                 -- For card previews
  image_url TEXT NOT NULL,
  gallery_urls TEXT[],                    -- Multiple product images
  badge TEXT,                             -- 'BEST SELLER', 'PRO BUNDLE', etc.
  is_new BOOLEAN DEFAULT FALSE,
  in_stock BOOLEAN DEFAULT TRUE,
  stock_quantity INTEGER DEFAULT 0,       -- Actual count (replaces boolean)
  low_stock_threshold INTEGER DEFAULT 5,  -- Alert when stock <= this
  weight_grams INTEGER,                  -- For shipping calculation
  features TEXT[] NOT NULL DEFAULT '{}',
  sort_order INTEGER DEFAULT 0,          -- Admin-controlled display order
  is_published BOOLEAN DEFAULT TRUE,     -- Draft vs. live
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `technical_specs`
```sql
CREATE TABLE technical_specs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT REFERENCES products(id) ON DELETE CASCADE,
  molecular_formula TEXT,
  molar_mass TEXT,
  research_focus TEXT,
  half_life TEXT,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `coa_documents`
```sql
CREATE TABLE coa_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  batch_number TEXT NOT NULL,
  purity TEXT NOT NULL,
  test_date DATE NOT NULL,
  pdf_url TEXT,                           -- Stored in Vercel Blob
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `orders`
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,      -- Human-readable: EVO-20260211-001
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Guest checkout support
  guest_name TEXT,
  guest_phone TEXT,
  guest_email TEXT,
  
  -- Shipping
  shipping_name TEXT NOT NULL,
  shipping_phone TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  shipping_city TEXT NOT NULL,
  shipping_postcode VARCHAR(5) NOT NULL,
  shipping_method TEXT DEFAULT 'standard',
  shipping_cost DECIMAL(10,2) NOT NULL DEFAULT 10.00,
  tracking_number TEXT,
  courier TEXT,                           -- 'J&T', 'PosLaju', 'Lalamove'
  
  -- Totals
  subtotal DECIMAL(10,2) NOT NULL,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending',        -- Order created, awaiting payment
    'paid',           -- Payment confirmed
    'processing',     -- Being packed
    'shipped',        -- Handed to courier
    'delivered',      -- Confirmed delivered
    'cancelled',      -- Order cancelled
    'refunded'        -- Refund processed
  )),
  
  -- Metadata
  notes TEXT,                             -- Admin notes
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ
);
```

#### `order_items`
```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,             -- Snapshot at time of purchase
  product_price DECIMAL(10,2) NOT NULL,   -- Snapshot at time of purchase
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  line_total DECIMAL(10,2) NOT NULL
);
```

#### `order_payments`
```sql
CREATE TABLE order_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  gateway TEXT NOT NULL CHECK (gateway IN ('toyyibpay', 'stripe', 'manual')),
  gateway_ref TEXT,                       -- ToyyibPay billCode / Stripe paymentIntent
  gateway_transaction_id TEXT,            -- Gateway's own transaction ID
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'MYR',
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending', 'success', 'failed', 'refunded'
  )),
  raw_response JSONB,                     -- Store full gateway callback for audit
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `blog_posts`
```sql
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,                  -- Markdown or HTML
  category TEXT,
  read_time TEXT,
  featured_image TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### `discount_codes` (Future)
```sql
CREATE TABLE discount_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,              -- e.g., 'EVO10'
  discount_type TEXT CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value DECIMAL(10,2) NOT NULL,
  min_order_amount DECIMAL(10,2) DEFAULT 0,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.3 Authorization (Application-Level)

> **Note:** Neon Postgres does not use Supabase-style RLS. Instead, authorization is enforced
> at the **API layer** (Vercel Serverless Functions) via middleware.

```typescript
// lib/middleware/auth.ts — used in every protected API route
import { jwtVerify } from 'jose';
import { prisma } from '../db';

export async function authenticate(req: Request) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) return null;

  const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
  const { payload } = await jwtVerify(token, secret);
  
  const user = await prisma.user.findUnique({ where: { id: payload.sub as string } });
  return user || null;
}

export function requireAuth(user: any) {
  if (!user) throw new Response('Unauthorized', { status: 401 });
}

export function requireAdmin(user: any) {
  requireAuth(user);
  if (user.role !== 'admin') throw new Response('Forbidden', { status: 403 });
}
```

**Access Control Matrix:**

| Resource | Public (no token) | Customer (JWT) | Admin (JWT + role) |
|---|---|---|---|
| `GET /api/products` | ✅ Read published | ✅ Read published | ✅ Read all |
| `POST /api/products` | ❌ | ❌ | ✅ Create |
| `PUT /api/products/:id` | ❌ | ❌ | ✅ Update |
| `GET /api/orders` | ❌ | ✅ Own orders only | ✅ All orders |
| `POST /api/orders` | ✅ Guest checkout | ✅ Auth checkout | ✅ |
| `GET /api/users` | ❌ | ❌ | ✅ All users |

---

## 5. API DESIGN

### 5.1 API Routes (Vercel Serverless Functions)

All API routes live under `/api/*` and are deployed as Vercel Serverless Functions.

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| **Products** | | | |
| `GET /api/products` | GET | Public | List published products (Drizzle query) |
| `GET /api/products/[slug]` | GET | Public | Single product by slug |
| `POST /api/products` | POST | Admin | Create product |
| `PUT /api/products/[id]` | PUT | Admin | Update product |
| **Auth** | | | |
| `POST /api/auth/register` | POST | Public | Register (bcrypt hash + JWT) |
| `POST /api/auth/login` | POST | Public | Login (verify hash + issue JWT) |
| `POST /api/auth/refresh` | POST | Public | Refresh access token |
| `GET /api/auth/me` | GET | Auth | Get current user profile |
| **Cart** | | | |
| Client-side `localStorage` + Zustand | — | — | Hybrid (no server cart) |
| **Orders** | | | |
| `POST /api/orders` | POST | Auth or Guest | Create order + deduct stock |
| `GET /api/orders` | GET | Auth | User's own orders |
| `GET /api/orders/[id]` | GET | Auth | Single order detail |
| **Payments** | | | |
| `POST /api/payments/create` | POST | Server | Create ToyyibPay bill |
| `POST /api/payments/webhook` | POST | ToyyibPay | Payment callback handler |
| **Admin** | | | |
| `GET /api/admin/orders` | GET | Admin | All orders (filtered) |
| `PUT /api/admin/orders/[id]` | PUT | Admin | Update status, tracking |
| `GET /api/admin/analytics` | GET | Admin | Revenue, top products |

### 5.2 Serverless Function: `POST /api/orders`

```
INPUT:
{
  items: [{ product_id, quantity }],
  shipping: { name, phone, address, city, postcode },
  guest_email?: string    // For guest checkout
}

LOGIC:
1. Validate all items exist and are in stock
2. Snapshot current prices from DB (prevent client-side price manipulation)
3. Calculate subtotal, shipping, total
4. Deduct stock quantities (atomic transaction)
5. Create order + order_items records
6. If payment gateway enabled: create ToyyibPay bill → return payment URL
7. If manual mode: return order confirmation + bank details

OUTPUT:
{
  order_id: "uuid",
  order_number: "EVO-20260211-001",
  payment_url: "https://toyyibpay.com/..."   // or null for manual
}
```

### 5.3 Serverless Function: `POST /api/payments/webhook`

```
INPUT: ToyyibPay POST callback
{
  refno, status, reason, billcode, order_id, amount, transaction_id
}

LOGIC:
1. Verify webhook signature / server-to-server verification
2. Find order by billcode reference
3. If status === '1' (success):
   a. Update order_payments.status = 'success'
   b. Update orders.status = 'paid', orders.paid_at = NOW()
   c. Send confirmation (WhatsApp API or email)
4. If status !== '1' (failed):
   a. Update order_payments.status = 'failed'
   b. Restore stock quantities

OUTPUT: HTTP 200 (acknowledge to ToyyibPay)
```

---

## 6. AUTHENTICATION & AUTHORIZATION

### 6.1 Auth Strategy

| Feature | Implementation |
|---|---|
| **Registration** | Email + password → bcrypt hash → store in `users` table |
| **Login** | Verify bcrypt hash → issue JWT (access + refresh tokens) |
| **Guest Checkout** | Yes — no account required, order linked by email/phone |
| **Account Merge** | If guest later signs up with same email, link past orders |
| **Admin Access** | `users.role = 'admin'` — checked in API middleware |
| **Session** | Short-lived JWT access token (15min) + long-lived refresh token (7d) |
| **Token Storage** | Access token in memory, refresh token in `httpOnly` cookie |
| **Password Hashing** | bcrypt (12 salt rounds) via `bcryptjs` |
| **JWT Library** | `jose` (lightweight, Edge-compatible) |

**Auth Implementation:**

```typescript
// api/auth/register.ts
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { db } from '../../lib/db';
import { users } from '../../lib/db/schema';

export async function POST(req: Request) {
  const { email, password, fullName, phone } = await req.json();

  // Hash password
  const passwordHash = await bcrypt.hash(password, 12);

  // Insert user
  const [user] = await db.insert(users).values({
    email,
    password_hash: passwordHash,
    full_name: fullName,
    phone,
  }).returning();

  // Issue JWT
  const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
  const token = await new SignJWT({ sub: user.id, role: user.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('15m')
    .sign(secret);

  return Response.json({ user: { id: user.id, email, fullName }, token });
}
```

### 6.2 Auth Flow

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  Guest User │────→│ Browse & Cart │────→│  Checkout   │
└─────────────┘     └──────────────┘     └──────┬──────┘
                                                 │
                                    ┌────────────┴────────────┐
                                    │                         │
                              [Has Account?]            [Guest Mode]
                                    │                         │
                               ┌────▼────┐              ┌────▼────┐
                               │  Login  │              │ Enter   │
                               │  First  │              │ Email + │
                               │         │              │ Phone   │
                               └────┬────┘              └────┬────┘
                                    │                         │
                                    └────────────┬────────────┘
                                                 │
                                          ┌──────▼──────┐
                                          │ Create Order │
                                          │ + Payment   │
                                          └─────────────┘
```

---

## 7. PAYMENT INTEGRATION

### 7.1 ToyyibPay (Primary — Malaysian Market)

**Why ToyyibPay:**
- Supports **FPX** (direct bank transfer — dominant payment method in Malaysia)
- Supports credit/debit cards
- Malaysian company, BNM regulated
- Low fees: ~1.5% per transaction
- Easy integration (REST API)

**Integration Flow:**
```
1. User clicks "Pay Now" on Cart page
2. Frontend calls API: POST /api/payments/create
3. Serverless Function:
   a. Creates ToyyibPay Bill via API
   b. Returns bill payment URL
4. Frontend redirects user to ToyyibPay hosted payment page
5. User completes payment (FPX / Card)
6. ToyyibPay sends webhook to: POST /api/payments/webhook
7. Serverless Function processes callback, updates order status via Drizzle
8. User is redirected to /order-confirmation/:orderId
```

**Required Credentials:**
```env
TOYYIBPAY_SECRET_KEY=xxxxxxxx
TOYYIBPAY_CATEGORY_CODE=xxxxxxxx
TOYYIBPAY_BASE_URL=https://toyyibpay.com    # Production
# TOYYIBPAY_BASE_URL=https://dev.toyyibpay.com  # Sandbox
```

### 7.2 Stripe (Future — International Expansion)

For when the business expands to accept international orders:
- Credit/Debit cards globally
- Apple Pay, Google Pay
- Better developer experience
- Higher fees for Malaysian transactions

### 7.3 Manual Bank Transfer (Fallback)

Keep the existing WhatsApp flow as a fallback for:
- Users who prefer manual transfer
- Edge cases where payment gateway is down
- Wholesale/institutional orders

---

## 8. ORDER MANAGEMENT SYSTEM

### 8.1 Order Lifecycle

```
┌──────────┐    Payment     ┌────────┐    Admin      ┌────────────┐
│ PENDING  │───Confirmed───→│  PAID  │───Action────→ │ PROCESSING │
└──────────┘                └────────┘               └─────┬──────┘
     │                                                     │
     │ (Timeout/Cancel)                              Ship + Tracking
     ▼                                                     │
┌───────────┐                                        ┌─────▼──────┐
│ CANCELLED │                                        │  SHIPPED   │
└───────────┘                                        └─────┬──────┘
                                                           │
                                                    Delivery Confirmed
                                                           │
                                                     ┌─────▼──────┐
                                                     │ DELIVERED  │
                                                     └────────────┘
```

### 8.2 Order Number Generation

Format: `EVO-YYYYMMDD-NNN`

```typescript
// Example: EVO-20260211-001
function generateOrderNumber(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const seq = await getNextSequence(date); // DB counter per day
  return `EVO-${date}-${String(seq).padStart(3, '0')}`;
}
```

### 8.3 Notifications

| Event | Channel | Recipient |
|---|---|---|
| Order Created | WhatsApp + Email | Customer + Admin |
| Payment Confirmed | WhatsApp + Email | Customer + Admin |
| Order Shipped + Tracking | WhatsApp + Email | Customer |
| Delivered | Email | Customer (with review request) |
| Low Stock Alert | WhatsApp | Admin |

---

## 9. INVENTORY MANAGEMENT

### 9.1 Stock Deduction Logic

```sql
-- Atomic stock deduction (prevents overselling with concurrent orders)
UPDATE products
SET stock_quantity = stock_quantity - $quantity
WHERE id = $product_id
  AND stock_quantity >= $quantity
RETURNING stock_quantity;

-- If no rows returned → insufficient stock → reject order
```

### 9.2 Stock Restoration

Triggered when:
- Payment fails (webhook callback status ≠ 1)
- Order is cancelled
- Admin manually restores stock

### 9.3 Low Stock Alerts

```sql
-- Postgres trigger: fires when stock hits threshold
CREATE OR REPLACE FUNCTION notify_low_stock()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.stock_quantity <= NEW.low_stock_threshold
     AND OLD.stock_quantity > OLD.low_stock_threshold THEN
    -- Insert into notifications table or call webhook
    PERFORM pg_notify('low_stock', json_build_object(
      'product_id', NEW.id,
      'product_name', NEW.name,
      'remaining', NEW.stock_quantity
    )::text);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_low_stock
AFTER UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION notify_low_stock();
```

---

## 10. SHIPPING & LOGISTICS

### 10.1 Shipping Zones & Rates

| Zone | Coverage | Rate | Estimated Delivery |
|---|---|---|---|
| **Zone A** | KL, Selangor (Klang Valley) | RM8 | Same-day / Next-day |
| **Zone B** | Peninsular Malaysia | RM12 | 2-3 business days |
| **Zone C** | East Malaysia (Sabah, Sarawak) | RM18 | 5-7 business days |
| **Free Shipping** | Orders ≥ RM300 | RM0 | Zone-dependent |

### 10.2 Zone Detection

```typescript
// Postcode-based zone detection
function getShippingZone(postcode: string): 'A' | 'B' | 'C' {
  const code = parseInt(postcode, 10);
  // KL & Selangor postcodes: 40000-68100
  if (code >= 40000 && code <= 68100) return 'A';
  // Sabah: 88000-91999, Sarawak: 93000-98999
  if ((code >= 88000 && code <= 91999) || (code >= 93000 && code <= 98999)) return 'C';
  // Everything else in Peninsular Malaysia
  return 'B';
}
```

### 10.3 Courier Integration (Phase 3)

| Courier | Use Case | API |
|---|---|---|
| **J&T Express** | Standard nationwide | J&T Open API |
| **PosLaju** | Nationwide fallback | EasyParcel aggregator |
| **Lalamove** | Same-day KL delivery | Lalamove API |
| **EasyParcel** | Aggregator for rate comparison | EasyParcel API |

---

## 11. ADMIN DASHBOARD

### 11.1 Admin Pages

| Page | Features |
|---|---|
| **Dashboard** | Today's orders, revenue, low stock alerts, charts |
| **Orders** | List all orders, filter by status, search by order#/customer |
| **Order Detail** | View items, update status, add tracking, print invoice |
| **Products** | CRUD products, manage images, set stock, toggle publish |
| **Customers** | View registered users, order history |
| **Analytics** | Revenue by day/week/month, top products, conversion rate |
| **Settings** | Shipping rates, payment keys, WhatsApp number, site config |

### 11.2 Admin Route Protection

```typescript
// Admin route guard
function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, profile } = useAuth();
  
  if (!user) return <Navigate to="/login" />;
  if (profile?.role !== 'admin') return <Navigate to="/" />;
  
  return <>{children}</>;
}
```

---

## 12. FRONTEND REFACTOR PLAN

### 12.1 New Dependencies

```json
{
  "dependencies": {
    "@tanstack/react-query": "^5.x",        // Server state management
    "zustand": "^4.x",                      // Client state (cart, auth)
    "react-hot-toast": "^2.x",              // Notifications
    "react-hook-form": "^7.x",              // Form handling
    "zod": "^3.x"                           // Schema validation
  },
  "devDependencies": {
    "prisma": "^5.x",                        // Prisma CLI (schema, migrations)
    "@prisma/client": "^5.x",               // Type-safe Prisma Client
    "@prisma/adapter-neon": "^5.x",          // Neon serverless adapter
    "@neondatabase/serverless": "^0.9.x",   // Neon serverless driver
    "@vercel/blob": "^0.22.x",              // File storage
    "bcryptjs": "^2.4.x",                   // Password hashing
    "jose": "^5.x"                           // JWT signing/verification
  }
}
```

### 12.2 New File Structure

```
peptides-malaysia/
├── api/                                   # Vercel Serverless Functions
│   ├── auth/
│   │   ├── register.ts                    # POST /api/auth/register
│   │   ├── login.ts                       # POST /api/auth/login
│   │   ├── refresh.ts                     # POST /api/auth/refresh
│   │   └── me.ts                          # GET  /api/auth/me
│   ├── products/
│   │   ├── index.ts                       # GET  /api/products
│   │   └── [slug].ts                      # GET  /api/products/:slug
│   ├── orders/
│   │   ├── index.ts                       # POST /api/orders (create)
│   │   └── [id].ts                        # GET  /api/orders/:id
│   ├── payments/
│   │   ├── create.ts                      # POST /api/payments/create
│   │   └── webhook.ts                     # POST /api/payments/webhook
│   └── admin/
│       ├── orders.ts                      # GET/PUT /api/admin/orders
│       ├── products.ts                    # POST/PUT /api/admin/products
│       └── analytics.ts                   # GET /api/admin/analytics
├── prisma/
│   ├── schema.prisma                      # Prisma schema (models, relations)
│   ├── migrations/                        # Auto-generated SQL migrations
│   └── seed.ts                            # Data seeding script
├── src/
│   ├── lib/
│   │   ├── db.ts                          # Prisma Client singleton
│   │   ├── middleware/
│   │   │   └── auth.ts                    # JWT verify + role check
│   │   ├── api.ts                         # Frontend fetch wrapper
│   │   └── utils/
│   │       ├── shipping.ts                # Zone/rate calculation
│   │       └── format.ts                  # Currency, date formatting
│   ├── hooks/
│   │   ├── useAuth.ts                     # Auth context hook
│   │   ├── useCart.ts                     # Zustand cart store
│   │   └── useProducts.ts                # React Query product hooks
│   ├── stores/
│   │   └── cartStore.ts                   # Zustand store (replaces App.tsx state)
│   ├── components/                        # Existing + new
│   │   ├── Navbar.tsx                     # + Auth button (Login/Profile)
│   │   ├── Footer.tsx
│   │   ├── AuthModal.tsx                  # NEW: Login/Register modal
│   │   └── OrderStatusBadge.tsx           # NEW: Status pill component
│   ├── pages/
│   │   ├── ... (existing pages)
│   │   ├── Login.tsx                      # NEW
│   │   ├── Register.tsx                   # NEW
│   │   ├── Account.tsx                    # NEW: Profile + order history
│   │   ├── OrderConfirmation.tsx          # NEW: Post-payment success
│   │   ├── Checkout.tsx                   # NEW: Replaces WhatsApp checkout
│   │   └── admin/                         # NEW: Admin panel
│   │       ├── AdminDashboard.tsx
│   │       ├── AdminOrders.tsx
│   │       ├── AdminProducts.tsx
│   │       └── AdminLayout.tsx
```

### 12.3 Key Refactors

| Current | Refactored To |
|---|---|
| `constants.ts` PRODUCTS array | `useProducts()` hook → `fetch('/api/products')` → React Query |
| `constants.ts` BLOG_POSTS array | `useBlogPosts()` hook → `fetch('/api/blog')` → React Query |
| `App.tsx` cart state (useState) | Zustand `cartStore.ts` (persisted) |
| `Cart.tsx` WhatsApp checkout | `Checkout.tsx` → `POST /api/orders` → ToyyibPay |
| `HashRouter` | `BrowserRouter` (for proper SEO + Vercel routing) |
| No auth | `AuthProvider` wrapping app, `useAuth()` hook (custom JWT) |
| No ORM | Prisma ORM with type-safe client → Neon Postgres |

### 12.4 Cart Store Migration

```typescript
// stores/cartStore.ts (Zustand)
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set(state => {
        const existing = state.items.find(i => i.id === item.id);
        if (existing) {
          return { items: state.items.map(i =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          )};
        }
        return { items: [...state.items, item] };
      }),
      removeItem: (id) => set(state => ({
        items: state.items.filter(i => i.id !== id)
      })),
      updateQuantity: (id, delta) => set(state => ({
        items: state.items.map(i =>
          i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
        )
      })),
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((acc, i) => acc + i.quantity, 0),
      subtotal: () => get().items.reduce((acc, i) => acc + i.price * i.quantity, 0),
    }),
    { name: 'evo-cart-storage' }
  )
);
```

---

## 13. INFRASTRUCTURE & DEPLOYMENT

### 13.1 Environment Variables

```env
# Neon Postgres
DATABASE_URL=postgresql://user:pass@ep-xxxx.ap-southeast-1.aws.neon.tech/evo_db?sslmode=require

# Auth
JWT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx   # 256-bit secret for HS256
JWT_REFRESH_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx   # Separate secret for refresh tokens

# ToyyibPay
TOYYIBPAY_SECRET_KEY=xxxxxxxx
TOYYIBPAY_CATEGORY_CODE=xxxxxxxx
TOYYIBPAY_BASE_URL=https://toyyibpay.com

# Vercel Blob
BLOB_READ_WRITE_TOKEN=vercel_blob_xxxxxxxx   # Auto-set by Vercel

# App Config (exposed to frontend via VITE_ prefix)
VITE_WHATSAPP_NUMBER=601133373941
VITE_APP_URL=https://peptidesmalaysia.com
VITE_API_URL=/api                             # Relative — same Vercel deployment
```

### 13.2 Neon + Prisma Client Setup

```typescript
// src/lib/db.ts — Prisma Client singleton
import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool } from '@neondatabase/serverless';

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const adapter = new PrismaNeon(pool);

// Prevent multiple instances in dev (hot reload)
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

```prisma
// prisma/schema.prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["driverAdapters"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id              String    @id @default(uuid())
  email           String    @unique
  passwordHash    String    @map("password_hash")
  fullName        String    @map("full_name")
  phone           String?
  defaultAddress  String?   @map("default_address")
  defaultCity     String?   @map("default_city")
  defaultPostcode String?   @map("default_postcode") @db.VarChar(5)
  role            String    @default("customer")
  emailVerified   Boolean   @default(false) @map("email_verified")
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")
  sessions        Session[]
  orders          Order[]

  @@map("users")
}

model Session {
  id           String   @id @default(uuid())
  userId       String   @map("user_id")
  refreshToken String   @unique @map("refresh_token")
  expiresAt    DateTime @map("expires_at")
  createdAt    DateTime @default(now()) @map("created_at")
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([refreshToken])
  @@index([userId])
  @@map("sessions")
}

model Product {
  id                String          @id
  name              String
  slug              String          @unique
  price             Decimal         @db.Decimal(10, 2)
  compareAtPrice    Decimal?        @map("compare_at_price") @db.Decimal(10, 2)
  category          String
  description       String
  shortDescription  String?         @map("short_description")
  imageUrl          String          @map("image_url")
  galleryUrls       String[]        @map("gallery_urls")
  badge             String?
  isNew             Boolean         @default(false) @map("is_new")
  inStock           Boolean         @default(true) @map("in_stock")
  stockQuantity     Int             @default(0) @map("stock_quantity")
  lowStockThreshold Int             @default(5) @map("low_stock_threshold")
  weightGrams       Int?            @map("weight_grams")
  features          String[]        @default([])
  sortOrder         Int             @default(0) @map("sort_order")
  isPublished       Boolean         @default(true) @map("is_published")
  createdAt         DateTime        @default(now()) @map("created_at")
  updatedAt         DateTime        @updatedAt @map("updated_at")
  techSpecs         TechnicalSpec[]
  coaDocuments      CoaDocument[]
  orderItems        OrderItem[]

  @@map("products")
}

model Order {
  id              String         @id @default(uuid())
  orderNumber     String         @unique @map("order_number")
  userId          String?        @map("user_id")
  guestName       String?        @map("guest_name")
  guestPhone      String?        @map("guest_phone")
  guestEmail      String?        @map("guest_email")
  shippingName    String         @map("shipping_name")
  shippingPhone   String         @map("shipping_phone")
  shippingAddress String         @map("shipping_address")
  shippingCity    String         @map("shipping_city")
  shippingPostcode String        @map("shipping_postcode") @db.VarChar(5)
  shippingMethod  String         @default("standard") @map("shipping_method")
  shippingCost    Decimal        @default(10.00) @map("shipping_cost") @db.Decimal(10, 2)
  trackingNumber  String?        @map("tracking_number")
  courier         String?
  subtotal        Decimal        @db.Decimal(10, 2)
  discountAmount  Decimal        @default(0) @map("discount_amount") @db.Decimal(10, 2)
  total           Decimal        @db.Decimal(10, 2)
  status          String         @default("pending")
  notes           String?
  createdAt       DateTime       @default(now()) @map("created_at")
  updatedAt       DateTime       @updatedAt @map("updated_at")
  paidAt          DateTime?      @map("paid_at")
  shippedAt       DateTime?      @map("shipped_at")
  deliveredAt     DateTime?      @map("delivered_at")
  user            User?          @relation(fields: [userId], references: [id], onDelete: SetNull)
  items           OrderItem[]
  payment         OrderPayment?

  @@map("orders")
}

// ... (OrderItem, OrderPayment, TechnicalSpec, CoaDocument, BlogPost, DiscountCode)
// Follow the same pattern with @map for snake_case table/column names
```

> 💡 **Bonus:** Run `npx prisma studio` to get a **free visual database browser** — perfect for managing orders and products without building an admin panel first.

### 13.3 Vercel Configuration

```json
// vercel.json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/((?!api/).*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "GET,POST,PUT,DELETE,OPTIONS" },
        { "key": "Access-Control-Allow-Headers", "value": "Content-Type, Authorization" }
      ]
    }
  ]
}
```

### 13.4 CI/CD Pipeline

```
Push to main → Vercel auto-deploy
                    ├── Build React SPA (Vite)
                    ├── Bundle /api/* as Serverless Functions
                    ├── Run Vitest (fail → block deploy)
                    └── Deploy to production CDN + Edge

DB Migrations → `npx prisma migrate deploy` (manual or GitHub Action)
Prisma Client → `npx prisma generate` (auto-runs on `prisma migrate`)
Neon Branching → Create branch per PR for safe schema testing
```

---

## 14. PHASED ROLLOUT

### Phase 1: Foundation (Week 1-2) 🟢
> **Goal:** Database + Product API + Auth. No changes to checkout yet.

- [ ] Create Neon Postgres project (AWS ap-southeast-1 for Malaysian latency)
- [ ] Install `prisma`, `@prisma/client`, `@prisma/adapter-neon`, `@neondatabase/serverless`
- [ ] Define Prisma schema (`prisma/schema.prisma`) for all models
- [ ] Run `prisma migrate dev` to create tables in Neon + generate client
- [ ] Write seed script to populate products from `constants.ts`
- [ ] Seed blog posts, COA data, tech specs
- [ ] Create `/api/products` Vercel Serverless Function
- [ ] Install `@tanstack/react-query` + `zustand` on frontend
- [ ] Create `useProducts()` hook — replace hardcoded `PRODUCTS` import
- [ ] Create `useBlogPosts()` hook — replace hardcoded `BLOG_POSTS` import
- [ ] Implement Zustand cart store (replace `App.tsx` state)
- [ ] Switch from `HashRouter` to `BrowserRouter`
- [ ] Install `bcryptjs` + `jose` for auth
- [ ] Create `/api/auth/register` and `/api/auth/login` Serverless Functions
- [ ] Add Login / Register pages
- [ ] Add auth button to Navbar
- [ ] Update & pass all existing tests
- [ ] **Keep WhatsApp checkout as-is** (no payment gateway yet)

**Deliverable:** Site looks identical but data is from Neon Postgres via Prisma. Users can register.

---

### Phase 2: Payments & Orders (Week 3-4) 🟡
> **Goal:** Real checkout flow with ToyyibPay. Orders recorded in DB.

- [ ] Create `POST /api/orders` Serverless Function (order creation + stock deduction)
- [ ] Create `POST /api/payments/create` Serverless Function (ToyyibPay bill creation)
- [ ] Create `POST /api/payments/webhook` Serverless Function (callback handler)
- [ ] Build `Checkout.tsx` page (replace WhatsApp-only flow)
- [ ] Build `OrderConfirmation.tsx` page 
- [ ] Build `Account.tsx` page (profile + order history)
- [ ] Implement stock deduction on order creation
- [ ] Implement stock restoration on payment failure
- [ ] Add dynamic shipping rate calculation (zone-based)
- [ ] Keep WhatsApp as secondary/fallback checkout option
- [ ] Test full payment flow with ToyyibPay sandbox
- [ ] Add order confirmation WhatsApp notification

**Deliverable:** Customers can pay online. Orders tracked in database.

---

### Phase 3: Admin Dashboard (Week 5-6) 🟠
> **Goal:** Admin can manage everything from the browser.

- [ ] Build `AdminLayout.tsx` with sidebar navigation
- [ ] Build `AdminDashboard.tsx` — revenue stats, recent orders, alerts
- [ ] Build `AdminOrders.tsx` — order list, status updates, tracking input
- [ ] Build `AdminProducts.tsx` — CRUD, image upload, stock management
- [ ] Implement product image upload to Vercel Blob Storage
- [ ] Implement COA PDF upload
- [ ] Add low-stock alert notifications
- [ ] Implement discount codes (optional)
- [ ] Add admin analytics: revenue charts, top products, conversion

**Deliverable:** Full admin control. No code changes needed to manage store.

---

### Phase 4: Polish & Scale (Week 7-8) 🔴
> **Goal:** Production-grade reliability and UX.

- [ ] Integrate courier tracking API (J&T / EasyParcel)
- [ ] Add email notifications (Resend)
- [ ] Add product reviews/ratings
- [ ] Implement search (full-text search via Postgres `tsvector`)
- [ ] Add SEO meta tags per product (Open Graph, structured data)
- [ ] Performance audit (Lighthouse, Core Web Vitals)
- [ ] Security audit (API auth middleware, input sanitization, rate limiting)
- [ ] Load testing (simulate 100 concurrent checkouts)
- [ ] Add Sentry error monitoring
- [ ] Production deployment with custom domain SSL

**Deliverable:** Production-ready, scalable e-commerce platform.

---

## 15. RISK ASSESSMENT

| Risk | Impact | Probability | Mitigation |
|---|---|---|---|
| ToyyibPay downtime | Orders can't be paid | Low | Keep WhatsApp/manual transfer as fallback |
| Overselling (concurrent orders) | Customer frustration | Medium | Atomic stock deduction with `WHERE qty >= N` |
| Neon free tier limits | 0.5GB storage, 100 hours compute | Low (at current scale) | Monitor usage; upgrade to Launch ($19/mo) when needed |
| Cart data loss (localStorage) | Lost sales | Medium | Zustand persist + server sync on login |
| Payment webhook missed | Order stuck as "pending" | Low | Cron job to reconcile pending orders > 1hr |
| Admin accidentally breaks data | Catalog errors | Medium | Soft-delete pattern, `is_published` flag, audit log |
| Price manipulation (client-side) | Revenue loss | High (currently!) | Server-side price lookup in `create-order` function |

### Critical Security Fix (Immediate)

> ⚠️ **Current vulnerability:** Prices are sent from the client-side cart.
> A malicious user could modify `localStorage` to set `price: 0` before checkout.
> **Fix:** The `POST /api/orders` Serverless Function must **always** look up the canonical price from the `products` table via Prisma, never trust the client.

---

## APPENDIX A: DATA MIGRATION SCRIPT

```typescript
// prisma/seed.ts
// Run via: npx prisma db seed
// Configure in package.json: "prisma": { "seed": "npx tsx prisma/seed.ts" }

import { PrismaClient } from '@prisma/client';
import { PRODUCTS, BLOG_POSTS, COA_DATA, TECHNICAL_SPECS } from '../constants';

const prisma = new PrismaClient();

async function seed() {
  console.log('🌱 Seeding Neon Postgres via Prisma...');

  // 1. Seed Products
  for (const p of PRODUCTS) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: {},
      create: {
        id: p.id,
        name: p.name,
        slug: p.id,
        price: p.price,
        category: p.category,
        description: p.description,
        imageUrl: p.image,
        badge: p.badge || null,
        isNew: p.isNew || false,
        inStock: p.inStock,
        stockQuantity: p.inStock ? 50 : 0,
        features: p.features,
        isPublished: true,
      },
    });
  }
  console.log(`✅ Seeded ${PRODUCTS.length} products`);

  // 2. Seed Technical Specs
  for (const s of TECHNICAL_SPECS) {
    const product = PRODUCTS.find(p => p.name.includes(s.name));
    await prisma.technicalSpec.create({
      data: {
        productId: product?.id || null,
        molecularFormula: s.formula,
        molarMass: s.mass,
        researchFocus: s.focus,
        halfLife: s.halfLife,
        category: s.category,
      },
    });
  }
  console.log(`✅ Seeded ${TECHNICAL_SPECS.length} technical specs`);

  // 3. Seed Blog Posts
  for (const b of BLOG_POSTS) {
    await prisma.blogPost.create({
      data: {
        title: b.title,
        slug: `post-${b.id}`,
        excerpt: b.excerpt,
        content: b.content,
        category: b.category,
        readTime: b.readTime,
        isPublished: true,
        publishedAt: new Date(),
      },
    });
  }
  console.log(`✅ Seeded ${BLOG_POSTS.length} blog posts`);

  // 4. Seed COA Documents
  for (const c of COA_DATA) {
    await prisma.coaDocument.create({
      data: {
        productName: c.productName,
        batchNumber: c.batchNumber,
        purity: c.purity,
        testDate: new Date(c.date),
      },
    });
  }
  console.log(`✅ Seeded ${COA_DATA.length} COA documents`);

  console.log('\n🎉 Seed complete!');
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

---

## APPENDIX B: ESTIMATED COSTS (Monthly)

| Service | Tier | Cost |
|---|---|---|
| Neon Postgres | Free (0.5GB, 100h compute) → Launch | RM0 → ~RM80/mo |
| Vercel | Hobby (Serverless Functions + Blob) | RM0 |
| ToyyibPay | Per-transaction (~1.5%) | Variable |
| Domain + SSL | Annual | ~RM50/year |
| **Total (Start)** | | **~RM0/mo** (free tiers) |
| **Total (Scale)** | | **~RM85/mo** + transaction fees |

---

*This document is the single source of truth for the Peptides Malaysia backend architecture. All implementation should reference this plan. Update this document as decisions evolve.*
