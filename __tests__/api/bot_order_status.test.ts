import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '../../api/bot/order-status/index';
import { prisma } from '../../api/_db';

// Mock prisma
vi.mock('../../api/_db', () => ({
    prisma: {
        order: {
            findMany: vi.fn(),
        },
    },
}));

const BOT_API_KEY = 'test-bot-key';
process.env.BOT_API_KEY = BOT_API_KEY;

describe('Bot Order Status API', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return 401 if x-bot-key is missing', async () => {
        const req = new Request('http://localhost/api/bot/order-status?q=EVO-123');
        const res = await GET(req);
        const data = await res.json();

        expect(res.status).toBe(401);
        expect(data.error).toBe('Unauthorized');
    });

    it('should return 401 if x-bot-key is incorrect', async () => {
        const req = new Request('http://localhost/api/bot/order-status?q=EVO-123', {
            headers: { 'x-bot-key': 'wrong-key' }
        });
        const res = await GET(req);
        const data = await res.json();

        expect(res.status).toBe(401);
        expect(data.error).toBe('Unauthorized');
    });

    it('should return 400 if query q is missing', async () => {
        const req = new Request('http://localhost/api/bot/order-status', {
            headers: { 'x-bot-key': BOT_API_KEY }
        });
        const res = await GET(req);
        const data = await res.json();

        expect(res.status).toBe(400);
        expect(data.error).toBe('Missing query parameter q');
    });

    it('should return 404 if no orders are found', async () => {
        (prisma.order.findMany as any).mockResolvedValue([]);

        const req = new Request('http://localhost/api/bot/order-status?q=NONEXISTENT', {
            headers: { 'x-bot-key': BOT_API_KEY }
        });
        const res = await GET(req);
        const data = await res.json();

        expect(res.status).toBe(404);
        expect(data.message).toBe('No orders found matching that identifier.');
    });

    it('should return orders successfully for order number', async () => {
        const mockOrders = [{
            orderNumber: 'EVO-12345678',
            status: 'paid',
            total: 580.00,
            createdAt: new Date(),
            items: [{ productName: 'Retatrutide 20mg', quantity: 1 }]
        }];
        (prisma.order.findMany as any).mockResolvedValue(mockOrders);

        const req = new Request('http://localhost/api/bot/order-status?q=EVO-12345', {
            headers: { 'x-bot-key': BOT_API_KEY }
        });
        const res = await GET(req);
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data.orders).toHaveLength(1);
        expect(data.orders[0].orderNumber).toBe('EVO-12345678');
    });

    it('should handle phone number normalization and MY prefix', async () => {
        (prisma.order.findMany as any).mockResolvedValue([{ orderNumber: 'EVO-P' }]);

        const req = new Request('http://localhost/api/bot/order-status?q=+60 12-345 6789', {
            headers: { 'x-bot-key': BOT_API_KEY }
        });
        await GET(req);

        // Verify the OR query contains normalized phone variants
        expect(prisma.order.findMany).toHaveBeenCalledWith(expect.objectContaining({
            where: {
                OR: expect.arrayContaining([
                    { shippingPhone: { contains: '60123456789' } },
                    { shippingPhone: { contains: '0123456789' } }
                ])
            }
        }));
    });
});
