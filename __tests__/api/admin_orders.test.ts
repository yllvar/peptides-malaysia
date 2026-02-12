import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, PATCH } from '../../api/admin/orders/index';
import { prisma } from '../../src/lib/db';
import { SignJWT } from 'jose';

// Mock prisma
vi.mock('../../src/lib/db', () => ({
    prisma: {
        order: {
            findMany: vi.fn(),
            update: vi.fn(),
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

describe('Admin Orders API', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('GET', () => {
        it('should return 403 if not admin', async () => {
            const token = await createToken('user');
            const req = new Request('http://localhost/api/admin/orders', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const res = await GET(req);
            expect(res.status).toBe(403);
        });

        it('should return 401 if no Authorization header', async () => {
            const req = new Request('http://localhost/api/admin/orders');
            const res = await GET(req);
            expect(res.status).toBe(401);
        });

        it('should return all orders if admin', async () => {
            const token = await createToken('admin');
            const mockOrders = [{ id: 'o1', orderNumber: 'EVO-1' }];
            (prisma.order.findMany as any).mockResolvedValue(mockOrders);

            const req = new Request('http://localhost/api/admin/orders', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const res = await GET(req);
            const data = await res.json();

            expect(res.status).toBe(200);
            expect(data).toEqual(mockOrders);
        });
    });

    describe('PATCH', () => {
        it('should update status and tracking info', async () => {
            const token = await createToken('admin');
            const updatePayload = {
                orderId: 'o1',
                status: 'shipped',
                trackingNumber: 'TRK123',
                courier: 'J&T'
            };
            (prisma.order.update as any).mockResolvedValue({ id: 'o1', status: 'shipped' });

            const req = new Request('http://localhost/api/admin/orders', {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatePayload)
            });

            const res = await PATCH(req);
            const data = await res.json();

            expect(res.status).toBe(200);
            expect(prisma.order.update).toHaveBeenCalledWith({
                where: { id: 'o1' },
                data: expect.objectContaining({
                    status: 'shipped',
                    trackingNumber: 'TRK123',
                    courier: 'J&T',
                    shippedAt: expect.any(Date)
                })
            });
        });

        it('should set deliveredAt when status is delivered', async () => {
            const token = await createToken('admin');
            (prisma.order.update as any).mockResolvedValue({ id: 'o1', status: 'delivered', deliveredAt: new Date() });

            const req = new Request('http://localhost/api/admin/orders', {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ orderId: 'o1', status: 'delivered' })
            });

            await PATCH(req);

            expect(prisma.order.update).toHaveBeenCalledWith({
                where: { id: 'o1' },
                data: expect.objectContaining({
                    status: 'delivered',
                    deliveredAt: expect.any(Date)
                })
            });
        });

        it('should accept arbitrary status values (no enum validation - documents current behavior)', async () => {
            const token = await createToken('admin');
            (prisma.order.update as any).mockResolvedValue({ id: 'o1', status: 'banana' });

            const req = new Request('http://localhost/api/admin/orders', {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ orderId: 'o1', status: 'banana' })
            });

            const res = await PATCH(req);
            // Documents that status validation is currently missing
            expect(res.status).toBe(200);
        });

        it('should return 500 if order does not exist', async () => {
            const token = await createToken('admin');
            (prisma.order.update as any).mockRejectedValue(new Error('Record not found'));

            const req = new Request('http://localhost/api/admin/orders', {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ orderId: 'non-existent', status: 'shipped' })
            });

            const res = await PATCH(req);
            expect(res.status).toBe(500);
        });

        it('should return 400 if orderId missing', async () => {
            const token = await createToken('admin');
            const req = new Request('http://localhost/api/admin/orders', {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: 'delivered' })
            });

            const res = await PATCH(req);
            const data = await res.json();

            expect(res.status).toBe(400);
            expect(data.error).toBe('Order ID is required');
        });
    });
});
