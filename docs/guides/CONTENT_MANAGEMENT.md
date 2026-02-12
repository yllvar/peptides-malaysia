# Content Management Guide

This guide explains how to manage the content of the **Peptides Malaysia - Evo™** platform, including products, blog posts, and technical certifications.

## 🛍️ Managing Products

Products are stored in the `products` table in the database. Each product can have multiple technical specifications and certificates of analysis (COA).

### Adding/Updating via Admin API
The platform provides admin-only endpoints for product management:
- **`POST /api/admin/products`**: Create a new product.
- **`PATCH /api/admin/products?id=...`**: Update an existing product.

### Key Fields
| Field | Description | Example |
|---|---|---|
| `id` | Unique identifier (slug-based) | `evo-retat-kit` |
| `price` | Selling price in RM | `500.00` |
| `stockQuantity` | Current inventory count | `50` |
| `category` | One of: `Weight Management`, `Recovery`, `Performance`, `Essentials`, `Anti-Aging`, `Bundles` | `Recovery` |
| `isPublished` | Whether the product is visible to customers | `true` |

---

## ✍️ Managing Blog Posts

Blog posts are stored in the `blog_posts` table. They appear on the "Education" page.

### Fields
- **`title`**: The headline of the post.
- **`slug`**: URL-friendly identifier.
- **`content`**: The main body (supports HTML/Markdown).
- **`isPublished`**: Use this to save drafts without making them public.

---

## 📜 Managing Certificates of Analysis (COA)

COAs are critical for building trust. They are linked to products and display available lab reports.

### Process
1.  **Upload PDF**: Upload the lab report PDF to a hosting service (e.g., Vercel Blob).
2.  **Add to Database**: Add an entry to the `coa_documents` table linking it to the specific `productId`.
3.  **Fields**:
    - `batchNumber`: The batch identifier (e.g., `EVO-RT-0092`).
    - `purity`: The laboratory-verified purity (e.g., `99.8%`).
    - `testDate`: When the test was performed.
    - `pdfUrl`: The link to the uploaded report.

---

## 🛠️ Direct Database Management

For quick data entry during early stages, you can use **Prisma Studio**:
```bash
npx prisma studio
```
This will open a visual editor at [http://localhost:5555](http://localhost:5555) where you can browse and edit all tables directly.

> **⚠️ Warning:** Be careful when editing IDs or deleting records in Prisma Studio, as this can break relationships (e.g., deleting a product that has active orders).
