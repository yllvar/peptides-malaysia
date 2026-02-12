import { prisma } from '../../src/lib/db';

export async function GET(request: Request) {
    try {
        const products = await prisma.product.findMany({
            where: { isPublished: true },
            include: {
                techSpecs: true,
                coaDocuments: true,
            },
            orderBy: { sortOrder: 'asc' },
        });
        return Response.json(products);
    } catch (error) {
        console.error('Failed to fetch products:', error);
        return Response.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}
