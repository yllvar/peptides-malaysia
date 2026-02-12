# API Reference

This document provides a comprehensive overview of the RESTful API endpoints available in the **Peptides Malaysia - Evo™** backend.

## 🔐 Configuration

### Authentication
All protected routes require a Bearer Token in the `Authorization` header.
```
Authorization: Bearer <your_jwt_token>
```

### Base URL
- Development: `http://localhost:3000`
- Production: `https://peptides-malaysia.vercel.app` (Example)

---

## 🛍️ Public Endpoints

### Products
- **`GET /api/products`**
    - Returns all **published** products.
    - Includes `techSpecs` and `coaDocuments`.
    - **Response:** `200 OK` (Array of Product objects).

### Blog
- **`GET /api/blog`**
    - Returns all **published** blog posts.
    - **Response:** `200 OK` (Array of BlogPost objects).

---

## 👤 User Endpoints (Protected)

### Profile (`me`)
- **`GET /api/auth/me`**
    - **Auth:** Required (User/Admin)
    - Returns the currently authenticated user's profile.
    - **Response:** `200 OK` `{ user: { id, email, fullName, role } }`
    - **Errors:** `401 Unauthorized`, `404 User Not Found` (if deleted).

### Orders
- **`GET /api/orders`**
    - **Auth:** Required (User/Admin)
    - Returns the order history for the authenticated user.
    - **Response:** `200 OK` (Array of Order objects with related `items` and `payment`).
    - **Errors:** `401 Unauthorized`.

---

## 🛒 Checkout & Payments

### Checkout
- **`POST /api/checkout`**
    - **Auth:** Optional (Guest or User)
    - Creates a new order. Deducts stock. Initiates payment (if applicable).
    - **Body:** `{ items: [...], shippingInfo: {...}, userId?: string }`
    - **Logic:** Validate stock -> Update stock -> Create Order -> Create Payment Record -> Return Payment Link/Details.
    - **Response:** `200 OK` `{ orderId, paymentUrl? }`
    - **Errors:** `400 Bad Request` (Invalid payload, Out of Stock, Zero Quantity).

### Payment Webhook
- **`POST /api/checkout/webhook`**
    - **Auth:** None (ToyyibPay Server only, verified via signature/IP if implemented).
    - Receives payment status updates from ToyyibPay.
    - **Logic:** Find order -> Verify Status -> Update Order Status (Paid) -> Verify Amount.
    - **Dev Note:** Critical path for order fulfillment. Includes idempotency checks.

---

## 🛠️ Admin Endpoints (Protected: Role=Admin)

### Products Management
- **`GET /api/admin/products`**
    - Returns **all** products (including drafts).
- **`POST /api/admin/products`**
    - Create a new product.
    - **Body:** Product detailed object.
- **`PATCH /api/admin/products`** (Query param `?id=...` or Body `id`)
    - Update an existing product.
    - Specific logic for `techSpecs` (delete-then-create).
    - **Strict:** Filters disallowed fields (`role`, `passwordHash` injection attempts).
- **`DELETE /api/admin/products`** (Query param `?id=...`)
    - Delete a product.

### Order Management
- **`GET /api/admin/orders`**
    - Returns all orders in the system.
- **`PATCH /api/admin/orders`**
    - Update order status (e.g., `shipped`, `delivered`).
    - **Logic:** Sets `deliveredAt` timestamp automatically when status becomes `delivered`.
    - **Body:** `{ orderId, status, trackingNumber? }`

### Analytics
- **`GET /api/admin/analytics`**
    - Returns dashboard metrics: Total Revenue, Total Orders, Active Orders, Low Stock Alerts.
    - **Response:** `{ stats: {...}, recentOrders: [...], lowStockProducts: [...] }`
