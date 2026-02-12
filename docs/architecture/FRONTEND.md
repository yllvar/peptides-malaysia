# Frontend Architecture

The **Peptides Malaysia - Evo™** frontend is a high-performance, single-page application (SPA) designed with a "Premium Sporty" aesthetic.

## 🏗️ Core Technologies

- **Framework:** React 19
- **Build Tool:** Vite 6
- **Styling:** Tailwind CSS 4 (Custom Config)
- **State Management:** Zustand (for global stores)
- **Data Fetching:** TanStack React Query (for API synchronization)
- **Routing:** React Router 7 (BrowserRouter)

## 📂 Directory Structure

```plaintext
src/
├── components/         # Reusable UI elements
│   ├── ui/             # Primitive components (Buttons, Inputs)
│   ├── admin/          # Components specific to the Admin Dashboard
│   └── layout/         # Navbar, Footer, and Wrappers
├── pages/              # Top-level route components
├── stores/             # Zustand stores (cart, auth)
├── hooks/              # Custom React hooks (useProducts, useOrders)
├── lib/                # Shared logic (i18n, utils, api-client)
└── types/              # TypeScript interfaces and types
```

## 🪄 State Management

### 1. **Cart Store (`zustand`)**
Manages the shopping cart state.
- **Persistence:** Automatically synced to `localStorage`.
- **Functions:** `addItem`, `removeItem`, `updateQuantity`, `clearCart`.

### 2. **Auth Store (`zustand`)**
Manages user authentication state.
- **Payload:** Stores current user info and JWT tokens.
- **Logic:** Handles login/logout and session restoration.

## 🎨 Styling System

We use **Tailwind CSS 4** with a dark-theme-first approach.
- **Primary Color:** `evo-orange` (#FF6B35 - approximate).
- **Secondary Colors:** `evo-black` (#0A0A0A), `evo-gray` (#1F1F1F).
- **Typography:**
    - Display: *Oswald* (for impact)
    - Body: *Inter* (for readability)

## 📡 Data Fetching (React Query)

API interactions are wrapped in custom hooks using `@tanstack/react-query`:
- **Caching:** Automatically caches product and blog data.
- **Loading/Error States:** Provides standardized states for UI feedback.
- **Prefetching:** Future enhancement to speed up navigation.

## 📱 Responsiveness

The application is **Mobile-First**.
- **Breakpoints:** Consistent use of `sm`, `md`, `lg`, `xl` Tailwind prefixes.
- **Navigation:** Mobile drawer menu for small screens.
- **Images:** Optimized with `object-cover` and aspect ratios maintained.
