import { test, expect } from '@playwright/test';

test.describe('Product & Shopping Flow', () => {

    test.beforeEach(async ({ page }) => {
        // Mock Products API
        await page.route('**/api/products', async route => {
            await route.fulfill({
                status: 200,
                json: [
                    {
                        id: 'evo-retat-kit',
                        name: 'Retatrutide 20mg Kit',
                        price: 580,
                        category: 'Weight Management',
                        imageUrl: '/images/evo-retatrutide.webp',
                        inStock: true,
                        badge: 'BESTSELLER',
                        isNew: true,
                        description: 'A cutting-edge research isotope.',
                        features: ['20mg Lyophilized', '99.9% Purity'],
                        techSpecs: [{
                            molarMass: '1419.5',
                            halfLife: '~4-6 Hours',
                            researchFocus: 'Weight Management',
                            molecularFormula: 'C62H98N16O22'
                        }],
                        coaDocuments: [{
                            id: 'coa1',
                            batchNumber: 'EVO-RET-001',
                            purity: '99.9%'
                        }]
                    },
                    {
                        id: 'evo-bpc-157',
                        name: 'BPC-157 5mg',
                        price: 180,
                        category: 'Recovery',
                        imageUrl: '/images/evo-bpc157.webp',
                        inStock: true,
                        description: 'Stable gastric pentadecapeptide.',
                        features: ['5mg Lyophilized'],
                    }
                ]
            });
        });
    });

    test('Shop: Display products and filter by category', async ({ page }) => {
        await page.goto('/shop');

        await expect(page.getByText('Retatrutide 20mg Kit')).toBeVisible();
        await expect(page.getByText('BPC-157 5mg')).toBeVisible();

        // Filter by Recovery
        await page.getByRole('button', { name: 'Recovery' }).click();

        await expect(page.getByText('BPC-157 5mg')).toBeVisible();
        await expect(page.getByText('Retatrutide 20mg Kit')).not.toBeVisible();

        // URL should reflect category
        await expect(page).toHaveURL(/.*category=Recovery/);
    });

    test('Product Detail: View full details and tabs', async ({ page }) => {
        await page.goto('/product/evo-retat-kit');

        await expect(page.locator('h1')).toContainText('Retatrutide 20mg Kit');
        await expect(page.getByText('RM580.00')).toBeVisible();

        // Check features
        await expect(page.getByText('20mg Lyophilized')).toBeVisible();

        // Check tabs
        await page.getByRole('button', { name: 'TECHNICAL DATA' }).click();
        await expect(page.getByText('1419.5')).toBeVisible();
        await expect(page.getByText('C62H98N16O22')).toBeVisible();

        await page.getByRole('button', { name: 'LAB DATA (COA)' }).click();
        await expect(page.getByText('EVO-RET-001')).toBeVisible();
    });

    test('Product Detail: Add to cart', async ({ page }) => {
        await page.goto('/product/evo-retat-kit');

        const cartBadge = page.locator('nav a[href="/cart"] .bg-evo-orange');
        await expect(cartBadge).not.toBeVisible();

        await page.getByRole('button', { name: /ADD TO CART/i }).click();

        await expect(page.getByText('ADDED TO CART!')).toBeVisible();
        await expect(cartBadge).toBeVisible();
        await expect(cartBadge).toHaveText('1');
    });

    test('Product Detail: Out of Stock handling', async ({ page }) => {
        await page.route('**/api/products', async route => {
            await route.fulfill({
                status: 200,
                json: [
                    {
                        id: 'out-of-stock',
                        name: 'Sold Out Item',
                        price: 100,
                        category: 'Performance',
                        imageUrl: '/img.webp',
                        image: '/img.webp',
                        inStock: false,
                        isPublished: true,
                        description: 'N/A',
                        features: []
                    }
                ]
            });
        });

        await page.goto('/shop');
        await expect(page.getByText('Depleted')).toBeVisible();
    });
});
