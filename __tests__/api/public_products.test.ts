import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockFindMany } = vi.hoisted(() => ({
    mockFindMany: vi.fn(),
}));

vi.mock('@prisma/client', () => {
    return {
        PrismaClient: class MockPrismaClient {
            product = {
                findMany: mockFindMany,
            };
        },
    };
});

import { GET } from '../../api/products/index';

describe('Public Products API', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return only published products', async () => {
        const mockProducts = [
            { id: '1', name: 'Product 1', isPublished: true, techSpecs: [], coaDocuments: [] },
            { id: '2', name: 'Product 2', isPublished: true, techSpecs: [], coaDocuments: [] }
        ];
        mockFindMany.mockResolvedValue(mockProducts);

        const req = new Request('http://localhost/api/products');
        const res = await GET(req);
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data).toHaveLength(2);
        expect(mockFindMany).toHaveBeenCalledWith(expect.objectContaining({
            where: { isPublished: true },
        }));
    });

    it('should return empty array when no products found', async () => {
        mockFindMany.mockResolvedValue([]);

        const req = new Request('http://localhost/api/products');
        const res = await GET(req);
        const data = await res.json();

        expect(res.status).toBe(200);
        expect(data).toEqual([]);
    });

    it('should return 500 on database error', async () => {
        mockFindMany.mockRejectedValue(new Error('DB Error'));

        const req = new Request('http://localhost/api/products');
        const res = await GET(req);

        expect(res.status).toBe(500);
        const data = await res.json();
        expect(data.error).toBeDefined();
    });

    it('should strip internal fields from the response (DTO)', async () => {
        const mockProducts = [{
            id: '1', name: 'Product 1', slug: 'product-1', price: 100,
            compareAtPrice: null, category: 'Recovery', description: 'Test desc',
            shortDescription: null, imageUrl: '/images/test.jpg', galleryUrls: [],
            badge: 'NEW', isNew: true, inStock: true, features: ['Feature A'],
            sortOrder: 5, isPublished: true, stockQuantity: 50,
            lowStockThreshold: 5, createdAt: new Date(), updatedAt: new Date(),
            weightGrams: 100,
            techSpecs: [{
                molecularFormula: 'C62H98N16O22', molarMass: '1419.5 g/mol',
                researchFocus: 'Angiogenesis', halfLife: '~4-6 Hours', category: 'Healing'
            }],
            coaDocuments: [{
                id: 'coa-1', productName: 'Product 1', batchNumber: 'EVO-001',
                purity: '99.9%', testDate: '2024-01-01', pdfUrl: null
            }],
        }];
        mockFindMany.mockResolvedValue(mockProducts);

        const req = new Request('http://localhost/api/products');
        const res = await GET(req);
        const data = await res.json();
        const product = data[0];

        expect(product.id).toBe('1');
        expect(product.name).toBe('Product 1');
        expect(product.sortOrder).toBeUndefined();
        expect(product.isPublished).toBeUndefined();
        expect(product.stockQuantity).toBeUndefined();
        expect(product.createdAt).toBeUndefined();
        expect(product.weightGrams).toBeUndefined();
    });
});
