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
            { id: '1', name: 'Product 1', isPublished: true, techSpecs: [], coaDocuments: [] },
            { id: '2', name: 'Product 2', isPublished: true, techSpecs: [], coaDocuments: [] }
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

    it('should include Cache-Control headers for edge caching', async () => {
        (prisma.product.findMany as any).mockResolvedValue([]);

        const req = new Request('http://localhost/api/products');
        const res = await GET(req);

        expect(res.headers.get('Cache-Control')).toBe('s-maxage=60, stale-while-revalidate=300');
        expect(res.headers.get('Content-Type')).toBe('application/json');
    });

    it('should strip internal fields from the response (DTO)', async () => {
        const mockProducts = [{
            id: '1',
            name: 'Product 1',
            slug: 'product-1',
            price: 100,
            compareAtPrice: null,
            category: 'Recovery',
            description: 'Test desc',
            shortDescription: null,
            imageUrl: '/images/test.jpg',
            galleryUrls: [],
            badge: 'NEW',
            isNew: true,
            inStock: true,
            features: ['Feature A'],
            // Internal fields that should NOT appear in the response
            sortOrder: 5,
            isPublished: true,
            stockQuantity: 50,
            lowStockThreshold: 5,
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-02'),
            weightGrams: 100,
            techSpecs: [{
                id: 'ts-1',
                productId: '1',
                molecularFormula: 'C62H98N16O22',
                molarMass: '1419.5 g/mol',
                researchFocus: 'Angiogenesis',
                halfLife: '~4-6 Hours',
                category: 'Healing',
                createdAt: new Date('2024-01-01'),
                updatedAt: new Date('2024-01-02'),
            }],
            coaDocuments: [{
                id: 'coa-1',
                productId: '1',
                productName: 'Product 1',
                batchNumber: 'EVO-001',
                purity: '99.9%',
                testDate: '2024-01-01',
                pdfUrl: null,
                createdAt: new Date('2024-01-01'),
            }],
        }];
        (prisma.product.findMany as any).mockResolvedValue(mockProducts);

        const req = new Request('http://localhost/api/products');
        const res = await GET(req);
        const data = await res.json();

        const product = data[0];

        // Public fields should be present
        expect(product.id).toBe('1');
        expect(product.name).toBe('Product 1');
        expect(product.slug).toBe('product-1');
        expect(product.price).toBe(100);
        expect(product.category).toBe('Recovery');
        expect(product.badge).toBe('NEW');
        expect(product.features).toEqual(['Feature A']);
        expect(product.techSpecs).toHaveLength(1);
        expect(product.techSpecs[0].molecularFormula).toBe('C62H98N16O22');
        expect(product.coaDocuments).toHaveLength(1);
        expect(product.coaDocuments[0].batchNumber).toBe('EVO-001');

        // Internal fields should NOT be present
        expect(product.sortOrder).toBeUndefined();
        expect(product.isPublished).toBeUndefined();
        expect(product.stockQuantity).toBeUndefined();
        expect(product.lowStockThreshold).toBeUndefined();
        expect(product.createdAt).toBeUndefined();
        expect(product.updatedAt).toBeUndefined();
        expect(product.weightGrams).toBeUndefined();

        // Internal fields on nested objects should NOT be present
        expect(product.techSpecs[0].id).toBeUndefined();
        expect(product.techSpecs[0].productId).toBeUndefined();
        expect(product.techSpecs[0].createdAt).toBeUndefined();
        expect(product.techSpecs[0].updatedAt).toBeUndefined();
        expect(product.coaDocuments[0].productId).toBeUndefined();
        expect(product.coaDocuments[0].createdAt).toBeUndefined();
    });
});
