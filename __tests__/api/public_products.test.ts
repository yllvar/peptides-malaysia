import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '../../api/products/index';
import { prisma } from '../../src/lib/db';

// Mock prisma
vi.mock('../../src/lib/db', () => ({
    prisma: {
        product: {
            findMany: vi.fn(),
        },
    },
}));

describe('Public Products API', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return only published products', async () => {
        const mockProducts = [
            { id: '1', name: 'Product 1', isPublished: true },
            { id: '2', name: 'Product 2', isPublished: true }
        ];
        (prisma.product.findMany as any).mockResolvedValue(mockProducts);

        const req = new Request('http://localhost/api/products');
        const res = await GET(req);
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data).toHaveLength(2);
        expect(prisma.product.findMany).toHaveBeenCalledWith(expect.objectContaining({
            where: { isPublished: true },
            include: { techSpecs: true, coaDocuments: true },
            orderBy: { sortOrder: 'asc' }
        }));
    });

    it('should return empty array when no products found', async () => {
        (prisma.product.findMany as any).mockResolvedValue([]);

        const req = new Request('http://localhost/api/products');
        const res = await GET(req);
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data).toEqual([]);
    });

    it('should return 500 on database error', async () => {
        (prisma.product.findMany as any).mockRejectedValue(new Error('DB Error'));

        const req = new Request('http://localhost/api/products');
        const res = await GET(req);

        expect(res.status).toBe(500);
        const data = await res.json();
        expect(data.error).toBeDefined();
    });
});
