import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, PATCH } from '../../api/admin/orders/index';
import { prisma } from '../../api/_db.js';
import { SignJWT } from 'jose';

// Mock prisma
vi.mock('../../api/_db.js', () => ({
    connectDb: vi.fn().mockResolvedValue(undefined), prisma: {
        order: {
            findMany: vi.fn(),
            update: vi.fn(),
        },
    },
}));

vi.mock('../../src/lib/email.js', () => ({
    sendShippingConfirmationEmail: vi.fn().mockResolvedValue({ success: true })
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

        it('should return paginated orders if admin', async () => {
            const token = await createToken('admin');
            const mockOrders = [{ id: 'o1', orderNumber: 'EVO-A1B2C3D4' }];
            (prisma.order.findMany as any).mockResolvedValue(mockOrders);

            const req = new Request('http://localhost/api/admin/orders?limit=20', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const res = await GET(req);
            const data = await res.json();

            expect(res.status).toBe(200);
            expect(data.orders).toEqual(mockOrders);
            expect(data.hasMore).toBe(false);
            expect(data.nextCursor).toBeNull();
        });

        it('should indicate hasMore when results exceed limit', async () => {
            const token = await createToken('admin');
            // Create 21 mock orders (limit=20, so 21 means hasMore=true)
            const mockOrders = Array.from({ length: 21 }, (_, i) => ({
                id: `o${i}`, orderNumber: `EVO-${String(i).padStart(8, '0')}`
            }));
            (prisma.order.findMany as any).mockResolvedValue(mockOrders);

            const req = new Request('http://localhost/api/admin/orders?limit=20', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const res = await GET(req);
            const data = await res.json();

            expect(res.status).toBe(200);
            expect(data.orders).toHaveLength(20);
            expect(data.hasMore).toBe(true);
            expect(data.nextCursor).toBe('o19');
        });

        it('should pass search and status params to Prisma', async () => {
            const token = await createToken('admin');
            (prisma.order.findMany as any).mockResolvedValue([]);

            const req = new Request('http://localhost/api/admin/orders?search=john&status=paid', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            await GET(req);

            expect(prisma.order.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: {
                        status: 'paid',
                        OR: [
                            { orderNumber: { contains: 'john', mode: 'insensitive' } },
                            { shippingName: { contains: 'john', mode: 'insensitive' } },
                        ]
                    }
                })
            );
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
            expect(prisma.order.update).toHaveBeenCalledWith(expect.objectContaining({
                where: { id: 'o1' },
                data: expect.objectContaining({
                    status: 'shipped',
                    trackingNumber: 'TRK123',
                    courier: 'J&T',
                    shippedAt: expect.any(Date)
                })
            }));
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

            expect(prisma.order.update).toHaveBeenCalledWith(expect.objectContaining({
                where: { id: 'o1' },
                data: expect.objectContaining({
                    status: 'delivered',
                    deliveredAt: expect.any(Date)
                })
            }));
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
