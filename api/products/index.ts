import { prisma } from '../_db.js';

export const config = {
    runtime: 'nodejs',
};

/**
 * Shape the raw Prisma product into a public-safe DTO.
 * Strips internal fields: sortOrder, isPublished, stockQuantity, lowStockThreshold, createdAt, updatedAt.
 */
function toPublicDTO(product: any) {
    return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        category: product.category,
        description: product.description,
        shortDescription: product.shortDescription,
        imageUrl: product.imageUrl,
        galleryUrls: product.galleryUrls,
        badge: product.badge,
        isNew: product.isNew,
        inStock: product.inStock,
        features: product.features,
        techSpecs: product.techSpecs?.map((s: any) => ({
            molecularFormula: s.molecularFormula,
            molarMass: s.molarMass,
            researchFocus: s.researchFocus,
            halfLife: s.halfLife,
            category: s.category,
        })),
        coaDocuments: product.coaDocuments?.map((c: any) => ({
            id: c.id,
            productName: c.productName,
            batchNumber: c.batchNumber,
            purity: c.purity,
            testDate: c.testDate,
            pdfUrl: c.pdfUrl,
        })),
    };
}

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

        const publicProducts = products.map(toPublicDTO);

        return Response.json(publicProducts, {
            status: 200,
            headers: {
                'Cache-Control': 's-maxage=60, stale-while-revalidate=300',
            },
        });
    } catch (error: any) {
        console.error('Failed to fetch products:', error);
        return Response.json({
            error: 'Failed to fetch products',
        }, { status: 500 });
    }
}
