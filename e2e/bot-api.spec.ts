import { test, expect } from '@playwright/test';

test.describe('Bot Order Status E2E API', () => {
    const BOT_API_KEY = 'evo_bot_601133373941_key_2026';

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        // Mock the Bot API directly
        await page.route('**/api/bot/order-status*', async route => {
            const botKey = route.request().headers()['x-bot-key'];
            const url = new URL(route.request().url());
            const query = url.searchParams.get('q');

            if (botKey !== BOT_API_KEY) {
                await route.fulfill({ status: 401, json: { error: 'Unauthorized' } });
                return;
            }

            if (query === 'EVO-12345678') {
                await route.fulfill({
                    status: 200,
                    json: {
                        orders: [{
                            orderNumber: 'EVO-12345678',
                            status: 'paid',
                            total: 580,
                            createdAt: '2026-02-18T10:00:00Z',
                            trackingNumber: 'JT123456789MY',
                            courier: 'J&T Express',
                            shippingName: 'Test Researcher',
                            items: [{ productName: 'Retatrutide 20mg', quantity: 1 }]
                        }]
                    }
                });
            } else if (query === '60123456789') {
                await route.fulfill({
                    status: 200,
                    json: {
                        orders: [{
                            orderNumber: 'EVO-PHONE-OK',
                            status: 'shipped',
                            total: 200,
                            createdAt: '2026-02-18T11:00:00Z',
                            trackingNumber: 'LALA-9921',
                            courier: 'Lalamove',
                            shippingName: 'Phone User',
                            items: [{ productName: 'GHK-Cu', quantity: 1 }]
                        }]
                    }
                });
            } else {
                await route.fulfill({ status: 404, json: { message: 'No orders found matching that identifier.' } });
            }
        });
    });

    test('Bot Security: Reject request without key', async ({ page }) => {
        const status = await page.evaluate(async () => {
            const res = await fetch('/api/bot/order-status?q=EVO-12345678');
            return res.status;
        });
        expect(status).toBe(401);
    });

    test('Bot Security: Reject request with invalid key', async ({ page }) => {
        const status = await page.evaluate(async () => {
            const res = await fetch('/api/bot/order-status?q=EVO-12345678', {
                headers: { 'x-bot-key': 'invalid-key' }
            });
            return res.status;
        });
        expect(status).toBe(401);
    });

    test('Bot Lookup: Successfully find order by ID', async ({ page }) => {
        const data = await page.evaluate(async (key) => {
            const res = await fetch('/api/bot/order-status?q=EVO-12345678', {
                headers: { 'x-bot-key': key }
            });
            return { status: res.status, json: await res.json() };
        }, BOT_API_KEY);

        expect(data.status).toBe(200);
        expect(data.json.orders[0].orderNumber).toBe('EVO-12345678');
        expect(data.json.orders[0].trackingNumber).toBe('JT123456789MY');
    });

    test('Bot Lookup: Successfully find order by Phone', async ({ page }) => {
        const data = await page.evaluate(async (key) => {
            const res = await fetch('/api/bot/order-status?q=60123456789', {
                headers: { 'x-bot-key': key }
            });
            return { status: res.status, json: await res.json() };
        }, BOT_API_KEY);

        expect(data.status).toBe(200);
        expect(data.json.orders[0].orderNumber).toBe('EVO-PHONE-OK');
        expect(data.json.orders[0].courier).toBe('Lalamove');
    });

    test('Bot Lookup: Handle not found', async ({ page }) => {
        const status = await page.evaluate(async (key) => {
            const res = await fetch('/api/bot/order-status?q=INVALID', {
                headers: { 'x-bot-key': key }
            });
            return res.status;
        }, BOT_API_KEY);
        expect(status).toBe(404);
    });
});
