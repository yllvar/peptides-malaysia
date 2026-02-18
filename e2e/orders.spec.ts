import { test, expect } from '@playwright/test';

test.describe('Order History Flow', () => {

    test.beforeEach(async ({ page }) => {
        // Mock User Orders API
        await page.route('**/api/orders', async route => {
            const authHeader = route.request().headers()['authorization'];
            if (authHeader === 'Bearer user-token') {
                await route.fulfill({
                    status: 200,
                    json: [
                        {
                            id: 'order-1',
                            orderNumber: 'EVO-1001',
                            status: 'paid',
                            total: 580.00,
                            createdAt: new Date().toISOString(),
                            trackingNumber: 'JNT12345678',
                            courier: 'J&T Express',
                            items: [
                                {
                                    id: 'item-1',
                                    productName: 'Retatrutide 20mg Kit',
                                    productPrice: 580.00,
                                    quantity: 1,
                                    lineTotal: 580.00
                                }
                            ]
                        }
                    ]
                });
            } else {
                await route.fulfill({ status: 401, json: { error: 'Unauthorized' } });
            }
        });
    });

    test('Order History: Show list of orders for authenticated user', async ({ page }) => {
        // Mock user as authenticated
        await page.addInitScript(() => {
            window.localStorage.setItem('peptides_auth', JSON.stringify({
                state: {
                    user: { id: 'u1', email: 'test@user.com', fullName: 'Test user', role: 'user' },
                    accessToken: 'user-token'
                }
            }));
        });

        await page.goto('/orders');

        await expect(page.getByRole('heading', { name: /Order History/i })).toBeVisible();
        await expect(page.getByText('EVO-1001')).toBeVisible();
        await expect(page.getByText('RM 580.00').first()).toBeVisible();
        await expect(page.getByText('Retatrutide 20mg Kit')).toBeVisible();
        await expect(page.getByText('JNT12345678')).toBeVisible();
    });

    test('Order History: Empty state', async ({ page }) => {
        await page.route('**/api/orders', async route => {
            await route.fulfill({ status: 200, json: [] });
        });

        await page.addInitScript(() => {
            window.localStorage.setItem('peptides_auth', JSON.stringify({
                state: {
                    user: { id: 'u1', email: 'test@user.com', fullName: 'Test user', role: 'user' },
                    accessToken: 'user-token'
                }
            }));
        });

        await page.goto('/orders');
        await expect(page.getByText('No research orders yet')).toBeVisible();
        await expect(page.getByRole('link', { name: 'Visit Shop' })).toBeVisible();
    });
});
