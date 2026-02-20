import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard Flow', () => {

    test.beforeEach(async ({ page }) => {
        // Mock Admin Analytics
        await page.route('**/api/admin/analytics', async route => {
            const authHeader = route.request().headers()['authorization'];
            if (authHeader === 'Bearer admin-token') {
                await route.fulfill({
                    status: 200,
                    json: {
                        stats: {
                            totalRevenue: 5000.50,
                            activeOrders: 12,
                            lowStock: 3,
                            totalOrders: 45
                        },
                        recentOrders: [
                            { id: 'o1', orderNumber: 'EVO-12345678', shippingName: 'John Admin', status: 'paid', total: 150.00, createdAt: new Date().toISOString() }
                        ],
                        lowStockProducts: [
                            { id: 'p1', name: 'Low Stock Product', imageUrl: '/img.jpg', stockQuantity: 2 }
                        ]
                    }
                });
            } else {
                await route.fulfill({ status: 403, json: { error: 'Forbidden' } });
            }
        });

        // Mock Admin Orders
        await page.route('**/api/admin/orders**', async route => { // Match queries like ?limit=20
            await route.fulfill({
                status: 200,
                json: {
                    orders: [
                        {
                            id: 'o1',
                            orderNumber: 'EVO-12345678',
                            shippingName: 'John Admin',
                            status: 'paid',
                            total: 150.00,
                            createdAt: new Date().toISOString(),
                            items: [{ id: 'i1', productName: 'P1', quantity: 1, lineTotal: 150 }],
                            user: { fullName: 'John Admin', email: 'john@admin.com' }
                        }
                    ],
                    hasMore: false,
                    nextCursor: null
                }
            });
        });
    });

    test('Access Guard: Redirect non-admin users', async ({ page }) => {
        // Mock user as non-admin
        await page.addInitScript(() => {
            window.localStorage.setItem('peptides_auth', JSON.stringify({
                state: {
                    user: { id: 'u1', email: 'user@test.com', fullName: 'Regular User', role: 'user' },
                    accessToken: 'user-token',
                    refreshToken: 'refresh-token'
                }
            }));
        });

        await page.goto('/admin');
        await expect(page.getByText('Unauthorized')).toBeVisible();
    });

    test('Admin Access: Successful dashboard rendering', async ({ page }) => {
        // Mock user as admin
        await page.addInitScript(() => {
            window.localStorage.setItem('peptides_auth', JSON.stringify({
                state: {
                    user: { id: 'admin1', email: 'admin@test.com', fullName: 'Admin User', role: 'admin' },
                    accessToken: 'admin-token',
                    refreshToken: 'refresh-token'
                }
            }));
        });

        await page.goto('/admin');

        // Verify dashboard elements
        await expect(page.getByText('COMMAND CENTER')).toBeVisible();
        await expect(page.getByText('RM 5000.50')).toBeVisible();
        await expect(page.getByText('12')).toBeVisible(); // Active orders

        // Navigation check
        await page.locator('aside').getByRole('link', { name: 'Orders' }).click();
        await expect(page).toHaveURL(/.*\/admin\/orders/);
    });

    test('Order Management: View order details', async ({ page }) => {
        await page.addInitScript(() => {
            window.localStorage.setItem('peptides_auth', JSON.stringify({
                state: {
                    user: { id: 'admin1', email: 'admin@test.com', fullName: 'Admin User', role: 'admin' },
                    accessToken: 'admin-token',
                }
            }));
        });

        await page.goto('/admin/orders');
        await expect(page.getByText('EVO-12345678')).toBeVisible();
        await expect(page.getByText('John Admin')).toBeVisible();
    });
});
