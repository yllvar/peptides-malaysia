import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
    test.beforeEach(async ({ page }) => {
        // Log intercepted requests for debugging if needed, but keeping it quiet for now
        await page.route('**/*', async route => {
            const request = route.request();
            if (request.url().includes('/api/products') && request.method() === 'GET') {
                const json = [
                    {
                        id: 'reta-1',
                        name: 'Evo Retatrutide 10mg',
                        price: 450,
                        category: 'Weight Management',
                        imageUrl: 'https://placehold.co/400x500/0a0a0a/white?text=Retatrutide',
                        inStock: true,
                        isPublished: true,
                        features: ['99.8% Purity'],
                    },
                    {
                        id: 'tirz-1',
                        name: 'Evo Tirzepatide 5mg',
                        price: 350,
                        category: 'Weight Management',
                        imageUrl: 'https://placehold.co/400x500/0a0a0a/white?text=Tirzepatide',
                        inStock: true,
                        isPublished: true,
                        features: ['99.5% Purity'],
                    }
                ];
                await route.fulfill({ json });
            } else if (request.url().includes('/api/checkout') && request.method() === 'POST') {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({ paymentUrl: 'https://dev.toyyibpay.com/FAKE-BILL' }),
                });
            } else {
                await route.continue();
            }
        });
    });

    test('should successfully complete a full purchase flow as a guest', async ({ page }) => {
        // 1. Visit Shop and add 2 products
        await page.goto('/shop');
        await expect(page.getByRole('heading', { name: /THE EVO/i })).toBeVisible();

        // Add Product 1
        await page.locator('div.grid a.group').first().click();
        await page.getByRole('button', { name: /ADD TO CART/i }).click();
        await expect(page.getByText(/ADDED TO CART/i)).toBeVisible();

        // Verify Navbar badge
        await expect(page.locator('a[href="/cart"] span.bg-evo-orange')).toHaveText('1');

        // Go back and add Product 2
        await page.goto('/shop');
        await page.locator('div.grid a.group').nth(1).click();
        await page.getByRole('button', { name: /ADD TO CART/i }).click();
        await expect(page.getByText(/ADDED TO CART/i)).toBeVisible();

        // Verify Navbar badge
        await expect(page.locator('a[href="/cart"] span.bg-evo-orange')).toHaveText('2');

        // 2. Go to Cart
        await page.locator('a[href="/cart"]').first().click();
        await expect(page.getByRole('heading', { name: /YOUR CART/i })).toBeVisible();
        await expect(page.getByRole('link', { name: /Proceed to Checkout/i })).toBeVisible();

        // 3. Proceed to Checkout
        await page.getByRole('link', { name: /Proceed to Checkout/i }).click();
        await expect(page.getByRole('heading', { name: /CHECKOUT/i })).toBeVisible();

        // 4. Fill Shipping Form
        await page.getByPlaceholder(/Receiver Name/i).fill('E2E Test User');
        await page.getByPlaceholder(/example\.com/i).fill('e2e@test.com');
        await page.getByPlaceholder(/0123456789/i).fill('01133373941');
        await page.getByPlaceholder(/Street name/i).fill('123 E2E Test Laboratory St');
        await page.getByPlaceholder(/5-Digit Code/i).fill('50000');
        await page.getByPlaceholder(/City/i).fill('Kuala Lumpur');

        // 5. Click Settlement and Verify Redirect to Mocked Gateway
        const settleButton = page.getByRole('button', { name: /INITIALIZE ORDER/i });
        await expect(settleButton).toBeVisible();
        await settleButton.click();

        // We expect a redirect to our mocked payment URL
        await page.waitForURL('**/FAKE-BILL');
    });

    test('should handle a successful payment redirect and clear the cart', async ({ page }) => {
        // 1. Visit Shop and add a product to populate cart
        await page.goto('/shop');
        await expect(page.getByRole('heading', { name: /THE EVO/i })).toBeVisible();
        await page.locator('div.grid a.group').first().click();
        await page.getByRole('button', { name: /ADD TO CART/i }).click();
        await expect(page.getByText(/ADDED TO CART/i)).toBeVisible();
        await expect(page.locator('a[href="/cart"] span.bg-evo-orange')).toHaveText('1');

        // 2. Simulate returning from ToyyibPay with a success status
        // ToyyibPay returns to /payment/status with status_id=1
        await page.goto('/payment/status?status_id=1&order_id=ORD-123TEST&billcode=BILL-TEST');

        // 3. Verify Success UI
        await expect(page.getByRole('heading', { name: /PURCHASE COMPLETE/i })).toBeVisible();
        await expect(page.getByText(/Order #23TEST/i)).toBeVisible();

        // 4. Verify Cart is Cleared (wait for state update)
        const cartBadge = page.locator('a[href="/cart"] span.bg-evo-orange');
        await expect(cartBadge).toBeHidden({ timeout: 10000 });
    });

    test('should handle a failed payment redirect', async ({ page }) => {
        await page.goto('/payment/status?status_id=3');
        await expect(page.getByRole('heading', { name: /PAYMENT FAILED/i })).toBeVisible();
        await expect(page.getByRole('link', { name: /Try Again/i })).toBeVisible();
    });
});
