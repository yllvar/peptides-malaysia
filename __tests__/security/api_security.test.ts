import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SignJWT } from 'jose';

// Use vi.hoisted to define variables that need to be accessed in vi.mock
const { mockPrisma } = vi.hoisted(() => ({
    mockPrisma: {
        order: {
            findMany: vi.fn(),
            update: vi.fn(),
            count: vi.fn(),
        },
        product: {
            findMany: vi.fn(),
            count: vi.fn(),
        },
    }
}));

// Mock ALL possible prisma locations using the hoisted variable
vi.mock('../../api/_db', () => ({ prisma: mockPrisma }));
vi.mock('../../src/lib/db', () => ({ prisma: mockPrisma }));

// Import handlers to test AFTER mocking
import { GET as getAnalytics } from '../../api/admin/analytics/index';
import { GET as getAdminOrders, PATCH as patchAdminOrders } from '../../api/admin/orders/index';
import { GET as getUserOrders } from '../../api/orders/index';

const JWT_SECRET = 'test-security-secret';
process.env.JWT_SECRET = JWT_SECRET;

async function createToken(role: string, sub: string = 'user-123') {
    const secret = new TextEncoder().encode(JWT_SECRET);
    return await new SignJWT({ role, sub })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('2h')
        .sign(secret);
}

describe('API Security Integration Audit', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        // Default returns to avoid serialization errors with undefined
        mockPrisma.order.findMany.mockResolvedValue([]);
        mockPrisma.order.update.mockResolvedValue({ id: 'o1', status: 'shipped' });
        mockPrisma.product.findMany.mockResolvedValue([]);
        mockPrisma.product.count.mockResolvedValue(0);
    });

    describe('Unauthenticated Access (401)', () => {
        it('should reject Admin Analytics with 401 if no token provided', async () => {
            const req = new Request('http://localhost/api/admin/analytics');
            const res = await getAnalytics(req);
            expect(res.status).toBe(401);
        });

        it('should reject User Orders with 401 if no token provided', async () => {
            const req = new Request('http://localhost/api/orders');
            const res = await getUserOrders(req);
            expect(res.status).toBe(401);
        });
    });

    describe('Unauthorized Access / Role Escalation (403)', () => {
        it('should reject Admin Analytics for regular users', async () => {
            const token = await createToken('user');
            const req = new Request('http://localhost/api/admin/analytics', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const res = await getAnalytics(req);
            expect(res.status).toBe(403);
        });

        it('should reject Admin Order updates for regular users', async () => {
            const token = await createToken('user');
            const req = new Request('http://localhost/api/admin/orders', {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ orderId: 'o1', status: 'shipped' })
            });
            const res = await patchAdminOrders(req);
            expect(res.status).toBe(403);
        });
    });

    describe('Cross-User Data Isolation (IDOR)', () => {
        it('should only return orders belonging to the authenticated user', async () => {
            const userId = 'trusted-user-id';
            const token = await createToken('user', userId);
            const req = new Request('http://localhost/api/orders', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            await getUserOrders(req);

            expect(mockPrisma.order.findMany).toHaveBeenCalledWith(expect.objectContaining({
                where: { userId: userId }
            }));
        });
    });

    describe('JWT Integrity', () => {
        it('should reject tokens signed with a different secret', async () => {
            const wrongSecret = new TextEncoder().encode('wrong-secret');
            const badToken = await new SignJWT({ role: 'admin' })
                .setProtectedHeader({ alg: 'HS256' })
                .sign(wrongSecret);

            const req = new Request('http://localhost/api/admin/analytics', {
                headers: { 'Authorization': `Bearer ${badToken}` }
            });
            const res = await getAnalytics(req);
            expect(res.status).toBe(401);
            const data = await res.json();
            expect(data.error).toBe('Invalid token');
        });
    });

    describe('Vulnerability Check: Mass Assignment', () => {
        it('Admin Orders PATCH should ignore sensitive fields in payload', async () => {
            const token = await createToken('admin');
            const maliciousPayload = {
                orderId: 'o1',
                status: 'shipped',
                total: 0.01,         // Malicious update attempt
                userId: 'hacker-id'   // Malicious update attempt
            };

            const req = new Request('http://localhost/api/admin/orders', {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(maliciousPayload)
            });

            await patchAdminOrders(req);

            // Verify only allowed fields were passed to prisma.update
            const updateCall = mockPrisma.order.update.mock.calls[0][0];
            expect(updateCall.data).toHaveProperty('status', 'shipped');
            expect(updateCall.data).not.toHaveProperty('total');
            expect(updateCall.data).not.toHaveProperty('userId');
        });
    });

});
