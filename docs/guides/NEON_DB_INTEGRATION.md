# Neon Postgres Integration Guide for WhatsApp Bot (Railway)

> **Purpose:** This document provides the WhatsApp AI agent (FastAPI + Twilio + Gemini, deployed on Railway) with everything it needs to connect to and query the Evo Peptides production database hosted on **Neon Postgres**.

---

## 1. Connection Setup

### Environment Variable
Add this single variable to your Railway project:

```
DATABASE_URL=<your-neon-connection-string>
```

The connection string format is:
```
postgresql://<user>:<password>@<host>.neon.tech/<database>?sslmode=require
```

> **Important:** Use the same `DATABASE_URL` that the main Evo web application uses. This is a **read-only** connection for the bot — it should only `SELECT`, never `INSERT/UPDATE/DELETE`.

### Python Dependencies
```bash
pip install psycopg2-binary  # or asyncpg for async
```

### Connection Example (Python)
```python
import psycopg2
import os

def get_db_connection():
    return psycopg2.connect(os.environ["DATABASE_URL"])
```

For **async** with FastAPI:
```python
import asyncpg
import os

pool = None

async def init_db():
    global pool
    pool = await asyncpg.create_pool(os.environ["DATABASE_URL"])

async def get_db():
    return pool
```

---

## 2. Database Schema (Relevant Tables)

> **CRITICAL:** Prisma uses `@map()` to rename fields. The **actual SQL column names** use `snake_case`, NOT the camelCase from the Prisma schema. Always use the SQL names below.

### `orders` Table
| SQL Column          | Type           | Description                                      |
|---------------------|----------------|--------------------------------------------------|
| `id`                | `UUID (PK)`    | Internal order ID                                |
| `order_number`      | `VARCHAR (UQ)` | Public-facing order number (e.g., `EVO-12345678`)|
| `user_id`           | `UUID (FK)`    | Links to `users.id` (nullable for guests)        |
| `guest_name`        | `VARCHAR`      | Guest customer name (if not logged in)           |
| `guest_phone`       | `VARCHAR`      | Guest customer phone                             |
| `guest_email`       | `VARCHAR`      | Guest customer email                             |
| `shipping_name`     | `VARCHAR`      | Recipient name                                   |
| `shipping_phone`    | `VARCHAR`      | Recipient phone number                           |
| `shipping_address`  | `TEXT`         | Full shipping address                            |
| `shipping_city`     | `VARCHAR`      | City                                             |
| `shipping_postcode` | `VARCHAR(5)`   | Malaysian postcode                               |
| `shipping_method`   | `VARCHAR`      | `standard` (default)                             |
| `shipping_cost`     | `DECIMAL(10,2)`| Shipping fee (RM10 West MY, RM15 East MY)        |
| `tracking_number`   | `VARCHAR`      | Courier tracking ID (set after dispatch)         |
| `courier`           | `VARCHAR`      | Courier name (e.g., `J&T Express`, `Lalamove`)   |
| `subtotal`          | `DECIMAL(10,2)`| Sum of item prices before shipping               |
| `discount_amount`   | `DECIMAL(10,2)`| Discount applied                                 |
| `total`             | `DECIMAL(10,2)`| Final amount charged (subtotal + shipping - discount) |
| `status`            | `VARCHAR`      | Order status (see lifecycle below)               |
| `notes`             | `TEXT`         | Internal notes                                   |
| `created_at`        | `TIMESTAMP`    | Order creation time                              |
| `updated_at`        | `TIMESTAMP`    | Last modification time                           |
| `paid_at`           | `TIMESTAMP`    | When payment was confirmed                       |
| `shipped_at`        | `TIMESTAMP`    | When order was dispatched                        |
| `delivered_at`      | `TIMESTAMP`    | When order was delivered                         |

### `order_items` Table
| SQL Column      | Type           | Description                              |
|-----------------|----------------|------------------------------------------|
| `id`            | `UUID (PK)`    | Item line ID                             |
| `order_id`      | `UUID (FK)`    | Links to `orders.id`                     |
| `product_id`    | `UUID (FK)`    | Links to `products.id` (nullable)        |
| `product_name`  | `VARCHAR`      | Snapshot of product name at purchase time |
| `product_price` | `DECIMAL(10,2)`| Price per unit at purchase time          |
| `quantity`      | `INT`          | Number of units ordered                  |
| `line_total`    | `DECIMAL(10,2)`| `product_price * quantity`               |

### `order_payments` Table
| SQL Column               | Type           | Description                               |
|--------------------------|----------------|-------------------------------------------|
| `id`                     | `UUID (PK)`    | Payment record ID                         |
| `order_id`               | `UUID (FK,UQ)` | Links to `orders.id` (1:1 relation)       |
| `gateway`                | `VARCHAR`      | Payment gateway (`toyyibpay`)             |
| `gateway_ref`            | `VARCHAR`      | Gateway bill/reference code               |
| `gateway_transaction_id` | `VARCHAR`      | Transaction ID from gateway               |
| `amount`                 | `DECIMAL(10,2)`| Amount paid                               |
| `currency`               | `VARCHAR`      | Currency code (`MYR`)                     |
| `status`                 | `VARCHAR`      | Payment status (`pending`, `paid`, `failed`) |

### `products` Table
| SQL Column      | Type           | Description                              |
|-----------------|----------------|------------------------------------------|
| `id`            | `VARCHAR (PK)` | Product slug ID (e.g., `evo-retat-kit`)  |
| `name`          | `VARCHAR`      | Full product name                        |
| `price`         | `DECIMAL(10,2)`| Current price in RM                      |
| `category`      | `VARCHAR`      | Category name                            |
| `in_stock`      | `BOOLEAN`      | Availability flag                        |
| `stock_quantity`| `INT`          | Current stock count                      |
| `features`      | `TEXT[]`        | Array of feature strings                 |

---

## 3. Order Status Lifecycle

```
pending → paid → shipped → delivered
                ↘ cancelled
```

| Status      | Meaning                                               |
|-------------|-------------------------------------------------------|
| `pending`   | Order created, awaiting payment                       |
| `paid`      | Payment confirmed via ToyyibPay webhook               |
| `shipped`   | Dispatched by admin (tracking number assigned)        |
| `delivered` | Confirmed delivery                                    |
| `cancelled` | Order cancelled                                       |

---

## 4. Ready-to-Use SQL Queries

### Query 1: Lookup by Order Number
```sql
SELECT
    o.order_number,
    o.status,
    o.total,
    o.shipping_name,
    o.tracking_number,
    o.courier,
    o.created_at,
    o.shipped_at
FROM orders o
WHERE o.order_number ILIKE '%EVO-12345678%'
ORDER BY o.created_at DESC
LIMIT 3;
```

### Query 2: Lookup by Phone Number
```sql
SELECT
    o.order_number,
    o.status,
    o.total,
    o.shipping_name,
    o.tracking_number,
    o.courier,
    o.created_at,
    o.shipped_at
FROM orders o
WHERE o.shipping_phone LIKE '%123456789%'
ORDER BY o.created_at DESC
LIMIT 3;
```

> **Phone Normalization Tip:** Strip the user's phone of `+`, `-`, spaces before querying. If the input starts with `0` (e.g., `0123456789`), also try with `6` prefix (e.g., `60123456789`), and vice versa.

### Query 3: Get Order Items
```sql
SELECT
    oi.product_name,
    oi.quantity,
    oi.product_price,
    oi.line_total
FROM order_items oi
WHERE oi.order_id = '<order-uuid-from-query-1>';
```

### Query 4: Full Order Details (JOIN)
```sql
SELECT
    o.order_number,
    o.status,
    o.total,
    o.shipping_name,
    o.shipping_phone,
    o.shipping_city,
    o.tracking_number,
    o.courier,
    o.created_at,
    o.shipped_at,
    oi.product_name,
    oi.quantity,
    oi.product_price
FROM orders o
LEFT JOIN order_items oi ON oi.order_id = o.id
WHERE o.order_number = 'EVO-12345678'
ORDER BY o.created_at DESC;
```

### Query 5: Check Product Availability
```sql
SELECT name, price, in_stock, stock_quantity
FROM products
WHERE is_published = true
ORDER BY sort_order ASC;
```

---

## 5. Python Helper Functions

```python
import psycopg2
import os
import re

def get_connection():
    return psycopg2.connect(os.environ["DATABASE_URL"])

def normalize_phone(phone: str) -> str:
    """Strip non-digits and handle Malaysian +60 prefix."""
    digits = re.sub(r'\D', '', phone)
    # Remove leading '6' country code for flexible matching
    if digits.startswith('60'):
        digits = digits[2:]
    elif digits.startswith('0'):
        digits = digits[1:]
    return digits

def lookup_order_by_number(order_number: str) -> list:
    """Find orders by order number (partial match)."""
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT o.order_number, o.status, o.total, o.shipping_name,
                       o.tracking_number, o.courier, o.created_at, o.shipped_at
                FROM orders o
                WHERE o.order_number ILIKE %s
                ORDER BY o.created_at DESC LIMIT 3
            """, (f'%{order_number}%',))
            columns = [desc[0] for desc in cur.description]
            return [dict(zip(columns, row)) for row in cur.fetchall()]
    finally:
        conn.close()

def lookup_order_by_phone(phone: str) -> list:
    """Find orders by phone number (flexible matching)."""
    digits = normalize_phone(phone)
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT o.order_number, o.status, o.total, o.shipping_name,
                       o.tracking_number, o.courier, o.created_at, o.shipped_at
                FROM orders o
                WHERE o.shipping_phone LIKE %s
                ORDER BY o.created_at DESC LIMIT 3
            """, (f'%{digits}%',))
            columns = [desc[0] for desc in cur.description]
            return [dict(zip(columns, row)) for row in cur.fetchall()]
    finally:
        conn.close()

def get_order_items(order_id: str) -> list:
    """Get line items for a specific order."""
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT oi.product_name, oi.quantity, oi.product_price, oi.line_total
                FROM order_items oi
                WHERE oi.order_id = %s
            """, (order_id,))
            columns = [desc[0] for desc in cur.description]
            return [dict(zip(columns, row)) for row in cur.fetchall()]
    finally:
        conn.close()

def get_product_catalog() -> list:
    """Get all published products with stock info."""
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT name, price, category, in_stock, stock_quantity, features
                FROM products
                WHERE is_published = true
                ORDER BY sort_order ASC
            """)
            columns = [desc[0] for desc in cur.description]
            return [dict(zip(columns, row)) for row in cur.fetchall()]
    finally:
        conn.close()
```

---

## 6. Security Rules

1.  **READ-ONLY Access:** The bot should **NEVER** execute `INSERT`, `UPDATE`, or `DELETE`. It is strictly an observer.
2.  **No PII Exposure:** Never expose `user_id`, `guest_email`, or `shipping_address` directly to the user. Only use `shipping_name`, `order_number`, `status`, and `tracking_number` in responses.
3.  **Connection Pooling:** Use a connection pool (e.g., `asyncpg.create_pool`) to avoid exhausting Neon's connection limit.
4.  **SSL Required:** Neon requires SSL. The connection string includes `?sslmode=require`.

---

## 7. Railway Environment Setup

Add this to your Railway project's **Variables** tab:

| Variable       | Value                                              |
|----------------|----------------------------------------------------|
| `DATABASE_URL` | `postgresql://...@...neon.tech/...?sslmode=require` |

> Use the **same** `DATABASE_URL` from the Evo Peptides Vercel deployment. You can find it in the Neon dashboard or your `.env.local` file.

---

## 8. Example Bot Integration Flow

```
User: "Where is my order EVO-88219374?"

Bot Internal:
  1. Extract identifier: "EVO-88219374"
  2. Call lookup_order_by_number("EVO-88219374")
  3. Result: { order_number: "EVO-88219374", status: "shipped",
              shipping_name: "Dr. Farhan", tracking_number: "JT123456789MY",
              courier: "J&T Express" }
  4. Call get_order_items(order_id)
  5. Result: [{ product_name: "Retatrutide 20mg + BAC Water Kit", quantity: 1 }]

Bot Response:
  "Checking the ledger, Dr. Farhan... Your order EVO-88219374
   (1x Retatrutide 20mg Kit) has been dispatched via J&T Express!
   Tracking: JT123456789MY. Is there anything else?"
```

---

**End of Integration Guide**
