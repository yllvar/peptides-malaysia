import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../../api/track';
import { prisma } from '../../api/orders/_db'; // Reuse the mock from existing tests if possible, or mock globally

// Mock Prisma
vi.mock('../../api/_db', () => ({
    prisma: {
        order: {
            findFirst: vi.fn(),
        },
    },
}));

// We need to import the mocked prisma to assert on it
import { prisma as prismaMock } from '../../api/_db';

describe('Guest Tracking API', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return 400 if orderNumber or phone is missing', async () => {
        const req = new Request('http://localhost/api/track', {
            method: 'POST',
            body: JSON.stringify({ orderNumber: 'EVO-123' }),
        });
        const res = await POST(req);
        const data = await res.json();

        expect(res.status).toBe(400);
        expect(data.error).toMatch(/required/);
    });

    it('should sanitize phone number and find order', async () => {
        const mockOrder = { id: '1', orderNumber: 'EVO-123', status: 'pending' };
        (prismaMock.order.findFirst as any).mockResolvedValue(mockOrder);

        const req = new Request('http://localhost/api/track', {
            method: 'POST',
            body: JSON.stringify({
                orderNumber: 'EVO-123',
                phone: '012-345 6789' // Messy input
            }),
        });

        const res = await POST(req);
        const data = await res.json();

        expect(prismaMock.order.findFirst).toHaveBeenCalledWith(expect.objectContaining({
            where: {
                orderNumber: 'EVO-123',
                shippingPhone: '0123456789' // Sanitized!
            }
        }));
        expect(res.status).toBe(200);
        expect(data).toEqual(mockOrder);
    });

    it('should return 404 if order not found', async () => {
        (prismaMock.order.findFirst as any).mockResolvedValue(null);

        const req = new Request('http://localhost/api/track', {
            method: 'POST',
            body: JSON.stringify({
                orderNumber: 'EVO-999',
                phone: '0123456789'
            }),
        });

        const res = await POST(req);
        expect(res.status).toBe(404);
    });

    it('should return 500 on database error', async () => {
        (prismaMock.order.findFirst as any).mockRejectedValue(new Error('DB Error'));

        const req = new Request('http://localhost/api/track', {
            method: 'POST',
            body: JSON.stringify({
                orderNumber: 'EVO-123',
                phone: '0123456789'
            }),
        });

        const res = await POST(req);
        expect(res.status).toBe(500);
    });
});
