# Implementation Plan: Product Image Replacement & Standardization

This document outlines the steps to replace existing JPEG/JPG product images with new high-quality PNG images, while standardizing the naming convention and synchronizing the database.

## 1. Objectives
- Replace legacy product images with updated assets from `public/evo-product/`.
- Standardize naming convention to hyphen-separated lowercase (e.g., `evo-product-name.png`).
- Fix existing typos in asset filenames.
- Ensure the PostgreSQL database is synchronized with the new asset paths.

## 2. Image Asset Mapping

| Product Name | Current Path (`public/images/`) | New Path (Standardized) |
| :--- | :--- | :--- |
| Retatrutide 20mg Kit | `evo_retatrutide.jpg` | `evo-retatrutide.png` |
| Evo BPC-157 + TB-500 | `evo-bpc-tb.jpeg` | `evo-bpc-tb.png` |
| Evo GHK-Cu 100mg | `evo-ghk-cu.jpeg` | `evo-ghk-cu.png` |
| Evo PT-141 10mg | `evo-pt-141.jpeg` | `evo-pt-141.png` |
| Evo BAC Water | `evo_bac_water.jpg` | `evo-bac-water.png` |

## 3. Implementation Steps

### Step 1: Asset Consolidation & Standardization
1. **Move Assets**: Move all files from `public/evo-product/` to `public/images/`.
2. **Fix Typos**: Rename `evo-retatrudite.png` to `evo-retatrutide.png` (correcting "rudite" to "rutide").
3. **Verify**: Ensure all 5 new PNG files are present in `public/images/`.

### Step 2: Codebase Constants Update
Update the `PRODUCTS` array in `src/constants.ts` to point to the new PNG paths:
- `evo-retat-kit` image path -> `/images/evo-retatrutide.png`
- `evo-bpc-tb-blend` image path -> `/images/evo-bpc-tb.png`
- `evo-ghk-cu` image path -> `/images/evo-ghk-cu.png`
- `evo-pt-141` image path -> `/images/evo-pt-141.png`

### Step 3: Database Synchronization
Since the database seed script (`prisma/seed.ts`) uses the `PRODUCTS` array from `src/constants.ts` as its source of truth, run the following command:
```bash
npm run db:seed
```
This will perform an `upsert` operation on the `Product` table, updating the `imageUrl` column for all existing products.

### Step 4: Final Cleanup
Once the UI and Database are verified:
1. Delete the legacy files from `public/images/`:
   - `evo_retatrutide.jpg`
   - `evo-bpc-tb.jpeg`
   - `evo-ghk-cu.jpeg`
   - `evo-pt-141.jpeg`
   - `evo_bac_water.jpg`
   - `evo_retatrutide.jpg` (any variants)
2. Remove the now-empty `public/evo-product/` directory.

## 4. Verification Checklist
- [ ] New PNG images display correctly on the Shop page.
- [ ] Product detail pages show optimized assets.
- [ ] Database `imageUrl` column verified via Prisma Studio or SQL query.
- [ ] No "404 Not Found" errors in the browser console.
