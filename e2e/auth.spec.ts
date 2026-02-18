import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {

    test.beforeEach(async ({ page }) => {
        // Mock Register API
        await page.route('**/api/auth/register', async route => {
            const body = route.request().postDataJSON();
            if (body.email === 'duplicate@example.com') {
                await route.fulfill({
                    status: 409,
                    json: { error: 'Email already registered' }
                });
            } else {
                await route.fulfill({
                    status: 200,
                    json: { success: true, user: { id: 'u1', email: body.email, fullName: body.fullName, role: 'user' } }
                });
            }
        });

        // Mock Login API
        await page.route('**/api/auth/login', async route => {
            const body = route.request().postDataJSON();
            if (body.password === 'wrong') {
                await route.fulfill({
                    status: 401,
                    json: { error: 'Invalid credentials' }
                });
            } else {
                await route.fulfill({
                    status: 200,
                    json: {
                        accessToken: 'fake-access-token',
                        refreshToken: 'fake-refresh-token',
                        user: { id: 'u1', email: body.email, fullName: 'Test Researcher', role: 'user' }
                    }
                });
            }
        });

        // Mock Me API
        await page.route('**/api/auth/me', async route => {
            const authHeader = route.request().headers()['authorization'];
            if (authHeader === 'Bearer fake-access-token') {
                await route.fulfill({
                    status: 200,
                    json: { user: { id: 'u1', email: 'test@example.com', fullName: 'Test Researcher', role: 'user' } }
                });
            } else {
                await route.fulfill({
                    status: 401,
                    json: { error: 'Unauthorized' }
                });
            }
        });
    });

    test('Unauthorized Access: Redirect from protected routes', async ({ page }) => {
        await page.goto('/orders');
        // App redirects to '/login?from=/orders' if no user
        await expect(page).toHaveURL(/.*\/login\?from=(%2F|\/)orders/);
    });

    test('Registration Flow: Successful registration', async ({ page }) => {
        await page.goto('/register');

        await page.getByPlaceholder('Dr. John Doe').fill('Playwright Test');
        await page.getByPlaceholder('researcher@institution.com').fill('test@playwright.com');
        await page.getByPlaceholder('+60 12-345 6789').fill('0123456789');
        await page.getByPlaceholder('••••••••').fill('CorrectPassword123');

        await page.getByRole('button', { name: /Create Account/i }).click();

        // Should redirect to login
        await expect(page).toHaveURL(/.*\/login/);
    });

    test('Registration Flow: Handle existing email', async ({ page }) => {
        await page.goto('/register');

        await page.getByPlaceholder('Dr. John Doe').fill('Duplicate User');
        await page.getByPlaceholder('researcher@institution.com').fill('duplicate@example.com');
        await page.getByPlaceholder('••••••••').fill('CorrectPassword123');

        await page.getByRole('button', { name: /Create Account/i }).click();

        // Should show error
        await expect(page.getByText('Email already registered')).toBeVisible();
    });

    test('Login Flow: Successful login and session persistence', async ({ page }) => {
        await page.goto('/login');

        await page.getByPlaceholder('researcher@institution.com').fill('test@playwright.com');
        await page.getByPlaceholder('••••••••').fill('correct');

        await page.getByRole('button', { name: /Sign In/i }).click();

        // Should redirect to home
        await expect(page).toHaveURL(/.*\/$/);

        // Verify we are logged in - check for logout button or profile link
        // In Navbar.tsx, we check how it displays logged in status
        await expect(page.locator('nav')).toContainText('LOGOUT', { ignoreCase: true });
    });

    test('Login Flow: Invalid credentials', async ({ page }) => {
        await page.goto('/login');

        await page.getByPlaceholder('researcher@institution.com').fill('test@playwright.com');
        await page.getByPlaceholder('••••••••').fill('wrong');

        await page.getByRole('button', { name: /Sign In/i }).click();

        // Should show error
        await expect(page.getByText('Invalid credentials')).toBeVisible();
    });

    test('Logout Flow: Successful logout', async ({ page }) => {
        // Pre-login state (simulate logged in)
        await page.goto('/login');
        await page.getByPlaceholder('researcher@institution.com').fill('test@playwright.com');
        await page.getByPlaceholder('••••••••').fill('correct');
        await page.getByRole('button', { name: /Sign In/i }).click();
        // Logout
        await page.getByRole('button', { name: 'Logout' }).click();

        // Should show Sign In link now
        await expect(page.locator('nav')).toContainText('LOGIN', { ignoreCase: true });
    });
});
