import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '../../api/admin/analytics/index';
import { prisma } from '../../api/_db.js';
import { SignJWT } from 'jose';

// Mock prisma
vi.mock('../../api/_db.js', () => ({
    prisma: {
        order: {
            findMany: vi.fn(),
            count: vi.fn(),
        },
        product: {
            findMany: vi.fn(),
        },
    },
}));

const JWT_SECRET = 'test-secret';
process.env.JWT_SECRET = JWT_SECRET;

async function createToken(role: string = 'user') {
    const secret = new TextEncoder().encode(JWT_SECRET);
    return await new SignJWT({ sub: 'user-1', role })
        .setProtectedHeader({ alg: 'HS256' })
        .sign(secret);
}

describe('Admin Analytics API', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return 401 if no auth header', async () => {
        const req = new Request('http://localhost/api/admin/analytics');
        const res = await GET(req);
        expect(res.status).toBe(401);
    });

    it('should return 403 if not admin', async () => {
        const token = await createToken('user');
        const req = new Request('http://localhost/api/admin/analytics', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const res = await GET(req);
        expect(res.status).toBe(403);
    });

    it('should return correct stats', async () => {
        const token = await createToken('admin');

        // 1. Revenue buffer
        const revenueOrders = [
            { total: '100.00' },
            { total: '50.50' }
        ];
        // 2. Recent orders
        const recentOrders = [
            { id: 'o1', total: '100.00', createdAt: new Date() }
        ];

        // Mock sequences
        (prisma.order.findMany as any)
            .mockResolvedValueOnce(revenueOrders) // First call: Revenue
            .mockResolvedValueOnce(recentOrders); // Second call: Recent

        (prisma.order.count as any)
            .mockResolvedValueOnce(5) // Active count
            .mockResolvedValueOnce(10); // Total count

        (prisma.product.findMany as any).mockResolvedValue([
            { id: 'p1', stockQuantity: 2, lowStockThreshold: 5 }, // Low stock
            { id: 'p2', stockQuantity: 10, lowStockThreshold: 5 } // OK stock
        ]);

        const req = new Request('http://localhost/api/admin/analytics', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const res = await GET(req);
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data.stats.totalRevenue).toBe(150.5);
        expect(data.stats.activeOrders).toBe(5);
        expect(data.stats.totalOrders).toBe(10);
        expect(data.stats.lowStock).toBe(1); // Only p1 is low stock
        expect(data.recentOrders).toHaveLength(1);
        expect(data.lowStockProducts).toHaveLength(1);
        expect(data.lowStockProducts[0].id).toBe('p1');
    });

    it('should handle empty data', async () => {
        const token = await createToken('admin');

        (prisma.order.findMany as any)
            .mockResolvedValueOnce([]) // Revenue
            .mockResolvedValueOnce([]); // Recent

        (prisma.order.count as any)
            .mockResolvedValue(0);

        (prisma.product.findMany as any).mockResolvedValue([]);

        const req = new Request('http://localhost/api/admin/analytics', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const res = await GET(req);
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data.stats.totalRevenue).toBe(0);
        expect(data.stats.lowStock).toBe(0);
        expect(data.recentOrders).toEqual([]);
    });

    it('should handle zero orders/revenue gracefully', async () => {
        vi.mocked(prisma.order.findMany).mockResolvedValue([]); // No orders
        vi.mocked(prisma.order.count).mockResolvedValue(0);
        vi.mocked(prisma.product.findMany).mockResolvedValue([]);

        const token = await createToken('admin');
        const req = new Request('http://localhost/api/admin/analytics', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const res = await GET(req);
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data.stats).toEqual({
            totalRevenue: 0,
            activeOrders: 0,
            lowStock: 0,
            totalOrders: 0
        });
        expect(data.recentOrders).toEqual([]);
        expect(data.lowStockProducts).toEqual([]);
    });
    it('should return 500 on database error', async () => {
        const token = await createToken('admin');
        (prisma.order.findMany as any).mockRejectedValue(new Error('DB Error'));

        const req = new Request('http://localhost/api/admin/analytics', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const res = await GET(req);

        expect(res.status).toBe(500);
    });
});
