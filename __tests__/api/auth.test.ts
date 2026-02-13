import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST as loginPOST } from '../../api/auth/login/index';
import { prisma } from '../../src/lib/db';
import bcrypt from 'bcryptjs';

// Mock prisma
vi.mock('../../src/lib/db', () => ({
    prisma: {
        user: {
            findUnique: vi.fn(),
            create: vi.fn(),
        },
        session: {
            create: vi.fn(),
        },
    },
}));

// Mock bcryptjs
vi.mock('bcryptjs', () => ({
    default: {
        compare: vi.fn(),
        hash: vi.fn(),
    },
}));

describe('Auth API - Login', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.JWT_SECRET = 'test-secret';
        process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
    });

    it('should return 400 if email or password missing', async () => {
        const req = new Request('http://localhost/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email: 'test@example.com' }),
        });

        const res = await loginPOST(req);
        const data = await res.json();

        expect(res.status).toBe(400);
        expect(data.error).toBe('Missing email or password');
    });

    it('should return 400 for empty string email/password', async () => {
        const req = new Request('http://localhost/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email: '', password: '' }),
        });

        const res = await loginPOST(req);
        const data = await res.json();

        expect(res.status).toBe(400);
        expect(data.error).toBe('Missing email or password');
    });

    it('should return 500 if session creation fails', async () => {
        (prisma.user.findUnique as any).mockResolvedValue({
            id: 'user-1',
            email: 'test@example.com',
            passwordHash: 'hashed-password',
        });
        (bcrypt.compare as any).mockResolvedValue(true);
        (prisma.session.create as any).mockRejectedValue(new Error('DB Error'));

        const req = new Request('http://localhost/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email: 'test@example.com', password: 'password' }),
        });

        const res = await loginPOST(req);

        expect(res.status).toBe(500);
    });

    it('should return 401 for non-existent user', async () => {
        (prisma.user.findUnique as any).mockResolvedValue(null);

        const req = new Request('http://localhost/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email: 'wrong@example.com', password: 'password123' }),
        });

        const res = await loginPOST(req);
        const data = await res.json();

        expect(res.status).toBe(401);
        expect(data.error).toBe('Invalid credentials');
    });

    it('should return 401 for wrong password', async () => {
        (prisma.user.findUnique as any).mockResolvedValue({
            id: 'user-1',
            email: 'test@example.com',
            passwordHash: 'hashed-password',
        });
        (bcrypt.compare as any).mockResolvedValue(false);

        const req = new Request('http://localhost/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email: 'test@example.com', password: 'wrongpassword' }),
        });

        const res = await loginPOST(req);
        const data = await res.json();

        expect(res.status).toBe(401);
        expect(data.error).toBe('Invalid credentials');
    });

    it('should return tokens on successful login', async () => {
        (prisma.user.findUnique as any).mockResolvedValue({
            id: 'user-1',
            email: 'test@example.com',
            fullName: 'Test User',
            role: 'user',
            passwordHash: 'hashed-password',
        });
        (bcrypt.compare as any).mockResolvedValue(true);
        (prisma.session.create as any).mockResolvedValue({});

        const req = new Request('http://localhost/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email: 'test@example.com', password: 'correctpassword' }),
        });

        const res = await loginPOST(req);
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data.accessToken).toBeDefined();
        expect(data.refreshToken).toBeDefined();
        expect(data.user.email).toBe('test@example.com');
        expect(prisma.session.create).toHaveBeenCalled();
    });
});

import { POST as registerPOST } from '../../api/auth/register/index';

describe('Auth API - Register', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return 400 if required fields missing', async () => {
        const req = new Request('http://localhost/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email: 'test@example.com' }),
        });

        const res = await registerPOST(req);
        const data = await res.json();

        expect(res.status).toBe(400);
        expect(data.error).toBe('Missing required fields');
    });

    it('should return 409 if email already exists', async () => {
        (prisma.user.findUnique as any).mockResolvedValue({ id: 'existing' });

        const req = new Request('http://localhost/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                email: 'exists@example.com',
                password: 'Password123',
                fullName: 'Existing User'
            }),
        });

        const res = await registerPOST(req);
        const data = await res.json();

        expect(res.status).toBe(409);
        expect(data.error).toBe('Email already registered');
    });

    it('should successfully register a new user', async () => {
        (prisma.user.findUnique as any).mockResolvedValue(null);
        (bcrypt.hash as any).mockResolvedValue('hashed-password');
        (prisma.user.create as any).mockResolvedValue({
            id: 'new-user',
            email: 'new@example.com',
            fullName: 'New User',
            role: 'user'
        });

        const req = new Request('http://localhost/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                email: 'new@example.com',
                password: 'Password123',
                fullName: 'New User'
            }),
        });

        const res = await registerPOST(req);
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.user.email).toBe('new@example.com');
        expect(prisma.user.create).toHaveBeenCalled();
    });

    it('should reject weak passwords', async () => {
        const req = new Request('http://localhost/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email: 'e@e.com', password: '1', fullName: 'Test' }),
        });

        const res = await registerPOST(req);
        const data = await res.json();
        expect(res.status).toBe(400);
        expect(data.error).toContain('Password');
    });

    it('should reject invalid email format', async () => {
        const req = new Request('http://localhost/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email: 'not-an-email', password: 'Password123', fullName: 'Test' }),
        });

        const res = await registerPOST(req);
        const data = await res.json();
        expect(res.status).toBe(400);
        expect(data.error).toBe('Invalid email format');
    });
});
