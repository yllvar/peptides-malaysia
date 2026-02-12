# System Overview

**Peptides Malaysia - Evo™** is a full-stack e-commerce application serving the Malaysian market, specializing in research peptides and related supplies. It leverages Vercel's ecosystem for seamless deployment and scaling.

## 🏗️ Architecture

### High-Level Architecture
- **Frontend:** React SPA (Single Page Application) built with Vite.
- **Backend:** Serverless API Routes (Vercel Functions) running on Node.js.
- **Database:** Neon Serverless Postgres, managed via Prisma ORM.
- **Authentication:** Custom JWT implementation (bcrypt + jose) due to specific requirements (guest checkout + account merging).
- **Hosting:** Vercel (Frontend + Serverless Functions).

### Tech Stack

| Component | Technology | Version | Purpose |
|---|---|---|---|
| **Frontend** | React | 19.x | UI Library |
| **Styling** | Tailwind CSS | 4.x | Utility-first CSS |
| **State** | React Context + LocalStorage | - | Cart & User Session management |
| **Backend** | Vercel Functions | - | Serverless API endpoints |
| **Database** | PostgreSQL (Neon) | 16.x | Relational Data Store |
| **ORM** | Prisma | 6.x | Database Access & Schema Management |
| **Auth** | jose + bcryptjs | - | JWT signing & Password hashing |
| **Testing** | Vitest | 3.x | Unit & Integration testing |

### Directory Structure

```plaintext
/
├── api/                # API Routes (Vercel Functions)
│   ├── auth/           # Login, Register, Me
│   ├── checkout/       # Order creation, Webhooks
│   ├── products/       # Public listing, Admin management
│   └── ...
├── src/
│   ├── components/     # Reusable UI components
│   ├── lib/            # Shared utilities (db, auth, shipping)
│   └── pages/          # React route components
├── prisma/             # Database schema & migrations
├── public/             # Static assets
├── __tests__/          # Vitest test suites
├── docs/               # Documentation (YOU ARE HERE)
└── ...config files     # vite.config.ts, tailwind.config.ts, etc.
```

## 🔐 Key Patterns

### 1. **Stateless API**
All API routes are stateless. Authentication is handled via JWT Bearer tokens in the `Authorization` header. No server-side session store is used (except for refresh token tracking in the database).

### 2. **Guest & Authenticated Checkout**
The checkout flow supports both guest users (email + phone only) and registered users. Orders are linked via `user_id` (if logged in) or stored with guest details.

### 3. **Validation Strategy**
- **Frontend:** Immediate feedback for formatting (email, phone).
- **Backend:** Strict validation for business logic (stock levels, prices, enumerations) using Zod or manual checks.
- **Database:** Constraints (Foreign Keys, Unique Indexes) ensure data integrity.

### 4. **Testing Strategy**
- **Unit Tests:** Focus on API logic (`/api/*`), utility functions (`src/lib/utils`), and critical path components.
- **Integration:** APIs are tested against a mocked Prisma client to simulate database interactions without spinning up a real DB during test runs.
