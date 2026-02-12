import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST, PATCH, DELETE } from '../../api/admin/products/index';
import { prisma } from '../../src/lib/db';
import { SignJWT } from 'jose';

// Mock prisma
vi.mock('../../src/lib/db', () => ({
    prisma: {
        product: {
            findMany: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
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

describe('Admin Products API', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('GET', () => {
        it('should return 401 if unauthorized', async () => {
            const req = new Request('http://localhost/api/admin/products');
            const res = await GET(req);
            expect(res.status).toBe(401);
        });

        it('should return 403 if not admin', async () => {
            const token = await createToken('user');
            const req = new Request('http://localhost/api/admin/products', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const res = await GET(req);
            expect(res.status).toBe(403);
        });

        it('should return products if admin', async () => {
            const token = await createToken('admin');
            const mockProducts = [{ id: '1', name: 'P1' }];
            (prisma.product.findMany as any).mockResolvedValue(mockProducts);

            const req = new Request('http://localhost/api/admin/products', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const res = await GET(req);
            const data = await res.json();

            expect(res.status).toBe(200);
            expect(data).toEqual(mockProducts);
        });
    });

    describe('POST', () => {
        it('should return 400 for missing required fields', async () => {
            const token = await createToken('admin');
            const req = new Request('http://localhost/api/admin/products', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: 'test' }) // Missing name, price, slug
            });

            const res = await POST(req);
            const data = await res.json();

            expect(res.status).toBe(400);
            expect(data.error).toContain('required');
        });

        it('should create product successfully', async () => {
            const token = await createToken('admin');
            const newProduct = { id: 'p1', name: 'Product 1', slug: 'p1', price: 100 };
            (prisma.product.create as any).mockResolvedValue(newProduct);

            const req = new Request('http://localhost/api/admin/products', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newProduct)
            });

            const res = await POST(req);
            const data = await res.json();

            expect(res.status).toBe(200);
            expect(data.id).toBe('p1');
            expect(prisma.product.create).toHaveBeenCalledWith(expect.objectContaining({
                include: { techSpecs: true }
            }));
        });
    });

    describe('PATCH', () => {
        it('should update product successfully', async () => {
            const token = await createToken('admin');
            const updateData = { id: 'p1', name: 'Updated Name' };
            (prisma.product.update as any).mockResolvedValue({ ...updateData, price: 100 });

            const req = new Request('http://localhost/api/admin/products', {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            });

            const res = await PATCH(req);
            const data = await res.json();

            expect(res.status).toBe(200);
            expect(data.name).toBe('Updated Name');
            expect(prisma.product.update).toHaveBeenCalledWith({
                where: { id: 'p1' },
                data: { name: 'Updated Name' },
                include: { techSpecs: true }
            });
        });

        it('should strip disallowed fields from update payload', async () => {
            const token = await createToken('admin');
            const updatePayload = {
                id: 'p1',
                name: 'Allowed Name',
                role: 'admin', // Disallowed
                passwordHash: 'haxx' // Disallowed
            };
            (prisma.product.update as any).mockResolvedValue({ id: 'p1', name: 'Allowed Name' });

            const req = new Request('http://localhost/api/admin/products', {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatePayload)
            });

            await PATCH(req);

            // Expect update call NOT to contain role or passwordHash
            expect(prisma.product.update).toHaveBeenCalledWith(expect.objectContaining({
                data: {
                    name: 'Allowed Name'
                    // No role, no passwordHash
                }
            }));
        });

        it('should handle techSpecs delete-and-recreate on update', async () => {
            const token = await createToken('admin');
            const payload = {
                id: 'p1',
                techSpecs: [{ molecularFormula: 'C1' }, { molecularFormula: 'C2' }]
            };
            (prisma.product.update as any).mockResolvedValue({ id: 'p1' });

            const req = new Request('http://localhost/api/admin/products', {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(payload)
            });

            await PATCH(req);

            expect(prisma.product.update).toHaveBeenCalledWith(expect.objectContaining({
                data: expect.objectContaining({
                    techSpecs: {
                        deleteMany: {},
                        create: [
                            expect.objectContaining({ molecularFormula: 'C1' }),
                            expect.objectContaining({ molecularFormula: 'C2' })
                        ]
                    }
                })
            }));
        });

        it('should return 500 if product does not exist', async () => {
            const token = await createToken('admin');
            (prisma.product.update as any).mockRejectedValue(new Error('Record not found'));

            const req = new Request('http://localhost/api/admin/products', {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ id: 'non-existent' })
            });

            const res = await PATCH(req);
            expect(res.status).toBe(500);
        });
    });

    describe('DELETE', () => {
        it('should return 400 if no id query param provided', async () => {
            const token = await createToken('admin');
            const req = new Request('http://localhost/api/admin/products', { // No ?id=
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const res = await DELETE(req);
            const data = await res.json();

            expect(res.status).toBe(400);
            expect(data.error).toContain('required');
        });

        it('should delete product successfully', async () => {
            const token = await createToken('admin');
            const req = new Request('http://localhost/api/admin/products?id=p1', {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const res = await DELETE(req);
            const data = await res.json();

            expect(res.status).toBe(200);
            expect(data.success).toBe(true);
            expect(prisma.product.delete).toHaveBeenCalledWith({
                where: { id: 'p1' }
            });
        });
    });
});
