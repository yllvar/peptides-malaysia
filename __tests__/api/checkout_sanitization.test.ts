import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../../api/checkout/index';

// Mock dependencies
vi.mock('../../src/lib/utils/shipping', () => ({
    calculateShippingCost: vi.fn(() => 10),
}));

// Mock Prisma
vi.mock('../../api/_db', () => ({
    connectDb: vi.fn().mockResolvedValue(undefined), prisma: {
        product: {
            findMany: vi.fn(),
        },
        order: {
            create: vi.fn(),
        },
        orderPayment: {
            create: vi.fn(),
        },
    },
}));

import { prisma } from '../../api/_db';

describe('Checkout API - Phone Sanitization (P0)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Setup default mock returns
        (prisma.product.findMany as any).mockResolvedValue([
            { id: 'p1', name: 'Test Product', price: 100, stockQuantity: 10, isPublished: true, inStock: true }
        ]);
        (prisma.order.create as any).mockResolvedValue({ id: 'order-123' });

        // Mock fetch for ToyyibPay
        global.fetch = vi.fn().mockResolvedValue({
            text: () => Promise.resolve(JSON.stringify([{ BillCode: 'bill-123' }])),
            ok: true
        } as any);
    });

    it('should sanitize phone numbers before saving to database', async () => {
        const dirtyPhone = '012-345 6789';
        const cleanPhone = '0123456789';

        const req = new Request('http://localhost/api/checkout', {
            method: 'POST',
            body: JSON.stringify({
                items: [{ id: 'p1', quantity: 1 }],
                shippingInfo: {
                    fullName: 'Test User',
                    email: 'test@example.com',
                    phone: dirtyPhone,
                    address: '123 Test St',
                    city: 'Test City',
                    postcode: '12345'
                },
                userId: null
            }),
        });

        const res = await POST(req);

        // Verify response is successful
        expect(res.status).toBe(200);

        // CHECK THE DB CALL: Did it receive the clean phone number?
        expect(prisma.order.create).toHaveBeenCalledWith(expect.objectContaining({
            data: expect.objectContaining({
                shippingPhone: cleanPhone,
                guestPhone: cleanPhone, // Should also be sanitized for guests
                shippingName: 'Test User'
            })
        }));
    });

    it('should sanitize phone numbers even for authenticated users', async () => {
        const dirtyPhone = '+60 11-2222 3333';
        const cleanPhone = '601122223333';

        const req = new Request('http://localhost/api/checkout', {
            method: 'POST',
            body: JSON.stringify({
                items: [{ id: 'p1', quantity: 1 }],
                shippingInfo: {
                    fullName: 'Auth User',
                    email: 'auth@example.com',
                    phone: dirtyPhone,
                    address: '123 Auth St',
                    city: 'Auth City',
                    postcode: '54321'
                },
                userId: 'user-uuid-123'
            }),
        });

        await POST(req);

        // Verify DB call
        expect(prisma.order.create).toHaveBeenCalledWith(expect.objectContaining({
            data: expect.objectContaining({
                shippingPhone: cleanPhone,
                // userId is present, so guestPhone should be undefined
                guestPhone: undefined
            })
        }));
    });
});
