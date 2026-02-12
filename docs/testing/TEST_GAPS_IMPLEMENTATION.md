# Test Gaps Implementation Plan

> **Audit Date:** 2026-02-12
> **Current Test Count:** 120 tests across 15 files (all passing)
> **Gaps Identified:** ~44 untested scenarios across 5 untested endpoints + 28 edge cases in existing tests
> **Priority:** Security-critical gaps first, then data integrity, then coverage completeness

---

## Table of Contents

1. [Architecture Context](#1-architecture-context)
2. [Critical — Untested Endpoints](#2-critical--untested-endpoints)
3. [High — Checkout API Edge Cases](#3-high--checkout-api-edge-cases)
4. [High — Webhook Security & Idempotency](#4-high--webhook-security--idempotency)
5. [High — Auth Edge Cases](#5-high--auth-edge-cases)
6. [High — Admin Orders Edge Cases](#6-high--admin-orders-edge-cases)
7. [High — Admin Products Edge Cases](#7-high--admin-products-edge-cases)
8. [Medium — Shipping Utility Tests](#8-medium--shipping-utility-tests)
9. [Low — Store & Frontend Tests](#9-low--store--frontend-tests)
10. [Mock Patterns & Conventions](#10-mock-patterns--conventions)
11. [Implementation Checklist](#11-implementation-checklist)

---

## 1. Architecture Context

### Tech Stack
- **Runtime:** Vercel Serverless Functions (Node.js)
- **Framework:** Vite + React 19 (frontend), file-based API routes (backend)
- **Database:** PostgreSQL via Neon (serverless), accessed through Prisma ORM
- **Auth:** JWT (access + refresh tokens) via `jose` library, passwords hashed with `bcryptjs`
- **Payments:** ToyyibPay (Malaysian payment gateway)
- **Testing:** Vitest + Testing Library (React) + happy-dom/jsdom

### File Structure (API)
```
api/
├── admin/
│   ├── analytics/index.ts    → GET    (admin dashboard stats)
│   ├── orders/index.ts       → GET, PATCH (admin order management)
│   └── products/index.ts     → GET, POST, PATCH, DELETE (admin product CRUD)
├── auth/
│   ├── login/index.ts        → POST   (JWT login)
│   ├── me/index.ts           → GET    (token-based user fetch)
│   └── register/index.ts     → POST   (user registration)
├── blog/index.ts             → GET    (public blog listing)
├── checkout/
│   ├── index.ts              → POST   (order creation + ToyyibPay bill)
│   └── webhook/index.ts      → POST   (payment callback from ToyyibPay)
├── orders/index.ts           → GET    (user order history)
└── products/index.ts         → GET    (public product listing)
```

### File Structure (Tests)
```
__tests__/
├── api/
│   ├── admin_orders.test.ts   (4 tests)
│   ├── auth.test.ts           (7 tests — 4 login + 3 register)
│   ├── checkout.test.ts       (5 tests)
│   ├── products.test.ts       (7 tests — admin products CRUD)
│   └── webhook.test.ts        (3 tests)
├── app.test.tsx               (10 tests)
├── cart.test.tsx               (6 tests)
├── constants.test.ts          (20 tests)
├── contact.test.tsx           (7 tests)
├── education.test.tsx         (8 tests)
├── footer.test.tsx            (7 tests)
├── helpers.tsx                (test utilities)
├── navbar.test.tsx            (6 tests)
├── productDetail.test.tsx     (11 tests)
├── setup.ts                   (test setup)
├── shop.test.tsx              (8 tests)
└── staticPages.test.tsx       (11 tests)
```

### Auth Pattern (used by all protected endpoints)
Every admin endpoint follows this exact JWT verification pattern:
```typescript
const authHeader = request.headers.get('Authorization');
if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
}
const token = authHeader.split(' ')[1];
const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
try {
    const { payload } = await jwtVerify(token, secret);
    if (payload.role !== 'admin') {
        return Response.json({ error: 'Forbidden' }, { status: 403 });
    }
} catch (err) {
    return Response.json({ error: 'Invalid token' }, { status: 401 });
}
```

For user-scoped endpoints (e.g., `/api/orders`), the role check is skipped — only `payload.sub` (userId) is extracted.

### Prisma Mock Convention
All API tests mock `../../src/lib/db` with specific model methods:
```typescript
vi.mock('../../src/lib/db', () => ({
    prisma: {
        modelName: {
            findMany: vi.fn(),
            findUnique: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
            count: vi.fn(),
        },
        $transaction: vi.fn((promises) => Promise.all(promises)),
    },
}));
```

### JWT Token Helper
Reusable across admin tests:
```typescript
import { SignJWT } from 'jose';

const JWT_SECRET = 'test-secret';
process.env.JWT_SECRET = JWT_SECRET;

async function createToken(role: string = 'user') {
    const secret = new TextEncoder().encode(JWT_SECRET);
    return await new SignJWT({ sub: 'user-1', role })
        .setProtectedHeader({ alg: 'HS256' })
        .sign(secret);
}
```

---

## 2. Critical — Untested Endpoints

### 2a. `GET /api/products` — Public Product Listing

**Source:** `api/products/index.ts`
**Current Tests:** 0
**Risk:** Public-facing, no auth required. DB failures silently return 500.

**Source Code Logic:**
```typescript
const products = await prisma.product.findMany({
    where: { isPublished: true },
    include: { techSpecs: true, coaDocuments: true },
    orderBy: { sortOrder: 'asc' },
});
return Response.json(products);
```

**Test File:** `__tests__/api/public_products.test.ts`

**Tests to Write:**

| # | Test Name | Setup | Assertion |
|---|-----------|-------|-----------|
| 1 | should return only published products | Mock `findMany` → `[{ id: '1', isPublished: true }]` | Status 200, array returned, verify `where: { isPublished: true }` was passed |
| 2 | should return empty array when no products | Mock `findMany` → `[]` | Status 200, `[]` returned |
| 3 | should include techSpecs and coaDocuments | Mock `findMany` with nested data | Verify `include` has `techSpecs: true, coaDocuments: true` |
| 4 | should return 500 on database error | Mock `findMany` → `throw new Error('DB down')` | Status 500, error message returned |

**Mock Shape Required:**
```typescript
vi.mock('../../src/lib/db', () => ({
    prisma: {
        product: { findMany: vi.fn() }
    }
}));
```

---

### 2b. `GET /api/orders` — User Order History

**Source:** `api/orders/index.ts`
**Current Tests:** 0
**Risk:** Auth-protected. Returns user's orders. Missing auth = data leak.

**Source Code Logic:**
- Verifies JWT, extracts `userId` from `payload.sub`
- Queries `prisma.order.findMany({ where: { userId } })` with items + payment

**Test File:** `__tests__/api/user_orders.test.ts`

**Tests to Write:**

| # | Test Name | Setup | Assertion |
|---|-----------|-------|-----------|
| 1 | should return 401 if no auth header | No `Authorization` header | Status 401 |
| 2 | should return 401 for invalid/expired token | `Authorization: Bearer garbage` | Status 401 |
| 3 | should return user's orders | Valid token, mock orders | Status 200, orders array returned |
| 4 | should return empty array for user with no orders | Valid token, mock `findMany` → `[]` | Status 200, `[]` |
| 5 | should only query orders for the authenticated user | Valid token with `sub: 'user-1'` | `findMany` called with `where: { userId: 'user-1' }` |
| 6 | should return 500 on database error | Mock `findMany` → throw | Status 500 |

**Mock Shape Required:**
```typescript
vi.mock('../../src/lib/db', () => ({
    prisma: {
        user: { findUnique: vi.fn() },
        order: { findMany: vi.fn() }
    }
}));
```

**Important:** This endpoint does NOT check if the user exists — it trusts the JWT `sub` claim directly. This is fine since the token was issued at login, but worth noting.

---

### 2c. `GET /api/blog` — Public Blog Listing

**Source:** `api/blog/index.ts`
**Current Tests:** 0
**Risk:** Low — simple public listing. But DB errors should be handled.

**Test File:** `__tests__/api/blog.test.ts`

**Tests to Write:**

| # | Test Name | Setup | Assertion |
|---|-----------|-------|-----------|
| 1 | should return published blog posts | Mock `findMany` → posts | Status 200, verify `where: { isPublished: true }` |
| 2 | should return empty array when no posts | Mock `findMany` → `[]` | Status 200, `[]` |
| 3 | should return 500 on database error | Mock throw | Status 500 |

---

### 2d. `GET /api/auth/me` — Token-Based User Fetch

**Source:** `api/auth/me/index.ts`
**Current Tests:** 0
**Risk:** Medium — leaks user info if auth is broken. Also, deleted-user edge case.

**Source Code Logic:**
```typescript
const { payload } = await jwtVerify(token, secret);
const userId = payload.sub as string;
const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, fullName: true, role: true }
});
if (!user) return Response.json({ error: 'User not found' }, { status: 404 });
return Response.json({ user });
```

**Test File:** `__tests__/api/auth_me.test.ts`

**Tests to Write:**

| # | Test Name | Setup | Assertion |
|---|-----------|-------|-----------|
| 1 | should return 401 if no auth header | No header | Status 401 |
| 2 | should return 401 for invalid token | `Bearer invalid-token` | Status 401 |
| 3 | should return user data for valid token | Valid JWT, mock user | Status 200, user object with `id, email, fullName, role` |
| 4 | should return 404 if user was deleted | Valid JWT, mock `findUnique` → `null` | Status 404, `'User not found'` |
| 5 | should only select safe fields (no passwordHash) | Valid JWT, mock user | Verify `select` contains no `passwordHash` |

**Important Note:** The `me` endpoint uses `process.env.JWT_SECRET` (no `!` assertion), while `login` uses `process.env.JWT_SECRET!`. This means if `JWT_SECRET` is unset, `me` silently encodes with `undefined`, while `login` would throw. Consider testing this edge case.

---

### 2e. `GET /api/admin/analytics` — Dashboard Stats

**Source:** `api/admin/analytics/index.ts`
**Current Tests:** 0
**Risk:** Medium — admin-only but fresh code, untested aggregation logic.

**Source Code Logic:**
- AUTH: Same admin JWT pattern
- Queries: `order.findMany` (revenue), `order.count` (active), `product.findMany` (stock), `order.findMany` (recent 5), `order.count` (total)
- Aggregation: JavaScript `reduce` to sum `total` field for revenue

**Test File:** `__tests__/api/admin_analytics.test.ts`

**Tests to Write:**

| # | Test Name | Setup | Assertion |
|---|-----------|-------|-----------|
| 1 | should return 401 without auth | No header | Status 401 |
| 2 | should return 403 for non-admin | User token | Status 403 |
| 3 | should return correct stats | Mock orders + products | Correct `totalRevenue`, `activeOrders`, `lowStock`, `totalOrders` |
| 4 | should calculate revenue only from successful orders | Mix of paid/failed orders | Only paid/processing/shipped/delivered totals counted |
| 5 | should identify low stock products correctly | Products at and below threshold | `lowStock` count matches |
| 6 | should return at most 5 recent orders | Mock 10 orders | `recentOrders.length <= 5` (verified by `take: 5` in query) |
| 7 | should handle empty database | All mocks return `[]` / `0` | Stats all zero, empty arrays |

**Mock Shape Required:**
```typescript
vi.mock('../../src/lib/db', () => ({
    prisma: {
        order: {
            findMany: vi.fn(),
            count: vi.fn(),
        },
        product: {
            findMany: vi.fn(),
        },
    },
}));
```

**Revenue Calculation Detail:**
```typescript
// The code does:
const totalRevenue = successfulOrders.reduce((acc, order) => acc + Number(order.total), 0);
// 'total' is a Prisma Decimal. Number() conversion must be tested with realistic values like '208.00'
```

---

## 3. High — Checkout API Edge Cases

**Source:** `api/checkout/index.ts`
**Existing Tests:** 5 in `__tests__/api/checkout.test.ts`
**Add to existing file.**

### 3a. Product Not Found (404)

**Code Path (line 23-25):**
```typescript
const product = dbProducts.find(p => p.id === item.id);
if (!product) {
    return Response.json({ error: `Product ${item.id} not found` }, { status: 404 });
}
```

**Test:**
```
it('should return 404 if product does not exist in database')
```
- Setup: `prisma.product.findMany` returns `[]` (empty), but items has `[{ id: 'nonexistent', quantity: 1 }]`
- Assert: Status 404, error contains `'not found'`

---

### 3b. Zero/Negative Quantity

**⚠️ BUG: No validation exists** — the code accepts `quantity: 0` or `quantity: -1` silently.

**Test:**
```
it('should return 400 for zero quantity items')
it('should return 400 for negative quantity items')
```
- These tests will FAIL initially — they document a real bug.
- Setup: `items: [{ id: 'p1', quantity: 0 }]` or `quantity: -1`
- Assert: Status 400

**⚡ IMPLEMENTATION NOTE:** After writing the failing test, add this validation to `checkout/index.ts`:
```typescript
if (!item.quantity || item.quantity <= 0) {
    return Response.json({ error: 'Invalid quantity' }, { status: 400 });
}
```

---

### 3c. Guest vs. Authenticated Checkout

**Code Path (lines 51-54):**
```typescript
userId: userId || null,
guestName: !userId ? shippingInfo.fullName : undefined,
guestEmail: !userId ? shippingInfo.email : undefined,
guestPhone: !userId ? shippingInfo.phone : undefined,
```

**Tests:**
```
it('should store guest info when no userId provided')
it('should store userId and skip guest fields when userId provided')
```
- Setup 1: Order payload WITHOUT `userId` field
  - Assert: `prisma.order.create` called with `guestName`, `guestEmail`, `guestPhone` populated
- Setup 2: Order payload WITH `userId: 'user-1'`
  - Assert: `prisma.order.create` called with `userId: 'user-1'`, `guestName: undefined`

---

### 3d. Multi-Item Order

**Test:**
```
it('should correctly calculate subtotal for multi-item orders')
```
- Setup: Mock `findMany` → 3 products with different prices. Items: `[{ id: 'p1', qty: 2 }, { id: 'p2', qty: 1 }, { id: 'p3', qty: 3 }]`
- Assert: Correct `subtotal`, `shippingCost`, and `total` in `prisma.order.create` call

---

### 3e. Shipping Zone B and C

**Test:**
```
it('should calculate Zone B shipping (RM12) for postcode 70000')
it('should calculate Zone C shipping (RM18) for postcode 90000')
```
- Setup: Subtotal < RM300, postcodes in Zone B / Zone C ranges
- Assert: `shippingCost: 12` and `shippingCost: 18` respectively

---

### 3f. Missing Shipping Info Fields

**⚠️ BUG: No per-field validation.**
Current code only checks `!shippingInfo` as a whole. Missing `email` or `postcode` will silently pass.

**Test:**
```
it('should return 400 if shipping email is missing')
it('should return 400 if shipping postcode is missing')
```
- These tests will FAIL initially — they document a real bug.
- After test: add validation for required shipping fields.

---

## 4. High — Webhook Security & Idempotency

**Source:** `api/checkout/webhook/index.ts`
**Existing Tests:** 3 in `__tests__/api/webhook.test.ts`
**Add to existing file.**

### 4a. Order Not Found

**Code Path (lines 20-23):**
```typescript
const orderWithItems = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true }
});
// If null, stockUpdates = []. But prisma.order.update will throw RecordNotFound.
```

**Test:**
```
it('should return 500 when orderId does not exist in database')
```
- Setup: `findUnique` → `null`, `order.update` → throw `RecordNotFoundError`
- Assert: Status 500

---

### 4b. Duplicate Webhook (Idempotency)

**⚠️ BUG: Stock will be decremented multiple times.**

**Test:**
```
it('should not decrement stock if order is already paid (idempotency)')
```
- This test documents the bug: if webhook fires twice, stock is double-decremented.
- Setup: Mock `findUnique` returning order with `status: 'paid'` (already processed)
- Assert: `product.update` NOT called, or order status unchanged

**⚡ IMPLEMENTATION NOTE:** After writing the failing test, add this guard to `webhook/index.ts`:
```typescript
if (orderWithItems?.status === 'paid') {
    console.log(`Duplicate webhook for Order ${orderId}, skipping.`);
    return Response.json({ success: true });
}
```

---

### 4c. Unknown status_id Values

**Test:**
```
it('should handle unknown status_id values gracefully')
```
- Setup: `status_id: '3'` (pending from ToyyibPay)
- Assert: Currently falls into the `else` branch (treated as failure). Test should verify this behavior and document it.

---

### 4d. Webhook Signature Verification (Security)

**⚠️ SECURITY VULNERABILITY: No signature verification.**

**Context:** ToyyibPay does NOT send HMAC signatures by default. However, the webhook endpoint is publicly accessible. Anyone with the endpoint URL can forge payment confirmations.

**Test:**
```
it('should document that webhook has no signature verification (security note)')
```
- This is a documentation test — it asserts the current (insecure) behavior.

**⚡ IMPLEMENTATION NOTE:** A proper fix would add server-to-server verification:
```typescript
// After receiving webhook, verify by calling ToyyibPay's getBillTransactions API
const verifyResponse = await fetch(
    `https://toyyibpay.com/index.php/api/getBillTransactions?billCode=${billCode}`,
    { method: 'POST', body: new URLSearchParams({ billCode }) }
);
const txns = await verifyResponse.json();
const isVerified = txns.some(t => t.billpaymentStatus === '1');
```

---

## 5. High — Auth Edge Cases

**Source:** `api/auth/login/index.ts` + `api/auth/register/index.ts`
**Existing Tests:** 7 in `__tests__/api/auth.test.ts`
**Add to existing file.**

### 5a. Login — Empty String Credentials

**Code Path (line 9):** `if (!email || !password)` — empty strings are falsy in JS. ✅ Actually handled.
**BUT** — worth adding an explicit test to document this behavior:

**Test:**
```
it('should return 400 for empty string email/password')
```
- Setup: `{ email: "", password: "" }`
- Assert: Status 400

---

### 5b. Login — Database Error During Session Creation

**Test:**
```
it('should return 500 if session creation fails')
```
- Setup: Valid credentials, `bcrypt.compare` → true, but `prisma.session.create` → throw
- Assert: Status 500

---

### 5c. Register — Weak Password (Documentation Test)

**⚠️ BUG: No password strength validation.**

**Test:**
```
it('should accept any password length (no strength validation - documents current behavior)')
```
- Setup: `{ email: 'a@b.com', password: '1', fullName: 'Test' }`
- Assert: Status 200 (currently succeeds — this documents the gap)

---

### 5d. Register — Invalid Email Format (Documentation Test)

**⚠️ BUG: No email format validation.**

**Test:**
```
it('should accept invalid email format (no format validation - documents current behavior)')
```
- Setup: `{ email: 'not-an-email', password: 'pass', fullName: 'Test' }`
- Assert: Status 200 (currently succeeds — this documents the gap)

---

## 6. High — Admin Orders Edge Cases

**Source:** `api/admin/orders/index.ts`
**Existing Tests:** 4 in `__tests__/api/admin_orders.test.ts`
**Add to existing file.**

### 6a. GET — 401 Without Auth Header

**Test:**
```
it('should return 401 if no Authorization header')
```
- Setup: No headers on GET request
- Assert: Status 401

---

### 6b. PATCH — Delivered Status Sets deliveredAt

**Code Path (lines 75-76):**
```typescript
} else if (status === 'delivered') {
    updateData.deliveredAt = new Date();
}
```

**Test:**
```
it('should set deliveredAt when status is delivered')
```
- Setup: `{ orderId: 'o1', status: 'delivered' }`
- Assert: `prisma.order.update` called with `data` containing `deliveredAt: expect.any(Date)`

---

### 6c. PATCH — Invalid Status Value (Documentation Test)

**⚠️ BUG: No status enum validation.**

**Test:**
```
it('should accept arbitrary status values (no enum validation - documents current behavior)')
```
- Setup: `{ orderId: 'o1', status: 'banana' }`
- Assert: Status 200 (currently succeeds — documents the gap. Status column is a plain `String`, not an enum.)

---

### 6d. PATCH — Non-Existent Order

**Test:**
```
it('should return 500 if order does not exist')
```
- Setup: `prisma.order.update` → throw `RecordNotFoundError`
- Assert: Status 500

---

## 7. High — Admin Products Edge Cases

**Source:** `api/admin/products/index.ts`
**Existing Tests:** 7 in `__tests__/api/products.test.ts`
**Add to existing file.**

### 7a. PATCH — AllowedFields Filtering

**Code Path (lines 123-130):**
```typescript
const allowedFields = ['name', 'slug', 'price', ...];
allowedFields.forEach(field => {
    if (updateData[field] !== undefined) {
        cleanUpdateData[field] = updateData[field];
    }
});
```

**Test:**
```
it('should strip disallowed fields from update payload')
```
- Setup: `{ id: 'p1', name: 'OK', role: 'admin', createdAt: '2020-01-01' }` — `role` and `createdAt` are NOT in the allowlist
- Assert: `prisma.product.update` called with `data` containing ONLY `{ name: 'OK' }`, NOT `role` or `createdAt`

---

### 7b. PATCH — TechSpecs Update

**Code Path (lines 132-145):**
```typescript
if (techSpecs && Array.isArray(techSpecs)) {
    cleanUpdateData.techSpecs = {
        deleteMany: {},
        create: techSpecs.map(spec => ({ ... }))
    };
}
```

**Test:**
```
it('should handle techSpecs delete-and-recreate on update')
```
- Setup: `{ id: 'p1', techSpecs: [{ molecularFormula: 'C10H20', molarMass: '200' }] }`
- Assert: `prisma.product.update` called with `data.techSpecs` containing `deleteMany: {}` and `create: [{ molecularFormula: 'C10H20', ... }]`

---

### 7c. PATCH — Non-Existent Product

**Test:**
```
it('should return 500 if product does not exist')
```
- Setup: `prisma.product.update` → throw
- Assert: Status 500

---

### 7d. DELETE — Missing ID Query Param

**Test:**
```
it('should return 400 if no id query param provided on DELETE')
```
- Setup: `Request('http://localhost/api/admin/products')` — no `?id=` param
- Assert: Status 400, error contains `'required'`

---

### 7e. POST — Duplicate ID/Slug

**Test:**
```
it('should return 500 for duplicate product id')
```
- Setup: `prisma.product.create` → throw Prisma unique constraint error
- Assert: Status 500

---

## 8. Medium — Shipping Utility Tests

**Source:** `src/lib/utils/shipping.ts`
**Current Tests:** 0 (only indirectly tested through checkout)
**Test File:** `__tests__/utils/shipping.test.ts`

These are pure functions — no mocks needed.

### 8a. getShippingZone

| # | Test | Input | Expected |
|---|------|-------|----------|
| 1 | KL/Selangor boundary start | `'40000'` | `'A'` |
| 2 | KL/Selangor boundary end | `'68100'` | `'A'` |
| 3 | Just below Zone A | `'39999'` | `'B'` |
| 4 | Just above Zone A | `'68101'` | `'B'` |
| 5 | Peninsular Malaysia (other) | `'70000'` | `'B'` |
| 6 | Sabah start | `'88000'` | `'C'` |
| 7 | Sabah end | `'91999'` | `'C'` |
| 8 | Gap between Sabah/Sarawak | `'92000'` | `'B'` |
| 9 | Sarawak start | `'93000'` | `'C'` |
| 10 | Sarawak end | `'98999'` | `'C'` |
| 11 | Above Sarawak | `'99000'` | `'B'` |
| 12 | Invalid input (NaN) | `'abc'` | `'B'` |
| 13 | Empty string | `''` | `'B'` |
| 14 | Numeric leading zeros | `'01000'` | `'B'` |

### 8b. calculateShippingCost

| # | Test | Postcode | Subtotal | Expected |
|---|------|----------|----------|----------|
| 1 | Zone A, no free shipping | `'50000'` | 100 | 8 |
| 2 | Zone B, no free shipping | `'70000'` | 100 | 12 |
| 3 | Zone C, no free shipping | `'90000'` | 100 | 18 |
| 4 | Free shipping at exactly RM300 | `'90000'` | 300 | 0 |
| 5 | Free shipping above RM300 | `'90000'` | 500 | 0 |
| 6 | Not free at RM299.99 | `'90000'` | 299.99 | 18 |
| 7 | Zero subtotal | `'50000'` | 0 | 8 |

---

## 9. Low — Store & Frontend Tests

### 9a. Cart Store (`src/stores/cartStore.ts`)

Not yet reviewed in detail. Should test:
- Add item to cart
- Remove item from cart
- Update quantity (boundary: 0, negative, MAX)
- Clear cart
- Cart total calculation
- Persistence (if using localStorage)

### 9b. Auth Store (`src/stores/authStore.ts`)

Should test:
- Login state management
- Token storage/retrieval
- Logout clears state
- User role extraction

### 9c. Frontend Form Validation

Low priority since these are UI-level concerns, but consider:
- Checkout form: empty fields, invalid postcode format
- Login/Register forms: empty submit behavior

---

## 10. Mock Patterns & Conventions

### Creating Admin JWT Tokens
```typescript
import { SignJWT } from 'jose';

const JWT_SECRET = 'test-secret';
process.env.JWT_SECRET = JWT_SECRET;

async function createToken(role: string = 'user', userId: string = 'user-1') {
    const secret = new TextEncoder().encode(JWT_SECRET);
    return await new SignJWT({ sub: userId, role })
        .setProtectedHeader({ alg: 'HS256' })
        .sign(secret);
}
```

### Creating User JWT Tokens (for /api/orders, /api/auth/me)
Same as above but with `role: 'customer'` and specific `sub` userId.

### Mocking Global Fetch (for ToyyibPay)
```typescript
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Success:
mockFetch.mockResolvedValue({ json: async () => [{ BillCode: 'BILL123' }] });

// Error:
mockFetch.mockResolvedValue({ json: async () => ({ status: 'error' }) });
```

### Mocking Prisma Errors
```typescript
// Record not found:
(prisma.order.update as any).mockRejectedValue(
    new Error('Record to update not found.')
);

// Unique constraint:
(prisma.product.create as any).mockRejectedValue(
    new Error('Unique constraint failed on the fields: (`id`)')
);
```

### Request Helpers
```typescript
// JSON POST:
function createJsonRequest(url: string, body: object, headers: Record<string, string> = {}) {
    return new Request(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(body),
    });
}

// FormData POST (for webhooks):
function createFormDataRequest(url: string, fields: Record<string, string>) {
    const formData = new FormData();
    Object.entries(fields).forEach(([k, v]) => formData.append(k, v));
    return new Request(url, { method: 'POST', body: formData });
}
```

---

## 11. Implementation Checklist

### Phase 1: Security-Critical (Do First)
- [x] `__tests__/api/webhook.test.ts` — Idempotency test (4a-4d)
- [x] `api/checkout/webhook/index.ts` — Add idempotency guard
- [x] `__tests__/api/checkout.test.ts` — Zero/negative quantity tests (3b)
- [x] `api/checkout/index.ts` — Add quantity validation

### Phase 2: Untested Endpoints
- [x] `__tests__/api/public_products.test.ts` — All 4 tests (2a)
- [x] `__tests__/api/user_orders.test.ts` — All 6 tests (2b)
- [x] `__tests__/api/blog.test.ts` — All 3 tests (2c)
- [x] `__tests__/api/auth_me.test.ts` — All 5 tests (2d)
- [x] `__tests__/api/admin_analytics.test.ts` — All 7 tests (2e)

### Phase 3: Edge Cases in Existing Tests
- [x] Checkout: guest vs auth, multi-item, zone B/C, shipping validation (3c-3f)
- [x] Auth: empty strings, session failure, validation docs (5a-5d)
- [x] Admin Orders: 401, deliveredAt, invalid status, not found (6a-6d)
- [x] Admin Products: allowlist, techSpecs, not found, DELETE id, duplicate (7a-7e)

### Phase 4: Utility Tests
- [x] `__tests__/utils/shipping.test.ts` — All boundary tests (8a-8b)

### Phase 5: Store & Frontend (Optional)
- [ ] Cart store unit tests
- [ ] Auth store unit tests

### Phase 5: Store & Frontend (Optional)
- [ ] Cart store unit tests
- [ ] Auth store unit tests

---

## Expected Final Count

| Phase | New Tests |
|-------|-----------|
| Phase 1 | ~6 |
| Phase 2 | ~25 |
| Phase 3 | ~16 |
| Phase 4 | ~21 |
| Phase 5 | ~10+ |
| **Total New** | **~78** |
| **Grand Total** | **~198 tests** |

---

*Document generated 2026-02-12. Review and update as implementation progresses.*
