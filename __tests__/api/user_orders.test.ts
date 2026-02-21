import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '../../api/orders/index';
import { prisma } from '../../api/_db';
import { SignJWT } from 'jose';

// Mock prisma
vi.mock('../../api/_db', () => ({
    connectDb: vi.fn().mockResolvedValue(undefined), prisma: {
        order: {
            findMany: vi.fn(),
        },
    },
}));

const JWT_SECRET = 'test-secret';
process.env.JWT_SECRET = JWT_SECRET;

async function createToken(userId: string = 'user-1') {
    const secret = new TextEncoder().encode(JWT_SECRET);
    return await new SignJWT({ sub: userId })
        .setProtectedHeader({ alg: 'HS256' })
        .sign(secret);
}

describe('User Orders API', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return 401 if no auth header', async () => {
        const req = new Request('http://localhost/api/orders');
        const res = await GET(req);
        const data = await res.json();

        expect(res.status).toBe(401);
        expect(data.error).toBe('Unauthorized');
    });

    it('should return 401 for invalid token', async () => {
        const req = new Request('http://localhost/api/orders', {
            headers: { 'Authorization': 'Bearer invalid-token' }
        });
        const res = await GET(req);
        const data = await res.json();

        expect(res.status).toBe(401);
        expect(data.error).toBe('Invalid token');
    });

    it('should return user orders successfully', async () => {
        const token = await createToken('user-1');
        const mockOrders = [
            { id: 'order-1', userId: 'user-1' },
            { id: 'order-2', userId: 'user-1' }
        ];
        (prisma.order.findMany as any).mockResolvedValue(mockOrders);

        const req = new Request('http://localhost/api/orders', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const res = await GET(req);
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data).toHaveLength(2);
        expect(prisma.order.findMany).toHaveBeenCalledWith(expect.objectContaining({
            where: { userId: 'user-1' },
            include: { items: true, payment: true },
            orderBy: { createdAt: 'desc' }
        }));
    });

    it('should return empty array for user with no orders', async () => {
        const token = await createToken('user-2');
        (prisma.order.findMany as any).mockResolvedValue([]);

        const req = new Request('http://localhost/api/orders', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const res = await GET(req);
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data).toEqual([]);
        expect(prisma.order.findMany).toHaveBeenCalledWith(expect.objectContaining({
            where: { userId: 'user-2' }
        }));
    });

    it('should return 500 on database error', async () => {
        const token = await createToken('user-1');
        (prisma.order.findMany as any).mockRejectedValue(new Error('DB Error'));

        const req = new Request('http://localhost/api/orders', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const res = await GET(req);

        expect(res.status).toBe(500);
    });
});
