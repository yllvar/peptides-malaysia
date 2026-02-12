import { prisma } from '../../../src/lib/db';

export const config = {
    runtime: 'nodejs',
};
import { jwtVerify } from 'jose';

export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

        try {
            const { payload } = await jwtVerify(token, secret);
            if (payload.role !== 'admin') {
                return Response.json({ error: 'Forbidden' }, { status: 403 });
            }
        } catch (err) {
            return Response.json({ error: 'Invalid token' }, { status: 401 });
        }

        const products = await prisma.product.findMany({
            include: {
                techSpecs: true,
                coaDocuments: true
            },
            orderBy: { sortOrder: 'asc' }
        });

        return Response.json(products);
    } catch (error: any) {
        console.error('Admin Products Fetch Error:', error);
        return Response.json({
            error: 'Internal server error',
            details: error?.message || 'Unknown error'
        }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

        try {
            const { payload } = await jwtVerify(token, secret);
            if (payload.role !== 'admin') {
                return Response.json({ error: 'Forbidden' }, { status: 403 });
            }
        } catch (err) {
            return Response.json({ error: 'Invalid token' }, { status: 401 });
        }

        const data = await request.json();

        // Basic validation
        if (!data.id || !data.name || !data.slug || !data.price) {
            return Response.json({ error: 'ID, Name, Slug, and Price are required' }, { status: 400 });
        }

        const product = await prisma.product.create({
            data: {
                id: data.id,
                name: data.name,
                slug: data.slug,
                price: data.price,
                compareAtPrice: data.compareAtPrice,
                category: data.category,
                description: data.description,
                shortDescription: data.shortDescription,
                imageUrl: data.imageUrl,
                badge: data.badge,
                isNew: data.isNew,
                inStock: data.inStock,
                stockQuantity: data.stockQuantity || 0,
                lowStockThreshold: data.lowStockThreshold || 5,
                isPublished: data.isPublished !== undefined ? data.isPublished : true,
                features: data.features || [],
                sortOrder: data.sortOrder || 0,
                techSpecs: data.techSpecs ? {
                    create: data.techSpecs
                } : undefined
            },
            include: { techSpecs: true }
        });

        return Response.json(product);
    } catch (error: any) {
        console.error('Admin Product Create Error:', error);
        return Response.json({
            error: 'Internal server error',
            details: error?.message || 'Unknown error'
        }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

        try {
            const { payload } = await jwtVerify(token, secret);
            if (payload.role !== 'admin') {
                return Response.json({ error: 'Forbidden' }, { status: 403 });
            }
        } catch (err) {
            return Response.json({ error: 'Invalid token' }, { status: 401 });
        }

        const { id, techSpecs, ...updateData } = await request.json();

        if (!id) {
            return Response.json({ error: 'Product ID is required' }, { status: 400 });
        }

        // Clean updateData to avoid accidental ID updates or other forbidden fields
        const cleanUpdateData: any = {};
        const allowedFields = ['name', 'slug', 'price', 'compareAtPrice', 'category', 'description', 'shortDescription', 'imageUrl', 'badge', 'isNew', 'inStock', 'stockQuantity', 'lowStockThreshold', 'isPublished', 'features', 'sortOrder'];

        allowedFields.forEach(field => {
            if (updateData[field] !== undefined) {
                cleanUpdateData[field] = updateData[field];
            }
        });

        // Handle techSpecs if provided
        if (techSpecs && Array.isArray(techSpecs)) {
            // For simplicity, we'll replace all existing techSpecs with the new ones
            cleanUpdateData.techSpecs = {
                deleteMany: {},
                create: techSpecs.map((spec: any) => ({
                    molecularFormula: spec.molecularFormula || null,
                    molarMass: spec.molarMass || null,
                    researchFocus: spec.researchFocus || null,
                    halfLife: spec.halfLife || null,
                    category: spec.category || null
                }))
            };
        }

        const updatedProduct = await prisma.product.update({
            where: { id },
            data: cleanUpdateData,
            include: { techSpecs: true }
        });

        return Response.json(updatedProduct);
    } catch (error: any) {
        console.error('Admin Product Update Error:', error);
        return Response.json({
            error: 'Internal server error',
            details: error?.message || 'Unknown error'
        }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

        try {
            const { payload } = await jwtVerify(token, secret);
            if (payload.role !== 'admin') {
                return Response.json({ error: 'Forbidden' }, { status: 403 });
            }
        } catch (err) {
            return Response.json({ error: 'Invalid token' }, { status: 401 });
        }

        const url = new URL(request.url);
        const id = url.searchParams.get('id');

        if (!id) {
            return Response.json({ error: 'Product ID is required' }, { status: 400 });
        }

        await prisma.product.delete({
            where: { id }
        });

        return Response.json({ success: true });
    } catch (error: any) {
        console.error('Admin Product Delete Error:', error);
        return Response.json({
            error: 'Internal server error',
            details: error?.message || 'Unknown error'
        }, { status: 500 });
    }
}
