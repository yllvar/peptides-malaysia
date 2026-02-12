# 🧪 Test Implementation Documentation — Peptides Malaysia (Evo™)

> **Status:** ✅ Fully Implemented  
> **Date:** 2026-02-11  
> **Framework:** Vitest 4 + React Testing Library + happy-dom  
> **Total Tests:** 101 | **10 Test Files** | **All Passing ✅**

---

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Getting Started](#getting-started)
3. [Test Infrastructure](#test-infrastructure)
4. [Test File Inventory](#test-file-inventory)
5. [Coverage Map](#coverage-map)
6. [Test Details by Module](#test-details-by-module)
7. [Running Tests](#running-tests)
8. [CI/CD Integration](#cicd-integration)
9. [Future Recommendations](#future-recommendations)

---

## Architecture Overview

```
__tests__/
├── setup.ts                  # Global setup: mocks window.open, localStorage, scrollTo
├── helpers.tsx               # Test utilities: renderWithRouter, createMockProduct, createMockCartItem
│
├── constants.test.ts         # Data integrity validation (20 tests)
├── app.test.tsx              # App integration + cart state management (10 tests)
├── navbar.test.tsx           # Navbar component (6 tests)
├── footer.test.tsx           # Footer component (7 tests)
├── shop.test.tsx             # Shop page: filters, products, wholesale (8 tests)
├── productDetail.test.tsx    # Product detail: tabs, cart, WhatsApp (11 tests)
├── cart.test.tsx              # Cart: validation, checkout, quantities (13 tests)
├── contact.test.tsx          # Contact form: fields, WhatsApp submit (7 tests)
├── education.test.tsx        # Education: blog posts, peptide calculator (8 tests)
└── staticPages.test.tsx      # 404, Lab Testing, Privacy, Terms (11 tests)
```

---

## Getting Started

### Prerequisites

All testing dependencies are installed:

```bash
# devDependencies (already in package.json)
vitest              # Test runner
@testing-library/react       # React component testing
@testing-library/jest-dom    # DOM assertions
@testing-library/user-event  # User interaction simulation
happy-dom           # Browser environment (ESM-compatible)
```

### Quick Run

```bash
npm run test           # Run all tests once
npm run test:watch     # Watch mode (re-run on file changes)
npm run test:coverage  # Generate coverage report
```

---

## Test Infrastructure

### `__tests__/setup.ts` — Global Test Setup

Mocks critical browser APIs that are unavailable in happy-dom:

| Mock | Purpose |
|------|---------|
| `window.open` | Intercepts WhatsApp redirects without opening browser windows |
| `window.scrollTo` | Prevents errors from the `ScrollToTop` component |
| `localStorage` | Full in-memory implementation with get/set/remove/clear |

All mocks are automatically reset between tests via `afterEach`.

### `__tests__/helpers.tsx` — Test Utilities

| Utility | Description |
|---------|-------------|
| `renderWithRouter(ui, routerProps?)` | Wraps component in `MemoryRouter` for testing routed pages |
| `createMockProduct(overrides?)` | Factory for creating test `Product` objects |
| `createMockCartItem(overrides?)` | Factory for creating test `CartItem` objects (Product + quantity) |

### `vite.config.ts` — Vitest Configuration

```typescript
test: {
  globals: true,                        // vi, describe, it, etc. available globally
  environment: 'happy-dom',             // ESM-compatible browser environment
  setupFiles: './__tests__/setup.ts',   // Run before each test file
  css: false,                           // Skip CSS processing for speed
  include: ['__tests__/**/*.test.{ts,tsx}'],
  coverage: {
    provider: 'v8',
    reporter: ['text', 'html', 'lcov'],
    include: ['pages/**', 'components/**', 'App.tsx', 'constants.ts'],
  },
}
```

---

## Test File Inventory

| # | File | Tests | Category | Key Tests |
|---|------|-------|----------|-----------|
| 1 | `constants.test.ts` | 20 | Data Integrity | Product IDs unique, WhatsApp format, COA batch patterns, categories |
| 2 | `app.test.tsx` | 10 | Integration | Mount, localStorage persistence, cart state management logic |
| 3 | `navbar.test.tsx` | 6 | Component | Brand, logo, nav links, cart badge, mobile toggle |
| 4 | `footer.test.tsx` | 7 | Component | Disclaimer, links, copyright year, location |
| 5 | `shop.test.tsx` | 8 | Page | Category filters, product grid, badges, wholesale section |
| 6 | `productDetail.test.tsx` | 11 | Page | Product display, tabs, addToCart, WhatsApp buy, breadcrumbs |
| 7 | `cart.test.tsx` | 13 | Page | Empty state, calculation, quantity controls, form validation, checkout |
| 8 | `contact.test.tsx` | 7 | Page | Form fields, WhatsApp redirect, contact info |
| 9 | `education.test.tsx` | 8 | Page | Blog posts, calculator defaults, concentration updates |
| 10 | `staticPages.test.tsx` | 11 | Page | 404, Lab Testing COA, Privacy, Terms |
| | **TOTAL** | **101** | | |

---

## Coverage Map

### Business Logic Coverage

| Feature | Covered | Tests |
|---------|---------|-------|
| Product catalog integrity | ✅ | Unique IDs, valid categories, local images, required fields |
| WhatsApp number validation | ✅ | Country code, length, digits-only |
| COA batch pattern validation | ✅ | `EVO-XX-XXXX` format, purity > 99% |
| Cart add/update/remove logic | ✅ | Increment existing, add new, min quantity = 1, remove by ID |
| Cart total calculation | ✅ | Subtotal, shipping (RM10 flat), grand total |
| Malaysian phone validation | ✅ | Must start with `60`, 11-13 digits |
| Malaysian postcode validation | ✅ | Must be exactly 5 digits |
| Checkout form validation | ✅ | Empty fields, invalid phone, invalid postcode, error clearing |
| WhatsApp checkout redirect | ✅ | Correct URL, pre-filled order message |
| localStorage persistence | ✅ | Load on mount, graceful error handling |
| Peptide calculator | ✅ | Default values, concentration formula, dosage units |

### Component Coverage

| Component | Rendered | Interactive | Edge Cases |
|-----------|----------|-------------|------------|
| `Navbar` | ✅ Brand, logo, links | ✅ Mobile toggle | ✅ Cart badge 0 vs N |
| `Footer` | ✅ All sections | N/A | ✅ Dynamic year |
| `Home` | ✅ (via App) | N/A | N/A |
| `Shop` | ✅ All products | ✅ Category filters | ✅ Empty category |
| `ProductDetail` | ✅ Info, image, features | ✅ Tabs, addToCart, WhatsApp | ✅ Not found state |
| `Cart` | ✅ Items, form, summary | ✅ +/-, remove, checkout | ✅ Empty cart, validation |
| `Contact` | ✅ Form, channels | ✅ Form submit → WhatsApp | ✅ All inputs |
| `Education` | ✅ Blog posts, calculator | ✅ Calculator inputs | ✅ Default values |
| `LabTesting` | ✅ COA table | ✅ Request PDF buttons | N/A |
| `NotFound` | ✅ 404 message | ✅ Return to base link | N/A |
| `Privacy` | ✅ All sections | N/A | N/A |
| `Terms` | ✅ Warning, sections | N/A | N/A |

---

## Test Details by Module

### 1. `constants.test.ts` — Data Integrity (20 tests)

**Purpose:** Validates all static data used across the site, preventing broken product catalogs, invalid phone numbers, and corrupted COA records.

```
✅ WHATSAPP_NUMBER — non-empty, starts with 60, 11-13 digits, digits-only
✅ CURRENCY — is set to RM
✅ PRODUCTS — ≥6 products, required fields, unique IDs, valid categories, local images, isNew products, badge products
✅ BLOG_POSTS — ≥3 posts, required fields, unique IDs
✅ COA_DATA — ≥3 entries, required fields, EVO-XX-XXXX pattern, purity ≥99%
```

### 2. `cart.test.tsx` — Cart & Checkout (13 tests)

**Purpose:** Most critical test file — validates the entire checkout flow including form validation with Malaysian format rules.

```
Empty Cart:
  ✅ Shows empty state with "Browse Shop" link

Cart with Items:
  ✅ Displays all cart items by name
  ✅ Calculates subtotal correctly (price × quantity)
  ✅ Displays RM10 flat-rate shipping
  ✅ Calculates total (subtotal + shipping)
  ✅ Calls removeFromCart when Remove clicked
  ✅ Calls updateQuantity(+1) when + clicked
  ✅ Calls updateQuantity(-1) when - clicked

Form Validation:
  ✅ Error on empty fields
  ✅ Error for invalid phone (must be 60XXXXXXXXX)
  ✅ Error for invalid postcode (must be 5 digits)
  ✅ Opens WhatsApp with correct URL on valid submission
  ✅ Clears error when user types in a field
```

### 3. `productDetail.test.tsx` — Product Detail (11 tests)

**Purpose:** Validates the product display, tab system, and purchase actions.

```
✅ Shows "Product not found" for invalid ID
✅ Renders product name (via heading role) and price
✅ Renders product image with correct src
✅ Renders all product features/specifications
✅ Has ADD TO CART and BUY VIA WHATSAPP buttons
✅ Calls addToCart callback with correct product data
✅ Opens WhatsApp with product name in message

Tabs:
  ✅ Shows DESCRIPTION tab content by default
  ✅ Switches to RECONSTITUTION tab
  ✅ Shows COA data on LAB DATA tab
  ✅ Displays breadcrumbs (Home / Shop / Product)
```

### 4. `app.test.tsx` — Integration & Cart Logic (10 tests)

```
Integration:
  ✅ App renders without crashing
  ✅ Renders the Navbar brand
  ✅ Renders the Footer
  ✅ Loads cart from localStorage on mount
  ✅ Handles corrupted localStorage gracefully

Cart State Management (Unit):
  ✅ addToCart increments quantity for existing items
  ✅ addToCart adds new items to cart
  ✅ updateQuantity enforces minimum of 1
  ✅ removeFromCart removes the correct item
  ✅ totalItems sums all quantities
```

---

## Running Tests

### Commands

```bash
# Run all tests
npm run test

# Watch mode (development)
npm run test:watch

# With coverage report
npm run test:coverage

# Run a specific test file
npx vitest run __tests__/cart.test.tsx

# Run tests matching a pattern
npx vitest run -t "Cart"
```

### Expected Output

```
 ✓ __tests__/constants.test.ts (20 tests)
 ✓ __tests__/app.test.tsx (10 tests)
 ✓ __tests__/navbar.test.tsx (6 tests)
 ✓ __tests__/footer.test.tsx (7 tests)
 ✓ __tests__/shop.test.tsx (8 tests)
 ✓ __tests__/productDetail.test.tsx (11 tests)
 ✓ __tests__/cart.test.tsx (13 tests)
 ✓ __tests__/contact.test.tsx (7 tests)
 ✓ __tests__/education.test.tsx (8 tests)
 ✓ __tests__/staticPages.test.tsx (11 tests)

 Test Files  10 passed (10)
      Tests  101 passed (101)
```

---

## CI/CD Integration

### Vercel Pre-Build Hook

Add to `package.json` scripts:

```json
"vercel-build": "npm run test && vite build"
```

### GitHub Actions (Optional)

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run test
```

---

## Future Recommendations

### Priority 1: Visual Regression Testing
- Tool: **Playwright** or **Storybook + Chromatic**
- Scope: Screenshot tests for the premium dark theme across responsive breakpoints

### Priority 2: End-to-End Testing
- Tool: **Playwright**
- Scenarios:
  - Full checkout flow: Browse → Add to Cart → Fill Form → WhatsApp redirect
  - Category filtering on Shop page
  - Navigation across all routes
  - Mobile responsive behavior

### Priority 3: Performance Testing
- Tool: **Lighthouse CI**
- Metrics: LCP, CLS, FID for key pages (Home, Shop, Product Detail)

### Priority 4: Accessibility Testing
- Tool: **axe-core** via `@testing-library/jest-dom`
- Scope: WCAG 2.1 AA compliance for all interactive elements

### Priority 5: Snapshot Testing
- Usefulness: Detect unintended visual changes in component markup
- Files: All components and pages can benefit from `toMatchSnapshot()`

---

## Design Decisions

1. **happy-dom over jsdom**: `jsdom@28` requires Node ≥20 and has ESM compatibility issues with Node 18. `happy-dom` is faster and fully ESM-compatible.

2. **Routes wrapper for useParams**: `ProductDetail` uses `useParams()` which requires a `<Routes>/<Route>` context, not just `MemoryRouter`. Our test helper wraps it properly.

3. **getAllByText for duplicates**: Several texts (brand name, category labels, prices) appear multiple times across Navbar + Footer + product cards. Tests use `getAllByText` or `getByRole` with specificity.

4. **Direct DOM queries for Contact form**: The email input (`type="email"`) doesn't appear as `role="textbox"` in the accessibility tree. We use `document.querySelector('input[name="email"]')` for reliability.

5. **Cart state as unit tests**: The `addToCart`, `updateQuantity`, and `removeFromCart` logic is tested as pure functions to validate arithmetic correctness independently of React rendering.
