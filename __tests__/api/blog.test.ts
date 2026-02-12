import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '../../api/blog/index';
import { prisma } from '../../src/lib/db';

// Mock prisma
vi.mock('../../src/lib/db', () => ({
    prisma: {
        blogPost: {
            findMany: vi.fn(),
        },
    },
}));

describe('Blog API', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return published blog posts', async () => {
        const mockPosts = [
            { id: '1', title: 'Post 1', isPublished: true },
            { id: '2', title: 'Post 2', isPublished: true }
        ];
        (prisma.blogPost.findMany as any).mockResolvedValue(mockPosts);

        const req = new Request('http://localhost/api/blog');
        const res = await GET(req);
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data).toHaveLength(2);
        expect(prisma.blogPost.findMany).toHaveBeenCalledWith(expect.objectContaining({
            where: { isPublished: true },
            orderBy: { publishedAt: 'desc' },
        }));
    });

    it('should return empty array when no posts found', async () => {
        (prisma.blogPost.findMany as any).mockResolvedValue([]);

        const req = new Request('http://localhost/api/blog');
        const res = await GET(req);
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data).toEqual([]);
    });

    it('should return 500 on database error', async () => {
        (prisma.blogPost.findMany as any).mockRejectedValue(new Error('DB Error'));

        const req = new Request('http://localhost/api/blog');
        const res = await GET(req);
        const data = await res.json();

        expect(res.status).toBe(500);
        expect(data.error).toBe('Failed to fetch blog posts');
    });
});
