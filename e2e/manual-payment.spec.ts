import { test, expect } from '@playwright/test';

test.describe('Manual Payment Flow (Human-Touch)', () => {
    test.beforeEach(async ({ page }) => {
        // Mock Product Data
        await page.route('**/api/products', async route => {
            await route.fulfill({
                json: [{
                    id: 'reta-1',
                    name: 'Evo Retatrutide 10mg',
                    price: 450,
                    inStock: true,
                    isPublished: true,
                    imageUrl: 'https://placehold.co/400x500/0a0a0a/white?text=Retatrutide',
                    category: 'Weight Management',
                    features: ['99.8% Purity'],
                }]
            });
        });

        // Mock Checkout API for Manual Payment
        await page.route('**/api/checkout', async route => {
            const request = route.request();
            if (request.method() === 'POST') {
                const body = JSON.parse(request.postData() || '{}');
                if (body.paymentMethod === 'manual') {
                    await route.fulfill({
                        status: 200,
                        contentType: 'application/json',
                        body: JSON.stringify({
                            success: true,
                            orderId: 'test-order-id-123',
                            orderNumber: 'EVO-DEBUG-123',
                            method: 'manual'
                        }),
                    });
                } else {
                    await route.continue();
                }
            } else {
                await route.continue();
            }
        });
    });

    test('should successfully checkout with manual bank transfer and show instructions', async ({ page }) => {
        // 1. Visit Shop
        await page.goto('/shop', { waitUntil: 'networkidle' });

        // 2. Click Product and wait for Detail page
        await page.locator('div.grid a.group').first().click();
        await expect(page.getByRole('heading', { name: /Evo Retatrutide 10mg/i })).toBeVisible();

        // 3. Add to Cart and wait for confirmation
        const addToCartBtn = page.getByRole('button', { name: /ADD TO CART/i });
        await addToCartBtn.click();
        await expect(page.getByText(/ADDED TO CART!/i)).toBeVisible();

        // 4. Verify Navbar badge
        const cartBadge = page.locator('a[href="/cart"] span.bg-evo-orange');
        await expect(cartBadge).toHaveText('1');

        // 5. Go to Checkout
        await page.goto('/checkout', { waitUntil: 'networkidle' });

        // 6. Verify Form presence
        await expect(page.getByPlaceholder(/Receiver Name/i)).toBeVisible();

        // 7. Fill Shipping Info
        await page.getByPlaceholder(/Receiver Name/i).fill('Manual Test User');
        await page.getByPlaceholder(/example\.com/i).fill('manual@test.com');
        await page.getByPlaceholder(/0123456789/i).fill('01133373941');
        await page.getByPlaceholder(/Street name/i).fill('No. 42 Research Lab Crescent');
        await page.getByPlaceholder(/5-Digit Code/i).fill('43300');
        await page.getByPlaceholder(/City/i).fill('Seri Kembangan');

        // 8. Submit Order
        await page.getByRole('button', { name: /INITIALIZE ORDER/i }).click();

        // 9. Verify Instruction Page
        await page.waitForURL(url => url.pathname === '/payment/status' && url.searchParams.get('method') === 'manual');

        await expect(page.getByText(/ORDER INITIALIZED/i)).toBeVisible();
        await expect(page.getByText(/EVO-DEBUG-123/i)).toBeVisible();
        await expect(page.getByText(/United Overseas Bank/i)).toBeVisible();

        // 10. Verify WhatsApp Link
        const whatsappLink = page.getByRole('link', { name: /Submit Receipt via WhatsApp/i });
        await expect(whatsappLink).toBeVisible();
        const href = await whatsappLink.getAttribute('href');
        expect(href).toContain('wa.me/601133373941');
        expect(href).toContain(encodeURIComponent('EVO-DEBUG-123'));
    });

    test('should persist instruction details on page refresh', async ({ page }) => {
        // Direct jump to the instruction page with params
        await page.goto('/payment/status?method=manual&order_id=ord_999&order_number=EVO-REFRESH-999', { waitUntil: 'networkidle' });

        await expect(page.getByText(/EVO-REFRESH-999/)).toBeVisible();
        await expect(page.getByText(/UDB TECH VENTURES/)).toBeVisible();

        await page.reload({ waitUntil: 'networkidle' });

        await expect(page.getByText(/EVO-REFRESH-999/)).toBeVisible();
        await expect(page.getByText(/911-305-327-1/)).toBeVisible();
    });

    test('should clear the cart after successful manual order initialization', async ({ page }) => {
        // 1. Setup cart
        await page.goto('/shop', { waitUntil: 'networkidle' });
        await page.locator('div.grid a.group').first().click();

        await page.getByRole('button', { name: /ADD TO CART/i }).click();
        await expect(page.getByText(/ADDED TO CART!/i)).toBeVisible();

        await expect(page.locator('a[href="/cart"] span.bg-evo-orange')).toHaveText('1');

        // 2. Complete manual checkout
        await page.goto('/checkout', { waitUntil: 'networkidle' });
        await page.getByPlaceholder(/Receiver Name/i).fill('Clear Cart User');
        await page.getByPlaceholder(/example\.com/i).fill('clear@test.com');
        await page.getByPlaceholder(/0123456789/i).fill('01133373941');
        await page.getByPlaceholder(/Street name/i).fill('Cart Street 123');
        await page.getByPlaceholder(/5-Digit Code/i).fill('50000');
        await page.getByPlaceholder(/City/i).fill('KL');

        await page.getByRole('button', { name: /INITIALIZE ORDER/i }).click();

        // 3. Verify Cart is Empty on status page
        await page.waitForURL(/method=manual/);
        const cartBadgeAfter = page.locator('a[href="/cart"] span.bg-evo-orange');
        await expect(cartBadgeAfter).toBeHidden();
    });

    test('should display error message when manual checkout fails', async ({ page }) => {
        // Mock a failure
        await page.route('**/api/checkout', async route => {
            if (route.request().method() === 'POST') {
                await route.fulfill({
                    status: 500,
                    contentType: 'application/json',
                    body: JSON.stringify({ error: 'DATABASE_FAILURE: Order sequence sync failed' }),
                });
            } else {
                await route.continue();
            }
        });

        // Setup cart and go to checkout
        await page.goto('/shop', { waitUntil: 'networkidle' });
        await page.locator('div.grid a.group').first().click();
        await page.getByRole('button', { name: /ADD TO CART/i }).click();
        await expect(page.getByText(/ADDED TO CART!/i)).toBeVisible();

        await page.goto('/checkout', { waitUntil: 'networkidle' });

        await page.getByPlaceholder(/Receiver Name/i).fill('Error Test User');
        await page.getByPlaceholder(/example\.com/i).fill('error@test.com');
        await page.getByPlaceholder(/0123456789/i).fill('01133373941');
        await page.getByPlaceholder(/Street name/i).fill('123 Error St');
        await page.getByPlaceholder(/5-Digit Code/i).fill('50000');
        await page.getByPlaceholder(/City/i).fill('Error City');

        await page.getByRole('button', { name: /INITIALIZE ORDER/i }).click();

        // Verify error display
        await expect(page.getByText(/DATABASE_FAILURE/i)).toBeVisible();
    });
});
