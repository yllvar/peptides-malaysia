import { test, expect } from '@playwright/test';

test.describe('Robust Checkout & Payment Flow', () => {

    /**
     * Note on Mocking Strategy:
     * We use High-Fidelity API Mocking (Synthetic Seeding) because the local 'npm run dev' 
     * server only handles frontend assets. This approach allows us to test the frontend 
     * mapping logic using real production-ready data shapes without requiring 
     * a full serverless environment for every E2E run.
     */
    test.beforeEach(async ({ page }) => {
        // High-Fidelity API Mocking (Synthetic Seeding)
        // Since 'npm run dev' doesn't serve /api routes, we mock them with real project data.
        await page.route('**/api/products', async route => {
            const products = [
                {
                    id: 'evo-retat-kit',
                    name: 'Retatrutide 20mg Kit',
                    price: 580,
                    category: 'Weight Management',
                    imageUrl: '/images/evo-retatrutide.webp',
                    inStock: true,
                    isPublished: true,
                    features: ['99.9% Purity'],
                    techSpecs: [{ molarMass: '4731.33 g/mol', halfLife: '~6 Days', researchFocus: 'Triple-G Agonism' }]
                },
                {
                    id: 'evo-bpc-tb-blend',
                    name: 'BPC-157 + TB-500 Blend',
                    price: 350,
                    category: 'Recovery',
                    imageUrl: '/images/evo-bpc-tb.webp',
                    inStock: true,
                    isPublished: true,
                    features: ['Synergistic Recovery'],
                    techSpecs: []
                }
            ];
            await route.fulfill({ json: products });
        });

        // Mock Checkout API
        await page.route('**/api/checkout', async route => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ paymentUrl: 'https://dev.toyyibpay.com/fake-bill-code' })
            });
        });
    });

    /**
     * Scenario 1: Guest Checkout with Multiple Items
     */
    test('Happy Path: Guest Checkout with Multiple Items', async ({ page }) => {
        // 1. Visit Shop
        await page.goto('/shop');
        await page.waitForLoadState('networkidle');

        // Find the first product link explicitly
        const firstProductLink = page.locator('a[href*="/product/"]').first();
        await expect(firstProductLink).toBeVisible();

        // 2. Add first product
        await Promise.all([
            page.waitForURL(/\/product\//),
            firstProductLink.click({ force: true })
        ]);

        // Wait for product detail page to render
        await expect(page.locator('h1')).toBeVisible();
        await page.waitForLoadState('networkidle');

        const addButton = page.getByRole('button', { name: /ADD TO CART/i });
        await expect(addButton).toBeVisible();
        await addButton.click();

        // Check for badge update
        await expect(page.locator('nav a[href="/cart"] .bg-evo-orange')).toBeVisible();

        // 3. Add second product
        await page.goto('/shop');
        await page.waitForLoadState('networkidle');
        await Promise.all([
            page.waitForURL(/\/product\//),
            page.locator('div.grid a.group').nth(1).click({ force: true })
        ]);
        await expect(page.locator('h1')).toBeVisible();
        await page.waitForLoadState('networkidle');
        await page.getByRole('button', { name: /ADD TO CART/i }).click();
        await expect(page.locator('nav a[href="/cart"]').getByText('2')).toBeVisible();

        // 4. Go to Cart
        await page.goto('/cart');
        await expect(page.getByRole('heading', { name: /YOUR CART/i })).toBeVisible();

        // 5. Proceed to Checkout
        await page.getByRole('link', { name: /Proceed to Checkout/i }).click();
        await expect(page).toHaveURL(/\/checkout/);

        // 6. Fill Shipping Form
        await page.getByPlaceholder('Receiver Name').fill('Playwright Test User');
        await page.getByPlaceholder('researcher@example.com').fill('test@playwright.com');
        await page.getByPlaceholder('e.g. 0123456789').fill('0123456789');
        await page.getByPlaceholder(/Street name/i).fill('123 Test Street');
        await page.getByPlaceholder('City').fill('Test City');
        await page.getByPlaceholder('5-Digit Code').fill('50000');

        // 7. Click Settlement
        const settleBtn = page.getByRole('button', { name: /SECURE SETTLEMENT/i });
        await settleBtn.click();

        // Wait for redirect to ToyyibPay (Sandbox URL)
        await page.waitForURL(/.*toyyibpay\.com.*/, { timeout: 30000 });
    });

    /**
     * Scenario 2: ToyyibPay Callback Handling (Success)
     */
    test('Payment Success: Callback handling and Cart Clearing', async ({ page }) => {
        // Populate cart first
        await page.goto('/shop');
        await page.waitForLoadState('networkidle');
        const firstProductLink = page.locator('a[href*="/product/"]').first();
        await expect(firstProductLink).toBeVisible();

        await Promise.all([
            page.waitForURL(/\/product\//),
            firstProductLink.click({ force: true })
        ]);
        await page.waitForLoadState('networkidle');
        await page.getByRole('button', { name: /ADD TO CART/i }).click();
        await expect(page.locator('nav a[href="/cart"] .bg-evo-orange')).toBeVisible();

        // Simulate returning from payment gateway
        await page.goto('/payment/status?status_id=1&order_id=E2E-SUCCESS&billcode=BILL-E2E');

        // Verify Success UI
        await expect(page.getByText('PURCHASE COMPLETE')).toBeVisible();

        // Verify Cart is Cleared
        await page.goto('/shop');
        await expect(page.locator('nav a[href="/cart"] .bg-evo-orange')).not.toBeVisible();
    });

    /**
     * Scenario 3: ToyyibPay Callback Handling (Failure)
     */
    test('Payment Failure: Callback handling', async ({ page }) => {
        await page.goto('/payment/status?status_id=3&order_id=E2E-FAILED&billcode=BILLFAIL');
        await expect(page.getByText('PAYMENT FAILED')).toBeVisible();

        const tryAgainLink = page.getByRole('link', { name: /Try Again/i });
        await expect(tryAgainLink).toBeVisible();
        await tryAgainLink.click();
        await expect(page).toHaveURL(/.*\/checkout/);
    });

    /**
     * Scenario 4: ToyyibPay Pending/Validation Error
     */
    test('Payment Pending/Error: status_id=2 (Pending)', async ({ page }) => {
        await page.goto('/payment/status?status_id=2');
        await expect(page.getByText('PENDING VERIFICATION')).toBeVisible();
        await expect(page.getByRole('link', { name: /Return Home/i })).toBeVisible();
    });
});
