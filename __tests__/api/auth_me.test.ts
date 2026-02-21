import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '../../api/auth/me/index';
import { prisma } from '../../api/_db';
import { SignJWT } from 'jose';

// Mock prisma
vi.mock('../../api/_db', () => ({
    connectDb: vi.fn().mockResolvedValue(undefined), prisma: {
        user: {
            findUnique: vi.fn(),
        },
    },
}));

const JWT_SECRET = 'test-secret';
process.env.JWT_SECRET = JWT_SECRET;

async function createToken(userId: string = 'user-1', role: string = 'user') {
    const secret = new TextEncoder().encode(JWT_SECRET);
    return await new SignJWT({ sub: userId, role })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('1h')
        .sign(secret);
}

describe('Auth Me API', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return 401 if no auth header', async () => {
        const req = new Request('http://localhost/api/auth/me');
        const res = await GET(req);

        expect(res.status).toBe(401);
    });

    it('should return 401 for invalid token', async () => {
        const req = new Request('http://localhost/api/auth/me', {
            headers: { 'Authorization': 'Bearer invalid-token' }
        });
        const res = await GET(req);

        expect(res.status).toBe(401);
    });

    it('should return user data for valid token', async () => {
        const token = await createToken('user-1');
        const mockUser = {
            id: 'user-1',
            email: 'test@example.com',
            fullName: 'Test User',
            role: 'user'
        };
        (prisma.user.findUnique as any).mockResolvedValue(mockUser);

        const req = new Request('http://localhost/api/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const res = await GET(req);
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data.user).toEqual(mockUser);
        expect(prisma.user.findUnique).toHaveBeenCalledWith({
            where: { id: 'user-1' },
            select: { id: true, email: true, fullName: true, role: true }
        });
    });

    it('should return 404 if user was deleted', async () => {
        const token = await createToken('user-1');
        (prisma.user.findUnique as any).mockResolvedValue(null);

        const req = new Request('http://localhost/api/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const res = await GET(req);
        const data = await res.json();

        expect(res.status).toBe(404);
        expect(data.error).toBe('User not found');
    });
});
