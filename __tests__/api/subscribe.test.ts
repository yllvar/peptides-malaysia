import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../../api/auth/subscribe/index';
// Mock Resend
const { mockSend } = vi.hoisted(() => ({
    mockSend: vi.fn()
}));

vi.mock('resend', () => {
    return {
        Resend: class {
            emails = {
                send: mockSend
            };
        }
    };
});

// Mock Prisma
vi.mock('../../api/_db.js', () => ({
    prisma: {},
    connectDb: vi.fn().mockResolvedValue(undefined)
}));

describe('Subscribe API', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.RESEND_API_KEY = 'test_key';
        process.env.RESEND_FROM_EMAIL = 'test@example.com';
        process.env.VITE_APP_URL = 'http://localhost:3000';
    });

    it('returns 400 for invalid email', async () => {
        const req = new Request('http://localhost/api/auth/subscribe', {
            method: 'POST',
            body: JSON.stringify({ email: 'invalid-email' })
        });

        const res = await POST(req);
        const data = await res.json();

        expect(res.status).toBe(400);
        expect(data.error).toBe('Invalid email address');
    });

    it('returns 400 for missing email', async () => {
        const req = new Request('http://localhost/api/auth/subscribe', {
            method: 'POST',
            body: JSON.stringify({})
        });

        const res = await POST(req);
        const data = await res.json();

        expect(res.status).toBe(400);
        expect(data.error).toBe('Invalid email address');
    });

    it('sends email and returns success for valid email', async () => {
        mockSend.mockResolvedValueOnce({ id: 'test_id' });

        const email = 'researcher@example.com';
        const req = new Request('http://localhost/api/auth/subscribe', {
            method: 'POST',
            body: JSON.stringify({ email })
        });

        const res = await POST(req);
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data.message).toContain('Success');
        expect(mockSend).toHaveBeenCalledWith(expect.objectContaining({
            to: email,
            subject: expect.stringContaining('Safety Protocol'),
            html: expect.stringContaining('Download Protocol PDF')
        }));
    });

    it('returns 500 if email sending fails', async () => {
        mockSend.mockRejectedValueOnce(new Error('Resend error'));

        const req = new Request('http://localhost/api/auth/subscribe', {
            method: 'POST',
            body: JSON.stringify({ email: 'test@example.com' })
        });

        const res = await POST(req);
        const data = await res.json();

        expect(res.status).toBe(500);
        expect(data.error).toContain('Failed to process subscription');
    });
});
