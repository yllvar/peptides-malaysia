# Testing Strategy

This document outlines the testing philosophy, tools, and practices for the **Peptides Malaysia - Evo™** project. Our goal is to ensure stability, security, and correctness across all layers of the application.

## 🧪 Testing Pyramid

### 1. Unit Tests (Backend Logic)
**Tool:** `Vitest`
**Focus:** Serverless API logic (`/api/*`), Utility functions (`src/lib/*`), and Database interactions (mocked).
**Coverage Goal:** 100% path coverage for critical business logic (Payments, Auth, Stock Management).

### 2. Component Tests (React)
**Tool:** `Vitest` + `React Testing Library`
**Focus:** Rendering, User Interactions, Form Validation.
**Coverage Goal:** Key user flows (Add to Cart, Checkout Form).

### 3. End-to-End (E2E) Tests (Planned)
**Tool:** `Playwright` (To be implemented).
**Focus:** Full browser automation (Login -> Shop -> Checkout).

---

## 🛠️ How to Run Tests

### Run All Tests
```bash
npm run test
```
This executes all `*.test.ts` and `*.test.tsx` files in the `__tests__` directory.

### Run Specific Test File
```bash
npm run test specific_file.test.ts
```

### Watch Mode
```bash
npx vitest
```

---

## 🔍 Test Structure

Tests are located in the `__tests__` directory, mirroring the source structure where possible.

```plaintext
__tests__/
├── api/             # Backend API logic tests
│   ├── auth.test.ts
│   ├── checkout.test.ts
│   ├── products.test.ts
│   └── webhook.test.ts
├── utils/           # Shared utility logic tests
│   └── shipping.test.ts
├── pages/           # Frontend page component tests (e.g., Shop.test.tsx)
└── components/      # Reusable component tests
```

---

## 🛡️ Critical Safety Nets

The following areas **MUST** have robust test coverage before deployment:

### Checkout & Payments
- **Idempotency:** Webhook handlers must withstand duplicate requests.
- **Stock Management:** Preventing overselling (race conditions).
- **Validation:** Zero/Negative quantity checks.

### Authentication
- **Session Security:** Handling expired tokens, refresh logic.
- **Authorization:** Preventing unintended access (e.g., users accessing admin routes).

### Data Integrity
- **Database Constraints:** Respecting foreign keys and unique constraints.
- **Input Sanitization:** Stripping dangerous fields from update payloads (e.g., `role` injection).

---

## 📈 Coverage & Gap Analysis

We maintain a living document tracking known gaps and implementation status.
See: [Test Gaps Implementation Plan](./TEST_GAPS_IMPLEMENTATION.md)
